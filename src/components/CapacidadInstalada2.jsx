import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/exporting';
import 'highcharts/modules/offline-exporting';

const EnergyGenerationChart = () => {
  // Data provided by the user
  const data = `
Values_Type                       SOLAR   PCH   BIOMASA   EOLICA
Values_OperStartdate
2022-08-31                      13.75405  0.0     0.00    12.0
2022-09-30                     106.29849  1.7     0.00    12.0
2022-10-31                     112.01440  1.7     0.00    12.0
2022-11-30                     117.16179  1.7     0.00    12.0
2022-12-31                     137.53167  6.1     0.00    12.0
2023-01-31                     162.94965  6.1     0.00    12.0
2023-02-28                     169.16584  6.1     0.00    12.0
2023-03-31                     232.16524  6.1     0.00    12.0
2023-04-30                     275.23850  6.1     0.00    12.0
2023-05-31                     280.39114  6.1     0.00    12.0
2023-06-30                     293.79211  6.1     0.00    12.0
2023-07-31                     358.78633  6.1     0.00    12.0
2023-08-31                     429.99398  6.1     0.00    12.0
2023-09-30                     435.47030  6.1     0.00    12.0
2023-10-31                     443.48410  6.1     0.00    12.0
2023-11-30                     454.81459  6.1     0.00    12.0
2023-12-31                     493.35227  6.1     0.00    12.0
2024-01-31                     499.44148  6.1     0.00    12.0
2024-02-29                     519.97288  6.1     0.00    12.0
2024-03-31                     720.09280  6.1     0.00    12.0
2024-04-30                     759.96136  6.1     0.00    12.0
2024-05-31                     794.70379  6.1     0.00    12.0
2024-06-30                    1316.66966  6.1     0.00    12.0
2024-07-31                    1332.26590  6.1     0.00    12.0
2024-08-31                    1362.66703  6.1     0.00    12.0
2024-09-30                    1443.24484  6.1     0.00    12.0
2024-10-31                    1485.84099  6.1     0.00    12.0
2024-11-30                    1905.49202  6.1     0.00    12.0
2024-12-31                    2017.53438  6.1    15.15    12.0
2025-01-31                    2031.94821  6.1    15.15    12.0
2025-02-28                    2038.05421  6.1    15.15    12.0
2025-03-31                    2062.87421  6.1    15.15    12.0
2025-04-30                    2092.67421  6.1    15.15    12.0
  `;

  // Parse the data
  const lines = data.trim().split('\n');
  const headerLine = lines[0].trim();
  const columnNames = headerLine.split(/\s+/).slice(1);

  // Extract categories (dates) and series data
  const categories = [];
  const seriesData = {};
  columnNames.forEach(name => seriesData[name] = []);

  // Process data rows starting from the third line (index 2)
  for (let i = 2; i < lines.length; i++) {
    const parts = lines[i].trim().split(/\s+/);
    const date = parts[0];
    categories.push(date);

    // Populate series data
    for (let j = 0; j < columnNames.length; j++) {
      const value = parseFloat(parts[j + 1]);
      seriesData[columnNames[j]].push(value);
    }
  }

  // Define a custom color palette for the series
  const seriesColors = [
    '#FFC107', // SOLAR - Amber
    '#4CAF50', // PCH - Green
    '#F44336', // BIOMASA - Red
    '#2196F3'  // EOLICA - Blue
  ];

  // Format data for Highcharts series
  const highchartsSeries = columnNames.map((name, index) => ({
    name: name,
    data: seriesData[name],
    color: seriesColors[index % seriesColors.length]
  })).reverse();

  // Chart options
  const chartOptions = {
    chart: {
      type: 'area',
    },
    title: {
      text: 'Evolución Capacidad Instalada por Tecnología',
      style: {
        fontSize: '22px',
        fontWeight: 'bold',
        // color: '#333'
      }
    },
    subtitle: {
      text: 'Solo se tienen en cuenta proyectos que entraron en operación o pruebas a partir del 07 de agosto de 2022',
      style: {
        // color: '#666'
      }
    },
    xAxis: {
      categories: categories,
      tickmarkPlacement: 'on',
      title: {
        enabled: false
      },
      labels: {
        rotation: -45,
        style: {
          fontSize: '10px'
        }
      },
      gridLineWidth: 0,
      lineColor: '#ccc',
      lineWidth: 1
    },
    yAxis: {
      title: {
        text: 'Capacidad Instalada (MW)',
        style: {
          // color: '#333'
        }
      },
      labels: {
        formatter: function() {
          return this.value;
        }
      },
      gridLineWidth: 1,
      gridLineColor: '#e0e0e0'
    },
    tooltip: {
      headerFormat: '<span style="font-size: 10px;"><b>{point.key}</b></span><br/>' +
                    '<span style="font-size: 10px;">Total: <b>{point.total:,.2f}</b></span><br/>' +
                    '<hr style="border-top: 1px solid #ccc; margin: 5px 0;">',
      pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y:,.2f}</b><br/>',
      shared: true,
      // backgroundColor: 'rgba(255, 255, 255, 0.9)',
      // borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      shadow: true,
      style: {
        fontSize: '12px'
      }
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        lineColor: '#ffffff',
        lineWidth: 0,
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 3,
          states: {
            hover: {
              enabled: true
            }
          }
        },
        fillOpacity: 0.8
      }
    },
    series: highchartsSeries,
    credits: {
      enabled: false
    },
    exporting: {
      enabled: true
    }
  };

  return (

        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          containerProps={{ style: { width: '100%', height: '500px' } }}
        />

  );
};

export default EnergyGenerationChart;