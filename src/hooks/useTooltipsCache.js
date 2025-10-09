// src/hooks/useTooltipsCache.js
import { useState, useEffect, useCallback } from 'react';

import { API } from '../config/api';

// -----------------------------------------------------------------------------
// 1. Lógica de Consulta a la API
// -----------------------------------------------------------------------------

// Función auxiliar para obtener los tooltips de la API
export async function fetchTooltips() {

  // Nota: es más común usar GET para obtener datos, si la API lo permite, úsalo.
  const resp = await fetch(
    `${API}/v1/tooltips/tooltips`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }  }); 
  if (!resp.ok) throw new Error('Error al consultar tooltips');
  return resp.json();
}

// Función de normalización de la respuesta de la API
function normalizeTooltips(resTooltips) {
    const normalizedTooltips = {};
    resTooltips.forEach(seccion => {
        seccion.elementos.forEach(elemento => {
            // Se asume que 'identificador' y 'Texto' son las claves correctas
            normalizedTooltips[elemento.identificador] = elemento.Texto;
        });
    });
    return normalizedTooltips;
}

// -----------------------------------------------------------------------------
// 2. Estado de Cache Global (Simulación sin Librería externa)
// -----------------------------------------------------------------------------
let cachedTooltips = null;
let isLoading = false;
let cacheError = null;
let subscribers = new Set();

// Notifica a todos los suscriptores cuando el estado del caché cambia
function notifySubscribers() {
    subscribers.forEach(callback => callback({ 
        tooltips: cachedTooltips, 
        loading: isLoading, 
        error: cacheError 
    }));
}

// -----------------------------------------------------------------------------
// 3. Custom Hook para Consumo
// -----------------------------------------------------------------------------

/**
 * Hook para obtener y cachear la información de los tooltips.
 * La consulta a la API solo se ejecuta una vez.
 * @returns {{ tooltips: Object, loading: boolean, error: string | null }}
 */
export function useTooltipsCache() {
    // Estado local para re-renderizar el componente cuando el cache global cambie
    const [state, setState] = useState({
        tooltips: cachedTooltips || {}, // Devuelve el caché si existe
        loading: cachedTooltips === null ? isLoading : false, // Setea loading inicial
        error: cacheError,
    });

    // Suscripción al estado global
    useEffect(() => {
        const callback = (newState) => setState(newState);
        subscribers.add(callback);

        // Si ya hay datos en caché, aseguramos el estado local.
        if (cachedTooltips !== null) {
             setState({ tooltips: cachedTooltips, loading: false, error: null });
        }
        
        return () => {
            subscribers.delete(callback);
        };
    }, []);

    // Lógica para cargar los datos solo la primera vez que se llama al hook
    useEffect(() => {
        if (cachedTooltips === null && !isLoading) {
            isLoading = true;
            cacheError = null;
            notifySubscribers(); // Notifica que la carga ha comenzado

            fetchTooltips()
                .then(resTooltips => {
                    cachedTooltips = normalizeTooltips(resTooltips);
                    cacheError = null;
                })
                .catch(e => {
                    cacheError = e.message || 'Error al cargar tooltips';
                })
                .finally(() => {
                    isLoading = false;
                    notifySubscribers(); // Notifica el resultado final
                });
        }
    }, []); // Se ejecuta solo una vez al montar la aplicación

    // Función de reintento, si fuera necesario (opcional)
    const refetchTooltips = useCallback(() => {
        // Lógica de reintento si no hay datos o hay error
        if (cachedTooltips === null || cacheError !== null) {
            // Forzar la recarga
            cachedTooltips = null;
            isLoading = true;
            cacheError = null;
            notifySubscribers();
            
            fetchTooltips()
                .then(resTooltips => {
                    cachedTooltips = normalizeTooltips(resTooltips);
                    cacheError = null;
                })
                .catch(e => {
                    cacheError = e.message || 'Error al cargar tooltips';
                })
                .finally(() => {
                    isLoading = false;
                    notifySubscribers();
                });
        }
    }, []);


    return {
        tooltips: state.tooltips,
        loading: state.loading,
        error: state.error,
        refetch: refetchTooltips // Se mantiene para consistencia con otros hooks
    };
}