// src/components/ProyectoDetalle.jsx
import React, { useRef, useState } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
import DataTable from 'react-data-table-component';
import { Download, Search } from 'lucide-react';

// ——— Highcharts modules ———
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// ——— Tema oscuro global con Nunito Sans ———
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' },
    plotBorderWidth: 0,
    plotBackgroundColor: 'transparent',
  },
  title:   { style: { color: '#fff', fontSize: '16px', fontWeight: '600' } },
  subtitle:{ style: { color: '#aaa', fontSize: '12px' } },
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
  tooltip: {
    backgroundColor: '#1f2937',
    style: { color: '#fff', fontSize: '12px' },
    shared: true
  }
});

// ——— Datos de ejemplo ———
const proyectos = [
  { id: '4564213', nombre: 'Proyecto 01', promotor: 'Promotor 001', capacidad: '5 MW', fpo: '01-05-2025', avance: '20%' },
  { id: '4561238', nombre: 'Proyecto 02', promotor: 'Promotor 002', capacidad: '8 MW', fpo: '15-06-2025', avance: '24%' },
  { id: '3236548', nombre: 'Proyecto 03', promotor: 'Promotor 003', capacidad: '5 MW', fpo: '10-07-2025', avance: '16%' },
  { id: '4580268', nombre: 'Proyecto 04', promotor: 'Promotor 004', capacidad: '10 MW', fpo: '20-08-2025', avance: '85%' },
];

// ——— Columnas para DataTable ———
const columns = [
  {
    name: 'ID',
    selector: row => row.id,
    sortable: true,
  },
  {
    name: 'Nombre',
    selector: row => row.nombre,
    sortable: true,
  },
  {
    name: 'Promotor',
    selector: row => row.promotor,
    sortable: true,
  },
  {
    name: 'Capacidad',
    selector: row => row.capacidad,
    sortable: true,
  },
  {
    name: 'FPO programada',
    selector: row => row.fpo,
    sortable: true,
  },
  {
    name: '% avance',
    selector: row => row.avance,
    sortable: true,
  }
];

export default function ProyectoDetalle({ projectName = 'Proyecto 01' }) {
  const chartRef = useRef(null);
  const [filterText, setFilterText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  // Filtrado por buscador
  const filteredData = proyectos.filter(
    row =>
      row.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
      row.promotor.toLowerCase().includes(filterText.toLowerCase())
  );

  // Categorías y datos Curva S (ejemplo)
  const categories = [
    '0 %','5 %','10 %','15 %','20 %','25 %','30 %','35 %','40 %',
    '45 %','50 %','55 %','60 %','65 %','70 %','75 %','80 %','85 %',
    '90 %','95 %','100 %'
  ];
  const programado = [0,1,2,3,4,6,8,12,16,20,24,27,29,30,31,31.5,31.8,31.9,32,32,32];
  const cumplido   = [0,0.5,1,2,3,5,7,11,15,19,23,26,28,29,30,30.5,30.8,30.9,31,31.2,31.5];

  const chartOptions = {
    chart: { type: 'spline', height: 300 },
    title: {
      text: `Curva S – % de avance – Programado vs cumplido, ${projectName}`
    },
    subtitle: { text: 'Fuente: XM. 2020-2024' },
    xAxis: { categories, title: { text: '% avance' } },
    yAxis: { title: { text: '% completado' } },
    plotOptions: { spline: { marker: { enabled: true } } },
    series: [
      { name: 'Programado', data: programado, color: '#5DA1FF' },
      { name: 'Cumplido',   data: cumplido,   color: '#B8FF65' }
    ],
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
        }
      }
    }
  };

  // Descarga CSV
  const descargarCSV = (rows) => {
    const header = columns.map(c => c.name).join(',');
    const csv = rows.map(r =>
      [r.id, r.nombre, r.promotor, r.capacidad, r.fpo, r.avance].join(',')
    );
    const blob = new Blob([header + '\n' + csv.join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'proyectos.csv';
    a.click();
  };

  return (
    <section className="space-y-8">
          {/* — Tabla de proyectos — */}
      <h2 className="text-2xl font-semibold text-white font-sans">
        Seguimiento Curva S
      </h2>
      <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow">
        <div className="flex flex-wrap items-center justify-between mb-4 space-y-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => descargarCSV(proyectos)}
              className="flex items-center space-x-1 bg-[#FFC800] text-black px-3 py-1 rounded hover:bg-[#e6b000] transition font-sans"
            >
              <Download size={16} /> <span>Descargar todos los datos</span>
            </button>
            <button
              onClick={() => descargarCSV(selectedRows)}
              disabled={!selectedRows.length}
              className="flex items-center space-x-1 bg-[#FFC800] text-black px-3 py-1 rounded hover:bg-[#e6b000] transition disabled:opacity-50 font-sans"
            >
              <Download size={16} /> <span>Descargar seleccionados</span>
            </button>
          </div>
          <div className="relative">
            <Search size={20} className="absolute left-2 top-2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar"
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
              className="pl-8 pr-3 py-1 rounded bg-[#1f1f1f] text-white font-sans focus:outline-none"
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          selectableRows
          onSelectedRowsChange={s => setSelectedRows(s.selectedRows)}
          theme="dark"
          dense
          highlightOnHover
        />
        <br>
        </br>
        <br>
        </br>
      {/* — Curva S — */}
      <div className="bg-[#262626] p-4 rounded-lg shadow relative">
        <button
          className="absolute top-2 right-2 text-gray-300 hover:text-white"
          onClick={() => chartRef.current.chart.fullscreen.toggle()}
          title="Maximizar gráfico"
        >
          ⛶
        </button>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          ref={chartRef}
        />
      </div>
      </div>


    </section>
  );
}