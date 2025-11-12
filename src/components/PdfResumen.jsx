import React, { forwardRef } from "react";
import "./PdfResumen.css"; // estilos del diseño
import logo from "../assets/Plan6gw+2.svg";

const PdfResumen = forwardRef(({ data }, ref) => {
  return (
    <div ref={ref} className="pdf-container">
      <header className="pdf-header">
        <img src={logo} alt="Plan 6GW+" className="logo" />
        <h1>Reporte Resumen Centro de Monitoreo</h1>
        <p className="fecha">Fecha de impresión: {data.fecha}</p>
      </header>

      <section className="bloque">
        <h2>Capacidad instalada 6GW+ total:</h2>
        <p className="valor">{data.capacidadTotal} MW</p>
        <p className="subtitulo">MW por entrar a Julio de 2026</p>
      </section>

      <section className="bloque tabla">
        <h3>Distribución por tipo de proyecto</h3>
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Capacidad (MW)</th>
              <th>Participación (%)</th>
            </tr>
          </thead>
          <tbody>
            {data.tipos.map((t) => (
              <tr key={t.tipo}>
                <td>{t.tipo}</td>
                <td>{t.mw}</td>
                <td>{t.participacion}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bloque">
        <h3>Evolución anual matriz energética despachada</h3>
        <img
          src={data.graficoMatriz}
          alt="Gráfica matriz energética"
          className="grafico"
        />
      </section>
    </div>
  );
});

export default PdfResumen;
