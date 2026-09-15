import React from 'react';
import { 
  X, Phone, Clock, MapPin, Check, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import { MEDICAL_NEEDS } from '../../data/medicalNeeds';

export default function ResourceDetailModal({ resource, selectedNeedId, onClose }) {
  if (!resource) return null;

  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedNeedId) || MEDICAL_NEEDS[0];
  const capability = resource._capabilityStatus || null;

  return (
    <div className="bg-white rounded-xl border border-slate-300 shadow-2xl overflow-hidden max-w-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-200 select-none">
      {/* Header */}
      <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl shrink-0">{resource._categoryEmoji || '🏥'}</span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold truncate">{resource.name}</h3>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {resource._categoryLabel || 'Healthcare Facility'}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 text-xs space-y-3.5 max-h-[80vh] overflow-y-auto">
        {/* Clinical Need Evaluation Banner */}
        {capability && (
          <div className={`p-2.5 rounded-lg border text-xs ${
            capability.qualified
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-red-50/80 border-red-200 text-red-950'
          }`}>
            <div className="flex items-center justify-between font-bold mb-1">
              <span className="flex items-center gap-1.5 text-[11px]">
                {capability.qualified ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                )}
                <span>Clinical Fit: {currentNeed.name}</span>
              </span>
              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                capability.qualified ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
              }`}>
                {capability.qualified ? 'QUALIFIED' : 'DEFICIT'}
              </span>
            </div>
            <p className="text-[11px] leading-snug">
              {capability.reason}
            </p>
          </div>
        )}

        {/* Address & Contact */}
        <div className="space-y-1">
          {resource.address && (
            <div className="flex items-start gap-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{resource.address}</span>
            </div>
          )}
          {resource.contact && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{resource.contact}</span>
            </div>
          )}
          {resource.hours && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{resource.hours}</span>
            </div>
          )}
        </div>

        {/* Hospital Capabilities Checklist */}
        {resource.capabilities && (
          <div>
            <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-1.5">
              Clinical Capabilities & Readiness
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(resource.capabilities).map(([key, enabled]) => (
                <div
                  key={key}
                  className={`flex items-center justify-between p-1.5 rounded border ${
                    enabled
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                  }`}
                >
                  <span className="capitalize">{key.replace('_', ' ')}</span>
                  {enabled ? (
                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                  ) : (
                    <span className="text-slate-400 text-[10px]">✕</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hospital Beds / Metrics */}
        {resource.metrics && (
          <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-center">
            <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
              <span className="text-[9px] text-slate-500 uppercase block">Total Beds</span>
              <span className="text-sm font-bold text-slate-900">{resource.metrics.totalBeds}</span>
            </div>
            <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
              <span className="text-[9px] text-slate-500 uppercase block">Free ICU</span>
              <span className="text-sm font-bold text-red-600">{resource.metrics.availableIcuBeds}</span>
            </div>
            <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
              <span className="text-[9px] text-slate-500 uppercase block">Ventilators</span>
              <span className="text-sm font-bold text-slate-900">{resource.metrics.ventilatorAvailable}</span>
            </div>
          </div>
        )}

        {/* Blood Bank Inventory Table */}
        {resource.inventory && (
          <div>
            <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-1.5">
              Live Blood Group Inventory (Units)
            </span>
            <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
              {Object.entries(resource.inventory).map(([group, count]) => (
                <div
                  key={group}
                  className={`p-1.5 rounded border ${
                    count === 0
                      ? 'bg-red-50 border-red-300 text-red-700 font-bold'
                      : count < 5
                      ? 'bg-amber-50 border-amber-200 text-amber-800 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="text-[10px] font-bold text-slate-500">{group}</div>
                  <div className="text-xs font-black">{count}</div>
                </div>
              ))}
            </div>
            {resource.components && (
              <p className="text-[10px] text-slate-500 mt-2">
                Components: {resource.components.join(', ')}
              </p>
            )}
          </div>
        )}

        {/* Ambulance Status */}
        {resource.equipment && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                Ambulance Status & Unit Specs
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                resource.status === 'Available'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {resource.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-600">Type: <strong className="text-slate-800">{resource.type}</strong></p>
            <p className="text-[11px] text-slate-600">Base: {resource.baseStation}</p>
            <p className="text-[11px] text-slate-600">Crew: {resource.crew}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {resource.equipment.map((item, idx) => (
                <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Diagnostic Center Details */}
        {resource.modalities && (
          <div>
            <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-1.5">
              Diagnostic Modalities
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(resource.modalities).map(([mod, avail]) => (
                <div
                  key={mod}
                  className={`p-1.5 rounded border flex items-center justify-between ${
                    avail
                      ? 'bg-blue-50 border-blue-200 text-blue-900 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                  }`}
                >
                  <span className="uppercase">{mod.replace('_', ' ')}</span>
                  {avail ? <Check className="w-3 h-3 text-blue-600" /> : '✕'}
                </div>
              ))}
            </div>
            {resource.turnaroundMin && (
              <p className="text-[10px] text-slate-500 mt-2">
                Emergency Turnaround Time: <strong>{resource.turnaroundMin} min</strong>
              </p>
            )}
          </div>
        )}

        {/* Pharmacy Details */}
        {resource.is24Hours !== undefined && (
          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-1">
              Pharmacy Emergency Licenses
            </span>
            <div className="flex items-center justify-between p-1.5 rounded bg-slate-50 border border-slate-200">
              <span>24/7 Operating Hours:</span>
              <strong className={resource.is24Hours ? 'text-emerald-700' : 'text-red-600'}>
                {resource.is24Hours ? 'Yes (Open 24h)' : 'No (Closes Evening)'}
              </strong>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-slate-50 border border-slate-200">
              <span>Trauma Supplies Stocked:</span>
              <strong className={resource.traumaSuppliesStocked ? 'text-emerald-700' : 'text-slate-400'}>
                {resource.traumaSuppliesStocked ? 'Yes (Hemostatics/Splints)' : 'No'}
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}