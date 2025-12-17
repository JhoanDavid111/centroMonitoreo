// src/components/TramitesAmbientalesPies.jsx
import { useRef, useState, useMemo } from 'react';
import Highcharts from '../lib/highcharts-config';
import HighchartsReact from 'highcharts-react-official';

import TooltipModal from './ui/TooltipModal';
import { useTooltips } from '../services/tooltipsService';

// ⬅️ Usa el mismo hook que el componente TramitesSolicitados (mismo endpoint)
import { useTramitesSolicitadosOASS } from '../services/indicadoresAmbientalesService';

const CHART_HEIGHT = 520;

const CHART_TOOLTIP_IDS = {
  tipo: 'seg_amb_tipo_tramites',
  tipologia: 'seg_amb_tipologia_tramites_mane1_2025',
};

const COLORS = {
  // UI
  fondoCard: '#262626',
  bordeCard: '#666666',
  textMain: '#FFFFFF',
  textMuted: '#9CA3AF',

  // Tipos de trámite
  enGestion: '#0A8C00', // En gestión
  nuevos: '#B8F600',    // Nuevos

  // Tipología MANE
  ambiental: '#B8FF65',
  conexion: '#0A8C00',
  superposicion: '#FFC800',
  otros: '#ADADAD',
  consulta: '#F97316',
  prospeccion: '#183E34',

  gris: '#C4C4C4',
};

const basePieOptions = {
  chart: {
    type: 'pie',
    backgroundColor: COLORS.fondoCard,
    height: CHART_HEIGHT - 40,
    spacing: [24, 16, 24, 16],
  },
  title: {
    text: '',
    align: 'left',
    style: {
      color: COLORS.textMain,
      fontSize: '18px',
      fontWeight: 600,
      fontFamily: 'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont',
    },
    margin: 14,
  },
  subtitle: {
    text: '',
    align: 'left',
    style: {
      color: COLORS.textMuted,
      fontSize: '12px',
      fontFamily: 'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont',
    },
    y: 32,
  },
  legend: {
    align: 'center',
    verticalAlign: 'bottom',
    itemStyle: {
      color: COLORS.textMain,
      fontSize: '12px',
      fontFamily: 'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont',
    },
    itemMarginTop: 4,
    itemMarginBottom: 4,
  },
  credits: { enabled: false },
  tooltip: {
    useHTML: true,
    backgroundColor: COLORS.fondoCard,
    borderColor: '#444',
    style: {
      color: COLORS.textMain,
      fontSize: '13px',
      fontFamily: 'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont',
    },
    formatter: function () {
      const name = this.point.name;
      const value = this.point.y;
      return `
        <div style="padding:6px 8px;">
          <div style="font-weight:600;margin-bottom:4px;">${name}</div>
          <div><span style="color:${this.point.color};">●</span>
            Porcentaje: <b>${Highcharts.numberFormat(value, 2)}</b>%
          </div>
        </div>
      `;
    },
  },
  plotOptions: {
    pie: {
      colorByPoint: false, // 👈 evita paletas globales
      allowPointSelect: true,
      cursor: 'pointer',
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        distance: 20,
        style: {
          color: COLORS.textMain,
          textOutline: 'none',
          fontSize: '12px',
          fontFamily: 'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont',
        },
        formatter: function () {
          return Highcharts.numberFormat(this.percentage, 0) + '%';
        },
      },
      showInLegend: true,
    },
  },
  exporting: { enabled: true },
};

// ---------- builders dinámicos ----------
function buildTipoTramitesOptions(tipos_tramite) {
  const fuente = tipos_tramite?.fuente || '';
  const ultima = tipos_tramite?.ultimaActualizacion || '';
  const subtitle = (fuente || ultima)
    ? `Fuente: ${fuente}${ultima ? ` / Actualizado el: ${ultima}` : ''}`
    : '';

  const colorTipo = (nombre = '') => {
    const n = nombre.toLowerCase();
    if (n.includes('nuevo')) return COLORS.nuevos;     // Nuevos
    if (n.includes('gest')) return COLORS.enGestion;   // En gestión
    return COLORS.gris;
  };

  const data = (tipos_tramite?.tipo || []).map((t) => ({
    name: t.nombre,
    y: Number(t.porcentaje ?? 0),
    color: colorTipo(t.nombre),
  }));

  return {
    ...basePieOptions,
    title: {
      ...basePieOptions.title,
      text: tipos_tramite?.titulo || 'Tipo de trámites solicitados',
    },
    subtitle: { ...basePieOptions.subtitle, text: subtitle },
    series: [
      {
        type: 'pie',
        name: 'Trámites',
        innerSize: '0%',
        size: '70%',
        colorByPoint: false,
        colors: undefined,
        data,
      },
    ],
  };
}

function buildTipologiaManeOptions(tipologias) {
  const fuente = tipologias?.fuente || '';
  const ultima = tipologias?.ultimaActualizacion || '';
  const subtitle = (fuente || ultima)
    ? `Fuente: ${fuente}${ultima ? ` / Actualizado el: ${ultima}` : ''}`
    : '';

  const colorByTipologia = (nombre = '') => {
    const n = nombre.toLowerCase();

    if (n.includes('admin')) return COLORS.conexion;

    if (n.startsWith('ambient')) return COLORS.ambiental;
    if (n.startsWith('conex'))   return COLORS.conexion;
    if (n.startsWith('super'))   return COLORS.superposicion;
    if (n.startsWith('otros'))   return COLORS.otros;
    if (n.startsWith('consulta'))return COLORS.consulta;
    if (n.startsWith('prosp'))   return COLORS.prospeccion;
    return COLORS.gris;
  };

  const data = (tipologias?.tipologias || []).map((t) => ({
    name: t.nombre,
    y: Number(t.valor ?? 0),
    color: colorByTipologia(t.nombre),
  }));

  return {
    ...basePieOptions,
    title: {
      ...basePieOptions.title,
      text: tipologias?.titulo || 'Tipología de trámites MANE I 2025',
    },
    subtitle: { ...basePieOptions.subtitle, text: subtitle },
    plotOptions: {
      ...basePieOptions.plotOptions,
      pie: {
        ...basePieOptions.plotOptions.pie,
        innerSize: '55%',
        size: '75%',
        dataLabels: { ...basePieOptions.plotOptions.pie.dataLabels, distance: 18 },
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Tipología',
        colorByPoint: false,
        colors: undefined,
        data,
      },
    ],
  };
}

// ---------- componente principal ----------
export default function TramitesAmbientalesPies() {
  const chartRefs = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const { data: tooltips = {} } = useTooltips();

  // ⬅️ Reemplaza fetch manual por React Query + apiClient
  const { data: apiData, isLoading: loading, error } = useTramitesSolicitadosOASS();

  const charts = useMemo(() => {
    const tipos = apiData?.tipos_tramite;
    const tipologias = apiData?.tipologias;
    return [
      { key: 'tipo', options: buildTipoTramitesOptions(tipos) },
      { key: 'tipologia', options: buildTipologiaManeOptions(tipologias) },
    ];
  }, [apiData]);

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle('');
    setModalContent('');
  };

  const handleHelpClick = (chartKey, chartOptions) => {
    const tooltipId = CHART_TOOLTIP_IDS[chartKey];
    const title = chartOptions.title?.text || 'Detalle de la gráfica';
    const content = tooltipId ? tooltips[tooltipId] : null;

    if (content) {
      setModalTitle(title);
      setModalContent(content);
    } else {
      setModalTitle(title);
      setModalContent('No hay información de ayuda disponible para esta gráfica.');
    }
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <section className="mt-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow animate-pulse"
              style={{ minHeight: CHART_HEIGHT }}
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    const msg = typeof error === 'string' ? error : (error?.message || 'Error al cargar los datos.');
    return (
      <section className="mt-8">
        <div className="bg-[#262626] p-4 rounded-lg border border-red-500 text-red-400 shadow">
          Error al cargar datos de trámites: {msg}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {charts.map((chart, idx) => (
          <div
            key={chart.key}
            className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow relative"
            style={{ minHeight: CHART_HEIGHT + 16 }}
          >
            {/* Botón de ayuda */}
            <div className="absolute top-3 right-3">
              <button
                type="button"
                onClick={() => handleHelpClick(chart.key, chart.options)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-[#333333] hover:bg-[#4B5563] transition-colors"
                title="Ayuda"
              >
                <span className="text-white text-sm font-semibold">?</span>
              </button>
            </div>

            <HighchartsReact
              highcharts={Highcharts}
              options={chart.options}
              ref={(el) => (chartRefs.current[idx] = el)}
              containerProps={{ style: { height: CHART_HEIGHT - 8, width: '100%' } }}
            />
          </div>
        ))}
      </div>

      <TooltipModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalContent}
      />
    </section>
  );
}
