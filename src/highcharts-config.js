// src/highcharts-config.js
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';

// Cargamos los módulos una única vez:
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Configuración global: tema oscuro + Nunito Sans + colores base
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: {
      fontFamily: 'Nunito Sans, sans-serif'
    },
    plotBorderWidth: 0,
    plotBackgroundColor: 'transparent'
  },
  title: {
    style: {
      color: '#FFFFFF',
      fontSize: '16px',
      fontWeight: '600'
    }
  },
  subtitle: {
    style: {
      color: '#AAAAAA',
      fontSize: '12px'
    }
  },
  xAxis: {
    labels: { style: { color: '#CCCCCC', fontSize: '10px' } },
    title: { style: { color: '#CCCCCC' } },
    gridLineColor: '#333333'
  },
  yAxis: {
    labels: { style: { color: '#CCCCCC', fontSize: '10px' } },
    title: { style: { color: '#CCCCCC' } },
    gridLineColor: '#333333'
  },
  legend: {
    itemStyle: { color: '#CCCCCC', fontFamily: 'Nunito Sans, sans-serif' },
    itemHoverStyle: { color: '#FFFFFF' },
    itemHiddenStyle: { color: '#666666' }
  },
  tooltip: {
    backgroundColor: '#1F2937',
    style: { color: '#FFFFFF', fontSize: '12px' },
    shared: true
  },
  // Usamos #FFC800 para resaltar series en las que corresponda
  colors: ['#FFC800', '#4CAF50', '#D4AF37', '#4CAF50', '#00AEEF', '#888888']
});
