// src/components/DataGrid/styles/highcharts.js
import Highcharts from 'highcharts';

// Configuración global de Highcharts
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' },
    plotBorderWidth: 0,
    plotBackgroundColor: 'transparent',
  },
  title: { style: { color: '#fff', fontSize: '16px', fontWeight: '600' } },
  subtitle: { style: { color: '#aaa', fontSize: '12px' } },
  xAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px' } },
    title: { style: { color: '#ccc' } },
    gridLineColor: '#333',
  },
  yAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px' } },
    title: { style: { color: '#ccc' } },
    gridLineColor: '#333',
  },
  legend: {
    itemStyle: { color: '#ccc', fontFamily: 'Nunito Sans' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' },
  },
  tooltip: {
    backgroundColor: '#1f2937',
    style: { color: '#fff', fontSize: '12px' },
  },
  credits: { enabled: false },
});

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