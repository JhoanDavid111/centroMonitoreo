// src/config/mattermostUrls.js
// URLs específicas para Mattermost desplegado en acciones_6gw

export const MATTERMOST_URLS = {
  // URL base confirmada por el usuario
  base: 'https://www.upme.gov.co/acciones_6gw',
  
  // URLs específicas de Mattermost
  login: 'https://www.upme.gov.co/acciones_6gw/login',
  oauth_google: 'https://www.upme.gov.co/acciones_6gw/oauth/google/login',
  api_base: 'https://www.upme.gov.co/acciones_6gw/api/v4',
  
  // URLs de redirección OAuth que deben estar configuradas en Google Console
  oauth_redirects: [
    'https://www.upme.gov.co/acciones_6gw/signup/google/complete',
    'https://www.upme.gov.co/acciones_6gw/login/google/complete'
  ]
};

/**
 * Obtiene URLs de Mattermost normalizadas
 * @param {string} inputUrl - URL que puede incluir /login al final
 * @returns {Object} URLs normalizadas
 */
export const getMattermostUrls = (inputUrl = MATTERMOST_URLS.login) => {
  // Remover /login si existe para obtener la URL base
  const baseUrl = inputUrl.replace(/\/login\/?$/, '');
  
  return {
    base: baseUrl,
    login: `${baseUrl}/login`,
    oauth_google: `${baseUrl}/oauth/google/login`,
    api_base: `${baseUrl}/api/v4`,
    jwt_login: `${baseUrl}/login/jwt`
  };
};

