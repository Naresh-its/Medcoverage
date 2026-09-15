import assert from 'node:assert';
import { 
  ENGINE_CONFIG, 
  haversineDistance, 
  estimateTravelTime, 
  isWithinGoldenWindow, 
  matchResourceRequirement, 
  calculateEffectiveCoverage, 
  detectZoneBottlenecks, 
  simulateIntervention, 
  rankCandidateInterventions 
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

console.log('=== MedCoverage Intelligence Engine Unit Tests ===\n');

let passedTests = 0;
let totalTests = 0;

function runTest(description, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`✅ [PASS] ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${description}`);
    console.error(err);
  }
}

// TEST 1: Geo utilities and Golden Window checks
runTest('Geo utilities calculate accurate Haversine distance and travel time', () => {
  const central = COVERAGE_ZONES.find(z => z.id === 'zone-central');
  const east = COVERAGE_ZONES.find(z => z.id === 'zone-east');
  
  const dist = haversineDistance(central.center, east.center);
  assert(dist > 5 && dist < 20, `Distance should be ~7-15km, got ${dist}`);
  
  const timeAmbulance = estimateTravelTime(dist, 'ambulance');
  const timeStandard = estimateTravelTime(dist, 'standardTransit');
  assert(timeAmbulance < timeStandard, 'Ambulance travel time should be faster than standard transit');
  assert(isWithinGoldenWindow(timeAmbulance, 60), 'Should be within 60 min window');
  assert(!isWithinGoldenWindow(timeAmbulance, 5), 'Should NOT be within 5 min window');
});

// TEST 2: High coverage when all clinical capabilities are available within window
runTest('High coverage score when all resources are reachable within golden window (Zone Central)', () => {
  const central = COVERAGE_ZONES.find(z => z.id === 'zone-central');
  const stroke = MEDICAL_NEEDS.find(n => n.id === 'stroke');
  
  const result = calculateEffectiveCoverage(central, stroke, baselineResources);
  assert(result.effectiveCoveragePct >= 70, `Expected >= 70%, got ${result.effectiveCoveragePct}%`);
  assert.strictEqual(result.status, 'covered');
  assert.strictEqual(result.isClinicallyConstrained, false);
  assert(result.explanation.includes('All critical clinical requirements'), 'Explanation should acknowledge full access');
});

// TEST 3: Hospital nearby but critical blood or trauma missing -> coverage drops to dead_zone (< 50%)
runTest('Critical modality failure drops effective coverage score below 50% even if near city', () => {
  const west = COVERAGE_ZONES.find(z => z.id === 'zone-west');
  const severeBleeding = MEDICAL_NEEDS.find(n => n.id === 'severe_bleeding');
  
  const result = calculateEffectiveCoverage(west, severeBleeding, baselineResources);
  assert(result.effectiveCoveragePct <= 50, `Expected <= 50% due to critical modality failure, got ${result.effectiveCoveragePct}%`);
  assert(result.isClinicallyConstrained === true, 'Should be flagged as clinically constrained');
  assert.strictEqual(result.status, 'dead_zone', 'Should be classified as dead_zone');
  assert(result.missingResources.length > 0, 'Should have identified missing clinical resources');
});

// TEST 4: Resource distance exceeding golden window results in requirement failure
runTest('Resource distance exceeding golden window fails requirement', () => {
  const remoteLoc = { lat: 13.5000, lng: 80.5000 };
  const match = matchResourceRequirement(remoteLoc, 'trauma', 20, baselineResources);
  assert.strictEqual(match.satisfied, false, 'Should not satisfy requirement if outside golden window');
  assert(match.travelTimeMin > 20, 'Travel time should exceed 20 min');
  assert(match.reasonIfFailed.includes('exceeds'), `Expected reason to mention window exceedance: ${match.reasonIfFailed}`);
});

// TEST 5: Blood inventory zero stock fails specific requirement
runTest('Zero inventory for blood type fails requirement even if facility is near', () => {
  const mockBloodResources = {
    ...baselineResources,
    bloodBanks: [
      {
        id: 'mock-blood-empty',
        name: 'Empty Blood Storage',
        zoneId: 'zone-central',
        location: { lat: 13.0600, lng: 80.2500 },
        inventory: { 'O-': 0, 'O+': 0 }
      }
    ]
  };
  const center = { lat: 13.0600, lng: 80.2500 };
  const match = matchResourceRequirement(center, 'blood', 40, mockBloodResources);
  assert.strictEqual(match.satisfied, false, 'Zero stock should fail blood requirement');
  assert(match.reasonIfFailed.includes('stockout') || match.reasonIfFailed.includes('inventory'), 'Should identify stockout');
});

// TEST 6: Adding 2 ambulances resolves transport bottleneck and increases coverage
runTest('Adding 2 ambulances in underserved zone increases coverage and reduces response time', () => {
  const east = COVERAGE_ZONES.find(z => z.id === 'zone-east');
  const trauma = MEDICAL_NEEDS.find(n => n.id === 'trauma');

  const sim = simulateIntervention(east, 'ADD', 'ambulance', 2, trauma, baselineResources);
  assert(sim.after.coveragePct > sim.before.coveragePct, 'Coverage after simulation should be greater than before');
  assert(sim.impact.coverageGainPct > 0, 'Impact coverageGainPct should be positive');
  assert(sim.simulatedMarker !== null, 'Should return a simulatedMarker for map visualization');
  assert.strictEqual(sim.simulatedMarker.isSimulated, true, 'Marker should be flagged as simulated');
});

// TEST 7: Multi-intervention ranking ranks highest-impact recommendation first
runTest('rankCandidateInterventions ranks options with highest clinical impact first', () => {
  const east = COVERAGE_ZONES.find(z => z.id === 'zone-east');
  const severeBleeding = MEDICAL_NEEDS.find(n => n.id === 'severe_bleeding');

  const ranking = rankCandidateInterventions(east, severeBleeding, baselineResources);
  assert(Array.isArray(ranking.recommendations), 'Recommendations must be an array');
  assert(ranking.recommendations.length >= 3, 'Should have multiple candidates evaluated');
  assert(ranking.bestRecommendation !== null, 'Best recommendation must be defined');
  for (let i = 0; i < ranking.recommendations.length - 1; i++) {
    assert(ranking.recommendations[i].score >= ranking.recommendations[i+1].score, 'Recommendations should be sorted descending by score');
  }
});

// TEST 8: Virtual simulation guarantees zero mutation of source baseline datasets
runTest('simulateIntervention does NOT mutate baseline resources or zone data', () => {
  const east = COVERAGE_ZONES.find(z => z.id === 'zone-east');
  const trauma = MEDICAL_NEEDS.find(n => n.id === 'trauma');
  
  const initialAmbulanceCount = baselineResources.ambulances.length;
  const initialHospitalCount = baselineResources.hospitals.length;
  const initialEastStatus = east.status;

  simulateIntervention(east, 'ADD', 'ambulance', 5, trauma, baselineResources);
  simulateIntervention(east, 'REMOVE', 'hospital', 2, trauma, baselineResources);
  simulateIntervention(east, 'RELOCATE', 'ambulance', 1, trauma, baselineResources);

  assert.strictEqual(baselineResources.ambulances.length, initialAmbulanceCount, 'Ambulances array length must not mutate');
  assert.strictEqual(baselineResources.hospitals.length, initialHospitalCount, 'Hospitals array length must not mutate');
  assert.strictEqual(east.status, initialEastStatus, 'Zone status must not mutate');
});

console.log('\n========================================');
console.log(`Tests completed: ${passedTests} / ${totalTests} passed`);
console.log('========================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}