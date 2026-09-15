import React from 'react';
import { 
  AlertTriangle, X, ArrowRight, Sparkles, AlertOctagon
} from 'lucide-react';

export default function DeadZonePanel({ zone, onClose, onSimulateIntervention }) {
  if (!zone) return null;

  // 1. Dynamic coverage & status from calculated engine result (with legacy demo fallback)
  const coveragePct = zone.coveragePct 
    ?? zone.calculated?.coveragePct 
    ?? zone.engineResult?.coveragePct 
    ?? zone.metrics?.coveragePct 
    ?? zone.baselineMetrics?.overallCoveragePct 
    ?? 0;

  const status = zone.status 
    ?? zone.calculated?.status 
    ?? zone.engineResult?.status 
    ?? (coveragePct < 50 ? 'dead_zone' : coveragePct < 70 ? 'limited' : 'covered');

  const isDeadZone = status === 'dead_zone';

  // 2. Dynamic response and travel metrics from calculated engine result
  const avgResponseMin = zone.responseMin 
    ?? zone.avgResponseMin 
    ?? zone.travelTimeMin 
    ?? zone.calculated?.avgResponseMin 
    ?? zone.baselineMetrics?.avgResponseMin 
    ?? 15;

  const nearestIcuKm = zone.nearestIcuKm 
    ?? zone.icuDistanceKm 
    ?? zone.calculated?.nearestIcuKm 
    ?? zone.baselineMetrics?.nearestIcuKm 
    ?? 'N/A';

  const nearestBloodKm = zone.nearestBloodKm 
    ?? zone.bloodDistanceKm 
    ?? zone.calculated?.nearestBloodKm 
    ?? zone.baselineMetrics?.nearestBloodKm 
    ?? 'N/A';

  // 3. Dynamic engine bottleneck, explanation & missing resources
  const primaryBottleneck = zone.primaryBottleneck 
    ?? zone.calculated?.primaryBottleneck 
    ?? zone.engineResult?.primaryBottleneck 
    ?? zone.metrics?.primaryBottleneck;

  const explanation = zone.explanation 
    ?? zone.calculated?.explanation 
    ?? zone.engineResult?.explanation 
    ?? zone.metrics?.explanation;

  const missingResources = zone.missingResources 
    ?? zone.calculated?.missingResources 
    ?? zone.engineResult?.missingResources 
    ?? zone.metrics?.missingResources;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col max-h-[calc(100%-2rem)] transition-all">
      
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isDeadZone ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isDeadZone 
                  ? 'bg-red-100 text-red-800 border border-red-200' 
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {isDeadZone ? '🔴 High Risk of Delay' : '🟡 Slow Care Access'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight mt-0.5">
              {zone.name}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close area panel"
          className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-left">
        
        {/* 1. Safe Access Percentage */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span>Community Emergency Protection</span>
            <span>Pop: {zone.population ? zone.population.toLocaleString() : 'N/A'}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${isDeadZone ? 'text-red-600' : 'text-amber-600'}`}>
              {coveragePct}%
            </span>
            <span className="text-xs text-slate-600 font-medium">
              {isDeadZone ? 'Critically below safe target (70%)' : 'Needs attention (50–69%)'}
            </span>
          </div>

          {/* Clear Progress bar */}
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isDeadZone ? 'bg-red-600' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.max(5, coveragePct)}%` }}
            />
          </div>
        </div>

        {/* 2. Plain English Explanation */}
        {(primaryBottleneck || explanation) && (
          <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 text-xs text-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-red-800 flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
              Primary Cause of Delay:
            </span>
            {primaryBottleneck && (
              <p className="text-sm font-bold text-slate-900">
                {primaryBottleneck}
              </p>
            )}
            {explanation && (
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {explanation}
              </p>
            )}
          </div>
        )}

        {/* 3. Missing Tools */}
        {Array.isArray(missingResources) && missingResources.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 block">
              Equipment Missing in This Area:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {missingResources.map((res, idx) => (
                <span 
                  key={idx} 
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-200 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  {typeof res === 'string' ? res : res.name || res.label || res.type}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 4. Three Key Measurements */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs text-slate-500 font-medium block">Ambulance</span>
            <span className="text-base font-bold text-slate-900 block mt-0.5">{avgResponseMin} min</span>
            <span className="text-[11px] text-red-600 font-semibold">{avgResponseMin > 15 ? 'Too slow' : 'Safe'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs text-slate-500 font-medium block">Nearest ICU</span>
            <span className="text-base font-bold text-slate-900 block mt-0.5">{nearestIcuKm !== 'N/A' ? `${nearestIcuKm} km` : 'N/A'}</span>
            <span className="text-[11px] text-slate-500 font-medium">Critical care</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs text-slate-500 font-medium block">Blood Bank</span>
            <span className="text-base font-bold text-slate-900 block mt-0.5">{nearestBloodKm !== 'N/A' ? `${nearestBloodKm} km` : 'None'}</span>
            <span className="text-[11px] text-slate-500 font-medium">Universal O-</span>
          </div>
        </div>

        {/* 5. Recommended Solution */}
        {zone.suggestedIntervention && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Recommended Community Fix
              </span>
              <span className="text-xs font-bold text-emerald-800">
                Target: {zone.suggestedIntervention.expectedCoveragePct}% Protected
              </span>
            </div>

            <p className="text-sm font-bold text-slate-900">
              {zone.suggestedIntervention.title}
            </p>

            <button
              onClick={() => onSimulateIntervention(zone, zone.suggestedIntervention)}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>See How to Fix This Area</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}