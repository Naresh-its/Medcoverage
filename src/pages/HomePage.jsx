import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Stethoscope, Phone, Navigation,
  Bed, Clock, CheckCircle2, AlertTriangle, ArrowRight, 
  Zap, Check, X, Activity
} from 'lucide-react';
import { MEDICAL_NEEDS } from '../data/medicalNeeds';
import { COVERAGE_ZONES } from '../data/coverageZones';
import { HOSPITALS } from '../data/mockHealthcareData';

export default function HomePage({ selectedNeedId, setSelectedNeedId }) {
  const navigate = useNavigate();

  // Search State
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(selectedNeedId || 'severe_bleeding');
  const [selectedZoneId, setSelectedZoneId] = useState('zone-central');
  const [hasSearched, setHasSearched] = useState(true);
  const [isSearchingAnim, setIsSearchingAnim] = useState(false);

  // Active Need & Zone
  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedDiseaseId) || MEDICAL_NEEDS[0];
  const currentZone = COVERAGE_ZONES.find(z => z.id === selectedZoneId) || COVERAGE_ZONES[0];

  // Calculate distance using Haversine
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  // Find & rank multiple nearby hospitals for the selected disease and zone
  const rankedHospitals = HOSPITALS.map(h => {
    const distKm = getDistance(currentZone.center.lat, currentZone.center.lng, h.location.lat, h.location.lng);
    const estTimeMin = Math.max(4, Math.round((distKm / 42) * 60 + 3)); // 42 km/h + 3 min turnout
    
    // Check if hospital provides required capability for this disease
    let hasCapability = true;
    let missingReason = null;

    if (currentNeed.id === 'severe_bleeding') {
      if (!h.capabilities.surgery || !h.capabilities.trauma) {
        hasCapability = false;
        missingReason = 'No Trauma / Vascular Surgery';
      }
    } else if (currentNeed.id === 'stroke') {
      if (!h.capabilities.ct_scan) {
        hasCapability = false;
        missingReason = 'No Operational 24/7 CT Scan';
      }
    } else if (currentNeed.id === 'trauma') {
      if (!h.capabilities.trauma || !h.capabilities.icu) {
        hasCapability = false;
        missingReason = 'Lacks Level-1 Trauma & ICU Bed';
      }
    } else if (currentNeed.id === 'dialysis') {
      if (!h.capabilities.dialysis) {
        hasCapability = false;
        missingReason = 'No Hemodialysis Station';
      }
    }

    const isWithinGolden = estTimeMin <= currentNeed.goldenWindowMin;

    // Check regional blood availability
    const bloodAvailable = h.zoneId === 'zone-central' || h.zoneId === 'zone-south';
    const traumaReady = !!h.capabilities.trauma;
    const surgeryReady = !!h.capabilities.surgery;
    const ambulanceReady = h.metrics.availableIcuBeds > 0;

    return {
      ...h,
      distKm,
      estTimeMin,
      hasCapability,
      missingReason,
      isWithinGolden,
      bloodAvailable,
      traumaReady,
      surgeryReady,
      ambulanceReady,
      matchScore: (hasCapability ? 100 : 30) - distKm * 1.5 + (h.metrics.availableIcuBeds > 5 ? 10 : 0)
    };
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);

  // Assign ranking tiers and concise rationale
  const rankingTiers = [
    {
      badge: 'TOP MATCH',
      title: 'Best Match',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      reason: 'Lowest transit time with verified trauma suite, co-located blood bank, and active resuscitation team.'
    },
    {
      badge: 'ALTERNATIVE',
      title: 'Strong Alternative',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      reason: 'High surgical and ICU capacity with dedicated emergency bays along rapid arterial transit.'
    },
    {
      badge: 'NEARBY',
      title: 'Nearby Option',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      reason: 'Reliable secondary clinical emergency care within acceptable golden window threshold.'
    },
    {
      badge: 'BACKUP',
      title: 'Backup Option',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      reason: 'Regional emergency triage and stabilization facility with surge capacity.'
    }
  ];

  // Trigger search with animation
  const handleSearch = () => {
    setIsSearchingAnim(true);
    if (setSelectedNeedId) {
      setSelectedNeedId(selectedDiseaseId);
    }
    setTimeout(() => {
      setIsSearchingAnim(false);
      setHasSearched(true);
    }, 300);
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
          <span>Emergency Hospital & Clinical Capability Matching</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Find the <span className="text-blue-600">Right Emergency Hospital</span> in Seconds
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-medium">
          Matches critical conditions against verified hospital capabilities, real ICU beds, and emergency golden hour transit times.
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
                onChange={(e) => setSelectedDiseaseId(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                {MEDICAL_NEEDS.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} ({n.goldenWindowMin}m limit)
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Sector Selector */}
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
                {COVERAGE_ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Glowing Action Button */}
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

          {/* Quick Filter Pills */}
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
      {/* 2. MULTIPLE RANKED HOSPITAL RESULTS */}
      {/* ========================================================================= */}
      {hasSearched && (
        <div className="w-full max-w-5xl space-y-4 mt-4 animate-in fade-in duration-200">
          
          {/* Result Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    <strong className="text-blue-600">{rankedHospitals.length} suitable hospitals</strong> identified for {currentNeed.name} in {currentZone.name}
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

          {/* Ranked Hospitals List */}
          <div className="space-y-3">
            {rankedHospitals.map((h, idx) => {
              const tier = rankingTiers[idx] || rankingTiers[3];
              const isTop = idx === 0;

              return (
                <div 
                  key={h.id}
                  className={`rounded-xl p-5 bg-white transition-all ${
                    isTop 
                      ? 'border-2 border-emerald-500/80 shadow-md ring-1 ring-emerald-100' 
                      : 'border border-slate-200 hover:border-blue-400 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    
                    {/* Left: Hospital Info & Ranking */}
                    <div className="space-y-2.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${tier.badgeColor}`}>
                          {tier.badge} • #{idx + 1}
                        </span>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {h.metrics.traumaTier}
                        </span>

                        {h.hasCapability ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3" /> All Clinical Modalities Ready
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {h.missingReason}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900">
                          {h.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {h.address}
                        </p>
                      </div>

                      {/* Ranking Rationale */}
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <strong className="text-slate-800 font-semibold">Ranking reason:</strong> {tier.reason}
                      </p>

                      {/* Required Clinical Capabilities Checklist */}
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

                    {/* Right: Distance, Time, Metrics & CTA */}
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
                        <span className={`text-[10px] font-bold ${h.isWithinGolden ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {h.isWithinGolden ? '✓ Within Golden Hour' : '⚠️ Near Window Limit'}
                        </span>
                      </div>

                      {/* Emergency Readiness Quick Stats */}
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          <span><strong>{h.metrics.availableIcuBeds}</strong> ICU Beds</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-slate-400" />
                          <span><strong>{h.metrics.ventilatorAvailable}</strong> Vents</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 w-full lg:w-auto pt-1">
                        <button
                          onClick={() => navigate('/coverage')}
                          className="flex-1 lg:flex-initial py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5" />
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

    </div>
  );
}
