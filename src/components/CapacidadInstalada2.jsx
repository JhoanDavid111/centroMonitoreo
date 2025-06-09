import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const StackedColumnChart = () => {
  const chartOptions = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Capacidad Entrante por mes'
    },
    xAxis: {
      type: "category",
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
      data: [
        0, 0, 0, 0, 0,
        0, 0, 0, 25, 0,
        0, 0, 0, 0
      ],
      color: '#8d5a99'
    }, {
      name: 'EÓLICA',
      data: [
        0, 0, 20, 0, 0,
        0, 0, 0, 80, 0,
        0, 201, 10, 0
      ],
      color: '#4bbf73'
    }, {
      name: 'PCH',
      data: [
        19.8, 0, 9.9, 0, 2.07,
        0, 46.8, 0, 0, 3.52,
        0, 0, 1.6, 0
      ],
      color: '#007bff'
    }, {
      name: 'SOLAR FV',
      data: [
        79.4, 66, 157, 15, 537,
        114.59, 1924.79, 167.8, 49.9, 152.1,
        108, 0, 218.2, 138.7
      ],
      color: '#ffc107'
    }],
    tooltip: {
      formatter: function() {
        // Obtener la categoría (mes) correcta usando el índice del punto
        var category = this.points && this.points[0] && this.points[0].series.xAxis.categories[this.points[0].point.index];
        
        // Cabecera con fecha en negrita
        var tooltip = '<b>' + category + '</b><br/>';
        tooltip += '<b>Total: ' + this.point.total + ' MW</b><hr/>';
        
        // Detalle de cada serie
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
  };

  return (
    <div style={{ maxWidth: '1500px', minWidth:'400px' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  );
};

export default StackedColumnChart;