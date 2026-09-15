import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Medical3DBackground from '../components/MotionGraphics/Medical3DBackground';
import { MEDICAL_NEEDS } from '../data/medicalNeeds';
import { 
  Droplets, Brain, ShieldAlert, Filter, HeartPulse, Stethoscope, 
  CheckCircle2, Clock
} from 'lucide-react';
import { staggerContainer, itemVariants } from '../animations/variants';

const iconMap = {
  Droplets: Droplets,
  Brain: Brain,
  ShieldAlert: ShieldAlert,
  Filter: Filter,
  HeartPulse: HeartPulse,
  Stethoscope: Stethoscope
};

// Dynamic Emergency-Specific Clinical Priorities
const EMERGENCY_PRIORITIES = {
  severe_bleeding: [
    'Rapid trauma assessment',
    'Hemorrhage control',
    'Airway stabilization',
    'ICU readiness'
  ],
  stroke: [
    'Rapid neurological assessment',
    'CT / brain imaging',
    'Stroke specialist access',
    'Thrombolysis readiness'
  ],
  trauma: [
    'Rapid trauma assessment',
    'Hemorrhage control',
    'Surgical readiness',
    'ICU readiness'
  ],
  dialysis: [
    'Immediate renal assessment',
    'Dialysis availability',
    'Vascular access support',
    'Emergency monitoring'
  ],
  general_emergency: [
    'Rapid triage',
    'Emergency stabilization',
    'Critical-care readiness',
    'Specialist escalation'
  ],
  diagnostics: [
    'Rapid diagnostic assessment',
    'Imaging availability',
    'Laboratory readiness',
    'Emergency physician access'
  ]
};

export default function MedicalNeedsPage({ selectedNeedId, setSelectedNeedId }) {
  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedNeedId) || MEDICAL_NEEDS[0];
  const priorities = EMERGENCY_PRIORITIES[currentNeed.id] || [
    'Rapid triage',
    'Emergency stabilization',
    'Critical-care readiness',
    'Specialist escalation'
  ];

  return (
    <PageTransition className="relative overflow-hidden">
      {/* Subtle 3D Cardiovascular / Medical Network Background */}
      <Medical3DBackground variant="needs" />

      <div className="relative z-10 p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* Header Bar */}
        <div className="pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Medical Need Analysis
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-1">
              What care does this patient need?
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
              Select a clinical condition to reveal required resources, emergency priorities, and evaluate effective accessibility.
            </p>
          </div>
        </div>

        {/* Need Selection Grid with Micro-Interactions & layoutId indicator */}
        <motion.div 
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {MEDICAL_NEEDS.map((need) => {
            const Icon = iconMap[need.icon] || HeartPulse;
            const isSelected = need.id === selectedNeedId;
            return (
              <motion.button
                key={need.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedNeedId(need.id)}
                className={`relative p-3.5 sm:p-4 rounded-xl border text-left cursor-pointer transition-colors bg-white/95 backdrop-blur-xs ${
                  isSelected
                    ? 'border-blue-600 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                {/* Active Indicator Ring */}
                {isSelected && (
                  <motion.div
                    layoutId="activeNeedBorder"
                    className="absolute inset-0 rounded-xl border-2 border-blue-600 pointer-events-none ring-2 ring-blue-100"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-1.5 rounded-lg transition-colors ${isSelected ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700'}`}>
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    {need.urgency === 'CRITICAL' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">{need.name}</div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">{need.goldenWindowMin}m window</div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* The 3-Step Visual Requirement Pipeline */}
        <motion.div 
          key={currentNeed.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Clinical Modality Breakdown
                </span>
                {currentNeed.urgency === 'CRITICAL' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                    CRITICAL URGENCY
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {currentNeed.name}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 shrink-0">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Golden Window: <strong className="text-slate-900 font-bold">{currentNeed.goldenWindowMin} minutes</strong></span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl font-normal">
            {currentNeed.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Step 1: Required Resources */}
            <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                1. Required Resources
              </span>
              <div className="space-y-2">
                {currentNeed.requiredResources.map((res) => (
                  <div key={res.key} className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 text-xs sm:text-[13px] font-medium text-slate-800 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{res.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Emergency Priorities (REPLACES AVAILABLE NEARBY) */}
            <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                2. Emergency Priorities
              </span>
              <div className="space-y-2">
                {priorities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-slate-200 text-xs sm:text-[13px] font-medium text-slate-800 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Coverage Verdict */}
            <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                3. Coverage Verdict
              </span>
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs sm:text-[13px] text-slate-800 font-medium leading-relaxed shadow-2xs">
                “{currentNeed.bottleneckFactor}”
              </div>
              <p className="text-xs text-slate-500 italic leading-normal">
                *Proximity without matched clinical capability equals 0% effective access.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
