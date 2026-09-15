import React from 'react';
import { 
  AlertTriangle, X, ArrowRight, ShieldAlert, Clock, 
  Sparkles, ChevronRight 
} from 'lucide-react';
import { MEDICAL_NEEDS } from '../../data/medicalNeeds';
import { HOSPITALS, BLOOD_BANKS, AMBULANCES, DIAGNOSTICS, PHARMACIES } from '../../data/mockHealthcareData';
import { calculateEffectiveCoverage, simulateIntervention } from '../../engine';

const RESOURCES = { hospitals: HOSPITALS, bloodBanks: BLOOD_BANKS, ambulances: AMBULANCES, diagnostics: DIAGNOSTICS, pharmacies: PHARMACIES };

export default function DeadZonePanel({ 
  zone, 
  selectedNeedId, 
  activeSimulation, 
  onClose, 
  onSimulateIntervention 
}) {
  if (!zone) return null;

  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedNeedId) || MEDICAL_NEEDS[0];

  const isSimulated = activeSimulation && activeSimulation.targetZoneId === zone.id;

  const engineResult = calculateEffectiveCoverage(zone, currentNeed, RESOURCES);
  const isDeadZone = engineResult.status === 'dead_zone';
  const bottleneck = engineResult.primaryBottleneck;

  const goldenHourLimit = currentNeed.goldenWindowMin || 30;
  const actualResponse = engineResult.avgResponseMin;
  const gapMinutes = Math.max(0, actualResponse - goldenHourLimit);
  const percentBreach = Math.round((gapMinutes / goldenHourLimit) * 100);

  // Candidate interventions list
  const primaryIntervention = zone.suggestedIntervention || {
    title: "Station 2 Dedicated ALS Ambulances",
    action: "ADD",
    resourceType: "ambulance",
    quantity: 2,
    peopleBenefited: "180,000"
  };

  const secondaryIntervention = zone.id === 'zone-east' ? {
    title: "Deploy Rapid Blood Storage & Trauma Bay",
    action: "ADD",
    resourceType: "blood_bank",
    quantity: 1,
    peopleBenefited: "210,000",
    note: "Adds a local emergency blood reserve"
  } : {
    title: "Add 24/7 Fast-Track Diagnostics & Surgical Bed",
    action: "ADD",
    resourceType: "hospital",
    quantity: 1,
    peopleBenefited: "135,000",
    note: "Adds local clinical capacity for the active need"
  };
  const primaryPreview = simulateIntervention(zone, primaryIntervention, currentNeed, RESOURCES);
  const secondaryPreview = simulateIntervention(zone, secondaryIntervention, currentNeed, RESOURCES);
  const baselineCoverage = engineResult.effectiveCoveragePct;
  const primaryCoverage = primaryPreview.after.effectiveCoveragePct;
  const secondaryCoverage = secondaryPreview.after.effectiveCoveragePct;

  return (
    <div className="bg-white rounded-xl border border-red-300 shadow-2xl overflow-hidden flex flex-col max-h-full animate-in fade-in slide-in-from-right-2 duration-200 select-none">
      {/* Header Banner */}
      <div className={`${isSimulated ? 'bg-emerald-600' : isDeadZone ? 'bg-red-600' : 'bg-amber-600'} text-white px-4 py-3 flex items-center justify-between shrink-0`}>
        <div className="flex items-center gap-2">
          {isSimulated ? (
            <Sparkles className="w-5 h-5 text-white animate-bounce" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
          )}
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/80 block">
              {isSimulated ? 'Post-Simulation Audit' : 'GIS Bottleneck Analysis'}
            </span>
            <h3 className="text-sm sm:text-base font-bold leading-tight">
              {isSimulated 
                ? 'Simulated Coverage Active' 
                : isDeadZone 
                ? 'High-Risk Medical Dead Zone' 
                : 'Limited Healthcare Access Zone'}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 rounded-md hover:bg-black/20 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sector Name & Metrics Body */}
      <div className="p-4 overflow-y-auto space-y-4">
        {/* Sector Metadata */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Target Sector
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
                Scenario: {currentNeed.name}
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                {zone.code}
              </span>
            </div>
          </div>
          <h4 className="text-lg font-extrabold text-slate-900 leading-snug">{zone.name}</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Population at Risk: <strong>{zone.population.toLocaleString()}</strong> residents
          </p>
        </div>

        {/* 1. PROMINENT PRIMARY BOTTLENECK CALLOUT */}
        <div className="p-3.5 rounded-lg bg-red-50 border-2 border-red-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-700 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
              {bottleneck.severity}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-200/80 text-red-900">
              Primary Bottleneck
            </span>
          </div>

          <div className="text-sm font-black text-red-950 leading-tight">
            "{bottleneck.title}"
          </div>

          <p className="text-[11px] text-red-900/90 leading-relaxed pt-0.5">
            {bottleneck.clinicalImpact}
          </p>
        </div>

        {/* 2. TRAVEL WINDOW GAP against the active need's clinical limit */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span>Travel Window Gap Analysis</span>
            </div>
            <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
              +{gapMinutes}m Deficit ({percentBreach}% Breach)
            </span>
          </div>

          {/* Comparative Metrics Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Zone Actual Travel:</span>
              <span className="font-extrabold text-red-600 text-sm">{actualResponse} min</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Golden-Hour Limit:</span>
              <span className="font-bold text-emerald-700">{goldenHourLimit} min max</span>
            </div>

            {/* Visual Travel Bar */}
            <div className="relative w-full h-4 bg-slate-200 rounded-full overflow-hidden flex">
              {/* Safe window against the active need's clinical threshold */}
              <div 
                style={{ width: `${(goldenHourLimit / Math.max(35, actualResponse)) * 100}%` }}
                className="bg-emerald-500 h-full flex items-center justify-center text-[9px] font-bold text-white tracking-wider"
                title={`${goldenHourLimit}m Safe Golden Window`}
              >
                Safe {goldenHourLimit}m
              </div>
              {/* Danger Gap (remaining time) */}
              <div 
                style={{ width: `${(gapMinutes / Math.max(35, actualResponse)) * 100}%` }}
                className="bg-red-600 h-full flex items-center justify-center text-[9px] font-bold text-white tracking-wider animate-pulse"
                title={`+${gapMinutes} min Delay Gap`}
              >
                +{gapMinutes}m Delay
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 leading-snug">
            *Clinical standard: Patient survival in traumatic hemorrhage drops 10% for every 15 minutes without definitive care.
          </p>
        </div>

        {/* Compact Key Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-md bg-red-50/70 border border-red-100">
            <span className="text-[10px] font-bold uppercase text-red-700 block">Effective Coverage</span>
            <div className="text-2xl font-black text-red-600">
              {baselineCoverage}%
            </div>
            <span className="text-[10px] text-red-700 font-semibold">Engine-calculated for {currentNeed.name}</span>
          </div>

          <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Ambulance Response</span>
            <div className="text-2xl font-black text-slate-900">
              {actualResponse} <span className="text-xs font-normal text-slate-500">min</span>
            </div>
            <span className="text-[10px] text-red-600 font-semibold">Exceeds golden hour</span>
          </div>

          <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Nearest Level-1 ICU</span>
            <div className="text-lg font-bold text-slate-900">
              {zone.baselineMetrics.nearestIcuKm} km
            </div>
            <span className="text-[10px] text-slate-500">Beyond rapid transport</span>
          </div>

          <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Blood Bank Distance</span>
            <div className="text-lg font-bold text-red-600">
              {zone.baselineMetrics.nearestBloodKm} km
            </div>
            <span className="text-[10px] text-red-700 font-semibold">Zero local blood depot</span>
          </div>
        </div>

        {/* Root Causes Checklist */}
        <div className="space-y-1.5">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            Specific Spatial Causes
          </h5>
          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
            {zone.reasons && zone.reasons.length > 0 ? (
              zone.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-700 text-[11px] leading-snug">
                  <span className="text-red-600 font-bold shrink-0">•</span>
                  <span>{reason}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-[11px]">Lack of specialized emergency care facilities within the critical golden hour travel perimeter.</p>
            )}
          </div>
        </div>

        {/* 3. CANDIDATE INTERVENTIONS & DIRECT SIMULATION TRIGGER */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Candidate Interventions
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              What-If Ready
            </span>
          </div>

          {/* Primary Intervention Card */}
          <div className="p-3.5 rounded-xl bg-emerald-50/90 border-2 border-emerald-300 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                Recommended Primary Option
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-emerald-700 border border-emerald-200">
                +{primaryCoverage - baselineCoverage}% Gain
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-emerald-950">
              {primaryIntervention.title}
            </p>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-200/70 text-emerald-950 font-medium">
              <div>
                Coverage: <span className="line-through text-slate-400">{baselineCoverage}%</span>{' '}
                <strong className="text-emerald-700 font-bold">→ {primaryCoverage}%</strong>
              </div>
              <div>
                Response: <span className="line-through text-slate-400">{actualResponse}m</span>{' '}
                <strong className="text-emerald-700 font-bold">→ {primaryPreview.after.avgResponseMin}m</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSimulateIntervention(zone, primaryIntervention)}
              className="w-full mt-1.5 py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-red-200 hover:shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate This Intervention</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Secondary Alternative Card */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600 uppercase">
                Alternative: {secondaryIntervention.title}
              </span>
              <span className="text-[10px] font-bold text-slate-700">
                → {secondaryCoverage}%
              </span>
            </div>
            {secondaryIntervention.note && (
              <p className="text-[10px] text-slate-500">{secondaryIntervention.note}</p>
            )}
            <button
              type="button"
              onClick={() => onSimulateIntervention(zone, secondaryIntervention)}
              className="w-full py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>Simulate Alternative</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}