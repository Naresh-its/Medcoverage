/**
 * MedCoverage API Client
 * Interfaces with the Express Backend REST API (http://localhost:5000/api).
 * Automatically falls back to client-side in-memory analytics if the backend is offline.
 */

import { MEDICAL_NEEDS } from '../data/medicalNeeds.js';
import { COVERAGE_ZONES } from '../data/coverageZones.js';
import { REGIONAL_SECTORS, getRankedHospitalsForRegion } from '../data/regionalHospitalData.js';
import { getHospitalCapabilityProfile as localGetProfile } from '../engine/capabilityIntelligence.js';
import { calculateEffectiveCoverage as localCalcCoverage } from '../engine/coverageEngine.js';
import { simulateIntervention as localSimulate } from '../engine/whatIfEngine.js';
import { 
  HOSPITALS, BLOOD_BANKS, AMBULANCES, DIAGNOSTICS, PHARMACIES 
} from '../data/mockHealthcareData.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const defaultResources = {
  hospitals: HOSPITALS,
  bloodBanks: BLOOD_BANKS,
  ambulances: AMBULANCES,
  diagnostics: DIAGNOSTICS,
  pharmacies: PHARMACIES
};

// Internal fetch wrapper with timeout
async function fetchWithTimeout(endpoint, options = {}, timeoutMs = 3000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export const apiClient = {
  /**
   * Check backend health status
   */
  async checkHealth() {
    try {
      const data = await fetchWithTimeout('/health');
      return { online: true, ...data };
    } catch (e) {
      return { online: false, message: 'Backend running in local fallback mode' };
    }
  },

  /**
   * Get all medical needs
   */
  async getMedicalNeeds() {
    try {
      const json = await fetchWithTimeout('/medical-needs');
      return json.data;
    } catch (e) {
      return MEDICAL_NEEDS;
    }
  },

  /**
   * Get all coverage zones
   */
  async getZones() {
    try {
      const json = await fetchWithTimeout('/zones');
      return json.data;
    } catch (e) {
      return COVERAGE_ZONES;
    }
  },

  /**
   * Get 4 ranked hospitals for a sector and emergency
   */
  async getRankedHospitals(sectorId = 'zone-central', needId = 'severe_bleeding') {
    try {
      const json = await fetchWithTimeout(`/hospitals/ranked?sectorId=${sectorId}&needId=${needId}`);
      return json.data;
    } catch (e) {
      return getRankedHospitalsForRegion(sectorId, needId);
    }
  },

  /**
   * Get hospital capability and availability intelligence profile
   */
  async getHospitalCapabilityProfile(hospital, needId = 'severe_bleeding') {
    try {
      const json = await fetchWithTimeout(`/hospitals/${hospital.id}/capability-profile?needId=${needId}`);
      return json.data;
    } catch (e) {
      return localGetProfile(hospital, needId);
    }
  },

  /**
   * Evaluate dynamic coverage for a zone
   */
  async evaluateCoverage(zone, medicalNeed) {
    try {
      const json = await fetchWithTimeout('/coverage/evaluate', {
        method: 'POST',
        body: JSON.stringify({ zoneId: zone.id, needId: medicalNeed.id })
      });
      return json.report;
    } catch (e) {
      return localCalcCoverage(zone, medicalNeed, defaultResources);
    }
  },

  /**
   * Simulate what-if infrastructure intervention
   */
  async simulateWhatIf(zone, action, resourceType, quantity, medicalNeed) {
    try {
      const json = await fetchWithTimeout('/coverage/what-if', {
        method: 'POST',
        body: JSON.stringify({
          zoneId: zone.id,
          needId: medicalNeed.id,
          action: (action || 'ADD').toUpperCase(),
          resourceType: resourceType || 'ambulance',
          quantity: quantity !== undefined ? quantity : 2
        })
      });
      return json.simulation;
    } catch (e) {
      return localSimulate(zone, (action || 'ADD').toUpperCase(), resourceType, quantity, medicalNeed, defaultResources);
    }
  }
};
