// src/components/GraficaPrecios.jsx
import React, { useMemo } from 'react';
import { useGraficaPrecios } from '../services/graficasService';
import ChartWrapper from './charts/ChartWrapper';


export function GraficaPrecios({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
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

  return (
    <ChartWrapper
      options={options}
      isLoading={loading}
      error={error}
      chartTitle="Precios de Bolsa (horario)"
      loadingMessage="Cargando gráfica de precios..."
      height={350}
    />
  );
}

export default GraficaPrecios;