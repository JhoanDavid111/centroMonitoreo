// src/hooks/useProyectosCiclos.js
import { useProyectosPorCicloAsignacion } from '../services/graficasService';

// Wrapper para mantener compatibilidad con el código existente
export function useProyectosCiclos() {
  const query = useProyectosPorCicloAsignacion();
  
  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}

// Hook adicional para datos de un ciclo específico
export function useProyectosCiclo(ciclo) {
  const query = useProyectosPorCicloAsignacion();
  
  return {
    data: query.data?.[`ciclo_${ciclo}`] || null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}
