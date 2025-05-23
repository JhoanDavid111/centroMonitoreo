import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';

// Cargar módulos
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Tema oscuro y estilos
Highcharts.setOptions({
  chart: {
    backgroundColor: '#111827',
    style: { fontFamily: 'sans-serif' }
  },
  title: { style: { color: '#fff' } },
  subtitle: { style: { color: '#aaa' } },
  xAxis: {
    labels: { style: { color: '#ccc', fontSize: '8px' } },
    title: { style: { color: '#ccc' } },
    gridLineColor: '#333'
  },
  yAxis: {
    labels: { style: { color: '#ccc', fontSize: '8px' } },
    title: { style: { color: '#ccc' } },
    gridLineColor: '#333'
  },
  legend: {
    itemStyle: { color: '#ccc' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#1f2937',
    style: { color: '#fff', fontSize: '10px' }
  }
});

export function EnergiaElectrica() {
  const [charts, setCharts] = useState([]);
  const [selected, setSelected] = useState('all');
  const chartRefs = useRef([]);

  useEffect(() => {
    const baseOptions = [
      {
        title: { text: 'Evolución del Volumen Útil por Región' },
        subtitle: { text: 'Fuente: XM. 2020-2024' },
        chart: { zoomType: '', height: 350 },
        yAxis: { title: { text: 'Volumen útil (Millones de m³)' } },
        xAxis: { categories: ['ene-20','jul-20','ene-21','jul-21','ene-22','jul-22','ene-23','jul-23','ene-24'] },
        series: [
          { name: 'Antioquia', data: [2000,2300,2100,2400,2500,2200,2300,2600,2700] },
          { name: 'Caribe',    data: [1000,1300,1200,1400,1450,1250,1350,1500,1600] },
          { name: 'Centro',    data: [1500,1600,1550,1650,1700,1600,1680,1800,1900] },
          { name: 'Oriente',   data: [800,850,870,900,950,920,940,980,1000] },
          { name: 'Valle',     data: [700,740,760,780,800,820,840,860,880] },
          { name: 'Caldas',    data: [300,310,320,330,340,350,360,370,380] }
        ]
      },
      {
        title: { text: 'Capacidad Instalada por Tecnología' },
        subtitle: { text: 'Fuente: XM. 2014-2024' },
        chart: { zoomType: '', height: 350 },
        yAxis: { title: { text: 'Capacidad (GW)' } },
        xAxis: { categories: ['2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024'] },
        series: [
          { name: 'AGUA',        data: [10,11,12,12,13,13,14,15,16,17,18] },
          { name: 'CARBÓN',      data: [5,5.5,6,6,6.5,6.8,7,7.2,7.5,7.6,8] },
          { name: 'GAS',         data: [3,3.2,3.4,3.5,3.7,4,4.2,4.5,4.6,4.8,5] },
          { name: 'GLP',         data: [1,1,1,1.1,1.1,1.2,1.2,1.3,1.3,1.3,1.4] },
          { name: 'JET-A1',      data: [0.5,0.6,0.6,0.7,0.8,0.9,1,1,1.1,1.1,1.2] },
          { name: 'COMBUSTOLEO', data: [0.3,0.4,0.5,0.5,0.6,0.6,0.6,0.7,0.7,0.8,0.9] },
          { name: 'RAD SOLAR',   data: [0.2,0.3,0.4,0.5,0.6,0.7,0.8,1,1.2,1.4,1.6] }
        ]
      },
      {
        title: { text: 'Comparativo Volumen vs. Capacidad' },
        subtitle: { text: 'Gráfico de ejemplo adicional' },
        chart: { zoomType: '', height: 350 },
        yAxis: { title: { text: 'Índice Relativo' } },
        xAxis: { categories: ['Q1','Q2','Q3','Q4'] },
        series: [
          { name: 'Volumen útil',       data: [2.5,2.7,2.6,2.8] },
          { name: 'Capacidad instalada', data: [14,14.3,14.5,15] }
        ]
      }
    ];

    // Agregar export buttons
    const withExport = baseOptions.map(opt => ({
      ...opt,
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
          }
        }
      }
    }));

    setCharts(withExport);
  }, []);

  const isFiltered = selected !== 'all';
  const gridClasses = isFiltered
    ? 'grid-cols-1'
    : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';

  // Filtrar y preparar opciones dinámicas
  const displayed = charts
    .map((opt, idx) => ({ opt, idx }))
    .filter(item => selected === 'all' || String(item.idx) === selected);

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Energía eléctrica
      </h2>

      {/* Dropdown filtro */}
      <div className="mb-4">
        <select
          className="bg-gray-800 text-gray-200 p-2 rounded"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="all">Mostrar todos</option>
          {charts.map((c, i) => (
            <option key={i} value={String(i)}>
              {c.title.text}
            </option>
          ))}
        </select>
      </div>

      {/* Grid dinámico */}
      <div className={`grid ${gridClasses} gap-4`}>
        {displayed.map(({ opt, idx }) => {
          // Aumentar alto si está filtrado
          const dynOptions = {
            ...opt,
            chart: {
              ...opt.chart,
              height: isFiltered ? 600 : opt.chart.height
            }
          };
          return (
            <div
              key={idx}
              className="bg-gray-900 p-4 rounded border border-gray-700 shadow relative"
            >
              {/* Botón maximizar */}
              <button
                className="absolute top-2 right-2 text-gray-300 hover:text-white"
                onClick={() => chartRefs.current[idx].chart.fullscreen.toggle()}
                title="Maximizar gráfico"
              >⛶</button>

              <HighchartsReact
                highcharts={Highcharts}
                options={dynOptions}
                ref={el => (chartRefs.current[idx] = el)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

