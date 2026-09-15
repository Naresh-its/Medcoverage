/**
 * MedCoverage Engine Configuration
 * Centralized assumptions, travel speeds, criticality weights, and classification thresholds.
 * Prototype analytical model — not real-time clinical routing.
 */
export const ENGINE_CONFIG = {
  // Average operational speeds in urban/suburban transit (km/h)
  speedsKmh: {
    ambulance: 45,        // Emergency dispatch with priority traversal
    standardTransit: 30,  // Patient non-emergency transit (clinics/dialysis)
    ruralTransit: 50,     // Peripheral corridor travel
  },

  // Road network winding factor (Manhattan/urban detour multiplier over Haversine)
  roadNetworkFactor: 1.3,

  // Dispatch turnout delay in minutes (time from call to wheels rolling)
  dispatchTurnoutDelayMin: 3,

  // Effective coverage status classification thresholds (%)
  statusThresholds: {
    coveredMin: 70,       // >= 70% is Covered (🟢)
    limitedMin: 50,       // 50% - 69% is Limited Access (🟠)
    deadZoneMax: 49,      // < 50% is Medical Dead Zone (🔴)
  },

  // Criticality weights for clinical requirements scoring
  criticalityWeights: {
    CRITICAL: 1.0,        // Core life-safety modality (e.g. O- blood in hemorrhage, CT in stroke)
    HIGH: 0.75,           // Essential clinical stabilization (e.g. ICU bed, trauma bay)
    STANDARD: 0.5,        // Diagnostic confirmation or secondary support
  },

  // Weight penalty applied to total score if a required CRITICAL resource is missing
  criticalMissingPenaltyMultiplier: 0.4,

  // Maximum travel search perimeter in km
  maxSearchRadiusKm: 50,
};