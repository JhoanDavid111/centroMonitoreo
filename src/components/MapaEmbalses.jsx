// src/components/MapaEmbalses.jsx
import React, { useEffect, useState, useRef } from 'react';
// Importamos el contenido HTML en crudo (Vite: ?raw, CRA: raw-loader)
import defaultHtml from './default.html?raw';

export function MapaEmbalses() {
  const embalses = [
    { region: "Antioquia", porcentaje: 28.33 },
    { region: "Caldas", porcentaje: 27.15 },
    { region: "Caribe", porcentaje: 25.02 },
    { region: "Centro", porcentaje: 32.88 },
    { region: "Oriente", porcentaje: 30.10 },
    { region: "Valle", porcentaje: 29.45 },
  ];

  const [svgContent, setSvgContent] = useState('');
  const [zoom, setZoom] = useState(1);
  const [selectedDept, setSelectedDept] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(defaultHtml, 'text/html');
    const svg = doc.querySelector('#svg1074');
    if (svg) {
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('stroke', '#888');
      svg.setAttribute('stroke-width', '0.5');
    }
    setSvgContent(svg ? svg.outerHTML : '');
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const svgEl = mapRef.current.querySelector('svg');
    if (!svgEl) return;

    svgEl.style.cursor = 'pointer';
    const paths = svgEl.querySelectorAll('path');
    paths.forEach(path => {
      const originalFill = path.getAttribute('fill') || '#ffffff';
      path.dataset.originalFill = originalFill;
      path.addEventListener('mouseenter', () => path.setAttribute('fill', '#FFCC00'));
      path.addEventListener('mouseleave', () => path.setAttribute('fill', path.dataset.originalFill));
      path.addEventListener('click', () => {
        const name = path.getAttribute('name') || path.id;
        const dept = embalses.find(e => e.region === name);
        setSelectedDept({ name, porcentaje: dept ? dept.porcentaje : 50.00 });
      });
    });

    return () => {
      paths.forEach(path => path.replaceWith(path.cloneNode(true)));
    };
  }, [svgContent]);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 5));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));

  return (
    <section className="mt-8 grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Mapa */}
      <div className="map-container xl:col-span-3 bg-[#262626] rounded border border-gray-700 shadow overflow-hidden h-[650px] p-2 relative">
        {/* Controles de zoom */}
        <div className="absolute top-2 right-2 z-10 flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="bg-white text-gray-800 font-bold rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200"
            aria-label="Zoom in"
          >+</button>
          <button
            onClick={handleZoomOut}
            className="bg-white text-gray-800 font-bold rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200"
            aria-label="Zoom out"
          >−</button>
        </div>

        {/* Modal de detalles */}
        {selectedDept && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-[#262626] p-6 rounded-lg border border-gray-700 max-w-md w-full">
              <h2 className="text-lg font-bold text-yellow-400 mb-4">
                DEPARTAMENTO DE {selectedDept.name.toUpperCase()}: {selectedDept.porcentaje.toFixed(2)}%
              </h2>
              <div className="divide-y divide-gray-600">
                <div className="py-2 flex justify-between">
                  <span>Volumen útil diario:</span>
                  <span>{selectedDept.porcentaje.toFixed(2)}%</span>
                </div>
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setSelectedDept(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          id="map"
          ref={mapRef}
          className="w-full h-full overflow-hidden flex items-center justify-center"
        >
          <div
            className="w-full h-full fill-current text-white"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="flex flex-col gap-4">
        <div className="bg-[#262626] p-4 rounded border border-gray-700">
          <h3 className="text-sm text-gray-400">Total nacional</h3>
          <p className="text-2xl font-bold text-white">30,02%</p>
          <span className="text-xs text-gray-400">
            Actualizado el: 8/5/2025 – Volumen útil diario %
          </span>
        </div>

        {embalses.map((e, i) => (
          <div
            key={i}
            className="bg-[#262626] p-3 rounded border border-gray-700 text-white flex justify-between items-center"
          >
            <span className="text-sm">{e.region}:</span>
            <span className="font-semibold">{e.porcentaje.toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}



