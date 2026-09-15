import React from 'react';
import { Sparkles, CheckCircle, ArrowRight, Play, RefreshCw } from 'lucide-react';

export default function QuickDemoBanner({ 
  currentStep, 
  onNextStep, 
  onResetDemo, 
  onAutoPlay 
}) {
  const steps = [
    { num: 1, label: 'Select "Severe Bleeding"' },
    { num: 2, label: 'Observe Resource Chain' },
    { num: 3, label: 'Click Red Dead Zone' },
    { num: 4, label: 'Inspect Root Cause' },
    { num: 5, label: 'Run Simulator (+2 Ambulances)' },
    { num: 6, label: 'Observe 40% → 70% Impact' },
  ];

  return (
    <div className="bg-slate-900 text-white py-2.5 px-4 sm:px-6 border-b border-slate-800 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-[10px] font-bold text-white">
            ★
          </span>
          <span className="text-xs font-bold tracking-tight text-white">
            Evaluator 30-Second Guided Tour:
          </span>
          <span className="text-xs text-slate-400 hidden lg:inline">
            Step {currentStep} of {steps.length}: <strong className="text-red-400">{steps[currentStep - 1]?.label}</strong>
          </span>
        </div>

        {/* Step Progress Indicators */}
        <div className="hidden sm:flex items-center gap-1">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                currentStep === s.num
                  ? 'bg-red-600 text-white'
                  : currentStep > s.num
                  ? 'bg-slate-800 text-emerald-400'
                  : 'bg-slate-800/60 text-slate-500'
              }`}
            >
              <span>{s.num}.</span>
              <span className="truncate max-w-[110px]">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNextStep}
            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={onAutoPlay}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            title="Auto-step through the 30s flow"
          >
            <Play className="w-3 h-3 text-red-400" />
            <span className="hidden sm:inline">Auto Walkthrough</span>
          </button>
          <button
            onClick={onResetDemo}
            className="px-2 py-1 text-slate-400 hover:text-white rounded text-xs"
            title="Reset to initial state"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}