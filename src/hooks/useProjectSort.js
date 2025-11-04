// src/hooks/useProjectSort.js
import { useState, useMemo, useCallback } from 'react';

/**
 * Hook para manejar ordenamiento de proyectos
 */
export function useProjectSort() {
  const [sortState, setSortState] = useState({ key: '', direction: '' });

  const toggleSort = useCallback((key) => {
    setSortState((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: '', direction: '' };
    });
  }, []);

  const getSortValue = useCallback((row, key) => {
    switch (key) {
      case 'id':           return Number(row.id) || 0;
      case 'nombre':       return String(row.nombre_proyecto ?? '');
      case 'capacidad':    return Number(row.capacidad_instalada_mw) || 0;
      case 'fpo':          return row.fpo && row.fpo !== '-' ? new Date(row.fpo).getTime() : -Infinity;
      case 'avance':       return Number(row.porcentaje_avance ?? (String(row.porcentaje_avance_display || '').replace('%', ''))) || 0;
      case 'priorizado':   return String(row.priorizado ?? '');
      case 'ciclo':        return String(row.ciclo_asignacion ?? '');
      case 'promotor':     return String(row.promotor ?? '');
      case 'departamento': return String(row.departamento ?? '');
      case 'municipio':    return String(row.municipio ?? '');
      case 'estado':       return String(row.estado ?? '');
      default:             return '';
    }
  }, []);

  const applySort = useCallback((data) => {
    if (!sortState.key || !sortState.direction) return data;
    const dir = sortState.direction === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => {
      const va = getSortValue(a, sortState.key);
      const vb = getSortValue(b, sortState.key);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      return String(va).localeCompare(String(vb), 'es', { numeric: true, sensitivity: 'base' }) * dir;
    });
  }, [sortState, getSortValue]);

  const resetSort = useCallback(() => {
    setSortState({ key: '', direction: '' });
  }, []);

  return {
    sortState,
    toggleSort,
    applySort,
    resetSort
  };
}

