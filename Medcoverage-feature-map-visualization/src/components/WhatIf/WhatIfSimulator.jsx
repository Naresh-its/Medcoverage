import React, { useEffect, useState } from 'react';
import { 
  Sliders, ArrowRight, RefreshCw, CheckCircle2, AlertTriangle, 
  Sparkles, PlusCircle, MinusCircle, Move, HelpCircle, Layers 
} from 'lucide-react';
import { SIMULATION_PRESETS, calculateSimulationResult } from '../../data/simulationPresets';
import { COVERAGE_ZONES } from '../../data/coverageZones';

export default function WhatIfSimulator({ onApplySimulationToMap, initialZone, activeSimulation }) {
  const [selectedPresetId, setSelectedPresetId] = useState(activeSimulation?.id || 'sim-add-2-amb-east');
  const [action, setAction] = useState('ADD');
  const [resourceType, setResourceType] = useState('ambulance');
  const [selectedZoneId, setSelectedZoneId] = useState(activeSimulation?.targetZoneId || initialZone?.id || 'zone-east');
  const [quantity, setQuantity] = useState(activeSimulation?.quantity || 2);
  const [hasSimulated, setHasSimulated] = useState(Boolean(activeSimulation));
  const [isSimulatingTransition, setIsSimulatingTransition] = useState(false);

  // Keep the simulator aligned with a scenario selected from the coverage map.
  useEffect(() => {
    if (!activeSimulation) return;
    setSelectedPresetId(activeSimulation.id || null);
    setSelectedZoneId(activeSimulation.targetZoneId || 'zone-east');
    setAction(activeSimulation.action || activeSimulation.result?.action || 'ADD');
    setResourceType(activeSimulation.resourceType || 'ambulance');
    setQuantity(activeSimulation.quantity || 1);
    setHasSimulated(Boolean(activeSimulation.result));
  }, [activeSimulation]);

  // Selected Zone object
  const targetZone = COVERAGE_ZONES.find(z => z.id === selectedZoneId) || COVERAGE_ZONES[3];

  // Current simulation calculation
  const simulationResult = calculateSimulationResult(targetZone, action, resourceType, quantity);

  const handleRunSimulation = () => {
    setIsSimulatingTransition(true);
    setTimeout(() => {
      setIsSimulatingTransition(false);
      setHasSimulated(true);

      const resourceLabels = {
        ambulance: 'ALS Ambulance',
        hospital: 'Trauma & ICU Center',
        icu: 'Surgical ICU',
        blood_bank: 'Emergency Blood Bank',
        diagnostic: 'Diagnostic Center',
        pharmacy: 'Emergency Pharmacy'
      };
      const markerType = resourceLabels[resourceType] || 'Healthcare Resource';

      if (onApplySimulationToMap) {
        onApplySimulationToMap({
          id: selectedPresetId || `custom-${Date.now()}`,
          name: `${action} ${quantity} ${markerType}(s) in ${targetZone.name}`,
          targetZoneId: targetZone.id,
          action,
          resourceType,
          quantity,
          simulatedMarker: {
            id: `custom-sim-${Date.now()}`,
            name: `Simulated ${markerType} (${targetZone.name})`,
            type: markerType,
            location: targetZone.center,
            isSimulated: true
          },
          result: simulationResult
        });
      }
    }, 450);
  };

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setAction(preset.action);
    setResourceType(preset.resourceType);
    setSelectedZoneId(preset.targetZoneId);
    setQuantity(preset.quantity);
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200 mb-2">
          <Sliders className="w-3.5 h-3.5" />
          Infrastructure Planning Engine
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          What If We Change the Infrastructure?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Simulate targeted additions, removals, or redeployments before investing millions in physical assets. Test how emergency ambulance stations and surgical beds transform real patient survival odds.
        </p>
      </div>

      {/* Preset Quick-Buttons */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
          Quick Preset Scenarios:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SIMULATION_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-50/70 border-red-500 ring-1 ring-red-500 text-slate-900'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-red-700">
                    {preset.badge}
                  </span>
                  <span className="text-xs font-bold text-red-600">
                    +{preset.after.coveragePct - preset.before.coveragePct}% Coverage
                  </span>
                </div>
                <div className="text-xs font-bold leading-snug">{preset.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Simulator Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200">
        {/* Left Column: Action & Parameters */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              1. Choose Action
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ADD', label: 'ADD', icon: PlusCircle, color: 'text-emerald-600' },
                { id: 'REMOVE', label: 'REMOVE', icon: MinusCircle, color: 'text-red-600' },
                { id: 'RELOCATE', label: 'RELOCATE', icon: Move, color: 'text-amber-600' },
              ].map((act) => {
                const Icon = act.icon;
                const isSelected = action === act.id;
                return (
                  <button
                    key={act.id}
                    onClick={() => { setAction(act.id); setSelectedPresetId(null); }}
                    className={`py-2.5 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-slate-900 text-slate-950 shadow-xs'
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${act.color}`} />
                    {act.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              2. Select Resource Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'ambulance', label: 'Ambulance (ALS)', emoji: '🚑' },
                { id: 'hospital', label: 'Hospital / ICU', emoji: '🏥' },
                { id: 'blood_bank', label: 'Blood Bank', emoji: '🩸' },
                { id: 'diagnostic', label: 'Diagnostic Center', emoji: '🧪' },
                { id: 'pharmacy', label: 'Emergency Chemist', emoji: '💊' },
              ].map((res) => (
                <button
                  key={res.id}
                  onClick={() => { setResourceType(res.id); setSelectedPresetId(null); }}
                  className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                    resourceType === res.id
                      ? 'bg-white border-red-600 text-slate-950 shadow-xs ring-1 ring-red-600 font-bold'
                      : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <span className="mr-1.5">{res.emoji}</span>
                  {res.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                3. Target Sector
              </label>
              <select
                value={selectedZoneId}
                onChange={(e) => { setSelectedZoneId(e.target.value); setSelectedPresetId(null); }}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {COVERAGE_ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.status === 'dead_zone' ? '🔴 Dead Zone' : z.status === 'limited' ? '🟠 Limited' : '🟢 Covered'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                4. Quantity
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 5].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => { setQuantity(qty); setSelectedPresetId(null); }}
                    className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      quantity === qty
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulatingTransition}
            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow-sm shadow-red-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isSimulatingTransition ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Calculating Spatial Accessibility Models...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run Simulation & Update Model
              </>
            )}
          </button>
        </div>

        {/* Right Column: Dynamic Before vs After Comparison Card */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Comparative Impact Matrix
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Demo Projection
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* BEFORE CARD */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Current Baseline
                </span>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Coverage</span>
                  <div className="text-2xl font-black text-slate-700">
                    {simulationResult.before.coveragePct}%
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Avg Response Time</span>
                  <div className="text-lg font-bold text-slate-800">
                    {simulationResult.before.responseMin} min
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Dead Zone Severity</span>
                  <span className="text-xs font-bold text-red-600">
                    {simulationResult.before.zoneStatus === 'dead_zone' ? 'Critical (High Risk)' : 'Constrained'}
                  </span>
                </div>
              </div>

              {/* AFTER CARD */}
              <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-bl">
                  AFTER
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Simulated Impact
                </span>
                <div>
                  <span className="text-[10px] text-emerald-600 block uppercase font-medium">Coverage</span>
                  <div className="text-2xl font-black text-emerald-700">
                    {simulationResult.after.coveragePct}%
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-600 block uppercase font-medium">Avg Response Time</span>
                  <div className="text-lg font-bold text-emerald-900">
                    {simulationResult.after.responseMin} min
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-600 block uppercase font-medium">Dead Zone Severity</span>
                  <span className="text-xs font-bold text-emerald-800">
                    {simulationResult.after.zoneStatus === 'covered' ? 'Resolved / Safe' : 'Substantially Reduced'}
                  </span>
                </div>
              </div>
            </div>

            {/* Impact Highlights */}
            <div className="mt-4 p-3.5 rounded-lg bg-slate-900 text-white text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-red-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Accessibility Gain: +{simulationResult.after.coveragePct - simulationResult.before.coveragePct}%</span>
              </div>
              <p className="text-slate-300">
                Estimated to improve timely emergency response for{' '}
                <strong className="text-white font-bold underline decoration-red-500">
                  {simulationResult.after.populationImpact} residents
                </strong>{' '}
                in {targetZone.name}.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Map automatically reflects updated boundary parameters.</span>
            <span className="font-semibold text-slate-800">Deterministic Model</span>
          </div>
        </div>
      </div>
    </section>
  );
}