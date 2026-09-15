import React from 'react';
import { Activity } from 'lucide-react';
import { MEDICAL_NEEDS } from '../../data/medicalNeeds';

export default function MapLegend({ 
  resourceFilters, 
  toggleFilter, 
  selectedNeedId, 
  activeSimulation 
}) {
  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedNeedId) || MEDICAL_NEEDS[0];

  const resourceItems = [
    { key: 'hospitals', label: 'Hospitals', emoji: '🏥', color: '#DC2626' },
    { key: 'bloodBanks', label: 'Blood Banks', emoji: '🩸', color: '#991B1B' },
    { key: 'ambulances', label: 'Ambulances', emoji: '🚑', color: '#EA580C' },
    { key: 'diagnostics', label: 'Diagnostics', emoji: '🧪', color: '#2563EB' },
    { key: 'pharmacies', label: 'Pharmacies', emoji: '💊', color: '#059669' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 p-3.5 shadow-lg text-xs space-y-3 max-w-[260px] select-none">
      {/* Coverage Status Legend */}
      <div>
        <div className="font-bold text-slate-900 mb-1.5 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-slate-700">Effective Coverage</span>
          <span className="text-[10px] text-slate-400 font-medium">GIS Model</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600 inline-block shrink-0"></span>
            <span className="font-medium text-slate-700">Covered</span>
            <span className="text-slate-400 text-[10px] ml-auto">(≥70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600 inline-block shrink-0"></span>
            <span className="font-medium text-slate-700">Limited Access</span>
            <span className="text-slate-400 text-[10px] ml-auto">(50–69%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-red-600 inline-block shrink-0 animate-pulse"></span>
            <span className="font-bold text-red-700">Medical Dead Zone</span>
            <span className="text-slate-400 text-[10px] ml-auto">(&lt;50%)</span>
          </div>
        </div>
      </div>

      {/* Clinical Capability Filter Indicator */}
      <div className="pt-2.5 border-t border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Active Clinical Filter
          </span>
        </div>
        <div className="p-2 rounded-lg bg-red-50/70 border border-red-100 text-[11px] space-y-1">
          <div className="font-bold text-slate-900 truncate">
            {currentNeed.name}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>Vibrant: Meets requirement</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-300 border border-dashed border-slate-400 shrink-0"></span>
            <span>Dimmed: Lacks capacity</span>
          </div>
        </div>
      </div>

      {/* Active Simulation Legend Entry */}
      {activeSimulation && (
        <div className="pt-2 border-t border-slate-100">
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Simulated Resource</span>
            </div>
            <p className="text-[10px] text-emerald-800 leading-snug">
              Pulsing marker denotes newly placed virtual infrastructure.
            </p>
          </div>
        </div>
      )}

      {/* Resource Type Filter Toggles */}
      <div className="pt-2.5 border-t border-slate-100">
        <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wider mb-1.5">
          Resource Layers
        </div>
        <div className="flex flex-wrap gap-1">
          {resourceItems.map((res) => {
            const isChecked = resourceFilters[res.key];
            return (
              <button
                key={res.key}
                type="button"
                onClick={() => toggleFilter(res.key)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold border transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-slate-100/90 border-slate-300 text-slate-900 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-400 line-through opacity-50'
                }`}
                title={`Toggle ${res.label} layer`}
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