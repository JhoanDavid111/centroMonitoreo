// src/components/GraficaCapacidadInstaladaTecnologia.jsx
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { API } from '../config/api';
import { CACHE_CONFIG } from '../config/cacheConfig'; 

// Configuración de caché
const CACHE_PREFIX = 'chart-cache-';
const CACHE_EXPIRATION_MS = CACHE_CONFIG.EXPIRATION_MS;
//console.log(`jajajajCache expiration set to ${CACHE_EXPIRATION_MS} ms`);

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

export function GraficaCapacidadInstaladaTecnologia({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const cacheKey = `capacidad-tecnologia-${fechaInicio}-${fechaFin}`;
      
      // Verificar caché primero
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        setOptions(cachedData);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/v1/graficas/energia_electrica/grafica_capacidad_instalada_tecnologia`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fecha_inicio: fechaInicio, fecha_fin: fechaFin })
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        const categories = data.map((d) => d.fuente);
        const valores = data.map((d) => {
          const key = Object.keys(d).find((k) => k !== 'fuente');
          return d[key];
        });

        const chartOptions = {
          chart: { type: 'column', height: 350 },
          title: { text: 'Capacidad instalada por tecnología', align: 'left'},
          subtitle: { text: `Fuente: API. ${fechaInicio} → ${fechaFin}`,align: 'left' },
          xAxis: { categories, title: { text: 'Fuente' } },
          yAxis: { title: { text: 'Capacidad (GW)' } },
          series: [
            { name: 'Capacidad inst.', data: valores, color: '#FFC800' }
          ],
          exporting: {
            enabled: true,
            buttons: {
              contextButton: {
                menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
              }
            }
          }
        };

        setOptions(chartOptions);
        setToCache(cacheKey, chartOptions); // Almacenar en caché
        
      } catch (err) {
        console.error('Fetch error:', err);
        setError('No fue posible cargar la gráfica de capacidad por tecnología.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [fechaInicio, fechaFin]);

  if (loading) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center h-64">
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
        <p className="text-gray-300 mt-4">Cargando gráfica de capacidad instalada..._</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow relative">
      <button
        className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
        style={{ width: 30, height: 30 }}
        title="Ayuda"
        onClick={() => alert('Esta gráfica muestra la capacidad instalada por tecnología energética.')}
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
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
    </div>
  );
}

export default GraficaCapacidadInstaladaTecnologia;
