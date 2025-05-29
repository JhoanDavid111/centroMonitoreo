// src/components/Banner6GW.jsx
import React from 'react';
import PropTypes from 'prop-types';
import bannerImage from '../assets/banner6wg.jpg';

export function Banner6GW({ onClick }) {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-6">
      <img
        src={bannerImage}
        alt="Estrategia 6GW Plus"
        className="w-full h-48 md:h-40 object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start px-6">
        <h1 className="text-4xl font-bold text-white mb-4">
          Estrategia 6GW Plus
        </h1>
        <button
          onClick={onClick}
          className="bg-[#FFC800] text-black px-5 py-3 rounded-md hover:bg-[#e6b000] transition"
        >
          Consultar
        </button>
      </div>
    </div>
  );
}

Banner6GW.propTypes = {
  onClick: PropTypes.func,
};
Banner6GW.defaultProps = {
  onClick: () => {},
};
