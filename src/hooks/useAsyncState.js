// src/hooks/useAsyncState.js
import { useMemo } from 'react';

/**
 * Hook para unificar la lógica de estados de carga y error de múltiples queries
 * 
 * @param {Array} queries - Array de objetos de React Query ({ isLoading, error, data })
 * @returns {Object} - { isLoading, error, hasData, allData }
 */
export function useAsyncState(queries = []) {
  const isLoading = useMemo(() => {
    return queries.some(q => q.isLoading);
  }, [queries]);

  const error = useMemo(() => {
    return queries.find(q => q.error)?.error || null;
  }, [queries]);

  const hasData = useMemo(() => {
    return queries.every(q => q.data !== undefined && q.data !== null);
  }, [queries]);

  const allData = useMemo(() => {
    return queries.map(q => q.data);
  }, [queries]);

  return {
    isLoading,
    error,
    hasData,
    allData,
  };
}

