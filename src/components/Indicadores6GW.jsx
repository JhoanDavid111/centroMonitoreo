// src/components/Indicadores6GW.jsx
import { useEffect, useMemo, useState } from 'react';
import { HelpCircle } from 'lucide-react';

import GWOff from '../assets/svg-icons/6gw+NewIcon.svg';
import DemandaOn from '../assets/svg-icons/Demanda-On.svg';
import ProcessOn from '../assets/svg-icons/Process-On.svg';
import Proyecto075On from '../assets/svg-icons/Proyecto075-On.svg';
import EolicaOn from '../assets/svg-icons/Eolica-On.svg';
import HidrologiaOn from '../assets/svg-icons/Hidrologia-On.svg';
import AutogeneracionOn from '../assets/svg-icons/Autogeneracion-On.svg';
import CasaOn from '../assets/svg-icons/Casa-On.svg';

const LABEL_MAP = {
  'EN OPERACIÓN': { label: 'Capacidad instalada en operación', icon: DemandaOn },
  'PRUEBAS': { label: 'Capacidad instalada en pruebas', icon: ProcessOn },
  'Capacidad a entrar 075': { label: 'MW por entrar a Julio de 2026', icon: Proyecto075On },
  'FNCER Gran Escala': { label: 'FNCER gran escala', icon: EolicaOn },
  'AGGE': { label: 'Autogeneración a gran escala (AGGE)', icon: HidrologiaOn },
  'Generacion Distribuida': { label: 'Generación distribuida (GD)', icon: AutogeneracionOn },
  'AGPE': { label: 'Autogeneración a pequeña escala (AGPE)', icon: CasaOn },
};

const ORDER = [
  'EN OPERACIÓN',
  'PRUEBAS',
  'Capacidad a entrar 075',
  'FNCER Gran Escala',
  'AGGE',
  'Generacion Distribuida',
  'AGPE',
];

const formatMW = n =>
  n.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

async function fetchIndicadores6GW() {
  const resp = await fetch('http://192.168.8.138:8002/v1/indicadores/6g_proyecto', { method: 'POST' });
  if (!resp.ok) throw new Error('Error al consultar indicadores 6GW+');
  return resp.json();
}

export default function Indicadores6GW() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetchIndicadores6GW();
        if (alive) {
          setData(res);
          setLoading(false);
        }
      } catch (e) {
        if (alive) {
          setError(e.message);
          setLoading(false);
        }
      }
    })();
    return () => { alive = false; };
  }, []);

  const totalMW = useMemo(() => {
    if (!data) return 0;
    const totalItem = data.find(d => d.indicador.toLowerCase().includes('total'));
    if (totalItem) return totalItem.capacidad_mw;

    const op = data.find(d => d.indicador === 'EN OPERACIÓN')?.capacidad_mw || 0;
    const pr = data.find(d => d.indicador === 'PRUEBAS')?.capacidad_mw || 0;
    return op + pr;
  }, [data]);

  const indices = useMemo(() => {
    if (!data) return [];
    const updated = new Date().toLocaleDateString('es-CO');

    return data
      .filter(item => LABEL_MAP[item.indicador])
      .sort((a, b) => ORDER.indexOf(a.indicador) - ORDER.indexOf(b.indicador))
      .map(item => ({
        icon: LABEL_MAP[item.indicador].icon,
        label: LABEL_MAP[item.indicador].label,
        value: item.capacidad_mw,
        updated,
      }));
  }, [data]);

  if (loading) {
    return (
      <div className="px-4 py-6 text-white">
        {/* Skeleton muy simple */}
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-700 rounded w-1/2 mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
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

  if (error) return <div className="text-red-400 p-6">Error: {error}</div>;

  return (
    <>
      {/* Total + botón (igual a como estaba) */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 px-4 py-6 text-center md:text-left">
        <div>
          <p style={{ color: '#FFC800' }} className="mb-1 text-2xl">
            Capacidad instalada 6GW+ total:
          </p>
          <p className="text-6xl font-semibold text-white" style={{ lineHeight: '36px' }}>
            {formatMW(totalMW)} MW
          </p>
        </div>

        <button
          onClick={() => (window.location.href = '/proyectos075')}
          className="bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-200 transition"
        >
          Ver seguimiento de proyectos
        </button>
      </div>

      {/* Índices */}
      <div className="px-2">
        <h2 className="text-2xl text-[#D1D1D0] font-semibold mb-4">Índices 6GW+</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {indices.map((card, i) => (
            <div
              key={i}
              className="bg-[#262626] p-5 rounded-lg border border-[#666666] shadow"
            >
              <div className="flex items-center mb-2">
                <img src={card.icon} alt={card.label} className="w-6 h-6 flex-shrink-0" />
                <span className="ml-2 text-[18px] font-normal leading-[26px] text-[#B0B0B0]">
                  {card.label}
                </span>
              </div>
              <div className="flex text-white text-3xl font-bold">
                {formatMW(card.value)} MW
                <HelpCircle
                  className="text-white cursor-pointer hover:text-gray-300 bg-neutral-700 self-center rounded h-6 w-6 p-1 ml-4"
                  title="Ayuda"
                />
              </div>
              <div className="text-xs text-[#B0B0B0] mt-1">
                Actualizado el: {card.updated}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
