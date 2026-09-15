import { matchResourceRequirement } from './resourceMatcher.js';

/**
 * Programmatically detects cross-resource bottlenecks for a zone.
 * Novelty Layer 3 & 4:
 * Determines which exact resource failure is preventing the population from receiving required care.
 *
 * @param {object} zone Target zone
 * @param {object} medicalNeed Target condition
 * @param {object} resources Regional resource datasets
 * @param {Array} [precomputedResults] Optional cached requirement results
 * @returns {{ bottlenecks: Array, primaryBottleneck: string }}
 */
export function detectZoneBottlenecks(zone, medicalNeed, resources = {}, precomputedResults = null) {
  const requirementResults = precomputedResults || medicalNeed.requiredResources.map(req => 
    matchResourceRequirement(zone.center, req.key, medicalNeed.goldenWindowMin || 30, resources)
  );

  const bottlenecks = [];

  requirementResults.forEach(res => {
    if (!res.satisfied) {
      let severity = 'HIGH';
      let score = 50;

      if (res.criticality === 'CRITICAL' || res.requirementKey === 'blood' || res.requirementKey === 'trauma') {
        severity = 'CRITICAL';
        score += 40;
      }

      // Time gap deficit
      if (res.travelTimeMin !== Infinity && res.travelTimeMin > (medicalNeed.goldenWindowMin || 30)) {
        const timeDeficit = res.travelTimeMin - (medicalNeed.goldenWindowMin || 30);
        score += Math.min(30, timeDeficit * 2);
      } else if (res.distanceKm === Infinity) {
        score += 30; // Total absence of capability
      }

      bottlenecks.push({
        resourceType: res.requirementKey,
        label: res.label || res.requirementKey,
        severity,
        score,
        reason: res.reasonIfFailed || `${res.requirementKey} is not accessible within threshold.`,
        distanceKm: res.distanceKm,
        travelTimeMin: res.travelTimeMin,
        bestMatchName: res.bestMatch ? res.bestMatch.name : 'None'
      });
    }
  });

  // Sort bottlenecks by score descending to find the primary bottleneck programmatically
  bottlenecks.sort((a, b) => b.score - a.score);

  const primaryBottleneck = bottlenecks.length > 0 
    ? `Primary Bottleneck: ${bottlenecks[0].label} (${bottlenecks[0].reason})`
    : 'No critical clinical bottlenecks detected in sector.';

  return {
    bottlenecks,
    primaryBottleneck,
    primaryBottleneckKey: bottlenecks.length > 0 ? bottlenecks[0].resourceType : null
  };
}