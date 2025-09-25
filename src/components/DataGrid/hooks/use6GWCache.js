// src/components/hooks/use6GWCache.js
import { useState, useEffect, useCallback } from 'react';
import { API } from '../../../config/api';

// Claves para el cache
const CACHE_KEY_6GW = '6gw_indicadores_cache';
const CACHE_TIMEOUT = 15 * 60 * 1000; // 15 minutos en milisegundos

export function use6GWCache() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para validar y limpiar cache
  const getValidCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY_6GW);
      const timestamp = localStorage.getItem(`${CACHE_KEY_6GW}_timestamp`);
      
      if (!cached || !timestamp) return null;
      
      const now = Date.now();
      const cacheAge = now - parseInt(timestamp, 10);
      
      if (cacheAge > CACHE_TIMEOUT) {
        // Limpiar cache expirado
        localStorage.removeItem(CACHE_KEY_6GW);
        localStorage.removeItem(`${CACHE_KEY_6GW}_timestamp`);
        return null;
      }
      
      return JSON.parse(cached);
    } catch (error) {
      console.warn('Error reading 6GW cache:', error);
      return null;
    }
  }, []);

  // Función para guardar en cache
  const saveToCache = useCallback((data) => {
    try {
      localStorage.setItem(CACHE_KEY_6GW, JSON.stringify(data));
      localStorage.setItem(`${CACHE_KEY_6GW}_timestamp`, Date.now().toString());
    } catch (error) {
      console.warn('Error saving to 6GW cache:', error);
    }
  }, []);

  // Función para limpiar cache
  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY_6GW);
      localStorage.removeItem(`${CACHE_KEY_6GW}_timestamp`);
    } catch (error) {
      console.warn('Error clearing 6GW cache:', error);
    }
  }, []);

  const fetchIndicadores6GW = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar cache primero
      const cachedData = getValidCache();
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // Timeout de 30 segundos

      const response = await fetch(`${API}/v1/indicadores/6g_proyecto`, {
        method: 'POST',
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
        setError(err.message || 'Error al consultar indicadores 6GW+');
      }
    } finally {
      setLoading(false);
    }
  }, [getValidCache, saveToCache]);

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (!isMounted) return;
      await fetchIndicadores6GW();
    };

    executeFetch();

    return () => {
      isMounted = false;
    };
  }, [fetchIndicadores6GW]);

  // Función para forzar recarga
  const refetch = useCallback(() => {
    clearCache();
    setError(null);
    fetchIndicadores6GW();
  }, [clearCache, fetchIndicadores6GW]);

  return { 
    data, 
    loading, 
    error,
    refetch
  };
}