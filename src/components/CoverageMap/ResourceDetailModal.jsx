import React from 'react';
import { X, Phone, MapPin, Check } from 'lucide-react';

export default function ResourceDetailModal({ resource, onClose }) {
  if (!resource) return null;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/90 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.18)] overflow-hidden max-w-sm w-full">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{resource._categoryEmoji || '🏥'}</span>
          <div>
            <h3 className="text-sm font-black truncate max-w-[220px]">{resource.name}</h3>
            <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">{resource._categoryLabel || 'Healthcare Facility'}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 text-xs space-y-3">
        {/* Address & Contact */}
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
                      ? 'bg-amber-50 border-amber-200 text-amber-800'
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
                Ambulance Status
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                resource.status === 'Available'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {resource.status}
              </span>
            </div>
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
      </div>
    </div>
  );
}