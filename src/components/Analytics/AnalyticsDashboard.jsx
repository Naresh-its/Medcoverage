import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, ReferenceLine 
} from 'recharts';
import { AlertTriangle } from 'lucide-react';

export default function AnalyticsDashboard() {
  // Key Intelligence KPIs
  const kpis = [
    { 
      label: 'Overall Effective Coverage', 
      value: '72%', 
      change: '+4.2%', 
      sub: 'Regional accessibility',
      accent: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    { 
      label: 'Emergency Care Coverage', 
      value: '64%', 
      change: '+2.1%', 
      sub: 'Trauma & resuscitation ready',
      accent: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    { 
      label: 'Population Covered', 
      value: '1.8M', 
      change: '82% of pop', 
      sub: 'Within golden window',
      accent: 'text-slate-700 bg-slate-100 border-slate-200'
    },
    { 
      label: 'Medical Dead Zone %', 
      value: '14%', 
      change: '2 sectors', 
      sub: 'Critical access breach',
      accent: 'text-red-700 bg-red-50 border-red-200',
      isCritical: true
    },
    { 
      label: 'Avg Emergency Response', 
      value: '18 min', 
      change: '-4 min', 
      sub: 'Standard is 15 min',
      accent: 'text-amber-800 bg-amber-50 border-amber-200'
    },
  ];

  // Coverage readiness by Medical Need
  const needCoverageData = [
    { name: 'Severe Bleeding', coverage: 42, threshold: 70, status: 'dead_zone' },
    { name: 'Acute Stroke', coverage: 51, threshold: 70, status: 'limited' },
    { name: 'Severe Trauma', coverage: 58, threshold: 70, status: 'limited' },
    { name: 'Urgent Dialysis', coverage: 78, threshold: 70, status: 'covered' },
    { name: 'General Emergency', coverage: 84, threshold: 70, status: 'covered' },
    { name: 'Diagnostics', coverage: 88, threshold: 70, status: 'covered' },
  ];

  // Response Time by Zone vs Golden Standard (15 min)
  const zoneResponseData = [
    { name: 'Metro Central', responseMin: 8, standard: 15 },
    { name: 'South Corridor', responseMin: 12, standard: 15 },
    { name: 'West Suburban', responseMin: 23, standard: 15 },
    { name: 'North Logistics', responseMin: 29, standard: 15 },
    { name: 'East Industrial', responseMin: 32, standard: 15 },
  ];

  // Access Gap Breakdown ("Why Coverage Falls")
  const accessGapFactors = [
    { factor: 'Missing Specialized Modality', pct: 32, desc: 'Lacks Level-1 trauma bay, 24/7 CT scanner, or ICU bed' },
    { factor: 'Physical Distance & Transit', pct: 28, desc: 'Distance exceeds condition golden-window threshold' },
    { factor: 'Blood Bank Stockout (O-)', pct: 24, desc: 'Emergency blood unstocked or beyond rapid delivery radius' },
    { factor: 'Ambulance Turnout Delay', pct: 16, desc: 'No locally stationed ALS vehicle available for stat dispatch' },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block truncate">
              {kpi.label}
            </span>
            <div className={`text-2xl sm:text-3xl font-black mt-1 ${kpi.isCritical ? 'text-red-600' : 'text-slate-900'}`}>
              {kpi.value}
            </div>
            <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${kpi.accent}`}>
                {kpi.change}
              </span>
              <span className="text-[10px] text-slate-500 truncate">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Effective Coverage by Medical Need */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Effective Coverage by Medical Need
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluates clinical readiness against strict condition-specific constraints.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Target: 70%
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={needCoverageData} margin={{ top: 12, right: 10, left: -20, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} 
                  interval={0} 
                  angle={-18} 
                  textAnchor="end" 
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748B' }} 
                  domain={[0, 100]} 
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Coverage Readiness']}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                />
                <ReferenceLine y={70} stroke="#3B82F6" strokeDasharray="3 3" label={{ value: 'Target 70%', fill: '#2563EB', fontSize: 10, position: 'right' }} />
                <Bar dataKey="coverage" radius={[6, 6, 0, 0]} animationDuration={700}>
                  {needCoverageData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.coverage < 50 ? '#EF4444' : entry.coverage < 70 ? '#F59E0B' : '#10B981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Status Legend */}
          <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-slate-600 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
              <span>Covered (≥70%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
              <span>Limited (50–69%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500"></span>
              <span>Dead Zone (&lt;50%)</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Average Emergency Response Time */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Emergency Transit & Turnout (Minutes)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Regional response times compared against the 15-minute golden standard.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
              Standard: 15m
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneResponseData} margin={{ top: 12, right: 10, left: -20, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} 
                  interval={0} 
                  angle={-18} 
                  textAnchor="end" 
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748B' }} 
                  domain={[0, 40]} 
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} min`, 'Avg Response Time']}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                />
                <ReferenceLine y={15} stroke="#10B981" strokeDasharray="3 3" label={{ value: '15m Safe', fill: '#059669', fontSize: 10, position: 'right' }} />
                <Bar dataKey="responseMin" radius={[6, 6, 0, 0]} animationDuration={700}>
                  {zoneResponseData.map((entry, index) => (
                    <Cell 
                      key={`cell-resp-${index}`} 
                      fill={entry.responseMin > 25 ? '#EF4444' : entry.responseMin > 15 ? '#F59E0B' : '#0F172A'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-slate-600 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-900"></span>
              <span>Within Standard (≤15m)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
              <span>Delayed (16–25m)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500"></span>
              <span>Critical Breach (&gt;25m)</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Access Gap Intelligence ("Why Coverage Falls") */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Bottleneck Analysis
          </span>
          <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
            Why Coverage Falls: Proximity ≠ Access
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Physical distance accounts for less than one-third of coverage failures. Modality deficits and blood availability dominate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {accessGapFactors.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900">{item.pct}%</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Factor #{idx + 1}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 leading-snug">{item.factor}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Regional Insight Callout */}
        <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700 flex items-start gap-3 mt-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="text-slate-900 font-bold block">Regional Access Disparity Insight:</strong>
            <p>
              West Zone has multiple secondary clinics within 4 km, yet severe bleeding coverage remains at 62% because O− blood units are stockout-prone. In East Industrial Corridor, 380,000 workers experience a 38% medical dead zone due to 0 local ICU beds and an average 32-minute ambulance response.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
