// src/components/ProyectoDetalle.jsx
import React, { useRef, useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
import DataTable from 'react-data-table-component';
import { Download, Search } from 'lucide-react';

// ——— Inicializar módulos de Highcharts ———
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// ——— Tema oscuro global ———
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' }
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
    itemStyle:       { color: '#ccc' },
    itemHoverStyle:  { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: { backgroundColor: '#1f2937', style: { color: '#fff', fontSize: '12px' } }
});

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
      return `<b>${this.x}</b><br/>
              Avance: ${this.y}%<br/>
              Hito: ${this.point.hito_nombre}`;
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

export default function ProyectoDetalle() {
  const chartRef = useRef(null);

  // Estado de lista de proyectos
  const [proyectos, setProyectos]         = useState([]);
  const [loadingList, setLoadingList]     = useState(true);
  const [errorList, setErrorList]         = useState(null);

  // Estado de la curva
  const [inputId, setInputId]             = useState('');
  const [chartOptions, setChartOptions]   = useState(baseChartOptions);
  const [loadingCurve, setLoadingCurve]   = useState(false);
  const [errorCurve, setErrorCurve]       = useState(null);

  // Filtrado y selección en la tabla
  const [filterText, setFilterText]       = useState('');
  const [selectedRows, setSelectedRows]   = useState([]);

  // 1) Cargar lista de proyectos al montar
  useEffect(() => {
    async function fetchList() {
      setLoadingList(true);
      setErrorList(null);
      try {
        const res  = await fetch(
          'http://192.168.8.138:8002/v1/graficas/6g_proyecto/listado_proyectos_curva_s',
          { method: 'POST', headers: { 'Content-Type': 'application/json' } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const formatted = data.map(p => ({
          ...p,
          fpo: p.fpo ? p.fpo.split('T')[0] : '-',
          porcentaje_avance_display:
            p.porcentaje_avance != null ? `${p.porcentaje_avance}%` : '-',
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

  // 2) Función para obtener y renderizar curva S
  const fetchCurveData = async id => {
    if (!id) return;
    setLoadingCurve(true);
    setErrorCurve(null);
    try {
      const res  = await fetch(
        `http://192.168.8.138:8002/v1/graficas/6g_proyecto/grafica_curva_s/${id}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const title = `Curva S – Proyecto ${id}`;

      if (!Array.isArray(data) || data.length === 0) {
        setChartOptions({
          ...baseChartOptions,
          title: { ...baseChartOptions.title, text: title }
        });
        setErrorCurve(`No se encontró la gráfica de curva S para el ID ${id}.`);
        return;
      }

      // Preparamos datos
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
          categories:  curve.map(pt => pt.fecha),
          tickInterval: 1,
          labels: {
            ...baseChartOptions.xAxis.labels,
            rotation:    -45,
            step:         1,
            autoRotation: false
          }
        },
        series: [
          {
            name: 'Curva de Referencia',
            data: curve.map(pt => ({
              y:            pt.avance,
              hito_nombre:  pt.hito_nombre
            }))
          }
        ]
      });
    } catch (err) {
      console.error(err);
      setErrorCurve('No fue posible cargar la curva S.');
    } finally {
      setLoadingCurve(false);
    }
  };

  // Filtrado de tabla
  const filteredData = proyectos.filter(
    row =>
      row.nombre_proyecto.toLowerCase().includes(filterText.toLowerCase()) ||
      row.promotor.toLowerCase().includes(filterText.toLowerCase())
  );

  // Descargar CSV
  const descargarCSV = rows => {
    const header = columns.map(c => c.name).join(',');
    const csv    = rows.map(r =>
      [
        r.id,
        r.nombre_proyecto,
        r.tipo_proyecto,
        r.tecnologia,
        r.ciclo_asignacion,
        r.promotor,
        r.estado_proyecto,
        r.departamento,
        r.municipio,
        r.capacidad_instalada_mw,
        r.fpo,
        r.priorizado ? 'Sí' : 'No',
        r.porcentaje_avance_display
      ].join(',')
    );
    const blob   = new Blob([header + '\n' + csv.join('\n')], { type: 'text/csv' });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement('a');
    a.href       = url;
    a.download   = 'proyectos_curva_s.csv';
    a.click();
  };

  if (loadingList) return <p className="text-gray-300">Cargando proyectos…</p>;
  if (errorList)   return <p className="text-red-500">{errorList}</p>;

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">Seguimiento Curva S</h2>

      <div className="bg-[#262626] p-4 rounded-lg shadow">
        {/* Buscador y CSV */}
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button onClick={() => descargarCSV(proyectos)} className="btn-yellow">
              <Download size={16}/> Descargar todo
            </button>
            <button
              onClick={() => descargarCSV(selectedRows)}
              disabled={!selectedRows.length}
              className="btn-yellow disabled:opacity-50"
            >
              <Download size={16}/> Desc. seleccionados
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2 text-gray-400"/>
            <input
              type="text"
              placeholder="Buscar por nombre o promotor…"
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
              className="pl-8 bg-[#1f1f1f] text-white rounded"
            />
          </div>
        </div>

        {/* Tabla de proyectos */}
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          selectableRows
          onSelectedRowsChange={sel => setSelectedRows(sel.selectedRows)}
          onRowClicked={row => setInputId(String(row.id))}
          theme="dark"
        />

        {/* Input ID + Botón */}
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ingrese ID de proyecto"
            value={inputId}
            onChange={e => setInputId(e.target.value)}
            className="px-3 py-1 rounded bg-[#1f1f1f] text-white focus:outline-none"
          />
          <button
            onClick={() => fetchCurveData(inputId)}
            disabled={!inputId}
            className="bg-[#FFC800] text-black px-4 py-1 rounded hover:bg-[#e6b000] disabled:opacity-50"
          >
            Graficar
          </button>
        </div>

        {/* Gráfico de curva S */}
        <div className="mt-6 bg-[#262626] p-4 rounded-lg shadow relative">
          {loadingCurve ? (
            <p className="text-gray-300">Cargando curva S…</p>
          ) : errorCurve ? (
            <p className="text-red-500">{errorCurve}</p>
          ) : chartOptions.series[0].data.length > 0 ? (
            <>
             {/*  <button
                className="absolute top-2 right-2 text-gray-300 hover:text-white"
                onClick={() => chartRef.current.chart.fullscreen.toggle()}
                title="Maximizar gráfico"
              >⛶</button> */}
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                ref={chartRef}
              />
            </>
          ) : (
            <p className="text-gray-400">Ingrese un ID y presione “Graficar”.</p>
          )}
        </div>
      </div>
    </section>
  );
}








