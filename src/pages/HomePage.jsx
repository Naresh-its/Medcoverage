import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Search, MapPin, Stethoscope, Phone,
  Bed, Clock, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft,
  Zap, Check, X, Activity, Compass, Navigation
} from 'lucide-react';
import { MEDICAL_NEEDS } from '../data/medicalNeeds';
import { REGIONAL_SECTORS, getRankedHospitalsForRegion } from '../data/regionalHospitalData';
import DemoNavigationModal from '../components/CoverageMap/DemoNavigationModal';
import PageTransition from '../components/PageTransition';
import Medical3DBackground from '../components/MotionGraphics/Medical3DBackground';
import { 
  staggerContainer, 
  itemVariants, 
  hospitalCardVariants 
} from '../animations/variants';

export default function HomePage({ selectedNeedId, setSelectedNeedId }) {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Premium clinical easing curve (calm, sophisticated deceleration)
  const clinicalEase = [0.16, 1, 0.3, 1];

  // Handle return from Coverage Map if user was viewing a route
  const returnState = location.state;

  // Two-Screen Navigation State: 'search' | 'results'
  const [screen, setScreen] = useState(() => {
    if (returnState?.returnToResults) return 'results';
    return 'search';
  });

  // Input Selection State
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(() => {
    if (returnState?.selectedDiseaseId) return returnState.selectedDiseaseId;
    return selectedNeedId || '';
  });

  const [selectedZoneId, setSelectedZoneId] = useState(() => {
    if (returnState?.selectedZoneId) return returnState.selectedZoneId;
    return '';
  });

  const [isSearchingAnim, setIsSearchingAnim] = useState(false);

  // Active Navigation Modal State (when user clicks [View Hospital])
  const [activeNavHospital, setActiveNavHospital] = useState(null);

  // Sync if location state changes
  useEffect(() => {
    if (location.state?.returnToResults) {
      setScreen('results');
      if (location.state.selectedDiseaseId) {
        setSelectedDiseaseId(location.state.selectedDiseaseId);
        if (setSelectedNeedId) setSelectedNeedId(location.state.selectedDiseaseId);
      }
      if (location.state.selectedZoneId) {
        setSelectedZoneId(location.state.selectedZoneId);
      }
    }
  }, [location.state, setSelectedNeedId]);

  // Selected Clinical Entities (with safe fallbacks)
  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedDiseaseId) || MEDICAL_NEEDS[0];
  const currentSector = REGIONAL_SECTORS.find(s => s.id === selectedZoneId) || REGIONAL_SECTORS[0];

  // Retrieve the 4 distinct ranked hospitals for the selected region and medical condition
  const rankedHospitals = getRankedHospitalsForRegion(currentSector.id, currentNeed.id);

  // Validation: Both emergency and location must be selected to enable search
  const canSearch = Boolean(selectedDiseaseId && selectedZoneId);

  // Transition from Screen 1 to Screen 2
  const handleSearch = () => {
    if (!canSearch) return;
    setIsSearchingAnim(true);
    if (setSelectedNeedId) {
      setSelectedNeedId(selectedDiseaseId);
    }
    setTimeout(() => {
      setIsSearchingAnim(false);
      setScreen('results');
    }, 240);
  };

  // Return from Screen 2 back to Screen 1
  const handleBackToSearch = () => {
    setScreen('search');
  };

  // Direct View Route Action -> Opens Coverage Map with road directions
  const handleViewRoute = (hosp) => {
    navigate('/coverage', {
      state: {
        routeData: {
          hospital: hosp,
          origin: currentSector.simulatedOrigin,
          need: currentNeed,
          selectedDiseaseId: currentNeed.id,
          selectedZoneId: currentSector.id,
        }
      }
    });
  };

  return (
    <PageTransition className="relative w-full flex-1 flex flex-col items-center justify-start pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Subtle 3D Medical Background with Live ECG & Network Nodes */}
      <Medical3DBackground variant="hero" />

      <AnimatePresence mode="wait">
        {/* ========================================================================= */}
        {/* SCREEN 1 — SEARCH / INPUT (Cinematic Medical System Reveal)                */}
        {/* ========================================================================= */}
        {screen === 'search' && (
          <motion.div
            key="screen-search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 w-full max-w-3xl pt-8 sm:pt-14 pb-8 text-center flex flex-col items-center"
          >
            {/* 0.2s: MEDCOVERAGE BADGE softly appears (Fade in + slight upward movement) */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: shouldReduceMotion ? 0 : 0.2, 
                ease: clinicalEase 
              }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100/90 backdrop-blur-xs border border-slate-200 text-slate-800 text-xs font-black tracking-widest uppercase shadow-2xs mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>MEDCOVERAGE</span>
            </motion.div>

            {/* 0.4s: MAIN HERO TITLE begins entering from LEFT (translateX(-18px) -> 0) */}
            <motion.h1
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.75, 
                delay: shouldReduceMotion ? 0 : 0.4, 
                ease: clinicalEase 
              }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-slate-900 tracking-tight leading-[1.14] max-w-2xl mx-auto"
            >
              Emergency care,<br />
              <span className="text-blue-600">thoughtfully mapped.</span>
            </motion.h1>

            {/* 0.7s: SUBTITLE softly fades in */}
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.55, 
                delay: shouldReduceMotion ? 0 : 0.7, 
                ease: clinicalEase 
              }}
              className="text-sm sm:text-base text-slate-600 font-medium max-w-lg mx-auto mt-3 sm:mt-3.5 leading-relaxed"
            >
              Beyond proximity. Find care that is actually reachable.
            </motion.p>

            {/* 0.9s: SEARCH CONTAINER begins appearing with soft ambient glow reveal */}
            <motion.div
              initial={{ 
                opacity: 0, 
                y: shouldReduceMotion ? 0 : 16,
                boxShadow: '0 0 35px -5px rgba(59, 130, 246, 0.22), 0 0 15px -3px rgba(16, 185, 129, 0.16)'
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.05)'
              }}
              transition={{ 
                duration: 0.75, 
                delay: shouldReduceMotion ? 0 : 0.9, 
                ease: clinicalEase 
              }}
              className="w-full max-w-xl mx-auto mt-8 sm:mt-9 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-5 sm:space-y-6 text-left"
            >
              
              {/* 1.1s: STEP 1 — EMERGENCY SELECTOR (Container, label, then input) */}
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.45, 
                  delay: shouldReduceMotion ? 0 : 1.1, 
                  ease: clinicalEase 
                }}
                className="space-y-2"
              >
                <motion.label 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : 1.12 }}
                  className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-slate-800 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-black">1</span>
                    SELECT YOUR EMERGENCY
                  </span>
                  {selectedDiseaseId && (
                    <motion.span 
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Selected
                    </motion.span>
                  )}
                </motion.label>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : 1.18 }}
                  className="relative"
                >
                  <select
                    value={selectedDiseaseId}
                    onChange={(e) => {
                      setSelectedDiseaseId(e.target.value);
                      if (setSelectedNeedId) setSelectedNeedId(e.target.value);
                    }}
                    className={`w-full bg-slate-50 hover:bg-slate-100/80 border rounded-xl px-4 py-3.5 text-sm sm:text-[15px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 focus:shadow-[0_0_18px_rgba(37,99,235,0.12)] transition-all duration-300 cursor-pointer ${
                      selectedDiseaseId ? 'border-slate-300' : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    <option value="" disabled className="text-slate-400 py-2">Choose an emergency</option>
                    {MEDICAL_NEEDS.map((n) => (
                      <option key={n.id} value={n.id} className="text-slate-900 font-semibold py-2">
                        {n.name}
                      </option>
                    ))}
                  </select>
                </motion.div>
              </motion.div>

              {/* 1.25s: STEP 2 — LOCATION SELECTOR */}
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.45, 
                  delay: shouldReduceMotion ? 0 : 1.25, 
                  ease: clinicalEase 
                }}
                className={`space-y-2 transition-opacity duration-300 ${selectedDiseaseId ? 'opacity-100' : 'opacity-60'}`}
              >
                <motion.label 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : 1.28 }}
                  className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-slate-800 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-black">2</span>
                    CHOOSE YOUR LOCATION
                  </span>
                  {selectedZoneId && (
                    <motion.span 
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Selected
                    </motion.span>
                  )}
                </motion.label>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : 1.33 }}
                  className="relative"
                >
                  <select
                    value={selectedZoneId}
                    disabled={!selectedDiseaseId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    className={`w-full bg-slate-50 hover:bg-slate-100/80 border rounded-xl px-4 py-3.5 text-sm sm:text-[15px] font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:shadow-[0_0_18px_rgba(16,185,129,0.12)] transition-all duration-300 cursor-pointer ${
                      selectedZoneId ? 'border-slate-300' : 'border-slate-200 text-slate-500'
                    } ${!selectedDiseaseId ? 'cursor-not-allowed bg-slate-100/50' : ''}`}
                  >
                    <option value="" disabled className="text-slate-400 py-2">Search or choose your immediate location</option>
                    {REGIONAL_SECTORS.map((z) => (
                      <option key={z.id} value={z.id} className="text-slate-900 font-semibold py-2">
                        {z.name}
                      </option>
                    ))}
                  </select>
                </motion.div>
                <p className="text-xs text-slate-500 pl-1 font-medium">Where are you right now?</p>
              </motion.div>

              {/* 1.4s: STEP 3 — FIND HOSPITALS BUTTON */}
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.45, 
                  delay: shouldReduceMotion ? 0 : 1.4, 
                  ease: clinicalEase 
                }}
                className="pt-2"
              >
                <motion.button
                  whileHover={canSearch ? { 
                    scale: 1.015, 
                    y: -1, 
                    transition: { duration: 0.2, ease: "easeOut" } 
                  } : {}}
                  whileTap={canSearch ? { 
                    scale: 0.98,
                    transition: { duration: 0.1 }
                  } : {}}
                  disabled={!canSearch || isSearchingAnim}
                  onClick={handleSearch}
                  className={`w-full py-4 px-6 rounded-xl font-black text-sm sm:text-[15px] tracking-wide flex items-center justify-center gap-2.5 transition-all duration-200 shadow-md ${
                    canSearch
                      ? 'btn-med-primary cursor-pointer text-white shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 hover:brightness-[1.03]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                  }`}
                >
                  {isSearchingAnim ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin text-emerald-300" />
                      <span>Locating Best Facilities...</span>
                    </>
                  ) : (
                    <>
                      <span>FIND HOSPITALS</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </motion.button>
              </motion.div>

            </motion.div>

            {/* 1.6s+: FAST-PITCH DEMO SCENARIOS subtly appear */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: shouldReduceMotion ? 0 : 1.62, 
                ease: clinicalEase 
              }}
              className="w-full max-w-xl mx-auto mt-7 sm:mt-8 flex flex-col items-center"
            >
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Fast-Pitch Demo Scenarios:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                <button
                  onClick={() => {
                    setSelectedDiseaseId('severe_bleeding');
                    setSelectedZoneId('zone-coastal');
                    setTimeout(() => setScreen('results'), 120);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-slate-950 text-xs sm:text-[13px] font-bold border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all flex items-center gap-2"
                >
                  <span>🩸 Case 1: Severe Bleeding (East ECR)</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedDiseaseId('stroke');
                    setSelectedZoneId('zone-central');
                    setTimeout(() => setScreen('results'), 120);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-slate-950 text-xs sm:text-[13px] font-bold border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all flex items-center gap-2"
                >
                  <span>🧠 Case 2: Acute Stroke (Metro Core)</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedDiseaseId('trauma');
                    setSelectedZoneId('zone-highway');
                    setTimeout(() => setScreen('results'), 120);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-slate-950 text-xs sm:text-[13px] font-bold border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all flex items-center gap-2"
                >
                  <span>💥 Case 3: Severe Trauma (Outer Ring)</span>
                </button>
              </div>
            </motion.div>

          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2 — HOSPITAL RESULTS (Dedicated Results Screen) */}
        {/* ========================================================================= */}
        {screen === 'results' && (
          <motion.div
            key="screen-results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative z-10 w-full max-w-5xl space-y-4 pt-4 sm:pt-6"
          >
            {/* Screen 2 Top Bar: Back / Change Search + Concise Headline */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xs">
              <div>
                <button
                  onClick={handleBackToSearch}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-800 transition-colors mb-1.5 cursor-pointer group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Change Search</span>
                </button>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  4 Suitable Hospitals
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  for <strong className="text-blue-600">{currentNeed.name}</strong> near <strong className="text-emerald-700">{currentSector.name}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Origin: {currentSector.simulatedOrigin.name}
                </span>
                <Link
                  to="/coverage"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors shrink-0"
                >
                  <span>View Coverage Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 4 Distinct Hospital Cards per Location (Staggered Entrance) */}
            <motion.div 
              variants={staggerContainer(0.09, 0.04)}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {rankedHospitals.map((h, idx) => {
                const isTop = idx === 0;
                const isGreen = h.displayStatus === 'green';
                const isYellow = h.displayStatus === 'yellow';

                const statusBadgeStyle = isGreen
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : isYellow
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-red-50 text-red-800 border-red-300';

                const cardBorder = isTop
                  ? 'border-2 border-emerald-500/90 shadow-md ring-1 ring-emerald-200'
                  : isGreen
                    ? 'border border-slate-200 hover:border-emerald-400 shadow-2xs'
                    : isYellow
                      ? 'border border-slate-200 hover:border-amber-400 shadow-2xs'
                      : 'border border-slate-200 hover:border-red-400 shadow-2xs';

                return (
                  <motion.div 
                    key={h.id}
                    variants={hospitalCardVariants}
                    whileHover={{ y: -3, scale: 1.006 }}
                    transition={{ duration: 0.2 }}
                    className={`rounded-xl p-5 bg-white/95 backdrop-blur-xs transition-shadow ${cardBorder}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      
                      {/* Left: Hospital Info & Capability Readiness */}
                      <div className="space-y-2.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <motion.span 
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${statusBadgeStyle}`}
                          >
                            {isGreen ? '🟢 ' : isYellow ? '🟡 ' : '🔴 '}{h.tierLabel} • #{h.tierRank}
                          </motion.span>

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

                      {/* Right: Transit Time, Metrics & View Actions */}
                      <div className="flex flex-col items-start lg:items-end justify-between gap-3 lg:border-l lg:border-slate-100 lg:pl-5 shrink-0">
                        
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
                          <div className="w-full sm:w-28 bg-slate-100 rounded-full h-1.5 overflow-hidden mt-0.5">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${h.estTimeMin <= currentNeed.goldenWindowMin ? 'bg-emerald-500' : 'bg-amber-500'}`}
                              style={{ width: `${Math.min(100, Math.round((h.estTimeMin / currentNeed.goldenWindowMin) * 100))}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {h.estTimeMin}m / {currentNeed.goldenWindowMin}m window
                          </span>
                        </div>

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

                        <div className="flex items-center gap-2 w-full lg:w-auto pt-1">
                          {/* 1. Access Route -> Direct to Coverage Map with Road Navigation */}
                          <motion.button
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleViewRoute(h)}
                            className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            title="View road route on interactive Coverage Map"
                          >
                            <Navigation className="w-3.5 h-3.5 text-white" />
                            <span>Access Route</span>
                          </motion.button>

                          {/* 2. View Hospital Guidance Modal */}
                          <motion.button
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setActiveNavHospital(h)}
                            className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Compass className="w-3.5 h-3.5 text-emerald-400" />
                            <span>View Hospital</span>
                          </motion.button>

                          {/* 3. Call Hospital Direct */}
                          <motion.a
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            href={`tel:${h.contact}`}
                            className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-slate-200 transition-colors"
                            title="Call Emergency"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Call</span>
                          </motion.a>
                        </div>

                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* REAL MAPBOX DEMO NAVIGATION MODAL WITH ANIMATEPRESENCE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeNavHospital && (
          <DemoNavigationModal
            key={activeNavHospital.id}
            hospital={activeNavHospital}
            origin={currentSector.simulatedOrigin}
            currentNeed={currentNeed}
            selectedZoneId={currentSector.id}
            onClose={() => setActiveNavHospital(null)}
          />
        )}
      </AnimatePresence>

    </PageTransition>
  );
}
