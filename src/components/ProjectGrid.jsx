// src/components/ProjectGrid.jsx
import React, { useRef, useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
import DataTable from 'react-data-table-component';
import { Download, Search } from 'lucide-react';
import { API } from '../config/api';
import GraficaANLA from './GraficaANLA'; // Nuevo import


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
    plotBackgroundColor: 'transparent'
  },
  title:    { style: { color: '#fff', fontSize: '16px', fontWeight: '600' } },
  subtitle: { style: { color: '#aaa', fontSize: '12px' } },
  xAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px' } },
    title:  { style: { color: '#ccc' } },
    gridLineColor: '#333'
  },
  yAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px' } },
    title:  { style: { color: '#ccc' } },
    gridLineColor: '#333'
  },
  legend: {
    itemStyle:       { color: '#ccc', fontFamily: 'Nunito Sans' },
    itemHoverStyle:  { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#1f2937',
    style:           { color: '#fff', fontSize: '12px' }
  }
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
  { name: 'Nombre',          selector: row => row.nombre_proyecto,      sortable: true },
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
];

// ——— Opciones base del gráfico ———
const baseChartOptions = {
  chart:    { type: 'spline', height: 300 },
  title:    { text: 'Curva S – Proyecto', style: { color: '#fff' } },
  xAxis:    {
    categories: [],
    title:      { text: 'Fecha', style: { color: '#ccc' } },
    labels:     { style: { color: '#ccc', fontSize: '10px' } },
    gridLineColor: '#333'
  },
  yAxis:    {
    title: { text: 'Curva de Referencia', style: { color: '#ccc' } },
    min: 0, max: 100
  },
  tooltip:  {
    backgroundColor: '#1f2937',
    style:           { color: '#fff', fontSize: '12px' },
    formatter() {
      return `<b>${this.x}</b><br/>Avance: ${this.y}%<br/>Hito: ${this.point.hito_nombre}`;
    }
  },
  plotOptions: {
    spline: { marker: { enabled: true } }
  },
  series: [{ name: 'Curva de Referencia', data: [] }],
  exporting: {
    enabled: true,
    buttons: {
      contextButton: {
        menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
      }
    }
  }
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

  // Estados
  const [proyectos, setProyectos]       = useState([]);
  const [loadingList, setLoadingList]   = useState(true);
  const [errorList, setErrorList]       = useState(null);
  const [chartOptions, setChartOptions] = useState(baseChartOptions);
  const [loadingCurve, setLoadingCurve] = useState(false);
  const [errorCurve, setErrorCurve]     = useState(null);
  const [filterText, setFilterText]     = useState('');

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
          priorizado: p.priorizado
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

  // Obtiene curva S automáticamente al seleccionar fila
  const handleRowClick = async row => {
    const id = row.id;
    setLoadingCurve(true);
    setErrorCurve(null);
    try {
      const res  = await fetch(`${API}/v1/graficas/6g_proyecto/grafica_curva_s/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const title = `Curva S – Proyecto ${id}`;
      if (!Array.isArray(data) || data.length === 0) {
        setErrorCurve(`No existe curva S para el proyecto ${id}.`);
        setChartOptions({ ...baseChartOptions, title: { ...baseChartOptions.title, text: title } });
      } else {
        const curve = data.map(pt => ({ fecha: pt.fecha.split('T')[0], avance: pt.avance, hito_nombre: pt.hito_nombre }));
        setErrorCurve(null);
        setChartOptions({
          ...baseChartOptions,
          title: { ...baseChartOptions.title, text: title },
          xAxis: { ...baseChartOptions.xAxis, categories: curve.map(pt => pt.fecha), tickInterval: 1, labels: { ...baseChartOptions.xAxis.labels, rotation: -45, step: 1, autoRotation: false } },
          series: [{ name: 'Curva de Referencia', data: curve.map(pt => ({ y: pt.avance, hito_nombre: pt.hito_nombre })) }]
        });
      }
    } catch (err) {
      console.error(err);
      setErrorCurve('No fue posible cargar la curva S.');
    } finally {
      setLoadingCurve(false);
    }
  };

  // Filtrado
  const filteredAll = proyectos.filter(
    row => row.nombre_proyecto.toLowerCase().includes(filterText.toLowerCase()) || row.promotor.toLowerCase().includes(filterText.toLowerCase())
  );
  const filteredNumeric = filteredAll.filter(row => /^[0-9]+$/.test(row.id));

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
      <h2 className="text-2xl font-semibold text-white">Proyectos</h2>

      {/* Pestañas */}
      <div className="flex space-x-4 border-b border-gray-700 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-medium ${activeTab === tab ? 'border-b-2 border-yellow-500 text-white' : 'text-gray-400'}`}
          >{tab}</button>
        ))}
      </div>

      {/* Contenido de pestañas */}
      {activeTab === 'Seguimiento Curva S' && (
        <>
          <div className="bg-[#262626] p-4 rounded-lg shadow">
            <div className="flex justify-between mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar…"
                  value={filterText}
                  onChange={e => setFilterText(e.target.value)}
                  className="pl-8 bg-[#1f1f1f] text-white rounded"
                />
              </div>
            </div>
            <DataTable
              columns={columns}
              data={filteredNumeric}
              pagination
              highlightOnHover
              pointerOnHover
              onRowClicked={handleRowClick}
              theme="dark"
            />

            {/* Gráfico de curva S */}
            <div className="mt-6 bg-[#262626] p-4 rounded-lg shadow relative">
                <HelpButton 
              onClick={() => alert('Esta gráfica muestra el avance del proyecto seleccionado a lo largo del tiempo.')}
              className="absolute top-2 right-2"
            />
              {loadingCurve ? (
                <p className="text-gray-300">Cargando curva S…</p>
              ) : errorCurve ? (
                <p className="text-red-500">{errorCurve}</p>
              ) : (
                <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartRef} />
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'Todos los proyectos' && (
        <div className="bg-[#262626] p-4 rounded-lg shadow relative">
           
          <div className="flex justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar…"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className="pl-8 bg-[#1f1f1f] text-white rounded"
              />
            </div>
          </div>
          <DataTable
            columns={columns}
            data={filteredAll}
            pagination
            theme="dark"
          />
        </div>
      )}

      {activeTab === 'Proyectos ANLA' && (
        <div className="bg-[#262626] p-6 rounded-lg shadow text-gray-400">
         
           <GraficaANLA />
        </div>
      )}
    </section>
  );
}









