import React from 'react';
import axios from 'axios';

function StripePaymentModal({ reservation, onClose, onSuccess }) {
  // ✅ Vérification : si pas de reservation ou pas de prix => erreur affichée proprement
  if (!reservation || !reservation.price) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg w-96 shadow-2xl text-center">
          <h2 className="text-xl font-bold mb-4">Erreur de réservation</h2>
          <p className="mb-4">Aucune information de paiement disponible.</p>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 w-full rounded transition duration-300"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  // ✅ Fonction pour lancer le paiement Stripe
  const handlePayment = async () => {
    try {
      // ✅ Stocke la réservation dans le localStorage avant redirection (utile après retour Stripe)
      localStorage.setItem('reservationToConfirm', JSON.stringify(reservation));

      const response = await axios.post('http://localhost:5000/api/reservations/create-checkout-session', {
        amount: Math.round(reservation.price * 100), // Stripe veut un montant en centimes (€ -> cts)
      });

      if (response.data?.url) {
        window.location.href = response.data.url; // ✅ Redirige vers Stripe Checkout
      } else {
        throw new Error('URL de redirection Stripe manquante.');
      }
    } catch (error) {
      console.error('Erreur paiement Stripe :', error);
      alert('Erreur lors de la création de la session de paiement.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-96 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Paiement</h2>

        <p className="text-lg mb-4 text-center">
          Montant à payer : <strong>{reservation.price.toFixed(2)} €</strong>
        </p>

        <button
          onClick={handlePayment}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 w-full rounded transition duration-300 mb-4"
        >
          💳 Payer maintenant
        </button>

        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 w-full rounded transition duration-300"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

export default StripePaymentModal;
