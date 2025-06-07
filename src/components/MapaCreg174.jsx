// src/componentes/MapaCreg174.jsx
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const colores = {
  "Ciclo combinado": "#1f77b4",
  "Filo de Agua": "#2ca02c",
  "Fotovoltaico": "#9467bd",
  "Otro": "#e377c2",
  "Solar": "#bcbd22",
  "Térmico": "#17becf",
};

export function MapaCreg174 () {
  const mapRef = useRef(null);
  const layerGroupRef = useRef(null);
  const [geoData, setGeoData] = useState([]);
  const [filtros, setFiltros] = useState(
    Object.keys(colores).reduce((acc, tech) => ({ ...acc, [tech]: true }), {})
  );

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map2").setView([6.5, -74.5], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
      layerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }

    fetch("../../src/assets/CREG174_reproyectado_OK.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data.features);
      });
  }, []);

  useEffect(() => {
    if (!layerGroupRef.current || !geoData.length) return;
    layerGroupRef.current.clearLayers();

    geoData.forEach((feature) => {
      const props = feature.properties;
      const tipo = props.tipo_tecnologia || "Otro";
      if (!filtros[tipo]) return;

      const capacidad = parseFloat(props.capacidad_kw);
      const color = colores[tipo] || "#888";
      const radio = capacidad > 0 ? Math.sqrt(capacidad) * 0.5 : 4;

      L.circleMarker(
        [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
        {
          radius: radio,
          fillColor: color,
          color: "#000",
          weight: 1,
          opacity: 1,
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
  }, [filtros, geoData]);

  const handleCheckboxChange = (tipo) => {
    setFiltros((prev) => ({ ...prev, [tipo]: !prev[tipo] }));
  };

  return (
    <div style={{ position: 'relative' }}>
      <div id="map2" style={{ height: "80vh" }}></div>
      <div className="legend" style={{
        position: 'absolute',
        top: 10,
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
        <div>
          <strong>Colores por tipo de tecnología</strong>
          {Object.keys(colores).map((tipo) => (
            <div key={tipo}>
              <span
                className="legend-color"
                style={{
                    
                  background: colores[tipo],
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  marginRight: 5,
                }}
              ></span>
              {tipo}
            </div>
          ))}
        </div>

        <br />
        <div>
          <strong>Filtrar por tecnología</strong>
          {Object.keys(colores).map((tipo) => (
            <div key={tipo}>
              <label>
                <input
                  type="checkbox"
                  checked={filtros[tipo]}
                  onChange={() => handleCheckboxChange(tipo)}
                />{" "}
                {tipo}
              </label>
            </div>
          ))}
        </div>

        <br />
        <div>
          <strong>Tamaños por capacidad (kW)</strong>
          <div>
            <span style={{ width: 5, height: 5, background: "#ccc", display: "inline-block", borderRadius: "50%", marginRight: 5 }}></span> ~ 1 kW
          </div>
          <div>
            <span style={{ width: 10, height: 10, background: "#ccc", display: "inline-block", borderRadius: "50%", marginRight: 5 }}></span> ~ 10 kW
          </div>
          <div>
            <span style={{ width: 20, height: 20, background: "#ccc", display: "inline-block", borderRadius: "50%", marginRight: 5 }}></span> ~ 100 kW
          </div>
          <div>
            <span style={{ width: 30, height: 30, background: "#ccc", display: "inline-block", borderRadius: "50%", marginRight: 5 }}></span> ~ 200+ kW
          </div>
        </div>
      </div>
    </div>
  );
};
