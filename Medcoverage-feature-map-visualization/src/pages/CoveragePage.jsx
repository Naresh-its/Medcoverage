import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import CoverageMap from '../components/CoverageMap/CoverageMap';
import { MEDICAL_NEEDS } from '../data/medicalNeeds';
import { calculateSimulationResult } from '../data/simulationPresets';
import { Clock, ArrowRight } from 'lucide-react';

export default function CoveragePage({ selectedNeedId, setSelectedNeedId, activeSimulation, setActiveSimulation }) {
  const navigate = useNavigate();
  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedNeedId) || MEDICAL_NEEDS[0];

  const handleSimulateIntervention = (zone, intervention) => {
    const result = calculateSimulationResult(
      zone,
      intervention.action || 'ADD',
      intervention.resourceType || 'ambulance',
      intervention.quantity || 1
    );

    const markerType = intervention.resourceType === 'blood_bank'
      ? 'Blood Bank'
      : intervention.resourceType === 'hospital' || intervention.resourceType === 'icu'
      ? 'Level-2 Trauma Center'
      : 'ALS Ambulance';

    setActiveSimulation({
      targetZoneId: zone.id,
      name: `${intervention.title} in ${zone.name}`,
      simulatedMarker: {
        id: `sim-${zone.id}-${intervention.resourceType || 'resource'}`,
        name: `Simulated ${markerType} (${zone.name})`,
        type: markerType,
        location: zone.center,
        isSimulated: true
      },
      result
    });
    navigate('/what-if');
  };

  return (
    <PageTransition>
      <div className="p-6 sm:p-8 space-y-5">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200/70">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
              Interactive GIS Application
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Healthcare Coverage
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              See where essential care is reachable — and where it isn't.
            </p>
          </div>

          {/* Quick Scenario Selector inside Glass Pill */}
          <div className="glass-card flex items-center gap-2 px-3 py-2 rounded-xl">
            <span className="text-xs font-bold text-slate-700">Need:</span>
            <select
              value={selectedNeedId}
              onChange={(e) => setSelectedNeedId(e.target.value)}
              className="bg-white/80 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              {MEDICAL_NEEDS.map((need) => (
                <option key={need.id} value={need.id}>
                  {need.name} ({need.goldenWindowMin}m limit)
                </option>
              ))}
            </select>
            <button
              onClick={() => navigate('/needs')}
              className="text-xs text-red-600 font-bold hover:underline ml-1"
            >
              Analyze →
            </button>
          </div>
        </div>

        {/* Selected Clinical Scenario Bar */}
        <div className="glass-card p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Active: {currentNeed.name}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 truncate max-w-lg">
              Required: {currentNeed.requiredResources.map(r => r.label).join(' + ')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
            <Clock className="w-3.5 h-3.5 text-red-600" />
            <span>Golden Window: <strong className="text-slate-900">{currentNeed.goldenWindowMin} min</strong></span>
          </div>
        </div>

        {/* Leaflet Map Frame */}
        <div className="rounded-xl overflow-hidden border border-white/80 shadow-md">
          <CoverageMap
            selectedNeedId={selectedNeedId}
            activeSimulation={activeSimulation}
            onSimulateIntervention={handleSimulateIntervention}
          />
        </div>

        {/* Footer tip */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
          <span>Click any red sector on the map to inspect clinical bottlenecks.</span>
          <button
            onClick={() => navigate('/what-if')}
            className="text-red-600 font-bold hover:underline flex items-center gap-1"
          >
            Open What-If Simulator <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </PageTransition>
  );
}