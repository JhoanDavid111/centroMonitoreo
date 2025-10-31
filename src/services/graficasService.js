// src/services/graficasService.js
import { useQuery, useQueries } from '@tanstack/react-query';
import apiClient from '../lib/axios';
import { API } from '../config/api';
import axios from 'axios';

// Helper para manejar URLs personalizadas
const getApiClient = (customUrl) => {
  if (!customUrl || customUrl.startsWith(API)) {
    return apiClient;
  }
  return axios.create({
    baseURL: '',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
};

/**
 * Funciones de fetch para Gráficas 6GW
 */
export const fetchCapacidadPorTecnologia = async () => {
  const { data } = await apiClient.post('/v1/graficas/6g_proyecto/capacidad_por_tecnologia');
  return data;
};

export const fetchCapacidadPorCategoria = async () => {
  const { data } = await apiClient.post('/v1/graficas/6g_proyecto/capacidad_por_categoria');
  return data;
};

export const fetchCapacidadPorEntrar075 = async () => {
  const { data } = await apiClient.post('/v1/graficas/6g_proyecto/capacidad_por_entrar_075');
  return data;
};

export const fetchMatrizCompletaAnual = async () => {
  const { data } = await apiClient.post('/v1/graficas/6g_proyecto/grafica_matriz_completa_anual');
  return data;
};

export const fetchHitosPorCumplir = async () => {
  const { data } = await apiClient.post('/v1/graficas/6g_proyecto/hitos_por_cumplir', {});
  return data;
};

export const fetchProyectosIncumplimientos = async () => {
  const { data } = await apiClient.post('/v1/graficas/6g_proyecto/proyectos_incumplimientos', {});
  return data;
};

export const fetchAcumuladoCapacidadProyectos = async () => {
  const { data } = await apiClient.post('/v1/graficas/6g_proyecto/acumulado_capacidad_proyectos');
  return data;
};

export const fetchCapacidadPorcentajeAvanceCurvaS = async () => {
  const { data } = await apiClient.post('/v1/graficas/6g_proyecto/grafica_capacidad_porcentaje_avance_curva_s');
  return data;
};

export const fetchGeneracionDiaria = async () => {
  const { data } = await apiClient.post('/v1/graficas/6g_proyecto/grafica_generacion_diaria');
  return data;
};

export const fetchGeneracionHorariaPromedio = async (payload) => {
  const { data } = await apiClient.post('/v1/graficas/6g_proyecto/generacion_horaria_promedio', payload);
  return data;
};

/**
 * Funciones de fetch para Proyectos 075
 */
export const fetchInformacionProyecto = async (projectId) => {
  const { data } = await apiClient.post(
    `/v1/graficas/proyectos_075/informacion_proyecto/${encodeURIComponent(projectId)}`
  );
  return data;
};

export const fetchListadoProyectosCurvaS = async () => {
  const { data } = await apiClient.post('/v1/graficas/proyectos_075/listado_proyectos_curva_s');
  return data;
};

export const fetchListadoProyectosCurvaS6G = async () => {
  const { data } = await apiClient.post('/v1/graficas/6g_proyecto/listado_proyectos_curva_s');
  return data;
};

export const fetchCurvaS = async (projectId) => {
  const { data } = await apiClient.post(
    `/v1/graficas/proyectos_075/grafica_curva_s/${projectId}`
  );
  return data;
};

export const fetchProyectosPorCicloAsignacion = async () => {
  const { data } = await apiClient.post('/v1/graficas/proyectos_075/proyectos_por_ciclo_asignacion');
  return data;
};

/**
 * Funciones de fetch para Energía Eléctrica
 */
export const fetchEnergiaElectrica = async (params = {}) => {
  const { data } = await apiClient.post('/v1/graficas/energia_electrica', params);
  return data;
};

export const fetchGraficaPrecios = async (params = {}) => {
  const { data } = await apiClient.post('/v1/graficas/energia_electrica/grafica_precios', params);
  return data;
};

export const fetchGraficaVolumenUtilRegion = async (params = {}) => {
  const { data } = await apiClient.post('/v1/graficas/energia_electrica/grafica_volumen_util_region', params);
  return data;
};

export const fetchGraficaRelacionDemanda = async (params = {}) => {
  const { data } = await apiClient.post('/v1/graficas/energia_electrica/grafica_relacion_demanda', params);
  return data;
};

export const fetchGraficaCapacidadInstaladaTecnologia = async (params = {}) => {
  const { data } = await apiClient.post('/v1/graficas/energia_electrica/grafica_capacidad_instalada_tecnologia', params);
  return data;
};

export const fetchGraficaEstatuto = async (params = {}) => {
  const apiEstatuto = import.meta.env.VITE_API_ESTATUTO || `${API}/v1/graficas/energia_electrica/grafica_estatuto`;
  
  // Si es una URL absoluta, usar fetch directo como en el código original
  if (apiEstatuto.startsWith('http')) {
    const response = await fetch(apiEstatuto, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: Object.keys(params).length > 0 ? JSON.stringify(params) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    
    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    const data = contentType.includes('application/json') 
      ? await response.json() 
      : JSON.parse(await response.text());
    
    return data;
  }
  
  // Si es una URL relativa, usar apiClient
  const { data } = await apiClient.post('/v1/graficas/energia_electrica/grafica_estatuto', params);
  return data;
};

export const fetchGraficaDemanda = async (params = {}) => {
  const { data } = await apiClient.post('/v1/graficas/energia_electrica/grafica_demanda', params);
  return data;
};

/**
 * Funciones de fetch para Hidrología
 */
export const fetchGraficaAportes = async () => {
  const apiAportes = import.meta.env.VITE_API_HIDRO_APORTES || `${API}/v1/graficas/hidrologia/grafica_aportes`;
  const client = getApiClient(apiAportes);
  const url = apiAportes.startsWith('http') ? apiAportes : `${API}/v1/graficas/hidrologia/grafica_aportes`;
  const { data } = await client.post(url);
  return data;
};

/**
 * Funciones de fetch para Transmisión
 */
export const fetchProyectoDetalleTransmision = async (projectId) => {
  const { data } = await apiClient.post(
    `/v1/graficas/transmision/informacion_especifica_proyecto/${encodeURIComponent(projectId)}`
  );
  return data;
};

/**
 * Hooks individuales para Gráficas 6GW
 */
export const useCapacidadPorTecnologia = (options = {}) =>
  useQuery({
    queryKey: ['graficas', 'capacidad-tecnologia'],
    queryFn: fetchCapacidadPorTecnologia,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

export const useCapacidadPorCategoria = (options = {}) =>
  useQuery({
    queryKey: ['graficas', 'capacidad-categoria'],
    queryFn: fetchCapacidadPorCategoria,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

export const useCapacidadPorEntrar075 = (options = {}) =>
  useQuery({
    queryKey: ['graficas', 'capacidad-entrar-075'],
    queryFn: fetchCapacidadPorEntrar075,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

export const useMatrizCompletaAnual = (options = {}) =>
  useQuery({
    queryKey: ['graficas', 'matriz-completa-anual'],
    queryFn: fetchMatrizCompletaAnual,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

export const useHitosPorCumplir = (options = {}) =>
  useQuery({
    queryKey: ['graficas', 'hitos-por-cumplir'],
    queryFn: fetchHitosPorCumplir,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

export const useProyectosIncumplimientos = (options = {}) =>
  useQuery({
    queryKey: ['graficas', 'proyectos-incumplimientos'],
    queryFn: fetchProyectosIncumplimientos,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

export const useAcumuladoCapacidadProyectos = (options = {}) =>
  useQuery({
    queryKey: ['graficas', 'acumulado-capacidad-proyectos'],
    queryFn: fetchAcumuladoCapacidadProyectos,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

export const useCapacidadPorcentajeAvanceCurvaS = (options = {}) =>
  useQuery({
    queryKey: ['graficas', 'capacidad-porcentaje-avance-curva-s'],
    queryFn: fetchCapacidadPorcentajeAvanceCurvaS,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

export const useGeneracionDiaria = (options = {}) =>
  useQuery({
    queryKey: ['graficas', 'generacion-diaria'],
    queryFn: fetchGeneracionDiaria,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

export const useGeneracionHorariaPromedio = (payload, options = {}) =>
  useQuery({
    queryKey: ['graficas', 'generacion-horaria-promedio', payload],
    queryFn: () => fetchGeneracionHorariaPromedio(payload),
    staleTime: 15 * 60 * 1000,
    enabled: !!payload,
    ...options,
  });

/**
 * Hooks para Proyectos 075
 */
export const useInformacionProyecto = (projectId, options = {}) =>
  useQuery({
    queryKey: ['graficas', 'proyectos-075', 'informacion', projectId],
    queryFn: () => fetchInformacionProyecto(projectId),
    enabled: !!projectId,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

export const useListadoProyectosCurvaS = (options = {}) =>
  useQuery({
    queryKey: ['graficas', 'proyectos-075', 'listado-curva-s'],
    queryFn: fetchListadoProyectosCurvaS,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

export const useCurvaS = (projectId, options = {}) =>
  useQuery({
    queryKey: ['graficas', 'proyectos-075', 'curva-s', projectId],
    queryFn: () => fetchCurvaS(projectId),
    enabled: !!projectId,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

export const useListadoProyectosCurvaS6G = (options = {}) =>
  useQuery({
    queryKey: ['graficas', '6g-proyecto', 'listado-curva-s'],
    queryFn: fetchListadoProyectosCurvaS6G,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

export const useProyectosPorCicloAsignacion = (options = {}) =>
  useQuery({
    queryKey: ['graficas', 'proyectos-075', 'proyectos-por-ciclo'],
    queryFn: fetchProyectosPorCicloAsignacion,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

/**
 * Hooks para Energía Eléctrica
 */
export const useEnergiaElectrica = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['graficas', 'energia-electrica', params],
    queryFn: () => fetchEnergiaElectrica(params),
    staleTime: 15 * 60 * 1000,
    ...options,
  });

export const useGraficaPrecios = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['graficas', 'energia-electrica', 'precios', params],
    queryFn: () => fetchGraficaPrecios(params),
    staleTime: 15 * 60 * 1000,
    enabled: !!(params.fecha_inicio && params.fecha_fin),
    ...options,
  });

export const useGraficaVolumenUtilRegion = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['graficas', 'energia-electrica', 'volumen-util-region', params],
    queryFn: () => fetchGraficaVolumenUtilRegion(params),
    staleTime: 15 * 60 * 1000,
    enabled: !!(params.fecha_inicio && params.fecha_fin),
    ...options,
  });

export const useGraficaRelacionDemanda = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['graficas', 'energia-electrica', 'relacion-demanda', params],
    queryFn: () => fetchGraficaRelacionDemanda(params),
    staleTime: 15 * 60 * 1000,
    enabled: !!(params.fecha_inicio && params.fecha_fin),
    ...options,
  });

export const useGraficaCapacidadInstaladaTecnologia = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['graficas', 'energia-electrica', 'capacidad-instalada-tecnologia', params],
    queryFn: () => fetchGraficaCapacidadInstaladaTecnologia(params),
    staleTime: 15 * 60 * 1000,
    enabled: !!(params.fecha_inicio && params.fecha_fin),
    ...options,
  });

export const useGraficaEstatuto = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['graficas', 'energia-electrica', 'estatuto', params],
    queryFn: () => fetchGraficaEstatuto(params),
    staleTime: 15 * 60 * 1000,
    // Habilitado siempre, ya que el endpoint no requiere parámetros obligatorios
    ...options,
  });

export const useGraficaDemanda = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['graficas', 'energia-electrica', 'demanda', params],
    queryFn: () => fetchGraficaDemanda(params),
    staleTime: 15 * 60 * 1000,
    enabled: !!(params.fecha_inicio && params.fecha_fin),
    ...options,
  });

/**
 * Hook para Hidrología
 */
export const useGraficaAportes = (options = {}) =>
  useQuery({
    queryKey: ['graficas', 'hidrologia', 'aportes'],
    queryFn: fetchGraficaAportes,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

/**
 * Hook para Transmisión
 */
export const useProyectoDetalleTransmision = (projectId, options = {}) =>
  useQuery({
    queryKey: ['graficas', 'transmision', 'proyecto', projectId],
    queryFn: () => fetchProyectoDetalleTransmision(projectId),
    enabled: !!projectId,
    staleTime: 15 * 60 * 1000,
    ...options,
  });

/**
 * Hook para múltiples queries paralelas (ResumenCharts)
 */
export const useResumenCharts = (options = {}) => {
  return useQueries({
    queries: [
      {
        queryKey: ['graficas', 'capacidad-tecnologia'],
        queryFn: fetchCapacidadPorTecnologia,
        staleTime: 15 * 60 * 1000, // 15 minutos
        gcTime: 15 * 60 * 1000,
        retry: 2,
      },
      {
        queryKey: ['graficas', 'capacidad-categoria'],
        queryFn: fetchCapacidadPorCategoria,
        staleTime: 15 * 60 * 1000, // 15 minutos
        gcTime: 15 * 60 * 1000,
        retry: 2,
      },
      {
        queryKey: ['graficas', 'capacidad-entrar-075'],
        queryFn: fetchCapacidadPorEntrar075,
        staleTime: 15 * 60 * 1000, // 15 minutos
        gcTime: 15 * 60 * 1000,
        retry: 2,
      },
      {
        queryKey: ['graficas', 'matriz-completa-anual'],
        queryFn: fetchMatrizCompletaAnual,
        staleTime: 15 * 60 * 1000, // 15 minutos
        gcTime: 15 * 60 * 1000,
        retry: 2,
      },
    ],
    ...options,
  });
};

