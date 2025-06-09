import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsExportData from 'highcharts/modules/export-data';

// Initialize Highcharts modules
if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
  HighchartsAccessibility(Highcharts);
  HighchartsExportData(Highcharts);
}

const ResumenCharts2 = () => {
  useEffect(() => {
    // Chart 1: Pie Chart - Distribución de Capacidad Instalada
    Highcharts.chart('container-capacidad-1', {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Distribución de Capacidad Instalada por Tecnología'
      },
      subtitle: {
        text: 'Fecha: 2025-06-09'
      },
      tooltip: {
        pointFormat: '<b>{series.name}</b>: <b>{point.percentage:.1f}%</b><br>Valor: <b>{point.y} MW</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} % ({point.y} MW)',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'Capacidad',
        colorByPoint: false,
        data: [
          { name: 'BIOMASA', y: 15.15, color: '#deed1b' },
          { name: 'EOLICA', y: 12, color: '#183e34' },
          { name: 'PCH', y: 6.1, color: '#007bff' },
          { name: 'SOLAR', y: 2092.67, color: '#ffc107' }
        ]
      }]
    });

    // Chart 2: Pie Chart - Same as Chart 1 but with different ID
    Highcharts.chart('container-capacidad-2', {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Distribución de Capacidad Instalada por Tipo de Proyecto'
      },
      subtitle: {
        text: 'Fecha: 2025-07-01'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br>Valor: <b>{point.y} MW</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} % ({point.y} MW)',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'Capacidad',
        colorByPoint: false,
        data: [
          { name: 'AGGE', y: 133.08, color: '#deed1b' },
          { name: 'AGPE', y: 215.21, color: '#183e34' },
          { name: 'Generacion Centralizada	', y: 1759.59, color: '#007bff' },
          { name: 'Generacion Distribuida	', y: 18.04, color: '#ffc107' }
        ]
      }]
    });

    // Chart 3: Stacked Column Chart - Capacidad Entrante por mes
    Highcharts.chart('container-stacked-column', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Capacidad Entrante por mes'
      },
      xAxis: {
        categories: [
          '2025-06', '2025-07', '2025-08', '2025-09', '2025-10',
          '2025-11', '2025-12', '2026-01', '2026-02', '2026-03',
          '2026-04', '2026-05', '2026-06', '2026-07'
        ],
        title: {
          text: 'Mes'
        },
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Capacidad (MW)'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold'
          }
        }
      },
      legend: {
        reversed: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: false
          },
          borderWidth: 0
        }
      },
      series: [{
        name: 'BIOMASA Y RESIDUOS',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, 0],
        color: '#8d5a99'
      }, {
        name: 'EÓLICA',
        data: [0, 0, 20, 0, 0, 0, 0, 0, 80, 0, 0, 201, 10, 0],
        color: '#4bbf73'
      }, {
        name: 'PCH',
        data: [19.8, 0, 9.9, 0, 2.07, 0, 46.8, 0, 0, 3.52, 0, 0, 1.6, 0],
        color: '#007bff'
      }, {
        name: 'SOLAR FV',
        data: [79.4, 66, 157, 15, 537, 114.59, 1924.79, 167.8, 49.9, 152.1, 108, 0, 218.2, 138.7],
        color: '#ffc107'
      }],
      tooltip: {
        formatter: function() {
          var category = this.points && this.points[0] && this.points[0].series.xAxis.categories[this.points[0].point.index];
          var tooltip = '<b>' + category + '</b><br/>';
          tooltip += '<b>Total: ' + this.point.total + ' MW</b><hr/>';
          this.points.forEach(function(point) {
            tooltip += '<span style="color:' + point.color + '">●</span> ' + 
                    point.series.name + ': <b>' + point.y + ' MW</b><br/>';
          });
          return tooltip;
        },
        shared: true,
        useHTML: true
      },
      credits: {
        enabled: false
      }
    });

    // Chart 4: Stacked Column Chart - Capacidad Instalada por año
    Highcharts.chart('container-stacked-column-2', {
      chart: {
        type: 'column',
        // backgroundColor: '#F6F6F5'
      },
      title: {
        text: 'Capacidad Instalada Despachada Centralmente'
      },
      xAxis: {
        categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        labels: {
          // style: {
          //   fontSize: '14px'
          // }
        }
      },
      yAxis: {
        min: 0,
        max: 25,
        title: {
          text: 'Capacidad Instalada (GW)',
          style: {
            fontWeight: 'bold',
            fontSize: '14px'
          }
        },
        gridLineDashStyle: 'Dash'
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        // verticalAlign: 'top',
        floating: false,
        // backgroundColor: 'white'
      },
      tooltip: {
        shared: true
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      series: [
        { name: 'ACPM', data: [0.790, 0.774, 0.774, 0.774, 0.766, 0.766, 0.807, 0.807, 0.823, 0.903, 0.903, 0.903], color: '#b8ff65' },
        { name: 'AGUA', data: [10.315, 10.892, 10.943, 10.943, 10.974, 11.041, 11.043, 11.043, 11.619, 12.237, 12.237, 12.237], color: '#2b4037' },
        { name: 'CARBON', data: [1.003, 1.339, 1.329, 1.329, 1.612, 1.619, 1.623, 1.626, 1.632, 1.634, 1.613, 1.613], color: '#05D80A' },
        { name: 'COMBUSTOLEO', data: [0.187, 0.187, 0.187, 0.187, 0.272, 0.272, 0.272, 0.268, 0.268, 0.266, 0.266, 0.266], color: '#e4b33c' },
        { name: 'GAS', data: [2.3959, 2.3969, 2.4119, 2.4129, 2.4279, 2.4209, 2.3760, 2.5500, 2.7420, 2.9830, 2.9830, 2.9830], color: '#4f8a21' },
        { name: 'GLP', data: [0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.052, 0.052], color: '#f2df96' },
        { name: 'JET-A1', data: [0.046, 0.046, 0.046, 0.046, 0.044, 0.044, 0.044, 0.044, 0.051, 0.050, 0.050, 0.050], color: '#e9ffc7' },
        { name: 'RAD SOLAR', data: [0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 1.138, 1.138], color: '#f97316' }
      ],
      annotations: [{
        labels: [{
          point: {
            x: 2,
            y: 20,
            xAxis: 0,
            yAxis: 0
          },
          text: 'CAPACIDAD EFECTIVA NETA: 22.120 GW',
          style: {
            fontSize: '14px',
            fontWeight: 'bold'
          }
        }]
      }]
    });
  }, []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      padding: '20px',
      maxWidth: '2300px',
      margin: '0 auto'
    }}>
      <div id="container-capacidad-1" style={{ height: '500px', width: '100%' }} />
      <div id="container-capacidad-2" style={{ height: '500px', width: '100%' }} />
      <div id="container-stacked-column" style={{ height: '500px', width: '100%' }} />
      <div id="container-stacked-column-2" style={{ height: '500px', width: '100%' }} />
    </div>
  );
};

export default ResumenCharts2;