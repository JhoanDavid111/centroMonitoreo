// src/components/ProjectGrid.jsx
import React, { useRef, useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
//import DataTable from 'react-data-table-component';
import { Download } from 'lucide-react';
import { API } from '../config/api';
import GraficaANLA from './GraficaANLA';
import DataTable, { createTheme } from 'react-data-table-component';
import ojoAmarillo from '../assets/ojoAmarillo.svg';
import curvaSAmarillo from '../assets/curvaSAmarillo.svg';

createTheme('customDark', {
  background: { default: '#262626' },
  headCells: {
    style: {
      fontSize: '16px',      // más grande
      fontWeight: '600',     // un poco más grueso
      color: '#ffffff'       // blanco puro o el color que quieras
    }
  },
  cells: {
    style: {
      fontSize: '14px',      // un poco más pequeño que el header
      fontWeight: '400',     // peso normal
      color: '#cccccc'       // gris claro
    }
  },
  rows: {
    style: { backgroundColor: '#262626' },
    highlightOnHoverStyle: {
      backgroundColor: '#3a3a3a',  // color al hover
      transition: '0.2s ease-in-out'
    }
  },
  divider: { default: '#1d1d1d' }
});


const customStyles = {
  headCells: {
    style: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
    },
  },
  cells: {
    style: {
      fontSize: '14px',
      fontWeight: '400',
      color: '#cccccc',
    },
  },
  rows: {
    style: {
      backgroundColor: '#262626',
    },
    // Éste es el bloque clave para el hover
    highlightOnHoverStyle: {
      backgroundColor: '#3a3a3a',
      transition: '0.2s ease-in-out',
    },
  },
};

// ——— Inicializar módulos de Highcharts ———
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// ——— Tema oscuro global ———
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

// Componente de Loading reutilizable
const LoadingSpinner = ({ message = "Cargando datos..." }) => (
  <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center h-64">
    <div className="flex space-x-2">
      <div
        className="w-3 h-3 rounded-full animate-bounce"
        style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }}
      ></div>
      <div
        className="w-3 h-3 rounded-full animate-bounce"
        style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }}
      ></div>
      <div
        className="w-3 h-3 rounded-full animate-bounce"
        style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }}
      ></div>
    </div>
    <p className="text-gray-300 mt-4">{message}</p>
  </div>
);

// ——— Columnas DataTable ———
const columns = [
  { name: 'ID',              selector: row => row.id,                   sortable: true },
  {
  name: 'Nombre',
  selector: row => row.nombre_proyecto,
  sortable: true,
  wrap: true,
  style: { whiteSpace: 'normal', minWidth: '200px' }
  },
  { name: 'Tipo',            selector: row => row.tipo_proyecto,        sortable: true },
  { name: 'Tecnología',      selector: row => row.tecnologia,           sortable: true },
  { name: 'Ciclo',           selector: row => row.ciclo_asignacion,     sortable: true },
  { name: 'Promotor',        selector: row => row.promotor,             sortable: true },
  { name: 'Estado',          selector: row => row.estado_proyecto,      sortable: true },
  { name: 'Departamento',    selector: row => row.departamento,         sortable: true },
  { name: 'Municipio',       selector: row => row.municipio,            sortable: true },
  { name: 'Capacidad (MW)',  selector: row => row.capacidad_instalada_mw,sortable: true },
  { name: 'FPO',             selector: row => row.fpo,                  sortable: true },
  { name: 'Priorizado',      selector: row => row.priorizado ? 'Sí' : 'No', sortable: true },
  { name: 'Avance (%)',      selector: row => row.porcentaje_avance_display, sortable: true }
]
// ——— Función para exportar a CSV ———
function exportToCSV(data) {
  if (!data.length) return;
  const csvRows = [
    Object.keys(data[0]).join(','),
    ...data.map(row =>
      Object.values(row)
        .map(val => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    ),
  ];
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'proyectos_filtrados.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ——— Columnas base para DataTable ———
const baseColumns = [
  {
    name: 'ID',
    selector: row => row.id,
    sortable: true
  },
  {
    name: 'Nombre',
    selector: row => row.nombre_proyecto,
    sortable: true,
    wrap: true,
    style: { whiteSpace: 'normal' }
  },
  {
    name: 'Tipo',
    selector: row => row.tipo_proyecto,
    sortable: true,
    wrap: true,
    style: { whiteSpace: 'normal' }
  },
  {
    name: 'Tecnología',
    selector: row => row.tecnologia,
    sortable: true,
    wrap: true,
    style: { whiteSpace: 'normal' }
  },
  {
    name: 'Ciclo',
    selector: row => row.ciclo_asignacion,
    sortable: true,
    wrap: true,
    style: { whiteSpace: 'normal' }
  },
  {
    name: 'Promotor',
    selector: row => row.promotor,
    sortable: true,
    wrap: true,
    style: { whiteSpace: 'normal' }
  },
  {
    name: 'Estado',
    selector: row => row.estado_proyecto,
    sortable: true,
    wrap: true,
    style: { whiteSpace: 'normal' }
  },
  {
    name: 'Depto',
    selector: row => row.departamento,
    sortable: true,
    wrap: true,
    style: { whiteSpace: 'normal' }
  },
  {
    name: 'Municipio',
    selector: row => row.municipio,
    sortable: true,
    wrap: true,
    style: { whiteSpace: 'normal' }
  },
  {
    name: 'Capacidad',
    selector: row => row.capacidad_instalada_mw,
    sortable: true,
    wrap: true,
    style: { whiteSpace: 'normal' }
  },
  {
    name: 'FPO',
    selector: row => row.fpo,
    sortable: true,
    wrap: true,
    style: { whiteSpace: 'normal' }
  },
  {
    name: 'Priorizado',
    selector: row => row.priorizado ? 'Sí' : 'No',
    sortable: true,
    wrap: true,
    style: { whiteSpace: 'normal' }
  },
  {
    name: 'Avance (%)',
    selector: row => row.porcentaje_avance_display,
    sortable: true,
    wrap: true,
    style: { whiteSpace: 'normal' }
  },
];

// ——— Opciones base del gráfico ———
const baseChartOptions = {
  chart:    { type: 'spline', height: 300 },
  title:    { text: 'Curva S – Proyecto', style: { color: '#fff' } },
  xAxis:    {
    categories: [],
    title:      { text: 'Fecha', style: { color: '#ccc' } },
    labels:     { style: { color: '#ccc', fontSize: '10px' } },
    gridLineColor: '#333',
  },
  yAxis:    {
    title: { text: 'Curva de Referencia', style: { color: '#ccc' } },
    min: 0, max: 100,
  },
  tooltip:  {
    backgroundColor: '#1f2937',
    style:           { color: '#fff', fontSize: '12px' },
    formatter() {
      return `<b>${this.x}</b><br/>Avance: ${this.y}%<br/>Hito: ${this.point.hito_nombre}`;
    },
  },
  plotOptions: {
    spline: { marker: { enabled: true } },
  },
  series: [{ name: 'Curva de Referencia', data: [] }],
  exporting: {
    enabled: true,
    buttons: {
      contextButton: {
        menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG'],
      },
    },
  },
};

// Componente de botón de ayuda reutilizable
const HelpButton = ({ onClick, className = "" }) => (
  <button
    className={`absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors ${className}`}
    style={{ width: 30, height: 30 }}
    title="Ayuda"
    onClick={onClick}
    type="button"
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      className="rounded-full"
    >
      <circle cx="12" cy="12" r="10" fill="#444" stroke="#fff" strokeWidth="2.5" />
      <text
        x="12"
        y="18"
        textAnchor="middle"
        fontSize="16"
        fill="#fff"
        fontWeight="bold"
        fontFamily="Nunito Sans, sans-serif"
        pointerEvents="none"
      >?</text>
    </svg>
  </button>
);

export default function ProyectoDetalle() {
  const chartRef = useRef(null);
  const tabs = ['Seguimiento Curva S', 'Todos los proyectos', 'Proyectos ANLA'];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Estados de datos y UI
  const [proyectos, setProyectos]       = useState([]);
  const [loadingList, setLoadingList]   = useState(true);
  const [errorList, setErrorList]       = useState(null);
  const [chartOptions, setChartOptions] = useState(baseChartOptions);
  const [loadingCurve, setLoadingCurve] = useState(false);
  const [errorCurve, setErrorCurve]     = useState(null);

  // Estados de filtros
  const [globalFilter, setGlobalFilter] = useState('');
  const [tipoFilter, setTipoFilter]     = useState('');
  const [tecFilter, setTecFilter]       = useState('');
  const [deptoFilter, setDeptoFilter]   = useState('');
  const [cicloFilter, setCicloFilter]   = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');

  // Carga inicial de proyectos
  useEffect(() => {
    async function fetchList() {
      setLoadingList(true);
      setErrorList(null);
      try {
        const res  = await fetch(`${API}/v1/graficas/6g_proyecto/listado_proyectos_curva_s`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const formatted = data.map(p => ({
          ...p,
          fpo: p.fpo ? p.fpo.split('T')[0] : '-',
          porcentaje_avance_display: p.porcentaje_avance != null ? `${p.porcentaje_avance}%` : '-',
          priorizado: p.priorizado,
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

  // Cargar curva S al hacer clic
  const handleViewCurve = async row => {
    const id = row.id;
    setLoadingCurve(true);
    setErrorCurve(null);
    try {
      const res  = await fetch(`${API}/v1/graficas/6g_proyecto/grafica_curva_s/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const title = `Curva S – Proyecto ${id} – ${row.nombre_proyecto}`;
      if (!Array.isArray(data) || data.length === 0) {
        setErrorCurve(`No existe curva S para el proyecto ${id}.`);
        setChartOptions({ ...baseChartOptions, title: { ...baseChartOptions.title, text: title } });
      } else {
        const curve = data.map(pt => ({ fecha: pt.fecha.split('T')[0], avance: pt.avance, hito_nombre: pt.hito_nombre }));
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
    }
  };

  // Filtro por dropdowns
  const filteredByDropdowns = proyectos
    .filter(row => (tipoFilter   ? row.tipo_proyecto    === tipoFilter   : true))
    .filter(row => (tecFilter    ? row.tecnologia       === tecFilter    : true))
    .filter(row => (deptoFilter  ? row.departamento     === deptoFilter  : true))
    .filter(row => (cicloFilter  ? row.ciclo_asignacion === cicloFilter  : true))
    .filter(row => (estadoFilter ? row.estado_proyecto === estadoFilter : true));

  // Filtro global
  const filteredGlobal = filteredByDropdowns.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(globalFilter.toLowerCase())
    )
  );

  // Solo IDs numéricos para la primera pestaña
  const filteredNumeric = filteredGlobal.filter(row => /^[0-9]+$/.test(row.id));

  // Columnas específicas para "Seguimiento Curva S"
  const columnsSeguimiento = [
        {
      name: 'Acciones',
      cell: row => (
        <div className="flex space-x-2">
          <img
            src={ojoAmarillo}
            alt="Ver proyecto"
            title="Ver proyecto"
            className="w-5 h-5 cursor-pointer"
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
      sortable: false,
      width: '100px',
    },
    { name: 'ID', selector: row => row.id, sortable: true },

    ...baseColumns.filter(col => col.name !== 'ID'),
  ];

  // Estilos de filas alternadas
  const conditionalRowStyles = [
    {
      when: (_row, index) => index % 2 === 0,      // filas pares: índice 0,2,4...
      style: { backgroundColor: '#262626' },
    },
    {
      when: (_row, index) => index % 2 === 1,      // filas impares: índice 1,3,5...
      style: { backgroundColor: '#1d1d1d' },
    },
  ];

  if (loadingList) return <LoadingSpinner message="Cargando lista de proyectos..." />;
   if (errorList) return (
    <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center h-[500px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-red-500 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-red-500 text-center max-w-md">{errorList}</p>
    </div>
  );

  return (
    <section className="space-y-6">
      <h2 className="text-2xl text-[#D1D1D0] font-semibold">Proyectos</h2>

      {/* Pestañas */}
      <div className="flex space-x-4 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 text-[18px] ${
              activeTab === tab ? ' border-[#FFC600] border-b-2 text-[#FFC600]' : 'text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Seguimiento Curva S */}
      {activeTab === 'Seguimiento Curva S' && (
        <div className="bg-[#262626] p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <input
              type="text"
              placeholder="Buscar..."
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              className="bg-[#1f1f1f] placeholder-gray-500 text-white rounded p-2 text-sm md:w-1/4"
            />
            <div className="flex gap-2 flex-wrap items-center">
              <select onChange={e => setTipoFilter(e.target.value)} className="bg-[#1f1f1f] text-white rounded p-1 text-sm">
                <option value="">Todos los tipos</option>
                {[...new Set(proyectos.map(p => p.tipo_proyecto))].map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              <select onChange={e => setTecFilter(e.target.value)} className="bg-[#1f1f1f] text-white rounded p-1 text-sm">
                <option value="">Todas las tecnologías</option>
                {[...new Set(proyectos.map(p => p.tecnologia))].map(tec => (
                  <option key={tec} value={tec}>{tec}</option>
                ))}
              </select>
              <select onChange={e => setDeptoFilter(e.target.value)} className="bg-[#1f1f1f] text-white rounded p-1 text-sm">
                <option value="">Todos los departamentos</option>
                {[...new Set(proyectos.map(p => p.departamento))].map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
              <select onChange={e => setCicloFilter(e.target.value)} className="bg-[#1f1f1f] text-white rounded p-1 text-sm">
                <option value="">Todos los ciclos</option>
                {[...new Set(proyectos.map(p => p.ciclo_asignacion))].map(ciclo => (
                  <option key={ciclo} value={ciclo}>{ciclo}</option>
                ))}
              </select>
              <select onChange={e => setEstadoFilter(e.target.value)} className="bg-[#1f1f1f] text-white rounded p-1 text-sm">
                <option value="">Todos los estados</option>
                {[...new Set(proyectos.map(p => p.estado_proyecto))].map(est => (
                  <option key={est} value={est}>{est}</option>
                ))}
              </select>
            </div>
            <button
              className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-3 py-1 rounded hover:bg-yellow-500"
              onClick={() => exportToCSV(filteredNumeric)}
            >
              <Download size={16} /> Exportar CSV
            </button>
          </div>

          <DataTable
            columns={columnsSeguimiento}
            data={filteredNumeric}
            pagination           
            pointerOnHover
            conditionalRowStyles={conditionalRowStyles}
            theme="customDark"
            highlightOnHover
            customStyles={customStyles}
          />

          <div className="mt-6 bg-[#262626] p-4 rounded-lg shadow">
            {loadingCurve
              ? <p className="text-gray-300">Cargando curva S…</p>
              : errorCurve
                ? <p className="text-red-500">{errorCurve}</p>
                : <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartRef} />
            }
          </div>
        </div>
      )}

      {/* Todos los proyectos */}
      {activeTab === 'Todos los proyectos' && (
        <div className="bg-[#262626] p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <input
              type="text"
              placeholder="Buscar..."
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              className="bg-[#1f1f1f] placeholder-gray-500 text-white rounded p-2 text-sm md:w-1/4"
            />
            <div className="flex gap-2 flex-wrap items-center">
              <select onChange={e => setTipoFilter(e.target.value)} className="bg-[#1f1f1f] text-white rounded p-1 text-sm">
                <option value="">Todos los tipos</option>
                {[...new Set(proyectos.map(p => p.tipo_proyecto))].map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              <select onChange={e => setTecFilter(e.target.value)} className="bg-[#1f1f1f] text-white rounded p-1 text-sm">
                <option value="">Todas las tecnologías</option>
                {[...new Set(proyectos.map(p => p.tecnologia))].map(tec => (
                  <option key={tec} value={tec}>{tec}</option>
                ))}
              </select>
              <select onChange={e => setDeptoFilter(e.target.value)} className="bg-[#1f1f1f] text-white rounded p-1 text-sm">
                <option value="">Todos los departamentos</option>
                {[...new Set(proyectos.map(p => p.departamento))].map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
              <select onChange={e => setCicloFilter(e.target.value)} className="bg-[#1f1f1f] text-white rounded p-1 text-sm">
                <option value="">Todos los ciclos</option>
                {[...new Set(proyectos.map(p => p.ciclo_asignacion))].map(ciclo => (
                  <option key={ciclo} value={ciclo}>{ciclo}</option>
                ))}
              </select>
              <select onChange={e => setEstadoFilter(e.target.value)} className="bg-[#1f1f1f] text-white rounded p-1 text-sm">
                <option value="">Todos los estados</option>
                {[...new Set(proyectos.map(p => p.estado_proyecto))].map(est => (
                  <option key={est} value={est}>{est}</option>
                ))}
              </select>
            </div>
            <button
              className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-3 py-1 rounded hover:bg-yellow-500"
              onClick={() => exportToCSV(filteredGlobal)}
            >
              <Download size={16} /> Exportar CSV
            </button>
          </div>

          <DataTable
            columns={baseColumns}
            data={filteredGlobal}
            pagination
            highlightOnHover
            pointerOnHover
            theme="customDark"
            conditionalRowStyles={conditionalRowStyles}
            customStyles={customStyles}
          />
        </div>
      )}

      {/* Proyectos ANLA */}
      {activeTab === 'Proyectos ANLA' && (
        <div className="bg-[#262626] p-6 rounded-lg shadow text-gray-400">
          <GraficaANLA />
        </div>
      )}
    </section>
  );
}
