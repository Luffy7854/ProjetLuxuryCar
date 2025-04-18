import { useEffect, useState } from 'react';
import Header from './Header';
import CarCarousel from './CarCarousel';
import BrandFilter from './BrandFilter';
import TrackCarouselReservation from './TrackCarouselReservation';
import AdminPanel from './AdminPanel';
import StripePaymentModal from './StripePaymentModal'; // ✅ Modal de paiement Stripe

import {
  getCars,
  getReservations,
  createReservation,
  registerUser,
  loginUser,
  getUserReservations,
  getTracks,
} from './api';

function App() {
  // 📌 États principaux
  const [cars, setCars] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [brand, setBrand] = useState('');
  const [isRefreshingReservations, setIsRefreshingReservations] = useState(false);

  // 📌 États pour réservation
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedCircuitCarId, setSelectedCircuitCarId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedCity, setSelectedCity] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [hasConfirmedReservation, setHasConfirmedReservation] = useState(false);


  // 📌 Stripe et paiement
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [reservationToConfirm, setReservationToConfirm] = useState(null);

  // 📌 États utilisateurs
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // 📌 Chargement initial
  useEffect(() => {
    fetchCars();
    fetchTracks();
    fetchReservations();
  }, [brand]);

  useEffect(() => {
    if (loggedInUser) {
      fetchUserReservations(loggedInUser.username);
    }
  }, [loggedInUser]);

  // 📌 Après redirection Stripe (/success), récupérer la réservation depuis localStorage
  useEffect(() => {
    if (window.location.pathname === '/success') {
      const storedReservation = localStorage.getItem('reservationToConfirm');
      if (storedReservation) {
        const parsedReservation = JSON.parse(storedReservation);
        console.log('✅ Reservation récupérée depuis localStorage :', parsedReservation);
        setReservationToConfirm(parsedReservation);
      }
    }
  }, []);

  useEffect(() => {
    if (
      window.location.pathname === '/success' &&
      cars.length > 0 &&
      reservationToConfirm &&
      !hasConfirmedReservation
    ) {
      console.log('✅ Retour de Stripe : Confirmation de la réservation...');
      confirmReservationAfterPayment();
      setHasConfirmedReservation(true); // ✅ Empêche une 2e réservation
      setPaymentSuccess(true);
  
      setTimeout(() => {
        window.history.replaceState(null, '', 'http://localhost:3000/');
      }, 1500);
    }
  }, [cars, reservationToConfirm, hasConfirmedReservation]);
  

  // 📌 Fonctions API
  const fetchCars = async () => {
    const data = await getCars(brand);
    setCars(data);
  };

  const fetchTracks = async () => {
    const data = await getTracks();
    setTracks(data);
  };

  const fetchReservations = async () => {
    const data = await getReservations();
    setReservations(data);
  };

  const fetchUserReservations = async (username) => {
    try {
      setIsRefreshingReservations(true);
      const data = await getUserReservations(username);
      setUserReservations(data);
    } catch (error) {
      console.error('Erreur récupération réservations utilisateur:', error);
    } finally {
      setIsRefreshingReservations(false);
    }
  };

  // 📌 Préparation réservation avant Stripe
  const handlePrepareReservation = async () => {
    if (!selectedCar || !loggedInUser || !startDate || !endDate) {
      alert('Veuillez remplir tous les champs');
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

    setReservationToConfirm({
      type: 'car',
      item: selectedCar,
      startDate,
      endDate,
      price,
      city: selectedCar.type === 'route' ? selectedCity : null,
    });
    setShowStripeModal(true);
  };

  const handlePrepareCircuitReservation = async () => {
    if (!selectedCircuitCarId || !startDate || !endDate || !loggedInUser) {
      alert('Tous les champs sont requis');
      return;
    }
    const selectedCircuitCar = cars.find((car) => car.id === parseInt(selectedCircuitCarId));
    if (!selectedCircuitCar) {
      alert('Voiture introuvable');
      return;
    }
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start < now || end < now || end < start) {
      alert('Dates invalides');
      return;
    }
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const price = days * selectedCircuitCar.price_per_day;
    setTotalPrice(price);

    setReservationToConfirm({
      type: 'circuit',
      item: selectedCircuitCar,
      startDate,
      endDate,
      price,
    });
    setShowStripeModal(true);
  };

  const confirmReservationAfterPayment = async () => {
    if (!reservationToConfirm) return;
    try {
      console.log('✅ Utilisateur connecté au moment du paiement :', loggedInUser);
      const { item, startDate, endDate, price, city } = reservationToConfirm;
      const reservation = await createReservation(
        loggedInUser.username,
        item.id,
        startDate,
        endDate,
        price,
        city || null
      );
      if (reservation?.error) {
        alert(reservation.error);
      } else {
        alert('Réservation confirmée avec paiement simulé ✅');
        setSelectedCar(null);
        setSelectedTrack(null);
        setStartDate('');
        setEndDate('');
        setSelectedCircuitCarId('');
        setSelectedCity('');
        fetchReservations();
        fetchUserReservations(loggedInUser.username);
      }
    } catch (error) {
      console.error('Erreur paiement/réservation:', error);
      alert('Erreur lors de la réservation');
    }
  };

  const handleDeleteReservation = async (id) => {
    if (!window.confirm('Supprimer cette réservation ?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/reservations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Réservation supprimée.');
        fetchUserReservations(loggedInUser.username);
      } else {
        alert('Erreur suppression');
      }
    } catch {
      alert('Erreur serveur');
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

// 📋 ---------- RENDU VISUEL ----------
return (
  <div className="relative">
    {/* ✅ Notification paiement Stripe */}
    {paymentSuccess && (
      <div className="bg-green-500 text-white p-4 text-center font-bold">
        ✅ Merci pour votre paiement !
      </div>
    )}

    {/* ✅ Header */}
    <Header
      loggedInUser={loggedInUser}
      setShowLogin={setShowLogin}
      setShowSignup={setShowSignup}
      handleLogout={handleLogout}
      showAdminPanel={showAdminPanel}
      setShowAdminPanel={setShowAdminPanel}
    />

    {/* ✅ Admin Panel */}
    {showAdminPanel && loggedInUser?.role === 'admin' && (
      <div className="p-4 bg-gray-100 rounded shadow-md">
        <AdminPanel />
      </div>
    )}

    {/* ✅ Filtres marques */}
    <BrandFilter onFilterChange={handleBrandFilterChange} />

    {/* ✅ Carousel voitures */}
    <CarCarousel cars={cars} setSelectedCar={setSelectedCar} />

    {/* ✅ Carousel circuits */}
    <TrackCarouselReservation tracks={tracks} onTrackClick={setSelectedTrack} />

    {/* ✅ Modal réservation voiture */}
    {selectedCar && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded w-96">
          <h2 className="text-xl font-bold mb-4">Réserver {selectedCar.name}</h2>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 mb-2 w-full" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 mb-2 w-full" />
          {selectedCar.type === 'route' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Choisir la ville de réservation</label>
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="border p-2 mb-2 w-full" required>
                <option value="">-- Sélectionner une ville --</option>
                <option value="Paris">Paris</option>
                <option value="Cannes">Cannes</option>
                <option value="Miami">Miami</option>
              </select>
            </div>
          )}
          <button onClick={handlePrepareReservation} className="bg-green-500 text-white p-2 w-full mt-2 rounded">
            Confirmer la réservation
          </button>
          <button onClick={() => setSelectedCar(null)} className="bg-red-500 text-white p-2 w-full mt-2 rounded">
            Annuler
          </button>
        </div>
      </div>
    )}

    {/* ✅ Modal réservation circuit */}
    {selectedTrack && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded w-96">
          <h2 className="text-xl font-bold mb-4 text-center">🏁 Réserver sur {selectedTrack.name}</h2>
          <img src={selectedTrack.imageUrl} alt={selectedTrack.name} className="w-full h-40 object-cover rounded mb-4" />
          <select value={selectedCircuitCarId} onChange={(e) => setSelectedCircuitCarId(e.target.value)} className="border p-2 mb-2 w-full">
            <option value="">Choisir une voiture de type circuit</option>
            {cars.filter((car) => car.type === 'circuit').map((car) => (
              <option key={car.id} value={car.id}>
                {car.name} - {car.price_per_day}€/jour
              </option>
            ))}
          </select>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 mb-2 w-full" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 mb-2 w-full" />
          <button onClick={handlePrepareCircuitReservation} className="bg-green-500 text-white p-2 w-full mt-2 rounded">
            Confirmer la réservation
          </button>
          <button onClick={() => setSelectedTrack(null)} className="bg-red-500 text-white p-2 w-full mt-2 rounded">
            Annuler
          </button>
        </div>
      </div>
    )}

    {/* ✅ Modal Stripe */}
    {showStripeModal && reservationToConfirm && (
      <StripePaymentModal
        reservation={reservationToConfirm}
        onClose={() => setShowStripeModal(false)}
        onSuccess={confirmReservationAfterPayment}
      />
    )}

    {/* ✅ Vos réservations */}
    {loggedInUser && (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">📋 Vos réservations</h2>
          <button
            onClick={() => fetchUserReservations(loggedInUser.username)}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            disabled={isRefreshingReservations}
          >
            {isRefreshingReservations ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : (
              <>🔄 Rafraîchir</>
            )}
          </button>
        </div>

        {userReservations.length === 0 ? (
          <p className="text-gray-500">Aucune réservation pour le moment.</p>
        ) : (
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
                <button
                  onClick={() => handleDeleteReservation(res.id)}
                  className="bg-red-500 text-white px-3 py-1 mt-2 rounded"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )}

    {/* ✅ Modal Inscription */}
    {showSignup && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg w-96 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Inscription</h2>
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <input type="text" name="username" placeholder="Nom d'utilisateur" value={registerData.username} onChange={handleRegisterChange} className="border p-2 mb-2 w-full" required />
            <input type="email" name="email" placeholder="Email" value={registerData.email} onChange={handleRegisterChange} className="border p-2 mb-2 w-full" required />
            <input type="password" name="password" placeholder="Mot de passe" value={registerData.password} onChange={handleRegisterChange} className="border p-2 mb-2 w-full" required />
            <button type="submit" className="bg-green-500 text-white p-2 w-full rounded">S'inscrire</button>
            <button onClick={() => setShowSignup(false)} type="button" className="bg-red-500 text-white p-2 w-full rounded mt-2">Annuler</button>
          </form>
        </div>
      </div>
    )}

    {/* ✅ Modal Connexion */}
    {showLogin && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg w-96 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Connexion</h2>
          <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="border p-2 mb-2 w-full" />
          <input type="password" placeholder="Mot de passe" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="border p-2 mb-2 w-full" />
          {loginError && <p className="text-red-500">{loginError}</p>}
          <button onClick={handleLoginSubmit} className="bg-blue-500 text-white p-2 w-full rounded mt-2">Se connecter</button>
          <button onClick={() => setShowLogin(false)} className="bg-red-500 text-white p-2 w-full rounded mt-2">Annuler</button>
        </div>
      </div>
    )}
  </div>
);
}

export default App;
