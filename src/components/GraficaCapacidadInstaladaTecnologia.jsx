// src/components/GraficaCapacidadInstaladaTecnologia.jsx
import React, { useMemo } from 'react';
import { useGraficaCapacidadInstaladaTecnologia } from '../services/graficasService';
import ChartWrapper from './charts/ChartWrapper';

const CHART_TOOLTIP_ID = 'res_grafica_capacidad_instalada_tecnologia';

export function GraficaCapacidadInstaladaTecnologia({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const { data, isLoading: loading, error } = useGraficaCapacidadInstaladaTecnologia(
    { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  );

  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    const categories = data.map((d) => d.fuente);
    const valores = data.map((d) => {
      const key = Object.keys(d).find((k) => k !== 'fuente');
      return d[key];
    });

    return {
      chart: { type: 'column', height: 350 },
      title: { text: 'Capacidad instalada por tecnología', align: 'left'},
      subtitle: { text: `Fuente: API. ${fechaInicio} → ${fechaFin}`,align: 'left' },
      xAxis: { categories, title: { text: 'Fuente' } },
      yAxis: { title: { text: 'Capacidad (GW)' } },
      series: [
        { name: 'Capacidad inst.', data: valores, color: '#FFC800' }
      ],
    };
  }, [data, fechaInicio, fechaFin]);

  return (
    <ChartWrapper
      options={options}
      isLoading={loading}
      error={error}
      tooltipId={CHART_TOOLTIP_ID}
      chartTitle="Capacidad instalada por tecnología"
      loadingMessage="Cargando gráfica de capacidad instalada..."
      height={350}
    />
  );
}

export default GraficaCapacidadInstaladaTecnologia;
