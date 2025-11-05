// src/hooks/useCardTooltips.js
// Hook personalizado para manejar tooltips en componentes de tarjetas/indicadores

import { useState } from 'react';
import { useTooltips } from '../services/tooltipsService';
import { cleanSubtitle } from '../utils/dateUtils';

/**
 * Hook para manejar tooltips modales en componentes de tarjetas/indicadores
 * 
 * @param {Object} cardToTooltipMap - Mapeo de claves de tarjetas a IDs de tooltips
 * @param {Object} labelMap - Mapeo de claves a objetos con `label`, `icon`, etc.
 * @returns {Object} - Objeto con estados y funciones del tooltip
 */
export function useCardTooltips(cardToTooltipMap = {}, labelMap = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  
  const { 
    data: tooltips = {}, 
    isLoading: loadingTooltips, 
    error: errorTooltips 
  } = useTooltips();
  
  /**
   * Cierra la modal y resetea los estados
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle('');
    setModalContent('');
  };
  
  /**
   * Maneja el clic en el botón de ayuda de una tarjeta
   * @param {string} cardKey - Clave de la tarjeta (debe estar en cardToTooltipMap)
   */
  const handleHelpClick = (cardKey) => {
    const tooltipId = cardToTooltipMap[cardKey];
    const title = labelMap[cardKey]?.label || cardKey;
    const content = tooltipId ? tooltips[tooltipId] : null;
    
    if (tooltipId && content) {
      setModalTitle(cleanSubtitle(title));
      setModalContent(content);
      setIsModalOpen(true);
    } else {
      setModalTitle(cleanSubtitle(title));
      setModalContent('No hay información disponible en este momento.');
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
    errorTooltips,
  };
}

