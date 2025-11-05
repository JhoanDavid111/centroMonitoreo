// src/components/GraficaEstatuto.jsx
import React, { useMemo } from 'react';
import { useGraficaEstatuto } from '../services/graficasService';
import ChartWrapper from './charts/ChartWrapper';

export function GraficaEstatuto({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const { data, isLoading: loading, error } = useGraficaEstatuto(
    { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  );

  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    const categories = data.map((d) => d.fecha);
    const dataVolumen = data.map((d) => d['Volumen útil del embalse']);
    const dataPrecioPunta = data.map((d) => d['Precio de Bolsa en Períodos Punta']);

    return {
      chart: {
        zoomType: '',
        height: 350
      },
      title: {
        text: 'Volumen útil del embalse (diario)',
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
      yAxis: [
        {
          title: { text: 'Volumen útil (GWh)' },
          labels: { style: { color: '#3B82F6' } }
        },
        {
          title: { text: 'Precio (COP)' },
          opposite: true,
          labels: { style: { color: '#FFC800' } }
        }
      ],
      series: [
        {
          name: 'Volumen útil',
          data: dataVolumen,
          type: 'column',
          color: '#3B82F6',
          yAxis: 0
        },
        {
          name: 'Precio Punta',
          data: dataPrecioPunta,
          type: 'line',
          color: '#FFC800',
          yAxis: 1
        }
      ],
    };
  }, [data, fechaInicio, fechaFin]);

  return (
    <ChartWrapper
      options={options}
      isLoading={loading}
      error={error}
      chartTitle="Volumen útil del embalse (diario)"
      loadingMessage="Cargando gráfica de estatuto..."
      height={350}
    />
  );
}

export default GraficaEstatuto;
