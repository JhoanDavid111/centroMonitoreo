// src/pages/Transmision.jsx
import { useTransmisionData } from '../components/transmision/hooks/useTransmisionData';
import TotalProyectos from '../components/transmision/TotalProyectos';
import IndicatorCard from '../components/ui/IndicatorCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import ErrorMessage from '../components/ui/ErrorMessage';
import { TRANSMISION_CONFIG } from '../config/transmision';

//componentes especificos de la página
import MapaProyectosTransmision from '../components/MapaProyectosTransmision';
import TransmisionGrid from '../components/transmision/TransmisionGrid';
import CapacidadInstalada from '../components/CapacidadInstalada';
import ResumenCharts from '../components/ResumenCharts';
//import CapacidadHistorica from '../components/CapacidadHistorica';
//import ComunidadesResumen from '../components/ComunidadesResumen';

//Assets
import bannerImage from '../assets/bannerCentroMonitoreoTransmision.png';


/* Iconos */
import InfraElectricaAmarillo from '../assets/svg-icons/InfraElectrica-Amarillo.svg';


import { HelpCircle } from 'lucide-react'
import GWOff from '../assets/svg-icons/6gw+NewIcon.svg'
import DemandaOn from '../assets/svg-icons/Demanda-On.svg'
import ProcessOn from '../assets/svg-icons/Process-On.svg'
import Proyecto075On from '../assets/svg-icons/Proyecto075-On.svg'
import AutoGeneracionOn from '../assets/svg-icons/AutoGeneracion-On.svg'



export default function Transmision() {
  const { data, loading, error } = useTransmisionData();
  const updatedDate = new Date().toLocaleDateString('es-CO');

  if (loading) {
    return (
      <div className="space-y-8">
        <Banner />
        <SkeletonLoader cardCount={7} />
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8">
      <Banner />

      <TotalProyectos total={data.total_proyectos} />

      <div className="px-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {TRANSMISION_CONFIG.indicators.map(( indicator, i ) => (
            

            <IndicatorCard
              key={i}
              icon={<img src={indicator.icon} alt={indicator.label} className="h-6 w-6" />}
              label={indicator.label}
              value={data[indicator.key] || 'N/A'}
              updated={updatedDate}
            />
          ))}
        </div>
      </div>
      {/* <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        Proyectos de Transmisión en ejecución
      </h2> */}

      <TransmisionGrid /> 
     {/*  <div className="px-2">
        <CapacidadInstalada />
      </div>
      <ResumenCharts /> */}
      <MapaProyectosTransmision />

    </div>
  );

}

function Banner() {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 mt-6">
      <img
        src={bannerImage}
        alt="Proyectos de Transmisión"
        className="w-full object-cover h-[170px]"
      />
      <div className="absolute inset-0 flex justify-between items-center px-6">
        <h1 className='text-6xl font-semibold text-white mb-4'>
          Proyectos de Transmisión
        </h1>
        <img src={GWOff} alt="GW Off" className="w-24 h-24 flex-shrink-0" />

      </div>

    </div>
    );
}