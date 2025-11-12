// src/lib/highcharts-config.js
// Configuración centralizada de Highcharts para todo el proyecto

import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import FullScreen from 'highcharts/modules/full-screen';

import tokens from '../styles/theme.js';

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
    backgroundColor: tokens.colors.surface.primary,
    style: { fontFamily: tokens.font.family },
    plotBorderWidth: 0,
    plotBackgroundColor: 'transparent',
  },
  title: {
    align: 'left',
    style: {
      color: tokens.colors.text.primary,
      fontSize: tokens.font.size.lg,
      fontWeight: tokens.font.weight.semibold,
      fontFamily: tokens.font.family,
    },
  },
  subtitle: {
    style: {
      color: tokens.colors.text.muted,
      fontSize: tokens.font.size.sm,
      fontFamily: tokens.font.family,
    },
  },
  xAxis: {
    labels: {
      style: {
        color: tokens.colors.text.secondary,
        fontSize: tokens.font.size.sm,
        fontFamily: tokens.font.family,
      },
    },
    title: {
      style: {
        color: tokens.colors.text.secondary,
        fontFamily: tokens.font.family,
      },
    },
    gridLineColor: tokens.colors.border.subtle,
  },
  yAxis: {
    labels: {
      style: {
        color: tokens.colors.text.secondary,
        fontSize: tokens.font.size.sm,
        fontFamily: tokens.font.family,
      },
    },
    title: {
      style: {
        color: tokens.colors.text.secondary,
        fontFamily: tokens.font.family,
      },
    },
    gridLineColor: tokens.colors.border.subtle,
  },
  legend: {
    itemStyle: {
      color: tokens.colors.text.secondary,
      fontFamily: tokens.font.family,
      fontSize: tokens.font.size.sm,
    },
    itemHoverStyle: { color: tokens.colors.text.primary },
    itemHiddenStyle: { color: tokens.colors.text.muted },
  },
  tooltip: {
    backgroundColor: tokens.colors.surface.primary,
    borderColor: tokens.colors.border.default,
    style: {
      color: tokens.colors.text.primary,
      fontSize: tokens.font.size.base,
      fontFamily: tokens.font.family,
    },
    padding: parseInt(tokens.spacing.lg, 10),
    useHTML: true,
  },
  credits: { enabled: false },
});

// ────────────────────────────────────────────────
// Tema adicional para componentes que lo necesiten
// (Extraído de DataGrid/styles/highcharts.js)
// ────────────────────────────────────────────────
export const highchartsTheme = {
  colors: tokens.colors.chart,
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

