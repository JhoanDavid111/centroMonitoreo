// src/components/ProjectGrid.jsx
import React, { useRef, useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
import DataTable, { createTheme } from 'react-data-table-component';
import { Download, Filter } from 'lucide-react';
import ojoAmarillo from '../assets/ojoAmarillo.svg';
import curvaSAmarillo from '../assets/curvaSAmarillo.svg';
import { API } from '../config/api';
import GraficaANLA from './GraficaANLA';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ——— Tema oscuro para DataTable ———
createTheme('customDark', {
  background: { default: '#262626' },
  headCells: {
    style: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
    }
  },
  cells: {
    style: {
      fontSize: '14px',
      fontWeight: '400',
      color: '#cccccc',
    }
  },
  rows: {
    style: { backgroundColor: '#262626' },
    highlightOnHoverStyle: {
      backgroundColor: '#3a3a3a',
      transition: '0.2s ease-in-out'
    }
  },
  divider: { default: '#1d1d1d' },
});

// ——— Estilos extra (paginación) ———
const customStyles = {
  tableWrapper: {
    style: {
      overflow: 'visible',    // que la tabla no limite el popup
    }
  },
  table: {
    style: {
      overflow: 'visible',    // que la tabla no limite el popup
    }
  },
  headCells: {
    style: {
      overflow: 'visible',    // que la cabecera permita el popup
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
    }
  },
  cells: {
    style: {
      overflow: 'visible',    // que las celdas permitan el popup
      fontSize: '14px',
      fontWeight: '400',
      color: '#cccccc',
    }
  },
  rows: {
    style: {
      backgroundColor: '#262626',
    },
    highlightOnHoverStyle: {
      backgroundColor: '#3a3a3a',
      transition: '0.2s ease-in-out',
    },
  },
  pagination: {
    style: {
      backgroundColor: '#262626',
      color: '#cccccc',
      borderTop: '1px solid #1d1d1d',
      padding: '8px',
    },
  },
  paginationButtons: {
    style: {
      color: '#cccccc',
      '&:hover': {
        backgroundColor: '#3a3a3a',
      },
      // Para los SVG de Lucide:
      '& svg': {
        stroke: '#cccccc',
      },
      // Y por si el icono lleva paths con stroke propio:
      '& svg path': {
        stroke: '#cccccc',
      },
    },
  },
};

// ——— Inicializar módulos de Highcharts ———
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// ——— Opciones globales de Highcharts ———
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' },
    plotBorderWidth: 0,
    plotBackgroundColor: 'transparent',
  },
  title:    { style: { color: '#fff', fontSize: '16px', fontWeight: '600' } },
  subtitle: { style: { color: '#aaa', fontSize: '12px' } },
  xAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px' } },
    title:  { style: { color: '#ccc' } },
    gridLineColor: '#333',
  },
  yAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px' } },
    title:  { style: { color: '#ccc' } },
    gridLineColor: '#333',
  },
  legend: {
    itemStyle:       { color: '#ccc', fontFamily: 'Nunito Sans' },
    itemHoverStyle:  { color: '#fff' },
    itemHiddenStyle: { color: '#666' },
  },
  tooltip: {
    backgroundColor: '#1f2937',
    style:           { color: '#fff', fontSize: '12px' },
  },
});

// ——— Componente reutilizable de carga ———
const LoadingSpinner = ({ message = "Cargando datos..." }) => (
  <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center h-64">
    <div className="flex space-x-2">
      <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }} />
      <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }} />
      <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }} />
    </div>
    <p className="text-gray-300 mt-4">{message}</p>
  </div>
);

// ——— Opciones base de la Curva S ———
const baseChartOptions = {
  chart:    { type: 'spline', height: 300 },
  title:    { text: 'Curva S – Proyecto', style: { color: '#fff' } },
  xAxis:    {
    categories: [],
    title:      { text: 'Fecha', style: { color: '#ccc' } },
    labels:     { style: { color: '#ccc', fontSize: '10px' } },
    gridLineColor: '#333',
  },
  yAxis:    { title: { text: 'Curva de Referencia', style: { color: '#ccc' } }, min: 0, max: 100 },
  tooltip:  {
    backgroundColor: '#1f2937',
    style:           { color: '#fff', fontSize: '12px' },
    formatter() {
      return `<b>${this.x}</b><br/>Avance: ${this.y}%<br/>Hito: ${this.point.hito_nombre}`;
    },
  },
  plotOptions: { spline: { marker: { enabled: true } } },
  series:      [{ name: 'Curva de Referencia', data: [] }],
  exporting:   {
    enabled: true,
    buttons: {
      contextButton: { menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG'] },
    }
  },
};

export default function ProyectoDetalle() {
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);
  const tabs = ['Seguimiento Curva S', 'Todos los proyectos', 'Proyectos ANLA'];
  const [activeTab, setActiveTab]         = useState(tabs[0]);
  const [proyectos, setProyectos]         = useState([]);
  const [loadingList, setLoadingList]     = useState(true);
  const [errorList, setErrorList]         = useState(null);
  const [chartOptions, setChartOptions]   = useState(baseChartOptions);
  const [loadingCurve, setLoadingCurve]   = useState(false);
  const [errorCurve, setErrorCurve]       = useState(null);

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
    municipio: ''
  });
  const [globalFilter, setGlobalFilter] = useState('');
  const [openFilter, setOpenFilter]       = useState('');

  // ——— Carga inicial de proyectos ———
  useEffect(() => {
    async function fetchList() {
      setLoadingList(true);
      setErrorList(null);
      try {
        const res  = await fetch(
          `http://192.168.8.138:8002/v1/graficas/6g_proyecto/listado_proyectos_curva_s`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const formatted = data.map(p => ({
          ...p,
          fpo: p.fpo ? p.fpo.split('T')[0] : '-',
          porcentaje_avance_display: p.porcentaje_avance != null ? `${p.porcentaje_avance}%` : '-',
        }));
        setProyectos(formatted);
      } catch (err) {
        console.error(err);
        setErrorList('No fue posible cargar los proyectos.');
      } finally {
        setLoadingList(false);
      }
    }
    fetchList();
  }, []);

  // ——— Al hacer clic en Curva S ———
  const handleViewCurve = async row => {
    setLoadingCurve(true);
    setErrorCurve(null);
    try {
      const res  = await fetch(
        `http://192.168.8.138:8002/v1/graficas/6g_proyecto/grafica_curva_s/${row.id}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const title = `Curva S – Proyecto ${row.id} – ${row.nombre_proyecto}`;
      if (!Array.isArray(data) || data.length === 0) {
        setErrorCurve(`No existe curva S para el proyecto ${row.id}.`);
        setChartOptions({ ...baseChartOptions, title: { ...baseChartOptions.title, text: title } });
      } else {
        const curve = data.map(pt => ({
          fecha:       pt.fecha.split('T')[0],
          avance:      pt.avance,
          hito_nombre: pt.hito_nombre
        }));
        setErrorCurve(null);
        setChartOptions({
          ...baseChartOptions,
          title: { ...baseChartOptions.title, text: title },
          xAxis: {
            ...baseChartOptions.xAxis,
            categories: curve.map(pt => pt.fecha),
            tickInterval: 1,
            labels: { ...baseChartOptions.xAxis.labels, rotation: -45, step: 1, autoRotation: false },
          },
          series: [{ name: 'Curva de Referencia', data: curve.map(pt => ({ y: pt.avance, hito_nombre: pt.hito_nombre })) }],
        });
      }
    } catch (err) {
      console.error(err);
      setErrorCurve('No fue posible cargar la curva S.');
    } finally {
      setLoadingCurve(false);
      // Scroll automático al contenedor de la curva S
      chartContainerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
      });
    }
  };

  function applyGlobal(row) {
  if (!globalFilter) return true;
  return Object.values({
    id: row.id,
    nombre: row.nombre_proyecto,
    capacidad: row.capacidad_instalada_mw,
    fpo: row.fpo,
    avance: row.porcentaje_avance_display,
    promotor: row.promotor
  })
  .some(v => String(v).toLowerCase().includes(globalFilter.toLowerCase()));
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
  .filter(applyGlobal);

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
  municipio: ''
};

  // Función helper para capitalizar cada palabra omitiendo conectores
function titleCase(raw) {
  const connectors = ['y','de','la','el','los','las','en','a','por','para','con','sin','del','al','o','u'];
  return raw
    .split(' ')
    .map((word, index) => {
      // Si es acrónimo con puntos, todo en mayúscula
      if (word.includes('.')) {
        return word.toUpperCase();
      }
      const lower = word.toLowerCase();
      // Conectores en minúscula si no es la primera palabra
      if (index > 0 && connectors.includes(lower)) {
        return lower;
      }
      // Capitalizar primera letra
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}


  // ——— Columnas compartidas ———
const columnsSimple = [
  {
    name: (
      <div className="relative inline-block pb-11">
        <span>ID</span>
        <Filter
          className={`inline ml-1 cursor-pointer ${
            columnFilters.id ? 'text-yellow-400' : 'text-gray-500'
          }`}
          size={16}
          onClick={() => setOpenFilter(openFilter==='id'?'':'id')}
        />
        {openFilter==='id' && (
          <div className="absolute bg-[#1f1f1f] p-2 mt-1 rounded shadow z-50">
            <input
              type="text"
              placeholder="Buscar..."
              value={columnFilters.id}
              onChange={e => setColumnFilters({ ...columnFilters, id: e.target.value })}
              className="bg-[#262626] text-white p-1 text-sm w-16"
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
          className={`inline ml-1 cursor-pointer ${
            columnFilters.nombre ? 'text-yellow-400' : 'text-gray-500'
          }`}
          size={16}
          onClick={() => setOpenFilter(openFilter==='nombre'?'':'nombre')}
        />
        {openFilter==='nombre' && (
          <div className="absolute bg-[#1f1f1f] p-2 mt-1 rounded shadow z-50">
            <input
              type="text"
              placeholder="Buscar..."
              value={columnFilters.nombre}
              onChange={e => setColumnFilters({ ...columnFilters, nombre: e.target.value })}
              className="bg-[#262626] text-white p-1 text-sm w-32"
            />
          </div>
        )}
      </div>
    ),
    selector: row => row.nombre_proyecto,
    sortable: false,
    wrap: true,
    minWidth: '200px',
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
          className={`inline ml-1 cursor-pointer ${
            columnFilters.capacidad ? 'text-yellow-400' : 'text-gray-500'
          }`}
          size={16}
          onClick={() => setOpenFilter(openFilter==='capacidad'?'':'capacidad')}
        />
        {openFilter==='capacidad' && (
          <div className="absolute bg-[#1f1f1f] p-2 mt-1 rounded shadow z-50">
            <input
              type="text"
              placeholder="Buscar..."
              value={columnFilters.capacidad}
              onChange={e => setColumnFilters({ ...columnFilters, capacidad: e.target.value })}
              className="bg-[#262626] text-white p-1 text-sm w-16"
            />
          </div>
        )}
      </div>
    ),
    selector: row => row.capacidad_instalada_mw,
    sortable: false,
    wrap: true,
    width: '130px',
    cell: row => (`${row.capacidad_instalada_mw} MW`),
  },
  {
    name: (
      <div className="relative inline-block pb-11">
        <span>FPO</span>
        <Filter
          className={`inline ml-1 cursor-pointer ${
            columnFilters.fpo ? 'text-yellow-400' : 'text-gray-500'
          }`}
          size={16}
          onClick={() => setOpenFilter(openFilter==='fpo'?'':'fpo')}
        />
        {openFilter==='fpo' && (
          <div className="absolute bg-[#1f1f1f] p-2 mt-1 rounded shadow z-50">
            <input
              type="text"
              placeholder="Buscar..."
              value={columnFilters.fpo}
              onChange={e => setColumnFilters({ ...columnFilters, fpo: e.target.value })}
              className="bg-[#262626] text-white p-1 text-sm w-24"
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
          className={`inline ml-1 cursor-pointer ${
            columnFilters.avance ? 'text-yellow-400' : 'text-gray-500'
          }`}
          size={16}
          onClick={() => setOpenFilter(openFilter==='avance'?'':'avance')}
        />
        {openFilter==='avance' && (
          <div className="absolute bg-[#1f1f1f] p-2 mt-1 rounded shadow z-50">
            <input
              type="text"
              placeholder="Buscar..."
              value={columnFilters.avance}
              onChange={e => setColumnFilters({ ...columnFilters, avance: e.target.value })}
              className="bg-[#262626] text-white p-1 text-sm w-16"
            />
          </div>
        )}
      </div>
    ),
    selector: row => row.porcentaje_avance_display,
    sortable: false,
    wrap: true,
    width: '120px',
  },
    // Priorizado
  {
    name: (
      <div className="relative inline-block pb-11">
        <span>Priorizado</span>
        <Filter
          className={`inline ml-1 cursor-pointer ${
            columnFilters.priorizado ? 'text-yellow-400' : 'text-gray-500'
          }`}
          size={16}
          onClick={() => setOpenFilter(openFilter==='priorizado'?'':'priorizado')}
        />
        {openFilter === 'priorizado' && (
          <div className="absolute overflow-visible bg-[#1f1f1f] p-2 mt-1 rounded shadow z-50">
            <input
              type="text"
              placeholder="Buscar..."
              value={columnFilters.priorizado}
              onChange={e => setColumnFilters({ ...columnFilters, priorizado: e.target.value })}
              className="bg-[#262626] text-white p-1 text-sm w-16"
            />
          </div>
        )}
      </div>
    ),
    selector: row => row.priorizado,
    sortable: false,
    wrap: true,
    width: '130px',
  },
  // Ciclo
  {
    name: (
      <div className="relative inline-block pb-11">
        <span>Ciclo</span>
        <Filter
          className={`inline ml-1 cursor-pointer ${
            columnFilters.ciclo ? 'text-yellow-400' : 'text-gray-500'
          }`}
          size={16}
          onClick={() => setOpenFilter(openFilter==='ciclo'?'':'ciclo')}
        />
        {openFilter === 'ciclo' && (
          <div className="absolute overflow-visible bg-[#1f1f1f] p-2 mt-1 rounded shadow z-50">
            <input
              type="text"
              placeholder="Buscar..."
              value={columnFilters.ciclo}
              onChange={e => setColumnFilters({ ...columnFilters, ciclo: e.target.value })}
              className="bg-[#262626] text-white p-1 text-sm w-24"
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
          className={`inline ml-1 cursor-pointer ${
            columnFilters.promotor ? 'text-yellow-400' : 'text-gray-500'
          }`}
          size={16}
          onClick={() => setOpenFilter(openFilter==='promotor'?'':'promotor')}
        />
        {openFilter==='promotor' && (
          <div className="absolute bg-[#1f1f1f] p-2 mt-1 rounded shadow z-50">
            <input
              type="text"
              placeholder="Buscar..."
              value={columnFilters.promotor}
              onChange={e => setColumnFilters({ ...columnFilters, promotor: e.target.value })}
              className="bg-[#262626] text-white p-1 text-sm w-32"
            />
          </div>
        )}
      </div>
    ),
    selector: row => row.promotor,
    sortable: false,
    wrap: true,
    minWidth: '200px',
    cell: row => {
      const raw = row.promotor || '';
      const formatted = titleCase(raw);
      const disp = formatted.length > 50 ? `${formatted.slice(0, 20)}...` : formatted;
      return <span title={formatted}>{disp}</span>;
    }
  },
    // Departamento
  {
    name: (
      <div className="relative inline-block pb-11">
        <span>Departamento</span>
        <Filter
          className={`inline ml-1 cursor-pointer ${
            columnFilters.departamento ? 'text-yellow-400' : 'text-gray-500'
          }`}
          size={16}
          onClick={() => setOpenFilter(openFilter==='departamento'?'':'departamento')}
        />
        {openFilter === 'departamento' && (
          <div className="absolute overflow-visible bg-[#1f1f1f] p-2 mt-1 rounded shadow z-50">
            <input
              type="text"
              placeholder="Buscar..."
              value={columnFilters.departamento}
              onChange={e => setColumnFilters({ ...columnFilters, departamento: e.target.value })}
              className="bg-[#262626] text-white p-1 text-sm w-32"
            />
          </div>
        )}
      </div>
    ),
    selector: row => row.departamento,
    sortable: false,
    wrap: true,
    minWidth: '180px',
    cell: row => {
      const raw = row.departamento || '';
      const formatted = titleCase(raw);
      const disp = formatted.length > 50 ? `${formatted.slice(0, 20)}...` : formatted;
      return <span title={formatted}>{disp}</span>;
    }
  },
  // Municipio
  {
    name: (
      <div className="relative inline-block pb-11">
        <span>Municipio</span>
        <Filter
          className={`inline ml-1 cursor-pointer ${
            columnFilters.municipio ? 'text-yellow-400' : 'text-gray-500'
          }`}
          size={16}
          onClick={() => setOpenFilter(openFilter==='municipio'?'':'municipio')}
        />
        {openFilter === 'municipio' && (
          <div className="absolute overflow-visible bg-[#1f1f1f] p-2 mt-1 rounded shadow z-50">
            <input
              type="text"
              placeholder="Buscar..."
              value={columnFilters.municipio}
              onChange={e => setColumnFilters({ ...columnFilters, municipio: e.target.value })}
              className="bg-[#262626] text-white p-1 text-sm w-32"
            />
          </div>
        )}
      </div>
    ),
    selector: row => row.municipio,
    sortable: false,
    wrap: true,
    minWidth: '180px',
    cell: row => {
      const raw = row.municipio || '';
      const formatted = titleCase(raw);
      const disp = formatted.length > 50 ? `${formatted.slice(0, 20)}...` : formatted;
      return <span title={formatted}>{disp}</span>;
    }
  },
];


  // ——— Columnas para Seguimiento Curva S ———
const columnsSeguimiento = [
  {
    name: (
      <div className="relative inline-block pb-11">
        Acciones
      </div>
    ),
    cell: row => (
      <div className="flex space-x-2">
        <img src={ojoAmarillo} alt="Ver proyecto" title="Ver proyecto" className="w-5 h-5 cursor-pointer"/>
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
    allowOverflow: true,
    button: true,
    width: '100px',
  },
  ...columnsSimple
];

  // ——— Estilos de filas alternadas ———
  const conditionalRowStyles = [
    { when: (_r,i) => i%2===0, style: { backgroundColor: '#262626' } },
    { when: (_r,i) => i%2===1, style: { backgroundColor: '#1d1d1d' } },
  ];

  if (loadingList) return <LoadingSpinner message="Cargando lista de proyectos..." />;
  if (errorList)   return (
    <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center h-[500px]">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-red-500 text-center max-w-md">{errorList}</p>
    </div>
  );

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Proyectos</h2>

      {/* ——— Pestañas ——— */}
      <div className="flex space-x-4 border-b border-gray-700 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              // resetea filtros y búsqueda al cambiar de vista:
              setColumnFilters(initialFilters);
              setGlobalFilter('');
              setOpenFilter('');
            }}
            className={`pb-2 font-medium ${
              activeTab===tab
                ? 'border-b-2 border-yellow-500 text-white'
                : 'text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Seguimiento Curva S */}
      {activeTab==='Seguimiento Curva S' && (
        <div className="bg-[#262626] p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Buscar..."
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            className="bg-[#1f1f1f] placeholder-gray-500 text-white rounded p-2 w-1/3"
          />
          <button
            className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-3 py-1 rounded hover:bg-yellow-500"
            onClick={() => exportToCSV(filteredSeguimiento)}
          >
            <Download size={16} /> Exportar CSV
          </button>
        </div>
          <div className="relative overflow-visible">
            <DataTable
              columns={columnsSeguimiento}
              data={filteredSeguimiento}
              theme="customDark"
              conditionalRowStyles={conditionalRowStyles}
              highlightOnHover
              wrapperClassName="overflow-visible"
              className="overflow-visible"
              customStyles={customStyles}
              pagination
              paginationIconPrevious={<ChevronLeft size={20} stroke="#cccccc" />}
              paginationIconNext    ={<ChevronRight size={20} stroke="#cccccc" />}
              paginationIconFirstPage={<ChevronLeft size={16} stroke="#cccccc" style={{ transform: 'rotate(360deg)' }} />}
              paginationIconLastPage ={<ChevronRight size={16} stroke="#cccccc" style={{ transform: 'rotate(360deg)' }} />}
            />
          </div>
          {/* Curva Chart */}
          <div
          ref={chartContainerRef}
          className="mt-6 bg-[#262626] p-4 rounded-lg shadow">
            {loadingCurve
              ? <p className="text-gray-300">Cargando curva S…</p>
              : errorCurve
                ? <p className="text-red-500">{errorCurve}</p>
                : <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                    ref={chartRef}
                  />
            }
          </div>
        </div>
      )}

      {/* Todos los proyectos */}
      {activeTab==='Todos los proyectos' && (
        <div className="bg-[#262626] p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Buscar..."
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            className="bg-[#1f1f1f] placeholder-gray-500 text-white rounded p-2 w-1/3"
          />
          <button
            className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-3 py-1 rounded hover:bg-yellow-500"
            onClick={() => exportToCSV(filteredAll)}
          >
            <Download size={16} /> Exportar CSV
          </button>
        </div>
          <div className="relative overflow-visible">
            <DataTable
              columns={columnsSimple}
              data={filteredAll}
              theme="customDark"
              conditionalRowStyles={conditionalRowStyles}
              highlightOnHover
              wrapperClassName="overflow-visible"
              className="overflow-visible"
              customStyles={customStyles}
              pagination
              paginationIconPrevious={<ChevronLeft size={20} stroke="#cccccc" />}
              paginationIconNext    ={<ChevronRight size={20} stroke="#cccccc" />}
              paginationIconFirst   ={<ChevronLeft size={16} stroke="#cccccc" style={{ transform: 'rotate(180deg)' }} />}
              paginationIconLast    ={<ChevronRight size={16} stroke="#cccccc" style={{ transform: 'rotate(180deg)' }} />}
            />
          </div>
        </div>
      )}

      {/* ——— Proyectos ANLA ——— */}
      {activeTab==='Proyectos ANLA' && (
        <div className="bg-[#262626] p-6 rounded-lg shadow text-gray-400">
          <GraficaANLA/>
        </div>
      )}
    </section>
  );
}

// ——— Función para exportar a CSV ———
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