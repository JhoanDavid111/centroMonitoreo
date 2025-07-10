// src/components/ProjectGrid.jsx
import React, { useRef, useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
import { MRT_Table, useMaterialReactTable } from 'material-react-table';
import { Box, IconButton, Tooltip, Typography, TextField } from '@mui/material';
import { Download } from 'lucide-react';
import { API } from '../config/api';
import GraficaANLA from './GraficaANLA';
import ojoAmarillo from '../assets/ojoAmarillo.svg';
import curvaSAmarillo from '../assets/curvaSAmarillo.svg';

// Cargar módulos de Highcharts
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
  { name: 'ID', selector: row => row.id, sortable: true },
  { name: 'Nombre', selector: row => row.nombre_proyecto, sortable: true },
  { name: 'Tipo', selector: row => row.tipo_proyecto, sortable: true },
  { name: 'Tecnología', selector: row => row.tecnologia, sortable: true },
  { name: 'Ciclo', selector: row => row.ciclo_asignacion, sortable: true },
  { name: 'Promotor', selector: row => row.promotor, sortable: true },
  { name: 'Estado', selector: row => row.estado_proyecto, sortable: true },
  { name: 'Departamento', selector: row => row.departamento, sortable: true },
  { name: 'Municipio', selector: row => row.municipio, sortable: true },
  { name: 'Capacidad (MW)', selector: row => row.capacidad_instalada_mw, sortable: true },
  { name: 'FPO', selector: row => row.fpo, sortable: true },
  { name: 'Priorizado', selector: row => row.priorizado ? 'Sí' : 'No', sortable: true },
  { name: 'Avance (%)', selector: row => row.porcentaje_avance_display, sortable: true },
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
/*   exporting: {
    enabled: true,
    buttons: {
      contextButton: {
        menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG'],
      },
    },
  }, */
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
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartOptions, setChartOptions] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    fetch(`${API}/v1/graficas/6g_proyecto/listado_proyectos_curva_s`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(p => ({
          ...p,
          fpo: p.fpo ? p.fpo.split('T')[0] : '-',
          porcentaje_avance_display: p.porcentaje_avance != null ? `${p.porcentaje_avance}%` : '-',
        }));
        setProyectos(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleViewCurve = async (row) => {
    const id = row.id;
    try {
      const res = await fetch(`${API}/v1/graficas/6g_proyecto/grafica_curva_s/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      const curve = data.map(pt => ({ fecha: pt.fecha.split('T')[0], avance: pt.avance, hito_nombre: pt.hito_nombre }));
      setChartOptions({
        chart: { type: 'spline', height: 300, backgroundColor: '#262626' },
        title: { text: `Curva S – Proyecto ${id}`, style: { color: '#fff' } },
        xAxis: {
          categories: curve.map(pt => pt.fecha),
          labels: { style: { color: '#ccc' }, rotation: -45 },
          gridLineColor: '#333',
        },
        yAxis: {
          title: { text: 'Avance (%)', style: { color: '#ccc' } },
          gridLineColor: '#333',
          max: 100,
        },
        tooltip: {
          backgroundColor: '#1f2937',
          style: { color: '#fff' },
          formatter() {
            return `<b>${this.x}</b><br/>Avance: ${this.y}%<br/>Hito: ${this.point.hito_nombre}`;
          },
        },
        series: [{
          name: 'Curva de Referencia',
          data: curve.map(pt => ({ y: pt.avance, hito_nombre: pt.hito_nombre })),
        }],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredData = proyectos.filter(p =>
    Object.values(p).some(val =>
      String(val).toLowerCase().includes(globalFilter.toLowerCase())
    ) && /^[0-9]+$/.test(p.id)
  );

  const columns = [
    {
      header: 'Acciones',
      accessorKey: 'acciones',
      Cell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Ver proyecto">
            <IconButton>
              <img src={ojoAmarillo} alt="ver" width={20} height={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ver curva S">
            <IconButton onClick={() => handleViewCurve(row.original)}>
              <img src={curvaSAmarillo} alt="curva" width={20} height={20} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    { header: 'ID', accessorKey: 'id' },
    { header: 'Nombre', accessorKey: 'nombre_proyecto' },
    { header: 'Capacidad', accessorKey: 'capacidad_instalada_mw' },
    { header: 'FPO', accessorKey: 'fpo' },
    { header: 'Avance', accessorKey: 'porcentaje_avance_display' },
    { header: 'Promotor', accessorKey: 'promotor' },
  ];

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    enableColumnFilters: true,
    enablePagination: true,
    muiTableHeadCellProps: { sx: { color: 'white', backgroundColor: '#262626' } },
    muiTableBodyCellProps: { sx: { color: '#cccccc', backgroundColor: '#262626' } },
    muiTablePaperProps: { sx: { backgroundColor: '#1f1f1f' } },
    muiTableContainerProps: { sx: { backgroundColor: '#262626' } },
    muiPaginationProps: { rowsPerPageOptions: [5, 10, 20], sx: { color: 'white' } },
    muiTableFilterTextFieldProps: { sx: { color: '#ccc' } },
    renderTopToolbarCustomActions: () => (
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Buscar..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          sx={{ backgroundColor: '#1f1f1f', input: { color: '#ccc' }, width: 250 }}
        />
        <button
          className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-3 py-1 rounded hover:bg-yellow-500"
          onClick={() => {
            const csvContent = [
              columns.map(c => c.header).join(','),
              ...filteredData.map(p => [p.id, p.nombre_proyecto, p.capacidad_instalada_mw, p.fpo, p.porcentaje_avance_display, p.promotor].join(',')),
            ].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', 'proyectos.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <Download size={16} /> Descargar datos
        </button>
      </Box>
    ),
  });

  return (
    <section className="space-y-6">
      <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>Proyectos</Typography>
      <MRT_Table table={table} />
      {chartOptions.series && chartOptions.series.length > 0 && (
        <Box mt={4}>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartRef} />
        </Box>
      )}
    </section>
  );
}















