// MedCoverage Service Integration Layer
// Clean API client that communicates with backend /api/* when active,
// falling back gracefully to local src/data/* mock datasets when offline or in standalone preview.

import { 
  HOSPITALS, 
  AMBULANCES, 
  BLOOD_BANKS, 
  DIAGNOSTICS, 
  PHARMACIES 
} from '../data/mockHealthcareData.js';
import { COVERAGE_ZONES } from '../data/coverageZones.js';
import { MEDICAL_NEEDS } from '../data/medicalNeeds.js';
import { SIMULATION_PRESETS, calculateSimulationResult } from '../data/simulationPresets.js';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || '/api';
const DEFAULT_TIMEOUT_MS = 2500;

/**
 * Standard dynamic engine resolver that extracts calculated engine results
 * (coveragePct, status, missingResources, primaryBottleneck, explanation, travel metrics)
 * rather than relying exclusively on legacy static baselineMetrics or reasons.
 */
export function resolveZoneMetrics(zone) {
  if (!zone) return null;

  const coveragePct = zone.coveragePct 
    ?? zone.calculated?.coveragePct 
    ?? zone.engineResult?.coveragePct 
    ?? zone.metrics?.coveragePct 
    ?? zone.baselineMetrics?.overallCoveragePct 
    ?? 0;

  const status = zone.status 
    ?? zone.calculated?.status 
    ?? zone.engineResult?.status 
    ?? (coveragePct < 50 ? 'dead_zone' : coveragePct < 70 ? 'limited' : 'covered');

  const avgResponseMin = zone.responseMin 
    ?? zone.avgResponseMin 
    ?? zone.travelTimeMin 
    ?? zone.calculated?.avgResponseMin 
    ?? zone.baselineMetrics?.avgResponseMin 
    ?? 15;

  const nearestIcuKm = zone.nearestIcuKm 
    ?? zone.icuDistanceKm 
    ?? zone.calculated?.nearestIcuKm 
    ?? zone.baselineMetrics?.nearestIcuKm 
    ?? 'N/A';

  const nearestBloodKm = zone.nearestBloodKm 
    ?? zone.bloodDistanceKm 
    ?? zone.calculated?.nearestBloodKm 
    ?? zone.baselineMetrics?.nearestBloodKm 
    ?? 'N/A';

  const primaryBottleneck = zone.primaryBottleneck 
    ?? zone.calculated?.primaryBottleneck 
    ?? zone.engineResult?.primaryBottleneck 
    ?? zone.metrics?.primaryBottleneck 
    ?? null;

  const explanation = zone.explanation 
    ?? zone.calculated?.explanation 
    ?? zone.engineResult?.explanation 
    ?? zone.metrics?.explanation 
    ?? null;

  const missingResources = zone.missingResources 
    ?? zone.calculated?.missingResources 
    ?? zone.engineResult?.missingResources 
    ?? zone.metrics?.missingResources 
    ?? [];

  return {
    ...zone,
    coveragePct,
    status,
    avgResponseMin,
    nearestIcuKm,
    nearestBloodKm,
    primaryBottleneck,
    explanation,
    missingResources
  };
}

/**
 * Robust fetcher with fast abort timeout and graceful local data fallback
 */
async function fetchWithFallback(endpoint, fallbackData, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {})
      }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { data, source: 'backend', success: true };
  } catch (err) {
    // Gracefully handle offline / standalone demo mode without crashing
    return {
      data: fallbackData,
      source: 'local-fallback',
      success: true,
      error: err.name === 'AbortError' ? 'Request timed out' : err.message
    };
  }
}

export const api = {
  /**
   * Helper to normalize dynamic engine output for a zone
   */
  resolveZoneMetrics,

  /**
   * Fetch all hospitals and their clinical readiness metrics
   */
  async getHospitals() {
    const res = await fetchWithFallback('/hospitals', HOSPITALS);
    return res.data;
  },

  /**
   * Fetch ambulance fleet status and distribution
   */
  async getAmbulances() {
    const res = await fetchWithFallback('/ambulances', AMBULANCES);
    return res.data;
  },

  /**
   * Fetch blood bank stock and cryo capability
   */
  async getBloodBanks() {
    const res = await fetchWithFallback('/blood-banks', BLOOD_BANKS);
    return res.data;
  },

  /**
   * Fetch diagnostic center modalities (CT, MRI, ultrasound, stat lab)
   */
  async getDiagnostics() {
    const res = await fetchWithFallback('/diagnostic-centers', DIAGNOSTICS);
    return res.data;
  },

  /**
   * Fetch 24/7 pharmacies and emergency medical supplies
   */
  async getPharmacies() {
    const res = await fetchWithFallback('/pharmacies', PHARMACIES);
    return res.data;
  },

  /**
   * Fetch regional coverage zones and baseline clinical metrics
   */
  async getCoverageZones() {
    const res = await fetchWithFallback('/zones', COVERAGE_ZONES);
    return Array.isArray(res.data) ? res.data.map(resolveZoneMetrics) : res.data;
  },

  /**
   * Fetch clinical requirement needs and golden hour windows
   */
  async getMedicalNeeds() {
    const res = await fetchWithFallback('/needs', MEDICAL_NEEDS);
    return res.data;
  },

  /**
   * Fetch preconfigured hackathon and policy simulation presets
   */
  async getSimulationPresets() {
    const res = await fetchWithFallback('/simulations/presets', SIMULATION_PRESETS);
    return res.data;
  },

  /**
   * Execute or calculate What-If infrastructure simulation
   */
  async runSimulation(zone, action, resourceType, quantity) {
    const localResult = calculateSimulationResult(zone, action, resourceType, quantity);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
      
      const response = await fetch(`${API_BASE}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zoneId: zone.id, action, resourceType, quantity }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Return local deterministic calculation on network or server absence
    }
    
    return localResult;
  },

  /**
   * Health check for backend connectivity status
   */
  async checkBackendHealth() {
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      const latencyMs = Math.round(performance.now() - startTime);
      return { online: res.ok, status: res.ok ? 'connected' : 'unhealthy', latencyMs };
    } catch {
      return { online: false, status: 'offline', latencyMs: 0 };
    }
  }
};

export default api;
