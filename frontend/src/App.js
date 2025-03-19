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

      {/* Modal Connexion */}
      {showLogin && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Se connecter</h2>
            <input type="text" placeholder="Nom d'utilisateur" className="border p-2 mb-2 w-full" />
            <input type="password" placeholder="Mot de passe" className="border p-2 mb-2 w-full" />
            <button className="bg-blue-500 text-white p-2 rounded mt-2 w-full" onClick={() => setShowLogin(false)}>
              Se connecter
            </button>
            <button className="bg-red-500 text-white p-2 rounded mt-2 w-full" onClick={() => setShowLogin(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modal Inscription */}
      {showSignup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Créer un compte</h2>
            <input type="text" placeholder="Nom d'utilisateur" className="border p-2 mb-2 w-full" />
            <input type="email" placeholder="Email" className="border p-2 mb-2 w-full" />
            <input type="password" placeholder="Mot de passe" className="border p-2 mb-2 w-full" />
            <button className="bg-green-500 text-white p-2 rounded mt-2 w-full" onClick={() => setShowSignup(false)}>
              S'inscrire
            </button>
            <button className="bg-red-500 text-white p-2 rounded mt-2 w-full" onClick={() => setShowSignup(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Filtre */}
      <div className="p-4">
        <select value={brand} onChange={(e) => setBrand(e.target.value)} className="border p-2">
          <option value="">Toutes les marques</option>
          <option value="Ferrari">Ferrari</option>
          <option value="Lamborghini">Lamborghini</option>
          <option value="Porsche">Porsche</option>
        </select>
      </div>

      {/* Liste des voitures */}
      <div className="flex flex-wrap gap-4 p-4">
        {cars.length > 0 ? (
          cars.map((car) => (
            <div key={car.id} className="border p-4 w-64 shadow-md">
              <img src={`/${car.image}`} alt={car.name} className="w-full" />
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

      {/* Formulaire de réservation */}
      {selectedCar && (
        <div className="border p-4 mt-4">
          <h2 className="text-lg font-bold">📅 Réserver {selectedCar.name}</h2>
          <label className="block">Nom :</label>
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="border p-2 w-full" />
          <label className="block">Date de début :</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 w-full" />
          <label className="block">Date de fin :</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 w-full" />
          <p className="font-bold mt-2">Total : {totalPrice}€</p>
          <button onClick={handleReserve} className="bg-green-500 text-white p-2 rounded w-full mt-2">
            Confirmer la réservation
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
