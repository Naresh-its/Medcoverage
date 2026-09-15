import React from 'react';

export default function MapLegend({ resourceFilters, toggleFilter }) {
  const resourceItems = [
    { key: 'hospitals', label: 'Hospitals', emoji: '🏥' },
    { key: 'bloodBanks', label: 'Blood Banks', emoji: '🩸' },
    { key: 'ambulances', label: 'Ambulances', emoji: '🚑' },
    { key: 'diagnostics', label: 'Diagnostics', emoji: '🧪' },
    { key: 'pharmacies', label: 'Pharmacies', emoji: '💊' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-md text-xs space-y-3 max-w-[240px]">
      {/* Coverage Status Legend */}
      <div>
        <div className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Map Key</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shrink-0" />
            <span className="font-bold text-slate-800">Safe Access</span>
            <span className="text-slate-500 text-[11px] ml-auto">Under 15m</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shrink-0" />
            <span className="font-semibold text-slate-700">Slow Access</span>
            <span className="text-slate-500 text-[11px] ml-auto">Over 15m</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block shrink-0" />
            <span className="font-bold text-red-700">Dangerous Delay</span>
            <span className="text-red-700 text-[11px] font-bold ml-auto">Tools Missing</span>
          </div>
        </div>
      </div>

      {/* Resource Type Filter Toggles */}
      <div className="pt-2 border-t border-slate-100">
        <div className="font-bold text-slate-700 text-xs mb-1.5">
          Show on Map:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {resourceItems.map((res) => {
            const isChecked = resourceFilters[res.key];
            return (
              <button
                key={res.key}
                onClick={() => toggleFilter(res.key)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-blue-700 border-blue-700 text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-500'
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