// src/pages/ComunidadesEnergeticasReplica.jsx
import React from 'react';
import { Info } from 'lucide-react';
import bannerImg from '../assets/bannerComunidadesEnergeticas.png';
import iconCE from '../assets/svg-icons/ComunidadesEnerg-On.svg';

const updated = '8/5/2025';

// Datos quemados tal cual en la imagen
const CARDS = [
  { title: 'No. de comunidades postuladas', value: '20', icon: iconCE },
  { title: 'No. de comunidades registradas', value: '97', icon: iconCE },
  { title: 'No. de comunidades focalizadas', value: '97', icon: iconCE },
  { title: 'No. de comunidades priorizadas', value: '8', icon: iconCE },
];
// Duplicamos para formar las dos filas que aparecen en la imagen
const ALL_CARDS = [...CARDS, ...CARDS];

export default function ComunidadesEnergeticasReplica() {
  return (
    <div className="min-h-screen bg-[#1d1d1d] text-white">
      {/* Banner con imagen y título */}
      <div className="relative rounded-b-xl overflow-hidden">
        <img
          src={bannerImg}
          alt="Banner Comunidades Energéticas"
          className="h-40 sm:h-52 w-full object-cover"
        />
        {/* Oscurecido sobre la imagen */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Texto y logotipo */}
        <div className="absolute inset-0 flex items-center justify-between px-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Comunidades energéticas
          </h1>
          <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-[#FFC800]">
            <img src={iconCE} alt="Icono Comunidades" className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Total de proyectos */}
      <section className="bg-[#262626] mt-6 mx-4 sm:mx-6 rounded-lg border border-[#3a3a3a]">
        <div className="px-6 py-5 flex items-center justify-center gap-4">
          <p className="text-gray-200 text-lg sm:text-xl font-semibold">Total de proyectos</p>
          <span className="inline-flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full"
              style={{ backgroundColor: '#FFC800' }}
              title="Proyectos"
            >
              <img src={iconCE} alt="Icono Comunidades" className="w-5 h-5" />
            </span>
            <span className="text-4xl sm:text-5xl font-extrabold" style={{ color: '#FFC800' }}>
              125
            </span>
          </span>
        </div>
      </section>

      {/* Tarjetas */}
      <section className="px-4 sm:px-6 mt-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ALL_CARDS.map(({ title, value, icon }, idx) => (
            <div
              key={`${title}-${idx}`}
              className="bg-[#262626] rounded-lg border border-[#3a3a3a] shadow p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded-sm flex items-center justify-center"
                  style={{ backgroundColor: '#FFC800' }}
                >
                  <img src={icon} alt="icono" className="w-4 h-4" />
                </div>
                <span className="text-[16px] text-[#D5D5D5]">{title}</span>
              </div>

              <div className="flex items-center text-white">
                <span className="text-3xl font-bold">{value}</span>
                <Info
                  className="ml-2 w-5 h-5 text-gray-300 bg-neutral-700 rounded p-[2px]"
                  title="Ayuda"
                />
              </div>

              <div className="text-xs text-[#B0B0B0] mt-2">
                Actualizado el: {updated}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

