// src/components/Carousel.jsx
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Carousel = ({ images = [], interval = 5000, height = "h-56" }) => {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(true);// Pausa el carrusel al iniciar se coloca true para que no inicie automaticamente 

  const prev = () =>
    setSlide((s) => (s - 1 + images.length) % images.length);

  const next = () =>
    setSlide((s) => (s + 1) % images.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [paused, images.length, interval]);

  if (images.length === 0) return null;

  return (
    <div
      className={`relative bg-surface-primary border border-[color:var(--border-subtle)] rounded-xl p-0 overflow-hidden`}
    >
      {/* Imagen activa */}
      <img
        src={images[slide]}
        alt={`Slide ${slide + 1}`}
        className={`w-full ${height} object-cover rounded-lg transition-all duration-700`}
      />

      {/* Botón anterior */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center"
        aria-label="Anterior"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Botón siguiente */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center"
        aria-label="Siguiente"
      >
        <ChevronRight size={18} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === slide ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
