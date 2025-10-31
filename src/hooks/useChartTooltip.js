// src/hooks/useChartTooltip.js
// Hook reutilizable para manejo de tooltips modales en gráficas

import { useState } from 'react';
import { useTooltips } from '../services/tooltipsService';

/**
 * Hook para manejar tooltips modales en gráficas
 * 
 * @param {string|null} tooltipId - ID del tooltip en la API (opcional)
 * @param {string} chartTitle - Título de la gráfica (para mostrar en la modal)
 * @returns {Object} - Objeto con estados y funciones del tooltip
 */
export function useChartTooltip(tooltipId, chartTitle = 'Gráfica') {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  
  const { data: tooltips = {}, isLoading: loadingTooltips } = useTooltips();
  
  /**
   * Cierra la modal y resetea los estados
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle('');
    setModalContent('');
  };
  
  /**
   * Maneja el clic en el botón de ayuda
   * Busca el contenido del tooltip en el caché y abre la modal
   */
  const handleHelpClick = () => {
    const title = chartTitle || 'Gráfica';
    const content = tooltipId ? tooltips[tooltipId] : null;
    
    if (content) {
      setModalTitle(title);
      setModalContent(content);
      setIsModalOpen(true);
    } else {
      setModalTitle('Información no disponible');
      setModalContent('No se encontró una descripción detallada para esta gráfica.');
      setIsModalOpen(true);
    }
  };
  
  return {
    isModalOpen,
    modalTitle,
    modalContent,
    closeModal,
    handleHelpClick,
    loadingTooltips,
  };
}

