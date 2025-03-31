import { useEffect, useState } from 'react';
import {
  getCars,
  getReservations,
  createReservation,
  registerUser,
  loginUser,
} from './api';
import { getUserReservations } from './api';

function App() {
  const [cars, setCars] = useState([]);
  const [reservations, setReservations] = useState([]); // Réservations globales
  const [userReservations, setUserReservations] = useState([]); // Réservations de l'utilisateur connecté
  const [brand, setBrand] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('user') || null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });

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
    if (!selectedCar || !loggedInUser || !startDate || !endDate) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const price = days * selectedCar.price_per_day;

    setTotalPrice(price);

    const reservation = await createReservation(loggedInUser, selectedCar.id, startDate, endDate, price);

    if (reservation?.error) {
      alert(reservation.error); // Affiche le message retourné par l’API (ex: chevauchement)
    } else if (reservation) {
      alert(`Réservation confirmée pour ${loggedInUser}`);
      setStartDate('');
      setEndDate('');
      setSelectedCar(null);
      setTotalPrice(0);
      fetchReservations();
    } else {
      alert('Erreur réservation');
    }
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const result = await registerUser(registerData.username, registerData.email, registerData.password);
    if (result?.user) {
      alert('Inscription réussie');
      setShowSignup(false);
    } else {
      alert('Erreur : ' + (result?.error || 'Inconnue'));
    }
  };

  const handleLoginSubmit = async () => {
    const result = await loginUser(loginEmail, loginPassword);
    if (result?.user) {
      setLoggedInUser(result.user.username);
      localStorage.setItem('user', result.user.username);
      setShowLogin(false);
      setLoginError('');
    } else {
      setLoginError(result?.error || 'Erreur inconnue');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    if (loggedInUser) {
      fetchUserReservations(loggedInUser);
    }
  }, [loggedInUser]);

  const fetchUserReservations = async (username) => {
    const data = await getUserReservations(username);
    setUserReservations(data); // Met à jour uniquement les réservations de l'utilisateur connecté
  };

  return (
    <div className="relative">
      <header className="flex justify-between p-4 items-center">
        <h1 className="text-2xl font-bold text-red-500">🚗 Location de voitures 🚀</h1>
        <div className="flex items-center gap-4">
          {loggedInUser ? (
            <>
              <span className="text-gray-800 font-semibold">👋 Bonjour, {loggedInUser}</span>
              <button className="bg-gray-700 text-white px-3 py-2 rounded" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowLogin(true)}>
                Se connecter
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setShowSignup(true)}>
                S'inscrire
              </button>
            </>
          )}
        </div>
      </header>

      {/* Liste des voitures */}
      <div className="flex flex-wrap p-4 gap-4">
        {cars.map((car) => (
          <div key={car.id} className="border p-4 w-64">
            <img src={car.imageUrl} alt={car.name} className="w-full" />
            <h3 className="font-bold">{car.name}</h3>
            <p>Marque : {car.brand}</p>
            <p>Vitesse max : {car.max_speed} km/h</p>
            <p>Type : {car.type}</p>
            <p>Prix : {car.price_per_day} € / jour</p>
            <button
              onClick={() => setSelectedCar(car)}
              className="bg-blue-500 text-white p-2 rounded w-full mt-2"
            >
              📅 Réserver
            </button>
          </div>
        ))}
      </div>

      {/* Modal de réservation */}
      {selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Réserver {selectedCar.name}</h2>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 mb-2 w-full"
            />
            <button onClick={handleReserve} className="bg-green-500 text-white p-2 rounded w-full mt-2">
              Confirmer la réservation
            </button>
            <button
              onClick={() => setSelectedCar(null)}
              className="bg-red-500 text-white p-2 rounded w-full mt-2"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Vos réservations */}
      {loggedInUser && userReservations.length > 0 && (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">📋 Vos réservations</h2>
          <ul className="space-y-2">
            {userReservations.map((res) => (
              <li key={res.id} className="border p-3 rounded shadow">
                <p>
                  <strong>Voiture :</strong> {res.Car.name}
                </p>
                <p>
                  <strong>Du</strong> {res.start_date} <strong>au</strong> {res.end_date}
                </p>
                <p>
                  <strong>Prix total :</strong> {res.total_price} €
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
