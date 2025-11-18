// src/pages/SeguimientoAmbiental.jsx

import { Suspense } from 'react';

import bannerSeguimientoAmbiental from '../assets/bannerAmbiental6GW.png';
import TramitesAmbientalesPies from '../components/TramitesAmbientalesPies';
import GestionProyectosPriorizados from '../components/GestionProyectosPriorizados';

import {
  Banner,
  BannerAction,
  BannerBackground,
  BannerHeader,
  BannerTitle,
} from '../components/ui/Banner';

import IndicadoresSeguimientoAmbiental from '../components/IndicadoresSeguimientoAmbiental';
import TramitesSolicitadosChart from '../components/TramitesSolicitados';
import EstadoTramites from '../components/EstadoTramites';
import MapaDistribucionDepartamental from '../components/MapaDistribucionDepartamental';
const LoadingFallback = ({ message = 'Cargando...' }) => (
  <div className="bg-[#262626] p-4 rounded-lg border border-gray-700 shadow flex flex-col items-center justify-center h-[260px]">
    <div className="flex space-x-2">
      <div
        className="w-3 h-3 rounded-full animate-bounce"
        style={{
          backgroundColor: 'rgba(255,200,0,1)',
          animationDelay: '0s',
        }}
      />
      <div
        className="w-3 h-3 rounded-full animate-bounce"
        style={{
          backgroundColor: 'rgba(255,200,0,1)',
          animationDelay: '0.2s',
        }}
      />
      <div
        className="w-3 h-3 rounded-full animate-bounce"
        style={{
          backgroundColor: 'rgba(255,200,0,1)',
          animationDelay: '0.4s',
        }}
      />
    </div>
    <p className="text-gray-300 mt-4">{message}</p>
  </div>
);

export default function SeguimientoAmbiental() {
  return (
    <div className="space-y-8">
      {/* Banner superior */}
      <Banner>
        <BannerBackground
          src={bannerSeguimientoAmbiental}
          title="Banner Seguimiento Ambiental"
          alt="Banner Seguimiento Ambiental"
        />
        <BannerHeader>
        <BannerTitle>
            Seguimiento y gestión ambiental
        </BannerTitle>

        <BannerTitle
            style={{
            color: '#FFC400', 
            fontSize: '32px',  
            fontWeight: 600,
            marginTop: '4px',
            lineHeight: 1.2,
            }}
        >
            Minenergía
        </BannerTitle>
        </BannerHeader>
      </Banner>

      {/* Indicadores resumen */}
      <IndicadoresSeguimientoAmbiental />
        <br />
        <br />
      {/* Gráfica de trámites solicitados */}
      <TramitesSolicitadosChart />
        <br />
        <br />
      {/* Gráficas circulares */}
      <TramitesAmbientalesPies />
        <br />
        <br />
      {/* Gráficas de barras proyectos priorizados */}
      <GestionProyectosPriorizados />

        <br />
        <br />
      {/* Gráficas de Estado de tramites */}
      <EstadoTramites />
        <br />
        <br />
      {/* Mapa distribución departamental */}
      <MapaDistribucionDepartamental />

    </div>
  );
}
