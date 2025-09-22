// src/config/mattermostConfig.js
// Configuración específica para Mattermost v10.10.2

export const MATTERMOST_CONFIG = {
  // URL base de Mattermost - URL real confirmada
  baseUrl: 'https://www.upme.gov.co/acciones_6gw', // URL real del Mattermost desplegado
  
  // Configuración OAuth
  oauth: {
    // Google OAuth debe estar configurado en Mattermost Admin Console
    // System Console > Authentication > OAuth 2.0 > Google Apps
    enabled: true,
    provider: 'google',
    clientId: 'same-as-firebase', // Usar el mismo Client ID de Firebase
    // Mattermost manejará la validación OAuth internamente
  },

  // Configuración JWT (si Mattermost tiene plugin JWT habilitado)
  jwt: {
    enabled: false, // Habilitar si Mattermost tiene configurado JWT
    secret: '', // Secret compartido (configurar en variables de entorno)
    algorithm: 'HS256',
    expiration: 300 // 5 minutos
  },

  // Configuración API
  api: {
    enabled: true,
    // Token de bot o admin para crear sesiones (configurar en variables de entorno)
    token: '', 
    version: 'v4' // API v4 de Mattermost
  },

  // Configuración de equipos por defecto
  defaultTeam: {
    name: 'upme', // Nombre del equipo por defecto
    displayName: 'UPME Team'
  },

  // Mapeo de roles Centro de Monitoreo -> Mattermost
  roleMapping: {
    'Administrador': 'system_admin',
    'Consultor1': 'team_admin', 
    'Consultor2': 'team_user',
    'default': 'team_user'
  },

  // Configuración de canales automáticos
  autoJoinChannels: [
    'town-square', // Canal general
    'centro-monitoreo' // Canal específico del sistema
  ]
};

/**
 * Obtiene la configuración de Mattermost desde variables de entorno
 */
export const getMattermostConfig = () => {
  return {
    ...MATTERMOST_CONFIG,
    baseUrl: import.meta.env.VITE_MATTERMOST_URL || MATTERMOST_CONFIG.baseUrl,
    jwt: {
      ...MATTERMOST_CONFIG.jwt,
      secret: import.meta.env.VITE_MATTERMOST_JWT_SECRET || MATTERMOST_CONFIG.jwt.secret,
      enabled: import.meta.env.VITE_MATTERMOST_JWT_ENABLED === 'true'
    },
    api: {
      ...MATTERMOST_CONFIG.api,
      token: import.meta.env.VITE_MATTERMOST_API_TOKEN || MATTERMOST_CONFIG.api.token
    }
  };
};
