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
    const termicaData = [52628.14006497, 51136.7527106 , 49366.90679765, 48704.12749024,
       48474.09836175, 47649.80234143, 46565.78612738, 47041.24969367,
       47762.50126451, 48907.99846279, 49697.79856086, 51639.46869443,
       52796.87944086, 54008.81449868, 54956.25539819, 54813.17845418,
       53283.76201919, 52651.43621927, 54904.27942142, 57328.19197291,
       58554.44427697, 57998.51147943, 57751.67182234, 55708.00198264];
    const cogeneradorData = [ 9980.73573132, 10121.71998733, 10180.71690355, 10199.87297143,
       10114.0663308 , 10113.36919489,  9873.30392045,  9916.7159377 ,
        9827.06976908,  9745.55739896,  9830.96498677,  9809.07059406,
        9724.90979805,  9763.67646714,  9627.54693351,  9586.6887516 ,
        9642.23402416,  9811.1399555 ,  9813.60635556,  9888.79699109,
        9985.65841972, 10020.50652638,  9810.99178683,  9896.49868935];
    const hidraulicaData = [52265.74966395, 51358.90310441, 50531.65321052, 50252.09699815,
       51214.06562339, 53477.74704164, 53982.09380805, 56880.61794763,
       59803.94699897, 61782.19419663, 63605.20100125, 65014.81484424,
       64300.64829987, 64159.279258  , 64375.17189826, 64174.65295507,
       63438.21538918, 61678.91906607, 65787.76315723, 67381.04108242,
       65570.05250753, 62540.7647199 , 58523.61229447, 54202.91600121];

    const solarData = [   13.04709302,    12.39735632,    12.19597701,    12.28244186,
          12.40438202,    54.67483173,  1347.6444857 ,  5118.96367325,
        7310.94941686,  8887.58310051,  9843.03720619, 10250.72883596,
       10161.30766805,  9844.50765417,  9015.44575567,  7614.41182964,
        5356.17261546,  1336.6404779 ,    34.03385093,    62.99884615,
          43.86925926,    47.45777778,    42.25777778,    41.98740741];

    const termicaData2 = [53931.50490582, 50803.61164221, 48677.21632201, 46832.65336159,
       45423.55693853, 44478.8088433 , 43305.09102944, 41793.51587299,
       41976.55255888, 42156.07286167, 42733.01524317, 43690.93297961,
       44741.23279748, 45718.45072937, 46969.10865037, 48454.91204231,
       50195.06346872, 53072.79591205, 56195.49412364, 58532.31852716,
       59269.3324377 , 58254.37590523, 57929.27640158, 56630.21238229];
    const cogeneradorData2 = [ 9930.23483945, 10063.44766974, 10094.78771626, 10074.27051754,
        9996.61684633, 10055.34204937,  9944.60117376,  9824.9697464 ,
        9682.00784144,  9654.31107998,  9545.92646199,  9502.59731965,
        9593.59261357,  9707.4205316 ,  9584.88427225,  9611.69857731,
        9686.67112676,  9847.65249265,  9804.21867365,  9948.60813845,
       10046.73639325, 10023.67483276,  9934.27542939,  9823.23281875];
    const hidraulicaData2 = [55818.45951234, 54870.05545908, 53982.11640941, 53484.29258078,
       54367.60516959, 56365.57566952, 56219.54865453, 56282.96141878,
       56380.90592735, 56328.59501336, 57595.12748743, 59310.14196062,
       59055.04033691, 59859.32474868, 61349.82220683, 62542.12711538,
       63920.76109404, 64730.08854348, 69224.95052611, 70341.71747113,
       68886.69886856, 66214.63408331, 62401.27516585, 58099.02663298];
    const eolicaData2 = [ 8102.62901099,  7599.90374656,  7396.42939394,  7166.81684066,
        6725.8330303 ,  6405.11796089,  6104.94186441,  6366.35512748,
        6877.25717877,  7503.04417367,  8150.97150838,  9293.45958101,
       10296.27578212, 10720.56777778, 10902.45717452, 11063.89850416,
       11147.8515    , 10885.50519231, 10559.46184066, 10100.60859504,
        9469.1784573 ,  9126.95771978,  8975.96983516,  8653.15755495];
    const solarData2 = [    3.14045455,     2.449     ,     1.66727273,     1.192     ,
           1.13228571,    81.57632482,   985.33260984,  4504.01633957,
        7940.0850787 , 10038.71199813, 11128.95587864, 11407.38842525,
       11201.64132167, 10492.08217165,  9570.18982368,  7990.84653954,
        5060.93605324,  1216.10053925,    48.17986804,   448.1438806 ,
         398.45970588,   140.27884615,     2.56375   ,     2.46653846];

    const baseOptions = {
      chart: {
        type: 'area',
        height: 500,
        backgroundColor: '#262626'
      },
      title: {
        text: 'Curva de Generación por Tecnología Primer Semestre 2022'
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: horas,
        tickInterval: 1,
        title: {
          text: 'Hora del día',
          style: { color: '#ccc' }
        },
        labels: {
          style: { color: '#ccc', fontSize: '12px' }
        },
        gridLineColor: '#333'
      },
      yAxis: {
        min: 0,
        max:160000 , 
        title: {
          text: 'Generación (kWh)',
          style: { color: '#ccc' }
        },
        labels: {
          style: { color: '#ccc', fontSize: '12px' }
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
      { name: 'TÉRMICA',      data: termicaData,     color: '#F97316' },
      { name: 'COGENERADOR',  data: cogeneradorData, color: '#D1D1D0' },
      { name: 'HIDRÁULICA',   data: hidraulicaData,  color: '#3B82F6' },
      { name: 'SOLAR',       data: solarData,       color: '#FFC800' }    // último Térmica
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
      title: { text: 'Curva de Generación por Tecnología Ultimos 6 Meses' },
      /* series: baseOptions.series.map(s => ({
        ...s,
        data: s.data.map(v =>
          s.name === 'SOLAR' ? Math.round(v * 1) : Math.round(v * 1)
        )
      })) */
     series: [
      { name: 'TÉRMICA',      data: termicaData2,     color: '#F97316' },
      { name: 'COGENERADOR',  data: cogeneradorData2, color: '#D1D1D0' },
      { name: 'HIDRÁULICA',   data: hidraulicaData2,  color: '#3B82F6' },
      { name: 'EÓLICA',      data: eolicaData2,      color: '#5DFF97' },
      { name: 'SOLAR',       data: solarData2,       color: '#FFC800' }    // último Térmica
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
        <div className="bg-[#262626] p-4 rounded border border-[#666666] shadow relative overflow-hidden" style={{ height: '500px' }}> 
          <button
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
            onClick={() => chartRef1.current.chart.fullscreen.toggle()}
            title="Maximizar gráfico"
          >⛶</button>
          <HighchartsReact highcharts={Highcharts} options={{}} ref={chartRef1} />
        </div>
        {/* Gráfico variante */}
        <div className="bg-[#262626] p-4 rounded border border-[#666666] shadow relative overflow-hidden" style={{ height: '500px' }}>
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

