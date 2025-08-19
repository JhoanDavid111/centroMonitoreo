import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import regionesHidro from '../assets/geojson/RegionesHidro.geojson?url'
import embalsesHidro from '../assets/geojson/EmbalsesJson.geojson?url'

export default function MapaHidrologia() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapRef.current._leaflet_id) {
      // === Config ===
      const REGIONES_URL = regionesHidro;
      const EMBALSES_URL = embalsesHidro;
      const NOMBRE_KEY = "Nombre_del_embalse";
      const VU_MM3_KEY = "Volumen_útil___Mm3_";
      const VU_GWH_KEY = "Volumen_útil___GWh_";
      const REGION_NAME_CANDIDATES = [
        "Región__hidrológica",
        "region",
        "Region",
        "REGION",
        "nombre",
        "Nombre",
        "NOMBRE",
        "name",
        "Name",
      ];

      const regionPalette = [
        "#22c55e",
        "#f59e0b",
        "#3b82f6",
        "#8b5cf6",
        "#ef4444",
        "#14b8a6",
        "#eab308",
        "#06b6d4",
        "#84cc16",
        "#f97316",
      ];
      function hashColor(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
          h = Math.imul(31, h) + str.charCodeAt(i) | 0;
        }
        const idx = Math.abs(h) % regionPalette.length;
        return regionPalette[idx];
      }

      function findRegionName(props) {
        for (const k of REGION_NAME_CANDIDATES) {
          if (Object.prototype.hasOwnProperty.call(props, k) && props[k])
            return String(props[k]);
        }
        for (const k in props) {
          if (typeof props[k] === "string" && props[k]) return String(props[k]);
        }
        return "Región";
      }
      function findRegionNameFromEmbalse(props) {
        for (const k of REGION_NAME_CANDIDATES) {
          if (Object.prototype.hasOwnProperty.call(props, k) && props[k])
            return String(props[k]);
        }
        return null;
      }
      function fmtNum(val, suf) {
        const n = Number(val);
        return Number.isFinite(n)
          ? n.toLocaleString("es-CO", { maximumFractionDigits: 2 }) +
              (suf ? " " + suf : "")
          : "N/D";
      }
      function embalsePopup(props) {
        const nombre = props[NOMBRE_KEY] ?? "Sin nombre";
        const vmm3 = fmtNum(props[VU_MM3_KEY], "Mm³");
        const vgwh = fmtNum(props[VU_GWH_KEY], "GWh");

        // * Wrapper style in index.css
        // * Modify index.css to change styles of the popup container.

        return `
          <article class="popup-card *:text-white">
            <div class="popup-card__body">
              <h3 class="popup-card__title">${nombre}</h3>
              <div class="kpis">
                <div class="kpi">
                  <span class="kpi__label">Volumen útil (Mm³)</span>
                  <span class="kpi__val">${vmm3}</span>
                </div>
                <div class="kpi">
                  <span class="kpi__label">Volumen útil (GWh)</span>
                  <span class="kpi__val">${vgwh}</span>
                </div>
              </div>
            </div>
          </article>
        `;
      }

      // === Inicializar mapa ===
      const map = L.map(mapRef.current, { closePopupOnClick: false }).setView(
        [4.6, -74.1],
        6
      );
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "&copy; OpenStreetMap & CARTO",
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // Capas
      const regionesLayer = L.geoJSON(null, {
        style: (feature) => {
          const name = findRegionName(feature.properties || {});
          const color = hashColor(name);
          return {
            color,
            weight: 1.4,
            fillColor: color,
            fillOpacity: 0.25,
          };
        },
      }).addTo(map);
      regionesLayer.once("add", () => regionesLayer.bringToBack());

      const embalsesLayer = L.geoJSON(null, {
        pointToLayer: (feature, latlng) =>
          L.circleMarker(latlng, {
            radius: 6,
            color: "#60a5fa",
            weight: 1.4,
            fillColor: "#3b82f6",
            fillOpacity: 0.9,
          }),
        onEachFeature: (feature, layer) => {
          layer.bindPopup(embalsePopup(feature.properties || {}), {
            className: "popup-theme",
            maxWidth: 320,
            autoPan: true,
            autoClose: false,
            closeButton: true,
          });
        },
      }).addTo(map);

      // === Cargar datos ===
      Promise.all([
        fetch(REGIONES_URL).then((r) => r.json()),
        fetch(EMBALSES_URL).then((r) => r.json()),
      ])
        .then(([regiones, embalses]) => {
          regionesLayer.addData(regiones);
          embalsesLayer.addData(embalses);

          const group = L.featureGroup([regionesLayer, embalsesLayer]);
          const b = group.getBounds();
          if (b.isValid()) map.fitBounds(b.pad(0.08));
        })
        .catch((err) => console.error("Error al cargar datos:", err));
    }
  }, []);

  return <div id="map" ref={mapRef} style={{ height: "80vh", width: "100%", zIndex:'1' }} />;
}
