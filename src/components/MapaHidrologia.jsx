import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { CircleMarker, GeoJSON, MapContainer, TileLayer } from "react-leaflet";

import { Dialog, DialogContent, DialogTrigger } from "./ui/Dialog";

import EMBALSES_URL from "../assets/geojson/EmbalsesJson.geojson?url";
import REGIONES_URL from "../assets/geojson/RegionesHidro.geojson?url";

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
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return regionPalette[Math.abs(h) % regionPalette.length];
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

function fmtNum(val, suf) {
  const n = Number(val);
  return Number.isFinite(n)
    ? n.toLocaleString("es-CO", { maximumFractionDigits: 2 }) +
        (suf ? " " + suf : "")
    : "N/D";
}

const RegionDialog = ({ coords, damProperties }) => {
  const [open, setOpen] = useState(false);


  const name = damProperties[NOMBRE_KEY] ?? "Sin Nombre";
  const vmm3 = fmtNum(damProperties[VU_MM3_KEY], "Mm³"); // Volumen
  const vgwh = fmtNum(damProperties[VU_GWH_KEY], "GWh"); // Aportes hídricos
  const region = "Centro"; // Region
  const date = "23/08/2025"; // Fecha
  const damLevel = 90; // %
  const damCapacity = 23;
  const damCapacityGeneration = 15.2;
  const damWaterSupply = 198.2;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <CircleMarker
            center={[coords[1], coords[0]]}
            radius={6}
            pathOptions={{
              color: "#60a5fa",
              weight: 1.4,
              fillColor: "#3b82f6",
              fillOpacity: 0.9,
            }}
            eventHandlers={{
              click: () => {
                setOpen(true)},
            }}
          />
      </DialogTrigger>
      <DialogContent>
      {/* ! Contenido */}
        <div className="p-4 space-y-3">
          <h3 className="text-white text-lg font-bold tracking-wide">{name}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 border border-white/20 rounded-lg p-3">
              <span className="block text-xs text-gray-400">
                Volumen útil (Mm³)
              </span>
              <span className="font-bold text-sm">{vmm3}</span>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-lg p-3">
              <span className="block text-xs text-gray-400">
                Volumen útil (GWh)
              </span>
              <span className="font-bold text-sm">{vgwh}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MapEmbalses() {
  const [regiones, setRegiones] = useState(null);
  // * New state with data API, then search for information in the "regiones" array, if not info set a not found element
  const [embalses, setEmbalses] = useState(null);

  useEffect(() => {
    Promise.all([fetch(REGIONES_URL), fetch(EMBALSES_URL)])
      .then(async ([r1, r2]) => {
        const regionesJson = await r1.json();
        const embalsesJson = await r2.json();
        setRegiones(regionesJson);
        setEmbalses(embalsesJson);
      })
      .catch((err) => console.error("Error cargando GeoJSON:", err));
  }, []);

  return (
    <div className="h-screen w-screen bg-[#0b1220]">
      <MapContainer
        center={[4.6, -74.1]}
        zoom={6}
        className="h-full w-full"
        closePopupOnClick={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        {regiones && (
          <GeoJSON
            data={regiones}
            style={(feature) => {
              const name = findRegionName(feature.properties || {});
              const color = hashColor(name);
              return {
                color,
                weight: 1.4,
                fillColor: color,
                fillOpacity: 0.25,
              };
            }}
          />
        )}

        {embalses &&
          embalses.features.map((f, index) => {
            const coords = f.geometry.coordinates;
            return (
              <RegionDialog
                key={index}
                props={f.properties || {}}
                coords={coords}
                damProperties={f.properties}
                index={index}
              />
            );
          })}
      </MapContainer>
    </div>
  );
}

export default MapEmbalses;
