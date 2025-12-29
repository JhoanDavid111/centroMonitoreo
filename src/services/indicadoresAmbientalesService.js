// src/services/indicadoresAmbientalesService.js
import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/axios';

/**
 * POST /v1/indicadores/oass/indicadores_oass
 * Usa el apiClient (mismo patrón que Indicadores6GW) para que
 * funcione con proxy / VITE_API_BASE y no dependa de la VPN.
 */
export const fetchIndicadoresOASS = async () => {
  const { data } = await apiClient.post('/v1/indicadores/oass/indicadores_oass', {});
  return data;
};

export const useIndicadoresOASS = (options = {}) => {
  return useQuery({
    queryKey: ['indicadores', 'oass'],
    queryFn: fetchIndicadoresOASS,
    staleTime: 15 * 60 * 1000,
    ...options,
  });
};

export const fetchTramitesSolicitadosOASS = async () => {
  const { data } = await apiClient.post('/v1/graficas/oass/tramites_solicitados', {});
  return data;
};

export const useTramitesSolicitadosOASS = (options = {}) => {
  return useQuery({
    queryKey: ['oass', 'tramites_solicitados'],
    queryFn: fetchTramitesSolicitadosOASS,
    staleTime: 15 * 60 * 1000, // cache 15 min
    ...options,
  });
};

export const fetchGestionProyectosPriorizados = async () => {
  const { data } = await apiClient.post('/v1/graficas/oass/gestion_proyectos_priorizados', {});
  return data;
};

export const useGestionProyectosPriorizados = (options = {}) => {
  return useQuery({
    queryKey: ['oass', 'gestion-proyectos-priorizados'],
    queryFn: fetchGestionProyectosPriorizados,
    staleTime: 15 * 60 * 1000,
    ...options,
  });
};

export const fetchEstadoTramites = async () => {
  const { data } = await apiClient.post('/v1/graficas/oass/estado_de_tramites', {});
  return data;
};

export const useEstadoTramites = (options = {}) => {
  return useQuery({
    queryKey: ['oass', 'estado-tramites'],
    queryFn: fetchEstadoTramites,
    staleTime: 15 * 60 * 1000,
    ...options,
  });
};

