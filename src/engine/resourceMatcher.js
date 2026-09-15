import { haversineDistance, estimateTravelTime, isWithinGoldenWindow } from './geoutils.js';
import { ENGINE_CONFIG } from './config.js';

/**
 * Matches a specific clinical requirement against all available healthcare resources in the region.
 * Evaluates facility capability, inventory, operational status, distance, and travel time.
 *
 * @param {{ lat: number, lng: number }} zoneCenter Geographic center of target zone
 * @param {string} requirementKey e.g. "blood", "emergency", "surgery", "trauma", "icu", "ambulance", "ct_scan", "dialysis"
 * @param {number} goldenWindowMin Time window threshold in minutes
 * @param {object} resources Canonical datasets { hospitals, bloodBanks, ambulances, diagnostics, pharmacies }
 * @returns {object} Detailed requirement match result
 */
export function matchResourceRequirement(zoneCenter, requirementKey, goldenWindowMin, resources = {}) {
  const {
    hospitals = [],
    bloodBanks = [],
    ambulances = [],
    diagnostics = [],
    pharmacies = []
  } = resources;

  let candidates = [];

  switch (requirementKey) {
    case 'blood': {
      // Look in blood banks and hospitals with verified blood inventory
      bloodBanks.forEach(bb => {
        const distKm = haversineDistance(zoneCenter, bb.location);
        const timeMin = estimateTravelTime(distKm, 'ambulance');
        const hasONeg = bb.inventory && bb.inventory['O-'] > 0;
        const totalUnits = bb.inventory ? Object.values(bb.inventory).reduce((a, b) => a + b, 0) : 0;
        
        candidates.push({
          id: bb.id,
          name: bb.name,
          type: 'blood_bank',
          location: bb.location,
          distanceKm: distKm,
          travelTimeMin: timeMin,
          hasCapability: totalUnits > 0,
          hasCriticalSubtype: hasONeg,
          availableUnits: totalUnits,
          oNegUnits: bb.inventory ? bb.inventory['O-'] : 0,
          details: `${totalUnits} units total (${hasONeg ? bb.inventory['O-'] + ' units O- available' : '0 units O- stockout'})`
        });
      });
      break;
    }

    case 'ambulance': {
      ambulances.forEach(amb => {
        const distKm = haversineDistance(zoneCenter, amb.location);
        const timeMin = estimateTravelTime(distKm, 'ambulance');
        const isAvailable = amb.status === 'Available';
        const isALS = amb.type && amb.type.includes('ALS');

        candidates.push({
          id: amb.id,
          name: amb.name,
          type: 'ambulance',
          location: amb.location,
          distanceKm: distKm,
          travelTimeMin: timeMin,
          hasCapability: true,
          isAvailable: isAvailable,
          status: amb.status,
          isALS: isALS,
          details: `${amb.type} - Status: ${amb.status} (Base: ${amb.baseStation})`
        });
      });
      break;
    }

    case 'emergency':
    case 'icu':
    case 'trauma':
    case 'surgery':
    case 'dialysis':
    case 'cardiac_cath': {
      hospitals.forEach(hosp => {
        const distKm = haversineDistance(zoneCenter, hosp.location);
        const timeMin = estimateTravelTime(distKm, 'ambulance');
        const hasCap = Boolean(hosp.capabilities && hosp.capabilities[requirementKey]);
        const freeIcu = (hosp.metrics && hosp.metrics.availableIcuBeds) || 0;

        // For ICU requirement specifically check free ICU beds
        const capacityOk = requirementKey === 'icu' ? (hasCap && freeIcu > 0) : hasCap;

        candidates.push({
          id: hosp.id,
          name: hosp.name,
          type: 'hospital',
          location: hosp.location,
          distanceKm: distKm,
          travelTimeMin: timeMin,
          hasCapability: capacityOk,
          details: hasCap ? `Capability present (${requirementKey === 'icu' ? freeIcu + ' free ICU beds' : hosp.metrics?.traumaTier || 'verified'})` : `Lacks ${requirementKey}`
        });
      });
      break;
    }

    case 'ct_scan': {
      // CT scanners may be in hospitals OR diagnostics centers
      hospitals.forEach(hosp => {
        const distKm = haversineDistance(zoneCenter, hosp.location);
        const timeMin = estimateTravelTime(distKm, 'ambulance');
        const hasCap = Boolean(hosp.capabilities && hosp.capabilities.ct_scan);

        candidates.push({
          id: hosp.id,
          name: hosp.name,
          type: 'hospital',
          location: hosp.location,
          distanceKm: distKm,
          travelTimeMin: timeMin,
          hasCapability: hasCap,
          details: hasCap ? 'Hospital 24/7 CT Scanner operational' : 'No operational CT scanner'
        });
      });

      diagnostics.forEach(diag => {
        const distKm = haversineDistance(zoneCenter, diag.location);
        const timeMin = estimateTravelTime(distKm, 'standardTransit');
        const hasCap = Boolean(diag.modalities && diag.modalities.ct_scan);

        candidates.push({
          id: diag.id,
          name: diag.name,
          type: 'diagnostic',
          location: diag.location,
          distanceKm: distKm,
          travelTimeMin: timeMin,
          hasCapability: hasCap,
          details: hasCap ? `Diagnostic CT Lab (Turnaround: ${diag.turnaroundMin}m)` : 'No CT Scanner'
        });
      });
      break;
    }

    case 'specialist': {
      hospitals.forEach(hosp => {
        const distKm = haversineDistance(zoneCenter, hosp.location);
        const timeMin = estimateTravelTime(distKm, 'ambulance');
        // Level 1 or 2 trauma/super-specialty centers have neurologists/specialists on call
        const hasSpecialist = Boolean(hosp.capabilities?.surgery && hosp.capabilities?.icu);

        candidates.push({
          id: hosp.id,
          name: hosp.name,
          type: 'hospital',
          location: hosp.location,
          distanceKm: distKm,
          travelTimeMin: timeMin,
          hasCapability: hasSpecialist,
          details: hasSpecialist ? 'On-duty Specialists & Surgical Team' : 'General Practitioner only'
        });
      });
      break;
    }

    case 'transport': {
      // Ambulances or specialized transport
      ambulances.forEach(amb => {
        const distKm = haversineDistance(zoneCenter, amb.location);
        const timeMin = estimateTravelTime(distKm, 'standardTransit');
        candidates.push({
          id: amb.id,
          name: amb.name,
          type: 'ambulance',
          location: amb.location,
          distanceKm: distKm,
          travelTimeMin: timeMin,
          hasCapability: true,
          details: `${amb.name} (${amb.status})`
        });
      });
      break;
    }

    case 'stat_lab':
    case 'ultrasound': {
      diagnostics.forEach(diag => {
        const distKm = haversineDistance(zoneCenter, diag.location);
        const timeMin = estimateTravelTime(distKm, 'standardTransit');
        const hasCap = Boolean(diag.modalities && diag.modalities[requirementKey]);

        candidates.push({
          id: diag.id,
          name: diag.name,
          type: 'diagnostic',
          location: diag.location,
          distanceKm: distKm,
          travelTimeMin: timeMin,
          hasCapability: hasCap,
          details: hasCap ? `Diagnostic modality present (${diag.turnaroundMin}m)` : 'Modality unavailable'
        });
      });
      break;
    }

    default: {
      candidates.push({
        id: 'unknown',
        name: 'General Provider',
        distanceKm: Infinity,
        travelTimeMin: Infinity,
        hasCapability: false,
        details: `Unrecognized requirement: ${requirementKey}`
      });
    }
  }

  // Filter candidates that actually provide the capability
  const capableCandidates = candidates.filter(c => c.hasCapability);

  if (capableCandidates.length === 0) {
    // Find closest facility even if it lacks capability to explain proximity vs access
    candidates.sort((a, b) => a.distanceKm - b.distanceKm);
    const closest = candidates[0] || null;

    let specificReason = `No facility in regional network provides ${requirementKey.toUpperCase()}.`;
    if (requirementKey === 'blood' && candidates.length > 0) {
      specificReason = `Regional blood center is within distance, but zero units are available (total inventory stockout).`;
    }

    return {
      requirementKey,
      satisfied: false,
      bestMatch: closest,
      distanceKm: closest ? closest.distanceKm : Infinity,
      travelTimeMin: closest ? closest.travelTimeMin : Infinity,
      isWithinWindow: false,
      reasonIfFailed: specificReason,
      availabilityDetails: '0 units / modality absent'
    };
  }

  // Sort capable candidates by estimated travel time
  capableCandidates.sort((a, b) => a.travelTimeMin - b.travelTimeMin);
  const best = capableCandidates[0];

  const withinWindow = isWithinGoldenWindow(best.travelTimeMin, goldenWindowMin);
  let satisfied = withinWindow;
  let failReason = null;

  // Additional availability checks
  if (requirementKey === 'blood') {
    // Check candidates in order of distance/travel time.
    // If the nearest has an O- stockout, continue checking the next nearest eligible candidate.
    const validCandidate = capableCandidates.find(
      c => c.hasCriticalSubtype && isWithinGoldenWindow(c.travelTimeMin, goldenWindowMin)
    );

    if (validCandidate) {
      return {
        requirementKey,
        satisfied: true,
        bestMatch: validCandidate,
        distanceKm: validCandidate.distanceKm,
        travelTimeMin: validCandidate.travelTimeMin,
        isWithinWindow: true,
        reasonIfFailed: null,
        availabilityDetails: validCandidate.details
      };
    }

    // No candidate satisfied both inventory (O-) and clinical travel-time window
    satisfied = false;
    const candidateWithStock = capableCandidates.find(c => c.hasCriticalSubtype);

    if (candidateWithStock) {
      // Stock exists, but exceeds the accessibility window
      return {
        requirementKey,
        satisfied: false,
        bestMatch: candidateWithStock,
        distanceKm: candidateWithStock.distanceKm,
        travelTimeMin: candidateWithStock.travelTimeMin,
        isWithinWindow: false,
        reasonIfFailed: `Nearest blood center with O-negative inventory (${candidateWithStock.name}) is ${candidateWithStock.distanceKm} km away; estimated arrival time (${candidateWithStock.travelTimeMin} min) exceeds golden window of ${goldenWindowMin} min.`,
        availabilityDetails: candidateWithStock.details
      };
    } else {
      // All regional candidates have O- stockout
      return {
        requirementKey,
        satisfied: false,
        bestMatch: best,
        distanceKm: best.distanceKm,
        travelTimeMin: best.travelTimeMin,
        isWithinWindow: withinWindow,
        reasonIfFailed: `Nearest blood center (${best.name}) is ${best.travelTimeMin}m away, but has O-negative universal emergency stockout (no regional facility has available O- stock).`,
        availabilityDetails: best.details
      };
    }
  } else if (requirementKey === 'ambulance' && !best.isAvailable) {
    // If nearest ambulance is busy/en route, look for next available
    const nextFree = capableCandidates.find(c => c.isAvailable);
    if (nextFree) {
      const freeWithinWindow = isWithinGoldenWindow(nextFree.travelTimeMin, goldenWindowMin);
      if (freeWithinWindow) {
        return {
          requirementKey,
          satisfied: true,
          bestMatch: nextFree,
          distanceKm: nextFree.distanceKm,
          travelTimeMin: nextFree.travelTimeMin,
          isWithinWindow: true,
          reasonIfFailed: null,
          availabilityDetails: nextFree.details
        };
      } else {
        satisfied = false;
        failReason = `Primary local ambulance is ${best.status}; next free unit is ${nextFree.travelTimeMin}m away (exceeds ${goldenWindowMin}m limit).`;
      }
    } else {
      satisfied = false;
      failReason = `All regional emergency ambulances are currently busy or en route.`;
    }
  } else if (!withinWindow) {
    failReason = `Capable facility (${best.name}) is ${best.distanceKm} km away; estimated arrival time (${best.travelTimeMin} min) exceeds golden window of ${goldenWindowMin} min.`;
  }

  return {
    requirementKey,
    satisfied,
    bestMatch: best,
    distanceKm: best.distanceKm,
    travelTimeMin: best.travelTimeMin,
    isWithinWindow: withinWindow,
    reasonIfFailed: satisfied ? null : failReason,
    availabilityDetails: best.details
  };
}