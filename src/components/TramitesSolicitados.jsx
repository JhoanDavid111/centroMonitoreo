// src/components/TramitesSolicitados.jsx
import Highcharts from '../lib/highcharts-config';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';

// ⬅️ Hook con React Query + apiClient (igual que Indicadores6GW)
import { useTramitesSolicitadosOASS } from '../services/indicadoresAmbientalesService';

function TramitesSolicitados() {
  const { data: apiData, isLoading: loading, error } = useTramitesSolicitadosOASS();

  const options = useMemo(() => {
    const serieTemporal = apiData?.serie_temporal;

    const categorias = serieTemporal?.serie?.map((p) => p.periodo) || [];
    const valores     = serieTemporal?.serie?.map((p) => Number(p.valor ?? 0)) || [];

    const fuente  = serieTemporal?.fuente || 'Minenergía – OAAS';
    const ultima  = serieTemporal?.ultimaActualizacion || '';
    const titulo  = serieTemporal?.titulo || 'Trámites solicitados entre 2022 y 2025';
    const unidad  = serieTemporal?.unidad || 'N.º de trámites solicitados';

    const subtitleText = `Fuente: ${fuente}${ultima ? ` / Actualizado el: ${ultima}` : ''}`;

    return {
      chart: {
        backgroundColor: '#262626',
        height: 420,
        spacingTop: 20,
        spacingLeft: 40,
        spacingRight: 20,
        spacingBottom: 40,
      },
      title: {
        text: titulo,
        align: 'left',
        style: {
          color: '#FFFFFF',
          fontSize: '18px',
          fontWeight: '600',
          fontFamily: 'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont',
        },
        margin: 20,
      },
      subtitle: {
        text: subtitleText,
        align: 'left',
        style: {
          color: '#9CA3AF',
          fontSize: '12px',
          fontFamily: 'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont',
        },
        y: 34,
      },
      xAxis: {
        categories: categorias,
        lineColor: '#374151',
        tickColor: '#374151',
        labels: { style: { color: '#9CA3AF', fontSize: '11px' } },
      },
      yAxis: {
        title: {
          text: unidad,
          style: { color: '#9CA3AF', fontSize: '12px' },
        },
        gridLineColor: '#111827',
        labels: { style: { color: '#9CA3AF', fontSize: '11px' } },
      },
      legend: { enabled: false },
      tooltip: {
        backgroundColor: '#111827',
        borderColor: '#374151',
        style: { color: '#F9FAFB', fontSize: '12px' },
        pointFormat: '<b>{point.y}</b> trámites',
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            formatter: function () { return this.y; },
            style: { color: '#F9FAFB', textOutline: 'none', fontSize: '11px' },
          },
        },
        line: {
          marker: {
            enabled: true,
            radius: 6,
            symbol: 'circle',
            lineWidth: 0,
          },
        },
      },
      series: [
        {
          type: 'line',
          data: valores,
          color: '#7DDF4B',
        },
      ],
      credits: { enabled: false },
      exporting: { enabled: true },
    };
  }, [apiData]);

  if (loading) {
    return (
      <div className="px-2 mt-6">
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 pb-8 shadow animate-pulse h-[420px]" />
      </div>
    );
  }

  if (error) {
    const msg = typeof error === 'string' ? error : (error?.message || 'Error al cargar los datos.');
    return (
      <div className="px-2 mt-6">
        <div className="bg-[#262626] border border-red-500 text-red-400 rounded-xl p-4 shadow">
          Error al cargar los datos de trámites: {msg}
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 mt-6">
      <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 pb-8 shadow">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}

export default TramitesSolicitados;
