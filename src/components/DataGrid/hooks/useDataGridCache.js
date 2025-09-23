// src/components/DataGrid/hooks/useDataGridCache.js
import { useState, useEffect, useCallback } from 'react';

// Claves únicas para el cache de cada pestaña
const getCacheKey = (tabIndex) => `transmision_grid_tab_${tabIndex}_cache`;
const CACHE_TIMEOUT = 15 * 60 * 1000; // 15 minutos en milisegundos

export function useDataGridCache(tabConfig, activeTab) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para validar y limpiar cache
  const getValidCache = useCallback((tabIndex) => {
    try {
      const cacheKey = getCacheKey(tabIndex);
      const cached = localStorage.getItem(cacheKey);
      const timestamp = localStorage.getItem(`${cacheKey}_timestamp`);
      
      if (!cached || !timestamp) return null;
      
      const now = Date.now();
      const cacheAge = now - parseInt(timestamp, 10);
      
      if (cacheAge > CACHE_TIMEOUT) {
        // Limpiar cache expirado
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(`${cacheKey}_timestamp`);
        return null;
      }
      
      return JSON.parse(cached);
    } catch (error) {
      console.warn('Error reading cache for tab', tabIndex, error);
      return null;
    }
  }, []);

  // Función para guardar en cache
  const saveToCache = useCallback((tabIndex, data) => {
    try {
      const cacheKey = getCacheKey(tabIndex);
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
    } catch (error) {
      console.warn('Error saving to cache for tab', tabIndex, error);
    }
  }, []);

  // Función para limpiar cache específico
  const clearTabCache = useCallback((tabIndex) => {
    try {
      const cacheKey = getCacheKey(tabIndex);
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(`${cacheKey}_timestamp`);
    } catch (error) {
      console.warn('Error clearing cache for tab', tabIndex, error);
    }
  }, []);

  // Función para limpiar todo el cache de la grid
  const clearAllCache = useCallback(() => {
    try {
      // Limpiar cache de todas las pestañas posibles (0-9 como ejemplo)
      for (let i = 0; i < 10; i++) {
        const cacheKey = getCacheKey(i);
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(`${cacheKey}_timestamp`);
      }
    } catch (error) {
      console.warn('Error clearing all grid cache:', error);
    }
  }, []);

  const fetchData = useCallback(async (tabIndex) => {
    if (!tabConfig.tabs || !tabConfig.tabs[tabIndex]) {
      setError('Configuración de pestañas no válida');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Verificar cache primero
      const cachedData = getValidCache(tabIndex);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      const currentTab = tabConfig.tabs[tabIndex];
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // Timeout de 30 segundos

      const response = await fetch(currentTab.apiUrl, {
        ...currentTab.fetchOptions,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const jsonData = await response.json();
      
      // Guardar en cache
      saveToCache(tabIndex, jsonData);
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
  }, [tabConfig.tabs, getValidCache, saveToCache]);

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (!isMounted) return;
      await fetchData(activeTab);
    };

    executeFetch();

    return () => {
      isMounted = false;
    };
  }, [activeTab, fetchData]);

  // Función para forzar recarga de una pestaña específica
  const refetchTab = useCallback((tabIndex) => {
    clearTabCache(tabIndex);
    if (tabIndex === activeTab) {
      setError(null);
      fetchData(tabIndex);
    }
  }, [activeTab, clearTabCache, fetchData]);

  // Función para forzar recarga de todas las pestañas
  const refetchAll = useCallback(() => {
    clearAllCache();
    setError(null);
    fetchData(activeTab);
  }, [activeTab, clearAllCache, fetchData]);

  return { 
    data, 
    loading, 
    error,
    refetchTab,
    refetchAll
  };
}