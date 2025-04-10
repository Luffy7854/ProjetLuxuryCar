import React, { useState, useEffect } from 'react';

const BrandFilter = ({ onFilterChange }) => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Marques de luxe courantes
  const luxuryBrands = [
    { id: '', name: 'Toutes les marques', logo: '/logo1.png' },
    { id: 'Ferrari', name: 'Ferrari', logo: '/ferrari-logo.png' },
    { id: 'Lamborghini', name: 'Lamborghini', logo: '/lamborghini-logo.png' },
    { id: 'Porsche', name: 'Porsche', logo: '/porsche-logo.png' },
    { id: 'Mercedes', name: 'Mercedes-Benz', logo: '/mercedes-logo.png' },
    { id: 'BMW', name: 'BMW', logo: '/bmw-logo.png' },
    { id: 'Aston Martin', name: 'Aston Martin', logo: '/aston-logo.png' },
    { id: 'Bentley', name: 'Bentley', logo: '/bentley-logo.png' },
    { id: 'Rolls Royce', name: 'Rolls Royce', logo: '/rolls-logo.png' },
  ];

  useEffect(() => {
    // Utilisation des marques prédéfinies
    setBrands(luxuryBrands);
  }, []);

  const handleBrandSelect = (brandId) => {
    setSelectedBrand(brandId);
    onFilterChange(brandId);
    setIsOpen(false);
  };

  return (
    <div className="brand-filter-container max-w-7xl mx-auto px-4 py-6">
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="filter-button flex items-center justify-between w-full md:w-64 p-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg shadow-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 ease-in-out"
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-medium">
              {selectedBrand ? brands.find(b => b.id === selectedBrand)?.name : 'Filtrer par marque'}
            </span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-20 mt-2 w-full md:w-64 bg-white rounded-lg shadow-xl animate-fadeIn overflow-hidden">
            <div className="max-h-60 overflow-y-auto py-1">
              {brands.map((brand) => (
                <div 
                  key={brand.id} 
                  className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${selectedBrand === brand.id ? 'bg-red-50' : ''}`}
                  onClick={() => handleBrandSelect(brand.id)}
                >
                  <div className="w-8 h-8 mr-3 flex-shrink-0 flex items-center justify-center">
                    <img 
                      src={brand.logo || "/logo1.png"} 
                      alt={brand.name} 
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {e.target.src="/logo1.png"}} // Fallback si l'image ne charge pas
                    />
                  </div>
                  <span className={`font-medium ${selectedBrand === brand.id ? 'text-red-600' : 'text-gray-800'}`}>
                    {brand.name}
                  </span>
                  {selectedBrand === brand.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandFilter;