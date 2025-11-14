import { useState } from 'react';
import Highcharts from '../lib/highcharts-config';
import HighchartsReact from 'highcharts-react-official';
import tokens from '../styles/theme.js';
import { useTooltips } from '../services/tooltipsService.js';
import TooltipModal from './ui/TooltipModal.jsx';


// Configuración de gráficas ANLA
const resumenANLAOptions = {
    chart: {
        type: 'column',
        backgroundColor: tokens.colors.surface.primary,
        spacing: [10, 10, 30, 10]
      },
    title: {
      text: 'Licencias FNCER otorgadas desde 07/08/2022 hasta la fecha',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: tokens.colors.text.primary
      }
    },
    xAxis: {
      type: 'category',
      categories: ['2022', '2023', '2024', '2025'],
      tickPositions: [0, 1, 2, 3],
      title: {
        text: 'Año',
        style: { fontWeight: 'bold', color: '#ccc' }
      },
      labels: {
        enabled: true,
        step: 1,
        autoRotation: false,
        rotation: 0,
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#eee'
        }
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
          color: tokens.colors.text.primary,
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
      backgroundColor: tokens.colors.surface.secondary,
      borderColor: '#555',
      borderWidth: 1,
      itemStyle: {
        color: '#ccc',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      backgroundColor: tokens.colors.surface.primary,
      borderColor: '#666',
      style: { color: tokens.colors.text.primary, fontSize: '13px' },
      padding: 10,
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
            color: tokens.colors.text.primary,
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
        color: '#5DFF97'
      },
      {
        name: 'Fotovoltaico',
        data: [4, 3, 4, 5],
        color: tokens.colors.accent.primary
      },
      {
        name: 'LT',
        data: [2, 6, 4, 3],
        color: tokens.colors.status.positive
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
      { name: '2021', y: 571.2, color: tokens.colors.status.positive },
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
      { name: '2024', y: 200.0, color: tokens.colors.status.positive }
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
      { name: '2025', y: 200.0, color: tokens.colors.status.positive }
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
      { name: '2025', y: 400.0, color: tokens.colors.status.positive }
    ]
  }
];

const getChartOptions = (serie, index) => ({
  chart: { type: 'column',
    backgroundColor: tokens.colors.surface.primary,
    borderWidth: 1,
    borderColor: tokens.colors.surface.primary,
    plotBorderWidth: 1,
    plotborderColor: tokens.colors.surface.primary
  },
  title: {
    text: serie.name,
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: tokens.colors.text.primary
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
        style: { fontWeight: 'bold', color: tokens.colors.text.primary },
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
  { name: 'Córdoba - Sucre', dias: 476 }
];

const viridisPalette = [
  '#440154', '#463276', '#366c8d', '#277f8e',
  '#1fa187', '#4ac16d', '#a0da39', '#fde725'
];

const tiempoPromedioANLAOptions = {
  chart: {
    type: 'bar',
    backgroundColor: tokens.colors.surface.primary,
    style: {
      ffontFamily: 'Nunito Sans, Segoe UI, sans-serif'
    },
    spacing: [10, 10, 30, 10]
  },
  title: {
    text: 'Tiempo promedio de aprobación de licencias por departamento',
    style: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: tokens.colors.text.primary
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
    tickPositions: [0, 1, 2, 3, 4, 5, 6, 7],
    labels: {
      enabled: true,
      step: 1,
      autoRotation: false,
      rotation: 0,
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
    title: { text: null },
    labels: {
      style: {
        color: '#eee',
        fontSize: '12px'
      }
    },
    gridLineColor: '#388'
  },
  tooltip: {
    backgroundColor: tokens.colors.surface.primary,
    borderColor: '#666',
    style: { color: tokens.colors.text.primary, fontSize: '13px' },
    padding: 10,
    valueSuffix: 'dias',
    pointFormat: 'Promedio de aprobación: <b>{point.y}</b>',
    useHTML: true
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      dataLabels: {
        enabled: true,
        format: '{point.y} dias',
        color: tokens.colors.text.primary,
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
    name: "Tiempo Promedio de Aprobación (Días)",
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

export default function GraficaANLA() {
  const { data: tooltips } = useTooltips();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const handleHelpClick = (identifier, title) => {
    if (tooltips && tooltips[identifier]) {
      setModalTitle(title);
      setModalContent(tooltips[identifier]);
      setIsModalOpen(true);
    } else {
      setModalTitle(title);
      setModalContent('No hay información disponible.');
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle('');
    setModalContent('');
  };

  return (
    <div className="space-y-6 rounded-lg">
      {/* Gráfico Resumen ANLA */}
      <div className="bg-surface-primary p-4 rounded-lg border border-[color:var(--border-default)] shadow relative">
        <button
          className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
          style={{ width: 30, height: 30 }}
          title="Ayuda"
          onClick={() => handleHelpClick('proy_grafica_fncer_otorgada', 'Licencias FNCER otorgadas desde 07/08/2022 hasta la fecha')}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="rounded-full">
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

      {/* Gráficos por departamento */}
      {/*<h2 className="text-xl font-semibold mb-4 text-white">
        Evolución de la capacidad instalada licenciada por Departamento
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {seriesData.map((serie, index) => (
          <div key={index} className="bg-surface-primary rounded-lg border border-[color:var(--border-default)] h-[420px] p-1  relative h-[420px]">
            <button
          className="absolute top-[13px] right-[48px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
          style={{ width: 30, height: 30 }}
          title="Ayuda"
          onClick={() => alert(`Gráfica de ${serie.name}: Muestra la capacidad instalada licenciada en MW por año.`)}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
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
            <HighchartsReact highcharts={Highcharts} options={getChartOptions(serie, index)} />
          </div>
        ))}
      </div>*/}

      {/* Gráfico de tiempos promedio */}
      <div className="bg-surface-primary rounded-lg border border-[color:var(--border-default)] relative p-2">
        <button
          className="absolute top-[4%] right-[52px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
          style={{ width: 30, height: 30 }}
          title="Ayuda"
          onClick={() => handleHelpClick('proy_grafica_tiempo_promedio_aprobacion_licencia_dpto', 'Tiempo promedio de aprobación de licencias por departamento')}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
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
        <HighchartsReact highcharts={Highcharts} options={tiempoPromedioANLAOptions} />
      </div>
      {isModalOpen && (
        <TooltipModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalTitle}
          content={modalContent}
        />
      )}
    </div>
  );
}
