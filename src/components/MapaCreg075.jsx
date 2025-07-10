import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";
import Select from "react-select";
import creg075url from '../assets/CREG075_2.geojson?url'
import mpio from '../assets/mpio.json'

const colores = {
  "Biomasa y residuos": "#b39fff",
  "Eólica": "#5dff97",
  "Hidroelectrica": "#3b82f6",
  "Otro": "#e377c2",
  "Solar FV": "#ffc800",
  "Térmica": "#f97316",
};

const MapaCreg075 = () => {
  const mapRef = useRef(null);
  const layerProyectosRef = useRef(L.layerGroup());
  const capaMunicipiosRef = useRef(null);
  const capaSeleccionRef = useRef(null);

  const [proyectos, setProyectos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [municipioSel, setMunicipioSel] = useState(null);
  const [tecnologiasSel, setTecnologiasSel] = useState([]);
  const [contador, setContador] = useState(0);
  const [tecnologias, setTecnologias] = useState([]);

  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = L.map("map").setView([5, -74.5], 6);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(mapRef.current);
    layerProyectosRef.current.addTo(mapRef.current);

    fetch(creg075url)
      .then((res) => res.json())
      .then((data) => {
        setProyectos(data.features);
        const techs = [...
          new Set(data.features.map((p) => p.properties.tecnologia || "Otro"))
        ].map((t) => ({ label: t, value: t }));
        setTecnologias(techs);
      });

    fetch(mpio)
      .then((res) => res.json())
      .then((data) => {
        setMunicipios(
          data.features.sort((a, b) =>
            a.properties.NOMBRE_MPI.localeCompare(b.properties.NOMBRE_MPI)
          )
        );
        capaMunicipiosRef.current = L.geoJSON(data, {
          style: { color: "#888", weight: 0.3, fillOpacity: 0.05 },
        }).addTo(mapRef.current);
      });
  }, []);

  useEffect(() => {
    if (!proyectos.length) return;
    let seleccionados = proyectos;

    if (municipioSel && municipios.length) {
      const muni = municipios.find(
        (m) => m.properties.NOMBRE_MPI === municipioSel.value
      );
      if (muni) {
        if (capaSeleccionRef.current) {
          mapRef.current.removeLayer(capaSeleccionRef.current);
        }
        capaSeleccionRef.current = L.geoJSON(muni, {
          style: { color: "#000", weight: 2, fillOpacity: 0.1 },
        }).addTo(mapRef.current);
        mapRef.current.fitBounds(L.geoJSON(muni).getBounds());

        const poligono = turf.feature(muni);
        seleccionados = seleccionados.filter((p) => {
          const punto = turf.point(p.geometry.coordinates);
          return turf.booleanPointInPolygon(punto, poligono);
        });
      }
    }

    if (tecnologiasSel.length) {
      const techs = tecnologiasSel.map((t) => t.value);
      seleccionados = seleccionados.filter((p) =>
        techs.includes(p.properties.tecnologia)
      );
    }

    setContador(seleccionados.length);
    renderMarkers(seleccionados);
  }, [municipioSel, tecnologiasSel, proyectos]);

  const renderMarkers = (features) => {
    layerProyectosRef.current.clearLayers();
    features.forEach((feature) => {
      const props = feature.properties;
      const tipo = props.tecnologia || "Otro";
      const capacidad = parseFloat(props.capacidad_transporte_mw);
      const radio = capacidad > 0 ? Math.sqrt(capacidad) * 0.8 : 4;
      const color = colores[tipo] || "#666";

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
        .addTo(layerProyectosRef.current);
    });
  };

  const resetFiltros = () => {
    setMunicipioSel(null);
    setTecnologiasSel([]);
    if (capaSeleccionRef.current) {
      mapRef.current.removeLayer(capaSeleccionRef.current);
      capaSeleccionRef.current = null;
    }
    mapRef.current.setView([5, -74.5], 6);
    setContador(proyectos.length);
    renderMarkers(proyectos);
  };

  return (
    <div className="relative text-white font-sans">
      <div id="map" style={{ height: "85vh" }}></div>

      <div className="filtros-container" style={filtroStyle}>
        <h4 style={{ margin: "0 0 8px 0" }}>Filtros</h4>
        <button onClick={resetFiltros}>Restablecer filtros</button>
        <Select
          options={municipios.map((m) => ({
            value: m.properties.NOMBRE_MPI,
            label: m.properties.NOMBRE_MPI,
          }))}
          value={municipioSel}
          onChange={setMunicipioSel}
          placeholder="Buscar municipio"
          isClearable
        />
        <Select
          options={tecnologias}
          value={tecnologiasSel}
          onChange={setTecnologiasSel}
          placeholder="Filtrar por tecnología"
          isMulti
          isClearable
        />
        <div style={{ fontWeight: "bold" }}>
          Proyectos encontrados: {contador}
        </div>
      </div>

      <div className="legend" style={legendStyle}>
        <h4>Leyenda</h4>
        <div><strong>Tipo de tecnología</strong></div>
        {Object.entries(colores).map(([key, color]) => (
          <div key={key}>
            <span
              className="legend-color"
              style={{
                background: color,
                display: "inline-block",
                width: 12,
                height: 12,
                borderRadius: "50%",
                marginRight: 5,
              }}
            ></span>
            {key}
          </div>
        ))}
        <br />
        <strong>Tamaños por capacidad (MW)</strong>
        <div><span style={circle(6)}></span> ~ 1 MW</div>
        <div><span style={circle(12)}></span> ~ 10 MW</div>
        <div><span style={circle(24)}></span> ~ 100+ MW</div>
      </div>
    </div>
  );
};

const filtroStyle = {
  position: "absolute",
  top: "410px",
  left: "10px",
  zIndex: 1001,
  background: "rgba(124, 118, 118, 0.9)",
  padding: "10px",
  borderRadius: "6px",
  boxShadow: "0 0 8px rgba(0,0,0,0.3)",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "230px",
  color: "black",
};

const legendStyle = {
  position: "absolute",
  top: "100px",
  left: "10px",
  zIndex: 1000,
  background: "rgba(124, 118, 118, 0.9)",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 0 10px rgba(0,0,0,0.3)",
  fontSize: "12px",
  width: "230px",
  color: "black",
};

const circle = (size) => ({
  background: "#ccc",
  width: size,
  height: size,
  borderRadius: "50%",
  display: "inline-block",
  marginRight: 5,
});

export default MapaCreg075;
