// src/components/DataGrid/DataGridChart.jsx

import HighchartsReact from 'highcharts-react-official';
import Highcharts, { highchartsTheme } from './styles/highcharts';
import { useEffect, useRef } from 'react';

const DataGridChart = ({ options, loading, error }) => {
  const chartRef= useRef(null);

  useEffect(() => {
    if (options && chartRef.current) {  
      //Cuando cambian las opciones (o se abre el chart), hacer scroll al contenedor
      //chartRef.current.scrollIntoView({ behavior: 'smooth',Block: 'start' });
      const y = chartRef.current.getBoundingClientRect().top + window.scrollY;
    const offset = 100; // px extra para ajustar al título del gráfico
    window.scrollTo({ top: y - offset, behavior: 'smooth' });
    }
  }, [options]);

  if (loading) return <div className="text-center py-8 text-gray-400">Cargando gráfico...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div ref={chartRef} className="mt-6 bg-[#262626] p-4 rounded-lg shadow scroll-anchor">
      <HighchartsReact
        highcharts={Highcharts}
        options={{ ...highchartsTheme, ...options }}
      />
    </div>
  );
};

export default DataGridChart;