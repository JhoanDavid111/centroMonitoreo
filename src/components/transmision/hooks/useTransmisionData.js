// src/components/transmision/hooks/useTransmisionData.js
// src/components/transmision/hooks/useTransmisionData.js
import { useState, useEffect, useCallback } from 'react';
import { API } from '../../../config/api';

// Clave única para el cache
const CACHE_KEY = 'transmision_data_cache';
const CACHE_TIMEOUT = 15 * 60 * 1000; // 5 minutos en milisegundos

export function useTransmisionData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para validar y limpiar cache
  const getValidCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`);
      
      if (!cached || !timestamp) return null;
      
      const now = Date.now();
      const cacheAge = now - parseInt(timestamp, 10);
      
      if (cacheAge > CACHE_TIMEOUT) {
        // Limpiar cache expirado
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(`${CACHE_KEY}_timestamp`);
        return null;
      }
      
      return JSON.parse(cached);
    } catch (error) {
      console.warn('Error reading cache:', error);
      return null;
    }
  }, []);

  // Función para guardar en cache
  const saveToCache = useCallback((data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now().toString());
    } catch (error) {
      console.warn('Error saving to cache:', error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Verificar cache primero
      const cachedData = getValidCache();
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Timeout de 15 segundos

      const response = await fetch(`${API}/v1/indicadores/transmision/indicadores_proyectos_transmision`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const jsonData = await response.json();
      
      // Guardar en cache
      saveToCache(jsonData);
      setData(jsonData);
      
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('La solicitud tardó demasiado tiempo. Por favor, intente nuevamente.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [getValidCache, saveToCache]);

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (!isMounted) return;
      await fetchData();
    };

    executeFetch();

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  // Función para forzar recarga (útil para botón "reintentar")
  const refetch = useCallback(() => {
    // Limpiar cache forzadamente
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(`${CACHE_KEY}_timestamp`);
    setError(null);
    fetchData();
  }, [fetchData]);

  return { 
    data, 
    loading, 
    error,
    refetch // Exportar función para recargar manualmente
  };
}

// Hook adicional para datos individuales (opcional)
export function useTransmisionDataField(fieldName) {
  const { data, loading, error } = useTransmisionData();
  
  return {
    value: data?.[fieldName] || null,
    loading,
    error
  };
}