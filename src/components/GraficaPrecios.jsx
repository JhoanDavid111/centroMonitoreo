// src/components/GraficaPrecios.jsx
import React, { useMemo, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useGraficaPrecios } from '../services/graficasService';


export function GraficaPrecios({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const chartRef = useRef(null);
  const { data, isLoading: loading, error } = useGraficaPrecios(
    { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  );

  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    // Extraer categorías (fechas):
    const categories = data.map((d) => d.fecha);

    // Extraer series:
    const dataMin = data.map((d) => d['Precio Bolsa Minimo Horario']);
    const dataAvg = data.map((d) => d['Precio Bolsa Promedio Horario']);
    const dataMax = data.map((d) => d['Precio Bolsa Máximo Horario']);

    return {
      chart: {
        type: 'line',
        height: 350
      },
      title: {
        text: 'Precios de Bolsa (horario)',
        align: 'left'
      },
      subtitle: {
        text: `Fuente: API. ${fechaInicio} → ${fechaFin}`,
        align: 'left'
      },
      xAxis: {
        categories,
        title: { text: 'Fecha' }
      },
      yAxis: {
        title: { text: 'Precio (COP)' }
      },
      series: [
        {
          name: 'Mínimo',
          data: dataMin,
          color: '#00AEEF'
        },
        {
          name: 'Promedio',
          data: dataAvg,
          color: '#FFC800'
        },
        {
          name: 'Máximo',
          data: dataMax,
          color: '#D4AF37'
        }
      ]
      /* exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
          }
        }
      } */
    };
  }, [data, fechaInicio, fechaFin]);

  if (loading) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center h-64">
      <div className="flex space-x-2">
        <div
          className="w-3 h-3 rounded-full animate-bounce"
          style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }}
        ></div>
        <div
          className="w-3 h-3 rounded-full animate-bounce"
          style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }}
        ></div>
        <div
          className="w-3 h-3 rounded-full animate-bounce"
          style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }}
        ></div>
      </div>
      <p className="text-gray-300 mt-4">Cargando gráfica de precios...</p>
    </div>
    );
  }
  if (error) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
        <p className="text-red-500">{error.message || 'No fue posible cargar la gráfica de precios.'}</p>
      </div>
    );
  }

  if (!options) return null;

  return (
    <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow relative">
      {/* Botón de ayuda superpuesto */}
      <button
        className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
        style={{ width: 30, height: 30 }}
        title="Ayuda"
        onClick={() => alert('Ok puedes mostrar ayuda contextual o abrir un modal.')}
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
            y="16"
            textAnchor="middle"
            fontSize="16"
            fill="#fff"
            fontWeight="bold"
            fontFamily="Nunito Sans, sans-serif"
            pointerEvents="none"
          >?</text>
        </svg>
      </button>
      {/* Gráfica */}
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
    </div>
  );
}

export default GraficaPrecios;