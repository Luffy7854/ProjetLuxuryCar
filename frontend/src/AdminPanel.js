import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
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
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    setUsers(response.data);
  };

  const fetchCars = async () => {
    const response = await axios.get(`${API_URL}/cars`);
    setCars(response.data);
  };

  const handleDeleteUser = async (id) => {
    await axios.delete(`${API_URL}/users/${id}`);
    fetchUsers();
  };

  const handleDeleteCar = async (id) => {
    await axios.delete(`${API_URL}/cars/${id}`);
    fetchCars();
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
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
  };

  const handleChange = (e) => {
    setNewCar({ ...newCar, [e.target.name]: e.target.value });
  };

  const handlePromoteToAdmin = async (id) => {
    await axios.put(`${API_URL}/users/promote/${id}`, { role: 'admin' });
    fetchUsers();
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
        <ul>
          {users.map(user => (
            <li key={user.id} className="flex justify-between items-center bg-white p-2 mb-1 border rounded">
              <span>{user.username} ({user.role})</span>
              <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
              {user.role !== 'admin' && (
                <button onClick={() => handlePromoteToAdmin(user.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">Promouvoir en Admin</button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Liste voitures */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Voitures</h3>
        <ul>
          {cars.map(car => (
            <li key={car.id} className="flex justify-between items-center bg-white p-2 mb-1 border rounded">
              <span>{car.name} ({car.brand})</span>
              <button onClick={() => handleDeleteCar(car.id)} className="bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPanel;
