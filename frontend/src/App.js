import { useEffect, useState } from 'react';
import Header from './Header';
import CarCarousel from './CarCarousel';
import BrandFilter from './BrandFilter';

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
  const [selectedCity, setSelectedCity] = useState('');

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

  useEffect(() => {
    if (loggedInUser) {
      fetchUserReservations(loggedInUser.username);
    }
  }, [loggedInUser]);

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

    if (selectedCar.type === 'route' && !selectedCity) {
      alert('Veuillez sélectionner une ville.');
      return;
    }

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < now || end < now || end < start) {
      alert('Les dates sont invalides.');
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
      price,
      selectedCity
    );

    if (reservation?.error) {
      alert(reservation.error);
    } else {
      alert(`Réservation confirmée pour ${loggedInUser.username}`);
      setStartDate('');
      setEndDate('');
      setSelectedCity('');
      setSelectedCar(null);
      setTotalPrice(0);
      fetchReservations();
      fetchUserReservations(loggedInUser.username);
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
      'user'
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

  const handleBrandFilterChange = (selectedBrand) => {
    setBrand(selectedBrand);
  };

  return (
    <div className="relative">
      <Header 
        loggedInUser={loggedInUser}
        setShowLogin={setShowLogin}
        setShowSignup={setShowSignup}
        handleLogout={handleLogout}
        showAdminPanel={showAdminPanel}
        setShowAdminPanel={setShowAdminPanel}
      />

      {showAdminPanel && loggedInUser?.role === 'admin' && (
        <div className="p-4 bg-gray-100 rounded shadow-md">
          <AdminPanel />
        </div>
      )}

      <BrandFilter onFilterChange={handleBrandFilterChange} />
      <CarCarousel cars={cars} setSelectedCar={setSelectedCar} />

      {selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-bold text-gray-800">Réserver {selectedCar.name}</h2>
              <span className="text-sm bg-red-600 text-white px-2 py-1 rounded">
                {selectedCar.price_per_day}€/jour
              </span>
            </div>
            <div className="mb-4">
              <img src={selectedCar.imageUrl} alt={selectedCar.name} className="w-full h-40 object-cover rounded mb-4" />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Date de début</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-3 rounded w-full" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Date de fin</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-3 rounded w-full" />
              </div>
              {selectedCar.type === 'route' && (
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Ville</label>
                  <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="border p-3 rounded w-full" required>
                    <option value="">Sélectionner une ville</option>
                    <option value="Paris">Paris</option>
                    <option value="Cannes">Cannes</option>
                    <option value="Miami">Miami</option>
                  </select>
                </div>
              )}
              <button onClick={handleReserve} className="bg-green-600 text-white p-3 w-full rounded-lg">📅 Confirmer la réservation</button>
              <button onClick={() => setSelectedCar(null)} className="bg-gray-200 text-gray-800 p-3 w-full rounded-lg">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Connexion</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input type="email" placeholder="Votre email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="border p-3 rounded w-full" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Mot de passe</label>
                <input type="password" placeholder="Votre mot de passe" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="border p-3 rounded w-full" />
              </div>
              {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
              <button onClick={handleLoginSubmit} className="bg-blue-600 text-white font-bold p-3 w-full rounded-lg">Se connecter</button>
              <button onClick={() => setShowLogin(false)} className="bg-gray-200 text-gray-800 font-bold p-3 w-full rounded-lg mt-2">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Inscription</h2>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Nom d'utilisateur</label>
                <input type="text" name="username" value={registerData.username} onChange={handleRegisterChange} className="border p-3 rounded w-full" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input type="email" name="email" value={registerData.email} onChange={handleRegisterChange} className="border p-3 rounded w-full" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Mot de passe</label>
                <input type="password" name="password" value={registerData.password} onChange={handleRegisterChange} className="border p-3 rounded w-full" required />
              </div>
              <button type="submit" className="bg-green-600 text-white font-bold p-3 w-full rounded-lg">S'inscrire</button>
              <button onClick={() => setShowSignup(false)} type="button" className="bg-gray-200 text-gray-800 font-bold p-3 w-full rounded-lg mt-2">Annuler</button>
            </form>
          </div>
        </div>
      )}

      {loggedInUser && userReservations.length > 0 && (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">📋 Vos réservations</h2>
          <ul className="space-y-2">
            {userReservations.map((res) => (
              <li key={res.id} className="border p-3 rounded shadow">
                <p><strong>Voiture :</strong> {res.Car.name}</p>
                <p><strong>Du</strong> {res.start_date} <strong>au</strong> {res.end_date}</p>
                <p><strong>Prix total :</strong> {res.total_price} €</p>
                {res.Car.type === 'route' && res.city && (
                  <p><strong>Ville :</strong> {res.city}</p>
                )}
                <p><strong>Statut :</strong> {res.status}</p>
                <button onClick={() => handleDeleteReservation(res.id)} className="bg-red-500 text-white px-3 py-1 mt-2 rounded">Supprimer</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
