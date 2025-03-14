import { useEffect, useState } from 'react';
import { getCars, createReservation, getReservations } from './api';

function App() {
  const [cars, setCars] = useState([]);
  const [reservations, setReservations] = useState([]);  // 🆕 Ajouter une nouvelle variable d'état
  const [brand, setBrand] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [userName, setUserName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  // Récupérer les voitures et les réservations
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

  // Gestion de la réservation
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
      fetchReservations();  // 🆕 Actualiser la liste des réservations
    } else {
      alert('❌ Erreur lors de la réservation');
    }
  };

  return (
    <div>
      <h1>🚗 Catalogue des voitures de luxe</h1>
      <h1 className="text-3xl font-bold text-red-500">Test TailwindCSS 🚀</h1>

      {/* 🔍 Filtre par marque */}
      <select value={brand} onChange={(e) => setBrand(e.target.value)}>
        <option value="">Toutes les marques</option>
        <option value="Ferrari">Ferrari</option>
        <option value="Lamborghini">Lamborghini</option>
        <option value="Porsche">Porsche</option>
      </select>

      {/* 🏎️ Liste des voitures */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
        {cars.length > 0 ? (
          cars.map((car) => (
            <div key={car.id} style={{ border: '1px solid #ddd', padding: '10px', width: '250px' }}>
              <img src={`/${car.image}`} alt={car.name} style={{ width: '100%' }} />
              <h3>{car.name}</h3>
              <p>Marque : {car.brand}</p>
              <p>Vitesse Max : {car.max_speed} km/h</p>
              <p>Type : {car.type}</p>
              <p>Prix : {car.price_per_day}€ / jour</p>
              <button onClick={() => setSelectedCar(car)}>📅 Réserver</button>
            </div>
          ))
        ) : (
          <p>Aucune voiture trouvée.</p>
        )}
      </div>

      {/* 📅 Formulaire de réservation */}
      {selectedCar && (
        <div style={{ marginTop: '30px', border: '1px solid #ddd', padding: '20px' }}>
          <h2>📅 Réserver {selectedCar.name}</h2>
          <label>Nom :</label>
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />

          <label>Date de début :</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

          <label>Date de fin :</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

          <p>Total : {totalPrice}€</p>

          <button onClick={handleReserve}>Confirmer la réservation</button>
        </div>
      )}

      {/* 📝 Liste des réservations */}
      <h2>Réservations</h2>
      <div>
        {reservations.length > 0 ? (
          <ul>
            {reservations.map((reservation) => (
              <li key={reservation.id}>
                {reservation.user_name} a réservé {reservation.car_name} du {reservation.start_date} au {reservation.end_date} pour {reservation.total_price}€
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune réservation trouvée.</p>
        )}
      </div>
    </div>
  );
}

export default App;
