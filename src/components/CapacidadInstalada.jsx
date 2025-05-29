// src/components/CapacidadInstalada.jsx
import React, { useEffect, useState, useRef } from 'react'
import defaultHtml from './default.html?raw'

export function CapacidadInstalada() {
  const [svgContent, setSvgContent] = useState('')
  const [zoom, setZoom] = useState(1)
  const mapRef = useRef(null)

  // Datos de ejemplo para la tabla
  const tableData = [
    { region: 'La Guajira', capacity: '5 MW', projects: 10 },
    { region: 'Valle del Cauca', capacity: '8 MW', projects: 8 },
    { region: 'Nariño', capacity: '2 MW', projects: 4 },
    { region: 'Cúcuta', capacity: '4 MW', projects: 1 },
    { region: 'Tolima', capacity: '2 MW', projects: 6 },
    { region: 'Córdoba', capacity: '5 MW', projects: 3 }
  ]

  // Carga y prepara el SVG
  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(defaultHtml, 'text/html')
    const svg = doc.querySelector('#svg1074')
    if (svg) {
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
      svg.setAttribute('width', '100%')
      svg.setAttribute('height', '100%')
      svg.setAttribute('stroke', '#888')
      svg.setAttribute('stroke-width', '0.5')
      setSvgContent(svg.outerHTML)
    }
  }, [])

  // Zoom in / out
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 5))
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5))

  return (
    <section className="mt-8 grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* --- Mapa --- */}
      <div className="map-container xl:col-span-3 bg-bg-[#262626] rounded border border-[#666666] shadow overflow-hidden h-[650px] p-2 relative">
        {/* Controles de Zoom */}
        <div className="absolute top-2 right-2 z-10 flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="bg-white text-gray-800 font-bold rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-white text-gray-800 font-bold rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200"
            aria-label="Zoom out"
          >
            &minus;
          </button>
        </div>

        {/* SVG escalable */}
        <div
          id="map"
          ref={mapRef}
          className="w-full h-full flex items-center justify-center"
        >
          <div
            className="w-full h-full"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center'
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      </div>

      {/* --- Tabla de datos --- */}
      <div className="bg-[#262626] rounded border border-[#666666] shadow overflow-auto xl:col-span-1">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm text-[#FFC800]">
                Departamento
              </th>
              <th className="px-4 py-2 text-right text-sm text-[#FFC800]">
                Capacidad instalada
              </th>
              <th className="px-4 py-2 text-right text-sm text-[#FFC800]">
                No. de proyectos
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {tableData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-800">
                <td className="px-4 py-2 text-sm text-white">
                  {row.region}
                </td>
                <td className="px-4 py-2 text-right text-sm text-white">
                  {row.capacity}
                </td>
                <td className="px-4 py-2 text-right text-sm text-white">
                  {row.projects}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}