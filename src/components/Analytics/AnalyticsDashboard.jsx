import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, ReferenceLine, Legend 
} from 'recharts';
import { Activity, ShieldAlert, Users, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AnalyticsDashboard() {
  // KPI summary metrics
  const kpis = [
    { label: 'Overall Healthcare Coverage', value: '72%', change: '+4.2%', sub: 'Regional effective access' },
    { label: 'Emergency Care Coverage', value: '64%', change: '+2.1%', sub: 'Trauma & resuscitation ready' },
    { label: 'Population Covered', value: '1.8M', change: '82% of pop', sub: 'Within 30m golden window' },
    { label: 'Medical Dead Zones', value: '14%', change: '-3.8%', sub: 'High risk sectors' },
    { label: 'Avg Emergency Response', value: '18 min', change: '-4 min', sub: 'Baseline city-wide' },
  ];

  // Coverage readiness by Medical Need
  const needCoverageData = [
    { name: 'Severe Bleeding', coverage: 42, threshold: 70, fill: '#DC2626' },
    { name: 'Acute Stroke', coverage: 51, threshold: 70, fill: '#EA580C' },
    { name: 'Severe Trauma', coverage: 58, threshold: 70, fill: '#F59E0B' },
    { name: 'Urgent Dialysis', coverage: 78, threshold: 70, fill: '#10B981' },
    { name: 'General Emergency', coverage: 84, threshold: 70, fill: '#059669' },
    { name: 'Diagnostics', coverage: 88, threshold: 70, fill: '#059669' },
  ];

  // Response Time by Zone vs Golden Window Threshold (30 min)
  const zoneResponseData = [
    { name: 'Metro Central', responseMin: 8, standard: 15 },
    { name: 'South Corridor', responseMin: 12, standard: 15 },
    { name: 'West Suburban', responseMin: 23, standard: 15 },
    { name: 'North Logistics', responseMin: 29, standard: 15 },
    { name: 'East Industrial', responseMin: 32, standard: 15 },
  ];

  // Before vs After Simulation impact summary
  const beforeAfterData = [
    { metric: 'East Zone Coverage', before: 38, after: 72 },
    { metric: 'Response Time (min)', before: 32, after: 16 },
    { metric: 'ICU Accessibility (%)', before: 24, after: 68 },
    { metric: 'Pop with ALS Transport (%)', before: 35, after: 85 },
  ];

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
          Analytics & Intelligence
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
          Healthcare Accessibility Performance
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Synthesizes real-world facility density against clinical requirement constraints to reveal coverage disparities.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block truncate">
              {kpi.label}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {kpi.value}
            </div>
            <div className="flex items-center justify-between text-xs mt-1.5 text-slate-500">
              <span className="text-emerald-700 font-semibold">{kpi.change}</span>
              <span className="text-[10px] text-slate-400 truncate">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Chart 1: Coverage by Medical Need */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Effective Coverage by Medical Need
              </h3>
              <p className="text-xs text-slate-500">
                Hemorrhage and Stroke exhibit severe drops due to lack of co-located blood & rapid CT.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
              Target: 70%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={needCoverageData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#64748B' }} 
                  interval={0} 
                  angle={-15} 
                  textAnchor="end" 
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Coverage Readiness']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
                />
                <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Target 70%', fill: '#EF4444', fontSize: 10 }} />
                <Bar dataKey="coverage" radius={[4, 4, 0, 0]}>
                  {needCoverageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.coverage < 50 ? '#DC2626' : entry.coverage < 70 ? '#F59E0B' : '#10B981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Emergency Response Times by Sector */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Average Emergency Response Time (Minutes)
              </h3>
              <p className="text-xs text-slate-500">
                Peripheral industrial zones severely breach the 15-minute standard.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              Golden Standard: 15m
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneResponseData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#64748B' }} 
                  interval={0} 
                  angle={-15} 
                  textAnchor="end" 
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} domain={[0, 40]} />
                <Tooltip 
                  formatter={(value) => [`${value} min`, 'Response Time']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
                />
                <ReferenceLine y={15} stroke="#10B981" strokeDasharray="3 3" label={{ value: '15m Safe', fill: '#10B981', fontSize: 10 }} />
                <Bar dataKey="responseMin" fill="#0F172A" radius={[4, 4, 0, 0]}>
                  {zoneResponseData.map((entry, index) => (
                    <Cell key={`cell-resp-${index}`} fill={entry.responseMin > 25 ? '#DC2626' : entry.responseMin > 15 ? '#F59E0B' : '#0F172A'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}