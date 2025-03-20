import { useEffect, useState } from 'react';
import { getCars, createReservation, getReservations } from './api';

function App() {
  const [cars, setCars] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [brand, setBrand] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [userName, setUserName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // States pour le formulaire d'inscription
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchCars();
    fetchReservations();
  }, [brand]);

  const fetchCars = async () => {
    const data = await getCars(brand);
    setCars(data);
  };

  const fetchReservations = async () => {
    const data = await getReservations();
    setReservations(data);
  };

  const handleReserve = async () => {
    if (!selectedCar || !userName || !startDate || !endDate) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const price = days * selectedCar.price_per_day;

    setTotalPrice(price);

    const reservation = await createReservation(userName, selectedCar.id, startDate, endDate, price);

    if (reservation) {
      alert(`✅ Réservation confirmée pour ${userName} !`);
      setUserName('');
      setStartDate('');
      setEndDate('');
      setSelectedCar(null);
      setTotalPrice(0);
      fetchReservations();
    } else {
      alert('❌ Erreur lors de la réservation');
    }
  };

  // Gérer la saisie des champs du formulaire d'inscription
  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  // Gérer la soumission du formulaire d'inscription
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();
      if (response.ok) {
        alert('✅ Compte créé avec succès');
        setRegisterData({ username: '', email: '', password: '' });
        setShowSignup(false);
      } else {
        alert('❌ Erreur: ' + data.error);
      }
    } catch (error) {
      console.error('❌ Erreur serveur:', error);
    }
  };

  return (
    <div className="relative">
      <header className="flex justify-between items-center p-4">
        <h1 className="text-3xl font-bold text-red-500">🚗 Catalogue des voitures de luxe 🚀</h1>
        <div className="flex gap-4">
          <button onClick={() => setShowLogin(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
            Se connecter
          </button>
          <button onClick={() => setShowSignup(true)} className="bg-green-500 text-white px-4 py-2 rounded">
            S'inscrire
          </button>
        </div>
      </header>

      {/* Modal Inscription */}
      {showSignup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Créer un compte</h2>
            <form onSubmit={handleRegisterSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Nom d'utilisateur"
                value={registerData.username}
                onChange={handleRegisterChange}
                className="border p-2 mb-2 w-full"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={handleRegisterChange}
                className="border p-2 mb-2 w-full"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={registerData.password}
                onChange={handleRegisterChange}
                className="border p-2 mb-2 w-full"
                required
              />
              <button type="submit" className="bg-green-500 text-white p-2 rounded mt-2 w-full">
                S'inscrire
              </button>
            </form>
            <button className="bg-red-500 text-white p-2 rounded mt-2 w-full" onClick={() => setShowSignup(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Liste des voitures */}
      <div className="flex flex-wrap gap-4 p-4">
        {cars.length > 0 ? (
          cars.map((car) => (
            <div key={car.id} className="border p-4 w-64 shadow-md">
              {/* Utilisation de l'URL de l'image complète */}
              <img src={car.imageUrl} alt={car.name} className="w-full" />
              <h3 className="font-bold">{car.name}</h3>
              <p>Marque : {car.brand}</p>
              <p>Vitesse Max : {car.max_speed} km/h</p>
              <p>Type : {car.type}</p>
              <p>Prix : {car.price_per_day}€ / jour</p>
              <button
                onClick={() => {
                  console.log("Car sélectionnée :", car);
                  setSelectedCar(car);
                }}
                className="bg-blue-500 text-white px-2 py-1 rounded mt-2 w-full"
              >
                📅 Réserver
              </button>
            </div>
          ))
        ) : (
          <p className="p-4">Aucune voiture trouvée.</p>
        )}
      </div>
    </div>
  );
}

export default App;
