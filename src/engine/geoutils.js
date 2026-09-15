import { ENGINE_CONFIG } from './config.js';

/**
 * Calculates straight-line distance between two coordinates using the Haversine formula.
 * @param {{ lat: number, lng: number }} pointA
 * @param {{ lat: number, lng: number }} pointB
 * @returns {number} Distance in kilometers
 */
export function haversineDistance(pointA, pointB) {
  if (!pointA || !pointB || typeof pointA.lat !== 'number' || typeof pointA.lng !== 'number' ||
      typeof pointB.lat !== 'number' || typeof pointB.lng !== 'number') {
    return Infinity;
  }

  const R = 6371; // Earth mean radius in km
  const dLat = ((pointB.lat - pointA.lat) * Math.PI) / 180;
  const dLng = ((pointB.lng - pointA.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pointA.lat * Math.PI) / 180) *
      Math.cos((pointB.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  return Math.round(distanceKm * 100) / 100;
}

/**
 * Estimates travel time in minutes incorporating road winding factor and vehicle operational speed.
 * Prototype analytical estimate — not live navigation.
 * @param {number} distanceKm Straight-line distance in km
 * @param {'ambulance' | 'standardTransit' | 'ruralTransit'} [transportType='ambulance']
 * @param {object} [context={}] Optional traffic or speed overrides
 * @returns {number} Estimated travel time in minutes
 */
export function estimateTravelTime(distanceKm, transportType = 'ambulance', context = {}) {
  if (distanceKm === 0) return 0;
  if (!distanceKm || distanceKm === Infinity) return Infinity;

  const speedKmh = context.speedKmh || ENGINE_CONFIG.speedsKmh[transportType] || ENGINE_CONFIG.speedsKmh.ambulance;
  const roadFactor = context.roadNetworkFactor || ENGINE_CONFIG.roadNetworkFactor;
  const trafficMultiplier = context.trafficMultiplier || 1.0;
  const turnoutDelay = context.includeTurnout === false ? 0 : (transportType === 'ambulance' ? ENGINE_CONFIG.dispatchTurnoutDelayMin : 0);

  const effectiveRoadKm = distanceKm * roadFactor;
  const travelTimeMinutes = (effectiveRoadKm / speedKmh) * 60 * trafficMultiplier;

  return Math.round(travelTimeMinutes + turnoutDelay);
}

/**
 * Checks whether an estimated travel time is within the clinical golden hour window.
 * @param {number} travelTimeMin
 * @param {number} windowMin
 * @returns {boolean}
 */
export function isWithinGoldenWindow(travelTimeMin, windowMin) {
  if (travelTimeMin === Infinity || travelTimeMin == null) return false;
  return travelTimeMin <= windowMin;
}