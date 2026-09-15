import { describe, it, expect } from 'vitest';

import {
  calculateEffectiveCoverage,
  matchResourceRequirement,
  ENGINE_CONFIG
} from '../src/engine/index.js';

import {
  HOSPITALS,
  BLOOD_BANKS,
  AMBULANCES,
  DIAGNOSTICS,
  PHARMACIES
} from '../src/data/mockHealthcareData.js';

import { MEDICAL_NEEDS } from '../src/data/medicalNeeds.js';
import { COVERAGE_ZONES } from '../src/data/coverageZones.js';

const baselineResources = {
  hospitals: HOSPITALS,
  bloodBanks: BLOOD_BANKS,
  ambulances: AMBULANCES,
  diagnostics: DIAGNOSTICS,
  pharmacies: PHARMACIES
};

describe('Coverage Intelligence Engine (coverageEngine.js)', () => {

  it('calculates full coverage when all required clinical capabilities are reachable within golden window', () => {
    const centralZone = COVERAGE_ZONES.find(
      z => z.id === 'zone-central'
    );

    const strokeNeed = MEDICAL_NEEDS.find(
      n => n.id === 'stroke'
    );

    const result = calculateEffectiveCoverage(
      centralZone,
      strokeNeed,
      baselineResources
    );

    expect(result.effectiveCoveragePct).toBeGreaterThanOrEqual(70);
    expect(result.status).toBe('covered');
    expect(result.isClinicallyConstrained).toBe(false);
    expect(result.missingResources).toHaveLength(0);
    expect(result.explanation).toContain(
      'All critical clinical requirements'
    );
  });


  it(
    'CRITICAL SAFETY RULE: Missing required critical resource drops effective coverage to dead-zone status (< 50%)',
    () => {

      const eastZone = COVERAGE_ZONES.find(
        z => z.id === 'zone-east'
      );

      const severeBleeding = MEDICAL_NEEDS.find(
        n => n.id === 'severe_bleeding'
      );

      /*
       * Deliberately remove ALL blood banks.
       *
       * This creates a deterministic critical-resource failure.
       * We do not rely on the current mock geographic dataset to
       * decide whether O- blood happens to be reachable.
       */
      const resourcesWithoutBlood = {
        ...baselineResources,
        bloodBanks: []
      };

      const result = calculateEffectiveCoverage(
        eastZone,
        severeBleeding,
        resourcesWithoutBlood
      );

      expect(result.effectiveCoveragePct).toBeLessThan(50);
      expect(result.status).toBe('dead_zone');
      expect(result.isClinicallyConstrained).toBe(true);
      expect(result.missingResources.length).toBeGreaterThan(0);
      expect(result.primaryBottleneck).toMatch(
        /blood|inventory|supply/i
      );
    }
  );


  it(
    'enforces Critical Modality Penalty Multiplier (0.35) when a critical requirement fails',
    () => {

      /*
       * Construct mock resources where blood is completely
       * unavailable.
       */
      const mockResources = {
        ...baselineResources,
        bloodBanks: []
      };

      const centralZone = COVERAGE_ZONES.find(
        z => z.id === 'zone-central'
      );

      const severeBleeding = MEDICAL_NEEDS.find(
        n => n.id === 'severe_bleeding'
      );

      const result = calculateEffectiveCoverage(
        centralZone,
        severeBleeding,
        mockResources
      );

      expect(result.isClinicallyConstrained).toBe(true);
      expect(result.effectiveCoveragePct).toBeLessThanOrEqual(45);
      expect(result.status).toBe('dead_zone');
    }
  );


  it(
    'fails requirement if facility is physically present but travel time exceeds golden window',
    () => {

      const farLocation = {
        lat: 13.8000,
        lng: 80.8000
      };

      const goldenWindowMin = 20;

      const match = matchResourceRequirement(
        farLocation,
        'trauma',
        goldenWindowMin,
        baselineResources
      );

      expect(match.satisfied).toBe(false);

      expect(match.travelTimeMin).toBeGreaterThan(
        goldenWindowMin
      );

      expect(match.reasonIfFailed).toMatch(
        /exceeds.*\d+\s*min/i
      );
    }
  );


  it(
    'fails blood requirement if nearby blood bank has zero inventory of required blood type',
    () => {

      const depletedBloodResources = {
        ...baselineResources,

        bloodBanks: [
          {
            id: 'blood-depleted',
            name: 'Depleted Regional Bank',

            zoneId: 'zone-central',

            location: {
              lat: 13.0600,
              lng: 80.2500
            },

            inventory: {
              'O-': 0,
              'O+': 0,
              'A-': 0,
              'B-': 0
            }
          }
        ]
      };

      const center = {
        lat: 13.0600,
        lng: 80.2500
      };

      const match = matchResourceRequirement(
        center,
        'blood',
        30,
        depletedBloodResources
      );

      expect(match.satisfied).toBe(false);

      expect(match.reasonIfFailed).toMatch(
        /stockout|inventory/i
      );
    }
  );


  it(
    'classifies coverage status correctly according to centralized config thresholds',
    () => {

      expect(
        ENGINE_CONFIG.statusThresholds.coveredMin
      ).toBe(70);

      expect(
        ENGINE_CONFIG.statusThresholds.limitedMin
      ).toBe(50);
    }
  );


  it(
    'throws descriptive error if required arguments are omitted',
    () => {

      expect(() =>
        calculateEffectiveCoverage(null, null)
      ).toThrow(/Invalid arguments/i);

    }
  );

});