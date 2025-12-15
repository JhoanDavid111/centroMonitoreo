// src/components/ProjectGrid.jsx
import Highcharts from '../lib/highcharts-config';
import HighchartsReact from 'highcharts-react-official';
import Boost from 'highcharts/modules/boost';
import { ChevronLeft, ChevronRight, Download, Filter, ChevronsUpDown } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { generatePath, useNavigate } from 'react-router-dom';
import curvaSAmarillo from '../assets/curvaSAmarillo.svg';
import ojoAmarillo from '../assets/ojoAmarillo.svg';
import { useListadoProyectosCurvaS, useCurvaS } from '../services/graficasService';
import GraficaANLA from './GraficaANLA';
import Card from './ui/Card';
import { darkTableStyles, registerDarkDataTableTheme } from './DataGrid/styles/darkTheme';
import tokens from '../styles/theme.js';

registerDarkDataTableTheme();

// ——— Estilos extra (paginación) ———
const customStyles = {
  tableWrapper: { style: { overflow: 'visible' } },
  table: { style: { overflow: 'visible' } },
  headCells: {
    style: {
      overflow: 'visible',
      fontSize: tokens.font.size.lg,
      fontWeight: tokens.font.weight.semibold,
      color: tokens.colors.text.primary,
    }
  },
  cells: {
    style: {
      overflow: 'visible',
      fontSize: tokens.font.size.base,
      fontWeight: tokens.font.weight.regular,
      color: tokens.colors.text.secondary,
    }
  },
  rows: {
    style: { backgroundColor: tokens.colors.surface.primary },
    highlightOnHoverStyle: { backgroundColor: tokens.colors.surface.secondary, transition: '0.2s ease-in-out' },
  },
  pagination: {
    style: {
      backgroundColor: tokens.colors.surface.primary,
      color: tokens.colors.text.secondary,
      borderTop: `1px solid ${tokens.colors.border.subtle}`,
      padding: tokens.spacing.sm,
    },
  },
  paginationButtons: {
    style: {
      color: tokens.colors.text.secondary,
      '&:hover': { backgroundColor: tokens.colors.surface.secondary },
      '& svg': { stroke: tokens.colors.text.secondary },
      '& svg path': { stroke: tokens.colors.text.secondary },
    },
  },
};

// ——— Inicializar módulos de Highcharts ———
Boost(Highcharts);

// ——— Componente reutilizable de carga ———
const LoadingSpinner = ({ message = "Cargando datos..." }) => (
  <div className="bg-surface-primary p-4 rounded-md border border-[color:var(--border-default)] shadow-soft flex flex-col items-center justify-center h-64">
    <div className="flex space-x-2">
      <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }} />
      <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }} />
      <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }} />
    </div>
    <p className="text-text-secondary mt-4">{message}</p>
  </div>
);

// ——— Opciones base de la Curva S ———
const baseChartOptions = {
  chart: {
    type: 'spline',
    height: 520,
    backgroundColor: tokens.colors.surface.primary,
    animation: false
  },
  title: {
    text: 'Curva S – Proyecto',
    style: { color: tokens.colors.text.primary, fontFamily: tokens.font.family }
  },
  subtitle: { text: '' },

  xAxis: {
    type: 'datetime',
    gridLineColor: tokens.colors.border.subtle,
    tickPixelInterval: 80,
    dateTimeLabelFormats: { day: '%e %b %Y', week: '%e %b %Y', month: '%b %Y', year: '%Y' },
    labels: { style: { color: tokens.colors.text.secondary, fontSize: '10px', fontFamily: tokens.font.family } },
    crosshair: { width: 1 }
  },
  yAxis: {
    title: { text: 'Avance (%)', style: { color: tokens.colors.text.secondary, fontFamily: tokens.font.family } },
    labels: { style: { color: tokens.colors.text.secondary, fontSize: '10px', fontFamily: tokens.font.family } },
    gridLineColor: tokens.colors.border.subtle,
    min: 0, max: 100,
    crosshair: { width: 1 }
  },
  legend: {
    useHTML: true,
    itemStyle: { color: tokens.colors.text.secondary, fontFamily: tokens.font.family },
    itemHoverStyle: { color: tokens.colors.text.primary },
    itemHiddenStyle: { color: tokens.colors.text.muted },
    labelFormatter: function () {
      const isPH = this.userOptions && this.userOptions.isPlaceholder;
      const style = `font-family:${tokens.font.family}` + (isPH ? `;color:${tokens.colors.text.danger}` : '');
      return `<span style="${style}">${this.name}</span>`;
    }
  },

  credits: { enabled: false },

  tooltip: {
    shared: false,
    useHTML: false,
    followPointer: false,
    stickOnContact: true,
    hideDelay: 60,
    snap: 16,
    xDateFormat: '%Y-%m-%d',
    backgroundColor: tokens.colors.surface.primary,
    borderColor: tokens.colors.border.default,
    style: { color: tokens.colors.text.primary, fontSize: tokens.font.size.base },
    padding: parseInt(tokens.spacing.lg, 10),
    formatter: function () {
      const fecha = Highcharts.dateFormat('%Y-%m-%d', this.x);
      const valor = Highcharts.numberFormat(this.y ?? 0, 1);
      const hito  = this.point?.hito_nombre ? `\n${this.point.hito_nombre}` : '';
      return `${fecha}\n${this.series.name}: ${valor} %${hito}`;
    }
  },

  plotOptions: {
    series: {
      turboThreshold: 0,
      stickyTracking: false,
      animation: { duration: 150 },
      states: { hover: { halo: { size: 7 } } },
      boostThreshold: 2000
    },
    spline: {
      marker: { enabled: true, radius: 4, lineWidth: 1 },
      connectNulls: false
    }
  },

  series: [],

  exporting: {
    enabled: true,
    buttons: {
      contextButton: { menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG'] },
    }
  },

  responsive: {
    rules: [{ condition: { maxWidth: 640 }, chartOptions: { chart: { height: 420 } } }]
  }
};

export default function ProjectGrid() {
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);
  const tabs = ['Seguimiento Curva S', 'Todos los proyectos', 'Licencias ANLA'];
  const [activeTab, setActiveTab]         = useState(tabs[0]);
  const [proyectos, setProyectos]         = useState([]);
  const [chartOptions, setChartOptions]   = useState(baseChartOptions);
  const [showChart, setShowChart]         = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const navigate = useNavigate();
  const tableStyles = useMemo(() => ({ ...darkTableStyles, ...customStyles }), []);

  // **Estados de filtros por columna**
  const [columnFilters, setColumnFilters] = useState({
    id: '',
    nombre: '',
    capacidad: '',
    fpo: '',
    avance: '',
    priorizado: '',
    ciclo: '',
    promotor: '',
    departamento: '',
    municipio: '',
    estado: ''
  });
  const [globalFilter, setGlobalFilter] = useState('');
  const [openFilter, setOpenFilter]     = useState('');

  // --- Ordenamiento por columna (una columna activa a la vez) ---
  const [sortState, setSortState] = useState({ key: '', direction: '' }); // 'asc' | 'desc' | ''

  const toggleSort = (key) => {
    setSortState((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: '', direction: '' };
    });
  };

  const getSortValue = (row, key) => {
    switch (key) {
      case 'id':           return Number(row.id) || 0;
      case 'nombre':       return String(row.nombre_proyecto ?? '');
      case 'capacidad':    return Number(row.capacidad_instalada_mw) || 0;
      case 'fpo':          return row.fpo && row.fpo !== '-' ? new Date(row.fpo).getTime() : -Infinity;
      case 'avance':       return Number(row.porcentaje_avance ?? (String(row.porcentaje_avance_display||'').replace('%',''))) || 0;
      case 'priorizado':   return String(row.priorizado ?? '');
      case 'ciclo':        return String(row.ciclo_asignacion ?? '');
      case 'promotor':     return String(row.promotor ?? '');
      case 'departamento': return String(row.departamento ?? '');
      case 'municipio':    return String(row.municipio ?? '');
      case 'estado':       return String(row.estado ?? '');
      default:             return '';
    }
  };

  const applySort = (data) => {
    if (!sortState.key || !sortState.direction) return data;
    const dir = sortState.direction === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => {
      const va = getSortValue(a, sortState.key);
      const vb = getSortValue(b, sortState.key);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      return String(va).localeCompare(String(vb), 'es', { numeric: true, sensitivity: 'base' }) * dir;
    });
  };

  // ——— Carga inicial de proyectos ———
  const { data: proyectosData = [], isLoading: loadingList, error: errorList } = useListadoProyectosCurvaS();

  useEffect(() => {
    if (proyectosData && proyectosData.length > 0) {
      const formatted = proyectosData.map(p => ({
        ...p,
        fpo: p.fpo ? p.fpo.split('T')[0] : '-',
        porcentaje_avance_display: p.porcentaje_avance != null ? `${p.porcentaje_avance}%` : '-',
        estado: (p.estado_proyecto ?? '-'),
      }));
      setProyectos(formatted);
    }
  }, [proyectosData]);

  // ——— Reflow al redimensionar ———
  useEffect(() => {
    const onResize = () => chartRef.current?.chart?.reflow();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ——— Al hacer clic en Curva S ———
  const handleViewCurve = (row) => {
    setShowChart(true);
    setSelectedProjectId(row.id);
  };

  // Fetch de curva S
  const { data: curvaData, isLoading: loadingCurve, error: errorCurve } = useCurvaS(selectedProjectId);

  // Procesar datos de curva S
  useEffect(() => {
    if (!curvaData || !selectedProjectId) return;

    const COLOR_REF = '#60A5FA';
    const COLOR_SEG = '#A3E635';

    const formatDMY = (iso) => {
      if (!iso) return '';
      const [y, m, d] = String(iso).split('-');
      return (y && m && d) ? `${d}/${m}/${y}` : iso;
    };

    const parse = (arr) =>
      (arr ?? [])
        .map(pt => {
          if (!pt || typeof pt === 'string') return null;
          const iso = (pt.fecha || '').split('T')[0];
          if (!iso) return null;
          const t = new Date(iso).getTime();
          const y = Number(pt.avance);
          return Number.isFinite(t) && Number.isFinite(y)
            ? { x: t, y, hito_nombre: pt.hito_nombre ?? '' }
            : null;
        })
        .filter(Boolean)
        .sort((a, b) => a.x - b.x);

    try {
      const payload = curvaData;
      const refRaw = payload?.referencia?.curva;
      const segRaw = payload?.seguimiento?.curva;
      const refRad = payload?.referencia?.fecha_radicado || null;
      const segRad = payload?.seguimiento?.fecha_radicado || null;

      const refIsMsg = Array.isArray(refRaw) && refRaw.length > 0 && typeof refRaw[0] === 'string';
      const segIsMsg = Array.isArray(segRaw) && segRaw.length > 0 && typeof segRaw[0] === 'string';

      const refData = refIsMsg ? [] : parse(refRaw);
      const segData = segIsMsg ? [] : parse(segRaw);

      const refName = `Curva de referencia${refRad ? ` (${formatDMY(refRad)})` : ''}`;
      const segName = `Curva de seguimiento${segRad ? ` (${formatDMY(segRad)})` : ''}`;

      const newSeries = [];

      if (refIsMsg) {
        newSeries.push({
          type: 'spline',
          name: String(refRaw[0]),
          data: [],
          color: COLOR_REF,
          showInLegend: true,
          enableMouseTracking: false,
          isPlaceholder: true,
          marker: { enabled: true, symbol: 'circle' }
        });
      } else if (refData.length) {
        newSeries.push({
          type: 'spline',
          name: refName,
          data: refData,
          color: COLOR_REF
        });
      }

      if (segIsMsg) {
        newSeries.push({
          type: 'spline',
          name: String(segRaw[0]),
          data: [],
          color: COLOR_SEG,
          showInLegend: true,
          enableMouseTracking: false,
          isPlaceholder: true,
          marker: { enabled: true, symbol: 'circle' }
        });
      } else if (segData.length) {
        newSeries.push({
          type: 'spline',
          name: segName,
          data: segData,
          color: COLOR_SEG
        });
      }

      if (newSeries.length === 0) {
        setChartOptions(opts => ({
          ...opts,
          title: { ...opts.title, text: `Curva S – Proyecto ${selectedProjectId}` },
          series: []
        }));
        return;
      }

      const selectedRow = proyectos.find(p => p.id === selectedProjectId);
      setChartOptions(opts => ({
        ...opts,
        title: { ...opts.title, text: `Curva S – Proyecto ${selectedProjectId}${selectedRow ? ` – ${selectedRow.nombre_proyecto}` : ''}` },
        legend: {
          ...opts.legend,
          useHTML: true,
          itemStyle: { ...(opts.legend?.itemStyle||{}), fontFamily: 'Nunito Sans, sans-serif' },
          labelFormatter: function () {
            const isPH = this.userOptions && this.userOptions.isPlaceholder;
            const style = "font-family:'Nunito Sans',sans-serif" + (isPH ? ';color:#ef4444' : '');
            return `<span style="${style}">${this.name}</span>`;
          }
        },
        series: newSeries
      }));
    } catch (err) {
      console.error(err);
    } finally {
      if (chartContainerRef.current) {
        const OFFSET = 80;
        const top = chartContainerRef.current.getBoundingClientRect().top + window.scrollY - OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
        setTimeout(() => chartRef.current?.chart?.reflow(), 250);
      }
    }
  }, [curvaData, selectedProjectId, proyectos]);

  function applyGlobal(row) {
    if (!globalFilter) return true;
    return Object.values({
      id: row.id,
      nombre: row.nombre_proyecto,
      capacidad: row.capacidad_instalada_mw,
      fpo: row.fpo,
      avance: row.porcentaje_avance_display,
      promotor: row.promotor,
      estado: row.estado,
    }).some(v => String(v).toLowerCase().includes(globalFilter.toLowerCase()));
  }

  // ——— Filtrado por columna ———
  const filteredSeguimiento = proyectos
    .filter(r => /^[0-9]+$/.test(String(r.id)))
    .filter(r => String(r.id).includes(columnFilters.id))
    .filter(r => String(r.nombre_proyecto ?? '').toLowerCase().includes(columnFilters.nombre.toLowerCase()))
    .filter(r => String(r.capacidad_instalada_mw ?? '').includes(columnFilters.capacidad))
    .filter(r => String(r.fpo  ?? '').toLowerCase().includes(columnFilters.fpo.toLowerCase()))
    .filter(r => String(r.porcentaje_avance_display ?? '').toLowerCase().includes(columnFilters.avance.toLowerCase()))
    .filter(r => String(r.priorizado ?? '').toLowerCase().includes(columnFilters.priorizado.toLowerCase()))
    .filter(r => String(r.ciclo_asignacion ?? '').toLowerCase().includes(columnFilters.ciclo.toLowerCase()))
    .filter(r => String(r.promotor ?? '').toLowerCase().includes(columnFilters.promotor.toLowerCase()))
    .filter(r => String(r.departamento ?? '').toLowerCase().includes(columnFilters.departamento.toLowerCase()))
    .filter(r => String(r.municipio ?? '').toLowerCase().includes(columnFilters.municipio.toLowerCase()))
    .filter(applyGlobal);

  const filteredAll = proyectos
    .filter(r => String(r.id).includes(columnFilters.id))
    .filter(r => String(r.nombre_proyecto ?? '').toLowerCase().includes(columnFilters.nombre.toLowerCase()))
    .filter(r => String(r.capacidad_instalada_mw ?? '').includes(columnFilters.capacidad))
    .filter(r => String(r.fpo  ?? '').toLowerCase().includes(columnFilters.fpo.toLowerCase()))
    .filter(r => String(r.porcentaje_avance_display ?? '').toLowerCase().includes(columnFilters.avance.toLowerCase()))
    .filter(r => String(r.priorizado ?? '').toLowerCase().includes(columnFilters.priorizado.toLowerCase()))
    .filter(r => String(r.ciclo_asignacion ?? '').toLowerCase().includes(columnFilters.ciclo.toLowerCase()))
    .filter(r => String(r.promotor ?? '').toLowerCase().includes(columnFilters.promotor.toLowerCase()))
    .filter(r => String(r.departamento ?? '').toLowerCase().includes(columnFilters.departamento.toLowerCase()))
    .filter(r => String(r.municipio ?? '').toLowerCase().includes(columnFilters.municipio.toLowerCase()))
    .filter(r => String(r.estado ?? '').toLowerCase().includes(columnFilters.estado.toLowerCase()))
    .filter(applyGlobal);

  const sortedSeguimiento = applySort(filteredSeguimiento);
  const sortedAll = applySort(filteredAll);

  const initialFilters = {
    id: '',
    nombre: '',
    capacidad: '',
    fpo: '',
    avance: '',
    priorizado: '',
    ciclo: '',
    promotor: '',
    departamento: '',
    municipio: '',
    estado: ''
  };

  // Capitalización gentil
  function titleCase(raw) {
    const connectors = ['y','de','la','el','los','las','en','a','por','para','con','sin','del','al','o','u'];
    return String(raw || '')
      .split(' ')
      .map((word, index) => {
        if (word.includes('.')) return word.toUpperCase();
        const lower = word.toLowerCase();
        if (index > 0 && connectors.includes(lower)) return lower;
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join(' ');
  }

  // ——— Columnas base ———
  const columnsSimple = [
    {
      name: (
        <div className="relative inline-block pb-11">
          <span>ID</span>
          <Filter
            className={`inline ml-1 cursor-pointer ${columnFilters.id ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => setOpenFilter(openFilter==='id'?'':'id')}
          />
          <ChevronsUpDown
            className={`inline ml-1 cursor-pointer ${sortState.key==='id' && sortState.direction ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => toggleSort('id')}
            title={sortState.key!=='id'||!sortState.direction ? 'Ordenar ascendente' : (sortState.direction==='asc' ? 'Cambiar a descendente' : 'Quitar orden')}
          />
          {openFilter==='id' && (
            <div className="absolute bg-surface-secondary p-2 mt-1 rounded shadow z-50">
              <input
                type="text"
                placeholder="Buscar..."
                value={columnFilters.id}
                onChange={e => setColumnFilters({ ...columnFilters, id: e.target.value })}
                className="bg-surface-primary text-white p-1 text-sm w-16"
              />
            </div>
          )}
        </div>
      ),
      selector: row => row.id,
      sortable: false,
      wrap: true,
      width: '120px',
    },
    {
      name: (
        <div className="relative inline-block pb-11">
          <span>Nombre</span>
          <Filter
            className={`inline ml-1 cursor-pointer ${columnFilters.nombre ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => setOpenFilter(openFilter==='nombre'?'':'nombre')}
          />
          <ChevronsUpDown
            className={`inline ml-1 cursor-pointer ${sortState.key==='nombre' && sortState.direction ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => toggleSort('nombre')}
            title={sortState.key!=='nombre'||!sortState.direction ? 'Ordenar ascendente' : (sortState.direction==='asc' ? 'Cambiar a descendente' : 'Quitar orden')}
          />
          {openFilter==='nombre' && (
            <div className="absolute bg-surface-secondary p-2 mt-1 rounded shadow z-50">
              <input
                type="text"
                placeholder="Buscar..."
                value={columnFilters.nombre}
                onChange={e => setColumnFilters({ ...columnFilters, nombre: e.target.value })}
                className="bg-surface-primary text-white p-1 text-sm w-32"
              />
            </div>
          )}
        </div>
      ),
      selector: row => row.nombre_proyecto,
      sortable: false,
      wrap: true,
      width: '200px',
      cell: row => {
        const raw = row.nombre_proyecto || '';
        const formatted = titleCase(raw);
        const disp = formatted.length > 50 ? `${formatted.slice(0, 20)}...` : formatted;
        return <span title={formatted}>{disp}</span>;
      }
    },
    {
      name: (
        <div className="relative inline-block pb-11">
          <span>Capacidad</span>
          <Filter
            className={`inline ml-1 cursor-pointer ${columnFilters.capacidad ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => setOpenFilter(openFilter==='capacidad'?'':'capacidad')}
          />
          <ChevronsUpDown
            className={`inline ml-1 cursor-pointer ${sortState.key==='capacidad' && sortState.direction ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => toggleSort('capacidad')}
            title={sortState.key!=='capacidad'||!sortState.direction ? 'Ordenar ascendente' : (sortState.direction==='asc' ? 'Cambiar a descendente' : 'Quitar orden')}
          />
          {openFilter==='capacidad' && (
            <div className="absolute bg-surface-secondary p-2 mt-1 rounded shadow z-50">
              <input
                type="text"
                placeholder="Buscar..."
                value={columnFilters.capacidad}
                onChange={e => setColumnFilters({ ...columnFilters, capacidad: e.target.value })}
                className="bg-surface-primary text-white p-1 text-sm w-16"
              />
            </div>
          )}
        </div>
      ),
      selector: row => row.capacidad_instalada_mw,
      sortable: false,
      wrap: true,
      width: '180px',
      cell: row => (`${row.capacidad_instalada_mw} MW`),
    },
    {
      name: (
        <div className="relative inline-block pb-11">
          <span>FPO</span>
          <Filter
            className={`inline ml-1 cursor-pointer ${columnFilters.fpo ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => setOpenFilter(openFilter==='fpo'?'':'fpo')}
          />
          <ChevronsUpDown
            className={`inline ml-1 cursor-pointer ${sortState.key==='fpo' && sortState.direction ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => toggleSort('fpo')}
            title={sortState.key!=='fpo'||!sortState.direction ? 'Ordenar ascendente' : (sortState.direction==='asc' ? 'Cambiar a descendente' : 'Quitar orden')}
          />
          {openFilter==='fpo' && (
            <div className="absolute bg-surface-secondary p-2 mt-1 rounded shadow z-50">
              <input
                type="text"
                placeholder="Buscar..."
                value={columnFilters.fpo}
                onChange={e => setColumnFilters({ ...columnFilters, fpo: e.target.value })}
                className="bg-surface-primary text-white p-1 text-sm w-24"
              />
            </div>
          )}
        </div>
      ),
      selector: row => row.fpo,
      sortable: false,
      wrap: true,
      width: '150px',
    },
    {
      name: (
        <div className="relative inline-block pb-11">
          <span>Avance</span>
          <Filter
            className={`inline ml-1 cursor-pointer ${columnFilters.avance ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => setOpenFilter(openFilter==='avance'?'':'avance')}
          />
          <ChevronsUpDown
            className={`inline ml-1 cursor-pointer ${sortState.key==='avance' && sortState.direction ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => toggleSort('avance')}
            title={sortState.key!=='avance'||!sortState.direction ? 'Ordenar ascendente' : (sortState.direction==='asc' ? 'Cambiar a descendente' : 'Quitar orden')}
          />
          {openFilter==='avance' && (
            <div className="absolute bg-surface-secondary p-2 mt-1 rounded shadow z-50">
              <input
                type="text"
                placeholder="Buscar..."
                value={columnFilters.avance}
                onChange={e => setColumnFilters({ ...columnFilters, avance: e.target.value })}
                className="bg-surface-primary text-white p-1 text-sm w-16"
              />
            </div>
          )}
        </div>
      ),
      selector: row => row.porcentaje_avance_display,
      sortable: false,
      wrap: true,
      width: '160px',
    },
    {
      name: (
        <div className="relative inline-block pb-11">
          <span>Priorizado</span>
          <Filter
            className={`inline ml-1 cursor-pointer ${columnFilters.priorizado ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => setOpenFilter(openFilter==='priorizado'?'':'priorizado')}
          />
          <ChevronsUpDown
            className={`inline ml-1 cursor-pointer ${sortState.key==='priorizado' && sortState.direction ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => toggleSort('priorizado')}
            title={sortState.key!=='priorizado'||!sortState.direction ? 'Ordenar ascendente' : (sortState.direction==='asc' ? 'Cambiar a descendente' : 'Quitar orden')}
          />
          {openFilter === 'priorizado' && (
            <div className="absolute overflow-visible bg-surface-secondary p-2 mt-1 rounded shadow z-50">
              <input
                type="text"
                placeholder="Buscar..."
                value={columnFilters.priorizado}
                onChange={e => setColumnFilters({ ...columnFilters, priorizado: e.target.value })}
                className="bg-surface-primary text-white p-1 text-sm w-16"
              />
            </div>
          )}
        </div>
      ),
      selector: row => row.priorizado,
      sortable: false,
      wrap: true,
      width: '180px',
    },
    {
      name: (
        <div className="relative inline-block pb-11">
          <span>Ciclo</span>
          <Filter
            className={`inline ml-1 cursor-pointer ${columnFilters.ciclo ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => setOpenFilter(openFilter==='ciclo'?'':'ciclo')}
          />
          <ChevronsUpDown
            className={`inline ml-1 cursor-pointer ${sortState.key==='ciclo' && sortState.direction ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => toggleSort('ciclo')}
            title={sortState.key!=='ciclo'||!sortState.direction ? 'Ordenar ascendente' : (sortState.direction==='asc' ? 'Cambiar a descendente' : 'Quitar orden')}
          />
          {openFilter === 'ciclo' && (
            <div className="absolute overflow-visible bg-surface-secondary p-2 mt-1 rounded shadow z-50">
              <input
                type="text"
                placeholder="Buscar..."
                value={columnFilters.ciclo}
                onChange={e => setColumnFilters({ ...columnFilters, ciclo: e.target.value })}
                className="bg-surface-primary text-white p-1 text-sm w-24"
              />
            </div>
          )}
        </div>
      ),
      selector: row => row.ciclo_asignacion,
      sortable: false,
      wrap: true,
      width: '150px',
      cell: row => {
        const raw = row.ciclo_asignacion || '';
        const formatted = titleCase(raw);
        const disp = formatted.length > 50 ? `${formatted.slice(0, 20)}...` : formatted;
        return <span title={formatted}>{disp}</span>;
      }
    },
    {
      name: (
        <div className="relative inline-block pb-11">
          <span>Promotor</span>
          <Filter
            className={`inline ml-1 cursor-pointer ${columnFilters.promotor ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => setOpenFilter(openFilter==='promotor'?'':'promotor')}
          />
          <ChevronsUpDown
            className={`inline ml-1 cursor-pointer ${sortState.key==='promotor' && sortState.direction ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => toggleSort('promotor')}
            title={sortState.key!=='promotor'||!sortState.direction ? 'Ordenar ascendente' : (sortState.direction==='asc' ? 'Cambiar a descendente' : 'Quitar orden')}
          />
          {openFilter==='promotor' && (
            <div className="absolute bg-surface-secondary p-2 mt-1 rounded shadow z-50">
              <input
                type="text"
                placeholder="Buscar..."
                value={columnFilters.promotor}
                onChange={e => setColumnFilters({ ...columnFilters, promotor: e.target.value })}
                className="bg-surface-primary text-white p-1 text-sm w-32"
              />
            </div>
          )}
        </div>
      ),
      selector: row => row.promotor,
      sortable: false,
      wrap: true,
      width: '200px',
      cell: row => {
        const raw = row.promotor || '';
        const formatted = titleCase(raw);
        const disp = formatted.length > 50 ? `${formatted.slice(0, 20)}...` : formatted;
        return <span title={formatted}>{disp}</span>;
      }
    },
    {
      name: (
        <div className="relative inline-block pb-11">
          <span>Departamento</span>
          <Filter
            className={`inline ml-1 cursor-pointer ${columnFilters.departamento ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => setOpenFilter(openFilter==='departamento'?'':'departamento')}
          />
          <ChevronsUpDown
            className={`inline ml-1 cursor-pointer ${sortState.key==='departamento' && sortState.direction ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => toggleSort('departamento')}
            title={sortState.key!=='departamento'||!sortState.direction ? 'Ordenar ascendente' : (sortState.direction==='asc' ? 'Cambiar a descendente' : 'Quitar orden')}
          />
          {openFilter === 'departamento' && (
            <div className="absolute overflow-visible bg-surface-secondary p-2 mt-1 rounded shadow z-50">
              <input
                type="text"
                placeholder="Buscar..."
                value={columnFilters.departamento}
                onChange={e => setColumnFilters({ ...columnFilters, departamento: e.target.value })}
                className="bg-surface-primary text-white p-1 text-sm w-32"
              />
            </div>
          )}
        </div>
      ),
      selector: row => row.departamento,
      sortable: false,
      wrap: true,
      width: '180px',
      cell: row => {
        const raw = row.departamento || '';
        const formatted = titleCase(raw);
        const disp = formatted.length > 50 ? `${formatted.slice(0, 20)}...` : formatted;
        return <span title={formatted}>{disp}</span>;
      }
    },
    {
      name: (
        <div className="relative inline-block pb-11">
          <span>Municipio</span>
          <Filter
            className={`inline ml-1 cursor-pointer ${columnFilters.municipio ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => setOpenFilter(openFilter==='municipio'?'':'municipio')}
          />
          <ChevronsUpDown
            className={`inline ml-1 cursor-pointer ${sortState.key==='municipio' && sortState.direction ? 'text-yellow-400' : 'text-gray-500'}`}
            size={16}
            onClick={() => toggleSort('municipio')}
            title={sortState.key!=='municipio'||!sortState.direction ? 'Ordenar ascendente' : (sortState.direction==='asc' ? 'Cambiar a descendente' : 'Quitar orden')}
          />
          {openFilter === 'municipio' && (
            <div className="absolute overflow-visible bg-surface-secondary p-2 mt-1 rounded shadow z-50">
              <input
                type="text"
                placeholder="Buscar..."
                value={columnFilters.municipio}
                onChange={e => setColumnFilters({ ...columnFilters, municipio: e.target.value })}
                className="bg-surface-primary text-white p-1 text-sm w-32"
              />
            </div>
          )}
        </div>
      ),
      selector: row => row.municipio,
      sortable: false,
      wrap: true,
      width: '180px',
      cell: row => {
        const raw = row.municipio || '';
        const formatted = titleCase(raw);
        const disp = formatted.length > 50 ? `${formatted.slice(0, 20)}...` : formatted;
        return <span title={formatted}>{disp}</span>;
      }
    },
  ];

  // ——— Columna “Estado” ———
  const estadoColumn = {
    name: (
      <div className="relative inline-block pb-11">
        <span>Estado</span>
        <Filter
          className={`inline ml-1 cursor-pointer ${columnFilters.estado ? 'text-yellow-400' : 'text-gray-500'}`}
          size={16}
          onClick={() => setOpenFilter(openFilter === 'estado' ? '' : 'estado')}
          title="Filtrar columna"
        />
        <ChevronsUpDown
          className={`inline ml-1 cursor-pointer ${
            sortState.key === 'estado' && sortState.direction ? 'text-yellow-400' : 'text-gray-500'
          }`}
          size={16}
          onClick={() => toggleSort('estado')}
          title={sortState.key!=='estado'||!sortState.direction ? 'Ordenar ascendente' : (sortState.direction==='asc' ? 'Cambiar a descendente' : 'Quitar orden')}
        />
        {openFilter === 'estado' && (
          <div className="absolute overflow-visible bg-surface-secondary p-2 mt-1 rounded shadow z-50">
            <input
              type="text"
              placeholder="Buscar..."
              value={columnFilters.estado}
              onChange={e => setColumnFilters({ ...columnFilters, estado: e.target.value })}
              className="bg-surface-primary text-white p-1 text-sm w-24"
            />
          </div>
        )}
      </div>
    ),
    selector: row => row.estado,
    sortable: false,
    wrap: true,
    width: '180px',
    cell: row => {
      const raw = row.estado ?? '-';
      const formatted = titleCase(String(raw));
      const disp = formatted.length > 50 ? `${formatted.slice(0, 20)}...` : formatted;
      return <span title={formatted}>{disp}</span>;
    }
  };

  // ——— Columnas para Seguimiento Curva S ———
  const columnsSeguimiento = [
    {
      name: (<div className="relative inline-block pb-11">Acciones</div>),
      cell: row => (
        <div className="flex space-x-2">
          <img
            src={ojoAmarillo}
            alt="Ver proyecto"
            title="Ver proyecto"
            className="w-5 h-5 cursor-pointer"
            onClick={() => {
              const rawId = String(row.id ?? '').trim();
              if (!rawId) return;
              const safeId = encodeURIComponent(rawId);
              const path = generatePath('/proyectos_generacion/:id', { id: safeId });
              navigate(path, { state: { nombre: row.nombre_proyecto ?? '' } });
            }}
          />
          <img
            src={curvaSAmarillo}
            alt="Ver curva S"
            title="Ver curva S"
            className="w-5 h-5 cursor-pointer"
            onClick={() => handleViewCurve(row)}
          />
        </div>
      ),
      ignoreRowClick: true,
      width: '100px',
    },
    ...columnsSimple
  ];

  // ——— Columnas para “Todos los proyectos” (agrega Estado) ———
  const columnsAll = [
    ...columnsSimple,
    estadoColumn,
  ];

  // ——— Estilos de filas alternadas ———
  const conditionalRowStyles = [
    { when: (_r,i) => i%2===0, style: { backgroundColor: tokens.colors.surface.primary } },
    { when: (_r,i) => i%2===1, style: { backgroundColor: tokens.colors.surface.overlay } },
  ];

  if (loadingList) return <LoadingSpinner message="Cargando lista de proyectos..." />;

  if (errorList) {
    // Asegurar que no se renderiza un objeto como hijo
    const msg = String(errorList?.message || errorList || 'Error cargando proyectos');
    return (
      <div className="bg-surface-primary p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center h-[500px]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-500 text-center max-w-md">{msg}</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-text-primary">Proyectos</h2>

      {/* ——— Pestañas ——— */}
      <div className="flex space-x-4 border-b border-[color:var(--border-subtle)] mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setColumnFilters({
                id:'', nombre:'', capacidad:'', fpo:'', avance:'',
                priorizado:'', ciclo:'', promotor:'', departamento:'',
                municipio:'', estado:''
              });
              setGlobalFilter('');
              setOpenFilter('');
              setSortState({ key: '', direction: '' });
            }}
            className={`pb-2 font-medium ${
              activeTab===tab
                ? 'border-b-2 border-[color:var(--border-highlight)] text-text-primary'
                : 'text-text-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Seguimiento Curva S */}
      {activeTab==='Seguimiento Curva S' && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Buscar..."
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              className="bg-surface-secondary placeholder:text-text-muted text-text-primary rounded p-2 w-1/3"
            />
            <button
              className="inline-flex items-center gap-2 rounded-md px-3 py-1 bg-[color:var(--accent-primary)] text-black hover:bg-[color:var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-primary)] transition"
              onClick={() => exportToCSV(sortedSeguimiento)}
            >
              <Download size={16} /> Exportar CSV
            </button>
          </div>
          <div className="relative overflow-visible">
            <DataTable
              columns={columnsSeguimiento}
              data={sortedSeguimiento}
              theme="customDark"
              conditionalRowStyles={conditionalRowStyles}
              highlightOnHover
              wrapperClassName="overflow-visible"
              className="overflow-visible"
              customStyles={tableStyles}
              pagination
              paginationIconPrevious={<ChevronLeft size={20} stroke={tokens.colors.text.secondary} />}
              paginationIconNext    ={<ChevronRight size={20} stroke={tokens.colors.text.secondary} />}
              paginationIconFirstPage={<ChevronLeft size={16} stroke={tokens.colors.text.secondary} style={{ transform: 'rotate(360deg)' }} />}
              paginationIconLastPage ={<ChevronRight size={16} stroke={tokens.colors.text.secondary} style={{ transform: 'rotate(360deg)' }} />}
            />
          </div>

          {/* Curva S Solo si showChart */}
          {showChart && (
            <Card ref={chartContainerRef} className="mt-6 p-4 min-h-[600px] scroll-mt-24">
              {loadingCurve
                ? <p className="text-text-secondary">Cargando curva S…</p>
                : errorCurve
                  ? <p className="text-text-danger">{String(errorCurve?.message || errorCurve)}</p>
                  : <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartRef} />
              }
            </Card>
          )}
        </Card>
      )}

      {/* Todos los proyectos */}
      {activeTab==='Todos los proyectos' && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Buscar..."
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              className="bg-surface-secondary placeholder:text-text-muted text-text-primary rounded p-2 w-1/3"
            />
            <button
              className="inline-flex items-center gap-2 rounded-md px-3 py-1 bg-[color:var(--accent-primary)] text-black hover:bg-[color:var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-primary)] transition"
              onClick={() => exportToCSV(sortedAll)}
            >
              <Download size={16} /> Exportar CSV
            </button>
          </div>
          <div className="relative overflow-visible">
            <DataTable
              columns={columnsAll}
              data={sortedAll}
              theme="customDark"
              conditionalRowStyles={conditionalRowStyles}
              highlightOnHover
              wrapperClassName="overflow-visible"
              className="overflow-visible"
              customStyles={tableStyles}
              pagination
              paginationIconPrevious={<ChevronLeft size={20} stroke={tokens.colors.text.secondary} />}
              paginationIconNext    ={<ChevronRight size={20} stroke={tokens.colors.text.secondary} />}
              paginationIconFirst   ={<ChevronLeft size={16} stroke={tokens.colors.text.secondary} style={{ transform: 'rotate(180deg)' }} />}
              paginationIconLast    ={<ChevronRight size={16} stroke={tokens.colors.text.secondary} style={{ transform: 'rotate(180deg)' }} />}
            />
          </div>
        </Card>
      )}

      {/* ——— Licencias ANLA ——— */}
      {activeTab==='Licencias ANLA' && (
        <Card className="p-6 text-text-secondary">
          <GraficaANLA/>
        </Card>
      )}
    </section>
  );
}

// ——— Export CSV ———
function exportToCSV(data) {
  if (!data.length) return;
  const csvRows = [
    Object.keys(data[0]).join(','),
    ...data.map(row =>
      Object.values(row)
        .map(val => `"${String(val).replace(/"/g,'""')}"`)
        .join(',')
    ),
  ];
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download','proyectos_filtrados.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
