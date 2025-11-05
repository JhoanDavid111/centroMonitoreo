// src/lib/react-query.js
import { QueryClient } from '@tanstack/react-query';

/**
 * Utilidad para caché persistente en localStorage
 */
const createPersistStorage = () => {
  const PERSIST_KEY = 'react-query-cache';
  const PERSIST_VERSION = 1;
  
  return {
    getItem: (key) => {
      try {
        const item = localStorage.getItem(key);
        if (!item) return null;
        
        const parsed = JSON.parse(item);
        
        // Verificar si es del día de hoy
        const today = new Date().toDateString();
        const savedDate = parsed.date;
        
        if (savedDate !== today) {
          // No es del mismo día, limpiar caché antiguo
          localStorage.removeItem(key);
          return null;
        }
        
        return parsed.data || null;
      } catch (error) {
        console.error('[CACHE] Error leyendo caché:', error);
        return null;
      }
    },
    
    setItem: (key, value) => {
      try {
        const today = new Date().toDateString();
        const item = {
          version: PERSIST_VERSION,
          date: today,
          data: value,
        };
        localStorage.setItem(key, JSON.stringify(item));
      } catch (error) {
        console.error('[CACHE] Error guardando caché:', error);
        // Si localStorage está lleno, intentar limpiar
        if (error.name === 'QuotaExceededError') {
          console.warn('[CACHE] localStorage lleno, limpiando caché antiguo');
          try {
            localStorage.removeItem(key);
            localStorage.setItem(key, JSON.stringify({
              version: PERSIST_VERSION,
              date: new Date().toDateString(),
              data: value,
            }));
          } catch (e) {
            console.error('[CACHE] No se pudo limpiar caché:', e);
          }
        }
      }
    },
    
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('[CACHE] Error eliminando caché:', error);
      }
    },
  };
};

/**
 * Cliente de React Query con configuración global y caché persistente
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo de caché por defecto: 24 horas (mismo día)
      staleTime: 24 * 60 * 60 * 1000, // 24 horas
      // Tiempo de caché persistente: 24 horas (datos se mantienen en localStorage)
      gcTime: 24 * 60 * 60 * 1000, // 24 horas
      // Revalidar en ventana focus
      refetchOnWindowFocus: false,
      // No revalidar al montar - usar caché inmediatamente
      refetchOnMount: false,
      // Revalidar al reconectar (pero usar caché mientras tanto)
      refetchOnReconnect: 'always',
      // Reintentos automáticos
      retry: 1, // Reducir reintentos para respuestas más rápidas
      // Tiempo entre reintentos
      retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 5000),
      // Manejo de errores global
      throwOnError: false,
      // Network mode: 'online' para mejor rendimiento
      networkMode: 'online',
      // Usar caché estructurado
      structuralSharing: true,
      // Usar datos en caché inmediatamente mientras se verifica actualización en background
      placeholderData: (previousData) => previousData,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Cargar caché persistente al inicializar
if (typeof window !== 'undefined') {
  const persistStorage = createPersistStorage();
  const CACHE_KEY = 'react-query-cache';
  
  // Cargar caché al iniciar
  const loadPersistedCache = () => {
    try {
      const persistedCache = persistStorage.getItem(CACHE_KEY);
      if (persistedCache && Array.isArray(persistedCache)) {
        persistedCache.forEach(({ queryKey, data, dataUpdatedAt }) => {
          if (data !== undefined && queryKey && Array.isArray(queryKey)) {
            // Restaurar cada query en el caché
            queryClient.setQueryData(queryKey, data, {
              updatedAt: dataUpdatedAt || Date.now(),
            });
          }
        });
        
        // Caché persistente cargado silenciosamente
      }
    } catch (error) {
      console.error('[CACHE] Error cargando caché persistente:', error);
    }
  };
  
  // Guardar caché cuando cambie
  const savePersistedCache = () => {
    try {
      const cache = queryClient.getQueryCache().getAll();
      const cacheData = cache.map(query => ({
        queryKey: query.queryKey,
        data: query.state.data,
        dataUpdatedAt: query.state.dataUpdatedAt,
        error: query.state.error,
      }));
      
      persistStorage.setItem(CACHE_KEY, cacheData);
      
      // Caché guardado silenciosamente
    } catch (error) {
      console.error('[CACHE] Error guardando caché:', error);
    }
  };
  
  // Cargar caché al iniciar (con delay para asegurar que queryClient esté listo)
  setTimeout(() => {
    loadPersistedCache();
  }, 100);
  
  // Guardar caché cuando cambie (con debounce)
  let cacheSaveTimeout;
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'updated' && event.query.state.data && event.query.state.status === 'success') {
      // Debounce para no guardar demasiado frecuentemente
      clearTimeout(cacheSaveTimeout);
      cacheSaveTimeout = setTimeout(() => {
        savePersistedCache();
      }, 2000); // Guardar 2 segundos después del último cambio
    }
  });
  
  // Guardar antes de cerrar/refrescar
  window.addEventListener('beforeunload', () => {
    savePersistedCache();
  });
  
  // Guardar periódicamente cada 30 segundos como backup
  setInterval(() => {
    savePersistedCache();
  }, 30000);
}


