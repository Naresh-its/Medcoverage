import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, ReferenceLine 
} from 'recharts';
import { MEDICAL_NEEDS } from '../../data/medicalNeeds';
import { COVERAGE_ZONES } from '../../data/coverageZones';
import { HOSPITALS, BLOOD_BANKS, AMBULANCES, DIAGNOSTICS, PHARMACIES } from '../../data/mockHealthcareData';
import { calculateEffectiveCoverage } from '../../engine';

const RESOURCES = { hospitals: HOSPITALS, bloodBanks: BLOOD_BANKS, ambulances: AMBULANCES, diagnostics: DIAGNOSTICS, pharmacies: PHARMACIES };

// Custom Tooltip for Coverage by Medical Need explaining clinical rationale
function CustomNeedTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  const gap = data.coverage - data.threshold;
  const isBelow = gap < 0;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl border border-slate-700 shadow-2xl max-w-xs text-xs space-y-2 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-bold text-sm text-white">{data.name}</span>
        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
          data.urgency === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
        }`}>
          {data.urgency}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-slate-400">Effective Coverage:</span>
        <span className="font-black text-base text-white">
          {data.coverage}%{' '}
          <span className={`text-xs font-semibold ${isBelow ? 'text-red-400' : 'text-emerald-400'}`}>
            ({isBelow ? `${gap}% Deficit` : `+${gap}% Over Target`})
          </span>
        </span>
      </div>

      {/* Clinical Rationale Callout */}
      <div className="pt-1 border-t border-slate-800">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
          Clinical Rationale & Bottleneck:
        </span>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          {data.clinicalRationale}
        </p>
      </div>

      {/* Required Resources List */}
      <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400">
        <span className="font-semibold text-slate-300">Required Infrastructure: </span>
        <span>{data.requiredResources}</span>
      </div>
    </div>
  );
}

// Custom Tooltip for response times versus the active clinical threshold
function CustomZoneTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  const isBreach = data.responseMin > data.standard;
  const breachMin = data.responseMin - data.standard;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl border border-slate-700 shadow-2xl max-w-xs text-xs space-y-2 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div>
          <span className="font-bold text-sm text-white block">{data.name}</span>
          <span className="text-[10px] text-slate-400">Sector {data.zoneCode} • {data.population} pop.</span>
        </div>
        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
          isBreach ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
        }`}>
          {data.status}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-slate-400">Ambulance Response:</span>
        <span className="font-black text-base text-white">
          {data.responseMin} min{' '}
          {isBreach && (
            <span className="text-xs font-semibold text-red-400">
              (+{breachMin}m Over {data.standard}m Standard)
            </span>
          )}
        </span>
      </div>

      {/* Spatial Bottleneck Explanation */}
      <div className="pt-1 border-t border-slate-800">
        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">
          Spatial Bottleneck Root Cause:
        </span>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          {data.spatialBottleneck}
        </p>
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  // KPI summary metrics
  const kpis = [
    { label: 'Overall Healthcare Coverage', value: '72%', change: '+4.2%', sub: 'Regional effective access' },
    { label: 'Emergency Care Coverage', value: '64%', change: '+2.1%', sub: 'Trauma & resuscitation ready' },
    { label: 'Population Covered', value: '1.8M', change: '82% of pop', sub: 'Within 30m golden window' },
    { label: 'Medical Dead Zones', value: '14%', change: '-3.8%', sub: 'High risk sectors' },
    { label: 'Avg Emergency Response', value: '18 min', change: '-4 min', sub: 'Baseline city-wide' },
  ];

  const needCoverageData = MEDICAL_NEEDS.map((need) => {
    const zoneResults = COVERAGE_ZONES.map((zone) => calculateEffectiveCoverage(zone, need, RESOURCES));
    const population = COVERAGE_ZONES.reduce((sum, zone) => sum + zone.population, 0);
    const weightedCoverage = zoneResults.reduce((sum, result, index) => (
      sum + result.effectiveCoveragePct * COVERAGE_ZONES[index].population
    ), 0);
    const result = zoneResults[0];
    return {
      name: need.name,
      coverage: Math.round(weightedCoverage / population),
      threshold: 70,
      urgency: need.urgency,
      goldenWindowMin: need.goldenWindowMin,
      clinicalRationale: result.primaryBottleneck.clinicalImpact,
      requiredResources: need.requiredResources.map((resource) => resource.label).join(', '),
    };
  });

  const activeNeed = MEDICAL_NEEDS[0];
  const zoneResponseData = COVERAGE_ZONES.map((zone) => {
    const result = calculateEffectiveCoverage(zone, activeNeed, RESOURCES);
    return {
      name: zone.name,
      responseMin: result.avgResponseMin,
      standard: activeNeed.goldenWindowMin,
      zoneCode: zone.code,
      status: result.status,
      spatialBottleneck: result.primaryBottleneck.title,
      population: zone.population.toLocaleString(),
    };
  });

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
                Hover over bars to inspect clinical rationales behind coverage drops.
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
                <Tooltip content={<CustomNeedTooltip />} />
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
                Average Emergency Response Time vs Clinical Threshold
              </h3>
              <p className="text-xs text-slate-500">
                Hover over sectors to inspect spatial bottleneck causes.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              Golden Standard: {activeNeed.goldenWindowMin}m
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
                <Tooltip content={<CustomZoneTooltip />} />
                <ReferenceLine y={activeNeed.goldenWindowMin} stroke="#10B981" strokeDasharray="3 3" label={{ value: `${activeNeed.goldenWindowMin}m Safe`, fill: '#10B981', fontSize: 10 }} />
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