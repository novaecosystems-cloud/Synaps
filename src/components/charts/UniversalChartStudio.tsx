'use client';

import React, { useState, useRef } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Sparkles,
  Download,
  FileCode,
  Table as TableIcon,
  Palette,
  BarChart2,
  PieChart as PieIcon,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  Copy,
  Check,
  Layers,
  Activity,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ChartDefinition,
  ChartType,
  ChartPalette,
  PALETTES,
  PRESET_CHARTS,
  validateChartARLM,
} from '@/lib/chart-generator';

function escapeXml(unsafe: string): string {
  return (unsafe || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export default function UniversalChartStudio() {
  const [chart, setChart] = useState<ChartDefinition>(PRESET_CHARTS.legal_risk_matrix);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'data' | 'insights'>('preview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [customPalette, setCustomPalette] = useState<ChartPalette>('synaps_cyber');
  const chartRef = useRef<HTMLDivElement>(null);

  const currentPalette = PALETTES[customPalette] || PALETTES.synaps_cyber;

  // Handle AI Chart Generation
  const handleGenerate = async (presetPrompt?: string) => {
    const targetPrompt = presetPrompt || prompt;
    if (!targetPrompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/charts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: targetPrompt,
          chartType: chart.chartType,
          palette: customPalette,
        }),
      });
      const data = await res.json();
      if (data.success && data.chart) {
        setChart(data.chart);
      }
    } catch (err) {
      console.error('Failed to generate chart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Change Chart Type on the fly
  const handleTypeChange = (newType: ChartType) => {
    const validation = validateChartARLM(chart.data, chart.series, newType);
    setChart({
      ...chart,
      chartType: newType,
      meta: {
        ...chart.meta,
        arlmScore: validation.score,
        arithmeticValidated: validation.isValid,
      },
    });
  };

  // Live Data Editing
  const handleDataChange = (rowIndex: number, columnKey: string, value: string | number) => {
    const newData = [...chart.data];
    const numVal = Number(value);
    newData[rowIndex] = {
      ...newData[rowIndex],
      [columnKey]: isNaN(numVal) || value === '' ? value : numVal,
    };
    const validation = validateChartARLM(newData, chart.series, chart.chartType);
    setChart({
      ...chart,
      data: newData,
      meta: {
        ...chart.meta,
        arlmScore: validation.score,
        arithmeticValidated: validation.isValid,
      },
    });
  };

  const handleAddRow = () => {
    const newRow: Record<string, any> = { [chart.xAxisKey]: `Item ${chart.data.length + 1}` };
    chart.series.forEach((s) => {
      newRow[s.key] = 0;
    });
    setChart({ ...chart, data: [...chart.data, newRow] });
  };

  const handleDeleteRow = (index: number) => {
    if (chart.data.length <= 1) return;
    const newData = chart.data.filter((_, i) => i !== index);
    setChart({ ...chart, data: newData });
  };

  // Generate self-contained standalone SVG with embedded themes, card background, typography & dimensions
  const generateStandaloneSvgString = (): string | null => {
    if (!chartRef.current) return null;
    const svgElem = chartRef.current.querySelector('svg.recharts-surface') || chartRef.current.querySelector('svg');
    if (!svgElem) return null;

    const width = 960;
    const height = 560;
    const chartWidth = 900;
    const chartHeight = 400;

    // Clone the inner recharts svg
    const clonedSvg = svgElem.cloneNode(true) as SVGElement;
    clonedSvg.setAttribute('width', `${chartWidth}`);
    clonedSvg.setAttribute('height', `${chartHeight}`);
    clonedSvg.removeAttribute('style');

    // Ensure all text elements have computed colors
    const textNodes = clonedSvg.querySelectorAll('text, tspan');
    textNodes.forEach((node) => {
      const currentFill = (node as SVGTextElement).getAttribute('fill');
      if (!currentFill || currentFill === 'currentColor') {
        (node as SVGTextElement).setAttribute('fill', currentPalette.text);
      }
      (node as SVGTextElement).setAttribute('font-family', 'Inter, system-ui, -apple-system, sans-serif');
    });

    const innerContent = clonedSvg.innerHTML;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
    text { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
  </style>
  
  <!-- Background Card -->
  <rect width="100%" height="100%" rx="24" fill="${currentPalette.bg}" stroke="#334155" stroke-width="1.5"/>
  
  <!-- Header Title -->
  <text x="36" y="48" fill="${currentPalette.text}" font-size="20" font-weight="700" letter-spacing="-0.02em">${escapeXml(chart.title)}</text>
  
  <!-- Subtitle -->
  ${chart.subtitle ? `<text x="36" y="74" fill="${currentPalette.text}" opacity="0.65" font-size="12">${escapeXml(chart.subtitle)}</text>` : ''}
  
  <!-- ARLM Badge -->
  <g transform="translate(${width - 170}, 28)">
    <rect width="134" height="28" rx="14" fill="#10b98122" stroke="#10b981" stroke-width="1"/>
    <text x="67" y="18" fill="#10b981" font-size="11" font-weight="700" text-anchor="middle">ARLM ${(chart.meta.arlmScore * 100).toFixed(1)}%</text>
  </g>
  
  <!-- Chart Viewport -->
  <g transform="translate(30, 100)">
    ${innerContent}
  </g>
</svg>`;
  };

  // Export Vector SVG (Self-Contained Standalone XML)
  const handleExportSVG = () => {
    const fullSvg = generateStandaloneSvgString();
    if (!fullSvg) return;
    const blob = new Blob([fullSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chart.title.toLowerCase().replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export High-Res 2x PNG (Presentation & Slide Ready)
  const handleExportPNG = () => {
    const svgStr = generateStandaloneSvgString();
    if (!svgStr) return;

    const img = new Image();
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 2; // 2x Retina resolution (1920x1120)
      canvas.width = 960 * scale;
      canvas.height = 560 * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${chart.title.toLowerCase().replace(/\s+/g, '_')}_2x.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobURL);
    };
    img.src = blobURL;
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [chart.xAxisKey, ...chart.series.map((s) => s.key)];
    const rows = chart.data.map((row) =>
      headers.map((h) => (row[h] !== undefined ? `"${row[h]}"` : '""')).join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${chart.title.toLowerCase().replace(/\s+/g, '_')}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(chart, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `${chart.title.toLowerCase().replace(/\s+/g, '_')}_spec.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy JSON Spec
  const handleCopySpec = () => {
    navigator.clipboard.writeText(JSON.stringify(chart, null, 2));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-base-content font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Activity className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-base-content">Universal AI Chart Studio</h1>
              <span className="badge badge-primary badge-sm font-mono text-[10px] font-bold">ARLM Certified</span>
            </div>
            <p className="text-xs text-base-content/60 mt-1">
              Create, customize, and export high-accuracy executive charts (Bar, Area, Radar, Donut, Multi-Series) with mathematical consistency checks.
            </p>
          </div>
        </div>

        {/* Quick Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleExportPNG} variant="outline" className="rounded-2xl gap-1.5 text-xs font-bold bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20">
            <ImageIcon className="w-3.5 h-3.5" /> High-Res PNG (2x)
          </Button>
          <Button onClick={handleExportSVG} variant="outline" className="rounded-2xl gap-1.5 text-xs font-bold">
            <Download className="w-3.5 h-3.5" /> Standalone SVG
          </Button>
          <Button onClick={handleExportCSV} variant="outline" className="rounded-2xl gap-1.5 text-xs font-bold">
            <Download className="w-3.5 h-3.5" /> CSV (Excel)
          </Button>
          <Button onClick={handleExportJSON} variant="outline" className="rounded-2xl gap-1.5 text-xs font-bold">
            <FileCode className="w-3.5 h-3.5" /> JSON Spec
          </Button>
        </div>
      </div>

      {/* AI Prompt Bar & Preset Suggestions */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Sparkles className="w-4 h-4 text-indigo-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Describe any chart... e.g. 'Quarterly M&A liability exposure by department with risk scores'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              className="w-full bg-base-200 border border-base-300 rounded-2xl pl-11 pr-4 py-3 text-xs text-base-content outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>
          <Button
            onClick={() => handleGenerate()}
            disabled={loading || !prompt.trim()}
            className="rounded-2xl gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6"
          >
            <RefreshCw className={loading ? 'w-4 h-4 animate-spin' : 'w-4 h-4'} />
            {loading ? 'Generating with ARLM...' : 'Generate AI Chart'}
          </Button>
        </div>

        {/* 1-Click Preset Templates */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">Presets:</span>
          {Object.entries(PRESET_CHARTS).map(([key, def]) => (
            <button
              key={key}
              onClick={() => {
                setChart(def);
                setCustomPalette(def.palette);
              }}
              className="btn btn-xs rounded-xl bg-base-200 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/30 text-[11px] border border-base-300"
            >
              {def.title.split(' ')[0]} {def.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Toolbar & Customizer */}
        <div className="lg:col-span-1 space-y-5">
          {/* Chart Type Switcher */}
          <div className="p-5 bg-base-100 border border-base-300 rounded-3xl space-y-3 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Chart Visualization Type
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'bar', label: 'Bar', icon: BarChart2 },
                { type: 'line', label: 'Line', icon: TrendingUp },
                { type: 'area', label: 'Area', icon: Activity },
                { type: 'donut', label: 'Donut / Pie', icon: PieIcon },
                { type: 'radar', label: 'Radar Matrix', icon: ShieldCheck },
                { type: 'composed', label: 'Composed', icon: Layers },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => handleTypeChange(item.type as ChartType)}
                  className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-bold transition-all ${
                    chart.chartType === item.type
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-base-200 border-base-300 hover:bg-base-300 text-base-content'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette Switcher */}
          <div className="p-5 bg-base-100 border border-base-300 rounded-3xl space-y-3 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-indigo-400" /> Color Theme
            </h3>
            <div className="space-y-2">
              {Object.entries(PALETTES).map(([key, pal]) => (
                <button
                  key={key}
                  onClick={() => {
                    setCustomPalette(key as ChartPalette);
                    setChart({ ...chart, palette: key as ChartPalette });
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl border text-xs font-bold transition-all ${
                    customPalette === key
                      ? 'bg-base-200 border-indigo-500 shadow-sm'
                      : 'bg-base-200/50 border-base-300 hover:bg-base-200'
                  }`}
                >
                  <span>{pal.name}</span>
                  <div className="flex gap-1">
                    {pal.colors.slice(0, 4).map((c, i) => (
                      <span key={i} className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ARLM Accuracy Certificate Card */}
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 via-base-100 to-base-100 border border-emerald-500/20 rounded-3xl space-y-2 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> ARLM Accuracy Score
              </span>
              <span className="badge badge-success badge-sm font-mono font-bold text-[10px]">
                {(chart.meta.arlmScore * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-[11px] text-base-content/70 leading-relaxed">
              Verified with Prime RLM arithmetic validation. Series points, zero-divisors, and label integrity certified.
            </p>
          </div>
        </div>

        {/* Center & Right: Live Chart Display & Data Editor */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tabs */}
          <div className="flex justify-between items-center bg-base-100 p-2 rounded-2xl border border-base-300">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-base-content/70 hover:bg-base-200'
                }`}
              >
                Chart Canvas
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'data' ? 'bg-indigo-600 text-white' : 'text-base-content/70 hover:bg-base-200'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" /> Live Data Table ({chart.data.length})
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'insights' ? 'bg-indigo-600 text-white' : 'text-base-content/70 hover:bg-base-200'
                }`}
              >
                ARLM Insights ({chart.meta.summaryInsights?.length || 0})
              </button>
            </div>

            <button onClick={handleCopySpec} className="btn btn-ghost btn-xs rounded-xl gap-1 text-[11px]">
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedCode ? 'Copied' : 'Copy Spec'}
            </button>
          </div>

          {/* Canvas Preview Tab */}
          {activeTab === 'preview' && (
            <div
              ref={chartRef}
              className="p-6 rounded-3xl border border-base-300 shadow-sm transition-all"
              style={{ backgroundColor: currentPalette.bg }}
            >
              {/* Chart Header */}
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: currentPalette.text }}>
                    {chart.title}
                  </h2>
                  {chart.subtitle && (
                    <p className="text-xs opacity-70 mt-0.5" style={{ color: currentPalette.text }}>
                      {chart.subtitle}
                    </p>
                  )}
                </div>
                <span className="badge badge-success badge-sm font-mono text-[10px] font-bold">
                  ARLM {(chart.meta.arlmScore * 100).toFixed(1)}%
                </span>
              </div>

              {/* Chart Body */}
              <div className="h-[420px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chart.chartType === 'bar' ? (
                    <BarChart data={chart.data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey={chart.xAxisKey} stroke={currentPalette.text} opacity={0.6} tick={{ fontSize: 11 }} />
                      <YAxis stroke={currentPalette.text} opacity={0.6} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      {chart.series.map((s, i) => (
                        <Bar key={s.key} dataKey={s.key} name={s.name} fill={currentPalette.colors[i % currentPalette.colors.length]} radius={[6, 6, 0, 0]} />
                      ))}
                    </BarChart>
                  ) : chart.chartType === 'line' ? (
                    <LineChart data={chart.data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey={chart.xAxisKey} stroke={currentPalette.text} opacity={0.6} tick={{ fontSize: 11 }} />
                      <YAxis stroke={currentPalette.text} opacity={0.6} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      {chart.series.map((s, i) => (
                        <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={currentPalette.colors[i % currentPalette.colors.length]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                      ))}
                    </LineChart>
                  ) : chart.chartType === 'area' ? (
                    <AreaChart data={chart.data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                      <defs>
                        {chart.series.map((s, i) => (
                          <linearGradient key={s.key} id={`grad_${s.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={currentPalette.colors[i % currentPalette.colors.length]} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={currentPalette.colors[i % currentPalette.colors.length]} stopOpacity={0} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey={chart.xAxisKey} stroke={currentPalette.text} opacity={0.6} tick={{ fontSize: 11 }} />
                      <YAxis stroke={currentPalette.text} opacity={0.6} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      {chart.series.map((s, i) => (
                        <Area key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={currentPalette.colors[i % currentPalette.colors.length]} fillOpacity={1} fill={`url(#grad_${s.key})`} />
                      ))}
                    </AreaChart>
                  ) : chart.chartType === 'donut' || chart.chartType === 'pie' ? (
                    <PieChart>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Pie
                        data={chart.data}
                        dataKey={chart.series[0]?.key || 'score'}
                        nameKey={chart.xAxisKey}
                        cx="50%"
                        cy="50%"
                        innerRadius={chart.chartType === 'donut' ? 70 : 0}
                        outerRadius={125}
                        paddingAngle={3}
                        label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                      >
                        {chart.data.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={currentPalette.colors[index % currentPalette.colors.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  ) : chart.chartType === 'radar' ? (
                    <RadarChart data={chart.data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                      <PolarGrid opacity={0.2} />
                      <PolarAngleAxis dataKey={chart.xAxisKey} stroke={currentPalette.text} opacity={0.7} tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis opacity={0.4} stroke={currentPalette.text} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      {chart.series.map((s, i) => (
                        <Radar key={s.key} name={s.name} dataKey={s.key} stroke={currentPalette.colors[i % currentPalette.colors.length]} fill={currentPalette.colors[i % currentPalette.colors.length]} fillOpacity={0.4} />
                      ))}
                    </RadarChart>
                  ) : (
                    <ComposedChart data={chart.data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey={chart.xAxisKey} stroke={currentPalette.text} opacity={0.6} tick={{ fontSize: 11 }} />
                      <YAxis stroke={currentPalette.text} opacity={0.6} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      {chart.series.map((s, i) =>
                        i % 2 === 0 ? (
                          <Bar key={s.key} dataKey={s.key} name={s.name} fill={currentPalette.colors[i % currentPalette.colors.length]} radius={[6, 6, 0, 0]} />
                        ) : (
                          <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={currentPalette.colors[i % currentPalette.colors.length]} strokeWidth={3} />
                        )
                      )}
                    </ComposedChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Data Table Editor Tab */}
          {activeTab === 'data' && (
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60">
                  Live Data Spreadsheet Editor
                </h3>
                <Button onClick={handleAddRow} variant="outline" className="btn-xs rounded-xl gap-1 font-bold">
                  <Plus className="w-3 h-3" /> Add Row
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-sm w-full text-xs">
                  <thead>
                    <tr className="border-b border-base-300 text-base-content/60 font-mono">
                      <th>#</th>
                      <th>{chart.xAxisKey} (Label)</th>
                      {chart.series.map((s) => (
                        <th key={s.key}>{s.name}</th>
                      ))}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.data.map((row, idx) => (
                      <tr key={idx} className="border-b border-base-300/40">
                        <td className="font-mono text-base-content/40">{idx + 1}</td>
                        <td>
                          <input
                            type="text"
                            value={row[chart.xAxisKey] || ''}
                            onChange={(e) => handleDataChange(idx, chart.xAxisKey, e.target.value)}
                            className="bg-base-200 border border-base-300 rounded-lg px-2 py-1 text-xs w-full"
                          />
                        </td>
                        {chart.series.map((s) => (
                          <td key={s.key}>
                            <input
                              type="number"
                              value={row[s.key] !== undefined ? row[s.key] : ''}
                              onChange={(e) => handleDataChange(idx, s.key, e.target.value)}
                              className="bg-base-200 border border-base-300 rounded-lg px-2 py-1 text-xs w-28 font-mono"
                            />
                          </td>
                        ))}
                        <td>
                          <button
                            onClick={() => handleDeleteRow(idx)}
                            className="btn btn-ghost btn-xs text-rose-400 hover:bg-rose-500/10 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
              <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60">
                ARLM Quantitative Synthesis & Executive Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {chart.meta.summaryInsights?.map((insight, i) => (
                  <div key={i} className="p-4 bg-base-200 border border-base-300 rounded-2xl flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs text-base-content/80 leading-relaxed font-medium">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
