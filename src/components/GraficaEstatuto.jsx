import tokens from '../styles/theme.js';

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
          labels: { style: { color: tokens.colors.status.info } }
        },
        {
          title: { text: 'Precio (COP)' },
          opposite: true,
          labels: { style: { color: tokens.colors.accent.primary } }
        }
      ],
      series: [
        {
          name: 'Volumen útil',
          data: dataVolumen,
          type: 'column',
          color: tokens.colors.status.info,
          yAxis: 0
        },
        {
          name: 'Precio Punta',
          data: dataPrecioPunta,
          type: 'line',
          color: tokens.colors.accent.primary,
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
