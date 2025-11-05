import React, { useState, useRef } from 'react';
import Highcharts from '../lib/highcharts-config';
import HighchartsReact from 'highcharts-react-official';
import HelpButton from './charts/HelpButton';

export function SeguimientoBarras() {
  const chartRef = useRef(null);
  const [view, setView] = useState('capacidad');
  
  // — CAPACIDAD Y PROYECTOS —
  const categories = [
    '0-5', '5-10', '10-15', '15-20', '20-25', '25-30', '30-35', '35-40', '40-45',
    '45-50', '50-55', '55-60', '60-65', '65-70', '70-75', '75-80', '80-85', '85-90', '90-95', '95-100'
  ];

  const capacidadData = [
    10, 10.4, 11, 11.4, 13.3, 15.8, 16.8, 18.4, 20,
    22, 24, 22, 20, 18.4, 16.8, 15.8, 13.3, 11.4, 11.1, 10.4
  ];

  const proyectosData = [
    1, 2, 1, 3, 5, 8, 9, 7, 6,
    12, 15, 14, 10, 8, 6, 5, 4, 3, 2, 1
  ];

  const options = {
    chart: { type: 'column', height: 360 },
    title: { text: 'No. de proyectos vs porcentaje de avance', style: { color: '#fff' } },
    subtitle: { text: 'Fuente: XM_2020-2024', style: { color: '#aaa' } },
    xAxis: {
      categories,
      title: { text: 'Porcentaje de avance', style: { color: '#ccc' } },
      tickInterval: 1,
      labels: {
        style: { color: '#ccc', fontSize: '10px' },
        rotation: -45,
        step: 1,
        autoRotation: false
      },
      gridLineColor: '#333'
    },
    yAxis: {
      title: {
        text: view === 'capacidad' ? 'Número de Proyectos' : 'Número de proyectos',
        style: { color: '#ccc' }
      },
      labels: { style: { color: '#ccc', fontSize: '10px' } },
      gridLineColor: '#333'
    },
    plotOptions: {
      column: {
        colorByPoint: false,
        color: '#FFC800'
      }
    },
    legend: {
        itemStyle: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' },
      },
    series: [{
      name: view === 'capacidad' ? 'Proyectos' : 'Número de proyectos',
      data: view === 'capacidad' ? capacidadData : proyectosData
    }],
 /*    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
        }
      }
    } */
  };

  return (
    <section className="mt-6">
      <div className="flex space-x-6 mb-4 font-sans text-sm">
        <button
          className={`pb-1 border-b-2 text-[18px] ${
            view === 'capacidad' ? 'border-[#FFC600] text-[#FFC600]' : 'border-transparent text-gray-300'
          }`}
          onClick={() => setView('capacidad')}
        >
          Capacidad instalada
        </button>
        <button
          className={`pb-1 border-b-2 text-[18px] ${
            view === 'proyectos' ? 'border-[#FFC600] text-[#FFC600]' : 'border-transparent text-gray-300'
          }`}
          onClick={() => setView('proyectos')}
        >
          Numero de proyectos
        </button>
      </div>
      <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow relative">
          <HelpButton onClick={() => alert('Ok puedes mostrar ayuda contextual o abrir un modal.')} />
        {/* Gráfica */}
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