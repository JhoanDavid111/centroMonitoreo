// src/components/DataGrid/hooks/useDataGridCache.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/axios';

export function useDataGridCache(tabConfig, activeTab) {
  const queryClient = useQueryClient();

  const currentTab = tabConfig?.tabs?.[activeTab];
  const apiUrl = currentTab?.apiUrl;
  const fetchOptions = currentTab?.fetchOptions || {};

  // Función para hacer el fetch
  const fetchTabData = async () => {
    if (!apiUrl) {
      throw new Error('Configuración de pestañas no válida');
    }

    // Si la URL es absoluta, usar fetch directo, sino usar apiClient
    if (apiUrl.startsWith('http')) {
      const response = await fetch(apiUrl, {
        ...fetchOptions,
        signal: AbortSignal.timeout(30000) // 30 segundos
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } else {
      // Usar apiClient directamente con el path relativo
      // apiClient ya tiene baseURL configurado en src/lib/axios.js
      // Debug: Verificar la URL que se está pasando
      if (apiUrl.includes('transmision')) {
        console.log('useDataGridCache - apiUrl recibida:', apiUrl);
        console.log('useDataGridCache - apiClient baseURL:', apiClient.defaults.baseURL);
      }
      const { data } = await apiClient.post(apiUrl, fetchOptions.body || {});
      return data;
    }
  };

  const query = useQuery({
    queryKey: ['dataGrid', activeTab, apiUrl],
    queryFn: fetchTabData,
    enabled: !!apiUrl && !!currentTab,
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 15 * 60 * 1000,
    retry: 2,
  });

  // Función para forzar recarga de una pestaña específica
  const refetchTab = (tabIndex) => {
    if (tabIndex === activeTab) {
      query.refetch();
    } else {
      // Invalidar cache de otra pestaña
      const otherTab = tabConfig?.tabs?.[tabIndex];
      const otherApiUrl = otherTab?.apiUrl;
      if (otherApiUrl) {
        queryClient.invalidateQueries({ queryKey: ['dataGrid', tabIndex, otherApiUrl] });
      }
    }
  };

  // Función para forzar recarga de todas las pestañas
  const refetchAll = () => {
    queryClient.invalidateQueries({ queryKey: ['dataGrid'] });
  };

  return {
    data: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetchTab,
    refetchAll
  };
}
