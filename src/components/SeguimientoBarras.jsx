// src/components/SeguimientoBarras.jsx
import React, { useState, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';

// Carga de módulos
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Tema oscuro global con Nunito Sans
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

export function SeguimientoBarras() {
  const chartRef = useRef(null);
  const [view, setView] = useState('capacidad');

  // Categorías de avance
  const categories = [
    '0-5','5-10','10-15','15-20','20-25','25-30','30-35','35-40','40-45',
    '45-50','50-55','55-60','60-65','65-70','70-75','75-80','80-85','85-90','90-95','95-100'
  ];

  // Datos de ejemplo
  const capacidadData = [
    10, 10.4, 11, 11.4, 13.3, 15.8, 16.8, 18.4, 20,
    22, 24, 22, 20, 18.4, 16.8, 15.8, 13.3, 11.4, 11, 10.4
  ];
  const proyectosData = [
    1, 2, 1, 3, 5, 8, 9, 7, 6,
    12, 15, 14, 10, 8, 6, 5, 4, 3, 2, 1
  ];

  const options = {
    chart:    { type: 'column', height: 360 },
    title:    { text: 'Capacidad instalada / No. de proyectos vs porcentaje de avance', style: { color: '#fff' } },
    subtitle: { text: 'Fuente: XM. 2020-2024', style: { color: '#aaa' } },
    xAxis: {
      categories,
      title:        { text: 'Porcentaje de avance', style: { color: '#ccc' } },
      tickInterval: 1,      // un tick por cada categoría
      labels: {
        style:         { color: '#ccc', fontSize: '10px' },
        rotation:      -45,  // rota etiquetas para que quepan mejor
        step:           1,   // fuerza a pintar cada etiqueta
        autoRotation:   false
      },
      gridLineColor: '#333'
    },
    yAxis: {
      title: {
        text: view === 'capacidad'
          ? 'Capacidad instalada en MW'
          : 'Número de proyectos',
        style: { color: '#ccc' }
      },
      labels: { style: { color: '#ccc', fontSize: '10px' } },
      gridLineColor: '#333'
    },
    plotOptions: {
      column: {
        colorByPoint: false,
        color:        '#FFC800'
      }
    },
    series: [{
      name: view === 'capacidad' ? 'Capacidad instalada' : 'Número de proyectos',
      data: view === 'capacidad' ? capacidadData : proyectosData
    }],
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
        }
      }
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-white font-sans">
        Seguimiento de proyectos resolución 075
      </h2>

      <div className="flex space-x-6 mb-4 font-sans text-sm">
        <button
          className={`pb-1 border-b-2 ${
            view === 'capacidad'
              ? 'border-[#FFC800] text-[#FFC800]'
              : 'border-transparent text-gray-300'
          }`}
          onClick={() => setView('capacidad')}
        >
          Capacidad instalada
        </button>
        <button
          className={`pb-1 border-b-2 ${
            view === 'proyectos'
              ? 'border-[#FFC800] text-[#FFC800]'
              : 'border-transparent text-gray-300'
          }`}
          onClick={() => setView('proyectos')}
        >
          Número de proyectos
        </button>
      </div>

      <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow relative">
        <button
          className="absolute top-2 right-2 text-gray-300 hover:text-white"
          title="Maximizar gráfico"
          onClick={() => chartRef.current.chart.fullscreen.toggle()}
        >⛶</button>

        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
        />
      </div>
    </section>
  );
}

export default SeguimientoBarras;
