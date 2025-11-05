// src/services/mapsService.js
import { useQuery } from '@tanstack/react-query';
import REGIONES_URL from '../assets/geojson/RegionesHidro.geojson?url';
import creg075url from '../assets/CREG075_2.geojson?url';
import creg174url from '../assets/CREG174_reproyectado_2.geojson?url';
import mpio from '../assets/mpio.json';

/**
 * Función de fetch para GeoJSON de regiones hidrológicas
 */
export const fetchRegionesGeoJSON = async () => {
  const response = await fetch(REGIONES_URL);
  if (!response.ok) {
    throw new Error('Error al cargar regiones GeoJSON');
  }
  return response.json();
};

/**
 * Función de fetch para GeoJSON de proyectos CREG075
 */
export const fetchCreg075GeoJSON = async () => {
  const response = await fetch(creg075url);
  if (!response.ok) {
    throw new Error('Error al cargar CREG075 GeoJSON');
  }
  return response.json();
};

/**
 * Función de fetch para GeoJSON de proyectos CREG174
 */
export const fetchCreg174GeoJSON = async () => {
  const response = await fetch(creg174url);
  if (!response.ok) {
    throw new Error('Error al cargar CREG174 GeoJSON');
  }
  return response.json();
};

/**
 * Función de fetch para GeoJSON de municipios
 */
export const fetchMunicipiosGeoJSON = async () => {
  // mpio es importado directamente como JSON, no necesita fetch
  // Pero para mantener consistencia, lo retornamos como Promise
  return Promise.resolve(mpio);
};

/**
 * Hook de React Query para obtener regiones GeoJSON
 */
export const useRegionesGeoJSON = (options = {}) => {
  return useQuery({
    queryKey: ['regiones-geojson'],
    queryFn: fetchRegionesGeoJSON,
    staleTime: Infinity, // GeoJSON no cambia frecuentemente
    gcTime: Infinity,
    ...options,
  });
};

/**
 * Hook de React Query para obtener CREG075 GeoJSON
 */
export const useCreg075GeoJSON = (options = {}) => {
  return useQuery({
    queryKey: ['creg075-geojson'],
    queryFn: fetchCreg075GeoJSON,
    staleTime: Infinity,
    gcTime: Infinity,
    ...options,
  });
};

/**
 * Hook de React Query para obtener CREG174 GeoJSON
 */
export const useCreg174GeoJSON = (options = {}) => {
  return useQuery({
    queryKey: ['creg174-geojson'],
    queryFn: fetchCreg174GeoJSON,
    staleTime: Infinity,
    gcTime: Infinity,
    ...options,
  });
};

/**
 * Hook de React Query para obtener municipios GeoJSON
 */
export const useMunicipiosGeoJSON = (options = {}) => {
  return useQuery({
    queryKey: ['municipios-geojson'],
    queryFn: fetchMunicipiosGeoJSON,
    staleTime: Infinity,
    gcTime: Infinity,
    ...options,
  });
};

