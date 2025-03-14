import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// ✅ Récupérer tous les utilisateurs
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Erreur API:', error);
    return [];
  }
};

// ✅ Créer un nouvel utilisateur
export const createUser = async (name, email) => {
  try {
    const response = await axios.post(`${API_URL}/users`, { name, email });
    return response.data;
  } catch (error) {
    console.error('Erreur API:', error);
    return null;
  }
};

export const getCars = async (brand = '') => {
    try {
      const response = await axios.get(`${API_URL}/cars?brand=${brand}`); // Mettre /cars ici
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des voitures :', error);
      return [];
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

// ✅ Récupérer toutes les réservations
export const getReservations = async () => {
    try {
      const response = await axios.get(`${API_URL}/reservations`);
      return response.data;
    } catch (error) {
      console.error('Erreur API:', error);
      return [];
    }
  };
  