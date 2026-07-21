'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Download, FileText, Calendar, Activity, FolderKanban, AlertTriangle, ShieldCheck, Database, FileSpreadsheet, BrainCircuit, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label, ProgressBar, RangeCalendar } from "@heroui/react";
import { parseDate } from "@internationalized/date";

// Colors for charts
const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];
const CHART_TEXT = '#94a3b8'; // slate-400
const CHART_GRID = '#334155'; // slate-700

interface AnalyticsData {
  kpis: {
    activeProjects: number;
    documentsProcessed: number;
    aiDecisions: number;
    proposalSuccess: number;
    complianceScore: number;
    riskScore: number;
    teamActivity: number;
    storageUsage: string;
  };
  charts: {
    documentsOverTime: { name: string; value: number }[];
    aiUsage: { name: string; value: number }[];
    projectStatus: { name: string; value: number }[];
    riskDistribution: { name: string; value: number }[];
    requirementCoverage: { name: string; value: number }[];
  };
}

export default function AnalyticsClient({ organizationId }: { organizationId: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [showCalendar, setShowCalendar] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData(days);
  }, [days]);

  const fetchData = async (daysFilter: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?organizationId=${organizationId}&days=${daysFilter}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!data) return;
    
    // Simple CSV generation from KPIs
    const kpiRows = Object.entries(data.kpis).map(([k, v]) => `${k},${v}`);
    const csvContent = "data:text/csv;charset=utf-8," + "Metric,Value\n" + kpiRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `synaps_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const KpiCard = ({ title, value, icon: Icon, colorClass, suffix = '', progress, progressColor = "default" }: any) => (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between h-full gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-foreground">{value}{suffix}</h3>
        </div>
        <div className={cn("p-3 rounded-lg bg-opacity-10", colorClass.bg, colorClass.text)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {progress !== undefined && (
        <div className="mt-2 w-full">
          <ProgressBar aria-label={title} color={progressColor} value={progress} className="w-full">
            <ProgressBar.Output />
            <ProgressBar.Track>
              <ProgressBar.Fill />
            </ProgressBar.Track>
          </ProgressBar>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 pb-12" ref={dashboardRef}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Executive Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time metrics and intelligence overview.</p>
        </div>
        
        {/* Print-hidden controls */}
        <div className="flex items-center gap-3 print:hidden">
          <div className="flex items-center bg-card border border-border rounded-lg p-1">
            {[7, 30, 90, 365].map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  days === d ? "bg-primary/10 text-primary glow-purple" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {d === 365 ? '1Y' : `${d}D`}
              </button>
            ))}
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                showCalendar ? "bg-primary/10 text-primary glow-purple" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Custom
            </button>
          </div>
          
          <button onClick={handleExportCSV} className="flex items-center px-3 py-2 bg-card border border-border hover:bg-muted text-sm font-medium rounded-lg transition-colors">
            <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-500" />
            CSV
          </button>
          
          <button onClick={handleExportPDF} className="flex items-center px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </button>
        </div>
      </div>

      {loading || !data ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {showCalendar && (
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm inline-block">
              <h3 className="text-sm font-semibold text-foreground mb-4">Select Custom Range</h3>
              <RangeCalendar
                aria-label="Analytics date range"
                defaultValue={{end: parseDate("2026-07-16"), start: parseDate("2026-07-01")}}
                firstDayOfWeek="mon"
              >
                <RangeCalendar.Header>
                  <RangeCalendar.Heading />
                  <RangeCalendar.NavButton slot="previous" />
                  <RangeCalendar.NavButton slot="next" />
                </RangeCalendar.Header>
                <RangeCalendar.Grid>
                  <RangeCalendar.GridHeader>
                    {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
                  </RangeCalendar.GridHeader>
                  <RangeCalendar.GridBody>
                    {(date) => <RangeCalendar.Cell date={date} />}
                  </RangeCalendar.GridBody>
                </RangeCalendar.Grid>
              </RangeCalendar>
            </div>
          )}

          {/* KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Active Projects" value={data.kpis.activeProjects} icon={FolderKanban} colorClass={{bg:'bg-blue-500/20', text:'text-blue-500'}} />
            <KpiCard title="Documents Processed" value={data.kpis.documentsProcessed} icon={FileText} colorClass={{bg:'bg-indigo-500/20', text:'text-indigo-500'}} />
            <KpiCard title="AI Decisions" value={data.kpis.aiDecisions} icon={BrainCircuit} colorClass={{bg:'bg-purple-500/20', text:'text-purple-500'}} />
            <KpiCard title="Proposal Success" value={data.kpis.proposalSuccess} suffix="%" progress={data.kpis.proposalSuccess} progressColor="success" icon={CheckSquare} colorClass={{bg:'bg-emerald-500/20', text:'text-emerald-500'}} />
            
            <KpiCard title="Compliance Score" value={data.kpis.complianceScore} suffix="%" progress={data.kpis.complianceScore} progressColor={data.kpis.complianceScore > 80 ? "success" : data.kpis.complianceScore > 50 ? "warning" : "danger"} icon={ShieldCheck} colorClass={{bg:'bg-green-500/20', text:'text-green-500'}} />
            <KpiCard title="Risk Score" value={data.kpis.riskScore} progress={data.kpis.riskScore} progressColor={data.kpis.riskScore > 50 ? "danger" : data.kpis.riskScore > 20 ? "warning" : "success"} icon={AlertTriangle} colorClass={{bg:'bg-amber-500/20', text:'text-amber-500'}} />
            <KpiCard title="Team Activity" value={data.kpis.teamActivity} icon={Activity} colorClass={{bg:'bg-rose-500/20', text:'text-rose-500'}} />
            <KpiCard title="Storage Usage" value={data.kpis.storageUsage} suffix=" MB" icon={Database} colorClass={{bg:'bg-slate-500/20', text:'text-slate-500'}} />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-4">Documents Processed Over Time</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.charts.documentsOverTime}>
                    <defs>
                      <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                    <XAxis dataKey="name" stroke={CHART_TEXT} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke={CHART_TEXT} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} itemStyle={{ color: '#e2e8f0' }} />
                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorDocs)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-4">AI Model Usage</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.charts.aiUsage}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                    <XAxis dataKey="name" stroke={CHART_TEXT} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke={CHART_TEXT} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: '#334155'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 break-inside-avoid">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-4">Project Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.charts.projectStatus}
                      cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                    >
                      {data.charts.projectStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-4">Risk Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.charts.riskDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} horizontal={false} />
                    <XAxis type="number" stroke={CHART_TEXT} fontSize={12} hide />
                    <YAxis dataKey="name" type="category" stroke={CHART_TEXT} fontSize={12} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#334155'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} >
                      {data.charts.riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'CRITICAL' ? '#ef4444' : entry.name === 'HIGH' ? '#f97316' : entry.name === 'MEDIUM' ? '#f59e0b' : '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-4">Requirement Coverage</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.charts.requirementCoverage}
                      cx="50%" cy="50%" innerRadius={0} outerRadius={80} dataKey="value"
                    >
                      {data.charts.requirementCoverage.map((entry, index) => {
                        const colorMap: Record<string, string> = { 'COVERED': '#10b981', 'PARTIALLY_COVERED': '#f59e0b', 'MISSING': '#ef4444', 'UNKNOWN': '#64748b' };
                        return <Cell key={`cell-${index}`} fill={colorMap[entry.name] || COLORS[index % COLORS.length]} />;
                      })}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Print CSS Override */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; color: black !important; }
          .bg-card { background: white !important; border: 1px solid #e2e8f0 !important; color: black !important; }
          .text-foreground { color: black !important; }
          .text-muted-foreground { color: #475569 !important; }
          nav, aside, header { display: none !important; }
          main { padding: 0 !important; overflow: visible !important; height: auto !important; }
          .print\\:hidden { display: none !important; }
          .recharts-text { fill: #475569 !important; }
          .recharts-cartesian-grid-horizontal line, .recharts-cartesian-grid-vertical line { stroke: #e2e8f0 !important; }
        }
      `}} />
    </div>
  );
}
