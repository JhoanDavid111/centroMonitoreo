// src/utils/ssoUtils.js
import { auth } from '../firebase/config';
import { getMattermostUrls } from '../config/mattermostUrls';

/**
 * Obtiene el token de acceso de Firebase del usuario actual
 * @returns {Promise<string|null>} Token de acceso o null si no hay usuario
 */
export const getFirebaseAccessToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('No hay usuario autenticado');
      return null;
    }

    // Obtiene el token de acceso de Firebase
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error obteniendo el token de acceso:', error);
    return null;
  }
};

/**
 * Construye una URL con el token de acceso para SSO
 * @param {string} baseUrl - URL base del sistema externo
 * @param {string} token - Token de acceso
 * @param {Object} additionalParams - Parámetros adicionales opcionales
 * @returns {string} URL completa con token y parámetros
 */
export const buildSSOUrl = (baseUrl, token, additionalParams = {}) => {
  try {
    const url = new URL(baseUrl);
    
    // Agregar el token como parámetro
    url.searchParams.set('access_token', token);
    url.searchParams.set('sso', 'true');
    url.searchParams.set('source', 'centro_monitoreo');
    
    // Agregar parámetros adicionales si se proporcionan
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, value);
      }
    });
    
    return url.toString();
  } catch (error) {
    console.error('Error construyendo la URL de SSO:', error);
    return baseUrl; // Devolver URL original si hay error
  }
};

/**
 * MÉTODO ESPECÍFICO PARA MATTERMOST: OAuth 2.0 Redirection
 * Redirige al usuario a Mattermost usando el mismo proveedor OAuth
 */
export const openMattermostOAuth = async (mattermostUrl, options = {}) => {
  const {
    additionalParams = {},
    windowName = '_blank',
    windowFeatures = 'noopener,noreferrer'
  } = options;

  try {
    const user = auth.currentUser;
    
    if (!user) {
      console.error('No se pudo obtener usuario para OAuth Mattermost');
      window.open(mattermostUrl, windowName, windowFeatures);
      return;
    }

    // Obtener URLs normalizadas de Mattermost
    const urls = getMattermostUrls(mattermostUrl);
    const mattermostOAuthUrl = urls.oauth_google;
    
    // Parámetros adicionales para Mattermost
    const urlParams = new URLSearchParams({
      source: 'centro_monitoreo',
      user_hint: user.email,
      timestamp: Date.now(),
      ...additionalParams
    });

    const finalUrl = `${mattermostOAuthUrl}?${urlParams.toString()}`;
    
    console.log('SSO OAuth Mattermost: Redirigiendo usuario');
    window.open(finalUrl, windowName, windowFeatures);
    
  } catch (error) {
    console.error('Error en OAuth Mattermost:', error);
    window.open(mattermostUrl, windowName, windowFeatures);
  }
};

/**
 * MÉTODO MATTERMOST: JWT Token personalizado
 * Genera JWT token para autenticación directa en Mattermost
 */
export const openMattermostJWT = async (mattermostUrl, options = {}) => {
  const {
    jwtSecret,
    additionalParams = {},
    windowName = '_blank',
    windowFeatures = 'noopener,noreferrer'
  } = options;

  try {
    const token = await getFirebaseAccessToken();
    const user = auth.currentUser;
    
    if (!token || !user) {
      console.error('No se pudo obtener token/usuario para JWT Mattermost');
      window.open(mattermostUrl, windowName, windowFeatures);
      return;
    }

    // Crear JWT payload para Mattermost
    const jwtPayload = {
      sub: user.uid,
      email: user.email,
      name: user.displayName || user.email,
      iss: 'centro_monitoreo',
      aud: 'mattermost',
      exp: Math.floor(Date.now() / 1000) + (5 * 60), // 5 minutos
      iat: Math.floor(Date.now() / 1000),
      firebase_token: token,
      source: 'centro_monitoreo',
      ...additionalParams
    };

    // Enviar al endpoint para generar JWT
    const response = await fetch('/api/mattermost/generate-jwt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(jwtPayload)
    });

    if (!response.ok) {
      throw new Error('Error generando JWT para Mattermost');
    }

    const { jwt } = await response.json();

    // Redirigir a Mattermost con JWT
    const urls = getMattermostUrls(mattermostUrl);
    const mattermostJWTUrl = `${urls.jwt_login}?token=${encodeURIComponent(jwt)}&source=centro_monitoreo`;
    
    console.log('SSO JWT Mattermost: Token generado exitosamente');
    window.open(mattermostJWTUrl, windowName, windowFeatures);

  } catch (error) {
    console.error('Error en JWT Mattermost:', error);
    window.open(mattermostUrl, windowName, windowFeatures);
  }
};

/**
 * MÉTODO MATTERMOST: API Login directo
 * Usa la API de Mattermost para crear sesión directamente
 */
export const openMattermostAPI = async (mattermostUrl, options = {}) => {
  const {
    apiToken,
    additionalParams = {},
    windowName = '_blank',
    windowFeatures = 'noopener,noreferrer'
  } = options;

  try {
    const firebaseToken = await getFirebaseAccessToken();
    const user = auth.currentUser;
    
    if (!firebaseToken || !user) {
      console.error('No se pudo obtener token/usuario para API Mattermost');
      window.open(mattermostUrl, windowName, windowFeatures);
      return;
    }

    // Llamar a endpoint propio que maneja la autenticación con Mattermost
    const response = await fetch('/api/mattermost/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${firebaseToken}`
      },
      body: JSON.stringify({
        mattermost_url: getMattermostUrls(mattermostUrl).base,
        user_email: user.email,
        user_name: user.displayName || user.email,
        user_uid: user.uid,
        source: 'centro_monitoreo',
        ...additionalParams
      })
    });

    if (!response.ok) {
      throw new Error('Error en login API Mattermost');
    }

    const { login_url, session_token } = await response.json();

    // Abrir Mattermost con sesión ya creada
    console.log('SSO API Mattermost: Sesión creada exitosamente');
    window.open(login_url, windowName, windowFeatures);

  } catch (error) {
    console.error('Error en API Mattermost:', error);
    window.open(mattermostUrl, windowName, windowFeatures);
  }
};

/**
 * MÉTODO 1: POST con formulario oculto (MÁS SEGURO)
 * Abre una ventana nueva con SSO usando POST en lugar de GET
 */
export const openSSOWindowSecure = async (baseUrl, options = {}) => {
  const {
    additionalParams = {},
    windowName = '_blank',
    windowFeatures = 'noopener,noreferrer'
  } = options;

  try {
    const token = await getFirebaseAccessToken();
    
    if (!token) {
      console.error('No se pudo obtener el token de acceso');
      window.open(baseUrl, windowName, windowFeatures);
      return;
    }

    const user = auth.currentUser;
    const formData = {
      access_token: token,
      sso: 'true',
      source: 'centro_monitoreo',
      user_email: user?.email,
      user_uid: user?.uid,
      timestamp: Date.now(),
      ...additionalParams
    };

    // Crear formulario temporal
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = baseUrl;
    form.target = windowName;
    form.style.display = 'none';

    // Agregar campos ocultos
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
    });

    // Abrir ventana vacía primero
    const popup = window.open('', windowName, windowFeatures);
    
    // Agregar form al DOM y enviarlo
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    console.log('SSO: POST form enviado exitosamente');
    
    return popup;
  } catch (error) {
    console.error('Error enviando POST SSO:', error);
    window.open(baseUrl, windowName, windowFeatures);
  }
};

/**
 * MÉTODO 2: Intercambio de tokens con endpoint temporal
 * Crea un token temporal en el servidor y envía solo el ID
 */
export const openSSOWithTokenExchange = async (baseUrl, options = {}) => {
  const {
    additionalParams = {},
    windowName = '_blank',
    windowFeatures = 'noopener,noreferrer'
  } = options;

  try {
    const token = await getFirebaseAccessToken();
    
    if (!token) {
      console.error('No se pudo obtener el token de acceso');
      window.open(baseUrl, windowName, windowFeatures);
      return;
    }

    const user = auth.currentUser;
    const ssoData = {
      access_token: token,
      user_email: user?.email,
      user_uid: user?.uid,
      role: additionalParams.role,
      timestamp: Date.now()
    };

    // Enviar al endpoint de intercambio (necesitas implementar este endpoint)
    const exchangeResponse = await fetch('/api/sso/create-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(ssoData)
    });

    if (!exchangeResponse.ok) {
      throw new Error('Error creando token temporal');
    }

    const { temporaryToken } = await exchangeResponse.json();

    // Solo enviar el token temporal en la URL (mucho más corto y seguro)
    const ssoUrl = `${baseUrl}?sso_token=${temporaryToken}&source=centro_monitoreo`;
    window.open(ssoUrl, windowName, windowFeatures);

    console.log('SSO: Token intercambiado exitosamente');
  } catch (error) {
    console.error('Error en intercambio de tokens:', error);
    window.open(baseUrl, windowName, windowFeatures);
  }
};

/**
 * MÉTODO 3: localStorage como intermediario
 * Guarda los datos en localStorage y solo envía una clave
 */
export const openSSOWithLocalStorage = async (baseUrl, options = {}) => {
  const {
    additionalParams = {},
    windowName = '_blank',
    windowFeatures = 'noopener,noreferrer'
  } = options;

  try {
    const token = await getFirebaseAccessToken();
    
    if (!token) {
      console.error('No se pudo obtener el token de acceso');
      window.open(baseUrl, windowName, windowFeatures);
      return;
    }

    const user = auth.currentUser;
    const sessionId = `sso_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const ssoData = {
      access_token: token,
      user_email: user?.email,
      user_uid: user?.uid,
      timestamp: Date.now(),
      expires: Date.now() + (5 * 60 * 1000), // Expira en 5 minutos
      ...additionalParams
    };

    // Guardar en localStorage con clave única
    localStorage.setItem(sessionId, JSON.stringify(ssoData));

    // Solo enviar la clave de sesión
    const ssoUrl = `${baseUrl}?sso_session=${sessionId}&source=centro_monitoreo`;
    
    const popup = window.open(ssoUrl, windowName, windowFeatures);

    // Limpiar localStorage después de 5 minutos
    setTimeout(() => {
      localStorage.removeItem(sessionId);
    }, 5 * 60 * 1000);

    console.log('SSO: localStorage configurado exitosamente');
    return popup;
  } catch (error) {
    console.error('Error configurando localStorage SSO:', error);
    window.open(baseUrl, windowName, windowFeatures);
  }
};

/**
 * MÉTODO ORIGINAL (MANTENER PARA COMPATIBILIDAD)
 * Abre una ventana nueva con SSO usando GET (menos seguro)
 */
export const openSSOWindow = async (baseUrl, options = {}) => {
  const {
    additionalParams = {},
    windowName = '_blank',
    windowFeatures = 'noopener,noreferrer'
  } = options;

  try {
    // Obtener el token de acceso
    const token = await getFirebaseAccessToken();
    
    if (!token) {
      console.error('No se pudo obtener el token de acceso');
      // Abrir la URL original si no hay token
      window.open(baseUrl, windowName, windowFeatures);
      return;
    }

    // Construir la URL con SSO
    const ssoUrl = buildSSOUrl(baseUrl, token, additionalParams);
    
    // Abrir la ventana con la URL de SSO
    window.open(ssoUrl, windowName, windowFeatures);
    
    console.log('SSO: Ventana abierta exitosamente');
  } catch (error) {
    console.error('Error abriendo ventana con SSO:', error);
    // Fallback: abrir URL original
    window.open(baseUrl, windowName, windowFeatures);
  }
};

/**
 * Maneja la navegación SSO para enlaces externos (VERSIÓN SEGURA)
 * Detecta automáticamente si es Mattermost y usa método apropiado
 * @param {string} url - URL del sistema externo
 * @param {Object} userInfo - Información adicional del usuario (opcional)
 * @param {string} method - Método SSO a usar
 */
export const handleSSONavigation = async (url, userInfo = {}, method = 'auto') => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      console.warn('Usuario no autenticado para SSO');
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Detectar si es Mattermost
    const isMattermost = url.includes('mattermost') || 
                        url.includes('chat') || 
                        url.includes('acciones_6gw') || 
                        method.includes('mattermost');

    // Parámetros adicionales con información del usuario
    const additionalParams = {
      user_email: user.email,
      user_uid: user.uid,
      timestamp: Date.now(),
      ...userInfo
    };

    // Elegir método SSO según el parámetro y tipo de sistema
    if (isMattermost || method.startsWith('mattermost')) {
      switch (method) {
        case 'mattermost-oauth':
          await openMattermostOAuth(url, { additionalParams });
          break;
        case 'mattermost-jwt':
          await openMattermostJWT(url, { additionalParams });
          break;
        case 'mattermost-api':
          await openMattermostAPI(url, { additionalParams });
          break;
        default:
          // Auto-detectar mejor método para Mattermost
          await openMattermostOAuth(url, { additionalParams });
          break;
      }
    } else {
      // Métodos tradicionales para otros sistemas
      switch (method) {
        case 'post':
          await openSSOWindowSecure(url, { additionalParams });
          break;
        case 'token-exchange':
          await openSSOWithTokenExchange(url, { additionalParams });
          break;
        case 'localStorage':
          await openSSOWithLocalStorage(url, { additionalParams });
          break;
        case 'url':
        default:
          await openSSOWindow(url, { additionalParams });
          break;
      }
    }
    
  } catch (error) {
    console.error('Error en navegación SSO:', error);
    // Fallback: navegación normal
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
