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

  // --- CAPACIDAD Y PROYECTOS ---
  const categories = [
    '0-5','5-10','10-15','15-20','20-25','25-30','30-35','35-40','40-45',
    '45-50','50-55','55-60','60-65','65-70','70-75','75-80','80-85','85-90','90-95','95-100'
  ];
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
      tickInterval: 1,
      labels: {
        style:         { color: '#ccc', fontSize: '10px' },
        rotation:      -45,
        step:           1,
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

  // --- ANLA (solo lo de la función GraficaANLA) ---
  const resumenANLAOptions = {
    chart: {
      type: 'column',
      backgroundColor: '#262626',
      spacing: [10, 10, 30, 10]
    },
    title: {
      text: 'Licencias FNCER otorgadas desde 07/08/2022 hasta la fecha',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#fff'
      }
    },
    xAxis: {
      categories: ['2022', '2023', '2024', '2025'],
      title: {
        text: 'Año',
        style: { fontWeight: 'bold', color: '#ccc' }
      },
      labels: {
        style: { fontSize: '12px', fontWeight: 'bold', color: '#eee' }
      },
      gridLineColor: '#333',
      lineColor: '#444'
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Cantidad de Licencias FNCER otorgadas',
        style: { fontWeight: 'bold', color: '#ccc' }
      },
      labels: {
        style: { fontSize: '12px', color: '#ddd' }
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: '#fff',
          textOutline: 'none'
        }
      },
      gridLineColor: '#333'
    },
    legend: {
      align: 'right',
      verticalAlign: 'top',
      x: -30,
      y: 25,
      floating: true,
      backgroundColor: '#1f1f1f',
      borderColor: '#555',
      borderWidth: 1,
      itemStyle: {
        color: '#ccc',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      backgroundColor: '#1a1a1a',
      borderColor: '#333',
      style: { color: '#fff' },
      headerFormat: '<b>{category}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
      useHTML: true
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          style: {
            color: '#fff',
            fontWeight: 'bold',
            textOutline: 'none'
          }
        }
      }
    },
    series: [
      {
        name: 'Eólico',
        data: [1, 1, 0, 0],
        color: '#39FF14'
      },
      {
        name: 'Fotovoltaico',
        data: [4, 3, 4, 5],
        color: '#7FFF00'
      },
      {
        name: 'LT',
        data: [2, 6, 4, 3],
        color: '#228B22'
      }
    ],
    credits: { enabled: false }
  };

  const seriesData = [
    {
      name: 'La Guajira',
      data: [
        { name: '2018', y: 240.0, color: '#0B6623' },
        { name: '2019', y: 346.5, color: '#32CD32' },
        { name: '2020', y: 200.0, color: '#39FF14' },
        { name: '2021', y: 571.2, color: '#228B22' },
        { name: '2022', y: 571.2, color: '#3CB371' },
        { name: '2023', y: 100.0, color: '#2E8B57' }
      ]
    },
    {
      name: 'Santander',
      data: [
        { name: '2019', y: 100.5, color: '#0B6623' },
        { name: '2022', y: 200.0, color: '#32CD32' },
        { name: '2023', y: 360.0, color: '#39FF14' },
        { name: '2024', y: 200.0, color: '#228B22' }
      ]
    },
    {
      name: 'Atlántico',
      data: [
        {name:'2021', y: 599.5, color:'#0B6623'},
        {name:'2022', y: 200.0, color:'#32CD32'}
      ]
    },
    {
      name: 'Cesar',
      data: [
        { name: '2019', y: 250.4, color: '#0B6623' },
        { name: '2021', y: 101.0, color: '#32CD32' },
        { name: '2023', y: 240.0, color: '#39FF14' },
        { name: '2025', y: 200.0, color: '#228B22' }
      ]
    },
    {
      name: 'Cundinamarca',
      data: [
        { name: '2022', y: 300.0, color: '#0B6623' },
        { name: '2023', y: 100.0, color: '#32CD32' }
      ]
    },
    {
      name: 'Córdoba - Sucre',
      data: [
        { name: '2025', y: 350.0, color: '#0B6623' }
      ]
    },
    {
      name: 'Córdoba',
      data: [
        { name: '2024', y: 200.0, color: '#0B6623' },
        { name: '2025', y: 135.0, color: '#32CD32' }
      ]
    },
    {
      name: 'Otros',
      data: [
        { name: '2021', y: 121.3, color: '#0B6623' },
        { name: '2022', y: 360.0, color: '#32CD32' },
        { name: '2024', y: 250.0, color: '#39FF14' },
        { name: '2025', y: 400.0, color: '#228B22' }
      ]
    }
  ];

  const getChartOptions = (serie, index) => ({
    chart: { type: 'column',
      backgroundColor: '#262626',
      borderWidth: 1,
      borderColor: '#262626',
      plotBorderWidth: 1,
      plotBorderColor: '#262626'
    },
    title: {
      text: serie.name,
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#fff'
      }
    },
    xAxis: {
      type: 'category',
      tickInterval: 1,
      title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
      labels: {
        rotation: 0,
        step: 1,
        style: { fontSize: '12px', fontWeight: 'bold', color: '#eee' }
      },
      crosshair: true
    },
    yAxis: {
      title: { text: 'MW Licenciados', style: { fontWeight: 'bold', color: '#ccc' } },
      min: 0,
      gridLineWidth: 1,
      labels: { style: { fontSize: '12px', color: '#eee' } },
    },
    legend: { enabled: false },
    plotOptions: {
      column: {
        borderRadius: 4,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y}',
          style: { fontWeight: 'bold', color: '#fff' },
          y: -20
        },
        pointPadding: 0.1,
        groupPadding: 0.1
      }
    },
    series: [{
      name: serie.name,
      data: serie.data
    }]
  });

  const datosTiempos = [
    { name: 'Cundinamarca', dias: 199 },
    { name: 'Otros', dias: 206 },
    { name: 'La Guajira', dias: 219 },
    { name: 'Atlántico', dias: 221 },
    { name: 'Córdoba', dias: 255 },
    { name: 'Cesar', dias: 287 },
    { name: 'Santander', dias: 288 },
    { name: 'Códoba - Sucre', dias: 476 }
  ];
  const viridisPalette = [
    '#440154', '#46327e', '#365c8d', '#277f8e',
    '#1fa187', '#4ac16d', '#a0da39', '#fde725'
  ];
  const tiempoPromedioANLAOptions = {
    chart: {
      type: 'bar',
      backgroundColor: '#262626',
      style: {
        fontFamily: 'Nunito Sans, Segoe UI, sans-serif'
      },
      spacing: [10, 10, 30, 10]
    },
    title: {
      text: 'Tiempo Promedio de Aprobación de Licencias por Departamento',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#fff'
      }
    },
    subtitle: {
      text: 'Desde la fecha de inicio hasta la fecha de la licencia',
      style: {
        fontSize: '14px',
        color: '#ccc'
      }
    },
    xAxis: {
      categories: datosTiempos.map(i => i.name),
      labels: {
        style: {
          fontSize: '13px',
          fontWeight: 'bold',
          color: '#eee'
        }
      },
      gridLineColor: '#333',
      lineColor: '#444'
    },
    yAxis: {
      title: {
        text: null
      },
      labels: {
        style: {
          color: '#ccc',
          fontSize: '12px'
        }
      },
      gridLineColor: '#333'
    },
    tooltip: {
      backgroundColor: '#1a1a1a',
      borderColor: '#333',
      style: { color: '#fff' },
      valueSuffix: ' días',
      pointFormat: 'Promedio de aprobación: <b>{point.y} días</b>',
      useHTML: true
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        dataLabels: {
          enabled: true,
          format: '{point.y} días',
          color: '#fff',
          inside: true,
          align: 'right',
          style: {
            fontWeight: 'bold',
            fontSize: '12px',
            textOutline: 'none'
          }
        }
      }
    },
    series: [{
      name: 'Tiempo Promedio de Aprobación (Días)',
      data: datosTiempos.map((item, index) => ({
        name: item.name,
        y: item.dias,
        color: viridisPalette[index]
      }))
    }],
    credits: {
      enabled: true,
      text: 'Fuente: ANLA - Datos procesados por la UPME',
      style: {
        fontSize: '10px',
        color: '#999'
      }
    },
    legend: { enabled: false }
  };

  // --- RENDER ---
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
        <button
          className={`pb-1 border-b-2 ${
            view === 'anla'
              ? 'border-[#FFC800] text-[#FFC800]'
              : 'border-transparent text-gray-300'
          }`}
          onClick={() => setView('anla')}
        >
          ANLA
        </button>
      </div>
      <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow relative">
      {/*   <button
          className="absolute top-2 right-2 text-gray-300 hover:text-white"
          title="Maximizar gráfico"
          onClick={() => chartRef.current.chart.fullscreen.toggle()}
        >⛶</button> */}

        {/* Renderizado condicional: SOLO muestra la pestaña seleccionada */}
        {view === 'capacidad' && (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartRef}
          />
        )}
        {view === 'proyectos' && (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartRef}
          />
        )}
        {view === 'anla' && (
          <div className="flex flex-col gap-4">
            {/* Bloque 1 */}
            <div className="bg-[#262626] border border-[#666666]">
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

              <HighchartsReact highcharts={Highcharts} options={resumenANLAOptions} />
            </div>
            <h2 className="text-xl font-semibold mb-4 text-white">
              Evolución de la capacidad instalada licenciada por Departamento
            </h2>
            {/* Bloque 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {seriesData.map((serie, index) => (
                <div key={index} className="bg-[#262626] border border-[#666666] h-[420px] p-1">
                  <HighchartsReact highcharts={Highcharts} options={getChartOptions(serie, index)} />
                </div>
              ))}
            </div>
            {/* Bloque 3 */}
            <div className="bg-[#262626] border border-[#666666]">
              <HighchartsReact highcharts={Highcharts} options={tiempoPromedioANLAOptions} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SeguimientoBarras;
