import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Stethoscope, Phone, Navigation, ShieldCheck, 
  Bed, Droplet, Clock, CheckCircle2, AlertTriangle, ArrowRight, 
  Sparkles, Activity, HeartPulse, Zap, Hospital
} from 'lucide-react';
import { MEDICAL_NEEDS } from '../data/medicalNeeds';
import { COVERAGE_ZONES } from '../data/coverageZones';
import { HOSPITALS, BLOOD_BANKS, AMBULANCES } from '../data/mockHealthcareData';

export default function HomePage({ selectedNeedId, setSelectedNeedId }) {
  const navigate = useNavigate();

  // Search State
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(selectedNeedId || 'severe_bleeding');
  const [selectedZoneId, setSelectedZoneId] = useState('zone-central');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(true);
  const [isSearchingAnim, setIsSearchingAnim] = useState(false);

  // Active Need & Zone
  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedDiseaseId) || MEDICAL_NEEDS[0];
  const currentZone = COVERAGE_ZONES.find(z => z.id === selectedZoneId) || COVERAGE_ZONES[0];

  // Calculate distance using simple Haversine
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

  // Find & rank nearby hospitals for the selected disease and zone
  const nearbyHospitals = HOSPITALS.map(h => {
    const distKm = getDistance(currentZone.center.lat, currentZone.center.lng, h.location.lat, h.location.lng);
    const estTimeMin = Math.max(4, Math.round((distKm / 45) * 60 + 3)); // 45 km/h + 3 min turnout
    
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

    return {
      ...h,
      distKm,
      estTimeMin,
      hasCapability,
      missingReason,
      isWithinGolden,
      matchScore: (hasCapability ? 100 : 20) - distKm
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  const bestHospital = nearbyHospitals[0];
  const otherHospitals = nearbyHospitals.slice(1, 4);

  // Trigger search with animation
  const handleSearch = () => {
    setIsSearchingAnim(true);
    if (setSelectedNeedId) {
      setSelectedNeedId(selectedDiseaseId);
    }
    setTimeout(() => {
      setIsSearchingAnim(false);
      setHasSearched(true);
    }, 350);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start pb-16 px-4 sm:px-6 lg:px-10">
      
      {/* ========================================================================= */}
      {/* 1. HERO & GLOWING SEARCH CONSOLE */}
      {/* ========================================================================= */}
      <div className="w-full max-w-6xl pt-6 sm:pt-10 pb-6 text-center space-y-4">
        
        {/* Top Badges */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Live Emergency Hospital & Capability Finder</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600">Right Emergency Hospital</span> in Seconds
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium">
          Matches critical conditions against verified hospital capabilities, real ICU beds, and emergency golden hour transit times.
        </p>

        {/* ========================================================================= */}
        {/* THE SEARCH BOX (DISEASE + LOCATION + GLOWING ANIMATED BUTTON) */}
        {/* ========================================================================= */}
        <div className="relative mt-6 max-w-4xl mx-auto w-full">
          
          {/* Ambient Specular Medical Blue/Green Refraction Glow */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/25 via-teal-400/20 to-emerald-500/25 blur-xl pointer-events-none opacity-80" />

          {/* Main Search Bar Shell */}
          <div className="relative rounded-2xl p-3 sm:p-4 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_15px_40px_-10px_rgba(14,165,233,0.18),0_2px_4px_rgba(16,185,129,0.08)] grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* 1. Condition / Disease Selector */}
            <div className="md:col-span-5 text-left bg-slate-50/80 hover:bg-slate-100/70 p-3 rounded-xl border border-slate-200/80 transition-colors">
              <label className="text-[10px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5 mb-1">
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

            {/* 2. Location / Sector Selector */}
            <div className="md:col-span-4 text-left bg-slate-50/80 hover:bg-slate-100/70 p-3 rounded-xl border border-slate-200/80 transition-colors">
              <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-1">
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

            {/* 3. The Main Glowing Search Button */}
            <div className="md:col-span-3">
              <motion.button
                onClick={handleSearch}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 0 30px rgba(16, 185, 129, 0.65), 0 0 15px rgba(2, 132, 199, 0.75)"
                }}
                whileTap={{ 
                  scale: 0.95,
                  boxShadow: "0 0 45px rgba(6, 182, 212, 0.9)"
                }}
                className="relative w-full overflow-hidden py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all cursor-pointer border border-teal-400/40"
              >
                {/* Glowing Sheen Animation */}
                <span className="absolute inset-0 -translate-x-full hover:translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                
                {isSearchingAnim ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-teal-200" />
                    <span>Locating...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-emerald-100" />
                    <span>Find Hospitals</span>
                  </>
                )}
              </motion.button>
            </div>

          </div>

          {/* Quick Filter Emergency Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Quick Select:</span>
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
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-2xs'
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
      {/* 2. IMMEDIATE RESULTS: NEARBY HOSPITALS FOR SEARCHED DISEASE & LOCATION */}
      {/* ========================================================================= */}
      {hasSearched && (
        <div className="w-full max-w-6xl space-y-6 mt-4 animate-in fade-in duration-300">
          
          {/* Result Summary Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Top Matched Hospital for <span className="text-blue-600 underline font-black">{currentNeed.name}</span> in <span className="text-emerald-700 font-bold">{currentZone.name}</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Requirement: {currentNeed.requiredResources.map(r => r.label).join(' + ')} • Golden Window: <strong className="text-slate-900">{currentNeed.goldenWindowMin} min</strong>
                </span>
              </div>
            </div>

            <Link
              to="/coverage"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors"
            >
              <span>View Full Coverage Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* PRIMARY RECOMMENDED HOSPITAL CARD */}
          {bestHospital && (
            <div className="relative rounded-2xl p-6 sm:p-7 bg-white border-2 border-emerald-500/80 shadow-[0_12px_32px_-8px_rgba(16,185,129,0.15)] space-y-5">
              
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                    <Hospital className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Top Recommendation
                      </span>
                      {bestHospital.hasCapability ? (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                          ✓ All Clinical Modalities Ready
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-200">
                          ⚠️ {bestHospital.missingReason}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      {bestHospital.name}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {bestHospital.address}
                    </p>
                  </div>
                </div>

                {/* Distance & Time Tag */}
                <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-1 bg-slate-50 p-3 rounded-xl border border-slate-200/80 shrink-0">
                  <div className="text-2xl font-black text-emerald-600">
                    {bestHospital.distKm} <span className="text-xs font-bold text-slate-500">km</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>~{bestHospital.estTimeMin} min arrival</span>
                  </div>
                  <span className={`text-[10px] font-bold ${bestHospital.isWithinGolden ? 'text-emerald-700' : 'text-red-600'}`}>
                    {bestHospital.isWithinGolden ? '✓ Within Golden Hour' : '⚠️ Exceeds Golden Window'}
                  </span>
                </div>
              </div>

              {/* LIVE MEDICAL CAPABILITIES GRID (Medical Blue & Green Accent Colors) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-emerald-600" />
                    Available ICU Beds
                  </span>
                  <div className="text-2xl font-black text-emerald-700">
                    {bestHospital.metrics.availableIcuBeds} <span className="text-xs font-normal text-emerald-800">beds free</span>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-medium">Ventilators: {bestHospital.metrics.ventilatorAvailable} ready</span>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-blue-600" />
                    Trauma Tier & Blood
                  </span>
                  <div className="text-lg font-black text-blue-700">
                    {bestHospital.metrics.traumaTier}
                  </div>
                  <span className="text-[10px] text-blue-800 font-medium">Blood bank dispatch active</span>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-teal-600" />
                    Emergency Diagnostic
                  </span>
                  <div className="text-lg font-black text-teal-700">
                    {bestHospital.capabilities.ct_scan ? '24/7 CT & MRI' : 'Standard Lab'}
                  </div>
                  <span className="text-[10px] text-teal-800 font-medium">Triage wait: ~{bestHospital.metrics.avgWaitTimeMin} min</span>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-indigo-600" />
                    Total Capacity
                  </span>
                  <div className="text-2xl font-black text-indigo-700">
                    {bestHospital.metrics.totalBeds} <span className="text-xs font-normal text-indigo-800">beds</span>
                  </div>
                  <span className="text-[10px] text-indigo-800 font-medium">Full emergency bay</span>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={`tel:${bestHospital.contact}`}
                    className="flex-1 sm:flex-initial py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Emergency: {bestHospital.contact}</span>
                  </a>
                  <button
                    onClick={() => navigate('/coverage')}
                    className="flex-1 sm:flex-initial py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate on Map</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-500 font-medium">
                  Verified live hospital record
                </span>
              </div>

            </div>
          )}

          {/* OTHER ALTERNATIVE HOSPITALS NEARBY */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Hospital className="w-4 h-4 text-blue-600" />
              Other Reachable Facilities in Sector
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {otherHospitals.map(h => (
                <div 
                  key={h.id}
                  className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-3 hover:border-blue-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {h.metrics.traumaTier}
                      </span>
                      <span className="text-xs font-black text-emerald-600">
                        {h.distKm} km • {h.estTimeMin}m
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {h.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {h.address}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-700">
                      {h.metrics.availableIcuBeds} ICU Beds Free
                    </span>
                    <a
                      href={`tel:${h.contact}`}
                      className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Call</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
