// src/components/Banner6GW.jsx
import React from 'react';
import PropTypes from 'prop-types';
import bannerImage from '../assets/bannerEstrategia6GW.png';

export function Banner6GW({ onClick }) {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-6">
      <img
        src={bannerImage}
        alt="Estrategia 6GW Plus"
        className="w-full object-contain max-h-[240px]"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6">
        <h1 className="text-4xl font-bold text-white mb-4">
          Estrategia 6GW Plus
        </h1>
        <button
          onClick={onClick}
          className="bg-[#FFC800] text-black px-5 py-1 rounded-md hover:bg-[#e6b000] transition"
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
