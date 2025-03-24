import { useEffect, useState } from 'react';
import {
  getCars,
  getReservations,
  createReservation,
  registerUser,
  loginUser,
} from './api';

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
      alert(`Réservation confirmée pour ${userName}`);
      setUserName('');
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

      {/* Login modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl mb-4">Connexion</h2>
            <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="border p-2 mb-2 w-full" />
            <input type="password" placeholder="Mot de passe" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="border p-2 mb-2 w-full" />
            {loginError && <p className="text-red-500 text-sm mb-2">{loginError}</p>}
            <button onClick={handleLoginSubmit} className="bg-blue-500 text-white p-2 rounded w-full">Se connecter</button>
            <button onClick={() => setShowLogin(false)} className="bg-red-500 text-white p-2 rounded w-full mt-2">Fermer</button>
          </div>
        </div>
      )}

      {/* Register modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl mb-4">Créer un compte</h2>
            <form onSubmit={handleRegisterSubmit}>
              <input type="text" name="username" placeholder="Nom d'utilisateur" value={registerData.username} onChange={handleRegisterChange} className="border p-2 mb-2 w-full" required />
              <input type="email" name="email" placeholder="Email" value={registerData.email} onChange={handleRegisterChange} className="border p-2 mb-2 w-full" required />
              <input type="password" name="password" placeholder="Mot de passe" value={registerData.password} onChange={handleRegisterChange} className="border p-2 mb-2 w-full" required />
              <button type="submit" className="bg-green-500 text-white p-2 rounded w-full mt-2">S'inscrire</button>
            </form>
            <button onClick={() => setShowSignup(false)} className="bg-red-500 text-white p-2 rounded w-full mt-2">Fermer</button>
          </div>
        </div>
      )}

      {/* Liste voitures */}
      <div className="flex flex-wrap p-4 gap-4">
        {cars.map((car) => (
          <div key={car.id} className="border p-4 w-64">
            <img src={car.imageUrl} alt={car.name} className="w-full" />
            <h3 className="font-bold">{car.name}</h3>
            <p>Marque : {car.brand}</p>
            <p>Vitesse max : {car.max_speed} km/h</p>
            <p>Type : {car.type}</p>
            <p>Prix : {car.price_per_day} € / jour</p>
            <button onClick={() => setSelectedCar(car)} className="bg-blue-500 text-white p-2 rounded w-full mt-2">📅 Réserver</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
