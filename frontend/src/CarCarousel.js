import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Importez les styles CSS nécessaires
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

// Importez les modules individuellement
import { FreeMode, Pagination, Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';

const CarCarousel = ({ cars, setSelectedCar }) => {
  console.log('Cars:', cars);

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
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 border-b-2 border-red-500 pb-2 inline-block mx-auto">
          NOTRE COLLECTION EXCLUSIVE
        </h2>
        
        {/* Flèches améliorées */}
        <button
          className="swiper-button-prev text-4xl absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-gray-800 swiper-button bg-white bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          onClick={stopAutoplay}
        >
          ◀
        </button>
        <button
          className="swiper-button-next text-4xl absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-gray-800 swiper-button bg-white bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
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
          navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
          modules={[FreeMode, Pagination, Navigation, Autoplay, EffectCoverflow]}
          className="mySwiper"
        >
          {cars.length > 0 ? (
            cars.map((car) => (
              <SwiperSlide key={car.id} className="w-72 md:w-80">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl m-2">
                  <div className="relative">
                    <img src={car.imageUrl} alt={car.name} className="w-full h-48 object-cover" />
                    <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-lg font-bold">
                      {car.type === 'circuit' ? 'CIRCUIT' : 'ROUTE'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-xl text-gray-800">{car.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-gray-600 font-medium">{car.brand}</p>
                      <p className="text-gray-700">{car.max_speed} km/h</p>
                    </div>
                    <div className="mt-4 bg-gray-100 p-2 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{car.price_per_day}€<span className="text-sm text-gray-500">/jour</span></p>
                    </div>
                    <button
                      onClick={() => setSelectedCar(car)}
                      className="bg-gray-800 hover:bg-red-700 text-white px-4 py-3 rounded-lg mt-4 w-full transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <span>📅 Réserver maintenant</span>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <p className="text-center p-10 bg-gray-100 rounded-lg text-gray-500">Aucune voiture disponible pour le moment</p>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default CarCarousel;