// src/components/MapaDistribucionDepartamental.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import Card from './ui/Card';
import tokens from '../styles/theme.js';

const DEFAULT_MAP_URL =
  'https://sig.upme.gov.co/portal/apps/experiencebuilder/experience/?id=fe0521ec930e476da9ec155edcbb7cd4';

export default function MapaDistribucionDepartamental({
  title = 'Distribución departamental por tipo de proyecto',
  source = 'Minenergía – OAAS',
  lastUpdate = '9/2025',
  height = 700,
  mapUrl, // opcional: si lo pasas, tiene prioridad sobre el .env
  timeoutMs = 3500, // tiempo para activar fallback si el embed falla
}) {
  const resolvedUrl = useMemo(
    () => mapUrl || import.meta.env.VITE_UPME_MAP_URL || DEFAULT_MAP_URL,
    [mapUrl]
  );

  const containerRef = useRef(null);
  const frameRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [fallback, setFallback] = useState(false);
  const [visible, setVisible] = useState(false);
  const [retryKey, setRetryKey] = useState(0); // para re-montar el iframe al reintentar

  // Lazy-load: solo cargamos el iframe cuando el contenedor entra al viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { root: null, threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Fallback si el host bloquea X-Frame-Options/CSP (no hay onerror en iframe)
  useEffect(() => {
    if (!isLoading) return;
    const t = setTimeout(() => {
      if (isLoading) setFallback(true);
    }, timeoutMs);
    return () => clearTimeout(t);
  }, [isLoading, timeoutMs, retryKey]);

  // Reintentar: resetea estados y fuerza remount del iframe
  const handleRetry = () => {
    setIsLoading(true);
    setFallback(false);
    setRetryKey((k) => k + 1);
  };

  return (
    <div className="px-2 mt-6">
      <Card className="p-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-text-primary text-[18px] font-semibold">{title}</h3>
          <p className="text-text-muted text-[12px] mt-1">
            Fuente: {source} / Actualizado el: {lastUpdate}
          </p>
        </div>

        {/* Contenedor del mapa */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-xl border"
          style={{
            height,
            borderColor: tokens.colors.border.subtle,
            background: tokens.colors.surface.secondary,
          }}
        >
          {/* Loader overlay */}
          {isLoading && !fallback && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[rgba(31,31,31,0.92)] backdrop-blur-sm">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tokens.colors.accent.primary }} />
                <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: tokens.colors.accent.primary, animationDelay: '0.15s' }} />
                <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: tokens.colors.accent.primary, animationDelay: '0.3s' }} />
              </div>
              <p className="mt-3 text-sm text-text-secondary">Cargando mapa…</p>
            </div>
          )}

          {/* Fallback si el sitio no permite ser embebido */}
          {fallback && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1f1f1f] px-4 text-center">
              <p className="text-text-secondary text-sm mb-4">
                No fue posible embeber el mapa por políticas del sitio.
              </p>
              <div className="flex gap-3 flex-wrap justify-center">
                <a
                  href={resolvedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-md bg-[color:var(--accent-primary)] text-black hover:opacity-90 transition-colors"
                >
                  Abrir el mapa
                </a>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-4 py-2 rounded-md bg-[#333] text-white hover:bg-[#4B5563] transition-colors"
                >
                  Reintentar aquí
                </button>
              </div>
            </div>
          )}

          {/* iFrame del mapa (solo cuando es visible para lazy-load) */}
          {visible && (
            <iframe
              key={retryKey}
              ref={frameRef}
              title="Mapa UPME - Distribución por tipo de proyecto"
              src={resolvedUrl}
              className="w-full h-full"
              style={{ border: 0 }}
              loading="lazy"
              onLoad={() => setIsLoading(false)}
              allowFullScreen
              // Ajusta sandbox según tus necesidades. Si el host lo requiere, puede que debas reducir permisos.
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-downloads"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>

        {/* Pie con acciones */}
        <div className="mt-3 flex items-center justify-end">
          <a
            href={resolvedUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[12px] text-text-muted hover:text-text-primary transition-colors"
          >
            Abrir en pestaña nueva
          </a>
        </div>
      </Card>
    </div>
  );
}
