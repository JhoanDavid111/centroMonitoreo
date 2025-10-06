// src/components/IndicadoresProyectos075.jsx
import { useEffect, useState } from 'react';
import { HelpCircle } from 'lucide-react';

// Íconos
import DemandaOn from '../assets/svg-icons/Demanda-On.svg';
import EnergiaAmarillo     from '../assets/svg-icons/Energia-Amarillo.svg';
import EnergiaElectricaOn  from '../assets/svg-icons/EnergiaElectrica-On.svg';
import Proyecto075On       from '../assets/svg-icons/Proyecto075-On.svg';
import OfertaDemandaOn     from '../assets/svg-icons/OfertaDemanda-On.svg';
import MinusDarkOn         from '../assets/svg-icons/minusDark-On.svg';
import { API } from '../config/api';

// Texto base (labels e iconos se conservan; los valores ahora vienen del API)
const LABEL_MAP = {
  total_proyectos_bd075: {
    label: 'Proyectos aprobados por entrar con FPO a 7 de agosto de 2026 =',
    icon: EnergiaAmarillo,
    value: '', // se completa con API: "<n> proyectos (<mw> MW)"
  },
  total_proyectos_aprobados_bd075: {
    label: 'Solicitudes totales',
    icon: Proyecto075On,
    value: '', // API: total_solicitudes
  },
  total_capacidad_instalada_bd075: {
    label: 'Proyectos en operación',
    icon: EnergiaElectricaOn,
    value: '', // API: "total_proyectos_operacion  (capacidad_proyectos_operacion_mw MW)"
  },
  total_capacidad_instalada_aprobados_bd075: {
    label: 'Proyectos en operación FNCER',
    icon: EnergiaElectricaOn,
    value: '', // API: "total_proyectos_operacion_fncer  (capacidad_proyectos_operacion_fncer_mw MW)"
  },
  total_proyectos_curva_s: {
    label: 'Solicitudes aprobadas FNCER por entrar',
    icon: OfertaDemandaOn,
    value: '', // API: "total_solicitudes_aprobadas (capacidad_solicitudes_aprobadas_mw MW)"
  },
  proyectos_aprobados_no_curva_s: {
    label: 'Proyectos FNCER con FPO vencida',
    icon: MinusDarkOn,
    value: '', // API: "total_fncer_vencidos  (capacidad_fncer_vencidos_mw MW)"
  },
};

// Orden de tarjetas
const ORDER = [
  'total_proyectos_aprobados_bd075',
  'total_capacidad_instalada_bd075',
  'total_capacidad_instalada_aprobados_bd075',
  'total_proyectos_curva_s',
  'proyectos_aprobados_no_curva_s',
];

// Helpers
function cleanSubtitle(raw) {
  return String(raw || '').replace(/\s*=\s*$/, '');
}
const nf0 = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });
const nf2 = new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const fmtMW = (mw) => nf2.format(mw ?? 0);

export default function IndicadoresProyectos075() {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [labels, setLabels]   = useState(LABEL_MAP);
  const [updated, setUpdated] = useState(new Date().toLocaleDateString('es-CO'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

    const res = await fetch(
      `${API}/v1/indicadores/proyectos_075/indicadores_proyectos_075`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // No body requerido
      }
    );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        // Mapear respuesta a los valores de la UI (sin cambiar estilos ni textos)
        const next = { ...LABEL_MAP };

        // Hero: "n proyectos (mw MW)"
        const nAprobEntrar = data.total_proyectos_aprobados_a_entrar_agosto_2026 ?? 0;
        const mwAprobEntrar = data.capacidad_proyectos_aprobados_a_entrar_agosto_2026 ?? 0;
        next.total_proyectos_bd075.value = `${nf0.format(nAprobEntrar)} proyectos (${fmtMW(mwAprobEntrar)} MW)`;

        // Solicitudes totales
        next.total_proyectos_aprobados_bd075.value = `${nf0.format(data.total_solicitudes ?? 0)}`;

        // Proyectos en operación
        next.total_capacidad_instalada_bd075.value = `${nf0.format(data.total_proyectos_operacion ?? 0)}  (${fmtMW(data.capacidad_proyectos_operacion_mw ?? 0)} MW)`;

        // Proyectos en operación FNCER
        next.total_capacidad_instalada_aprobados_bd075.value = `${nf0.format(data.total_proyectos_operacion_fncer ?? 0)} (${fmtMW(data.capacidad_proyectos_operacion_fncer_mw ?? 0)} MW)`;

        // Solicitudes aprobadas FNCER por entrar
        next.total_proyectos_curva_s.value = `${nf0.format(data.total_solicitudes_aprobadas ?? 0)} (${fmtMW(data.capacidad_solicitudes_aprobadas_mw ?? 0)} MW)`;

        // Proyectos FNCER con FPO vencida
        next.proyectos_aprobados_no_curva_s.value = `${nf0.format(data.total_fncer_vencidos ?? 0)}  (${fmtMW(data.capacidad_fncer_vencidos_mw ?? 0)} MW)`;

        setLabels(next);
        setUpdated(new Date().toLocaleDateString('es-CO'));
      } catch (e) {
        setError(`No fue posible cargar los indicadores. ${e?.message ?? ''}`.trim());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroSubtitle = cleanSubtitle(labels.total_proyectos_bd075.label);
  const heroValue    = labels.total_proyectos_bd075.value;

  if (loading) {
    return (
      <div className="px-4 py-6 text-white">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-700 rounded w-1/2 mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {ORDER.map((_, i) => (
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

  const cards = ORDER.map((key) => ({
    key,
    icon: labels[key].icon,
    label: labels[key].label,
    value: labels[key].value,
  }));

  return (
    <>
      {/* ───────── Indicador general (hero) ───────── */}
      <div className="px-4 pt-6 text-center">
        <div className="inline-flex items-center gap-4">
          <span
            className="inline-flex items-center justify-center rounded-full"
            style={{ width: 64, height: 64, background: '#FFC800' }}
          >
            <img
              src={EnergiaAmarillo}
              alt="Energía"
              className="w-12 h-12 md:w-14 md:h-14"
              style={{ background: 'transparent' }}
            />
          </span>
          <span className=" leading-tight text-[#FFC800] text-3xl lg:text-5xl font-semibold">
            {heroValue}
          </span>
        </div>

        <div className="mt-2 text-[#D1D1D0] text-1xl lg:text-[20px]">
          {heroSubtitle}
        </div>
      </div>

      {/* ───────── Tarjetas: 3 por fila ───────── */}
      <div className="px-2 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map(({ key, icon, label, value }) => (
            <div key={key} className="bg-[#262626] p-5 rounded-lg border border-[#666666] shadow">
              <div className="flex items-center mb-2">
                <img src={icon} alt={label} className="w-6 h-6 flex-shrink-0" />
                <span className="ml-2 text-[18px] font-normal leading-[26px] text-[#B0B0B0]">
                  {label}
                </span>
              </div>
              <div className="flex text-white text-2xl font-bold">
                {value}
                <HelpCircle
                  className="text-white cursor-pointer hover:text-gray-300 bg-neutral-700 self-center rounded h-6 w-6 p-1 ml-4"
                  title="Ayuda"
                />
              </div>
              <div className="text-xs text-[#B0B0B0] mt-1">Actualizado el: {updated}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}



