import React from 'react';
import { 
  Droplets, Brain, ShieldAlert, Filter, HeartPulse, Stethoscope, 
  Clock, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { MEDICAL_NEEDS } from '../data/medicalNeeds';

const iconMap = {
  Droplets: Droplets,
  Brain: Brain,
  ShieldAlert: ShieldAlert,
  Filter: Filter,
  HeartPulse: HeartPulse,
  Stethoscope: Stethoscope
};

export default function MedicalNeedSelector({ selectedNeedId, onSelectNeed }) {
  const selectedNeed = MEDICAL_NEEDS.find(n => n.id === selectedNeedId) || MEDICAL_NEEDS[0];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Select Medical Need
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            Define Clinical Scenario
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Golden Window: <strong className="text-slate-900">{selectedNeed.goldenWindowMin} min</strong></span>
        </div>
      </div>

      {/* Need Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {MEDICAL_NEEDS.map((need) => {
          const Icon = iconMap[need.icon] || HeartPulse;
          const isSelected = need.id === selectedNeedId;
          return (
            <button
              key={need.id}
              onClick={() => onSelectNeed(need.id)}
              className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-red-50/80 border-red-600 text-slate-950 shadow-xs ring-1 ring-red-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`p-1.5 rounded-md ${isSelected ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {need.urgency === 'CRITICAL' && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                    CRITICAL
                  </span>
                )}
              </div>
              <span className="text-xs font-bold leading-snug">
                {need.name}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                {need.goldenWindowMin}m limit
              </span>
            </button>
          );
        })}
      </div>

      {/* Requirement Engine Visual Pipeline */}
      <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/60 rounded-md p-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Required Resources:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedNeed.requiredResources.map((res, i) => (
                <span
                  key={res.key}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                  {res.label}
                </span>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-500 italic max-w-md">
            "{selectedNeed.bottleneckFactor}"
          </div>
        </div>
      </div>
    </div>
  );
}