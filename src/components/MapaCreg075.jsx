// src/components/MapaCreg075.jsx
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const colores = {
  'Biomasa y residuos': '#1f77b4',
  'Eólica': '#2ca02c',
  'Hidroelectrica': '#9467bd',
  'Otro': '#e377c2',
  'Solar FV': '#bcbd22',
  'Térmica': '#17becf',
};

export function MapaCreg075() {
  const mapRef = useRef(null);
  const layerGroupRef = useRef(null);
  const [geoData, setGeoData] = useState([]);
  const [filtros, setFiltros] = useState(Object.keys(colores));

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map').setView([6.5, -74.5], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      mapRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }
  }, []);

  useEffect(() => {
    fetch('../../src/assets/CREG075.geojson')
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data.features);
      });
  }, []);

  useEffect(() => {
    if (!layerGroupRef.current) return;
    layerGroupRef.current.clearLayers();

    geoData.forEach((feature) => {
      const props = feature.properties;
      const tipo = props.tecnologia || 'Otro';
      if (!filtros.includes(tipo)) return;

      const capacidad = parseFloat(props.capacidad_transporte_mw);
      const color = colores[tipo] || '#666';
      const radio = capacidad && capacidad > 0 ? Math.sqrt(capacidad) * 1.2 : 4;

      L.circleMarker([
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
      ], {
        radius: radio,
        fillColor: color,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.75,
      })
        .bindPopup(
          Object.entries(props)
            .map(([k, v]) => `<b>${k}</b>: ${v}`)
            .join('<br>')
        )
        .addTo(layerGroupRef.current);
    });
  }, [geoData, filtros]);

  const handleFiltroChange = (tecnologia) => {
    setFiltros((prev) =>
      prev.includes(tecnologia)
        ? prev.filter((t) => t !== tecnologia)
        : [...prev, tecnologia]
    );
  };

  return (
    <div className="mt-6 relative text-white font-sans">
      {/* Título agregado */}
    <h2 className="text-2xl font-semibold mb-4 text-white text-center" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
      Mapa Creg 075
    </h2>

      <div id="map" style={{ height: '80vh', borderRadius: 8 }}></div>

      <div className="legend" style={{
        position: 'absolute',
        top: 60,
        left: 10,
        background: 'white',
        padding: 10,
        fontSize: 12,
        lineHeight: '1.5em',
        borderRadius: 5,
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        zIndex: 1000,
        maxWidth: 220,
        color: 'black',
      }}>
        <strong>Color por tecnología</strong><br />
        {Object.entries(colores).map(([tipo, color]) => (
          <div key={tipo}>
            <span
              className="legend-color"
              style={{
                background: color,
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: '50%',
                marginRight: 5,
              }}
            ></span>
            {tipo}
          </div>
        ))}
        <br /><strong>Filtrar por tecnología</strong><br />
        {Object.keys(colores).map((tipo) => (
          <label key={tipo}>
            <input
              type="checkbox"
              checked={filtros.includes(tipo)}
              onChange={() => handleFiltroChange(tipo)}
            /> {tipo}
          </label>
        ))}

        <br /><br /><strong>Tamaño por capacidad (MW)</strong><br />
        <div><span style={{ background: '#ccc', width: 6, height: 6, borderRadius: '50%', display: 'inline-block', marginRight: 5 }}></span> ~ 1 MW</div>
        <div><span style={{ background: '#ccc', width: 12, height: 12, borderRadius: '50%', display: 'inline-block', marginRight: 5 }}></span> ~ 10 MW</div>
        <div><span style={{ background: '#ccc', width: 24, height: 24, borderRadius: '50%', display: 'inline-block', marginRight: 5 }}></span> ~ 100 MW</div>
      </div>
    </div>
  );
}
