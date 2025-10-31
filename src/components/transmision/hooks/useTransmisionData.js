// src/components/transmision/hooks/useTransmisionData.js
import { useTransmisionData as useTransmisionDataService } from '../../../services/indicadoresService';

// Wrapper para mantener compatibilidad con el código existente
export function useTransmisionData() {
  const query = useTransmisionDataService();
  
  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}

// Hook adicional para datos individuales (opcional)
export function useTransmisionDataField(fieldName) {
  const query = useTransmisionDataService();
  
  return {
    value: query.data?.[fieldName] || null,
    loading: query.isLoading,
    error: query.error
  };
}