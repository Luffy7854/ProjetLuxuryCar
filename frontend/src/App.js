import { useEffect, useState } from 'react';
import {
  getCars,
  getReservations,
  createReservation,
  registerUser,
  loginUser,
  getUserReservations,
} from './api';
import AdminPanel from './AdminPanel';

function App() {
  const [cars, setCars] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [brand, setBrand] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const [loggedInUser, setLoggedInUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
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

  const fetchUserReservations = async (username) => {
    const data = await getUserReservations(username);
    setUserReservations(data);
  };

  const handleReserve = async () => {
    if (!selectedCar || !loggedInUser || !startDate || !endDate) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < now || end < now || end < start) {
      alert('Les dates sont invalides. Veuillez vérifier votre sélection.');
      return;
    }

    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const price = days * selectedCar.price_per_day;

    setTotalPrice(price);

    const reservation = await createReservation(
      loggedInUser.username,
      selectedCar.id,
      startDate,
      endDate,
      price
    );

    if (reservation?.error) {
      alert(reservation.error);
    } else if (reservation) {
      alert(`Réservation confirmée pour ${loggedInUser.username}`);
      setStartDate('');
      setEndDate('');
      setSelectedCar(null);
      setTotalPrice(0);
      fetchReservations();
      fetchUserReservations(loggedInUser.username);
    } else {
      alert('Erreur réservation');
    }
  };

  const handleDeleteReservation = async (id) => {
    if (!window.confirm("Supprimer cette réservation ?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/reservations/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert("Réservation supprimée.");
        fetchUserReservations(loggedInUser.username);
      } else {
        alert("Erreur suppression");
      }
    } catch (error) {
      alert("Erreur serveur");
    }
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const result = await registerUser(
      registerData.username,
      registerData.email,
      registerData.password,
      'user' // rôle fixé
    );
    if (result?.user) {
      alert('Inscription réussie');
      setShowSignup(false);
      setRegisterData({ username: '', email: '', password: '' });
    } else {
      alert('Erreur : ' + (result?.error || 'Inconnue'));
    }
  };

  const handleLoginSubmit = async () => {
    const result = await loginUser(loginEmail, loginPassword);
    if (result?.user) {
      setLoggedInUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
      setShowLogin(false);
      setLoginError('');
      fetchUserReservations(result.user.username);
    } else {
      setLoginError(result?.error || 'Erreur inconnue');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('user');
    setShowAdminPanel(false);
  };

  return (
    <div className="relative">
      <header className="flex justify-between p-4 items-center">
        <h1 className="text-2xl font-bold text-red-500">🚗 Location de voitures 🚀</h1>
        <div className="flex items-center gap-4">
          {loggedInUser ? (
            <>
              <span className="text-gray-800 font-semibold">
                👋 Bonjour, {loggedInUser.username} ({loggedInUser.role})
              </span>
              {loggedInUser.role === 'admin' && (
                <button
                  className="bg-yellow-500 text-white px-3 py-2 rounded"
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                >
                  {showAdminPanel ? 'Fermer Gérer' : 'Gérer'}
                </button>
              )}
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

      {showAdminPanel && loggedInUser?.role === 'admin' && (
        <div className="p-4 bg-gray-100 rounded shadow-md">
          <AdminPanel />
        </div>
      )}

      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl mb-4">Inscription</h2>
            <form onSubmit={handleRegisterSubmit}>
              <input type="text" name="username" placeholder="Nom d'utilisateur" value={registerData.username} onChange={handleRegisterChange} className="border p-2 mb-2 w-full" required />
              <input type="email" name="email" placeholder="Email" value={registerData.email} onChange={handleRegisterChange} className="border p-2 mb-2 w-full" required />
              <input type="password" name="password" placeholder="Mot de passe" value={registerData.password} onChange={handleRegisterChange} className="border p-2 mb-2 w-full" required />
              <button type="submit" className="bg-green-500 text-white p-2 w-full mt-2 rounded">S'inscrire</button>
              <button onClick={() => setShowSignup(false)} type="button" className="bg-red-500 text-white p-2 w-full mt-2 rounded">Annuler</button>
            </form>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl mb-4">Connexion</h2>
            <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="border p-2 mb-2 w-full" />
            <input type="password" placeholder="Mot de passe" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="border p-2 mb-2 w-full" />
            {loginError && <p className="text-red-500">{loginError}</p>}
            <button onClick={handleLoginSubmit} className="bg-blue-500 text-white p-2 w-full mt-2 rounded">Se connecter</button>
            <button onClick={() => setShowLogin(false)} className="bg-red-500 text-white p-2 w-full mt-2 rounded">Annuler</button>
          </div>
        </div>
      )}

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
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 mb-2 w-full" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 mb-2 w-full" />
            <button onClick={handleReserve} className="bg-green-500 text-white p-2 rounded w-full mt-2">Confirmer la réservation</button>
            <button onClick={() => setSelectedCar(null)} className="bg-red-500 text-white p-2 rounded w-full mt-2">Annuler</button>
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
                <p><strong>Voiture :</strong> {res.Car.name}</p>
                <p><strong>Du</strong> {res.start_date} <strong>au</strong> {res.end_date}</p>
                <p><strong>Prix total :</strong> {res.total_price} €</p>
                <p><strong>Statut :</strong> {res.status}</p>
                <button
                  onClick={() => handleDeleteReservation(res.id)}
                  className="bg-red-500 text-white px-3 py-1 mt-2 rounded"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
