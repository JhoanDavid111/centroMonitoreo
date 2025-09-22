import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Verifica si la ruta actual debe excluise del reseteo de scroll
 * @param {string} pathname - La ruta actual
 * @param {string[]} excludedRoutes - Lista de rutas excluidas
 * @returns {boolean} - true si la ruta está excluida, false en caso contrario
 */

function isExcluded(pathname, excludedRoutes) {
    return excludedRoutes.some(route=>pathname.startsWith(route));
}

/**
 * Componente que resetea el scroll a la parte superior de la página al cambiar de ruta,
 * excluyendo ciertas rutas especificadas.
 * @param {Object} props - Props del componente
 * @param {string[]} props.excludedRoutes - Lista de rutas que no deben resetear el scroll
 */

export default function ScrollToTop({ scrollRef, excludedRoutes = [] }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (isExcluded(pathname, excludedRoutes)) return;

    if (scrollRef?.current) {
      scrollRef.current.scrollTop = 0;
    } 

      window.scrollTo(0, 0);
    
  }, [pathname, excludedRoutes, scrollRef]);

  return null;
}

