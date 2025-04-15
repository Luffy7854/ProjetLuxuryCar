// frontend/src/TrackCarousel.js
import React from 'react';

function TrackCarousel({ circuits }) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-red-600">🏁 CIRCUITS EXCLUSIFS 🏁</h2>
      <div className="flex overflow-x-auto gap-4">
        {circuits.map((circuit) => (
          <div key={circuit.id} className="border p-4 w-64 flex-shrink-0 shadow-lg rounded">
            <img src={circuit.imageUrl} alt={circuit.name} className="w-full h-36 object-cover rounded" />
            <h3 className="font-bold mt-2">{circuit.name}</h3>
            <p>Lieu : {circuit.location}</p>
            <p>Longueur : {circuit.length_km} km</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrackCarousel;
