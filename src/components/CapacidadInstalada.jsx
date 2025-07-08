import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
import { API } from '../config/api';
import { CACHE_CONFIG } from '../config/cacheConfig'; 

// Configuración de caché
const CACHE_PREFIX = 'chart-cache-';
const CACHE_EXPIRATION_MS = CACHE_CONFIG.EXPIRATION_MS;

// Caché en memoria para la sesión actual
const memoryCache = new Map();

// Helper para obtener datos del caché
const getFromCache = (key) => {
  // Primero verificar caché en memoria
  if (memoryCache.has(key)) {
    return memoryCache.get(key);
  }

  // Si no está en memoria, verificar localStorage
  const cachedItem = localStorage.getItem(`${CACHE_PREFIX}${key}`);
  if (!cachedItem) return null;

  try {
    const { data, timestamp } = JSON.parse(cachedItem);
    
    // Verificar si el caché ha expirado
    if (Date.now() - timestamp > CACHE_EXPIRATION_MS) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    // Almacenar en memoria para acceso más rápido
    memoryCache.set(key, data);
    return data;
  } catch (e) {
    console.error('Error parsing cache', e);
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    return null;
  }
};

// Helper para guardar datos en el caché
const setToCache = (key, data) => {
  const timestamp = Date.now();
  const cacheItem = JSON.stringify({ data, timestamp });
  
  // Almacenar en ambos niveles de caché
  memoryCache.set(key, data);
  
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, cacheItem);
  } catch (e) {
    console.error('LocalStorage is full, clearing oldest items...');
    // Limpieza de caché si está lleno (mantener solo los 50 más recientes)
    const keys = Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_PREFIX))
      .map(k => ({
        key: k,
        timestamp: JSON.parse(localStorage.getItem(k)).timestamp
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
    
    keys.slice(50).forEach(item => {
      localStorage.removeItem(item.key);
    });
    
    // Intentar nuevamente
    localStorage.setItem(`${CACHE_PREFIX}${key}`, cacheItem);
  }
};

// Inicializar módulos de Highcharts
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

export function CapacidadInstalada() {
  const chartRef = useRef(null);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const cacheKey = 'capacidad_instalada_acumulada';

    const fetchData = async () => {
      try {
        // Verificar caché primero
        const cachedData = getFromCache(cacheKey);
        if (cachedData && isMounted) {
          setOptions(cachedData);
          setIsCached(true);
          setLoading(false);
          return;
        }

        setLoading(true);
        setIsCached(false);
        setError(null);

        const response = await fetch(`${API}/v1/graficas/6g_proyecto/acumulado_capacidad_proyectos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        
        const data = await response.json();
        
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('No hay datos disponibles');
        }

        // Ordenar por fecha
        const sorted = [...data].sort(
          (a, b) => new Date(a.fecha_entrada_operacion) - new Date(b.fecha_entrada_operacion)
        );

        // Detección dinámica de fuentes de energía
        const allFuentes = Object.keys(sorted[0]).filter(k => k !== 'fecha_entrada_operacion');

        const colorMap = {
          SOLAR: '#FFC800',
          EOLICA: '#5DFF97',
          VIENTO: '#FF9900',
          PCH: '#3B82F6',
          BIOMASA: '#B39FFF',
          'RAD SOLAR': '#FFC800'
        };

        // Crear series con datos [timestamp, valor]
        const series = allFuentes.map(fuente => {
          let lastValue = 0;
          const dataPoints = sorted.map(item => {
            const time = new Date(item.fecha_entrada_operacion).getTime();
            if (item[fuente] !== undefined && !isNaN(item[fuente])) {
              lastValue = parseFloat(item[fuente]);
            }
            return [time, lastValue];
          });
          return {
            name: fuente,
            data: dataPoints,
            color: colorMap[fuente] || '#666666'
          };
        });

        // Configuración de opciones de Highcharts
        const chartOptions = {
          chart: {
            type: 'area',
            backgroundColor: '#262626',
            height: 450,
            marginBottom: 100
          },
          title: {
            text: 'Capacidad acumulada por tipo de proyecto',
            style: { fontFamily: 'Nunito Sans, sans-serif', fontSize: '16px' }
          },
          subtitle: { 
            text: isCached ? '(Datos en caché)' : '', 
            style: { color: '#AAA', fontSize: '12px' } 
          },
          xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
              day: '%e %b %Y',
              month: '%b \'%y',
              year: '%Y'
            },
            labels: {
              rotation: -45,
              y: 18,
              style: {
                color: '#CCC',
                fontFamily: 'Nunito Sans, sans-serif',
                fontSize: '12px'
              }
            },
            title: { text: 'Fecha de entrada en operación', style: { color: '#FFF' } },
            lineColor: '#555',
            tickColor: '#888',
            tickLength: 5
          },
          yAxis: {
            min: 0,
            tickAmount: 6,
            gridLineDashStyle: 'Dash',
            gridLineColor: '#444',
            title: {
              text: 'Capacidad acumulada (MW)',
              style: { color: '#FFF' }
            },
            labels: {
              formatter() {
                return this.value.toLocaleString() + ' MW';
              },
              style: {
                color: '#CCC',
                fontFamily: 'Nunito Sans, sans-serif',
                fontSize: '12px'
              }
            }
          },
          tooltip: {
            backgroundColor: '#1F2937',
            style: { color: '#FFF', fontSize: '12px' },
            shared: true,
            formatter() {
              let s = `<b>Fecha: ${Highcharts.dateFormat('%e %b %Y', this.x)}</b>`;
              this.points.forEach(pt => {
                s += `<br/><span style=\"color:${pt.color}\">\u25CF</span> ${pt.series.name}: <b>${pt.y.toLocaleString()} MW</b>`;
              });
              return s;
            }
          },
          plotOptions: {
            area: {
              stacking: 'normal',
              marker: { enabled: false },
              lineWidth: 1
            }
          },
          series,
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            y: 25,
            itemStyle: { color: '#ccc', fontSize: '12px' },
            itemHoverStyle: { color: '#fff' }
          },
          exporting: {
            enabled: true,
            buttons: {
              contextButton: {
                menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
              }
            }
          }
        };

        if (isMounted) {
          setOptions(chartOptions);
          setToCache(cacheKey, chartOptions);
          setTimeout(() => chartRef.current?.chart?.redraw(), 200);
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#262626] p-4 rounded border border-[#666666] shadow flex flex-col items-center justify-center h-64">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }} />
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }} />
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }} />
        </div>
        <p className="text-gray-300 mt-4">Cargando capacidad instalada...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-[#262626] p-4 rounded border border-[#666666] shadow flex flex-col items-center justify-center h-64">
        <div className="text-red-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-300 text-center">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!options) return null;

  return (
    <section className="mt-8">
      <div className="w-full bg-[#262626] p-4 rounded border border-[#666666] shadow relative">
        {/* Botón de ayuda superpuesto */}
        <button
          className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
          style={{ width: 30, height: 30 }}
          title="Ayuda"
          onClick={() => alert('Esta gráfica muestra la capacidad acumulada de los proyectos por tipo de energía a lo largo del tiempo.')}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="rounded-full">
            <circle cx="12" cy="12" r="10" fill="#444" stroke="#fff" strokeWidth="2.5" />
            <text
              x="12"
              y="18"
              textAnchor="middle"
              fontSize="16"
              fill="#fff"
              fontWeight="bold"
              fontFamily="Nunito Sans, sans-serif"
              pointerEvents="none"
            >?</text>
          </svg>
        </button>
        {/* Gráfica */}
        <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
      </div>
    </section>
  );
}

export default CapacidadInstalada;