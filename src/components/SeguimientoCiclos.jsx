// SeguimientoCiclos.jsx
import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import Accessibility from 'highcharts/modules/accessibility';

// Carga de módulos de Highcharts
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);
Accessibility(Highcharts);

// Tema global: fondo oscuro, fuente Nunito Sans, y deshabilita warning de accesibilidad
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' }
  },
  title: { style: { color: '#fff' } },
  subtitle: { style: { color: '#aaa' } },
  legend: {
    itemStyle: { color: '#ccc' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#1f2937',
    style: { color: '#fff' }
  },
  accessibility: {
    enabled: false
  }
});

/**
 * Hook para cargar y renderizar un Highcharts exportado en HTML.
 */
const useLoadChart = (url, containerId) => {
  useEffect(() => {
    let chart;

    (async () => {
      try {
        // ① Fuerza no usar caché
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok && res.status !== 304) {
          console.warn(`No se pudo cargar ${url}: ${res.status}`);
          return;
        }

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const inlineScripts = Array.from(doc.querySelectorAll('script'))
                                  .filter(s => !s.src);
        if (!inlineScripts.length) {
          console.warn(`No hay scripts inline en ${url}`);
          return;
        }

        let code = inlineScripts.map(s => s.textContent).join('\n');
        code = code.replace(/^\s*import[\s\S]*?;$/gm, '');
        code = code.replace(
          /Highcharts\.chart\s*\(\s*['"][^'"]+['"]\s*,/,
          `Highcharts.chart('${containerId}',`
        );

        // Ejecuta el JS con new Function
        chart = new Function('Highcharts', code)(Highcharts);

      } catch (err) {
        console.error(`Error cargando gráfico ${url}:`, err);
      }
    })();

    return () => {
      if (chart && chart.destroy) chart.destroy();
    };
  }, [url, containerId]);
};

export function GraficaCiclo1() {
  useLoadChart('/assets/CapacidadDeptoCiclo1.html', 'ciclo1CantidadDepartamentos');
  useLoadChart('/assets/CapacidadEstadoCiclo1.html', 'ciclo1CantidadEstado');
  useLoadChart('/assets/ProyectosDeptoCiclo1.html', 'ciclo1CapacidadDepartamentos');
  useLoadChart('/assets/ProyectosEstadoCiclo1.html', 'ciclo1CapacidadEstado');

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div id="ciclo1CantidadDepartamentos" className="bg-[#262626] border border-[#666666] h-[500px]" />
      <div id="ciclo1CantidadEstado"         className="bg-[#262626] border border-[#666666] h-[500px]" />
      <div id="ciclo1CapacidadDepartamentos" className="bg-[#262626] border border-[#666666] h-[500px]" />
      <div id="ciclo1CapacidadEstado"        className="bg-[#262626] border border-[#666666] h-[500px]" />
    </div>
  );
}

export function GraficaCiclo2() {
  useLoadChart('/assets/CapacidadDeptoCiclo2.html',     'ciclo2CantidadDepartamentos');
  useLoadChart('/assets/CapacidadEstadoCiclo2.html',    'ciclo2CantidadEstado');
  useLoadChart('/assets/DistribucionDeptosCiclo2.html', 'ciclo2CapacidadDepartamentos');
  useLoadChart('/assets/ProyectosEstadoCiclo2.html',    'ciclo2CapacidadEstado');

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div id="ciclo2CantidadDepartamentos"     className="bg-[#262626] border border-[#666666] h-[500px]" />
      <div id="ciclo2CantidadEstado"            className="bg-[#262626] border border-[#666666] h-[500px]" />
      <div id="ciclo2CapacidadDepartamentos"    className="bg-[#262626] border border-[#666666] h-[500px]" />
      <div id="ciclo2CapacidadEstado"           className="bg-[#262626] border border-[#666666] h-[500px]" />
    </div>
  );
}

export default function SeguimientoCiclos() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [ciclo, setCiclo] = useState(null);

  return (
    <div className="p-4 font-sans" style={{ background: '#262626', fontFamily: 'Nunito Sans, sans-serif' }}>
      <button
        className="px-4 py-2 border border-[#666666] text-gray-200 bg-[#262626] rounded"
        onClick={() => setMenuVisible(v => !v)}
      >
        Seguimiento de Ciclos
      </button>

      {menuVisible && (
        <div className="mt-2 flex gap-2">
          <button
            className={`px-3 py-1 border border-[#666666] rounded ${
              ciclo === 1 ? 'bg-gray-700 text-white' : 'bg-[#262626] text-gray-200'
            }`}
            onClick={() => setCiclo(1)}
          >
            Ciclo 1
          </button>
          <button
            className={`px-3 py-1 border border-[#666666] rounded ${
              ciclo === 2 ? 'bg-gray-700 text-white' : 'bg-[#262626] text-gray-200'
            }`}
            onClick={() => setCiclo(2)}
          >
            Ciclo 2
          </button>
        </div>
      )}

      <div className="mt-4">
        {ciclo === 1 && <GraficaCiclo1 />}
        {ciclo === 2 && <GraficaCiclo2 />}
      </div>
    </div>
  );
}


