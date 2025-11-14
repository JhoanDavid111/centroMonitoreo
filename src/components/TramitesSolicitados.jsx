// src/components/TramitesSolicitados.jsx

import Highcharts from '../lib/highcharts-config';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useMemo, useState } from 'react';

const API_URL = 'http://192.168.8.138:8002/v1/graficas/oass/tramites_solicitados';

function TramitesSolicitados() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch directo (POST) dentro del componente
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });

        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

        const json = await res.json();
        if (!cancelled) setApiData(json);
      } catch (err) {
        if (!cancelled) {
          console.error('[TramitesSolicitados] Error:', err);
          setError(err.message || 'Error al cargar los datos.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const options = useMemo(() => {
    const serieTemporal = apiData?.serie_temporal;

    const categorias =
      serieTemporal?.serie?.map((p) => p.periodo) || [];
    const valores =
      serieTemporal?.serie?.map((p) => Number(p.valor ?? 0)) || [];

    const fuente = serieTemporal?.fuente || 'Minenergía – OAAS';
    const ultima = serieTemporal?.ultimaActualizacion || '';
    const subtitleText = `Fuente: ${fuente}${
      ultima ? ` / Actualizado el: ${ultima}` : ''
    }`;

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
        text:
          serieTemporal?.titulo ||
          'Trámites solicitados entre 2022 y 2025',
        align: 'left',
        style: {
          color: '#FFFFFF',
          fontSize: '18px',
          fontWeight: '600',
          fontFamily:
            'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont',
        },
        margin: 20,
      },
      subtitle: {
        text: subtitleText,
        align: 'left',
        style: {
          color: '#9CA3AF',
          fontSize: '12px',
          fontFamily:
            'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont',
        },
        y: 34, // separa subtítulo de la línea de la gráfica
      },
      xAxis: {
        categories: categorias,
        lineColor: '#374151',
        tickColor: '#374151',
        labels: {
          style: { color: '#9CA3AF', fontSize: '11px' },
        },
      },
      yAxis: {
        title: {
          text:
            serieTemporal?.unidad ||
            'N.º de trámites solicitados',
          style: { color: '#9CA3AF', fontSize: '12px' },
        },
        gridLineColor: '#111827',
        labels: {
          style: { color: '#9CA3AF', fontSize: '11px' },
        },
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
            formatter: function () {
              return this.y;
            },
            style: {
              color: '#F9FAFB',
              textOutline: 'none',
              fontSize: '11px',
            },
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
    return (
      <div className="px-2 mt-6">
        <div className="bg-[#262626] border border-red-500 text-red-400 rounded-xl p-4 shadow">
          Error al cargar los datos de trámites: {error}
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
