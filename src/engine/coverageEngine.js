import { matchResourceRequirement } from './resourceMatcher.js';
import { ENGINE_CONFIG } from './config.js';
import { detectZoneBottlenecks } from './bottleneckEngine.js';

/**
 * Dynamically calculates effective healthcare coverage for a zone and medical need.
 * Core Novelty Layer 1 & 2:
 * Evaluates whether ALL critical required resources can be reached within the golden hour window.
 *
 * @param {object} zone Zone object with center: { lat, lng }, population, etc.
 * @param {object} medicalNeed Need object with requiredResources, goldenWindowMin
 * @param {object} resources All healthcare resources { hospitals, bloodBanks, ambulances, diagnostics, pharmacies }
 * @returns {object} Complete explainable coverage report
 */
export function calculateEffectiveCoverage(zone, medicalNeed, resources = {}) {
  if (!zone || !zone.center || !medicalNeed || !medicalNeed.requiredResources) {
    throw new Error('Invalid arguments passed to calculateEffectiveCoverage');
  }

  const goldenWindowMin = medicalNeed.goldenWindowMin || 30;
  const requirementResults = [];

  let totalWeight = 0;
  let earnedWeight = 0;
  let hasCriticalFailure = false;
  let maxTravelTime = 0;

  // 1. Evaluate each required resource
  medicalNeed.requiredResources.forEach(req => {
    const criticality = req.criticality || (medicalNeed.urgency === 'CRITICAL' ? 'CRITICAL' : 'HIGH');
    const weight = ENGINE_CONFIG.criticalityWeights[criticality] || 1.0;
    totalWeight += weight;

    const match = matchResourceRequirement(zone.center, req.key, goldenWindowMin, resources);
    requirementResults.push({
      ...match,
      label: req.label,
      criticality,
      weight
    });

    if (match.satisfied) {
      // Quality factor: if travel time is very short (e.g. 8m out of 30m), full score.
      // If near threshold (e.g. 28m out of 30m), slight travel penalty.
      const timeRatio = match.travelTimeMin / goldenWindowMin;
      const qualityMultiplier = Math.max(0.75, 1.0 - (timeRatio * 0.25));
      earnedWeight += weight * qualityMultiplier;

      if (match.travelTimeMin > maxTravelTime && match.travelTimeMin !== Infinity) {
        maxTravelTime = match.travelTimeMin;
      }
    } else {
      if (criticality === 'CRITICAL') {
        hasCriticalFailure = true;
      }
    }
  });

  // 2. Base Coverage Calculation (0 to 100%)
  let rawScore = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0;

  // 3. Apply Critical Modality Penalty:
  // If patient has Severe Bleeding, but 0 blood or 0 trauma bay is reachable,
  // effective coverage must drop drastically even if a basic clinic is 500m away!
  if (hasCriticalFailure) {
    rawScore = Math.min(rawScore * ENGINE_CONFIG.criticalMissingPenaltyMultiplier, 45);
  }

  const effectiveCoveragePct = Math.max(5, Math.min(98, Math.round(rawScore)));

  // 4. Status Classification based on centralized thresholds
  let status = 'dead_zone';
  if (effectiveCoveragePct >= ENGINE_CONFIG.statusThresholds.coveredMin) {
    status = 'covered';
  } else if (effectiveCoveragePct >= ENGINE_CONFIG.statusThresholds.limitedMin) {
    status = 'limited';
  } else {
    status = 'dead_zone';
  }

  // 5. Extract Missing Resources
  const missingResources = requirementResults
    .filter(r => !r.satisfied)
    .map(r => ({
      key: r.requirementKey,
      label: r.label,
      reason: r.reasonIfFailed,
      distanceKm: r.distanceKm,
      travelTimeMin: r.travelTimeMin
    }));

  // 6. Detect Bottlenecks programmatically
  const bottleneckAnalysis = detectZoneBottlenecks(zone, medicalNeed, resources, requirementResults);

  // 7. Generate Clinical Explainability Narrative
  const satisfiedCount = requirementResults.filter(r => r.satisfied).length;
  const totalCount = requirementResults.length;

  let explanation = '';
  if (status === 'covered') {
    explanation = `All critical clinical requirements (${satisfiedCount}/${totalCount}) accessible within the ${goldenWindowMin}-minute golden window.`;
  } else if (status === 'limited') {
    explanation = `Access constrained (${satisfiedCount}/${totalCount} fulfilled). Bottleneck: ${bottleneckAnalysis.primaryBottleneck}.`;
  } else {
    explanation = `HIGH-RISK MEDICAL DEAD ZONE (${satisfiedCount}/${totalCount} fulfilled). ${bottleneckAnalysis.primaryBottleneck}.`;
  }

  return {
    areaId: zone.id,
    areaName: zone.name,
    code: zone.code,
    population: zone.population,
    medicalNeedId: medicalNeed.id,
    medicalNeedName: medicalNeed.name,
    goldenWindowMin,
    effectiveCoveragePct,
    status,
    avgResponseMin: maxTravelTime > 0 ? maxTravelTime : (zone.baselineMetrics?.avgResponseMin || 30),
    missingResources,
    bottlenecks: bottleneckAnalysis.bottlenecks,
    primaryBottleneck: bottleneckAnalysis.primaryBottleneck,
    requirementResults,
    explanation,
    isClinicallyConstrained: hasCriticalFailure
  };
}