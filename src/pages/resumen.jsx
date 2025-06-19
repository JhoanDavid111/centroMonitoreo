import { useNavigate } from 'react-router-dom'
import bannerImage from '../assets/bannerResumenEstrategia6GW.png' // ajusta ruta/nombre si cambiaste
import { ComunidadesResumen } from '../components/ComunidadesResumen'
import { CapacidadHistorica } from '../components/CapacidadHistorica'
import { ResumenCharts } from '../components/ResumenCharts';
import { CapacidadInstalada } from '../components/CapacidadInstalada';
import { GeneracionHoraria } from '../components/GeneracionHoraria';
import { MapaCreg075 } from '../components/MapaCreg075';
import { MapaCreg174 } from '../components/MapaCreg174';
import { GeneracionDespacho } from '../components/GeneracionDespacho';

/* Iconos SVG  */
import { HelpCircle } from 'lucide-react'
import GWOff from '../assets/svg-icons/6GW-off.svg'
import DemandaOn from '../assets/svg-icons/Demanda-On.svg'
import ProcessOn from '../assets/svg-icons/Process-On.svg'
import Proyecto075On from '../assets/svg-icons/Proyecto075-On.svg'
import EolicaOn from '../assets/svg-icons/Eolica-On.svg'
import HidrologiaOn from '../assets/svg-icons/Hidrologia-On.svg'
import AutogeneracionOn from '../assets/svg-icons/Autogeneracion-On.svg'
import CasaOn from '../assets/svg-icons/Casa-On.svg'
import TerritorioOn from '../assets/svg-icons/Territorio-On.svg'

export default function Resumen() {
  const navigate = useNavigate()

  // Tus índices originales
  const indices = [
    {
      icon: <img src={DemandaOn} alt='Capacidad instalada en operación' className="w-6 h-6 flex-shrink-0"/>,
      label: 'Capacidad instalada en operación',
      value: '1363,70 MW',
      updated: '8/5/2025'
    },
    {
      icon: <img src={ProcessOn} alt='Capacidad instalada en pruebas' className="w-6 h-6 flex-shrink-0"/>,
      label: 'Capacidad instalada en pruebas',
      value: '716,41 MW',
      updated: '8/5/2025'
    },
    {
      icon: <img src={Proyecto075On} alt='MW por entrar en 6 meses por 075' className="w-6 h-6 flex-shrink-0"/>,
      label: 'MW por entrar en 6 meses por 075',
      value: '547 MW',
      updated: '8/5/2025'
    },
    {
      icon: <img src={EolicaOn} alt='FNCER gran escala' className="w-6 h-6 flex-shrink-0"/>,
      label: 'FNCER gran escala',
      value: '225,40 MW',
      updated: '8/5/2025'
    },
    {
      icon: <img src={HidrologiaOn} alt='Autogeneración a gran escala (AGGE)' className="w-6 h-6 flex-shrink-0"/>,
      label: 'Autogeneración a gran escala (AGGE)',
      value: '177,38 MW',
      updated: '8/5/2025'
    },
    {
      icon: <img src={AutogeneracionOn} alt='Generación distribuida (GD)' className="w-6 h-6 flex-shrink-0"/>,
      label: 'Generación distribuida (GD)',
      value: '716,41 MW',
      updated: '8/5/2025'
    },
    {
      icon: <img src={CasaOn} alt='Autogeneración a pequeña escala (AGPE)' className="w-6 h-6 flex-shrink-0"/>,
      label: 'Autogeneración a pequeña escala (AGPE)',
      value: '547 MW',
      updated: '8/5/2025'
    },
    {
      icon: <img src={TerritorioOn} alt='Zonas no interconectadas (ZNI)' className="w-6 h-6 flex-shrink-0"/>,
      label: 'Zonas no interconectadas (ZNI)',
      value: '225,40 MW',
      updated: '8/5/2025'
    }
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
          alt="Estrategia 6GW Plus"
          className="w-full object-cover h-[170px]"
        />
        <div className="absolute inset-0 flex justify-between items-center px-6">
          <h1 className="text-6xl font-semibold text-white mb-4">
            Estrategia 6GW+
          </h1>
          <img src={GWOff} className="w-24 h-24 flex-shrink-0"/>
        </div>
      </div>
      {/* Total + Botón */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 px-4 py-6 text-center md:text-left">
        <div>
          <p style={{ color: '#FFC800' }} className="mb-1 text-2xl">
            Capacidad instalada 6GW+ total:
          </p>
          <p className="text-6xl font-semibold text-white" style={{ lineHeight: '36px' }}>
            {total.toLocaleString('es-CO', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}{' '}
            MW
          </p>
        </div>

        <button
          onClick={() => navigate('/estrategia-6gw')}
          className="bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-200 transition"
        >
          Ver seguimiento de proyectos
        </button>
      </div>

      {/* Índices */}
      <div className="px-2">
        <h2 className="text-2xl font-semibold text-gray-200 mb-4">
          Índices 6GW+
        </h2>
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
                  {card.value}
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
      {/* Sección desplegable de Comunidades y Colombia Solar */}
      <ComunidadesResumen />
      <div className="px-2">
        <CapacidadInstalada />
      </div>
      <ResumenCharts />
      <MapaCreg075 />
      <MapaCreg174 />
      <GeneracionDespacho />
      <GeneracionHoraria />
    </div>
  )
}
