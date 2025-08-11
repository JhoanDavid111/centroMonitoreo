// src/components/IndicadoresProyectos075.jsx
import { useEffect, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { API } from '../config/api';

// Importa aquí los íconos SVG que correspondan a cada tarjeta
import DemandaOn from '../assets/svg-icons/Demanda-On.svg';

async function fetchIndicadores075() {
  const resp = await fetch(
      `${API}/v1/indicadores/transmision/indicadores_proyectos_075`,
    { method: 'POST' }
  );
  if (!resp.ok) throw new Error('Error al consultar indicadores de proyectos 075');
  return resp.json();
}

const LABEL_MAP = {
  total_proyectos_bd075: {
    label: 'Proyectos aprobados por entrar con FPO a 7 de agosto de 2026',
    icon: DemandaOn,
    value: '145 proyectos (4430 MW)', // Quemado tal como me diste
  },
  total_proyectos_aprobados_bd075: {
    label: 'Solicitudes totales',
    icon: DemandaOn,
    value: '2802', // Quemado tal como me diste
  },
  total_capacidad_instalada_bd075: {
    label: 'Proyectos en operación',
    icon: DemandaOn,
    value: '35 proyectos (2998 MW)', // Quemado tal como me diste
  },
  total_capacidad_instalada_aprobados_bd075: {
    label: 'Proyectos en operación FNCER',
    icon: DemandaOn,
    value: '20 proyectos (1303 MW)', // Quemado tal como me diste
  },
  total_proyectos_curva_s: {
    label: 'Solicitudes aprobadas FNCER por entrar',
    icon: DemandaOn,
    value: '385 solicitudes (16789 MW)', // Quemado tal como me diste
  },
  proyectos_aprobados_no_curva_s: {
    label: 'Proyectos FNCER con FPO vencida',
    icon: DemandaOn,
    value: '83 proyectos (1561 MW)', // Quemado tal como me diste
  },
};

// Orden de las tarjetas (sin incluir el total, que va arriba)
const ORDER = [
  'total_proyectos_aprobados_bd075',
  'total_capacidad_instalada_bd075',
  'total_capacidad_instalada_aprobados_bd075',
  'total_proyectos_curva_s',
  'proyectos_aprobados_no_curva_s',
];

export default function IndicadoresProyectos075() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fecha de actualización
  const updated = new Date().toLocaleDateString('es-CO');

  if (loading) {
    return (
      <div className="px-4 py-6 text-white">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-700 rounded w-1/2 mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-[#262626] p-5 rounded-lg border border-[#666666] shadow">
                <div className="h-6 bg-neutral-700 rounded mb-4" />
                <div className="h-8 bg-neutral-600 rounded mb-2" />
                <div className="h-3 bg-neutral-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 p-6">Error: {error}</div>;
  }

  // Resto de tarjetas
  const cards = ORDER.map(key => ({
    key,
    icon: LABEL_MAP[key].icon,
    label: LABEL_MAP[key].label,
    value: LABEL_MAP[key].value,
  }));

  return (
    <>
      {/* Sección Total de proyectos */}
      <div className="flex flex-row items-center justify-center gap-6 px-4 py-6">

            <p className="text-white text-2xl mr-2">
                Total de proyectos
            </p>
            <p
                className="text-6xl font-semibold"
                style={{ color: '#FFC800', lineHeight: '36px' }}
            >
                {formatCount(totalProyectos)}
            </p>

      </div>

      {/* Tarjetas de indicadores */}
      <div className="px-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(({ key, icon, label, value }) => (
            <div key={key} className="bg-[#262626] p-5 rounded-lg border border-[#666666] shadow">
              <div className="flex items-center mb-2">
                <img src={icon} alt={label} className="w-6 h-6 flex-shrink-0" />
                <span className="ml-2 text-[18px] font-normal leading-[26px] text-[#B0B0B0]">
                  {label}
                </span>
              </div>
              <div className="flex text-white text-2xl font-bold">
                {value} {/* Reducido el tamaño de la fuente de 3xl a 2xl */}
                <HelpCircle
                  className="text-white cursor-pointer hover:text-gray-300 bg-neutral-700 self-center rounded h-6 w-6 p-1 ml-4"
                  title="Ayuda"
                />
              </div>
              <div className="text-xs text-[#B0B0B0] mt-1">
                Actualizado el: {updated}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}





