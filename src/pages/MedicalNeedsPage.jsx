import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { MEDICAL_NEEDS } from '../data/medicalNeeds';
import { 
  Droplets, Brain, ShieldAlert, Filter, HeartPulse, Stethoscope, 
  CheckCircle2, ArrowRight, AlertTriangle, Clock, MapPin, Sliders
} from 'lucide-react';

const iconMap = {
  Droplets: Droplets,
  Brain: Brain,
  ShieldAlert: ShieldAlert,
  Filter: Filter,
  HeartPulse: HeartPulse,
  Stethoscope: Stethoscope
};

const PLAIN_EXPLANATIONS = {
  severe_bleeding: {
    title: "Severe Bleeding & Hemorrhage",
    whatHappens: "When someone loses blood rapidly from an accident or surgery, their organs quickly run out of oxygen. They need donor blood (Type O-) and an operating surgeon immediately.",
    whyNearbyFails: "A small neighborhood clinic may be only 4 minutes away, but small clinics almost never store blood bags. Arriving there without blood forces doctors to order a second ambulance to another hospital, losing 35 precious minutes.",
    whatFixesIt: "Placing a refrigerated blood storage unit in the East Industrial Corridor ensures blood is reachable in under 15 minutes."
  },
  stroke: {
    title: "Acute Stroke",
    whatHappens: "A stroke happens when a blood clot or burst vessel cuts off blood to the brain. Millions of brain cells can die every minute. Patients need clot-dissolving medication within the first 45 minutes.",
    whyNearbyFails: "Doctors cannot give clot medication without a CT brain scan first, because if the stroke was caused by bleeding, the medicine would be fatal. A hospital without a 24/7 CT scanner cannot safely treat a stroke.",
    whatFixesIt: "Equipping outer community hospitals with 24/7 emergency CT imaging."
  },
  trauma: {
    title: "Severe Accident & Trauma",
    whatHappens: "Severe car collisions and workplace accidents often cause internal injuries and broken bones that require immediate surgery and an intensive care (ICU) bed.",
    whyNearbyFails: "Community dispensaries cannot perform emergency surgeries or provide ventilator support. Patients must be transported directly to a verified Level 1 or 2 trauma center.",
    whatFixesIt: "Adding mobile paramedic units and specialized ICU trauma beds in perimeter neighborhoods."
  },
  dialysis: {
    title: "Urgent Kidney Dialysis",
    whatHappens: "Patients with kidney disease build up dangerous toxins and excess fluid in their blood. Without emergency dialysis, this fluid can enter the lungs or trigger heart failure.",
    whyNearbyFails: "Most general clinics do not have sanitized dialysis stations or water filtration systems available during emergency night hours.",
    whatFixesIt: "Ensuring 24/7 on-call emergency dialysis slots at regional medical hubs."
  },
  emergency: {
    title: "General Medical Emergency",
    whatHappens: "Conditions like heart attacks, severe asthma attacks, or sudden allergic reactions require immediate paramedic assistance and emergency room doctors.",
    whyNearbyFails: "When ambulances take more than 20 minutes to arrive in outer sectors, paramedics cannot restart a stopped heart or open a blocked airway in time.",
    whatFixesIt: "Stationing 2 extra ambulances in the East and North sectors to cut response times in half."
  },
  diagnostics: {
    title: "Emergency Diagnostics & Testing",
    whatHappens: "Sudden internal pain or chest complications require immediate scans and blood tests to find out what is wrong before doctors can operate safely.",
    whyNearbyFails: "Clinics without on-site imaging or lab technicians must send tests out to private labs, causing hours of dangerous waiting.",
    whatFixesIt: "Providing 24/7 rapid blood testing and emergency ultrasound at public facilities."
  }
};

export default function MedicalNeedsPage({ selectedNeedId, setSelectedNeedId }) {
  const navigate = useNavigate();
  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedNeedId) || MEDICAL_NEEDS[0];
  const plainInfo = PLAIN_EXPLANATIONS[currentNeed.id] || PLAIN_EXPLANATIONS.severe_bleeding;

  return (
    <PageTransition>
      <div className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto w-full text-slate-800">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
              Healthcare Education
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Emergency Care Needs: Why Distance Can Fool Us
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Select an emergency below to learn what life-saving equipment is needed and why having a hospital nearby isn't always enough.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => navigate('/coverage')}
              className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>View On Map</span>
            </button>
          </div>
        </div>

        {/* 1. Condition Selector Buttons (Large & Accessible) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MEDICAL_NEEDS.map((need) => {
            const Icon = iconMap[need.icon] || HeartPulse;
            const isSelected = need.id === selectedNeedId;
            return (
              <button
                key={need.id}
                onClick={() => setSelectedNeedId(need.id)}
                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {need.goldenWindowMin}m
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 leading-snug">{need.name}</h3>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-2 block ${
                  isSelected ? 'text-blue-800' : 'text-slate-400'
                }`}>
                  Window: {need.goldenWindowMin} min
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. Plain-Language Two-Column Educational Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          
          {/* Left Column: What Is Needed */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                1. What this patient needs in the first hour
              </h2>
              <div className="flex items-center gap-1 text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5" />
                <span>Target: under {currentNeed.goldenWindowMin} min</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {plainInfo.whatHappens}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Required Life-Saving Tools:
              </span>
              {currentNeed.requiredResources.map((res, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">{res.label}</span>
                    <span className="text-xs text-slate-500">
                      Must be on-site and operational 24/7.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Why Proximity Fails */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  2. Why a nearby clinic might not be enough
                </h2>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-sm text-slate-800 space-y-2 leading-relaxed">
                <span className="font-bold text-amber-900 block">
                  The Real-World Danger:
                </span>
                <p>
                  {plainInfo.whyNearbyFails}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-sm text-slate-800 space-y-1 leading-relaxed">
                <span className="font-bold text-emerald-900 block">
                  How Communities Can Fix This:
                </span>
                <p>
                  {plainInfo.whatFixesIt}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => navigate('/coverage')}
                className="flex-1 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Check Coverage on Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => navigate('/what-if')}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Test a Community Fix</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </PageTransition>
  );
}