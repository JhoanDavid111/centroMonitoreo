// src/components/Indicadores6GW.jsx
import { useEffect, useMemo, useState } from 'react';
import { HelpCircle, Map as MapIcon, Bolt } from 'lucide-react';

import GWOff from '../assets/svg-icons/6gw+NewIcon.svg';
import DemandaOn from '../assets/svg-icons/Demanda-On.svg';
import ProcessOn from '../assets/svg-icons/Process-On.svg';
import Proyecto075On from '../assets/svg-icons/Proyecto075-On.svg';
import EolicaOn from '../assets/svg-icons/Eolica-On.svg';
import HidrologiaOn from '../assets/svg-icons/Hidrologia-On.svg';
import AutogeneracionOn from '../assets/svg-icons/Autogeneracion-On.svg';
import CasaOn from '../assets/svg-icons/Casa-On.svg';
import TerritorioOn from '../assets/svg-icons/Territorio-On.svg';

import EnergiaAmarillo from '../assets/svg-icons/6GW-off-act_.svg';



import { use6GWCache } from './DataGrid/hooks/use6GWCache';

import { useNavigate } from 'react-router-dom';
import TooltipModal from './ui/TooltipModal';

import { useTooltipsCache } from '../hooks/useTooltipsCache'; // Asume que el archivo está en '../hooks/'

// ─────────────────────────────────────────────────────────────────────────────
// Normalización y mapeo canónico
// ─────────────────────────────────────────────────────────────────────────────
function stripAccents(s = '') {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function canonicalKey(raw = '') {
  const clean = stripAccents(String(raw).trim()).toUpperCase();

  if (clean === 'EN OPERACION') return 'EN OPERACIÓN';
  if (clean === 'PRUEBAS') return 'PRUEBAS';
  if (clean === 'AGGE') return 'AGGE';
  if (clean === 'AGPE') return 'AGPE';
  if (
    clean === 'FNCER GRAN ESCALA' ||
    clean === 'FNCER' ||
    clean === 'FNCER GRAN-ESCALA' ||
    clean === 'FNCER A GRAN ESCALA' ||
    clean === 'FNCER GRAN  ESCALA'
  ) return 'FNCER GRAN ESCALA';

  if (clean === 'GENERACION DISTRIBUIDA') return 'GENERACION DISTRIBUIDA';
  if (clean === 'CAPACIDAD A ENTRAR 075') return 'CAPACIDAD A ENTRAR 075';
  if (clean === 'CAPACIDAD TOTAL') return 'CAPACIDAD TOTAL';

  return clean; // fallback
}

// AGREGAR MAPEO DE CLAVE CANONICA A IDENTIFICADOR DE TOOLTIP

const TOOLTIP_IDENTIFIERS_MAP={
  'EN OPERACIÓN': 'res_card_capacidad_inst_operacion',
  'PRUEBAS': 'res_card_capacidad_inst_prueba',
  'CAPACIDAD A ENTRAR 075': 'res_card_mw',
  'FNCER GRAN ESCALA': 'res_card_fncer',
  'AGGE': 'res_card_agge',
  'GENERACION DISTRIBUIDA': 'res_card_gd',
  'AGPE': 'res_card_agpe',
  'ZNI': 'res_card_zni', // Añadir ZNI al mapeo


}

const LABEL_MAP = {
  total_proyectos_bd075: {
      label: 'Capacidad total instalada 6GW+ =',
      icon: EnergiaAmarillo, // (opcional, no se usa en cards; el hero ya toma el icono directo)
    
    },
  'EN OPERACIÓN': { label: 'Capacidad instalada en operación', icon: DemandaOn },
  'PRUEBAS': { label: 'Capacidad instalada en pruebas', icon: ProcessOn },
  'CAPACIDAD A ENTRAR 075': { label: 'MW por entrar a julio de 2026', icon: Proyecto075On },
  'FNCER GRAN ESCALA': { label: 'FNCER gran escala', icon: EolicaOn },
  'AGGE': { label: 'Autogeneración a gran escala (AGGE)', icon: HidrologiaOn },
  'GENERACION DISTRIBUIDA': { label: 'Generación distribuida (GD)', icon: AutogeneracionOn },
  'AGPE': { label: 'Autogeneración a pequeña escala (AGPE)', icon: CasaOn },
  'ZNI': { label: 'Zonas no interconectadas (ZNI)', icon: TerritorioOn, special: true },
};

const ORDER = [
  'EN OPERACIÓN',
  'PRUEBAS',
  'CAPACIDAD A ENTRAR 075',
  'FNCER GRAN ESCALA',
  'AGGE',
  'GENERACION DISTRIBUIDA',
  'AGPE',
  'ZNI', // Añadir ZNI al orden
];

// Helpers
function cleanSubtitle(raw) {
  // quita el " =" final del label para usarlo como subtítulo
  return String(raw || '').replace(/\s*=\s*$/, '');
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilidades
// ─────────────────────────────────────────────────────────────────────────────
const formatMW = (n) =>
  Number(n ?? 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

async function fetchIndicadores6GW() {
  const resp = await fetch(`${API}/v1/indicadores/6g_proyecto`, { method: 'POST' });
  if (!resp.ok) throw new Error('Error al consultar indicadores 6GW+');
  return resp.json();
}



// ─────────────────────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────────────────────
export default function Indicadores6GW() {

  // const { data, loading, error, refetch } = use6GWCache();
  // const navigate = useNavigate();

  const { data, loading, error } = use6GWCache(); // Se mantiene
  const navigate = useNavigate();

    // *** USO DEL NUEVO HOOK ***
  const { 
    tooltips, 
    loading: loadingTooltips, 
    error: errorTooltips 
  } = useTooltipsCache(); // Reemplaza los estados y el useEffect anterior


  // ** ESTADOS FALTANTES PARA LA MODAL **
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  // ** FUNCIÓN PARA CERRAR LA MODAL **
  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle('');
    setModalContent('');
  };



  const heroSubtitle = cleanSubtitle(LABEL_MAP.total_proyectos_bd075.label);
  
    // **USE EFFECT PARA CARGAR TOOLTIPS**
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const resTooltips = await fetchTooltips();
        if (alive) {
          // Normalizar la respuesta de la API a un mapa para fácil acceso: { identificador: Texto }
          const normalizedTooltips = {};
          resTooltips.forEach(seccion => {
            seccion.elementos.forEach(elemento => {
              normalizedTooltips[elemento.identificador] = elemento.Texto;
            });
          });
          setTooltips(normalizedTooltips);
          setLoadingTooltips(false);
        }
      } catch (e) {
        if (alive) {
          setErrorTooltips(e.message || 'Error al consultar tooltips');
          setLoadingTooltips(false);
        }
      }
    })();
    return () => { alive = false; };
  }, []);



  const normalized = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((d) => ({
      original: d.indicador,
      key: canonicalKey(d.indicador),
      mw: Number(d.capacidad_mw ?? 0),
    }));
  }, [data]);

  // Total que mostramos arriba
  const totalMW = useMemo(() => {
    if (!normalized.length) return 0;
    const total = normalized.find((x) => x.key === 'CAPACIDAD TOTAL')?.mw;
    if (total != null && !Number.isNaN(total)) return total;
    // Respaldo: suma de categorías (sin duplicar "total")
    return normalized
      .filter((x) => x.key !== 'CAPACIDAD TOTAL')
      .reduce((acc, x) => acc + (x.mw || 0), 0);
  }, [normalized]);

  const updated = useMemo(() => new Date().toLocaleDateString('es-CO'), []);

  const cards = useMemo(() => {
    if (!normalized.length) return [];

    // 1) tarjetas desde API (excluyendo "Capacidad Total")
    const apiCards = normalized
      .filter((x) => x.key !== 'CAPACIDAD TOTAL')
      .map((x) => {
        const meta = LABEL_MAP[x.key];
        const tooltipId=TOOLTIP_IDENTIFIERS_MAP[x.key];
        return {
          order: ORDER.indexOf(x.key) === -1 ? 999 : ORDER.indexOf(x.key),
          icon: meta?.icon ?? GWOff,
          label: meta?.label ?? x.original,
          value: x.mw,
          special: meta?.special || false,
          tooltipId:tooltipId,
          key:x.key,
        };
      })
      .sort((a, b) => (a.order - b.order) || a.label.localeCompare(b.label, 'es'));

    // 2) tarjeta fija de ZNI
    const zniCard = {
      order: ORDER.indexOf('ZNI'),
      icon: TerritorioOn,
      label: 'Zonas no interconectadas (ZNI)',
      value: 13.89,
      special: true,
      fixedDate: '8/5/2025'
    };

    return [...apiCards, zniCard].sort((a, b) => a.order - b.order);
  }, [normalized]);

  //** NUEVA FUNCION PARA MOSTRAR EL TOOLTIP **
  const handleHelpClick=(cardKey)=>{
    const tooltipId=TOOLTIP_IDENTIFIERS_MAP[cardKey];
    const title=LABEL_MAP[cardKey]?.label || cardKey;
    const content = tooltips[tooltipId]; // Obtener el contenido del tooltip

    console.log('Que retorna juan Clicked help for:', cardKey, '-> Tooltip ID:', tooltipId, 'Content:', content);  
    if(tooltipId && tooltips[tooltipId]){
      //temporal: usar alert para mostrar el tooltip
      // alert(`${LABEL_MAP[cardKey].label}:\n\n${tooltips[tooltipId]}`);
      setModalTitle(cleanSubtitle(title));
      setModalContent(cleanSubtitle(content));
      setIsModalOpen(true);
    }else{
      setModalTitle('Información no disponible');
      setModalContent('No hay información de ayuda disponible para este indicador.');
      setIsModalOpen(true);
      // alert('No hay información de ayuda disponible para este indicador.');
    }

    };
  

  if (loading || loadingTooltips) {
    return (
      <div className="px-4 py-6 text-white">
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

  if (error || errorTooltips) return <div className="text-red-400 p-6">Error al cargar datos: {error || errorTooltips}</div>;

  return (
    <>
      {/* Encabezado total */}
      <div className="px-4 pt-6">
        {/* contenedor centrador */}
        <div className="flex justify-center">
          {/* grupo contenido (icono + número/subtítulo + botón) */}
          <div className="flex items-center gap-4 flex-wrap md:flex-nowrap justify-center">
            
            {/* círculo amarillo + icono */}
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

            {/* número + subtítulo (subtítulo debajo, alineado a la izquierda) */}
            <div className="flex flex-col leading-tight text-left">
              <span className="text-[#FFC800] text-3xl lg:text-5xl font-semibold">
                {formatMW(totalMW)} MW
              </span>
              <span className="mt-1 text-[#D1D1D0] text-1xl lg:text-[20px]">
                {heroSubtitle}
              </span>
            </div>

            {/* botón a la derecha */}
            <button
              onClick={() => navigate('/proyectos_generacion')}
              className="bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-200 transition"
            >
              Ver seguimiento de proyectos
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas */}
      <div className="px-2">
        <h2 className="text-2xl text-[#D1D1D0] font-semibold mb-4">Índices Plan 6GW Plus</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            card.special ? (
              // Card especial para Zonas no interconectadas (ZNI)
              <div key={i} className="bg-[#262626] p-5 rounded-lg border border-[#666666] shadow">
                <div className="flex items-center mb-2">
                  <img src={card.icon} alt={card.label} className="w-6 h-6 flex-shrink-0" />
                  <span className="ml-2 text-[18px] font-normal leading-[26px] text-[#B0B0B0]">
                    {card.label}
                  </span>
                </div>
                <div className="flex text-white text-3xl font-bold">
                  {formatMW(card.value)} MW
                  {/**BOTON HELP CON LÓGICA DE CLIC */}
                  <HelpCircle
                    className="text-white cursor-pointer hover:text-gray-300 bg-neutral-700 self-center rounded h-6 w-6 p-1 ml-4"
                    title="Ayuda"
                    onClick={() => handleHelpClick(card.key)}
                  />
                </div>
                <div className="text-xs text-[#B0B0B0] mt-1">Actualizado el: {card.fixedDate || updated}</div>
              </div>
            ) : (
              <div key={i} className="bg-[#262626] p-5 rounded-lg border border-[#666666] shadow">
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
                    onClick={() => handleHelpClick(card.key)}
                  />
                </div>
                <div className="text-xs text-[#B0B0B0] mt-1">Actualizado el: {updated}</div>
              </div>
            )
          ))}
        </div>
      </div>

      {/*Agregar el componente modal */}
      <TooltipModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalContent}
        />
    </>
  );
}
