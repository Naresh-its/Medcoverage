import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { MEDICAL_NEEDS } from '../data/medicalNeeds';
import { 
  Droplets, Brain, ShieldAlert, Filter, HeartPulse, Stethoscope, 
  CheckCircle2, ArrowRight 
} from 'lucide-react';

const iconMap = {
  Droplets: Droplets,
  Brain: Brain,
  ShieldAlert: ShieldAlert,
  Filter: Filter,
  HeartPulse: HeartPulse,
  Stethoscope: Stethoscope
};

export default function MedicalNeedsPage({ selectedNeedId, setSelectedNeedId }) {
  const navigate = useNavigate();
  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedNeedId) || MEDICAL_NEEDS[0];

  return (
    <PageTransition>
      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              Medical Need Analysis
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              What care does this patient need?
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select a clinical condition to reveal required resources and evaluate effective accessibility.
            </p>
          </div>

          <button
            onClick={() => navigate('/coverage')}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            <span>View On Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Need Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MEDICAL_NEEDS.map((need) => {
            const Icon = iconMap[need.icon] || HeartPulse;
            const isSelected = need.id === selectedNeedId;
            return (
              <button
                key={need.id}
                onClick={() => setSelectedNeedId(need.id)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-blue-600 ring-2 ring-blue-100 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {need.urgency === 'CRITICAL' && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                      CRITICAL
                    </span>
                  )}
                </div>
                <div className="font-bold text-xs text-slate-900">{need.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{need.goldenWindowMin}m window</div>
              </button>
            );
          })}
        </div>

        {/* The 3-Step Visual Requirement Pipeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Clinical Modality Breakdown
                </span>
                {currentNeed.urgency === 'CRITICAL' && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                    CRITICAL URGENCY
                  </span>
                )}
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                {currentNeed.name}
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Golden Window: <strong className="text-slate-900">{currentNeed.goldenWindowMin} minutes</strong>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl font-medium">
            {currentNeed.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Step 1: Required Resources */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                1. Required Resources
              </span>
              <div className="space-y-1.5">
                {currentNeed.requiredResources.map((res) => (
                  <div key={res.key} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{res.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Available Nearby */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                2. Available Nearby
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-900 font-medium">
                  <span>Metro Central</span>
                  <span className="font-bold text-emerald-700">Ready (100%)</span>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between text-amber-900 font-medium">
                  <span>West Suburban</span>
                  <span className="font-bold text-amber-700">Partial (62%)</span>
                </div>
                <div className="p-2 rounded-lg bg-red-50 border border-red-200 flex items-center justify-between text-red-900 font-medium">
                  <span>East Corridor</span>
                  <span className="font-bold text-red-700">Dead Zone (38%)</span>
                </div>
              </div>
            </div>

            {/* Step 3: Coverage Verdict */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                3. Coverage Verdict
              </span>
              <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-medium leading-relaxed shadow-2xs">
                “{currentNeed.bottleneckFactor}”
              </div>
              <p className="text-[11px] text-slate-500 italic">
                *Proximity without matched clinical capability equals 0% effective access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}