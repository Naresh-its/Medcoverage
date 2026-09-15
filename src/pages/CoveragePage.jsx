import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import CoverageMap from '../components/CoverageMap/CoverageMap';
import { MEDICAL_NEEDS } from '../data/medicalNeeds';
import { Clock } from 'lucide-react';

export default function CoveragePage({ selectedNeedId, setSelectedNeedId, activeSimulation, setActiveSimulation }) {
  const navigate = useNavigate();
  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedNeedId) || MEDICAL_NEEDS[0];

  const handleSimulateIntervention = (zone, intervention) => {
    setActiveSimulation({
      targetZoneId: zone.id,
      name: `${intervention.title} in ${zone.name}`,
      simulatedMarker: {
        id: 'sim-amb-new-1',
        name: `Simulated ALS Unit (${zone.name})`,
        type: 'ALS Ambulance',
        location: zone.center,
        isSimulated: true
      }
    });
    navigate('/what-if');
  };

  return (
    <PageTransition>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-7xl mx-auto w-full flex-1 flex flex-col">
        
        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                Community Access Map
              </span>
              <span className="text-xs font-bold text-red-800 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200">
                2 Areas Facing Delays
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Find Emergency Coverage in Your Area
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Click any colored area on the map to see ambulance arrival times and missing hospital equipment.
            </p>
          </div>

          {/* Quick Condition Selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 border border-slate-300 px-3.5 py-2 rounded-xl shadow-2xs">
            <span className="text-xs font-semibold text-slate-600">Emergency:</span>
            <select
              value={selectedNeedId}
              onChange={(e) => setSelectedNeedId(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-slate-900 focus:outline-none cursor-pointer pr-1"
            >
              {MEDICAL_NEEDS.map((need) => (
                <option key={need.id} value={need.id}>
                  {need.name} ({need.goldenWindowMin}m limit)
                </option>
              ))}
            </select>
            <div className="h-4 w-px bg-slate-300 mx-1" />
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <Clock className="w-3.5 h-3.5 text-blue-700" />
              <span>Target: <strong>{currentNeed.goldenWindowMin}m</strong></span>
            </div>
          </div>
        </div>

        {/* Leaflet Map Frame */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex-1 min-h-[580px] relative">
          <CoverageMap
            selectedNeedId={selectedNeedId}
            activeSimulation={activeSimulation}
            onSimulateIntervention={handleSimulateIntervention}
          />
        </div>

        {/* Bottom Guidance Bar */}
        <div className="py-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Map Guide: 🟢 Green = Safe (Under 15m) • 🟡 Yellow = Slow (Over 15m) • 🔴 Red = Dangerous Delay (Missing Tools)</span>
          </div>
          <button
            onClick={() => navigate('/what-if')}
            className="text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Plan Community Improvements →</span>
          </button>
        </div>

      </div>
    </PageTransition>
  );
}