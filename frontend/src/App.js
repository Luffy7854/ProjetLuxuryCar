import { useEffect, useState } from 'react';
import Header from './Header';
import CarCarousel from './CarCarousel';
import BrandFilter from './BrandFilter'; // Import du nouveau composant

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

  // ✅ Ajout : mise à jour des statuts des réservations utilisateur si connecté
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

  // Gestionnaire pour le changement de filtre de marque
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

      {/* Composant de filtrage par marque */}
      <BrandFilter onFilterChange={handleBrandFilterChange} />

      {/* Carrousel des voitures */}
      <CarCarousel cars={cars} setSelectedCar={setSelectedCar} />

      {/* Modal de réservation */}
      {selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 shadow-2xl transform transition-all animate-fadeIn">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-bold text-gray-800">Réserver {selectedCar.name}</h2>
              <span className="text-sm bg-red-600 text-white px-2 py-1 rounded">
                {selectedCar.price_per_day}€/jour
              </span>
            </div>
            
            <div className="mb-4">
              <img 
                src={selectedCar.imageUrl} 
                alt={selectedCar.name} 
                className="w-full h-40 object-cover rounded mb-4" 
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Date de début</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Date de fin</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              
              <button 
                onClick={handleReserve} 
                className="bg-green-600 hover:bg-green-700 text-white font-bold p-3 w-full rounded-lg transition duration-300 shadow-md flex items-center justify-center gap-2"
              >
                <span>📅 Confirmer la réservation</span>
              </button>
              <button 
                onClick={() => setSelectedCar(null)} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold p-3 w-full rounded-lg transition duration-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 shadow-2xl transform transition-all animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Inscription</h2>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Nom d'utilisateur</label>
                <input 
                  id="username"
                  type="text" 
                  name="username" 
                  placeholder="Votre nom d'utilisateur" 
                  value={registerData.username} 
                  onChange={handleRegisterChange} 
                  className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="regemail">Email</label>
                <input 
                  id="regemail"
                  type="email" 
                  name="email" 
                  placeholder="Votre email" 
                  value={registerData.email} 
                  onChange={handleRegisterChange} 
                  className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="regpassword">Mot de passe</label>
                <input 
                  id="regpassword"
                  type="password" 
                  name="password" 
                  placeholder="Votre mot de passe" 
                  value={registerData.password} 
                  onChange={handleRegisterChange} 
                  className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white font-bold p-3 w-full rounded-lg transition duration-300 shadow-md"
              >
                S'inscrire
              </button>
              <button 
                onClick={() => setShowSignup(false)} 
                type="button" 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold p-3 w-full rounded-lg transition duration-300"
              >
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 shadow-2xl transform transition-all animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Connexion</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                <input 
                  id="email"
                  type="email" 
                  placeholder="Votre email" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Mot de passe</label>
                <input 
                  id="password"
                  type="password" 
                  placeholder="Votre mot de passe" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
              <button 
                onClick={handleLoginSubmit} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 w-full rounded-lg transition duration-300 shadow-md"
              >
                Se connecter
              </button>
              <button 
                onClick={() => setShowLogin(false)} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold p-3 w-full rounded-lg transition duration-300"
              >
                Annuler
              </button>
            </div>
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