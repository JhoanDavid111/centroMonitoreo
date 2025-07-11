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
const CACHE_PREFIX = 'resumen-charts-cache-';
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

// Tema oscuro y Nunito Sans
Highcharts.setOptions({
  chart: { backgroundColor: '#262626', style: { fontFamily: 'Nunito Sans, sans-serif' } },
  title: { align: 'left', style: { color: '#fff' } },
  subtitle: { style: { color: '#aaa' } },
  xAxis: {
    labels: { style: { color: '#ccc', fontSize: '12px' } },
    title: { style: { color: '#ccc' } },
    gridLineColor: '#333'
  },
  yAxis: {
    labels: { style: { color: '#ccc', fontSize: '12px' } },
    title: { style: { color: '#ccc' } },
    gridLineColor: '#333'
  },
  legend: {
    itemStyle: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#262626',
    style: { color: '#fff', fontSize: '12px' }
  }
});

export function ResumenCharts() {
  const [charts, setCharts] = useState([]);
  const [selected, setSelected] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const chartRefs = useRef([]);

  useEffect(() => {
    let isMounted = true;
    const cacheKey = 'resumen_charts_data';

    const fetchData = async () => {
      try {
        // Verificar caché primero
        const cachedData = getFromCache(cacheKey);
        if (cachedData && isMounted) {
          setCharts(cachedData);
          setIsCached(true);
          setLoading(false);
          return;
        }

        setLoading(true);
        setIsCached(false);
        setError(null);

        // Fetch data from API
        const [techJson, catJson, entradaJson, matJson] = await Promise.all([
          fetch(`${API}/v1/graficas/6g_proyecto/capacidad_por_tecnologia`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }
          }).then(r => r.json()),
          fetch(`${API}/v1/graficas/6g_proyecto/capacidad_por_categoria`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }
          }).then(r => r.json()),
          fetch(`${API}/v1/graficas/6g_proyecto/capacidad_por_entrar_075`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }
          }).then(r => r.json()),
          fetch(`${API}/v1/graficas/6g_proyecto/grafica_matriz_completa_anual`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }
          }).then(r => r.json())
        ]);

        // Validar datos recibidos
        if (!techJson || !catJson || !entradaJson || !matJson) {
          throw new Error('Datos incompletos recibidos del servidor');
        }

        const techColor = {
          'BIOMASA': '#B39FFF',
          'EOLICA': '#5DFF97',
          'EÓLICA': '#5DFF97',
          'PCH': '#3B82F6',
          'SOLAR': '#FFC800',
          'TERMICA': '#F97316',
          'TÉRMICA': '#F97316',
        };

        const catColor = {
          'AGGE': '#0991B5',
          'AGPE': '#00FBFA',
          'Generacion Centralizada': '#B8F600',
          'Generacion Distribuida': '#FDBA74'
        };

        const matColor = {
          'BIOMASA': '#B39FFF',
          'HIDRAULICA': '#3B82F6',
          'RAD SOLAR': '#FFC800',
          'TERMICA': '#F97316',
          'TÉRMICA': '#F97316',
        };

        const colorEntrada = {
          'BIOMASA Y RESIDUOS': '#B39FFF',
          'EOLICA': '#5DFF97',
          'EOLICA': '#5DFF97',
          'PCH': '#3B82F6',
          'SOLAR FV': '#FFC800'
        };

        const opts = [];

        // 1) Pie tecnología
        opts.push({
          chart: { type: 'pie', height: 500, backgroundColor: '#262626' },
          title: { 
            text: 'Distribución actual por tecnología',
            align: 'left',
            subtitle: { text: isCached ? '(Datos en caché)' : '' }
          },
          legend: {
            itemStyle: { fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' }
          },
          plotOptions: {
            pie: {
              innerSize: 0,
              dataLabels: { 
                enabled: true, 
                format: '<b>{point.name}</b>: {point.y:.2f} MW', 
                style: {
                  fontSize: '12px',
                  textOutline: 'none',
                  color: "#fff"
                },
              },
              showInLegend: true
            }
          },
          series: [{
            name: 'Tecnología',
            colorByPoint: false,
            data: techJson.map(d => ({
              name: d.tipo_tecnologia,
              y: d.porcentaje,
              color: techColor[d.tipo_tecnologia] || '#666666',
              textOutline: 'none'
            }))
          }],
          tooltip: { pointFormat: '{series.name}: <b>{point.y:.2f} %</b>' },
          exporting: { enabled: true }
        });

        // 2) Pie categoría
        opts.push({
          chart: { type: 'pie', height: 500, backgroundColor: '#262626' },
          title: { 
            text: 'Distribución de capacidad instalada por tipo de proyecto',
            align: 'left',
            subtitle: { text: isCached ? '(Datos en caché)' : '' }
          },
          plotOptions: {
            pie: {
              innerSize: 0,
              dataLabels: { 
                enabled: true, 
                format: '<b>{point.name}</b>: {point.y:.2f} MW',
                style: {
                  fontSize: '12px',
                  textOutline: 'none',
                  color: "#fff"
                },
              },
              showInLegend: true
            }
          },
          legend: {
            itemStyle: { fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' }
          },
          series: [{
            name: 'Categoría',
            colorByPoint: false,
            data: catJson.map(d => ({
              name: d.tipo_proyecto,
              y: d.porcentaje,
              color: catColor[d.tipo_proyecto] || '#666666',
              style: {
                  fontSize: '12px',
                  fontFamily: 'Nunito Sans, sans-serif',
                },
            }))
          }],
          tooltip: { pointFormat: '{series.name}: <b>{point.y:.2f} %</b>' },
          exporting: { enabled: true }
        });

        // 3) Capacidad Entrante por mes
        const meses = entradaJson.map(item => item.mes);
        const tecnologias = Object.keys(entradaJson[0]).filter(k => k !== 'mes');

        const seriesData = tecnologias.map(tec => ({
          name: tec,
          data: entradaJson.map(mes => mes[tec] || 0),
          color: colorEntrada[tec] || '#666666'
        }));

        const totalPorMes = entradaJson.map((item, idx) => {
          const total = tecnologias.reduce((sum, tec) => sum + (item[tec] || 0), 0);
          return {
            x: idx,
            y: total,
            dataLabels: {
              enabled: true,
              format: '{y:.1f}',
              style: { color: '#fff', textOutline: 'none', fontWeight: 'bold' },
              verticalAlign: 'bottom'
            },
            color: 'transparent' // No visible
          };
        });

        opts.push({
          chart: { type: 'column', height: 350, backgroundColor: '#262626' },
          title: { 
            text: 'Capacidad entrante por mes',
            align: 'left',
            subtitle: { text: isCached ? '(Datos en caché)' : '' }
          },
          legend: {
            itemStyle: { fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' }
          },
          xAxis: {
            categories: meses,           
            tickInterval: 1,             
            title: {
              text: 'Mes',
              style: { color: '#ccc' }
            },
            labels: {
              style: { color: '#ccc', fontSize: '12px' },
              step: 1,                  
              rotation: -45,             
              autoRotation: false       
            },
            gridLineColor: '#333'
          },
          yAxis: {
            title: { text: 'Capacidad (MW)', style: { color: '#ccc' } },
            labels: { style: { color: '#ccc', fontSize: '12px' } },
            tickAmount: 5,
            gridLineColor: '#333'
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              borderWidth: 0,
              dataLabels: { enabled: false }
            }
          },
          series: [
            ...seriesData,
            {
              name: 'Total',
              type: 'scatter',
              marker: { enabled: false },
              data: totalPorMes,
              enableMouseTracking: false
            }
          ],
          exporting: { enabled: true }
        });

        // 4) Column histórico anual matriz completa
        const years = Object.keys(matJson[0]).filter(k => k !== 'fuente');
        opts.push({
          chart: { type: 'column', height: 350, backgroundColor: '#262626' },
          title: { 
            text: 'Histórico anual matriz completa',
            align: 'left',
            subtitle: { text: isCached ? '(Datos en caché)' : '' }
          },
          legend: {
            itemStyle: { fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' }
          },
          xAxis: {
            categories: years,
            tickInterval: 1,
            labels: { style: { color: '#ccc', fontSize: '12px' } },
            title: { text: 'Año', style: { color: '#ccc' } },
            gridLineColor: '#333'
          },
          yAxis: {
            title: { text: 'Capacidad Instalada (GW)', style: { color: '#ccc' } },
            labels: { style: { color: '#ccc', fontSize: '12px' } },
            tickAmount: 6,
            gridLineColor: '#333'
          },
          plotOptions: { column: { stacking: 'normal', borderWidth: 0 } },
          series: matJson.map(row => ({
            name: row.fuente,
            data: years.map(y => row[y] ?? 0),
            color: matColor[row.fuente] || '#666666'
          })),
          exporting: { enabled: true }
        });

        if (isMounted) {
          setCharts(opts);
          setToCache(cacheKey, opts);
          
          // Forzar redibujado de gráficos después de un breve retraso
          setTimeout(() => {
            chartRefs.current.forEach(ref => {
              if (ref && ref.chart) {
                ref.chart.reflow();
              }
            });
          }, 200);
        }
      } catch (err) {
        console.error('Error:', err);
        if (isMounted) {
          setError(err.message || 'Error al cargar los datos');
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
      <div className="bg-[#262626] p-4 rounded-lg border border-gray-700 shadow flex flex-col items-center justify-center h-[500px]">
        <div className="flex space-x-2">
          <div
            className="w-3 h-3 rounded-full animate-bounce"
            style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }}
          ></div>
          <div
            className="w-3 h-3 rounded-full animate-bounce"
            style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-3 h-3 rounded-full animate-bounce"
            style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }}
          ></div>
        </div>
        <p className="text-gray-300 mt-4">Cargando gráficas resumen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#262626] p-4 rounded-lg border shadow flex flex-col items-center justify-center h-[500px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-500 text-center max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const isFiltered = selected !== 'all';
  const gridClasses = isFiltered
    ? 'grid-cols-1 lg:grid-cols-1'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2';
  const displayed = charts
    .map((opt, idx) => ({ opt, idx }))
    .filter(item => selected === 'all' || String(item.idx) === selected);

  return (
    <section className="mt-8">
      <div className={`grid ${gridClasses} gap-4`}>
        {displayed.map(({ opt, idx }) => (
          <div
            key={idx}
            className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow relative"
          >
            <button
              className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
              style={{ width: 30, height: 30 }}
              title="Ayuda"
              onClick={() => alert(opt.title.text + '\n\nEsta gráfica muestra datos importantes sobre la capacidad instalada.')}
              type="button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="rounded-full"
              >
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
            
            <HighchartsReact
              highcharts={Highcharts}
              options={opt}
              ref={el => (chartRefs.current[idx] = el)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ResumenCharts;