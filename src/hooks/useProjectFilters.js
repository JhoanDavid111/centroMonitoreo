// src/hooks/useProjectFilters.js
import { useState, useMemo, useCallback } from 'react';

/**
 * Hook para manejar filtros de proyectos (global y por columna)
 */
export function useProjectFilters() {
  const [columnFilters, setColumnFilters] = useState({
    id: '',
    nombre: '',
    capacidad: '',
    fpo: '',
    avance: '',
    priorizado: '',
    ciclo: '',
    promotor: '',
    departamento: '',
    municipio: '',
    estado: ''
  });
  const [globalFilter, setGlobalFilter] = useState('');
  const [openFilter, setOpenFilter] = useState('');

  const initialFilters = useMemo(() => ({
    id: '',
    nombre: '',
    capacidad: '',
    fpo: '',
    avance: '',
    priorizado: '',
    ciclo: '',
    promotor: '',
    departamento: '',
    municipio: '',
    estado: ''
  }), []);

  const resetFilters = useCallback(() => {
    setColumnFilters(initialFilters);
    setGlobalFilter('');
    setOpenFilter('');
  }, [initialFilters]);

  return {
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    openFilter,
    setOpenFilter,
    resetFilters,
    initialFilters
  };
}

