import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { 
  ArrowLeft, ArrowRight, Sliders, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';
import { COVERAGE_ZONES } from '../data/coverageZones';
import { calculateSimulationResult } from '../data/simulationPresets';

export default function WhatIfPage({ activeSimulation: _activeSimulation, setActiveSimulation }) {
  const navigate = useNavigate();
  const [selectedCandidateId, setSelectedCandidateId] = useState('option-b');
  const [showCustomSandbox, setShowCustomSandbox] = useState(false);

  // Custom sandbox state
  const [customAction, setCustomAction] = useState('ADD');
  const [customResource, setCustomResource] = useState('ambulance');
  const [customZoneId, setCustomZoneId] = useState('zone-east');
  const [customQty, setCustomQty] = useState(2);

  const candidateInterventions = [
    {
      id: 'option-a',
      letter: 'A',
      title: '+2 ALS Ambulances',
      sector: 'East Industrial Corridor',
      zoneId: 'zone-east',
      resourceType: 'ambulance',
      quantity: 2,
      action: 'ADD',
      baselineCoverage: 38,
      simulatedCoverage: 72,
      coverageGain: '+34%',
      responseTimeBefore: 32,
      responseTimeAfter: 16,
      responseDelta: '-16 min',
      populationProtected: '+180,000',
      capex: 'Low-Medium ($160k)',
      deploymentSpeed: '2–4 weeks',
      clinicalImpact: 'Rapid triage & mobile resuscitation; cuts transit dead zone delay by 50%.',
      isRecommended: false,
      badge: 'Rapid Deployment',
      badgeClass: 'bg-slate-100 text-slate-700',
      simulatedMarker: {
        id: 'sim-amb-east-optA',
        name: 'Simulated 2x ALS Units (East Corridor)',
        type: 'ALS Ambulance',
        location: { lat: 13.1380, lng: 80.2950 },
        isSimulated: true
      }
    },
    {
      id: 'option-b',
      letter: 'B',
      title: '+1 Regional Cryo Blood Bank',
      sector: 'East/West Regional Hub',
      zoneId: 'zone-east',
      resourceType: 'blood_bank',
      quantity: 1,
      action: 'ADD',
      baselineCoverage: 38,
      simulatedCoverage: 81,
      coverageGain: '+43%',
      responseTimeBefore: 28,
      responseTimeAfter: 14,
      responseDelta: '-14 min',
      populationProtected: '+225,000',
      capex: 'Medium ($320k)',
      deploymentSpeed: '6–8 weeks',
      clinicalImpact: 'Maximum life-saving leverage: directly resolves universal O- exsanguination & trauma dead zones.',
      isRecommended: true,
      badge: '⭐ Algorithmic Recommendation',
      badgeClass: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-black',
      simulatedMarker: {
        id: 'sim-blood-optB',
        name: 'Simulated Cryo Blood Bank (East Hub)',
        type: 'Blood Bank (O- Guaranteed)',
        location: { lat: 13.1120, lng: 80.2650 },
        isSimulated: true
      }
    },
    {
      id: 'option-c',
      letter: 'C',
      title: '+1 ICU Resuscitation Bay',
      sector: 'North Suburban Sector',
      zoneId: 'zone-north',
      resourceType: 'hospital',
      quantity: 1,
      action: 'ADD',
      baselineCoverage: 41,
      simulatedCoverage: 58,
      coverageGain: '+17%',
      responseTimeBefore: 30,
      responseTimeAfter: 22,
      responseDelta: '-8 min',
      populationProtected: '+95,000',
      capex: 'Very High ($850k)',
      deploymentSpeed: '6–12 months',
      clinicalImpact: 'High-intensity post-surgical capacity, but localized to a single corridor.',
      isRecommended: false,
      badge: 'Capital Heavy',
      badgeClass: 'bg-slate-100 text-slate-600',
      simulatedMarker: {
        id: 'sim-icu-optC',
        name: 'Simulated ICU Trauma Bed Unit (North)',
        type: 'Level-2 Trauma / ICU',
        location: { lat: 13.1760, lng: 80.2180 },
        isSimulated: true
      }
    }
  ];

  // Active candidate object
  const activeCandidate = candidateInterventions.find(c => c.id === selectedCandidateId) || candidateInterventions[1];

  // Calculate custom simulation
  const customTargetZone = COVERAGE_ZONES.find(z => z.id === customZoneId) || COVERAGE_ZONES[3];
  const customResult = calculateSimulationResult(customTargetZone, customAction, customResource, customQty);

  const handleApplyPresetToMap = (opt) => {
    setActiveSimulation({
      id: `sim-${opt.id}`,
      name: `${opt.title} in ${opt.sector}`,
      targetZoneId: opt.zoneId,
      simulatedMarker: opt.simulatedMarker,
      result: {
        before: {
          coveragePct: opt.baselineCoverage,
          responseMin: opt.responseTimeBefore,
          zoneStatus: 'dead_zone',
          populationCovered: 144400
        },
        after: {
          coveragePct: opt.simulatedCoverage,
          responseMin: opt.responseTimeAfter,
          zoneStatus: opt.simulatedCoverage >= 70 ? 'covered' : 'limited',
          populationCovered: 324400,
          populationImpact: opt.populationProtected
        }
      }
    });
    navigate('/coverage');
  };

  const handleApplyCustomToMap = () => {
    setActiveSimulation({
      id: 'sim-custom',
      name: `${customAction} ${customQty} ${customResource}(s) in ${customTargetZone.name}`,
      targetZoneId: customTargetZone.id,
      simulatedMarker: {
        id: 'sim-marker-custom',
        name: `Simulated ${customResource} (${customTargetZone.name})`,
        location: customTargetZone.center,
        isSimulated: true
      },
      result: customResult
    });
    navigate('/coverage');
  };

  return (
    <PageTransition>
      <div className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto w-full text-slate-800">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Community Health Planning
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Plan Community Solutions
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              See how adding ambulances or medical supplies can save lives before spending public money.
            </p>
          </div>

          <button
            onClick={() => navigate('/coverage')}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
            <span>Back to Map</span>
          </button>
        </div>

        {/* 1. Step 1: Candidate Selector */}
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Step 1: Choose a proposed improvement to test
            </h2>
            <span className="text-xs text-slate-500 font-medium">3 Tested Community Options</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {candidateInterventions.map((opt) => {
              const isSelected = selectedCandidateId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedCandidateId(opt.id)}
                  className={`p-5 rounded-2xl border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50/60 border-emerald-600 ring-2 ring-emerald-500'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {opt.letter}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        opt.isRecommended ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {opt.isRecommended ? '⭐ Best Choice' : opt.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 leading-tight pt-1">
                      {opt.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Target Area: {opt.sector}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Safe Access Gain:</span>
                    <strong className="text-emerald-700 font-bold">{opt.coverageGain}</strong>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Step 2: Clear Before vs After Outcome */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                Step 2: Projected Community Impact
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {activeCandidate.title} — Before vs After
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Estimated Cost:</span>
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-md">
                {activeCandidate.capex}
              </span>
              <span className="text-xs text-slate-400">• Ready in {activeCandidate.deploymentSpeed}</span>
            </div>
          </div>

          {/* Three Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. CURRENT STATE */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                1. Current Today
              </span>

              <div>
                <span className="text-xs text-slate-500 block">Current Safe Coverage:</span>
                <div className="text-3xl font-extrabold text-slate-400">
                  {activeCandidate.baselineCoverage}%
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between">
                  <span>Ambulance Wait:</span>
                  <strong className="text-slate-900">{activeCandidate.responseTimeBefore} min</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <span className="text-red-700 font-bold">🔴 Dangerous Delay</span>
                </div>
              </div>
            </div>

            {/* 2. PROPOSED IMPROVEMENT */}
            <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800 block">
                2. What We Add
              </span>

              <div>
                <span className="text-xs text-blue-800 block">Equipment & Facility:</span>
                <div className="text-xl font-bold text-slate-900 leading-snug">
                  {activeCandidate.title}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed border-t border-blue-200 pt-3">
                {activeCandidate.clinicalImpact}
              </p>
            </div>

            {/* 3. SIMULATED RESULT */}
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  3. New Community Result
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded">
                  {activeCandidate.coverageGain}
                </span>
              </div>

              <div>
                <span className="text-xs text-emerald-800 block">Safe Protection Level:</span>
                <div className="text-3xl font-extrabold text-emerald-700">
                  {activeCandidate.simulatedCoverage}%
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-emerald-950 border-t border-emerald-200 pt-3 font-medium">
                <div className="flex items-center justify-between">
                  <span>Ambulance Wait:</span>
                  <strong className="text-emerald-800">{activeCandidate.responseTimeAfter} min ({activeCandidate.responseDelta})</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>More People Protected:</span>
                  <strong className="text-emerald-800 font-bold">{activeCandidate.populationProtected} people</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Calculated using local road distances and hospital readiness standards.</span>
            </div>

            <button
              onClick={() => handleApplyPresetToMap(activeCandidate)}
              className="rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <span>View This Improvement on the Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* 3. Custom Sandbox */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <button
            onClick={() => setShowCustomSandbox(!showCustomSandbox)}
            className="w-full p-5 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Custom Planning Sandbox (Optional)</h3>
                <p className="text-xs text-slate-500">Test your own combination of equipment, areas, and quantities</p>
              </div>
            </div>
            {showCustomSandbox ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>

          {showCustomSandbox && (
            <div className="p-6 border-t border-slate-200 bg-white space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Action */}
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Action</label>
                  <select
                    value={customAction}
                    onChange={(e) => setCustomAction(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="ADD">Add New Equipment</option>
                    <option value="RELOCATE">Relocate Existing</option>
                    <option value="REMOVE">Remove Equipment</option>
                  </select>
                </div>

                {/* Resource Type */}
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Equipment Type</label>
                  <select
                    value={customResource}
                    onChange={(e) => setCustomResource(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="ambulance">Emergency Ambulance</option>
                    <option value="blood_bank">Blood Storage Unit (O-)</option>
                    <option value="hospital">Emergency ICU Bed</option>
                    <option value="diagnostic">Rapid CT Scanner</option>
                  </select>
                </div>

                {/* Sector */}
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Neighborhood</label>
                  <select
                    value={customZoneId}
                    onChange={(e) => setCustomZoneId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                  >
                    {COVERAGE_ZONES.map(z => (
                      <option key={z.id} value={z.id}>{z.name}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 block mb-1">
                    Quantity: <strong className="text-slate-900">{customQty}</strong>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={customQty}
                    onChange={(e) => setCustomQty(Number(e.target.value))}
                    className="w-full accent-blue-700 cursor-pointer mt-2"
                  />
                </div>
              </div>

              {/* Calculated Custom Result Strip */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">Custom Result:</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    Coverage: {customResult.before.coveragePct}% → <span className="text-emerald-700">{customResult.after.coveragePct}%</span> • 
                    Arrival: {customResult.before.responseMin}m → <span className="text-emerald-700">{customResult.after.responseMin}m</span>
                  </div>
                </div>

                <button
                  onClick={handleApplyCustomToMap}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <span>View on Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </PageTransition>
  );
}