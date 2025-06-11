// src/components/MapaCreg075.jsx
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import creg075url from '../assets/CREG075.geojson?url'

// Fix para íconos en React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const colores = {
  'Biomasa y residuos': '#1f77b4',
  'Eólica': '#2ca02c',
  'Hidroelectrica': '#9467bd',
  'Otro': '#e377c2',
  'Solar FV': '#bcbd22',
  'Térmica': '#17becf',
}

export function MapaCreg075() {
  const mapRef = useRef(null)
  const layerGroupRef = useRef(null)
  const [geoData, setGeoData] = useState([])
  const [filtros, setFiltros] = useState(Object.keys(colores))

  // Inicializar Leaflet
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map', { zoomControl: true }).setView([6.5, -74.5], 6)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map)
      mapRef.current = map
      layerGroupRef.current = L.layerGroup().addTo(map)
    }
  }, [])

  // Cargar GeoJSON
  useEffect(() => {
    fetch(creg075url)
      .then(res => res.json())
      .then(data => setGeoData(data.features))
  }, [])

  // Dibujar círculos
  useEffect(() => {
    if (!layerGroupRef.current) return
    layerGroupRef.current.clearLayers()

    geoData.forEach(feature => {
      const props = feature.properties
      const tipo = props.tecnologia || 'Otro'
      if (!filtros.includes(tipo)) return

      const capacidad = parseFloat(props.capacidad_transporte_mw)
      const color = colores[tipo] || '#666'
      const radio = capacidad > 0 ? Math.sqrt(capacidad) * 1.2 : 4

      L.circleMarker(
        [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
        {
          radius: radio,
          fillColor: color,
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.75,
        }
      )
        .bindPopup(
          Object.entries(props)
            .map(([k, v]) => `<b>${k}</b>: ${v}`)
            .join('<br>')
        )
        .addTo(layerGroupRef.current)
    })
  }, [geoData, filtros])

  const handleFiltroChange = tecnologia => {
    setFiltros(prev =>
      prev.includes(tecnologia)
        ? prev.filter(t => t !== tecnologia)
        : [...prev, tecnologia]
    )
  }

  return (
    <div className="mt-20 relative text-white font-sans">
      {/* Título */}
      <h2
        className="text-2xl font-semibold mb-4 text-center"
        style={{ fontFamily: 'Nunito Sans, sans-serif' }}
      >
        Asignaciones de puntos de conexión – CREG 075
      </h2>

      {/* Mapa */}
      <div
        id="map"
        style={{
          height: '80vh',
          borderRadius: 8,
          zIndex: 10,
        }}
      ></div>

      {/* Tarjeta de filtros (compacta) */}
      <div
        className="absolute top-32 left-4 bg-[#262626] bg-opacity-90 p-3 rounded-lg shadow-lg text-xs"
        style={{ width: '12rem', zIndex: 20 }}
      >
        <strong className="block mb-1">Color por tecnología</strong>
        {Object.entries(colores).map(([tipo, color]) => (
          <div key={tipo} className="flex items-center mb-1">
            <span
              style={{
                backgroundColor: color,
                width: 10,
                height:10,
                borderRadius: '50%',
                display: 'inline-block',
                marginRight: 6,
              }}
            />
            {tipo}
          </div>
        ))}

        <hr className="my-2 border-gray-300" />

        <strong className="block mb-1">Filtrar por tecnología</strong>
        {Object.keys(colores).map(tipo => (
          <label key={tipo} className="flex items-center mb-1">
            <input
              type="checkbox"
              className="mr-2"
              checked={filtros.includes(tipo)}
              onChange={() => handleFiltroChange(tipo)}
            />
            {tipo}
          </label>
        ))}

        <hr className="my-2 border-gray-300" />

        <strong className="block mb-1">Tamaño por capacidad</strong>
        <div className="flex items-center mb-1">
          <span className="inline-block bg-gray-400 mr-2 rounded-full w-2 h-2" />
          ~ 1 MW
        </div>
        <div className="flex items-center mb-1">
          <span className="inline-block bg-gray-400 mr-2 rounded-full w-3 h-3" />
          ~ 10 MW
        </div>
        <div className="flex items-center">
          <span className="inline-block bg-gray-400 mr-2 rounded-full w-5 h-5" />
          ~ 100 MW
        </div>
      </div>
    </div>
  )
}


