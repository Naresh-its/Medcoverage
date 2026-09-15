import React from 'react';
import CoverageMap from '../components/CoverageMap/CoverageMap';
import { MEDICAL_NEEDS } from '../data/medicalNeeds';
import { Clock } from 'lucide-react';

export default function CoveragePage({ selectedNeedId, setSelectedNeedId }) {
  const [selectedSectorId, setSelectedSectorId] = React.useState('zone-central');
  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedNeedId) || MEDICAL_NEEDS[0];
  const currentSector = COVERAGE_ZONES.find(z => z.id === selectedSectorId) || COVERAGE_ZONES[0];

  return (
    <div className="w-full flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
            Interactive GIS Application
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Healthcare Coverage & Hospital Locator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            See where specialized emergency care is reachable — and where clinical dead zones exist.
          </p>
        </div>

        {/* Quick Scenario & Sector Selectors */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white border border-slate-200 flex items-center gap-2 px-3 py-2 rounded-xl shadow-2xs">
            <span className="text-xs font-bold text-emerald-700">Sector:</span>
            <select
              value={selectedSectorId}
              onChange={(e) => setSelectedSectorId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {COVERAGE_ZONES.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-slate-200 flex items-center gap-2 px-3 py-2 rounded-xl shadow-2xs">
            <span className="text-xs font-bold text-blue-700">Need:</span>
            <select
              value={selectedNeedId}
              onChange={(e) => setSelectedNeedId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {MEDICAL_NEEDS.map((need) => (
                <option key={need.id} value={need.id}>
                  {need.name} ({need.goldenWindowMin}m limit)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Clinical Scenario Bar */}
      <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Sector: {currentSector.name} • Active Condition: {currentNeed.name}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 truncate max-w-lg">
            Required: {currentNeed.requiredResources.map(r => r.label).join(' + ')}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Golden Window: <strong className="text-slate-900">{currentNeed.goldenWindowMin} min</strong></span>
        </div>
      </div>

      {/* Leaflet Map Frame */}
      <div className="w-full flex-1 min-h-[580px] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <CoverageMap
          selectedNeedId={selectedNeedId}
          selectedLocation={currentSector.center}
          height="580px"
        />
      </div>
    </div>
  );
}
