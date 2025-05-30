import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';


Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);


Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' },
    plotBorderWidth: 0,
    plotBackgroundColor: 'transparent'
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
    style: { color: '#fff', fontSize: '12px' }
  }
});

export function HitosBarras() {
  const chartRefs = useRef([]);

  const rawOptions = [
    {
      title: { text: 'Número de hitos por cumplir' },
      subtitle: { text: 'Fuente: XM. 2020-2024' },
      chart: { type: 'column', height: 350 },
      xAxis: {
        categories: ['May-25','Jun-25','Jul-25','Ago-25','Sep-25','Oct-25','Nov-25','Dic-25'],
        title: { text: null }
      },
      yAxis: { title: { text: 'Número de hitos' } },
      series: [
        {
          name: 'Hitos por cumplir',
          data: [35, 15, 60, 15, 35, 48, 33, 57],
          color: '#3B82F6'
        }
      ]
    },
    {
      title: { text: 'Número de hitos con incumplimientos' },
      subtitle: { text: 'Fuente: XM. 2020-2024' },
      chart: { type: 'column', height: 350 },
      xAxis: {
        categories: ['Sep-25','Oct-24','Nov-24','Dic-24','Ene-25','Feb-25','Mar-25','Abr-25'],
        title: { text: null }
      },
      yAxis: { title: { text: 'Número de hitos' } },
      series: [
        {
          name: 'Hitos con incumplimientos',
          data: [24, 15, 21, 26, 11, 24, 28, 34],
          color: '#F87171'
        }
      ]
    }
  ];

 
  const chartOptions = rawOptions.map(opt => ({
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
            {/* Botón fullscreen */}
            <button
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
              title="Maximizar gráfico"
              onClick={() => chartRefs.current[idx].chart.fullscreen.toggle()}
            >
              ⛶
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