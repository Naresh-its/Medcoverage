import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, ReferenceLine 
} from 'recharts';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnalyticsDashboard() {
  // 4 Primary Decision Metrics
  const kpis = [
    { label: 'City Safe Access Level', value: '72%', change: 'Goal: Over 85%', sub: 'Across 5 city sectors' },
    { label: 'Protected Population', value: '1.8M', change: '82% of residents', sub: 'Within 30m window' },
    { label: 'Areas Facing Delays', value: '2 Sectors', change: 'East & North areas', sub: 'Missing blood or scanners' },
    { label: 'Average Ambulance Arrival', value: '18 min', change: 'Target: 15 min', sub: 'Slightly above standard' },
  ];

  // Question 1: Where are the biggest coverage gaps by medical emergency?
  const needCoverageData = [
    { name: 'Heavy Bleeding', coverage: 42, threshold: 70, fill: '#DC2626' },
    { name: 'Stroke', coverage: 51, threshold: 70, fill: '#EA580C' },
    { name: 'Severe Trauma', coverage: 58, threshold: 70, fill: '#F59E0B' },
    { name: 'Kidney Dialysis', coverage: 78, threshold: 70, fill: '#10B981' },
    { name: 'General Emergency', coverage: 84, threshold: 70, fill: '#059669' },
    { name: 'Diagnostics', coverage: 88, threshold: 70, fill: '#059669' },
  ];

  // Question 2: Which sectors exceed the 15-minute emergency response threshold?
  const zoneResponseData = [
    { name: 'Metro Central', responseMin: 8, standard: 15 },
    { name: 'South Corridor', responseMin: 12, standard: 15 },
    { name: 'West Suburban', responseMin: 23, standard: 15 },
    { name: 'North Logistics', responseMin: 29, standard: 15 },
    { name: 'East Industrial', responseMin: 32, standard: 15 },
  ];

  // Question 3: Which intervention delivers the highest impact per capital dollar?
  const roiRankings = [
    {
      rank: '1',
      title: 'Add 1 Regional Blood Storage Unit',
      gain: '+43% Gain',
      population: '+225,000 people',
      capex: 'Cost: $320k',
      recommendation: '⭐ Best Community Investment: Solves the fatal blood shortage across East and West sectors.',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    {
      rank: '2',
      title: 'Add 2 Emergency Ambulances',
      gain: '+34% Gain',
      population: '+180,000 people',
      capex: 'Cost: $160k',
      recommendation: 'Fastest Fix: Cuts ambulance arrival times in half in the outer industrial zones within 4 weeks.',
      badgeClass: 'bg-blue-100 text-blue-900 border-blue-300'
    },
    {
      rank: '3',
      title: 'Add 1 Emergency ICU Bed Unit',
      gain: '+17% Gain',
      population: '+95,000 people',
      capex: 'Cost: $850k',
      recommendation: 'Higher Cost: Provides advanced intensive care, but mainly benefits one hospital perimeter.',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
    }
  ];

  return (
    <div className="space-y-6 text-left">

      {/* 1. Clear Main Finding */}
      <div className="bg-blue-50/70 border border-blue-200 p-6 rounded-2xl space-y-2 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
            Key Public Health Finding
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          Severe bleeding and stroke face the biggest delays because blood banks and scanners are located only downtown.
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          While routine clinics are close to 82% of families, <strong>only 42% of residents</strong> in outer neighborhoods can reach donor blood or a stroke scanner within the critical 30-minute window.
        </p>
      </div>

      {/* 2. Key Indicator Numbers Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1"
          >
            <span className="text-xs text-slate-500 font-semibold block truncate">
              {kpi.label}
            </span>
            <div className="text-3xl font-extrabold text-slate-900">
              {kpi.value}
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-blue-700 font-bold">{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Question-Driven Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Question 1 */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Question 1
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Which emergencies face the longest delays?
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
              Safe Target: 70%
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={needCoverageData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  interval={0} 
                  angle={-15} 
                  textAnchor="end" 
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Safe Coverage']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <ReferenceLine y={70} stroke="#DC2626" strokeDasharray="4 4" label={{ value: 'Target 70%', fill: '#DC2626', fontSize: 11 }} />
                <Bar dataKey="coverage" radius={[4, 4, 0, 0]}>
                  {needCoverageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.coverage < 50 ? '#DC2626' : entry.coverage < 70 ? '#F59E0B' : '#059669'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 font-medium">
            ⚠️ <strong>Critical Gap:</strong> Heavy Bleeding (42%) and Stroke (51%) fall far below the safe 70% standard.
          </div>
        </div>

        {/* Question 2 */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Question 2
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Which neighborhoods wait the longest for an ambulance?
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800">
              Goal: Under 15m
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneResponseData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  interval={0} 
                  angle={-15} 
                  textAnchor="end" 
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} domain={[0, 40]} />
                <Tooltip 
                  formatter={(value) => [`${value} min`, 'Wait Time']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <ReferenceLine y={15} stroke="#059669" strokeDasharray="3 3" label={{ value: '15m Safe Goal', fill: '#059669', fontSize: 11 }} />
                <Bar dataKey="responseMin" radius={[4, 4, 0, 0]}>
                  {zoneResponseData.map((entry, index) => (
                    <Cell key={`cell-resp-${index}`} fill={entry.responseMin > 25 ? '#DC2626' : entry.responseMin > 15 ? '#F59E0B' : '#0F172A'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
            ⏱️ <strong>Wait Warning:</strong> East Industrial (32 min) and North (29 min) wait more than double the 15-minute standard.
          </div>
        </div>

      </div>

      {/* 4. Question 3 */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Question 3
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              What is the most effective solution for our community?
            </h3>
          </div>
          <Link
            to="/what-if"
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Test Solutions in Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {roiRankings.map((item) => (
            <div
              key={item.rank}
              className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    #{item.rank}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${item.badgeClass}`}>
                    {item.gain}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mt-2.5">{item.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.recommendation}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 text-xs flex items-center justify-between text-slate-500 font-semibold">
                <span className="text-slate-800">{item.capex}</span>
                <span className="text-emerald-700">{item.population}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}