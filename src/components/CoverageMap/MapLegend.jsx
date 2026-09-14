import React from 'react';
import { Activity, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function MapLegend({ resourceFilters, toggleFilter }) {
  const resourceItems = [
    { key: 'hospitals', label: 'Hospitals', emoji: '🏥', color: '#DC2626' },
    { key: 'bloodBanks', label: 'Blood Banks', emoji: '🩸', color: '#991B1B' },
    { key: 'ambulances', label: 'Ambulances', emoji: '🚑', color: '#EA580C' },
    { key: 'diagnostics', label: 'Diagnostics', emoji: '🧪', color: '#2563EB' },
    { key: 'pharmacies', label: 'Pharmacies', emoji: '💊', color: '#059669' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-slate-200 p-3.5 shadow-sm text-xs space-y-3">
      {/* Coverage Status Legend */}
      <div>
        <div className="font-bold text-slate-900 mb-1.5 flex items-center justify-between">
          <span>Effective Coverage</span>
          <span className="text-[10px] text-slate-500">Demo Data</span>
        </div>
        <div className="grid grid-cols-1 gap-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600 inline-block"></span>
            <span className="font-medium text-slate-700">Covered</span>
            <span className="text-slate-400 text-[10px]">(≥70% readiness)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600 inline-block"></span>
            <span className="font-medium text-slate-700">Limited Access</span>
            <span className="text-slate-400 text-[10px]">(50–69%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-red-600 inline-block animate-pulse"></span>
            <span className="font-bold text-red-700">Medical Dead Zone</span>
            <span className="text-slate-400 text-[10px]">(&lt;50%)</span>
          </div>
        </div>
      </div>

      {/* Resource Type Filter Toggles */}
      <div className="pt-2.5 border-t border-slate-100">
        <div className="font-bold text-slate-900 mb-1.5">
          Resource Filters
        </div>
        <div className="flex flex-wrap gap-1.5">
          {resourceItems.map((res) => {
            const isChecked = resourceFilters[res.key];
            return (
              <button
                key={res.key}
                onClick={() => toggleFilter(res.key)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-400 line-through opacity-60'
                }`}
              >
                <span>{res.emoji}</span>
                <span>{res.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}