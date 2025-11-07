import tokens from '../styles/theme.js';

// src/components/GraficaVolumenUtilRegion.jsx
import React, { useMemo } from 'react';
import { useGraficaVolumenUtilRegion } from '../services/graficasService';
import ChartWrapper from './charts/ChartWrapper';

export function GraficaVolumenUtilRegion({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const { data, isLoading: loading, error } = useGraficaVolumenUtilRegion(
    { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  );

  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    // data: [{ region: "...", "2025-05": número }, ...]
    const categories = data.map((d) => d.region);
    const valores = data.map((d) => {
      // Obtenemos la única clave distinta de "region"
      const key = Object.keys(d).find((k) => k !== 'region');
      return d[key];
    });

    return {
      chart: { type: 'column', height: 350 },
      title: { text: 'Volumen útil por región (mes)', align: 'left' },
      subtitle: { text: `Fuente: API. ${fechaInicio} → ${fechaFin}`, align: 'left' },
      xAxis: { categories, title: { text: 'Región' } },
      yAxis: { title: { text: 'Volumen útil (GWh)' } },
      series: [{ name: 'Volumen útil', data: valores, color: tokens.colors.status.info }],
    };
  }, [data, fechaInicio, fechaFin]);

  return (
    <ChartWrapper
      options={options}
      isLoading={loading}
      error={error}
      chartTitle="Volumen útil por región (mes)"
      loadingMessage="Cargando gráfica..."
      height={350}
    />
  );
}

export default GraficaVolumenUtilRegion;
