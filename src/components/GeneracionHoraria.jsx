// src/components/GeneracionHoraria.jsx
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import ExportData from 'highcharts/modules/export-data';
import Exporting from 'highcharts/modules/exporting';
import FullScreen from 'highcharts/modules/full-screen';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import { useMemo } from 'react';
import { useGeneracionHorariaPromedio } from '../services/graficasService';

// Carga módulos
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Tema global
Highcharts.setOptions({
  chart: { backgroundColor: '#262626', style: { fontFamily: 'Nunito Sans, sans-serif' } },
  title: { align: 'left', style: { color: '#fff' } },
  subtitle: { style: { color: '#aaa' } },
  legend: {
    itemStyle: { color: '#ccc' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: { backgroundColor: '#262626', style: { color: '#fff', fontSize: '13px' }, useHTML: true, },
});

const fmt = (v, dec = 2) => Highcharts.numberFormat(v, dec, ',', '.');
const SCALE = 1000;

function areaTooltipFormatter() {
  const pts = this.points || [];
  const total = pts.reduce((s, p) => s + p.y, 0);
  const rows = pts
    .map(
      (p) => `
    <tr>
      <td style="padding:4px 8px 4px 0; white-space:nowrap;">
        <span style="color:${p.series.color}; fontSize:20px;">● </span> ${p.series.name}:
      </td>
      <td style="text-align:right;"><b>${fmt(p.y, 2)} MW/h</b></td>
    </tr>
  `
    )
    .join('');
  return `
    <span style="font-size:12px"><b>Hora: ${this.x}</b></span>
    <table>${rows}
      <tr>
        <td colspan="2" style="border-top:1px solid #555;padding-top:8px">
          Total: <b style="fontSize: 13px;">${fmt(total, 2)} MW/h</b>
        </td>
      </tr>
    </table>
  `;
}

function stackedMax(series, len) {
  let max = 0;
  for (let i = 0; i < len; i++) {
    const sum = series.reduce((s, srs) => s + (srs.data[i] || 0), 0);
    if (sum > max) max = sum;
  }
  return max;
}

export function GeneracionHoraria() {
  // Prepara payloads
  const payload1 = { fecha_inicio: '2022-01-01', fecha_fin: '2022-06-30', meses: 6 };
  const hoy = new Date();
  const fecha_fin2 = hoy.toISOString().slice(0,10);
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth()-5,1).toISOString().slice(0,10);
  const payload2 = { fecha_inicio: inicio, fecha_fin: fecha_fin2, meses: 6 };

  // Fetch paralelo con React Query
  const query1 = useGeneracionHorariaPromedio(payload1);
  const query2 = useGeneracionHorariaPromedio(payload2);

  const loading = query1.isLoading || query2.isLoading;
  const error = query1.error || query2.error;
  const data1 = query1.data;
  const data2 = query2.data;

  const { opts1, opts2 } = useMemo(() => {
    if (!data1 || !data2) return { opts1: null, opts2: null };

    const horas1 = data1.map(d => d.hora);
    const horas2 = data2.map(d => d.hora);
    const toMW = arr => arr.map(v => v * SCALE);

    const series1 = [
      { name:'TÉRMICA',     data: toMW(data1.map(d=>d.TERMICA)),     color:'#F97316' },
      { name:'COGENERADOR', data: toMW(data1.map(d=>d.COGENERADOR)), color:'#D1D1D0' },
      { name:'HIDRÁULICA',  data: toMW(data1.map(d=>d.HIDRAULICA)),  color:'#3B82F6' },
      { name:'SOLAR',       data: toMW(data1.map(d=>d.SOLAR)),       color:'#FFC800' }
    ];
    const max1 = Math.ceil(stackedMax(series1, horas1.length)*1.1);

    const baseOptions = {
      chart: { type:'area', height:500 },
      title: { text:'Curva de generación primer semestre 2022' },
      xAxis: {
        categories: horas1, tickInterval:1,
        title: { text:'Hora del día', style:{color:'#ccc'} },
        labels:{style:{color:'#ccc'}}, gridLineColor:'#333'
      },
      yAxis: {
        min:0, max:max1, tickInterval:Math.ceil(max1/5),
        title:{text:'Generación (MW/h)',style:{color:'#ccc'}},
        labels:{style:{color:'#ccc'},formatter(){return fmt(this.value,0);}},
        gridLineColor:'#333'
      },
      tooltip:{ shared:true, backgroundColor: '#262626', style: { color: '#FFF', fontSize: '13px' }, formatter:areaTooltipFormatter },
      plotOptions:{ area:{ stacking:'normal', lineWidth:1, marker:{enabled:false} } },
      series: series1,
      responsive:{ rules:[{ condition:{maxWidth:600}, chartOptions:{ legend:{layout:'horizontal',align:'center',verticalAlign:'bottom'} } }] }
    };

    const series2 = [
      { name:'TÉRMICA',     data: toMW(data2.map(d=>d.TERMICA)),     color:'#F97316' },
      { name:'COGENERADOR', data: toMW(data2.map(d=>d.COGENERADOR)), color:'#D1D1D0' },
      { name:'HIDRÁULICA',  data: toMW(data2.map(d=>d.HIDRAULICA)),  color:'#3B82F6' },
      { name:'EÓLICA',      data: toMW(data2.map(d=>d.EOLICA)),      color:'#5DFF97' },
      { name:'SOLAR',       data: toMW(data2.map(d=>d.SOLAR)),       color:'#FFC800' }
    ];
    const max2 = Math.ceil(stackedMax(series2, horas2.length)*1.1);

    const variantOptions = {
      ...baseOptions,
      title: { text:'Curva de generación últimos 6 meses' },
      xAxis: { ...baseOptions.xAxis, categories: horas2 },
      yAxis: { ...baseOptions.yAxis, max: max2, tickInterval: Math.ceil(max2/5) },
      series: series2
    };

    return { opts1: baseOptions, opts2: variantOptions };
  }, [data1, data2]);

  if (loading) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center h-64">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-gray-300 mt-4">Cargando gráfica…</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
        <p className="text-red-400">Error: {error.message || 'Error al cargar la gráfica'}</p>
      </div>
    );
  }

  if (!opts1 || !opts2) return null;

  return (
    <section className="mt-8">
      <h2 className="text-2xl text-[#D1D1D0] font-semibold mb-4">
        Curva de generación horaria promedio
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow">
          <HighchartsReact highcharts={Highcharts} options={opts1} />
        </div>
        <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow">
          <HighchartsReact highcharts={Highcharts} options={opts2} />
        </div>
      </div>
    </section>
  );
}




export default GeneracionHoraria;





