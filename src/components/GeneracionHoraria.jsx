// src/components/GeneracionHoraria.jsx
import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';

// Carga de módulos de Highcharts
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Tema global con fondo oscuro y fuente Nunito Sans
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' }
  },
  title: { style: { color: '#fff' } },
  subtitle: { style: { color: '#aaa' } },
  legend: {
    itemStyle: { color: '#ccc' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#1f2937',
    style: { color: '#fff', fontSize: '12px' }
  }
});

export function GeneracionHoraria() {
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);

  useEffect(() => {
    // Generar etiquetas de 1 a 24
    const horas = Array.from({ length: 24 }, (_, i) => String(i + 1));
    
    // Tus datos completos
    const termicaData = [
      55079.27252932, 52470.40562118, 50415.11834309, 48561.25963795,
      47257.67506765, 46422.3483144 , 45386.96772213, 43938.51712434,
      44225.22640284, 44438.74913295, 45049.41547627, 46039.37154918,
      46987.13962243, 47923.44470607, 49072.12876247, 50459.74953809,
      52044.55980035, 54726.6489794 , 57733.13884249, 59866.9918272 ,
      60445.63611004, 59406.95241534, 58990.44003875, 57756.5459441
    ];
    const cogeneradorData = [
      10154.23039564, 10284.9769275, 10308.75135291, 10278.70651176,
      10228.68931688, 10287.52587931, 10167.64233161, 10029.72708021,
      9880.27461137, 9856.92974868, 9733.78289227, 9708.98270112,
      9759.78957497, 9899.54664501, 9761.39204947, 9788.04748383,
      9886.76751472, 10053.875941, 9995.57051432, 10141.21644276,
      10251.35873905, 10234.46422543, 10150.89031178, 10053.66787271
    ];
    const hidraulicaData = [
      55355.27331921, 54369.55775331, 53501.33491857, 52990.92054609,
      53832.79541277, 55774.72789122, 55661.00885866, 55719.4236394,
      55767.28050554, 55697.77775352, 57017.92551524, 58712.26278399,
      58456.19821671, 59188.15361681, 60691.4812904, 61922.27736692,
      63417.85560072, 64298.45203543, 68790.54174304, 69782.24895625,
      68341.81743146, 65681.4941178, 61909.84214758, 57593.82472471
    ];
    const eolicaData = [
      0, 0, 0, 0,
      0, 0, 0, 5949.42065903,
      6505.44502825, 7143.05467606, 7807.60578652, 8999.70002825,
      9954.22684507, 0, 10675.41462185, 10880.10016807,
      10936.13187151, 10676.24046961, 10310.01563536, 9832.00623269,
      9132.29700831, 8731.99038674, 8539.08627072, 8230.23936464
    ];
    const solarData = [
      3.13818182, 2.4475, 1.74142857, 1.16708333, 1.54176471,
      77.65670623, 957.09607503, 4574.06471732, 8121.60008929,
      10253.86055353, 11337.73216602, 11616.62354708, 11404.13605697,
      10741.38276393, 9816.95989419, 8206.4315591, 5113.33446463,
      1177.39606526, 39.53403612, 74.81283019, 29.84769231,
      3.0464, 2.84846154, 2.7737037
    ];

    const termicaData2 = [
      55079.27252932, 52470.40562118, 50415.11834309, 48561.25963795,
      47257.67506765, 46422.3483144 , 45386.96772213, 43938.51712434,
      44225.22640284, 44438.74913295, 45049.41547627, 46039.37154918,
      46987.13962243, 47923.44470607, 49072.12876247, 50459.74953809,
      52044.55980035, 54726.6489794 , 57733.13884249, 59866.9918272 ,
      60445.63611004, 59406.95241534, 58990.44003875, 57756.5459441
    ];
    const cogeneradorData2 = [
      10154.23039564, 10284.9769275, 10308.75135291, 10278.70651176,
      10228.68931688, 10287.52587931, 10167.64233161, 10029.72708021,
      9880.27461137, 9856.92974868, 9733.78289227, 9708.98270112,
      9759.78957497, 9899.54664501, 9761.39204947, 9788.04748383,
      9886.76751472, 10053.875941, 9995.57051432, 10141.21644276,
      10251.35873905, 10234.46422543, 10150.89031178, 10053.66787271
    ];
    const hidraulicaData2 = [
      55355.27331921, 54369.55775331, 53501.33491857, 52990.92054609,
      53832.79541277, 55774.72789122, 55661.00885866, 55719.4236394,
      55767.28050554, 55697.77775352, 57017.92551524, 58712.26278399,
      58456.19821671, 59188.15361681, 60691.4812904, 61922.27736692,
      63417.85560072, 64298.45203543, 68790.54174304, 69782.24895625,
      68341.81743146, 65681.4941178, 61909.84214758, 57593.82472471
    ];
    const eolicaData2 = [
      7666.92229282, 7221.31151261, 7022.38355742, 6750.22419444,
      6339.5251676, 6013.32502825, 5685.2156, 5949.42065903,
      6505.44502825, 7143.05467606, 7807.60578652, 8999.70002825,
      9954.22684507, 10464.54061798, 10675.41462185, 10880.10016807,
      10936.13187151, 10676.24046961, 10310.01563536, 9832.00623269,
      9132.29700831, 8731.99038674, 8539.08627072, 8230.23936464
    ];
    const solarData2 = [
      3.13818182, 2.4475, 1.74142857, 1.16708333, 1.54176471,
      77.65670623, 957.09607503, 4574.06471732, 8121.60008929,
      10253.86055353, 11337.73216602, 11616.62354708, 11404.13605697,
      10741.38276393, 9816.95989419, 8206.4315591, 5113.33446463,
      1177.39606526, 39.53403612, 74.81283019, 29.84769231,
      3.0464, 2.84846154, 2.7737037
    ];

    const baseOptions = {
      chart: {
        type: 'area',
        height: 350,
        backgroundColor: '#262626'
      },
      title: {
        text: 'Curva de Generación por Tecnología'
      },
      subtitle: {
        text: 'Fuente: XM. 2020-2024'
      },
      xAxis: {
        categories: horas,
        tickInterval: 1,
        title: {
          text: 'Hora del día',
          style: { color: '#ccc' }
        },
        labels: {
          style: { color: '#ccc', fontSize: '10px' }
        },
        gridLineColor: '#333'
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Generación (kWh)',
          style: { color: '#ccc' }
        },
        labels: {
          style: { color: '#ccc', fontSize: '10px' }
        },
        gridLineColor: '#333'
      },
      tooltip: {
        shared: true,
        pointFormat:
          '<span style="color:{series.color}">●</span> {series.name}: <b>{point.y:.2f}</b><br/>'
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineWidth: 1,
          marker: { enabled: false }
        }
      },
      legend: {
        itemStyle: { color: '#ccc' },
        itemHoverStyle: { color: '#fff' },
        itemHiddenStyle: { color: '#666' }
      },
      series: [
      { name: 'TÉRMICA',      data: termicaData,     color: '#A52A2A' },
      { name: 'COGENERADOR',  data: cogeneradorData, color: '#808080' },
      { name: 'HIDRÁULICA',   data: hidraulicaData,  color: '#4169E1' },
      { name: 'EÓLICA',      data: eolicaData,      color: '#87CEEB' },
      { name: 'SOLAR',       data: solarData,       color: '#FFD700' }    // último Térmica
      ],
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
          }
        }
      },
      responsive: {
        rules: [{
          condition: { maxWidth: 600 },
          chartOptions: {
            legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom' }
          }
        }]
      }
    };

    
  
    // Variante: modificamos ligeramente los valores
    const variantOptions = {
      ...baseOptions,
      title: { text: 'Curva de Generación Variante' },
      /* series: baseOptions.series.map(s => ({
        ...s,
        data: s.data.map(v =>
          s.name === 'SOLAR' ? Math.round(v * 1) : Math.round(v * 1)
        )
      })) */
     series: [
      { name: 'TÉRMICA',      data: termicaData2,     color: '#A52A2A' },
      { name: 'COGENERADOR',  data: cogeneradorData2, color: '#808080' },
      { name: 'HIDRÁULICA',   data: hidraulicaData2,  color: '#4169E1' },
      { name: 'EÓLICA',      data: eolicaData2,      color: '#87CEEB' },
      { name: 'SOLAR',       data: solarData2,       color: '#FFD700' }    // último Térmica
      ]
    };

    // Aplicar a ambos charts
    if (chartRef1.current) chartRef1.current.chart.update(baseOptions, true, true);
    if (chartRef2.current) chartRef2.current.chart.update(variantOptions, true, true);
  }, []);

  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico original */}
        <div className="bg-[#262626] p-4 rounded border border-[#666666] shadow relative">
          <button
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
            onClick={() => chartRef1.current.chart.fullscreen.toggle()}
            title="Maximizar gráfico"
          >⛶</button>
          <HighchartsReact highcharts={Highcharts} options={{}} ref={chartRef1} />
        </div>
        {/* Gráfico variante */}
        <div className="bg-[#262626] p-4 rounded border border-[#666666] shadow relative">
          <button
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
            onClick={() => chartRef2.current.chart.fullscreen.toggle()}
            title="Maximizar gráfico"
          >⛶</button>
          <HighchartsReact highcharts={Highcharts} options={{}} ref={chartRef2} />
        </div>
      </div>
    </section>
  );
}

export default GeneracionHoraria;
