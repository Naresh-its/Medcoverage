import React from 'react';
import { 
  AlertTriangle, X, ArrowRight, ShieldAlert, Clock, 
  Droplet, Activity, Sparkles, CheckCircle2, ChevronRight 
} from 'lucide-react';

export default function DeadZonePanel({ zone, onClose, onSimulateIntervention }) {
  if (!zone) return null;

  const isDeadZone = zone.status === 'dead_zone';
  const isLimited = zone.status === 'limited';

  const theme = isDeadZone
    ? {
        border: 'border-red-300',
        headerBg: 'bg-red-600',
        headerText: 'text-red-100',
        title: 'High-Risk Medical Dead Zone',
        badgeBg: 'bg-red-50/80 border-red-200',
        badgeText: 'text-red-700',
        badgeNum: 'text-red-600',
        badgeSub: 'Critical deficit'
      }
    : isLimited
      ? {
          border: 'border-amber-300',
          headerBg: 'bg-amber-600',
          headerText: 'text-amber-100',
          title: 'Limited Healthcare Access Zone',
          badgeBg: 'bg-amber-50/80 border-amber-200',
          badgeText: 'text-amber-800',
          badgeNum: 'text-amber-700',
          badgeSub: 'Modality constrained'
        }
      : {
          border: 'border-emerald-300',
          headerBg: 'bg-emerald-600',
          headerText: 'text-emerald-100',
          title: 'Optimal Healthcare Access Zone',
          badgeBg: 'bg-emerald-50/80 border-emerald-200',
          badgeText: 'text-emerald-800',
          badgeNum: 'text-emerald-700',
          badgeSub: 'Within golden hour'
        };

  return (
    <div className={`bg-white rounded-lg border ${theme.border} shadow-lg overflow-hidden flex flex-col max-h-full`}>
      {/* Header Banner */}
      <div className={`${theme.headerBg} text-white px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-white" />
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.headerText}`}>
              Coverage Analysis Report
            </span>
            <h3 className="text-base font-bold leading-tight">
              {theme.title}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 rounded-md hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sector Name & Metrics */}
      <div className="p-4 overflow-y-auto space-y-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase">Sector:</span>
          <h4 className="text-lg font-extrabold text-slate-900">{zone.name}</h4>
          <p className="text-xs text-slate-500">Zone Code: {zone.code} • Population at Risk: {zone.population.toLocaleString()}</p>
        </div>

        {/* Compact Key Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-2.5 rounded-md border ${theme.badgeBg}`}>
            <span className={`text-[10px] font-bold uppercase ${theme.badgeText}`}>Effective Coverage</span>
            <div className={`text-2xl font-black ${theme.badgeNum}`}>
              {zone.baselineMetrics.overallCoveragePct}%
            </div>
            <span className={`text-[10px] font-medium ${theme.badgeText}`}>{theme.badgeSub}</span>
          </div>

          <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">Ambulance Response</span>
            <div className="text-2xl font-black text-slate-900">
              {zone.baselineMetrics.avgResponseMin} <span className="text-xs font-normal text-slate-500">min</span>
            </div>
            <span className={`text-[10px] font-semibold ${isDeadZone ? 'text-red-600' : isLimited ? 'text-amber-600' : 'text-emerald-600'}`}>
              {isDeadZone ? 'Exceeds golden hour' : isLimited ? 'Constrained transit' : 'Optimal transit'}
            </span>
          </div>

          <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">Nearest Suitable ICU</span>
            <div className="text-lg font-bold text-slate-900">
              {zone.baselineMetrics.nearestIcuKm} km
            </div>
            <span className="text-[10px] text-slate-500">Far beyond rapid range</span>
          </div>

          <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">Blood Availability</span>
            <div className="text-lg font-bold text-amber-600">
              Limited / Absent
            </div>
            <span className="text-[10px] text-slate-500">Nearest bank {zone.baselineMetrics.nearestBloodKm} km</span>
          </div>
        </div>

        {/* Root Causes: WHY is this area underserved? */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            Why is this area underserved?
          </h5>
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-md border border-slate-200 text-xs">
            {zone.reasons && zone.reasons.length > 0 ? (
              zone.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-700">
                  <span className="text-red-600 font-bold shrink-0">•</span>
                  <span>{reason}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500">Lack of specialized emergency care facilities within the critical golden hour travel perimeter.</p>
            )}
          </div>
        </div>

        {/* Suggested Intervention Box */}
        {zone.suggestedIntervention && (
          <div className="p-3.5 rounded-lg bg-emerald-50/80 border border-emerald-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Suggested Intervention
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-800">
                Virtual Simulation
              </span>
            </div>

            <p className="text-sm font-bold text-emerald-950">
              {zone.suggestedIntervention.title}
            </p>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-200/60 text-emerald-900 font-medium">
              <div>
                Coverage: <span className="line-through text-slate-400">{zone.baselineMetrics.overallCoveragePct}%</span>{' '}
                <strong className="text-emerald-700 font-bold text-sm">→ {zone.suggestedIntervention.expectedCoveragePct}%</strong>
              </div>
              <div>
                Response: <strong className="text-emerald-700">{zone.suggestedIntervention.expectedResponseMin}m</strong>
              </div>
            </div>

            <button
              onClick={() => onSimulateIntervention(zone, zone.suggestedIntervention)}
              className="w-full mt-2 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>Simulate This Intervention</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-slate-500 text-center">
              *Evaluates simulated resource impact before capital deployment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}