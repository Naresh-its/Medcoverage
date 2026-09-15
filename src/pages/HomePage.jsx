import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, Stethoscope, Phone,
  Bed, Clock, CheckCircle2, AlertTriangle, ArrowRight, 
  Zap, Check, X, Activity, Compass
} from 'lucide-react';
import { MEDICAL_NEEDS } from '../data/medicalNeeds';
import { REGIONAL_SECTORS, getRankedHospitalsForRegion } from '../data/regionalHospitalData';
import DemoNavigationModal from '../components/CoverageMap/DemoNavigationModal';

export default function HomePage({ selectedNeedId, setSelectedNeedId }) {

  // Search State
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(selectedNeedId || 'severe_bleeding');
  const [selectedZoneId, setSelectedZoneId] = useState('zone-central');
  const [hasSearched, setHasSearched] = useState(true);
  const [isSearchingAnim, setIsSearchingAnim] = useState(false);

  // Active Navigation State (when user clicks [View Hospital])
  const [activeNavHospital, setActiveNavHospital] = useState(null);

  // Active Need & Sector
  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedDiseaseId) || MEDICAL_NEEDS[0];
  const currentSector = REGIONAL_SECTORS.find(s => s.id === selectedZoneId) || REGIONAL_SECTORS[0];

  // Retrieve the 4 distinct ranked hospitals for the selected region and medical condition
  // Strictly guarantees: 2 GREEN, 1 YELLOW, 1 RED
  const rankedHospitals = getRankedHospitalsForRegion(currentSector.id, currentNeed.id);

  // Trigger search with animation
  const handleSearch = () => {
    setIsSearchingAnim(true);
    if (setSelectedNeedId) {
      setSelectedNeedId(selectedDiseaseId);
    }
    setTimeout(() => {
      setIsSearchingAnim(false);
      setHasSearched(true);
    }, 280);
  };

  // Open simulated demo navigation for the clicked hospital
  const handleOpenNavigation = (h) => {
    setActiveNavHospital(h);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start pb-16 px-4 sm:px-6 lg:px-8">
      
      {/* ========================================================================= */}
      {/* 1. HERO & SEARCH CONSOLE */}
      {/* ========================================================================= */}
      <div className="w-full max-w-5xl pt-6 sm:pt-8 pb-4 text-center space-y-3">
        
        {/* Top Clinical Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Regional Healthcare Intelligence & Capability Matching</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Find the <span className="text-blue-600">Right Emergency Hospital</span> in Seconds
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-medium">
          Evaluates condition-specific clinical readiness against golden-hour transit limits. Changing your sector reveals local facilities and clinical bottlenecks.
        </p>

        {/* Search Box Shell */}
        <div className="relative mt-5 max-w-4xl mx-auto w-full">
          <div className="relative rounded-2xl p-3 bg-white border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
            
            {/* 1. Condition Selector */}
            <div className="md:col-span-5 text-left bg-slate-50 hover:bg-slate-100/80 p-2.5 rounded-xl border border-slate-200/80 transition-colors">
              <label className="text-[10px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1 mb-0.5">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                Medical Need / Disease
              </label>
              <select
                value={selectedDiseaseId}
                onChange={(e) => {
                  setSelectedDiseaseId(e.target.value);
                  if (setSelectedNeedId) setSelectedNeedId(e.target.value);
                }}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                {MEDICAL_NEEDS.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} ({n.goldenWindowMin}m limit)
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Sector Selector (Supports 8 distinct Chennai sectors) */}
            <div className="md:col-span-4 text-left bg-slate-50 hover:bg-slate-100/80 p-2.5 rounded-xl border border-slate-200/80 transition-colors">
              <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1 mb-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Your Sector / Location
              </label>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                {REGIONAL_SECTORS.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Tactile Action Button */}
            <div className="md:col-span-3">
              <button
                onClick={handleSearch}
                className="btn-med-primary w-full py-3 px-4 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold cursor-pointer"
              >
                {isSearchingAnim ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Locating...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Find Hospitals</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Quick Filter Condition Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Select:</span>
            {MEDICAL_NEEDS.map((n) => {
              const isSelected = n.id === selectedDiseaseId;
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    setSelectedDiseaseId(n.id);
                    if (setSelectedNeedId) setSelectedNeedId(n.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                  }`}
                >
                  {n.name}
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. REGION-SPECIFIC HOSPITAL RESULTS (2 GREEN, 1 YELLOW, 1 RED) */}
      {/* ========================================================================= */}
      {hasSearched && (
        <div className="w-full max-w-5xl space-y-4 mt-4 animate-in fade-in duration-200">
          
          {/* Result Summary Bar with Simulated Origin Notice */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">
                    <strong className="text-blue-600">{rankedHospitals.length} suitable hospitals</strong> identified for {currentNeed.name} in <span className="text-emerald-700 font-bold">{currentSector.name}</span>
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Origin: {currentSector.simulatedOrigin.name}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Requirement: {currentNeed.requiredResources.map(r => r.label).join(' + ')} • Golden Window: <strong className="text-slate-900">{currentNeed.goldenWindowMin} min</strong>
                </span>
              </div>
            </div>

            <Link
              to="/coverage"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors shrink-0"
            >
              <span>View Coverage Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 4 Distinct Hospital Cards per Location */}
          <div className="space-y-3">
            {rankedHospitals.map((h, idx) => {
              const isTop = idx === 0;
              const isGreen = h.displayStatus === 'green';
              const isYellow = h.displayStatus === 'yellow';

              // Badge styling strictly by semantic accessibility status
              const statusBadgeStyle = isGreen
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : isYellow
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-red-50 text-red-800 border-red-300';

              const cardBorder = isTop
                ? 'border-2 border-emerald-500/80 shadow-md ring-1 ring-emerald-100'
                : isGreen
                  ? 'border border-slate-200 hover:border-emerald-400 shadow-2xs'
                  : isYellow
                    ? 'border border-slate-200 hover:border-amber-400 shadow-2xs'
                    : 'border border-slate-200 hover:border-red-400 shadow-2xs';

              return (
                <div 
                  key={h.id}
                  className={`rounded-xl p-5 bg-white transition-all ${cardBorder}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    
                    {/* Left: Hospital Info & Capability Readiness */}
                    <div className="space-y-2.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${statusBadgeStyle}`}>
                          {isGreen ? '🟢 ' : isYellow ? '🟡 ' : '🔴 '}{h.tierLabel} • #{h.tierRank}
                        </span>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {h.traumaTier}
                        </span>

                        {h.hasCapability ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3" /> All Required Modalities Ready
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {h.missingReason}
                          </span>
                        )}

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusBadgeStyle}`}>
                          {h.effectiveScore}% Effective Access
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900">
                          {h.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {h.address}
                        </p>
                      </div>

                      {/* Concise Ranking Rationale */}
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <strong className="text-slate-800 font-semibold">Why this ranking:</strong> {h.rankingReason}
                      </p>

                      {/* Required Clinical Modalities Checklist */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                        <div className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] font-medium ${
                          h.bloodAvailable 
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' 
                            : 'bg-amber-50/70 border-amber-200 text-amber-800'
                        }`}>
                          {h.bloodAvailable ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                          <span>{h.bloodAvailable ? 'Blood Available' : 'Blood Limited'}</span>
                        </div>

                        <div className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] font-medium ${
                          h.traumaReady 
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' 
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}>
                          {h.traumaReady ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                          <span>{h.traumaReady ? 'Trauma Bay' : 'No Trauma Bay'}</span>
                        </div>

                        <div className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] font-medium ${
                          h.surgeryReady 
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' 
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}>
                          {h.surgeryReady ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                          <span>{h.surgeryReady ? 'Surgery Suite' : 'Limited Surgery'}</span>
                        </div>

                        <div className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] font-medium ${
                          h.ambulanceReady 
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' 
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}>
                          {h.ambulanceReady ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                          <span>{h.ambulanceReady ? 'ALS Ambulance' : 'Standard Transit'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Transit Time, Metrics & View Hospital Action */}
                    <div className="flex flex-col items-start lg:items-end justify-between gap-3 lg:border-l lg:border-slate-100 lg:pl-5 shrink-0">
                      
                      {/* Distance & Time Tag */}
                      <div className="flex lg:flex-col items-baseline lg:items-end justify-between w-full lg:w-auto gap-1">
                        <div className="text-xl font-black text-slate-900">
                          {h.distKm} <span className="text-xs font-bold text-slate-500">km</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>~{h.estTimeMin} min arrival</span>
                        </div>
                        <span className={`text-[10px] font-bold ${h.estTimeMin <= currentNeed.goldenWindowMin ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {h.estTimeMin <= currentNeed.goldenWindowMin ? '✓ Within Golden Window' : '⚠️ Exceeds Window'}
                        </span>
                      </div>

                      {/* Emergency Readiness Quick Stats */}
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          <span><strong>{h.availableIcuBeds}</strong> ICU Beds</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-slate-400" />
                          <span><strong>{h.ventilatorAvailable}</strong> Vents</span>
                        </div>
                      </div>

                      {/* Actions: View Hospital triggers simulated demo navigation for that exact hospital */}
                      <div className="flex items-center gap-2 w-full lg:w-auto pt-1">
                        <button
                          onClick={() => handleOpenNavigation(h)}
                          className="flex-1 lg:flex-initial py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View Hospital</span>
                        </button>
                        <a
                          href={`tel:${h.contact}`}
                          className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-slate-200 transition-colors"
                          title="Call Emergency"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Call</span>
                        </a>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SIMULATED DEMO NAVIGATION MODAL */}
      {/* ========================================================================= */}
      {activeNavHospital && (
        <DemoNavigationModal
          hospital={activeNavHospital}
          origin={currentSector.simulatedOrigin}
          currentNeed={currentNeed}
          onClose={() => setActiveNavHospital(null)}
        />
      )}

    </div>
  );
}
