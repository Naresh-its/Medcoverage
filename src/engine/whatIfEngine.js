import { calculateEffectiveCoverage } from './coverageEngine.js';

/**
 * Deep clones resource pool to guarantee 100% non-mutating virtual simulation.
 */
function cloneResources(resources) {
  return {
    hospitals: (resources.hospitals || []).map(h => ({
      ...h,
      capabilities: { ...(h.capabilities || {}) },
      metrics: { ...(h.metrics || {}) }
    })),
    bloodBanks: (resources.bloodBanks || []).map(b => ({
      ...b,
      inventory: { ...(b.inventory || {}) },
      components: [...(b.components || [])]
    })),
    ambulances: (resources.ambulances || []).map(a => ({
      ...a,
      equipment: [...(a.equipment || [])]
    })),
    diagnostics: (resources.diagnostics || []).map(d => ({
      ...d,
      modalities: { ...(d.modalities || {}) }
    })),
    pharmacies: (resources.pharmacies || []).map(p => ({ ...p }))
  };
}

/**
 * Simulates an infrastructure intervention virtually.
 * Novelty Layer 5:
 * Clones the baseline resource pool, applies the hypothetical change, and recalculates effective coverage.
 *
 * @param {object} zone Target zone
 * @param {'ADD' | 'REMOVE' | 'RELOCATE'} action
 * @param {'ambulance' | 'hospital' | 'blood_bank' | 'diagnostic' | 'pharmacy'} resourceType
 * @param {number} quantity
 * @param {object} medicalNeed Target clinical scenario
 * @param {object} resources Baseline resources
 * @param {{ lat: number, lng: number }} [customLocation] Optional deployment coordinates
 * @returns {object} Simulation Before/After and Impact Report
 */
export function simulateIntervention(
  zone,
  action,
  resourceType,
  quantity = 1,
  medicalNeed,
  resources = {},
  customLocation = null
) {
  // 1. Calculate baseline before state
  const beforeCoverage = calculateEffectiveCoverage(zone, medicalNeed, resources);

  // 2. Clone resource state (Zero mutation of source data)
  const virtualResources = cloneResources(resources);
  const deployLoc = customLocation || zone.center;
  let simulatedMarker = null;

  // 3. Apply virtual intervention
  if (action === 'ADD') {
    if (resourceType === 'ambulance') {
      for (let i = 1; i <= quantity; i++) {
        const virtualAmb = {
          id: `sim-amb-${Date.now()}-${i}`,
          name: `Simulated ALS Unit ${i} (${zone.name})`,
          type: 'ALS (Advanced Life Support)',
          zoneId: zone.id,
          location: {
            lat: deployLoc.lat + (i * 0.003),
            lng: deployLoc.lng + (i * 0.003)
          },
          status: 'Available',
          equipment: ['Ventilator', 'Defibrillator', 'Fluid Resuscitation'],
          crew: 'Paramedic + EMT',
          baseStation: `${zone.name} Fast-Response Post`,
          avgSpeedKmh: 48,
          isSimulated: true
        };
        virtualResources.ambulances.unshift(virtualAmb);
        if (!simulatedMarker) simulatedMarker = virtualAmb;
      }
    } else if (resourceType === 'blood_bank') {
      const virtualBlood = {
        id: `sim-blood-${Date.now()}`,
        name: `Simulated Cryo Blood Storage (${zone.name})`,
        zoneId: zone.id,
        location: deployLoc,
        inventory: {
          'A+': 20, 'A-': 5, 'B+': 20, 'B-': 5,
          'O+': 30, 'O-': 10, 'AB+': 8, 'AB-': 2
        },
        components: ['PRBC', 'Cryoprecipitate', 'FFP'],
        operatingHours: '24/7 Emergency Dispatch',
        isSimulated: true
      };
      virtualResources.bloodBanks.unshift(virtualBlood);
      simulatedMarker = virtualBlood;
    } else if (resourceType === 'hospital' || resourceType === 'icu') {
      const virtualHosp = {
        id: `sim-hosp-${Date.now()}`,
        name: `Simulated Level-2 Trauma & ICU Center (${zone.name})`,
        zoneId: zone.id,
        location: deployLoc,
        capabilities: {
          emergency: true,
          icu: true,
          trauma: true,
          surgery: true,
          dialysis: true,
          ct_scan: true,
          cardiac_cath: false
        },
        metrics: {
          totalBeds: 150,
          availableIcuBeds: 8,
          ventilatorAvailable: 4,
          traumaTier: 'Level 2',
          avgWaitTimeMin: 15
        },
        isSimulated: true
      };
      virtualResources.hospitals.unshift(virtualHosp);
      simulatedMarker = virtualHosp;
    } else if (resourceType === 'diagnostic') {
      const virtualDiag = {
        id: `sim-diag-${Date.now()}`,
        name: `Simulated Rapid Diagnostics & 128-CT (${zone.name})`,
        zoneId: zone.id,
        location: deployLoc,
        modalities: { ct_scan: true, mri: true, ultrasound: true, stat_lab: true },
        turnaroundMin: 20,
        isSimulated: true
      };
      virtualResources.diagnostics.unshift(virtualDiag);
      simulatedMarker = virtualDiag;
    }
  } else if (action === 'REMOVE') {
    if (resourceType === 'ambulance' && virtualResources.ambulances.length > 0) {
      virtualResources.ambulances = virtualResources.ambulances.slice(quantity);
    } else if (resourceType === 'hospital' && virtualResources.hospitals.length > 0) {
      // Disable capabilities of nearest hospital
      virtualResources.hospitals = virtualResources.hospitals.filter(h => h.zoneId !== zone.id);
    }
  } else if (action === 'RELOCATE') {
    if (resourceType === 'ambulance' && virtualResources.ambulances.length > 0) {
      // Find ambulance in another zone and relocate to target zone
      const ambToRelocate = virtualResources.ambulances.find(a => a.zoneId !== zone.id);
      if (ambToRelocate) {
        ambToRelocate.location = deployLoc;
        ambToRelocate.zoneId = zone.id;
        ambToRelocate.name += ' (Relocated)';
        simulatedMarker = ambToRelocate;
      }
    }
  }

  // 4. Recalculate effective coverage after virtual intervention
  const afterCoverage = calculateEffectiveCoverage(zone, medicalNeed, virtualResources);

  // 5. Compute Impact Delta
  const coverageGainPct = afterCoverage.effectiveCoveragePct - beforeCoverage.effectiveCoveragePct;
  const responseReductionMin = Math.max(0, beforeCoverage.avgResponseMin - afterCoverage.avgResponseMin);
  const population = zone.population || 100000;
  const populationProtected = Math.round(population * (Math.max(0, coverageGainPct) / 100));

  return {
    scenarioId: `sim-${action.toLowerCase()}-${resourceType}-${zone.id}`,
    zoneId: zone.id,
    action,
    resourceType,
    quantity,
    before: {
      coveragePct: beforeCoverage.effectiveCoveragePct,
      responseMin: beforeCoverage.avgResponseMin,
      zoneStatus: beforeCoverage.status,
      populationCovered: Math.round(population * (beforeCoverage.effectiveCoveragePct / 100))
    },
    after: {
      coveragePct: afterCoverage.effectiveCoveragePct,
      responseMin: afterCoverage.avgResponseMin,
      zoneStatus: afterCoverage.status,
      populationCovered: Math.round(population * (afterCoverage.effectiveCoveragePct / 100)),
      populationImpact: (coverageGainPct >= 0 ? '+' : '') + populationProtected.toLocaleString()
    },
    impact: {
      coverageGainPct,
      responseReductionMin,
      populationProtected,
      isDeadZoneResolved: beforeCoverage.status === 'dead_zone' && afterCoverage.status !== 'dead_zone'
    },
    simulatedMarker,
    virtualResources
  };
}

/**
 * Compares and ranks multiple candidate interventions.
 * Novelty Layer 6:
 * Answers: "WHAT INTERVENTION WOULD IMPROVE ACCESS THE MOST?"
 *
 * @param {object} zone Target zone
 * @param {object} medicalNeed Target clinical scenario
 * @param {object} resources Baseline resources
 * @returns {object} Ranked recommendations with best recommendation highlighted
 */
export function rankCandidateInterventions(zone, medicalNeed, resources = {}) {
  const candidateScenarios = [
    { label: 'Option A: Add 2 Dedicated ALS Ambulances', action: 'ADD', resourceType: 'ambulance', quantity: 2 },
    { label: 'Option B: Deploy 24/7 Blood Bank with O- Reserve', action: 'ADD', resourceType: 'blood_bank', quantity: 1 },
    { label: 'Option C: Establish Level-2 Trauma & ICU Unit', action: 'ADD', resourceType: 'hospital', quantity: 1 },
    { label: 'Option D: Relocate Idle Ambulance to Sector', action: 'RELOCATE', resourceType: 'ambulance', quantity: 1 }
  ];

  const evaluations = candidateScenarios.map(candidate => {
    const sim = simulateIntervention(
      zone,
      candidate.action,
      candidate.resourceType,
      candidate.quantity,
      medicalNeed,
      resources
    );

    // Explainable Ranking Formula:
    // Score = (Coverage Gain * 0.5) + (Dead Zone Resolved Bonus 30) + (Time Saved * 0.2)
    const deadZoneBonus = sim.impact.isDeadZoneResolved ? 30 : 0;
    const score = Math.round(
      (sim.impact.coverageGainPct * 0.5) +
      deadZoneBonus +
      (sim.impact.responseReductionMin * 0.2)
    );

    return {
      title: candidate.label,
      action: candidate.action,
      resourceType: candidate.resourceType,
      quantity: candidate.quantity,
      coverageBefore: sim.before.coveragePct,
      coverageAfter: sim.after.coveragePct,
      coverageGain: sim.impact.coverageGainPct,
      responseReductionMin: sim.impact.responseReductionMin,
      populationProtected: sim.impact.populationProtected,
      isDeadZoneResolved: sim.impact.isDeadZoneResolved,
      score,
      simulatedMarker: sim.simulatedMarker
    };
  });

  // Sort descending by score
  evaluations.sort((a, b) => b.score - a.score);

  return {
    zoneId: zone.id,
    zoneName: zone.name,
    medicalNeedId: medicalNeed.id,
    medicalNeedName: medicalNeed.name,
    recommendations: evaluations,
    bestRecommendation: evaluations[0]
  };
}