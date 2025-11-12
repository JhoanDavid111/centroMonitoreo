// src/components/CombustiblesLiquidos.jsx
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from '../lib/highcharts-config';
import HighchartsReact from 'highcharts-react-official';
import Card from './ui/Card';
import tokens from '../styles/theme.js';

export function CombustiblesLiquidos() {
  const [charts, setCharts] = useState([]);
  const [selected, setSelected] = useState('all');
  const chartRefs = useRef([]);

  const colores = tokens.colors.chart;

  useEffect(() => {
    const baseOptions = [
      // 1) Evolución del Volumen Útil por Región
      {
        chart:    { type: 'area', zoomType: '', height: 350 },
        title:    { text: 'Evolución del volumen útil por región', align: 'left' },
        subtitle: { text: 'Fuente: XM. 2020-2024' },
        colors:   colores,
        yAxis:    { title: { text: 'Volumen útil (Millones de m³)' } },
        xAxis: {
          categories: [
            'ene-20','jul-20','ene-21','jul-21',
            'ene-22','jul-22','ene-23','jul-23','ene-24'
          ],
          title:         { text: null },
          tickInterval:  1,
          labels: {
            style:         { color: tokens.colors.text.secondary, fontSize: '11px', fontFamily: tokens.font.family },
            rotation:      -45,
            step:           1,
            autoRotation:   false
          },
          gridLineColor: tokens.colors.border.subtle
        },
        plotOptions: { area: { stacking: 'normal' } },
        series: [
          { name: 'Antioquia', data: [3500,3600,3400,3700,3900,4000,3900,3800,3700] },
          { name: 'Caribe',    data: [1500,1600,1700,1650,1750,1800,1700,1650,1600] },
          { name: 'Centro',    data: [1800,1850,1900,1950,2000,2100,2200,2300,2400] },
          { name: 'Oriente',   data: [1200,1250,1300,1280,1320,1340,1360,1380,1400] },
          { name: 'Valle',     data: [1100,1120,1140,1160,1180,1200,1220,1240,1260] },
          { name: 'Caldas',    data: [600,620,640,660,680,700,720,740,760] },
        ],
        legend: {
          itemStyle: { fontSize: tokens.font.size.sm, fontFamily: tokens.font.family }
        },
      },
      // 2) Capacidad Instalada Despachada Centralmente por Tecnología
      {
        chart:    { type: 'column', zoomType: '', height: 350 },
        title:    { text: 'Capacidad instalada despachada centralmente por tecnología', align: 'left' },
        subtitle: { text: 'Fuente: XM. 2020-2024' },
        colors:   colores,
        yAxis:    { title: { text: 'Capacidad Instalada (GW)' } },
        xAxis: {
          categories: [
            '2014','2015','2016','2017','2018',
            '2019','2020','2021','2022','2023','2024'
          ],
          title:         { text: null },
          tickInterval:  1,
          labels: {
            style:         { color: tokens.colors.text.secondary, fontSize: '11px', fontFamily: tokens.font.family },
            rotation:      -45,
            step:           1,
            autoRotation:   false
          },
          gridLineColor: tokens.colors.border.subtle
        },
        series: [
          { name: 'ACPM',        data: [5,5.5,5.8,6,6.2,6.5,6.8,7,7.3,7.6,8] },
          { name: 'AGUA',        data: [10,11,12,12.5,13,13.5,14,14.5,15,15.5,16] },
          { name: 'CARBÓN',      data: [7,7.1,7.2,7.3,7.4,7.5,7.6,7.8,8,8.2,8.4] },
          { name: 'GAS',         data: [3,3.2,3.4,3.6,3.8,4,4.2,4.4,4.6,4.8,5] },
          { name: 'GLP',         data: [1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2] },
          { name: 'JET-A1',      data: [0.6,0.65,0.7,0.75,0.8,0.85,0.9,1,1.1,1.2,1.3] },
          { name: 'COMBUSTOLEO', data: [0.4,0.45,0.5,0.6,0.65,0.7,0.75,0.8,0.85,0.9,1] },
          { name: 'RAD SOLAR',   data: [0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1,1.1,1.2] }
        ],
        legend: {
          itemStyle: { fontSize: tokens.font.size.sm, fontFamily: tokens.font.family }
        },
      },
      // 3) Comparativo Volumen vs. Capacidad
      {
        chart:    { type: 'area', zoomType: '', height: 350 },
        title:    { text: 'Comparativo volumen vs. capacidad', align: 'left' },
        subtitle: { text: '' },
        colors:   colores,
        yAxis:    { title: { text: 'Índice Relativo' } },
        xAxis: {
          categories: ['Q1','Q2','Q3','Q4'],
          title:         { text: null },
          tickInterval:  1,
          labels: {
            style:         { color: tokens.colors.text.secondary, fontSize: '11px', fontFamily: tokens.font.family },
            rotation:      -45,
            step:           1,
            autoRotation:   false
          },
          gridLineColor: tokens.colors.border.subtle
        },
        series: [
          { name: 'Volumen útil',       data: [2.5,2.7,2.6,2.8] },
          { name: 'Capacidad instalada', data: [14,14.3,14.5,15] }
        ],
        legend: {
          itemStyle: { fontSize: tokens.font.size.sm, fontFamily: tokens.font.family }
        },
      }
    ];

    // Inyectar background y botones de exportación
    const withExport = baseOptions.map(opt => ({
      ...opt,
      chart: {
        ...opt.chart,
        backgroundColor: tokens.colors.surface.primary
      },
      /* exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
          }
        }
      } */
    }));

    setCharts(withExport);
  }, []);

  const isFiltered = selected !== 'all';
  const gridClasses = isFiltered
    ? 'grid-cols-1'
    : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';

  const displayed = charts
    .map((opt, idx) => ({ opt, idx }))
    .filter(item => selected === 'all' || String(item.idx) === selected);

  return (
    <section className="mt-8 font-sans">
      <h2 className="text-2xl text-text-primary font-semibold mb-4 ">
        Combustibles líquidos
      </h2>

      {/* Dropdown de selección */}
      <div className="mb-4">
        <select
          className="bg-surface-primary text-text-secondary p-2 rounded border border-[color:var(--border-default)] font-sans"
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

      {/* Grid de gráficas */}
      <div className={`grid ${gridClasses} gap-4`}>
        {displayed.map(({ opt, idx }) => {
          const dynOpt = {
            ...opt,
            chart: {
              ...opt.chart,
              height: isFiltered ? 600 : opt.chart.height
            }
          };
          return (
            <Card
              key={idx}
              className="p-4 relative"
            >
             {/* Botón de ayuda */}
              <button
                className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-surface-secondary rounded-lg shadow-soft hover:bg-[color:var(--surface-overlay)] transition-colors"
                style={{ width: 30, height: 30 }}
                title="Ayuda"
                onClick={() => alert('Ok Aquí puedes mostrar ayuda contextual o abrir un modal.')}
                type="button"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="rounded-full"
                >
                  <circle cx="12" cy="12" r="10" fill="var(--surface-secondary)" stroke="var(--text-primary)" strokeWidth="2.5" />
                  <text
                    x="12"
                    y="18"
                    textAnchor="middle"
                    fontSize="16"
                    fill="var(--text-primary)"
                    fontWeight="bold"
                    fontFamily={tokens.font.family}
                    pointerEvents="none"
                  >?</text>
                </svg>
              </button>
              <HighchartsReact
                highcharts={Highcharts}
                options={dynOpt}
                ref={el => (chartRefs.current[idx] = el)}
              />
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export default CombustiblesLiquidos;



