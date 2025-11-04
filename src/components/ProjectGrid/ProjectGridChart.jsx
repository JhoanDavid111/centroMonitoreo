// src/components/ProjectGrid/ProjectGridChart.jsx
import { useRef, useEffect } from 'react';
import Highcharts from '../../lib/highcharts-config';
import HighchartsReact from 'highcharts-react-official';
import ChartLoadingState from '../charts/ChartLoadingState';
import ChartErrorState from '../charts/ChartErrorState';

/**
 * Componente para mostrar la gráfica de Curva S
 */
export default function ProjectGridChart({ 
  showChart, 
  chartOptions, 
  loading, 
  error,
  onMountRef
}) {
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (onMountRef) {
      onMountRef({ chartRef, chartContainerRef });
    }
  }, [onMountRef]);

  useEffect(() => {
    const onResize = () => chartRef.current?.chart?.reflow();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!showChart) return null;

  return (
    <div
      ref={chartContainerRef}
      className="mt-6 bg-[#262626] p-4 rounded-lg shadow min-h-[600px] scroll-mt-24"
    >
      {loading ? (
        <ChartLoadingState message="Cargando curva S…" />
      ) : error ? (
        <ChartErrorState error={error} />
      ) : (
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          ref={chartRef}
        />
      )}
    </div>
  );
}

