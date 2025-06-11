// src/components/MapaCreg174.jsx
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon   from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import creg174url from '../assets/CREG174_reproyectado_OK.geojson?url'

// Fix para íconos en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl:       markerIcon,
  shadowUrl:     markerShadow,
});

const colores = {
  "Ciclo combinado": "#1f77b4",
  "Filo de Agua":    "#2ca02c",
  "Fotovoltaico":     "#9467bd",
  "Otro":             "#e377c2",
  "Solar":            "#bcbd22",
  "Térmico":          "#17becf",
};

export function MapaCreg174() {
  const mapRef        = useRef(null);
  const layerGroupRef = useRef(null);
  const [geoData, setGeoData]     = useState([]);
  const [filtros, setFiltros]     = useState(
    Object.keys(colores).reduce((acc, tech) => ({ ...acc, [tech]: true }), {})
  );

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map2").setView([6.5, -74.5], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
      layerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }
    // Cargar GeoJSON
    fetch(creg174url)
      .then(res => res.json())
      .then(data => setGeoData(data.features))
      .catch(console.error);
  }, []);

  // Dibujar puntos
  useEffect(() => {
    if (!layerGroupRef.current) return;
    layerGroupRef.current.clearLayers();

    geoData.forEach(feature => {
      const props = feature.properties;
      const tipo  = props.tipo_tecnologia || "Otro";
      if (!filtros[tipo]) return;

      const capacidad = parseFloat(props.capacidad_kw);
      const color     = colores[tipo] || "#888";
      const radio     = capacidad > 0 ? Math.sqrt(capacidad) * 0.5 : 4;

      L.circleMarker(
        [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
        {
          radius:      radio,
          fillColor:   color,
          color:       "#000",
          weight:      1,
          opacity:     1,
          fillOpacity: 0.75,
        }
      )
        .bindPopup(
          Object.entries(props)
            .map(([k, v]) => `<b>${k}</b>: ${v}`)
            .join("<br>")
        )
        .addTo(layerGroupRef.current);
    });
  }, [geoData, filtros]);

  const handleCheckboxChange = tipo => {
    setFiltros(prev => ({ ...prev, [tipo]: !prev[tipo] }));
  };

  return (
    <div className="mt-24 relative text-white font-sans">
      {/* Título */}
      <h2
        className="text-2xl font-semibold mb-4 text-center"
        style={{ fontFamily: 'Nunito Sans, sans-serif' }}
      >
        Proyectos de autogeneración y GD – CREG 174
      </h2>

      {/* Mapa */}
      <div id="map2" style={{ height: "85vh", borderRadius: 8, zIndex: 10 }}></div>

      {/* Tarjeta de filtros (compacta) */}
      <div
        className="absolute top-32 left-4 bg-[#262626] bg-opacity-90 p-3 rounded-lg shadow-lg text-xs"
        style={{ width: '12rem', zIndex: 20 }}
      >
        <strong className="block mb-1">Colores por tecnología</strong>
        {Object.entries(colores).map(([tipo, color]) => (
          <div key={tipo} className="flex items-center mb-1">
            <span
              style={{
                backgroundColor: color,
                width: 10,
                height: 10,
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
              checked={filtros[tipo]}
              onChange={() => handleCheckboxChange(tipo)}
            />
            {tipo}
          </label>
        ))}

        <hr className="my-2 border-gray-300" />

        <strong className="block mb-1">Tamaños por capacidad (kW)</strong>
        <div className="flex items-center mb-1">
          <span className="inline-block bg-gray-400 w-2 h-2 rounded-full mr-2" />
          ~ 1 kW
        </div>
        <div className="flex items-center mb-1">
          <span className="inline-block bg-gray-400 w-3 h-3 rounded-full mr-2" />
          ~ 10 kW
        </div>
        <div className="flex items-center mb-1">
          <span className="inline-block bg-gray-400 w-5 h-5 rounded-full mr-2" />
          ~ 100 kW
        </div>
        <div className="flex items-center">
          <span className="inline-block bg-gray-400 w-7 h-7 rounded-full mr-2" />
          ~ 200+ kW
        </div>
      </div>
    </div>
  );
}

