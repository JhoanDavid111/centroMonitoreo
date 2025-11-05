// src/hooks/useTooltipsCache.js
import { useTooltips } from '../services/tooltipsService';

/**
 * Hook para obtener y cachear la información de los tooltips.
 * Wrapper para mantener compatibilidad con el código existente.
 * @returns {{ tooltips: Object, loading: boolean, error: string | null, refetch: Function }}
 */
export function useTooltipsCache() {
    const query = useTooltips();
    
    return {
        tooltips: query.data || {},
        loading: query.isLoading,
        error: query.error?.message || query.error,
        refetch: query.refetch
    };
}