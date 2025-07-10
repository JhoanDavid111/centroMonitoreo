// src/components/HitosBarras.jsx
import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';


// ——— Carga de módulos ———
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
    itemStyle:       { color: '#ccc' },
    itemHoverStyle:  { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#1f2937',
    style:           { color: '#fff', fontSize: '12px' }
  }
});

export function HitosBarras() {
  const chartRefs = useRef([]);

  // Configuración base de los gráficos
  const rawOptions = [
    {
      title:    { text: 'Número de hitos por cumplir' },
      subtitle: { text: 'Fuente: XM. 2020-2024' },
      chart:    { type: 'column', height: 350 },
      xAxis: {
        categories: ['May-25','Jun-25','Jul-25','Ago-25','Sep-25','Oct-25','Nov-25','Dic-25'],
        title:      { text: null },
        tickInterval: 1,         // un tick por cada categoría
        labels: {
          style:         { color: '#ccc', fontSize: '10px' },
          rotation:      -45,     // rotar para que quepan todas
          step:           1,      // forzar cada etiqueta
          autoRotation:   false   // desactivar rotación automática
        },
        gridLineColor: '#333'
      },
      yAxis: { title: { text: 'Número de hitos', style: { color: '#ccc' } } },
      series: [
        {
          name: 'Hitos por cumplir',
          data: [35, 15, 60, 15, 35, 48, 33, 57],
          color: '#3B82F6'
        }
      ]
    },
    {
      title:    { text: 'Número de hitos con incumplimientos' },
      subtitle: { text: 'Fuente: XM. 2020-2024' },
      chart:    { type: 'column', height: 350 },
      xAxis: {
        categories: ['Sep-25','Oct-24','Nov-24','Dic-24','Ene-25','Feb-25','Mar-25','Abr-25'],
        title:      { text: null },
        tickInterval: 1,
        labels: {
          style:         { color: '#ccc', fontSize: '10px' },
          rotation:      -45,
          step:           1,
          autoRotation:   false
        },
        gridLineColor: '#333'
      },
      yAxis: { title: { text: 'Número de hitos', style: { color: '#ccc' } } },
      series: [
        {
          name: 'Hitos con incumplimientos',
          data: [24, 15, 21, 26, 11, 24, 28, 34],
          color: '#F87171'
        }
      ]
    }
  ];

  // Añade los botones de exportación a cada set de opciones
  const chartOptions = rawOptions.map(opt => ({
    ...opt,
 /*    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
        }
      }
    } */
  }));

  return (
    <section className="mt-8 space-y-4">
      <h2 className="text-2xl font-semibold text-white font-sans">
        Seguimiento de hitos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chartOptions.map((opt, idx) => (
          <div
            key={idx}
            className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow relative"
          >
             {/* Botón de ayuda */}
          <button
            className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
            style={{ width: 30, height: 30 }}
            title="Ayuda"
            onClick={() => alert('Ok Aquí puedes mostrar ayuda contextual o abrir un modal.')}
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
            <HighchartsReact
              highcharts={Highcharts}
              options={opt}
              ref={el => (chartRefs.current[idx] = el)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default HitosBarras;
