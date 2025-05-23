// src/components/Banner6GW.jsx
import React from 'react';
import PropTypes from 'prop-types';
// Ajusta esta ruta al lugar donde guardaste la imagen:
import bannerImage from '../assets/banner6wg.jpg';

export function Banner6GW({ onClick }) {
  return (
    <div className="relative rounded-lg overflow-hidden mb-6">
      <img
        src={bannerImage}
        alt="Estrategia 6GW"
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start px-6">
        <h1 className="text-4xl font-bold text-white mb-3">
          Estrategia 6GW
        </h1>
        <button
          onClick={onClick}
          className="bg-lime-400 text-black px-4 py-2 rounded-md hover:bg-lime-300 transition"
        >
          Consultar
        </button>
      </div>
    </div>
  );
}

Banner6GW.propTypes = {
  onClick: PropTypes.func,  // te permite manejar el click desde el padre
};
Banner6GW.defaultProps = {
  onClick: () => {},       // si no pasas nada simplemente no hace nada
};
