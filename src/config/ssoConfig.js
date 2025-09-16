// src/config/ssoConfig.js
// Configuración para diferentes métodos de SSO

export const SSO_METHODS = {
  POST: 'post',                    // Formulario POST (MÁS SEGURO)
  TOKEN_EXCHANGE: 'token-exchange', // Intercambio de tokens
  LOCAL_STORAGE: 'localStorage',    // localStorage intermediario  
  URL: 'url'                       // URL tradicional (menos seguro)
};

export const SSO_CONFIG = {
  // Método por defecto (recomendado: POST)
  defaultMethod: SSO_METHODS.POST,
  
  // Configuración por sistema/URL
  systemConfigs: {
    'acciones_6gw': {
      url: 'https://www.upme.gov.co/acciones_6gw/login',
      method: SSO_METHODS.POST, // Usar POST para mayor seguridad
      supportsPOST: true,
      supportsTokenExchange: false // Requiere endpoint del servidor
    },
    
    // Ejemplo para otros sistemas
    'sistema_ejemplo': {
      url: 'https://ejemplo.upme.gov.co/sso/login',
      method: SSO_METHODS.TOKEN_EXCHANGE,
      supportsPOST: true,
      supportsTokenExchange: true
    }
  },
  
  // Configuración de localStorage
  localStorage: {
    keyPrefix: 'sso_',
    expirationMinutes: 5, // Tokens expiran en 5 minutos
    cleanupInterval: 60000 // Limpiar cada minuto
  },
  
  // Configuración de token exchange
  tokenExchange: {
    endpoint: '/api/sso/create-token',
    temporaryTokenExpiration: 300, // 5 minutos en segundos
    maxTokensPerUser: 3 // Máximo 3 tokens temporales por usuario
  }
};

/**
 * Obtiene la configuración de SSO para un sistema específico
 * @param {string} systemName - Nombre del sistema
 * @returns {Object} Configuración del sistema
 */
export const getSystemConfig = (systemName) => {
  return SSO_CONFIG.systemConfigs[systemName] || {
    method: SSO_CONFIG.defaultMethod,
    supportsPOST: false,
    supportsTokenExchange: false
  };
};

