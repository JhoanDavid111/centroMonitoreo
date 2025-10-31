import { useState, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";
import Accessibility from 'highcharts/modules/accessibility';
import ExportData from 'highcharts/modules/export-data';
import Exporting from 'highcharts/modules/exporting';
import FullScreen from 'highcharts/modules/full-screen';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import { TOOLTIP_CONFIG } from '../constants/tooltip';
import { useProyectosCiclos } from '../hooks/useProyectosCiclos';

// Carga de módulos de Highcharts
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);
Accessibility(Highcharts);

// Paleta de colores para las gráficas
const COLOR_PALETTE = [
  '#39FF14', '#0B6623', '#7FFF00', '#228B22', 
  '#39FF14', '#0B6623', '#7FFF00', '#228B22',
  '#39FF14', '#0B6623', '#7FFF00', '#228B22',
  '#39FF14', '#0B6623', '#7FFF00', '#228B22',
  '#39FF14', '#0B6623', '#7FFF00', '#228B22',
  '#39FF14', '#0B6623', '#7FFF00', '#228B22',
  '#39FF14', '#0B6623', '#7FFF00'
];

// Función para crear opciones de gráfica de proyectos por estado
const createProyectosEstadoOptions = (cicloData, ciclo) => {
  const data = Object.entries(cicloData.distribucion_proyectos_por_estado_asignacion)
    .filter(([key]) => key !== 'total')
    .map(([name, value], index) => ({
      name: name.replace(/_/g, ' '),
      y: value,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length]
    }));

  return {
    chart: { 
      type: 'column',
      backgroundColor: '#262626',
      borderWidth: 1,
      borderColor: '#262626',
      plotBorderWidth: 1,
      plotBorderColor: '#262626' 
    },
    title: {
      text: `Proyectos por estado - Ciclo ${ciclo}`,
      align: 'left',
      style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
    },
    subtitle: {
      text: `Distribución de proyectos según su estado actual<br>Total: <b>${cicloData.distribucion_proyectos_por_estado_asignacion.total}</b>`,
      useHTML: true,
      style: { fontSize: '14px', color: '#ccc' }
    },
    xAxis: {
      type: 'category',
      tickInterval: 1,
      title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
      labels: {
        rotation: -45,
        step: 1,
        style: { fontSize: '12px', fontWeight: 'bold', color: '#eee' }
      },
      crosshair: true
    },
    yAxis: {
      title: { text: 'Número de Proyectos', style: { fontWeight: 'bold', color: '#ccc' } },
      min: 0,
      gridLineWidth: 1,
      labels: { style: { fontSize: '12px', color: '#eee' } }
    },
    legend: { enabled: false },
    plotOptions: {
      column: {
        borderRadius: 4,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y}',
          style: { fontWeight: 'bold', color: '#fff' },
          y: -20
        },
        pointPadding: 0.1,
        groupPadding: 0.1
      }
    },
    series: [{
      name: 'Proyectos',
      data: data
    }],
    tooltip: TOOLTIP_CONFIG(this)
  };
};

// Función para crear opciones de gráfica de capacidad por estado
const createCapacidadEstadoOptions = (cicloData, ciclo) => {
  const data = Object.entries(cicloData.distribucion_capacidad_instalada_mw_por_estado_asignacion)
    .filter(([key]) => key !== 'total')
    .map(([name, value], index) => ({
      name: name.replace(/_/g, ' '),
      y: value,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length]
    }));

  return {
    chart: { type: 'column', backgroundColor: '#262626' },
    title: {
      text: `Distribución de capacidad - Ciclo ${ciclo}`,
      align: 'left',
      style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
    },
    subtitle: {
      text: `Total capacidad: <b>${Highcharts.numberFormat(cicloData.distribucion_capacidad_instalada_mw_por_estado_asignacion.total, 1, ',', '.')} MW</b>`,
      useHTML: true,
      style: { fontSize: '14px', color: '#ccc' }
    },
    xAxis: {
      type: 'category',
      tickInterval: 1,
      title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
      labels: {
        rotation: -45,
        step: 1,
        style: { fontSize: '12px', fontWeight: 'bold', color: '#eee' }
      },
      crosshair: true
    },
    yAxis: {
      title: { text: 'Capacidad (MW)', style: { fontWeight: 'bold', color: '#ccc' } },
      min: 0,
      labels: {
        formatter() { return Highcharts.numberFormat(this.value, 0, ',', '.'); },
        style: { fontSize: '12px', color: '#eee' }
      }
    },
    legend: { enabled: false },
    plotOptions: {
      column: {
        borderRadius: 4,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          formatter() {
            return Highcharts.numberFormat(this.y, 1, ',', '.');
          },
          style: { fontWeight: 'bold', fontSize: '12px', color: '#fff' },
          y: -20
        },
        pointPadding: 0.1,
        groupPadding: 0.15
      }
    },
    series: [{
      name: 'Capacidad (MW)',
      data: data
    }],
    tooltip: TOOLTIP_CONFIG(this)
  };
};

// Función para crear opciones de gráfica de proyectos por departamento
const createProyectosDeptoOptions = (cicloData, ciclo) => {
  const data = Object.entries(cicloData.distribucion_proyectos_departamento)
    .filter(([key]) => key !== 'total')
    .sort((a, b) => b[1] - a[1]) // Ordenar por cantidad descendente
    .map(([name, value], index) => [
      name.replace(/_/g, ' '), 
      value
    ]);

  return {
    chart: { 
      type: 'column',
      backgroundColor: '#262626',
      borderWidth: 1,
      borderColor: '#262626',
      plotBorderWidth: 1,
      plotBorderColor: '#262626' 
    },
    title: {
      text: `Distribución de proyectos por departamento - Ciclo ${ciclo}`,
      style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
    },
    subtitle: {
      text: `Total proyectos: <b>${cicloData.distribucion_proyectos_departamento.total}</b>`,
      useHTML: true,
      style: { fontSize: '14px', color: '#ccc' }
    },
    xAxis: {
      type: 'category',
      tickInterval: 1,
      title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
      labels: {
        rotation: -90,
        step: 1,
        style: { fontSize: '11px', fontWeight: 'bold', color: '#eee' },
        formatter() { return this.value.replace(/_/g, ' '); }
      },
      crosshair: true
    },
    yAxis: {
      title: { text: 'Número de Proyectos', style: { fontWeight: 'bold', color: '#ccc' } },
      min: 0,
      tickInterval: 10,
      gridLineWidth: 1,
      labels: { style: { fontSize: '12px', color: '#eee' } }
    },
    legend: { enabled: false },
    plotOptions: {
      column: {
        colorByPoint: true,
        borderRadius: 3,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          formatter() { return this.y; },
          style: { fontWeight: 'bold', fontSize: '11px', color: '#fff', textOutline: 'none' },
          y: -5
        },
        pointPadding: 0.1,
        groupPadding: 0.1
      }
    },
    series: [{
      name: 'Proyectos',
      data: data,
      colors: COLOR_PALETTE
    }],
    tooltip: TOOLTIP_CONFIG(this)
  };
};

// Función para crear opciones de gráfica de capacidad por departamento
const createCapacidadDeptoOptions = (cicloData, ciclo) => {
  const data = Object.entries(cicloData.distribucion_capacidad_instalada_mw_por_departamento)
    .filter(([key]) => key !== 'total')
    .sort((a, b) => b[1] - a[1]) // Ordenar por capacidad descendente
    .map(([name, value], index) => [
      name.replace(/_/g, ' '), 
      value
    ]);

  return {
    chart: { 
      type: 'column',
      backgroundColor: '#262626',
      borderWidth: 1,
      borderColor: '#262626',
      plotBorderWidth: 1,
      plotBorderColor: '#262626' 
    },
    title: {
      text: `Capacidad por departamento - Ciclo ${ciclo}`,
      style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
    },
    subtitle: {
      text: `Total capacidad: <b>${Highcharts.numberFormat(cicloData.distribucion_capacidad_instalada_mw_por_departamento.total, 1, ',', '.')} MW</b>`,
      useHTML: true,
      style: { fontSize: '14px', color: '#ccc' }
    },
    xAxis: {
      type: 'category',
      tickInterval: 1,
      title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
      labels: {
        rotation: -90,
        step: 1,
        style: { fontSize: '11px', fontWeight: 'bold', color: '#eee' },
        formatter() { return this.value.replace(/_/g, ' '); }
      },
      crosshair: true
    },
    yAxis: {
      title: { text: 'Capacidad (MW)', style: { fontWeight: 'bold', color: '#ccc' } },
      min: 0,
      labels: {
        formatter() { return Highcharts.numberFormat(this.value, 0, ',', '.'); },
        style: { fontSize: '12px', color: '#eee' }
      },
      gridLineWidth: 1
    },
    legend: { enabled: false },
    plotOptions: {
      column: {
        colorByPoint: true,
        borderRadius: 3,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          formatter() { return Highcharts.numberFormat(this.y, 1); },
          style: { fontWeight: 'bold', fontSize: '11px', color: '#fff', textOutline: 'none' },
          y: -5
        },
        pointPadding: 0.1,
        groupPadding: 0.1
      }
    },
    series: [{
      name: 'Capacidad (MW)',
      data: data,
      colors: COLOR_PALETTE
    }],
    tooltip: TOOLTIP_CONFIG(this)
  };
};

// Función para crear opciones de gráfica de proyectos por estado - Ciclo 2 (con configuración especial)
const createProyectosEstadoC2Options = (cicloData, ciclo) => {
  const data = Object.entries(cicloData.distribucion_proyectos_por_estado_asignacion)
    .filter(([key]) => key !== 'total')
    .map(([name, value], index) => ({
      name: name.replace(/_/g, ' '),
      y: value,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length]
    }));

  return {
    chart: {
      type: 'column',
      backgroundColor: '#262626',
      borderWidth: 1,
      borderColor: '#262626',
      plotBorderWidth: 1,
      plotBorderColor: '#262626'
    },
    title: {
      text: `Proyectos por estado - Ciclo ${ciclo}`,
      style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
    },
    subtitle: {
      text: `Distribución de proyectos según su estado actual<br>Los conceptos aprobados son Autogeneración<br>Total: <b>${cicloData.distribucion_proyectos_por_estado_asignacion.total}</b>`,
      useHTML: true,
      style: { fontSize: '14px', color: '#ccc' }
    },
    xAxis: {
      type: 'category',
      tickInterval: 1,
      lineColor: '#444',
      gridLineColor: '#333',
      title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
      labels: {
        rotation: -45,
        step: 1,
        style: { fontSize: '12px', fontWeight: 'bold', color: '#eee' }
      },
      crosshair: true
    },
    yAxis: {
      title: { text: 'Número de Proyectos', style: { fontWeight: 'bold', color: '#ccc' } },
      min: 0,
      max: 1800,
      tickInterval: 200,
      labels: { style: { fontSize: '12px', color: '#eee' } },
      gridLineColor: '#333'
    },
    legend: { enabled: false },
    plotOptions: {
      column: {
        borderRadius: 4,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y}',
          style: { fontWeight: 'bold', color: '#fff' },
          y: -20
        },
        pointPadding: 0.1,
        groupPadding: 0.1
      }
    },
    series: [{
      name: 'Proyectos',
      data: data
    }],
    tooltip: TOOLTIP_CONFIG(this)
  };
};

// Función para crear opciones de gráfica de capacidad por estado - Ciclo 2 (con configuración especial)
const createCapacidadEstadoC2Options = (cicloData, ciclo) => {
  const data = Object.entries(cicloData.distribucion_capacidad_instalada_mw_por_estado_asignacion)
    .filter(([key]) => key !== 'total')
    .map(([name, value], index) => ({
      name: name.replace(/_/g, ' '),
      y: value,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length]
    }));

  return {
    chart: {
      type: 'column',
      backgroundColor: '#262626',
      borderWidth: 1,
      borderColor: '#262626',
      plotBorderWidth: 1,
      plotBorderColor: '#262626',
      spacing: [10, 10, 30, 10]
    },
    title: {
      text: `Distribución de capacidad - Ciclo ${ciclo}`,
      style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
    },
    subtitle: {
      text: `Total capacidad: <b>${Highcharts.numberFormat(cicloData.distribucion_capacidad_instalada_mw_por_estado_asignacion.total, 1, ',', '.')} MW</b><br>Los conceptos aprobados son Autogeneración`,
      useHTML: true,
      style: { fontSize: '14px', color: '#ccc' }
    },
    xAxis: {
      type: 'category',
      tickInterval: 1,
      lineColor: '#444',
      gridLineColor: '#333',
      title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
      labels: {
        rotation: -30,
        step: 1,
        style: { fontSize: '12px', fontWeight: 'bold', color: '#eee' }
      },
      crosshair: true
    },
    yAxis: {
      title: { text: 'Capacidad (MW)', style: { fontWeight: 'bold', color: '#ccc' } },
      min: 0,
      labels: {
        formatter() { return Highcharts.numberFormat(this.value, 0, ',', '.'); },
        style: { fontSize: '12px', color: '#eee' }
      },
      gridLineColor: '#333'
    },
    legend: { enabled: false },
    plotOptions: {
      column: {
        borderRadius: 4,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          formatter() { return Highcharts.numberFormat(this.y, 2, ',', '.'); },
          style: { fontWeight: 'bold', fontSize: '12px', color: '#fff' },
          y: -20
        },
        pointPadding: 0.1,
        groupPadding: 0.15
      }
    },
    series: [{
      name: 'Capacidad (MW)',
      data: data
    }],
    tooltip: TOOLTIP_CONFIG(this)
  };
};

// Función para crear opciones de gráfica de proyectos por departamento - Ciclo 2
const createProyectosDeptoC2Options = (cicloData, ciclo) => {
  const data = Object.entries(cicloData.distribucion_proyectos_departamento)
    .filter(([key]) => key !== 'total')
    .sort((a, b) => b[1] - a[1]) // Ordenar por cantidad descendente
    .map(([name, value], index) => [
      name.replace(/_/g, ' '), 
      value
    ]);

  return {
    chart: {
      type: 'column',
      backgroundColor: '#262626',
      borderWidth: 1,
      borderColor: '#262626',
      plotBorderWidth: 1,
      plotBorderColor: '#262626',
      spacing: [10, 10, 30, 10]
    },
    title: {
      text: `Distribución de proyectos por departamento - Ciclo ${ciclo}`,
      style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
    },
    subtitle: {
      text: `Total proyectos: <b>${cicloData.distribucion_proyectos_departamento.total}</b>`,
      useHTML: true,
      style: { fontSize: '14px', color: '#ccc' }
    },
    xAxis: {
      type: 'category',
      tickInterval: 1,
      lineColor: '#444',
      gridLineColor: '#333',
      title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
      labels: {
        rotation: -90,
        step: 1,
        style: { fontSize: '11px', fontWeight: 'bold', color: '#eee' }
      },
      crosshair: true
    },
    yAxis: {
      title: { text: 'Cantidad de Proyectos', style: { fontWeight: 'bold', color: '#ccc' } },
      min: 0,
      labels: { style: { fontSize: '12px', color: '#eee' } },
      gridLineColor: '#333'
    },
    legend: { enabled: false },
    plotOptions: {
      column: {
        colorByPoint: true,
        borderRadius: 3,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          formatter() { return Highcharts.numberFormat(this.y, 0, ',', '.'); },
          style: { fontWeight: 'bold', fontSize: '11px', color: '#fff', textOutline: 'none' },
          y: -5
        },
        pointPadding: 0.1,
        groupPadding: 0.1
      }
    },
    series: [{
      name: 'Proyectos',
      data: data,
      colors: COLOR_PALETTE
    }],
    tooltip: TOOLTIP_CONFIG(this)
  };
};

// Función para crear opciones de gráfica de capacidad por departamento - Ciclo 2
const createCapacidadDeptoC2Options = (cicloData, ciclo) => {
  const data = Object.entries(cicloData.distribucion_capacidad_instalada_mw_por_departamento)
    .filter(([key]) => key !== 'total')
    .sort((a, b) => b[1] - a[1]) // Ordenar por capacidad descendente
    .map(([name, value], index) => [
      name.replace(/_/g, ' '), 
      value
    ]);

  return {
    chart: {
      type: 'column',
      backgroundColor: '#262626',
      borderWidth: 1,
      borderColor: '#262626',
      plotBorderWidth: 1,
      plotBorderColor: '#262626',
      spacing: [10, 10, 30, 10]
    },
    title: {
      text: `Capacidad instalada por departamento - Ciclo ${ciclo}`,
      style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
    },
    subtitle: {
      text: `Total de capacidad instalada: <b>${Highcharts.numberFormat(cicloData.distribucion_capacidad_instalada_mw_por_departamento.total, 1, ',', '.')} MW</b>`,
      useHTML: true,
      style: { fontSize: '14px', color: '#ccc' }
    },
    xAxis: {
      type: 'category',
      tickInterval: 1,
      lineColor: '#444',
      gridLineColor: '#333',
      title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
      labels: {
        rotation: -90,
        step: 1,
        style: { fontSize: '11px', fontWeight: 'bold', color: '#eee' }
      },
      crosshair: true
    },
    yAxis: {
      title: { text: 'Capacidad (MW)', style: { fontWeight: 'bold', color: '#ccc' } },
      min: 0,
      labels: {
        formatter() { return Highcharts.numberFormat(this.value, 1, ',', '.'); },
        style: { fontSize: '12px', color: '#eee' }
      },
      gridLineColor: '#333'
    },
    legend: { enabled: false },
    plotOptions: {
      column: {
        colorByPoint: true,
        borderRadius: 3,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          formatter() { return Highcharts.numberFormat(this.y, 1, ',', '.'); },
          style: { fontWeight: 'bold', fontSize: '11px', color: '#fff', textOutline: 'none' },
          y: -5
        },
        pointPadding: 0.1,
        groupPadding: 0.1
      }
    },
    series: [{
      name: 'Capacidad instalada (MW)',
      data: data,
      colors: COLOR_PALETTE
    }],
    tooltip: TOOLTIP_CONFIG(this)
  };
};


// Función para generar opciones de gráficas basadas en datos del API
const generateChartOptions = (cicloData, ciclo) => {
  if (!cicloData) return [];

  const charts = [];
  
  // Proyectos por Estado
  charts.push(createProyectosEstadoOptions(cicloData, ciclo));
  
  // Capacidad por Estado
  charts.push(createCapacidadEstadoOptions(cicloData, ciclo));
  
  // Proyectos por Departamento
  charts.push(createProyectosDeptoOptions(cicloData, ciclo));
  
  // Capacidad por Departamento
  charts.push(createCapacidadDeptoOptions(cicloData, ciclo));

  return charts;
};

export function GraficaCiclo1({ data }) {
  const chartOptions = useMemo(() => generateChartOptions(data, 1), [data]);

  if (!data) {
    return (
      <div className="bg-[#262626] p-4 rounded-lg border border-gray-700 shadow flex flex-col items-center justify-center h-[500px]">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-500" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-500" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-gray-300 mt-4">Cargando gráficas del Ciclo 1...</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {chartOptions.map((options, idx) => (
        <div key={idx} className="w-full h-120 p-4 bg-[#262626] rounded-lg shadow border border-[#666666] overflow-hidden">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      ))}
    </div>
  );
}

export function GraficaCiclo2({ data }) {
  const chartOptions = useMemo(() => generateChartOptions(data, 2), [data]);

  if (!data) {
    return (
      <div className="bg-[#262626] p-4 rounded-lg border border-gray-700 shadow flex flex-col items-center justify-center h-[500px]">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-500" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-500" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-gray-300 mt-4">Cargando gráficas del Ciclo 2...</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {chartOptions.map((options, idx) => (
        <div key={idx} className="w-full h-120 p-4 bg-[#262626] rounded-lg shadow border border-[#666666] overflow-hidden">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      ))}
    </div>
  );
}

export default function SeguimientoCiclos() {
  const [ciclo, setCiclo] = useState(1);
  const { data, loading, error, refetch } = useProyectosCiclos();


  if (loading) {
    return (
      <div className="p-4 font-sans rounded-lg" style={{ background: '#262626', fontFamily: 'Nunito Sans, sans-serif' }}>
        <div className="bg-[#262626] p-4 rounded-lg border border-gray-700 shadow flex flex-col items-center justify-center h-[500px]">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-500" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-500" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <p className="text-gray-300 mt-4">Cargando datos de proyectos por ciclos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 font-sans rounded-lg" style={{ background: '#262626', fontFamily: 'Nunito Sans, sans-serif' }}>
        <div className="bg-[#262626] p-4 rounded-lg border shadow flex flex-col items-center justify-center h-[500px]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-500 text-center max-w-md mb-4">{error}</p>
          <button onClick={refetch} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 font-sans rounded-lg" style={{ background: '#262626', fontFamily: 'Nunito Sans, sans-serif' }}>
      <div className="flex space-x-6 mb-4 font-sans text-sm">
        <button
          className={`pb-1 border-b-2 transition text-[18px] ${
            ciclo === 1
              ? 'border-[#FFC800] text-[#FFC800]'
              : 'border-transparent text-gray-300'
          }`}
          onClick={() => setCiclo(1)}
        >
          Ciclo 1
        </button>
        <button
          className={`pb-1 border-b-2 transition text-[18px] ${
            ciclo === 2
              ? 'border-[#FFC800] text-[#FFC800]'
              : 'border-transparent text-gray-300'
          }`}
          onClick={() => setCiclo(2)}
        >
          Ciclo 2
        </button>
      </div>

      <div className="mt-4">
        {ciclo === 1 && <GraficaCiclo1 data={data?.ciclo_1} />}
        {ciclo === 2 && <GraficaCiclo2 data={data?.ciclo_2} />}
      </div>
    </div>
  );
}
