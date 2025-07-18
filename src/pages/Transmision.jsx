import { useNavigate } from 'react-router-dom'
import bannerImage from '../assets/bannerCentroMonitoreoTransmision.png' // ajusta ruta/nombre si cambiaste
import { ComunidadesResumen } from '../components/ComunidadesResumen'
import { CapacidadHistorica } from '../components/CapacidadHistorica'
import { ResumenCharts } from '../components/ResumenCharts';
import { CapacidadInstalada } from '../components/CapacidadInstalada';


/* Iconos SVG  */
import { HelpCircle } from 'lucide-react'
import GWOff from '../assets/svg-icons/6gw+NewIcon.svg'
import DemandaOn from '../assets/svg-icons/Demanda-On.svg'
import ProcessOn from '../assets/svg-icons/Process-On.svg'
import Proyecto075On from '../assets/svg-icons/Proyecto075-On.svg'
import AutoGeneracionOn from '../assets/svg-icons/AutoGeneracion-On.svg'

import MapaProyectosTransmision from '../components/MapaProyectosTransmision';

export default function Transmision() {
  const navigate = useNavigate()

  // Tus índices originales
  const indices = [
    {
      icon: <img src={DemandaOn} alt='Proyectos por convocatorias' className="w-6 h-6 flex-shrink-0"/>,
      label: 'Proyectos por convocatorias',
      value: '20',
      updated: '8/5/2025'
    },
    {
      icon: <img src={DemandaOn} alt='Proyectos STR' className="w-6 h-6 flex-shrink-0"/>,
      label: 'Proyectos STR',
      value: '97',
      updated: '8/5/2025'
    },
    {
      icon: <img src={AutoGeneracionOn} alt='Proyectos en proceso de adjudicación' className="w-6 h-6 flex-shrink-0"/>,
      label: 'Proyectos en proceso de adjudicación',
      value: '8',
      updated: '8/5/2025'
    },
    {
      icon: <img src={Proyecto075On} alt='Convocatorias proyectadas' className="w-6 h-6 flex-shrink-0"/>,
      label: 'Convocatorias proyectadas',
      value: '7',
      updated: '8/5/2025'
    },
    {
      icon: <img src={DemandaOn} alt='Numero total de líneas' className="w-6 h-6 flex-shrink-0"/>,
      label: 'Numero total de líneas',
      value: '00',
      updated: '8/5/2025'
    },
    {
      icon: <img src={DemandaOn} alt='Longitud total de líneas' className="w-6 h-6 flex-shrink-0"/>,
      label: 'Longitud total de líneas',
      value: '000',
      updated: '8/5/2025'
    },
    {
      icon: <img src={Proyecto075On} alt='Total de subestaciones' className="w-6 h-6 flex-shrink-0"/>,
      label: 'Total de subestaciones',
      value: '00',
      updated: '8/5/2025'
    },
    
    
  ]

  // Convertir los dos primeros strings a número y sumar
  const parseMW = str =>
    parseFloat(str.replace(/\./g, '').replace(',', '.').replace(' MW', ''))
  const op = parseMW(indices[0].value)
  const pr = parseMW(indices[1].value)
  const total = op + pr

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6 mt-6">
        <img
          src={bannerImage}
          alt="Proyectos de Transmisión"
          className="w-full object-cover h-[170px]"
        />
        <div className="absolute inset-0 flex justify-between items-center px-6">
          <h1 className="text-6xl font-semibold text-white mb-4">
            Proyectos de Transmisión
          </h1>
          <img src={GWOff} className="w-24 h-24 flex-shrink-0"/>
        </div>
      </div>
      {/* Total + Botón */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 px-4 py-6 text-center md:text-left">
        <span className="text-white text-xl md:text-2xl font-semibold mr-4">
      Total de proyectos
    </span>
    <span className="flex items-center">
      <span className="bg-yellow-400 flex items-center justify-center mr-4"
      style={{
        width: 60,
        height: 60,
        borderRadius: 100,
      }}>
        <img
          src="/src/assets/svg-icons/InfraElectrica-Amarillo.svg"
          alt="Infraestructura Eléctrica"
          style={{
          width: 36,
          height: 36,
        }}
        />
      </span>
      <span className="text-yellow-400 font-extrabold"
      style={{
        fontFamily: '"Nunito Sans", sans-serif',
        fontWeight: 800,
        fontSize: '62px',
        lineHeight: '66px',
        textAlign: 'center',
      }}>
        125
      </span>
    </span>
  </div>

      {/* Índices */}
      <div className="px-2">
        {/* <h2 className="text-2xl font-semibold text-gray-200 mb-4">
          Índices 6GW+
        </h2> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {indices.map((card, i) => {
            return (
              <div
                key={i}
                className="bg-[#262626] p-5 rounded-lg border border-[#666666] shadow"
              >
                <div className="flex items-center mb-2">
                  {card.icon}
                  <span className="ml-2 text-[18px] font-normal leading-[26px] text-[#B0B0B0]">
                    {card.label}
                  </span>
                </div>
                <div className="flex text-white text-3xl font-bold">
                  {Number(card.value)}
                  <HelpCircle
                    className="text-white cursor-pointer hover:text-gray-300 bg-neutral-700 self-center rounded h-6 w-6 p-1 ml-4"
                    title="Ayuda"
                  />
                </div>
                <div className="text-xs text-[#B0B0B0] mt-1">
                  Actualizado el: {card.updated}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
          Proyectos de Transmisión en ejecución
        </h2>
      {/* Sección desplegable de Comunidades y Colombia Solar */}
      <ComunidadesResumen />
      <div className="px-2">
        <CapacidadInstalada />
      </div>
      <ResumenCharts />
      <MapaProyectosTransmision />
      
     
    </div>
  )
}
