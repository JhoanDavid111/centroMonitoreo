// src/lib/axios.js
import axios from 'axios';
import { API } from '../config/api';

/**
 * Instancia de Axios configurada para la API
 */
export const apiClient = axios.create({
  baseURL: API,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Interceptor de request: añadir tokens, logging, etc.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Agregar timestamp para medir tiempo de respuesta
    config.metadata = { startTime: Date.now() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de response: manejo de errores global y medición de tiempos
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo centralizado de errores
    if (error.response) {
      // Error de respuesta del servidor
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // No autorizado - redirigir a login
          console.error('No autorizado');
          break;
        case 403:
          console.error('Acceso prohibido');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error del servidor');
          break;
        default:
          console.error(`Error ${status}: ${data?.message || error.message}`);
      }
    } else if (error.request) {
      // Error de red
      console.error('Error de conexión. Verifica tu conexión a internet.');
    } else {
      // Error al configurar la petición
      console.error('Error al configurar la petición:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

