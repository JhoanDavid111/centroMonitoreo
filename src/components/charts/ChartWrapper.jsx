// src/components/charts/ChartWrapper.jsx
// Componente wrapper reutilizable para gráficas Highcharts

import { useRef } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from '../../lib/highcharts-config';
import { useChartTooltip } from '../../hooks/useChartTooltip';
import TooltipModal from '../ui/TooltipModal';
import ChartLoadingState from './ChartLoadingState';
import ChartErrorState from './ChartErrorState';
import HelpButton from './HelpButton';
import Card from '../ui/Card';

/**
 * Wrapper reutilizable para gráficas Highcharts
 * 
 * @param {Object} props
 * @param {Object|null} props.options - Opciones de Highcharts
 * @param {boolean} props.isLoading - Estado de carga
 * @param {Error|null} props.error - Error si existe
 * @param {string|null} props.tooltipId - ID del tooltip en la API (opcional)
 * @param {string} props.chartTitle - Título de la gráfica (para tooltip)
 * @param {string|number} props.height - Altura del contenedor (por defecto: 'auto')
 * @param {React.Ref} props.chartRef - Referencia al chart (opcional)
 * @param {Function} props.onRetry - Función para reintentar en caso de error (opcional)
 * @param {string} props.loadingMessage - Mensaje personalizado para loading (opcional)
 * @param {Object} props.containerProps - Props adicionales para el contenedor (opcional)
 * @param {Object} props.containerClassName - Clases adicionales para el contenedor (opcional)
 */
export default function ChartWrapper({
  options,
  isLoading = false,
  error = null,
  tooltipId = null,
  chartTitle = 'Gráfica',
  height = 'auto',
  chartRef: externalRef,
  onRetry = null,
  loadingMessage = null,
  containerProps = {},
  containerClassName = '',
  ...highchartsReactProps
}) {
  const internalRef = useRef(null);
  const chartRef = externalRef || internalRef;
  
  // Hook para tooltips (solo si se proporciona tooltipId)
  const tooltip = useChartTooltip(tooltipId, chartTitle);
  
  const showHelp = !!tooltipId;
  const hasData = options !== null && options !== undefined;
  
  // Mostrar loading si está cargando o cargando tooltips
  if (isLoading || tooltip.loadingTooltips) {
    return <ChartLoadingState message={loadingMessage || `Cargando ${chartTitle || 'gráfica'}...`} />;
  }
  
  // Mostrar error si existe
  if (error) {
    return <ChartErrorState error={error} onRetry={onRetry} />;
  }
  
  // No renderizar si no hay datos
  if (!hasData) {
    return null;
  }
  
  const containerStyle = {
    minHeight: height !== 'auto' ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };
  
  return (
    <>
      <Card
        className={`p-4 pb-10 relative ${containerClassName}`}
        style={containerStyle}
        {...containerProps}
      >
        {showHelp && (
          <HelpButton onClick={tooltip.handleHelpClick} />
        )}
        
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
          {...highchartsReactProps}
        />
      </Card>
      
      {showHelp && (
        <TooltipModal
          isOpen={tooltip.isModalOpen}
          onClose={tooltip.closeModal}
          title={tooltip.modalTitle}
          content={tooltip.modalContent}
        />
      )}
    </>
  );
}

