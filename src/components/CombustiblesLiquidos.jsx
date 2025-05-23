import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';

// Cargar módulos de exportación y fullscreen
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Tema oscuro global
Highcharts.setOptions({
  chart: {
    backgroundColor: '#111827',
    style: { fontFamily: 'sans-serif' }
  },
  title: { style: { color: '#fff' } },
  subtitle: { style: { color: '#aaa' } },
  xAxis: {
    labels: { style: { color: '#ccc', fontSize: '8px' } },
    title: { style: { color: '#ccc' } },
    gridLineColor: '#333'
  },
  yAxis: {
    labels: { style: { color: '#ccc', fontSize: '8px' } },
    title: { style: { color: '#ccc' } },
    gridLineColor: '#333'
  },
  legend: {
    itemStyle: { color: '#ccc' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#1f2937',
    style: { color: '#fff', fontSize: '10px' }
  }
});

export function CombustiblesLiquidos() {
  const [charts, setCharts] = useState([]);
  const [selected, setSelected] = useState('all');
  const chartRefs = useRef([]);

  useEffect(() => {
    const baseOptions = [
      {
        chart: { type: 'area', zoomType: '', height: 350 },
        title: { text: 'Evolución del Volumen Útil por Región' },
        subtitle: { text: 'Fuente: XM. 2020-2024' },
        yAxis: { title: { text: 'Volumen útil (Millones de m³)' } },
        xAxis: {
          categories: ['ene-20','jul-20','ene-21','jul-21','ene-22','jul-22','ene-23','jul-23','ene-24']
        },
        plotOptions: { area: { stacking: 'normal' } },
        series: [
          { name: 'Antioquia', data: [3500,3600,3400,3700,3900,4000,3900,3800,3700] },
          { name: 'Caribe',    data: [1500,1600,1700,1650,1750,1800,1700,1650,1600] },
          { name: 'Centro',    data: [1800,1850,1900,1950,2000,2100,2200,2300,2400] },
          { name: 'Oriente',   data: [1200,1250,1300,1280,1320,1340,1360,1380,1400] },
          { name: 'Valle',     data: [1100,1120,1140,1160,1180,1200,1220,1240,1260] },
          { name: 'Caldas',    data: [600,620,640,660,680,700,720,740,760] }
        ]
      },
      {
        chart: { type: 'column', zoomType: '', height: 350 },
        title: { text: 'Capacidad Instalada Despachada Centralmente por Tecnología' },
        subtitle: { text: 'Fuente: XM. 2020-2024' },
        yAxis: { title: { text: 'Capacidad Instalada (GW)' } },
        xAxis: {
          categories: ['2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024']
        },
        series: [
          { name: 'ACPM',        data: [5,5.5,5.8,6,6.2,6.5,6.8,7,7.3,7.6,8] },
          { name: 'AGUA',        data: [10,11,12,12.5,13,13.5,14,14.5,15,15.5,16] },
          { name: 'CARBÓN',      data: [7,7.1,7.2,7.3,7.4,7.5,7.6,7.8,8,8.2,8.4] },
          { name: 'GAS',         data: [3,3.2,3.4,3.6,3.8,4,4.2,4.4,4.6,4.8,5] },
          { name: 'GLP',         data: [1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2] },
          { name: 'JET-A1',      data: [0.6,0.65,0.7,0.75,0.8,0.85,0.9,1,1.1,1.2,1.3] },
          { name: 'COMBUSTOLEO', data: [0.4,0.45,0.5,0.6,0.65,0.7,0.75,0.8,0.85,0.9,1] },
          { name: 'RAD SOLAR',   data: [0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1,1.1,1.2] }
        ]
      },
      {
        chart: { type: 'area', zoomType: '', height: 350 },
        title: { text: 'Comparativo Volumen vs. Capacidad' },
        subtitle: { text: 'Gráfico de ejemplo adicional' },
        yAxis: { title: { text: 'Índice Relativo' } },
        xAxis: { categories: ['Q1','Q2','Q3','Q4'] },
        series: [
          { name: 'Volumen útil',       data: [2.5,2.7,2.6,2.8] },
          { name: 'Capacidad instalada', data: [14,14.3,14.5,15] }
        ]
      }
    ];

    // Añadir botones de exportación a cada opción
    const withExport = baseOptions.map(opt => ({
      ...opt,
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
          }
        }
      }
    }));

    setCharts(withExport);
  }, []);

  const isFiltered = selected !== 'all';
  const gridClasses = isFiltered
    ? 'grid-cols-1'
    : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';

  // Preparar lista de gráficos a mostrar
  const displayed = charts
    .map((opt, idx) => ({ opt, idx }))
    .filter(item => selected === 'all' || String(item.idx) === selected);

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Combustibles líquidos
      </h2>

      {/* Dropdown externo */}
      <div className="mb-4">
        <select
          className="bg-gray-800 text-gray-200 p-2 rounded"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="all">Mostrar todos</option>
          {charts.map((c, i) => (
            <option key={i} value={String(i)}>
              {c.title.text}
            </option>
          ))}
        </select>
      </div>

      {/* Grid dinámico */}
      <div className={`grid ${gridClasses} gap-4`}>
        {displayed.map(({ opt, idx }) => {
          // Aumentar altura si está filtrado
          const dynOpts = {
            ...opt,
            chart: {
              ...opt.chart,
              height: isFiltered ? 600 : opt.chart.height
            }
          };
          return (
            <div
              key={idx}
              className="bg-gray-900 p-4 rounded border border-gray-700 shadow relative"
            >
              {/* Botón maximizar */}
              <button
                className="absolute top-2 right-2 text-gray-300 hover:text-white"
                onClick={() => chartRefs.current[idx].chart.fullscreen.toggle()}
                title="Maximizar gráfico"
              >
                ⛶
              </button>

              <HighchartsReact
                highcharts={Highcharts}
                options={dynOpts}
                ref={el => (chartRefs.current[idx] = el)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}


