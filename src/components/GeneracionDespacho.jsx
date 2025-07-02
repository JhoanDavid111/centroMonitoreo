// src/components/GeneracionDespacho.jsx
import React, { useEffect, useState, useRef } from 'react'
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
import OfflineExporting from 'highcharts/modules/offline-exporting'
import ExportData from 'highcharts/modules/export-data'
import FullScreen from 'highcharts/modules/full-screen'
import HighchartsReact from 'highcharts-react-official'
import { API } from '../config/api';

// Carga de módulos de Highcharts
Exporting(Highcharts)
OfflineExporting(Highcharts)
ExportData(Highcharts)
FullScreen(Highcharts)

// Tema global: fondo oscuro y Nunito Sans
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' }
  },
  title: {
    style: { color: '#fff', fontFamily: 'Nunito Sans, sans-serif' }
  },
  subtitle: {
    style: { color: '#aaa', fontFamily: 'Nunito Sans, sans-serif' }
  },
  xAxis: {
    labels: {
      style: {
        color: '#ccc',
        fontSize: '14px',
        fontFamily: 'Nunito Sans, sans-serif'
      },
      rotation: -45,
      align: 'right'
    },
    title: {
      style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' }
    },
    gridLineColor: '#333'
  },
  yAxis: {
    labels: {
      style: {
        color: '#ccc',
        fontSize: '14px',
        fontFamily: 'Nunito Sans, sans-serif'
      }
    },
    title: {
      style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' }
    },
    gridLineColor: '#333'
  },
  legend: {
    itemStyle: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif', fontSize: '12px' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#1f2937',
    style: { color: '#fff', fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' },
    shared: true
  }
})

export function GeneracionDespacho() {
  const chartRef = useRef(null)
  const [options, setOptions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    
    fetch(`${API}/v1/graficas/6g_proyecto/grafica_generacion_diaria`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        // Ordenar por fecha y generar categorías
        const sorted = [...data].sort(
          (a, b) => new Date(a.fecha) - new Date(b.fecha)
        )
        const categories = sorted.map(item => item.fecha.slice(0, 10))

        // Calcular un tickInterval para las etiquetas X (aprox. 12 etiquetas)
        const tickInt = Math.max(1, Math.ceil(categories.length / 12))

        // Series por tecnología
        const techs = ['TERMICA','COGENERADOR','HIDRAULICA','SOLAR','EOLICA']
        const colorMap = {
          EOLICA: '#5DFF97',
          SOLAR: '#FFC800',
          HIDRAULICA: '#3B82F6',
          COGENERADOR: '#D1D1D0',
          TERMICA: '#F97316'
        }
        const series = techs.map((tech, idx) => ({
          name: tech,
          data: categories.map(date => {
              const rec = sorted.find(d => d.fecha.slice(0,10) === date)
              return rec && rec[tech] != null ? rec[tech] : 0
          }),
          color: colorMap[tech],
          index: idx, 
          legendIndex: idx 
        }))

        setOptions({
          chart: { type: 'area', height: 400, backgroundColor: '#262626' },
          title: { text: 'Generación Diaria por Tecnología' },
          subtitle: { text: 'Fuente: API 6G Proyecto' },
          xAxis: {
            categories,
            tickInterval: tickInt,
            title: {
              text: 'Fecha',
              style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif', fontSize: '12px' }
            },
            labels: {
              rotation: -45,
              style: { color: '#CCC', fontFamily: 'Nunito Sans, sans-serif', fontSize: '12px' }
            },
          },
          yAxis: {
            title: {
              text: 'Generación (MW)',
              style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' }
            },
            labels: {
              style: { color: '#CCC', fontFamily: 'Nunito Sans, sans-serif', fontSize: '12px' }
            },
            min: 0,
            gridLineColor: '#333'
          },
          plotOptions: {
            area: {
              stacking: 'normal',
              marker: { enabled: false }
            }
          },
          series,
          exporting: {
            enabled: true,
            buttons: {
              contextButton: {
                menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
              }
            }
          }
        })
      })
      .catch(err => {
        console.error('Error al cargar datos:', err)
        setError('No se pudo cargar la gráfica de generación diaria')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center h-[450px]">
        <div className="flex space-x-2">
          <div
            className="w-3 h-3 rounded-full animate-bounce"
            style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }}
          ></div>
          <div
            className="w-3 h-3 rounded-full animate-bounce"
            style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-3 h-3 rounded-full animate-bounce"
            style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }}
          ></div>
        </div>
        <p className="text-gray-300 mt-4">Cargando gráfica de generación Diaria por Tecnología...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center h-[450px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#FFC800] hover:bg-[#FFD700] rounded text-[#262626] font-medium"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <section className="mt-8">
      <div className="w-full bg-[#262626] p-4 rounded border border-[#666666] shadow relative">
        <button
          className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
          style={{ width: 30, height: 30 }}
          title="Ayuda"
          onClick={() => alert('Ok puedes mostrar ayuda contextual o abrir un modal.')}
          type="button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="rounded-full"
          >
            <circle cx="12" cy="12" r="10" fill="#444" stroke="#fff" strokeWidth="2.5" />
            <text
              x="12"
              y="18"
              textAnchor="middle"
              fontSize="16"
              fill="#fff"
              fontWeight="bold"
              fontFamily="Nunito Sans, sans-serif"
              pointerEvents="none"
            >?</text>
          </svg>
        </button>

        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
        />
      </div>
    </section>
  )
}

export default GeneracionDespacho