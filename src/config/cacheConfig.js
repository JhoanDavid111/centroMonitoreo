// src/config/cacheConfig.js

// Valor por defecto: 30 minutos (en milisegundos)
const DEFAULT_CACHE_EXPIRATION_MS = 30 * 60 * 1000;

/**
 * Obtiene la configuración de expiración de caché de las variables de entorno
 * con validación completa y valores por defecto seguros
 */
export const getCacheConfig = () => {
  // 1. Obtener el valor de la variable de entorno
  const envExpiration = import.meta.env.VITE_CACHE_EXPIRATION_MS;
  
  // 2. Si no existe la variable, retornar valor por defecto
  if (!envExpiration) {
    return { EXPIRATION_MS: DEFAULT_CACHE_EXPIRATION_MS };
  }
  
  // 3. Validar y parsear el valor
  const parsedValue = parseInt(envExpiration, 10);
  
  // 4. Verificar que sea un número válido y positivo
  if (isNaN(parsedValue) || parsedValue <= 0) {
    console.warn(
      `Valor inválido para REACT_APP_CACHE_EXPIRATION_MS: "${envExpiration}". 
      Usando valor por defecto (${DEFAULT_CACHE_EXPIRATION_MS}ms)`
    );
    return { EXPIRATION_MS: DEFAULT_CACHE_EXPIRATION_MS };
  }
  
  // 5. Retornar valor validado
  return { EXPIRATION_MS: parsedValue };
};

// Exportar la configuración
export const CACHE_CONFIG = getCacheConfig();