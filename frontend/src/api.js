import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// ✅ Inscription d'un utilisateur
export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, { username, email, password });
    return response.data;
  } catch (error) {
    console.error('❌ Erreur API:', error);
    return null;
  }
};

// ✅ Réserver une voiture
export const createReservation = async (userName, carId, startDate, endDate, totalPrice) => {
  try {
    const response = await axios.post(`${API_URL}/reservations`, {
      user_name: userName,
      car_id: carId,
      start_date: startDate,
      end_date: endDate,
      total_price: totalPrice,
    });
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la réservation :', error);
    return null;
  }
};

// ✅ Récupérer toutes les voitures
export const getCars = async (brand = '') => {
  try {
    const response = await axios.get(`${API_URL}/cars?brand=${brand}`);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur API:', error);
    return [];
  }
};

// ✅ Récupérer toutes les réservations
export const getReservations = async () => {
  try {
    const response = await axios.get(`${API_URL}/reservations`);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur API:', error);
    return [];
  }
};
