import { useNavigate } from 'react-router-dom'
import {
  Lightbulb,
  RefreshCw,
  Clock6,
  Wind,
  Activity,
  Zap,
  Thermometer,
  MapPin
} from 'lucide-react'
import bannerImage from '../assets/bannerEstrategia6GW.png' // ajusta ruta/nombre si cambiaste
import { ComunidadesResumen } from '../components/ComunidadesResumen'
import { CapacidadHistorica } from '../components/CapacidadHistorica'
import { ResumenCharts } from '../components/ResumenCharts';
import { CapacidadInstalada } from '../components/CapacidadInstalada';
import { DespachoTecnologia } from '../components/DespachoTecnologia';
import { GeneracionHoraria } from '../components/GeneracionHoraria';

export default function Resumen() {
  const navigate = useNavigate()

  // Tus índices originales
  const indices = [
    {
      icon: Lightbulb,
      label: 'Capacidad instalada en operación',
      value: '1363,70 MW',
      updated: '8/5/2025'
    },
    {
      icon: RefreshCw,
      label: 'Capacidad instalada en pruebas',
      value: '716,41 MW',
      updated: '8/5/2025'
    },
    {
      icon: Clock6,
      label: 'MW por entrar en 6 meses por 075',
      value: '547 MW',
      updated: '8/5/2025'
    },
    {
      icon: Wind,
      label: 'FNCER gran escala',
      value: '225,40 MW',
      updated: '8/5/2025'
    },
    {
      icon: Activity,
      label: 'Autogeneración a gran escala (AGGE)',
      value: '177,38 MW',
      updated: '8/5/2025'
    },
    {
      icon: Zap,
      label: 'Generación distribuida (GD)',
      value: '716,41 MW',
      updated: '8/5/2025'
    },
    {
      icon: Thermometer,
      label: 'Autogeneración a pequeña escala (AGPE)',
      value: '547 MW',
      updated: '8/5/2025'
    },
    {
      icon: MapPin,
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
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={bannerImage}
          alt="Estrategia 6GW Plus"
          className="w-full object-contain max-h-[240px]"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-start px-6">
          <h1 className="text-4xl font-bold text-white">
            Estrategia 6GW Plus
          </h1>
        </div>
      </div>

      {/* Total + Botón */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-2 mb-6 space-y-4 md:space-y-0">
        <div>
          <p style={{ color: '#FFC800' }} className="mb-1">
            Capacidad instalada 6GW total:
          </p>
          <p className="text-5xl font-bold text-white">
            {total.toLocaleString('es-CO', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}{' '}
            MW
          </p>
        </div>
        <button
          onClick={() => navigate('/estrategia-6gw')}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Ver seguimiento de proyectos
        </button>
      </div>

      {/* Índices */}
      <div className="px-2">
        <h2 className="text-2xl font-semibold text-gray-200 mb-4">
          Índices 6GW
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {indices.map((card, i) => {
            const Icon = card.icon
            return (
              <div
                key={i}
                className="bg-[#262626] p-5 rounded-lg border border-[#666666] shadow"
              >
                <div className="flex items-center mb-2">
                  <Icon className="text-[#FFC800]" size={20} />
                  <span className="ml-2 text-sm text-gray-300">
                    {card.label}
                  </span>
                </div>
                <div className="text-white text-3xl font-bold">
                  {card.value}
                </div>
                <div className="text-gray-500 text-xs mt-1">
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
      <CapacidadHistorica />
     </div>
      <ResumenCharts />
      <CapacidadInstalada />
      <DespachoTecnologia />
      <GeneracionHoraria />
    </div>
  )
}
