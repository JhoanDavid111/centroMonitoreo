// SeguimientoCiclos.jsx
import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import Accessibility from 'highcharts/modules/accessibility';
import HighchartsReact from "highcharts-react-official";

// Carga de módulos de Highcharts
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);
Accessibility(Highcharts);

const capacidadDeptoC2Data = [
  { name: 'CORDOBA', y: 13664.6,  color: '#39FF14' },
  { name: 'SANTANDER', y: 10271.27, color: '#0B6623' },
  { name: 'LA GUAJIRA', y: 9290.7,  color: '#7FFF00' },
  { name: 'CESAR', y: 9010.83,      color: '#228B22' },
  { name: 'ANTIOQUIA', y: 6065.53,  color: '#39FF14' },
  { name: 'BOLIVAR', y: 5896.42,    color: '#0B6623' },
  { name: 'CAUCA', y: 5088.6,       color: '#7FFF00' },
  { name: 'VALLE DEL CAUCA', y: 5066.1, color: '#228B22' },
  { name: 'TOLIMA', y: 4342.0,      color: '#39FF14' },
  { name: 'NORTE DE SANTANDER', y: 3831.68, color: '#0B6623' },
  { name: 'SUCRE', y: 3706.2,       color: '#7FFF00' },
  { name: 'ATLANTICO', y: 3400.4,   color: '#228B22' },
  { name: 'CUNDINAMARCA', y: 3348.4, color: '#39FF14' },
  { name: 'CALDAS', y: 3213.08,     color: '#0B6623' },
  { name: 'HUILA', y: 3082.79,      color: '#7FFF00' },
  { name: 'MAGDALENA', y: 2181.66,  color: '#228B22' },
  { name: 'RISARALDA', y: 2146.8,   color: '#39FF14' },
  { name: 'BOYACA', y: 1646.7,      color: '#0B6623' },
  { name: 'META', y: 1514.99,       color: '#7FFF00' },
  { name: 'ARAUCA', y: 641.6,       color: '#228B22' },
  { name: 'CASANARE', y: 556.1,     color: '#39FF14' },
  { name: 'NARINO', y: 366.9,       color: '#0B6623' },
  { name: 'QUINDIO', y: 229.3,      color: '#7FFF00' },
  { name: 'BOGOTA', y: 173.08,      color: '#228B22' },
  { name: 'CHOCO', y: 132.5,        color: '#39FF14' }
];
const totalCapacidadC2 = capacidadDeptoC2Data.reduce((sum, pt) => sum + pt.y, 0);

const proyectosEstadoOptions = {
  chart: { type: 'column',
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#262626',
    plotBorderWidth: 1,
    plotBorderColor: '#262626' },

  title: {
    text: 'PROYECTOS POR ESTADO - CICLO 1',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff' }
  },
  subtitle: {
    text: 'Distribución de proyectos según su estado actual',
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
    data: [
      { name: 'Cto Aprobado', y: 148, color: '#0B6623' },
      { name: 'Cto Negado',    y: 356, color: '#32CD32' },
      { name: 'Desistido',           y: 27,  color: '#39FF14' },
      { name: 'En operación',        y: 2,   color: '#228B22' },
      { name: 'En val. Completitud', y: 0, color: '#006400' },
      { name: 'Liberado',            y: 45,  color: '#3CB371' },
      { name: 'Retirado',            y: 15,  color: '#2E8B57' },
      { name: 'TOTAL',               y: 593, color: '#005A28' }
    ]
  }]
};

const capacidadEstadoOptions = {
  chart: { type: 'column', backgroundColor: '#262626' },
  title: {
    text: 'DISTRIBUCIÓN DE CAPACIDAD - CICLO 1',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff' }
  },
  subtitle: {
    text: 'Total capacidad: <b>39.441,4 MW</b>',
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
          // usa 1 decimal sólo en el TOTAL (índice 7)
          return Highcharts.numberFormat(this.y, this.point.index === 7 ? 1 : 2, ',', '.');
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
    data: [
      { name: 'Cto aprobado', y: 6082.74, color: '#0B6623' },
      { name: 'Cto negado',   y: 27158.94, color: '#7FFF00' },
      { name: 'Desistido',          y: 881.49, color: '#39FF14' },
      { name: 'En operación',       y: 17.0,   color: '#228B22' },
      { name: 'En val. completitud', y: 0,  color: '#00843D' },
      { name: 'Liberado',           y: 2774.23, color: '#32CD32' },
      { name: 'Retirado',           y: 1627.49, color: '#006400' },
      { name: 'TOTAL',              y: 39441.89, color: '#005A28' }
    ]
  }]
};

const proyectosDeptoOptions = {
  chart: { type: 'column',
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#262626',
    plotBorderWidth: 1,
    plotBorderColor: '#262626' },

  title: {
    text: 'DISTRIBUCIÓN DE PROYECTOS POR DEPARTAMENTO - CICLO 1',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff' }
  },
  subtitle: {
    text: 'Total proyectos: <b>596</b>',
    useHTML: true,
    style: { fontSize: '14px', color: '#ccc' }
  },
  xAxis: {
    type: 'category',
    tickInterval: 1,                   // fuerza cada categoría
    title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
    labels: {
      rotation: -90,
      step: 1,                         // asegura que no salte ninguno
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
    data: [
      ['TOLIMA', 55], ['CESAR', 47], ['BOLIVAR', 39], ['ANTIOQUIA', 37],
      ['ATLANTICO', 35], ['SANTANDER', 29], ['HUILA', 26], ['MAGDALENA', 24],
      ['BOYACA', 24], ['NORTE_DE_SANTANDER', 22], ['LA_GUAJIRA', 21],
      ['RISARALDA', 19], ['CORDOBA', 19], ['VALLE_DEL_CAUCA', 17],
      ['CASANARE', 16], ['SUCRE', 16], ['CALDAS', 14], ['META', 5],
      ['CUNDINAMARCA', 5], ['CAUCA', 2], ['BOGOTA', 2], ['NARINO', 2],
      ['ARAUCA', 1]
    ],
    colors: [
      '#39FF14','#0B6623','#7FFF00','#228B22','#39FF14','#0B6623',
      '#7FFF00','#228B22','#39FF14','#0B6623','#7FFF00','#228B22',
      '#39FF14','#0B6623','#7FFF00','#228B22','#39FF14','#0B6623',
      '#7FFF00'
    ]
  }]
};

const capacidadDeptoOptions = {
  chart: { type: 'column',
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#262626',
    plotBorderWidth: 1,
    plotBorderColor: '#262626' },

  title: {
    text: 'CAPACIDAD POR DEPARTAMENTO - CICLO 1',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }
  },
  subtitle: {
    text: 'Total capacidad: <b>39.441 MW</b>',
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
    data: [
      ['LA_GUAJIRA', 4760.3], ['BOLIVAR', 4185.1], ['CESAR', 2977.86],
      ['TOLIMA', 2735.55], ['SANTANDER', 2229.37], ['MAGDALENA', 1792.7],
      ['CORDOBA', 1636.0], ['ATLANTICO', 1447.7], ['ANTIOQUIA', 1347.63],
      ['RISARALDA', 1117.37], ['NORTE_DE_SANTANDER', 994.0], ['CASANARE', 897.1],
      ['HUILA', 809.4], ['VALLE_DEL_CAUCA', 754.42], ['BOYACA', 738.32],
      ['CALDAS', 623.69], ['SUCRE', 491.9], ['CUNDINAMARCA', 384.8],
      ['META', 339.8], ['ARAUCA', 30.0], ['CAUCA', 27.4], ['BOGOTA', 24.88], ['NARINO', 15.6]
    ],
    colors: [
      '#39FF14','#0B6623','#7FFF00','#228B22','#39FF14','#0B6623',
      '#7FFF00','#228B22','#39FF14','#0B6623','#7FFF00','#228B22',
      '#39FF14','#0B6623','#7FFF00','#228B22','#39FF14','#0B6623',
      '#7FFF00'
    ]
  }]
};

const proyectosEstadoC2Options = {
  chart: {
    type: 'column',
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#262626',
    plotBorderWidth: 1,
    plotBorderColor: '#262626'
  },
  title: {
    text: 'PROYECTOS POR ESTADO - CICLO 2',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff' }
  },
  subtitle: {
    text: 'Distribución de proyectos según su estado actual<br>Los conceptos aprobados son Autogeneración',
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
    data: [
      { name: 'Cto aprobado', y: 4, color: '#0B6623' },
      { name: 'Desistido',          y: 168, color: '#32CD32' },
      { name: 'En evaluación',      y: 1458, color: '#39FF14' },
      { name: 'Retirado',           y: 88, color: '#228B22' },
      { name: 'TOTAL',              y: 1718, color: '#005A28' }
    ]
  }]
};

const capacidadEstadoC2Options = {
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
    text: 'DISTRIBUCIÓN DE CAPACIDAD - CICLO 2',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff' }
  },
  subtitle: {
    text: 'Total capacidad: <b>99.035,23 MW</b><br>Los conceptos aprobados son Autogeneración',
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
    data: [
      { name: 'Cto aprobado', y: 90.80,    color: '#0B6623' },
      { name: 'Desistido',          y: 11801.90, color: '#7FFF00' },
      { name: 'En evaluación',      y: 81802.32, color: '#39FF14' },
      { name: 'Retirado',           y: 5173.21,  color: '#228B22' },
      { name: 'TOTAL',              y: 98868.23, color: '#005A28' }
    ]
  }]
};

const proyectosDeptoC2Options = {
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
    text: 'DISTRIBUCIÓN DE PROYECTOS POR DEPARTAMENTO - CICLO 2',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }
  },
  subtitle: {
    text: 'Total proyectos: <b>1.718</b>',
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
    data: [
      { name: 'CESAR', y: 143, color: '#39FF14' },
      { name: 'CORDOBA', y: 143, color: '#0B6623' },
      { name: 'SANTANDER', y: 131, color: '#7FFF00' },
      { name: 'VALLE_DEL_CAUCA', y: 127, color: '#228B22' },
      { name: 'BOLIVAR', y: 123, color: '#39FF14' },
      { name: 'ANTIOQUIA', y: 116, color: '#0B6623' },
      { name: 'TOLIMA', y: 112, color: '#7FFF00' },
      { name: 'ATLANTICO', y: 107, color: '#228B22' },
      { name: 'HUILA', y: 102, color: '#39FF14' },
      { name: 'SUCRE', y: 99, color: '#0B6623' },
      { name: 'LA_GUAJIRA', y: 83, color: '#7FFF00' },
      { name: 'MAGDALENA', y: 80, color: '#228B22' },
      { name: 'NORTE_DE_SANTANDER', y: 76, color: '#39FF14' },
      { name: 'CUNDINAMARCA', y: 57, color: '#0B6623' },
      { name: 'CALDAS', y: 54, color: '#7FFF00' },
      { name: 'BOYACA', y: 42, color: '#228B22' },
      { name: 'META', y: 30, color: '#39FF14' },
      { name: 'RISARALDA', y: 28, color: '#0B6623' },
      { name: 'CASANARE', y: 22, color: '#7FFF00' },
      { name: 'CAUCA', y: 13, color: '#228B22' },
      { name: 'ARAUCA', y: 10, color: '#39FF14' },
      { name: 'QUINDIO', y: 8, color: '#0B6623' },
      { name: 'BOGOTA', y: 6, color: '#7FFF00' },
      { name: 'NARINO', y: 4, color: '#228B22' },
      { name: 'CHOCO', y: 2, color: '#39FF14' }
    ]
  }]
};

const capacidadDeptoC2Options = {
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
    text: 'CAPACIDAD INSTALADA POR DEPARTAMENTO - CICLO 2',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }
  },
  subtitle: {
    text: `Total de capacidad instalada: <b>${Highcharts.numberFormat(totalCapacidadC2, 1, ',', '.')} MW</b>`,
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
    name: 'Capacidad Instalada (MW)',
    data: capacidadDeptoC2Data
  }]
};

const resumenANLAOptions = {
  chart: {
    type: 'column',
    backgroundColor: '#262626',
    spacing: [10, 10, 30, 10]
  },
  title: {
    text: 'Licencias FNCER otorgadas desde 07/08/2022 hasta la fecha',
    style: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#fff'
    }
  },
  xAxis: {
    type: 'category',
    categories: ['2022', '2023', '2024', '2025'],
    tickPositions: [0, 1, 2, 3],
    labels: {
      enabled: true,
      step: 1,
      autoRotation: false,
      rotation: 0,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#eee'
      }
    }
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Cantidad de Licencias FNCER otorgadas',
      style: { fontWeight: 'bold', color: '#ccc' }
    },
    labels: {
      style: { fontSize: '12px', color: '#ddd' }
    },
    stackLabels: {
      enabled: true,
      style: {
        fontWeight: 'bold',
        color: '#fff',
        textOutline: 'none'
      }
    },
    gridLineColor: '#333'
  },
  legend: {
    align: 'right',
    verticalAlign: 'top',
    x: -30,
    y: 25,
    floating: true,
    backgroundColor: '#1f1f1f',
    borderColor: '#555',
    borderWidth: 1,
    itemStyle: {
      color: '#ccc',
      fontWeight: 'bold'
    }
  },
  tooltip: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
    style: { color: '#fff' },
    headerFormat: '<b>{category}</b><br/>',
    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
    useHTML: true
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        style: {
          color: '#fff',
          fontWeight: 'bold',
          textOutline: 'none'
        }
      }
    }
  },
  series: [
    {
      name: 'Eólico',
      data: [1, 1, 0, 0],
      color: '#39FF14'
    },
    {
      name: 'Fotovoltaico',
      data: [4, 3, 4, 5],
      color: '#7FFF00'
    },
    {
      name: 'LT',
      data: [2, 6, 4, 3],
      color: '#228B22'
    }
  ],
  credits: { enabled: false }
};

const datosTiempos = [
  { name: 'Cundinamarca', dias: 199 },
  { name: 'Otros', dias: 206 },
  { name: 'La Guajira', dias: 219 },
  { name: 'Atlántico', dias: 221 },
  { name: 'Córdoba', dias: 255 },
  { name: 'Cesar', dias: 287 },
  { name: 'Santander', dias: 288 },
  { name: 'Códoba - Sucre', dias: 476 }
];

const viridisPalette = [
  '#440154', '#46327e', '#365c8d', '#277f8e',
  '#1fa187', '#4ac16d', '#a0da39', '#fde725'
];

const tiempoPromedioANLAOptions = {
  chart: {
    type: 'bar',
    backgroundColor: '#262626',
    style: {
      fontFamily: 'Nunito Sans, Segoe UI, sans-serif'
    },
    spacing: [10, 10, 30, 10]
  },
  title: {
    text: 'Tiempo Promedio de Aprobación de Licencias por Departamento',
    style: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#fff'
    }
  },
  subtitle: {
    text: 'Desde la fecha de inicio hasta la fecha de la licencia',
    style: {
      fontSize: '14px',
      color: '#ccc'
    }
  },
  xAxis: {
    categories: datosTiempos.map(i => i.name),
    tickPositions: [0, 1, 2, 3, 4, 5, 6, 7],
    labels: {
      enabled: true,
      step: 1,
      autoRotation: false,
      rotation: 0,
      style: {
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#eee'
      }
    },
    gridLineColor: '#333',
    lineColor: '#444'
  },
  yAxis: {
    title: {
      text: null
    },
    labels: {
      style: {
        color: '#ccc',
        fontSize: '12px'
      }
    },
    gridLineColor: '#333'
  },
  tooltip: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
    style: { color: '#fff' },
    valueSuffix: ' días',
    pointFormat: 'Promedio de aprobación: <b>{point.y} días</b>',
    useHTML: true
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      dataLabels: {
        enabled: true,
        format: '{point.y} días',
        color: '#fff',
        inside: true,
        align: 'right',
        style: {
          fontWeight: 'bold',
          fontSize: '12px',
          textOutline: 'none'
        }
      }
    }
  },
  series: [{
    name: 'Tiempo Promedio de Aprobación (Días)',
    data: datosTiempos.map((item, index) => ({
      name: item.name,
      y: item.dias,
      color: viridisPalette[index]
    }))
  }],
  credits: {
    enabled: true,
    text: 'Fuente: ANLA - Datos procesados por la UPME',
    style: {
      fontSize: '10px',
      color: '#999'
    }
  },
  legend: { enabled: false }
};

const seriesData = [
  {
    name: 'La Guajira',
    data: [
      { name: '2018', y: 240.0, color: '#0B6623' },
      { name: '2019', y: 346.5, color: '#32CD32' },
      { name: '2020', y: 200.0, color: '#39FF14' },
      { name: '2021', y: 571.2, color: '#228B22' },
      { name: '2022', y: 571.2, color: '#3CB371' },
      { name: '2023', y: 100.0, color: '#2E8B57' }
    ]
  },
  {
    name: 'Santander',
    data: [
      { name: '2019', y: 100.5, color: '#0B6623' },
      { name: '2022', y: 200.0, color: '#32CD32' },
      { name: '2023', y: 360.0, color: '#39FF14' },
      { name: '2024', y: 200.0, color: '#228B22' }
    ]
  },
  {
    name: 'Atlántico',
    data: [
      {name:'2021', y: 599.5, color:'#0B6623'},
      {name:'2022', y: 200.0, color:'#32CD32'}
    ]
  },
  {
    name: 'Cesar',
    data: [
      { name: '2019', y: 250.4, color: '#0B6623' },
      { name: '2021', y: 101.0, color: '#32CD32' },
      { name: '2023', y: 240.0, color: '#39FF14' },
      { name: '2025', y: 200.0, color: '#228B22' }
    ]
  },
  {
    name: 'Cundinamarca',
    data: [
      { name: '2022', y: 300.0, color: '#0B6623' },
      { name: '2023', y: 100.0, color: '#32CD32' }
    ]
  },
  {
    name: 'Córdoba - Sucre',
    data: [
      { name: '2025', y: 350.0, color: '#0B6623' }
    ]
  },
  {
    name: 'Córdoba',
    data: [
      { name: '2024', y: 200.0, color: '#0B6623' },
      { name: '2025', y: 135.0, color: '#32CD32' }
    ]
  },
  {
    name: 'Otros',
    data: [
      { name: '2021', y: 121.3, color: '#0B6623' },
      { name: '2022', y: 360.0, color: '#32CD32' },
      { name: '2024', y: 250.0, color: '#39FF14' },
      { name: '2025', y: 400.0, color: '#228B22' }
    ]
  }
];

const getChartOptions = (serie, index) => ({
  chart: { type: 'column',
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#262626',
    plotBorderWidth: 1,
    plotBorderColor: '#262626'
  },
  title: {
    text: serie.name,
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#fff'
    }
  },
  xAxis: {
    type: 'category',
    tickInterval: 1,
    title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
    labels: {
      rotation: 0,
      step: 1,
      style: { fontSize: '12px', fontWeight: 'bold', color: '#eee' }
    },
    crosshair: true
  },
  yAxis: {
    title: { text: 'MW Licenciados', style: { fontWeight: 'bold', color: '#ccc' } },
    min: 0,
    gridLineWidth: 1,
    labels: { style: { fontSize: '12px', color: '#eee' } },
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
    name: serie.name,
    data: serie.data
  }]
});

export function GraficaCiclo1() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="w-full h-120 p-4 bg-[#262626] rounded shadow border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={proyectosEstadoOptions} />
      </div>
      <div className="w-full h-120 p-4 bg-[#262626] rounded shadow border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={capacidadEstadoOptions} />
      </div>
      <div className="w-full h-120 p-4 bg-[#262626] rounded shadow border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={proyectosDeptoOptions} />
      </div>
      <div className="w-full h-120 p-4 bg-[#262626] rounded shadow border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={capacidadDeptoOptions} />
      </div>
    </div>
  );
}

export function GraficaCiclo2() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="w-full h-120 p-4 bg-[#262626] rounded shadow border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={proyectosEstadoC2Options} />
      </div>
      <div className="w-full h-120 p-4 bg-[#262626] rounded shadow border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={capacidadEstadoC2Options} />
      </div>
      <div className="w-full h-120 p-4 bg-[#262626] rounded shadow border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={proyectosDeptoC2Options} />
      </div>
      <div className="w-full h-120 p-4 bg-[#262626] rounded shadow border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={capacidadDeptoC2Options} />
      </div>
    </div>
  );
}

export function GraficaANLA() {
  return (
      <div className="flex flex-col gap-4">
        {/* Bloque 1 */}
        <div className="bg-[#262626] border border-[#666666]">
          <HighchartsReact highcharts={Highcharts} options={resumenANLAOptions} />
        </div>

        <h2 className="text-xl font-semibold mb-4 text-white">Evolución de la capacidad instalada Licienciada por Departamento</h2>

        {/* Bloque 2 expandido: subgrilla 3x3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {seriesData.map((serie, index) => (
              <div key={index} className="bg-[#262626] border border-[#666666] h-[420px] p-1">
                <HighchartsReact highcharts={Highcharts} options={getChartOptions(serie, index)} />
              </div>
          ))}

        </div>

        {/* Bloque 3 */}
        <div className="bg-[#262626] border border-[#666666]">
          <HighchartsReact highcharts={Highcharts} options={tiempoPromedioANLAOptions} />
        </div>

      </div>
  );
}

export default function SeguimientoCiclos() {
  const [ciclo, setCiclo] = useState(1);

  return (
    <div className="p-4 font-sans" style={{ background: '#262626', fontFamily: 'Nunito Sans, sans-serif' }}>

      <div className="flex space-x-6 mb-4 font-sans text-sm">
        <button
            className={`pb-1 border-b-2 transition ${
                ciclo === 1
                    ? 'border-[#FFC800] text-[#FFC800]'
                    : 'border-transparent text-gray-300'
            }`}
            onClick={() => setCiclo(1)}
        >
          Ciclo 1
        </button>
        <button
            className={`pb-1 border-b-2 transition ${
                ciclo === 2
                    ? 'border-[#FFC800] text-[#FFC800]'
                    : 'border-transparent text-gray-300'
            }`}
            onClick={() => setCiclo(2)}
        >
          Ciclo 2
        </button>
        <button
            className={`pb-1 border-b-2 transition ${
                ciclo === 3
                    ? 'border-[#FFC800] text-[#FFC800]'
                    : 'border-transparent text-gray-300'
            }`}
            onClick={() => setCiclo(3)}
        >
          ANLA
        </button>
      </div>

      <div className="mt-4">
        {ciclo === 1 && <GraficaCiclo1 />}
        {ciclo === 2 && <GraficaCiclo2 />}
        {ciclo === 3 && <GraficaANLA />}
      </div>
    </div>
  );
}
