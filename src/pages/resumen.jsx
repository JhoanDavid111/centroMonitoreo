// src/pages/Resumen.jsx
import { useNavigate } from 'react-router-dom';

import bannerImage from '../assets/bannerResumenEstrategia6GW.png';
import { ComunidadesResumen } from '../components/ComunidadesResumen';
import { CapacidadHistorica } from '../components/CapacidadHistorica';
import { ResumenCharts } from '../components/ResumenCharts';
import { CapacidadInstalada } from '../components/CapacidadInstalada';
import { GeneracionHoraria } from '../components/GeneracionHoraria';
import MapaCreg075 from '../components/MapaCreg075';
import MapaCreg174 from '../components/MapaCreg174';
import { GeneracionDespacho } from '../components/GeneracionDespacho';
import MapasCreg from '../components/MapasCreg';

import Indicadores6GW from '../components/Indicadores6GW'; // <-- nuevo

export default function Resumen() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6 mt-6">
        <img
          src={bannerImage}
          alt="Estrategia 6GW Plus"
          className="w-full object-cover h-[170px]"
        />
        <div className="absolute inset-0 flex justify-between items-center px-6">
          <h1 className="text-6xl font-semibold text-white mb-4">Estrategia 6GW+</h1>
          {/* El ícono grande lo moví al componente hijo si quieres; si no, déjalo */}
          {/* <img src={GWOff} className="w-24 h-24 flex-shrink-0" /> */}
        </div>
      </div>

      {/* Aquí renderizamos el nuevo componente que maneja su propio fetch */}
      <Indicadores6GW />

      {/* Resto de secciones */}
      <ComunidadesResumen />
      <div className="px-2">
        <CapacidadInstalada />
      </div>
      <ResumenCharts />
      <MapasCreg />
      <GeneracionDespacho />
      <GeneracionHoraria />
    </div>
  );
}


