// src/components/MapaDistribucionDepartamental.jsx
import { useEffect, useRef, useState } from 'react';

const MAP_URL =
  'https://sig.upme.gov.co/portal/apps/experiencebuilder/experience/?id=fe0521ec930e476da9ec155edcbb7cd4';

export default function MapaDistribucionDepartamental({
  title = 'Distribución departamental por tipo de proyecto',
  source = 'Minenergía – OAAS',
  lastUpdate = '9/2025',
  height = 700, // ajusta a tu layout
}) {
  const frameRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fallback, setFallback] = useState(false);

  // Si el embed es bloqueado por X-Frame-Options / CSP, mostramos fallback tras un tiempo
  useEffect(() => {
    const t = setTimeout(() => {
      if (isLoading) setFallback(true);
    }, 3500);
    return () => clearTimeout(t);
  }, [isLoading]);

  return (
    <div className="px-2 mt-6">
      <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 shadow">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-white text-[18px] font-semibold">{title}</h3>
          <p className="text-[#9CA3AF] text-[12px] mt-1">
            Fuente: {source} / Actualizado el: {lastUpdate}
          </p>
        </div>

        {/* Contenedor del mapa */}
        <div
          className="relative overflow-hidden rounded-xl border border-[#3a3a3a]"
          style={{ height }}
        >
          {/* Loader overlay */}
          {isLoading && !fallback && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1f1f1fea] backdrop-blur-sm">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#FFC800] animate-bounce" />
                <div className="w-3 h-3 rounded-full bg-[#FFC800] animate-bounce delay-150" />
                <div className="w-3 h-3 rounded-full bg-[#FFC800] animate-bounce delay-300" />
              </div>
              <p className="mt-3 text-sm text-gray-300">Cargando mapa…</p>
            </div>
          )}

          {/* Fallback si el sitio no permite ser embebido */}
          {fallback ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1f1f1f]">
              <p className="text-gray-300 text-sm mb-4 px-4 text-center">
                No fue posible embeber el mapa por políticas del sitio. Puedes abrirlo en una nueva pestaña.
              </p>
              <a
                href={MAP_URL}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-md bg-[#333] text-white hover:bg-[#4B5563] transition-colors"
              >
                Abrir el mapa
              </a>
            </div>
          ) : null}

          {/* iFrame del mapa */}
          <iframe
            ref={frameRef}
            title="Mapa UPME - Distribución por tipo de proyecto"
            src={MAP_URL}
            className="w-full h-full"
            style={{ border: '0' }}
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            // sandbox suaviza CSP en algunos entornos; ajusta si tu app lo requiere
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-downloads"
          />
        </div>

        {/* Pie opcional con acción */}
        <div className="mt-3 flex items-center justify-end">
          <a
            href={MAP_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[12px] text-[#9CA3AF] hover:text-white transition-colors"
          >
            Abrir en pestaña nueva
          </a>
        </div>
      </div>
    </div>
  );
}
