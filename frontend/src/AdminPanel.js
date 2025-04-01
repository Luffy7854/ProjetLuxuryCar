import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [reservations, setReservations] = useState([]); // 🆕
  const [newCar, setNewCar] = useState({
    name: '',
    brand: '',
    max_speed: '',
    type: 'route',
    price_per_day: '',
    image: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchCars();
    fetchReservations(); // 🆕
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur chargement utilisateurs :', error);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await axios.get(`${API_URL}/cars`);
      setCars(response.data);
    } catch (error) {
      console.error('Erreur chargement voitures :', error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${API_URL}/reservations`);
      setReservations(response.data);
    } catch (error) {
      console.error('Erreur chargement réservations :', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Erreur suppression utilisateur :', error);
    }
  };

  const handleDeleteCar = async (id) => {
    try {
      await axios.delete(`${API_URL}/cars/${id}`);
      fetchCars();
    } catch (error) {
      console.error('Erreur suppression voiture :', error);
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/cars`, newCar);
      setNewCar({
        name: '',
        brand: '',
        max_speed: '',
        type: 'route',
        price_per_day: '',
        image: '',
      });
      fetchCars();
    } catch (error) {
      console.error('Erreur ajout voiture :', error);
    }
  };

  const handleChange = (e) => {
    setNewCar({ ...newCar, [e.target.name]: e.target.value });
  };

  const handlePromoteToAdmin = async (id) => {
    try {
      await axios.put(`${API_URL}/users/promote/${id}`, { role: 'admin' });
      fetchUsers();
    } catch (error) {
      console.error('Erreur promotion admin :', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🔧 Panneau d'administration</h2>

      {/* Formulaire ajout voiture */}
      <form onSubmit={handleAddCar} className="bg-gray-100 p-4 rounded mb-6">
        <h3 className="text-lg font-semibold mb-2">Ajouter une voiture</h3>
        <input name="name" placeholder="Nom" value={newCar.name} onChange={handleChange} className="border p-2 mb-2 w-full" required />
        <input name="brand" placeholder="Marque" value={newCar.brand} onChange={handleChange} className="border p-2 mb-2 w-full" required />
        <input name="max_speed" placeholder="Vitesse max" value={newCar.max_speed} onChange={handleChange} type="number" className="border p-2 mb-2 w-full" required />
        <select name="type" value={newCar.type} onChange={handleChange} className="border p-2 mb-2 w-full">
          <option value="route">Route</option>
          <option value="circuit">Circuit</option>
        </select>
        <input name="price_per_day" placeholder="Prix par jour (€)" value={newCar.price_per_day} onChange={handleChange} type="number" className="border p-2 mb-2 w-full" required />
        <input name="image" placeholder="Nom de l'image" value={newCar.image} onChange={handleChange} className="border p-2 mb-2 w-full" required />
        <button type="submit" className="bg-green-600 text-white p-2 rounded w-full">Ajouter</button>
      </form>

      {/* Liste utilisateurs */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Utilisateurs</h3>
        {users.length === 0 ? (
          <p className="text-gray-500">Aucun utilisateur.</p>
        ) : (
          <ul>
            {users.map(user => (
              <li key={user.id} className="flex justify-between items-center bg-white p-2 mb-1 border rounded">
                <span>{user.username} ({user.role})</span>
                <div className="flex gap-2">
                  <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
                  {user.role !== 'admin' && (
                    <button onClick={() => handlePromoteToAdmin(user.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">Promouvoir en Admin</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Liste voitures */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Voitures</h3>
        {cars.length === 0 ? (
          <p className="text-gray-500">Aucune voiture.</p>
        ) : (
          <ul>
            {cars.map(car => (
              <li key={car.id} className="flex justify-between items-center bg-white p-2 mb-1 border rounded">
                <span>{car.name} ({car.brand})</span>
                <button onClick={() => handleDeleteCar(car.id)} className="bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 📋 Suivi des réservations */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">📋 Suivi des réservations</h3>
        {reservations.length === 0 ? (
          <p className="text-gray-500">Aucune réservation enregistrée.</p>
        ) : (
          <ul>
            {reservations.map((res) => (
              <li key={res.id} className="bg-white border p-3 mb-2 rounded shadow">
                <p><strong>Utilisateur :</strong> {res.user_name}</p>
                <p><strong>Voiture :</strong> {res.Car?.name} ({res.Car?.brand})</p>
                <p><strong>Du</strong> {res.start_date} <strong>au</strong> {res.end_date}</p>
                <p><strong>Prix total :</strong> {res.total_price} €</p>
                <p><strong>Statut :</strong> {res.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
