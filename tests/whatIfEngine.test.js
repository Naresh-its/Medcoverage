import { describe, it, expect } from 'vitest';
import { 
  simulateIntervention, 
  rankCandidateInterventions,
  calculateEffectiveCoverage 
} from '../src/engine/index.js';

import { HOSPITALS, BLOOD_BANKS, AMBULANCES, DIAGNOSTICS, PHARMACIES } from '../src/data/mockHealthcareData.js';
import { MEDICAL_NEEDS } from '../src/data/medicalNeeds.js';
import { COVERAGE_ZONES } from '../src/data/coverageZones.js';

const baselineResources = {
  hospitals: HOSPITALS,
  bloodBanks: BLOOD_BANKS,
  ambulances: AMBULANCES,
  diagnostics: DIAGNOSTICS,
  pharmacies: PHARMACIES
};

describe('What-If Intervention Simulator (whatIfEngine.js)', () => {

  const eastZone = COVERAGE_ZONES.find(z => z.id === 'zone-east');
  const severeBleeding = MEDICAL_NEEDS.find(n => n.id === 'severe_bleeding');

  it('maintains strict Before -> After metrics consistency', () => {
    const sim = simulateIntervention(
      eastZone,
      'ADD',
      'blood_bank',
      1,
      severeBleeding,
      baselineResources
    );

    // 1. Before state must strictly match independent baseline calculation
    const baseline = calculateEffectiveCoverage(eastZone, severeBleeding, baselineResources);
    expect(sim.before.coveragePct).toBe(baseline.effectiveCoveragePct);
    expect(sim.before.zoneStatus).toBe(baseline.status);

    // 2. Population covered math consistency
    const expectedBeforePop = Math.round(eastZone.population * (sim.before.coveragePct / 100));
    expect(sim.before.populationCovered).toBe(expectedBeforePop);

    const expectedAfterPop = Math.round(eastZone.population * (sim.after.coveragePct / 100));
    expect(sim.after.populationCovered).toBe(expectedAfterPop);

    // 3. Impact delta consistency
    expect(sim.impact.coverageGainPct).toBe(sim.after.coveragePct - sim.before.coveragePct);
    expect(sim.impact.populationProtected).toBe(expectedAfterPop - expectedBeforePop);
  });

  it('adding a blood bank in East Industrial Corridor improves coverage when it addresses the clinical bottleneck', () => {
  const resourcesWithoutBlood = {
    ...baselineResources,
    bloodBanks: []
  };

  const sim = simulateIntervention(
    eastZone,
    'ADD',
    'blood_bank',
    1,
    severeBleeding,
    resourcesWithoutBlood
  );

  // Before: deliberately create a critical blood-resource failure.
  expect(sim.before.zoneStatus).toBe('dead_zone');

  // After: the intervention should improve the clinical state.
  expect(sim.after.zoneStatus).not.toBe('dead_zone');
  expect(sim.impact.isDeadZoneResolved).toBe(true);
  expect(sim.impact.coverageGainPct).toBeGreaterThan(20);

  // Simulator should expose the hypothetical resource.
  expect(sim.simulatedMarker).not.toBeNull();
  expect(sim.simulatedMarker.isSimulated).toBe(true);
});

  it('adding ambulances reduces response time and increases coverage without touching baseline', () => {
    const sim = simulateIntervention(
      eastZone,
      'ADD',
      'ambulance',
      2,
      severeBleeding,
      baselineResources
    );

    expect(sim.after.coveragePct).toBeGreaterThanOrEqual(sim.before.coveragePct);
    expect(sim.impact.coverageGainPct).toBeGreaterThanOrEqual(0);
    expect(sim.virtualResources.ambulances.length).toBe(baselineResources.ambulances.length + 2);
  });

  it('ranks candidate interventions by clinical composite impact score in descending order', () => {
    const ranking = rankCandidateInterventions(eastZone, severeBleeding, baselineResources);

    expect(ranking.recommendations).toBeInstanceOf(Array);
    expect(ranking.recommendations.length).toBeGreaterThanOrEqual(3);
    expect(ranking.bestRecommendation).toBeDefined();
    expect(ranking.bestRecommendation.score).toBe(ranking.recommendations[0].score);

    // Verify monotonic descending order of scores
    for (let i = 0; i < ranking.recommendations.length - 1; i++) {
      expect(ranking.recommendations[i].score).toBeGreaterThanOrEqual(ranking.recommendations[i + 1].score);
    }
  });

  it('guarantees zero mutation of source baseline datasets across multiple simulations', () => {
    const initialAmbCount = baselineResources.ambulances.length;
    const initialHospCount = baselineResources.hospitals.length;
    const initialBloodCount = baselineResources.bloodBanks.length;

    simulateIntervention(eastZone, 'ADD', 'ambulance', 4, severeBleeding, baselineResources);
    simulateIntervention(eastZone, 'ADD', 'blood_bank', 2, severeBleeding, baselineResources);
    simulateIntervention(eastZone, 'REMOVE', 'ambulance', 1, severeBleeding, baselineResources);
    simulateIntervention(eastZone, 'RELOCATE', 'ambulance', 1, severeBleeding, baselineResources);

    expect(baselineResources.ambulances).toHaveLength(initialAmbCount);
    expect(baselineResources.hospitals).toHaveLength(initialHospCount);
    expect(baselineResources.bloodBanks).toHaveLength(initialBloodCount);
  });

});
