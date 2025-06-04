// src/pages/EnergiaElectricaPage.jsx
import React from 'react';
import IndicadoresEnergia from '../components/IndicadoresEnergia';
import GraficaPrecios from '../components/GraficaPrecios';
import GraficaEstatuto from '../components/GraficaEstatuto';
import GraficaDemanda from '../components/GraficaDemanda';
import GraficaRelacionDemanda from '../components/GraficaRelacionDemanda';
import GraficaVolumenUtilRegion from '../components/GraficaVolumenUtilRegion';
import GraficaCapacidadInstaladaTecnologia from '../components/GraficaCapacidadInstaladaTecnologia';
import GraficaCapacidadPorcentajeAvanceCurvaS from '../components/GraficaCapacidadPorcentajeAvanceCurvaS';
import ListadoProyectosCurvaS from '../components/ListadoProyectosCurvaS';
import GraficaAcumuladoCapacidadProyectos from '../components/GraficaAcumuladoCapacidadProyectos';

export default function EnergiaElectricaPage() {
  // Aquí podrías controlar estado de fechas si quieres que todos compartan las mismas.
  const fechaInicio = '2025-05-01';
  const fechaFin = '2025-05-03';

  return (
    <div className="text-white bg-[#262626] min-h-screen p-6 font-sans">
      {/* Indicadores (POST v1/indicadores/energia_electrica) */}
      <IndicadoresEnergia fechaInicio={fechaInicio} fechaFin={fechaFin} />

      {/* Gráficas del grupo “Energía Eléctrica” */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-white font-sans">Gráficas Energía Eléctrica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GraficaPrecios fechaInicio={fechaInicio} fechaFin={fechaFin} />
          <GraficaEstatuto fechaInicio={fechaInicio} fechaFin={fechaFin} />
          <GraficaDemanda fechaInicio={fechaInicio} fechaFin={fechaFin} />
          <GraficaRelacionDemanda fechaInicio={fechaInicio} fechaFin={fechaFin} />
          <GraficaVolumenUtilRegion fechaInicio={fechaInicio} fechaFin={fechaFin} />
          <GraficaCapacidadInstaladaTecnologia fechaInicio={fechaInicio} fechaFin={fechaFin} />
        </div>
      </section>

      {/* Sección curva S: capacidad vs porcentaje */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-white font-sans">Curva S (Proyectos)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <GraficaCapacidadPorcentajeAvanceCurvaS />
        </div>
      </section>

      {/* Tabla + listado de proyectos (POST listado_proyectos_curva_s) */}
      <ListadoProyectosCurvaS />

      {/* Gráfica acumulado capacidad (POST acumulado_capacidad_proyectos) */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-white font-sans">
          Acumulado Capacidad / Proyectos
        </h2>
        <GraficaAcumuladoCapacidadProyectos />
      </section>
    </div>
  );
}
