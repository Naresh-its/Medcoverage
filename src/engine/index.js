/**
 * MedCoverage Intelligence Engine
 * Unified export point for pure JavaScript analytical modules.
 */
export { ENGINE_CONFIG } from './config.js';
export { haversineDistance, estimateTravelTime, isWithinGoldenWindow } from './geoutils.js';
export { matchResourceRequirement } from './resourceMatcher.js';
export { calculateEffectiveCoverage } from './coverageEngine.js';
export { detectZoneBottlenecks } from './bottleneckEngine.js';
export { simulateIntervention, rankCandidateInterventions } from './whatIfEngine.js';

import { calculateEffectiveCoverage } from './coverageEngine.js';
import { simulateIntervention, rankCandidateInterventions } from './whatIfEngine.js';

/**
 * Backward compatibility adapter for existing UI components that called
 * calculateSimulationResult(zone, action, resourceType, quantity) from simulationPresets.js.
 * Wraps the new dynamic whatIfEngine without breaking existing UI signatures.
 */
export function calculateSimulationResultAdapter(zone, action, resourceType, quantity, medicalNeed, resources) {
  // If resources or medicalNeed not passed by legacy UI caller, dynamically load defaults
  return simulateIntervention(zone, action, resourceType, quantity, medicalNeed, resources);
}