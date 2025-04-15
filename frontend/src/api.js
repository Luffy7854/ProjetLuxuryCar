import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// ✅ Authentification et gestion des utilisateurs
export const registerUser = async (username, email, password, role = 'user') => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, {
      username,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    console.error('Erreur register:', error.response?.data || error.message);
    return { error: error.response?.data?.error || 'Erreur inconnue' };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Erreur login:', error.response?.data || error.message);
    return { error: error.response?.data?.error || 'Erreur inconnue' };
  }
};

// ✅ Récupération des voitures (avec option de filtre par marque)
export const getCars = async (brand = '') => {
  try {
    const response = await axios.get(`${API_URL}/cars?brand=${brand}`);
    return response.data;
  } catch (error) {
    console.error('Erreur chargement voitures:', error);
    return [];
  }
};

// ✅ Récupération des circuits (nouveau)
export const getTracks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tracks`);
    return response.data;
  } catch (error) {
    console.error('Erreur chargement circuits:', error);
    return [];
  }
};

// ✅ Réservations
export const getReservations = async () => {
  try {
    const response = await axios.get(`${API_URL}/reservations`);
    return response.data;
  } catch (error) {
    console.error('Erreur chargement réservations:', error);
    return [];
  }
};

export const getUserReservations = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/reservations/user/${username}`);
    return response.data;
  } catch (error) {
    console.error('Erreur chargement réservations utilisateur:', error);
    return [];
  }
};

export const createReservation = async (username, carId, startDate, endDate, totalPrice, city = null) => {
  try {
    const response = await axios.post(`${API_URL}/reservations`, {
      user_name: username,
      car_id: carId,
      start_date: startDate,
      end_date: endDate,
      total_price: totalPrice,
      city: city || null
    });
    return response.data;
  } catch (error) {
    console.error('Erreur réservation:', error.response?.data?.error || error.message);
    return { error: error.response?.data?.error || 'Erreur inconnue' };
  }
};