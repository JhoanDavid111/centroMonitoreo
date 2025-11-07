// src/lib/highcharts-config.js
// Configuración centralizada de Highcharts para todo el proyecto

import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import FullScreen from 'highcharts/modules/full-screen';

// ────────────────────────────────────────────────
// Carga de módulos Highcharts
// ────────────────────────────────────────────────
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// ────────────────────────────────────────────────
// Configuración global unificada de Highcharts
// Consolidada desde: DataGrid/styles/highcharts.js, 
// GeneracionDespacho.jsx, ResumenCharts.jsx, HitosBarras.jsx
// ────────────────────────────────────────────────
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' },
    plotBorderWidth: 0,
    plotBackgroundColor: 'transparent',
  },
  title: {
    align: 'left',
    style: { 
      color: '#fff', 
      fontSize: '16px', 
      fontWeight: '600',
      fontFamily: 'Nunito Sans, sans-serif' 
    }
  },
  subtitle: {
    style: { 
      color: '#aaa', 
      fontSize: '12px',
      fontFamily: 'Nunito Sans, sans-serif' 
    }
  },
  xAxis: {
    labels: { 
      style: { 
        color: '#ccc', 
        fontSize: '12px',
        fontFamily: 'Nunito Sans, sans-serif' 
      } 
    },
    title: { 
      style: { 
        color: '#ccc',
        fontFamily: 'Nunito Sans, sans-serif' 
      } 
    },
    gridLineColor: '#333'
  },
  yAxis: {
    labels: { 
      style: { 
        color: '#ccc', 
        fontSize: '12px',
        fontFamily: 'Nunito Sans, sans-serif' 
      } 
    },
    title: { 
      style: { 
        color: '#ccc',
        fontFamily: 'Nunito Sans, sans-serif' 
      } 
    },
    gridLineColor: '#333'
  },
  legend: {
    itemStyle: { 
      color: '#ccc', 
      fontFamily: 'Nunito Sans, sans-serif',
      fontSize: '12px' 
    },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#262626',
    borderColor: '#666',
    style: { 
      color: '#fff', 
      fontSize: '13px' 
    },
    padding: 10,
    useHTML: true,
  },
  credits: { enabled: false },
});

// ────────────────────────────────────────────────
// Tema adicional para componentes que lo necesiten
// (Extraído de DataGrid/styles/highcharts.js)
// ────────────────────────────────────────────────
export const highchartsTheme = {
  colors: ['#FFC800', '#FF7043', '#66BB6A', '#42A5F5', '#AB47BC', '#EC407A', '#26C6DA', '#D4E157'],
  exporting: {
    enabled: true,
    buttons: {
      contextButton: {
        menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG', 'downloadCSV', 'downloadXLS']
      }
    }
  },
  responsive: {
    rules: [{
      condition: { maxWidth: 500 },
      chartOptions: {
        legend: { align: 'center', verticalAlign: 'bottom', layout: 'horizontal' }
      }
    }]
  }
};

// Exportar Highcharts configurado como default
export default Highcharts;

