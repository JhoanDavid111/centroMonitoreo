// src/hooks/useSSO.js
import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { handleSSONavigation } from '../utils/ssoUtils';

/**
 * Hook personalizado para manejar navegación SSO
 * @returns {Object} Funciones para manejar SSO
 */
export const useSSO = () => {
  const { currentUser, userRole } = useAuth();

  /**
   * Navega a un enlace externo con SSO
   * @param {string} url - URL del sistema externo
   * @param {Object} options - Opciones adicionales
   * @param {string} options.method - Método SSO: 'mattermost-oauth' (recomendado), 'mattermost-jwt', 'mattermost-api', 'post', etc.
   * @param {Object} options.userInfo - Información adicional del usuario
   */
  const navigateWithSSO = useCallback(async (url, options = {}) => {
    try {
      const { method = 'mattermost-oauth', userInfo = {} } = options;
      
      // Información adicional del usuario para SSO
      const completeUserInfo = {
        role: userRole,
        display_name: currentUser?.displayName,
        ...userInfo
      };

      await handleSSONavigation(url, completeUserInfo, method);
    } catch (error) {
      console.error('Error en useSSO navigateWithSSO:', error);
      // Fallback: navegación normal
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, [currentUser, userRole]);

  /**
   * Verifica si el usuario está autenticado para SSO
   * @returns {boolean} True si puede usar SSO
   */
  const canUseSSO = useCallback(() => {
    return !!(currentUser && userRole);
  }, [currentUser, userRole]);

  return {
    navigateWithSSO,
    canUseSSO,
    isAuthenticated: !!currentUser,
    userRole
  };
};
