// src/components/ResumenCharts.jsx
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';

// Load Highcharts modules
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Set the global Highcharts theme to dark gray + Nunito Sans
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: {
      fontFamily: 'Nunito Sans, sans-serif'
    }
  },
  title: {
    style: {
      color: '#fff',
      fontFamily: 'Nunito Sans, sans-serif'
    }
  },
  subtitle: {
    style: {
      color: '#aaa',
      fontFamily: 'Nunito Sans, sans-serif'
    }
  },
  xAxis: {
    labels: {
      style: {
        color: '#ccc',
        fontSize: '10px',
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
        fontSize: '10px',
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
      fontFamily: 'Nunito Sans, sans-serif'
    },
    itemHoverStyle: {
      color: '#fff'
    },
    itemHiddenStyle: {
      color: '#666'
    }
  },
  tooltip: {
    backgroundColor: '#262626',
    style: {
      color: '#fff',
      fontSize: '12px',
      fontFamily: 'Nunito Sans, sans-serif'
    }
  }
});

export function ResumenCharts() {
  const [charts, setCharts] = useState([]);
  const [selected, setSelected] = useState('all');
  const chartRefs = useRef([]);

  useEffect(() => {
    // Base options for each of the four charts
    const baseOptions = [
      // 1) Donut 1: Distribución por tecnología
      {
        chart: {
          type: 'pie',
          height: 300,
          backgroundColor: '#262626'
        },
        title: {
          text: 'Distribución actual por tecnología'
        },
        subtitle: {
          text: 'Fuente: XM. 2020-2024'
        },
        plotOptions: {
          pie: {
            innerSize: '60%',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.y:.2f} MW',
              style: {
                color: '#fff',
                fontFamily: 'Nunito Sans, sans-serif'
              }
            },
            showInLegend: true
          }
        },
        series: [
          {
            name: 'Tecnología',
            colorByPoint: false,
            data: [
              { name: 'Solar', y: 1960.05, color: '#FFC800' },
              { name: 'Eólica', y: 120.06, color: '#9C9C9C' }
            ]
          }
        ],
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.2f} MW</b>'
        },
        exporting: {
          enabled: true,
          buttons: {
            contextButton: {
              menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
            }
          }
        }
      },
      // 2) Donut 2: Distribución por categoría
      {
        chart: {
          type: 'pie',
          height: 300,
          backgroundColor: '#262626'
        },
        title: {
          text: 'Distribución actual por categoría'
        },
        subtitle: {
          text: 'Fuente: XM. 2020-2024'
        },
        plotOptions: {
          pie: {
            innerSize: '60%',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.y:.2f} MW',
              style: {
                color: '#fff',
                fontFamily: 'Nunito Sans, sans-serif'
              }
            },
            showInLegend: true
          }
        },
        series: [
          {
            name: 'Categoría',
            colorByPoint: false,
            data: [
              { name: 'AG', y: 1960.05, color: '#FFC800' },
              { name: 'GD', y: 120.06, color: '#FF9900' }
            ]
          }
        ],
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.2f} MW</b>'
        },
        exporting: {
          enabled: true,
          buttons: {
            contextButton: {
              menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
            }
          }
        }
      },
      // 3) Column 1: Número de proyectos próximos 6 meses
      {
        chart: {
          type: 'column',
          height: 350,
          backgroundColor: '#262626'
        },
        title: {
          text: 'Número de proyectos próximos 6 meses'
        },
        subtitle: {
          text: 'Fuente: XM. 2020-2024'
        },
        xAxis: {
          categories: ['Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre'],
          title: {
            text: null
          },
          labels: {
            style: {
              color: '#ccc',
              fontSize: '10px',
              fontFamily: 'Nunito Sans, sans-serif'
            }
          },
          gridLineColor: '#333'
        },
        yAxis: {
          title: {
            text: 'Número de proyectos',
            style: {
              color: '#ccc',
              fontFamily: 'Nunito Sans, sans-serif'
            }
          },
          labels: {
            style: {
              color: '#ccc',
              fontSize: '10px',
              fontFamily: 'Nunito Sans, sans-serif'
            }
          },
          gridLineColor: '#333'
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            borderWidth: 0,
            dataLabels: {
              enabled: false
            }
          }
        },
        series: [
          { name: 'Eólica', data: [0, 1, 0, 6, 6, 4], color: '#FFC800' },
          { name: 'Solar', data: [1, 9, 15, 21, 22, 14], color: '#FF9900' }
        ],
        exporting: {
          enabled: true,
          buttons: {
            contextButton: {
              menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
            }
          }
        }
      },
      // 4) Column 2: Histórico anual matriz completa
      {
        chart: {
          type: 'column',
          height: 350,
          backgroundColor: '#262626'
        },
        title: {
          text: 'Histórico anual matriz completa'
        },
        subtitle: {
          text: 'Fuente: XM. 2020-2024'
        },
        xAxis: {
          categories: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028'],
          title: {
            text: null
          },
          labels: {
            style: {
              color: '#ccc',
              fontSize: '10px',
              fontFamily: 'Nunito Sans, sans-serif'
            }
          },
          gridLineColor: '#333'
        },
        yAxis: {
          title: {
            text: 'Capacidad Instalada (GW)',
            style: {
              color: '#ccc',
              fontFamily: 'Nunito Sans, sans-serif'
            }
          },
          labels: {
            style: {
              color: '#ccc',
              fontSize: '10px',
              fontFamily: 'Nunito Sans, sans-serif'
            }
          },
          gridLineColor: '#333'
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            borderWidth: 0,
            dataLabels: {
              enabled: false
            }
          }
        },
        series: [
          { name: 'Solar', data: [2.5, 2.7, 2.6, 2.8, 3.0, 3.5, 4.0, 5.5, 6.0], color: '#FFC800' },
          { name: 'Eólica', data: [11, 12, 12.5, 13, 14, 15, 16, 17, 18], color: '#9C9C9C' }
        ],
        exporting: {
          enabled: true,
          buttons: {
            contextButton: {
              menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
            }
          }
        }
      }
    ];

    setCharts(baseOptions);
  }, []);

  const isFiltered = selected !== 'all';
  // If filtered or on a small screen, show one column per row. Otherwise show 2×2 grid.
  const gridClasses = isFiltered
    ? 'grid-cols-1 lg:grid-cols-1'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2';

  // Only render the selected chart(s)
  const displayed = charts
    .map((opt, idx) => ({ opt, idx }))
    .filter(item => selected === 'all' || String(item.idx) === selected);

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-white font-sans">
        Gráficas Resumen
      </h2>

      {/* Global dropdown to choose “Mostrar todos” or a single chart */}
      <div className="mb-4">
        <select
          className="bg-[#262626] text-gray-200 p-2 rounded"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="all">Mostrar todos</option>
          {charts.map((c, i) => (
            <option key={i} value={String(i)}>
              {c.title.text}
            </option>
          ))}
        </select>
      </div>

      {/* Responsive grid for the four charts */}
      <div className={`grid ${gridClasses} gap-4`}>
        {displayed.map(({ opt, idx }) => {
          return (
            <div
              key={idx}
              className="bg-[#262626] p-4 rounded border border-[#666666] shadow relative"
            >
              {/* “Maximizar” button */}
              <button
                className="absolute top-2 right-2 text-gray-300 hover:text-white"
                onClick={() => chartRefs.current[idx].chart.fullscreen.toggle()}
                title="Maximizar gráfico"
              >
                ⛶
              </button>

              <HighchartsReact
                highcharts={Highcharts}
                options={opt}
                ref={el => (chartRefs.current[idx] = el)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ResumenCharts;