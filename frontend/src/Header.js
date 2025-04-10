import React, { useState } from 'react';

const Header = ({ loggedInUser, setShowLogin, setShowSignup, handleLogout, showAdminPanel, setShowAdminPanel }) => {
  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between flex-wrap px-4">
        {/* Logo avec effet zoom */}
        <div className="flex-shrink-0">
          <a href="index.html">
            <img src="/logo1.png" alt="Luxury Club" className="h-32 w-auto logo" />
          </a>
        </div>

        {/* Localisation avec effet de survol */}
        <div className="hidden md:flex items-center space-x-2 bg-black bg-opacity-20 p-2 rounded">
          <img src="/localisation.png" alt="Localisation" className="h-5 w-5" />
          <p className="text-sm location-text font-light" onClick={() => window.location.href = 'contact/index.html'}>
            Location de luxe à Paris, Cannes, Miami
          </p>
        </div>

        {/* Téléphone */}
        <div className="hidden md:flex items-center space-x-2 bg-black bg-opacity-20 p-2 rounded">
          <img src="/telephone.png" alt="Téléphone" className="h-5 w-5" />
          <p className="text-sm location-text font-light">
            <a href="tel:+33142662020">01 42 66 20 20</a>
          </p>
        </div>

        {/* Section pour l'authentification */}
        <div className="flex items-center gap-4 space-x-2">
          {loggedInUser ? (
            <>
              <span className="text-white font-semibold bg-black bg-opacity-20 px-3 py-2 rounded">
                👋 Bonjour, {loggedInUser.username} ({loggedInUser.role})
              </span>
              {loggedInUser.role === 'admin' && (
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded transition duration-300 shadow-md"
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                >
                  {showAdminPanel ? 'Fermer Gérer' : 'Gérer'}
                </button>
              )}
              <button className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded transition duration-300 shadow-md" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300 shadow-md" onClick={() => setShowLogin(true)}>
                Se connecter
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-300 shadow-md" onClick={() => setShowSignup(true)}>
                S'inscrire
              </button>
            </>
          )}
        </div>

        {/* Réseaux sociaux avec effet zoom */}
        <div className="flex space-x-4 bg-black bg-opacity-20 p-2 rounded">
          <a href="https://facebook.com/" className="social-icon">
            <img src="/facebook.png" alt="Facebook" className="w-8 h-8 hover:scale-110 transition-transform duration-300" />
          </a>
          <a href="https://www.instagram.com/" className="social-icon">
            <img src="/insta.png" alt="Instagram" className="w-8 h-8 hover:scale-110 transition-transform duration-300" />
          </a>
          <a href="https://www.linkedin.com/company/2064344" className="social-icon">
            <img src="/logo1.png" alt="LinkedIn" className="w-8 h-8 hover:scale-110 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;