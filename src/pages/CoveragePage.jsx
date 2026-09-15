import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CoverageMap from '../components/CoverageMap/CoverageMap';
import ErrorBoundary from '../components/Shared/ErrorBoundary';
import PageTransition from '../components/PageTransition';
import { COVERAGE_ZONES } from '../data/coverageZones';
import { MEDICAL_NEEDS } from '../data/medicalNeeds';
import { Clock, ArrowLeft, Navigation, X } from 'lucide-react';

export default function CoveragePage({ selectedNeedId, setSelectedNeedId }) {
  const location = useLocation();
  const navigate = useNavigate();

  const routeDataFromState = location.state?.routeData || null;
  const [activeRoute, setActiveRoute] = useState(routeDataFromState);

  const [selectedSectorId, setSelectedSectorId] = useState(() => {
    if (routeDataFromState?.selectedZoneId) return routeDataFromState.selectedZoneId;
    return 'zone-central';
  });

  // If navigation state changes, update activeRoute
  useEffect(() => {
    if (location.state?.routeData) {
      setActiveRoute(location.state.routeData);
      if (location.state.routeData.selectedZoneId) {
        setSelectedSectorId(location.state.routeData.selectedZoneId);
      }
      if (location.state.routeData.selectedDiseaseId && setSelectedNeedId) {
        setSelectedNeedId(location.state.routeData.selectedDiseaseId);
      }
    }
  }, [location.state, setSelectedNeedId]);

  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedNeedId) || MEDICAL_NEEDS[0];
  const currentSector = (COVERAGE_ZONES && COVERAGE_ZONES.find(z => z.id === selectedSectorId)) || (COVERAGE_ZONES && COVERAGE_ZONES[0]) || { name: 'Metro Central Core', center: { lat: 13.0720, lng: 80.2600 } };

  const handleReturnToSearch = () => {
    navigate('/', { 
      state: { 
        returnToResults: true, 
        selectedDiseaseId: activeRoute?.selectedDiseaseId || selectedNeedId,
        selectedZoneId: activeRoute?.selectedZoneId || selectedSectorId
      } 
    });
  };

  return (
    <PageTransition className="p-4 sm:p-6 lg:p-8 space-y-4">
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

      {/* Active Route Banner if route was triggered */}
      {activeRoute && (
        <div className="bg-blue-50/90 border border-blue-200 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-2xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Navigation className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="font-extrabold text-blue-900">
                Active Road Route Guidance:
              </span>{' '}
              <span className="text-blue-800 font-semibold">
                {activeRoute.origin?.name} ➔ {activeRoute.hospital?.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReturnToSearch}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to 4 Hospitals</span>
            </button>
            <button
              onClick={() => setActiveRoute(null)}
              className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
              title="Clear Route"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
        <ErrorBoundary
          title="Coverage Map Unavailable"
          message="The interactive coverage map could not be loaded. Please check your Mapbox configuration or refresh."
        >
          <CoverageMap
            selectedNeedId={selectedNeedId}
            selectedLocation={currentSector.center}
            activeRoute={activeRoute}
            onClearRoute={() => setActiveRoute(null)}
            onReturnToSearch={handleReturnToSearch}
            height="580px"
          />
        </ErrorBoundary>
      </div>
    </PageTransition>
  );
}
