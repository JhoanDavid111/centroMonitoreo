// src/components/GraficaDemanda.jsx
import React, { useMemo } from 'react';
import { useGraficaDemanda } from '../services/graficasService';
import ChartWrapper from './charts/ChartWrapper';

export function GraficaDemanda({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const { data, isLoading: loading, error } = useGraficaDemanda(
    { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  );

  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    const categories = data.map((d) => d.fecha);
    const dataDemCom = data.map((d) => d['Demanda Comercial por Sistema']);
    const dataEnerFirm = data.map((d) => d['Energía en Firme Cargo por Confiabilidad']);
    const dataObligOEF = data.map((d) => d['Obligación de Energía en Firme']);

    return {
      chart: { type: 'line', height: 350 },
      title: { text: 'Demanda vs Energía en Firme',align: 'left' },
      subtitle: { text: `Fuente: API. ${fechaInicio} → ${fechaFin}`, align: 'left' },
      xAxis: { categories, title: { text: 'Fecha' } },
      yAxis: { title: { text: 'Cantidad' } },
      series: [
        { name: 'Demanda Comercial', data: dataDemCom, color: '#FFC800' },
        { name: 'Energía en Firme', data: dataEnerFirm, color: '#3B82F6' },
        { name: 'Obligación OEF', data: dataObligOEF, color: '#F97316' }
      ],
    };
  }, [data, fechaInicio, fechaFin]);

  return (
    <ChartWrapper
      options={options}
      isLoading={loading}
      error={error}
      chartTitle="Demanda vs Energía en Firme"
      loadingMessage="Cargando gráfica de demanda..."
      height={350}
    />
  );
}

export default GraficaDemanda;
