// frontend/src/TrackCarouselReservation.js
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination, Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

function TrackCarouselReservation({
  tracks = [], // ✅ correction ici
  circuitCars = [],
  onTrackClick,
  selectedTrack,
  selectedCarId,
  setSelectedCarId,
  onConfirmReservation,
  onCloseTrackModal,
}) {
  const swiperRef = useRef(null);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  const stopAutoplay = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.autoplay.stop();
      setAutoplayEnabled(false);
    }
  };

  return (
    <div className="p-8 relative bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-red-600 border-b-2 border-red-500 pb-2 inline-block mx-auto">
          CIRCUITS EXCLUSIFS
        </h2>

        <button
          className="track-prev text-4xl absolute left-4 top-[50%] transform -translate-y-1/2 z-10 text-gray-800 swiper-button bg-white bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          onClick={stopAutoplay}
        >
          ◀
        </button>
        <button
          className="track-next text-4xl absolute right-4 top-[50%] transform -translate-y-1/2 z-10 text-gray-800 swiper-button bg-white bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          onClick={stopAutoplay}
        >
          ▶
        </button>

        <Swiper
          ref={swiperRef}
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 20,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          spaceBetween={20}
          loop={true}
          autoplay={autoplayEnabled ? { delay: 3000, disableOnInteraction: false } : false}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={{ nextEl: '.track-next', prevEl: '.track-prev' }}
          modules={[FreeMode, Pagination, Navigation, Autoplay, EffectCoverflow]}
          className="mySwiper"
        >
          {tracks.map((circuit) => (
            <SwiperSlide key={circuit.id} className="w-72 md:w-80">
              <div
                onClick={() => onTrackClick(circuit)}
                className="cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl m-2"
              >
                <img src={circuit.imageUrl} alt={circuit.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-xl text-gray-800">{circuit.name}</h3>
                  <p className="text-gray-600">Lieu : {circuit.location}</p>
                  <p className="text-gray-600">Longueur : {circuit.length_km} km</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal de réservation d’un circuit rapide */}
      {selectedTrack && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-xl font-bold text-gray-800">Réserver sur {selectedTrack.name}</h2>
              <button onClick={onCloseTrackModal} className="text-gray-600 hover:text-red-600 font-bold text-lg">✕</button>
            </div>

            <img
              src={selectedTrack.imageUrl}
              alt={selectedTrack.name}
              className="w-full h-40 object-cover rounded mb-4"
            />

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Choisir une voiture (type circuit)</label>
              <select
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded"
              >
                <option value="">-- Sélectionnez une voiture --</option>
                {circuitCars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name} - {car.brand} ({car.max_speed} km/h)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onConfirmReservation}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 w-full rounded transition duration-300"
            >
              📅 Réserver cette voiture
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackCarouselReservation;
