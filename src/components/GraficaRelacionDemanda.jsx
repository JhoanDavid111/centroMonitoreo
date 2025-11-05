// src/components/GraficaRelacionDemanda.jsx
import React, { useMemo } from 'react';
import { useGraficaRelacionDemanda } from '../services/graficasService';
import ChartWrapper from './charts/ChartWrapper';

export function GraficaRelacionDemanda({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const { data, isLoading: loading, error } = useGraficaRelacionDemanda(
    { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  );

  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    const categories = data.map((d) => d.fecha);
    const dataOEF = data.map((d) => d['Relacion Demanda Comercial / OEF']);
    const dataEFICC = data.map((d) => d['Relacion Demanda Comercial / EFICC']);

    return {
      chart: { type: 'line', height: 350 },
      title: { text: 'Relación Demanda / Firme',align: 'left' },
      subtitle: { text: `Fuente: API. ${fechaInicio} → ${fechaFin}`,align: 'left' },
      xAxis: { categories, title: { text: 'Fecha' } },
      yAxis: { title: { text: 'Ratio' } },
      series: [
        { name: 'Dem / OEF', data: dataOEF, color: '#FFC800' },
        { name: 'Dem / EFICC', data: dataEFICC, color: '#4CAF50' }
      ],
    };
  }, [data, fechaInicio, fechaFin]);

  return (
    <ChartWrapper
      options={options}
      isLoading={loading}
      error={error}
      chartTitle="Relación Demanda / Firme"
      loadingMessage="Cargando gráfica..."
      height={350}
    />
  );
}

export default GraficaRelacionDemanda;
