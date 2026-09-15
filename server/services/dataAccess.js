// server/services/dataAccess.js
// Data‑access layer for the MedCoverage backend.
// Provides async helpers that fetch from Supabase when possible,
// falling back to the in‑repo mock JSON data if Supabase is not reachable
// or the expected tables are missing.

import { supabase } from "../db/supabase.js";

// Import mock data as a safe fallback. The mock files export named constants.
import { COVERAGE_ZONES } from "../../src/data/coverageZones.js";
import { MEDICAL_NEEDS } from "../../src/data/medicalNeeds.js";
import {
  HOSPITALS,
  BLOOD_BANKS,
  AMBULANCES,
  DIAGNOSTICS,
  PHARMACIES,
} from "../../src/data/mockHealthcareData.js";

/**
 * Helper: attempt a Supabase query. If the query throws or returns an error,
 * return null so callers can fall back to mock data.
 */
async function safeSupabase(table, options = {}) {
  try {
    const { data, error } = await supabase.from(table).select(options.select || "*");
    if (error) {
      // console.error(`Supabase ${table} fetch error:`, error);
      return null;
    }
    return data;
  } catch (e) {
    // console.error(`Supabase ${table} request failed:`, e);
    return null;
  }
}

/** Get all coverage zones */
export async function getCoverageZones() {
  const supabaseData = await safeSupabase("coverage_zones");
  if (Array.isArray(supabaseData) && supabaseData.length > 0) {
    return supabaseData;
  }
  // Fallback to static mock data (shape matches the engine expectations)
  return COVERAGE_ZONES;
}

/** Get a specific coverage zone by ID */
export async function getCoverageZoneById(id) {
  if (!id) return null;
  // First try Supabase (filter by id column named "id")
  const supabaseData = await safeSupabase("coverage_zones", { select: "*",});
  if (Array.isArray(supabaseData)) {
    const found = supabaseData.find((z) => z.id === id);
    if (found) return found;
  }
  // Fallback to mock array
  return COVERAGE_ZONES.find((z) => z.id === id) || null;
}

/** Get all medical needs */
export async function getMedicalNeeds() {
  const supabaseData = await safeSupabase("medical_needs");
  if (Array.isArray(supabaseData) && supabaseData.length > 0) {
    return supabaseData;
  }
  return MEDICAL_NEEDS;
}

/** Get a specific medical need by ID */
export async function getMedicalNeedById(id) {
  if (!id) return null;
  const supabaseData = await safeSupabase("medical_needs");
  if (Array.isArray(supabaseData)) {
    const found = supabaseData.find((n) => n.id === id);
    if (found) return found;
  }
  return MEDICAL_NEEDS.find((n) => n.id === id) || null;
}

/** Get all resources (hospitals, blood banks, ambulances, diagnostics, pharmacies) */
export async function getResources() {
  // Try to fetch each resource table; if any fail we fall back to the full mock set.
  const [hospitals, bloodBanks, ambulances, diagnostics, pharmacies] = await Promise.all([
    safeSupabase("hospitals"),
    safeSupabase("blood_banks"),
    safeSupabase("ambulances"),
    safeSupabase("diagnostics"),
    safeSupabase("pharmacies"),
  ]);

  const fallback = {
    hospitals: HOSPITALS,
    bloodBanks: BLOOD_BANKS,
    ambulances: AMBULANCES,
    diagnostics: DIAGNOSTICS,
    pharmacies: PHARMACIES,
  };

  // If any of the Supabase calls succeeded, use the mixed result (failed ones get fallback).
  const hasSupabase = hospitals || bloodBanks || ambulances || diagnostics || pharmacies;
  if (hasSupabase) {
    return {
      hospitals: hospitals ?? fallback.hospitals,
      bloodBanks: bloodBanks ?? fallback.bloodBanks,
      ambulances: ambulances ?? fallback.ambulances,
      diagnostics: diagnostics ?? fallback.diagnostics,
      pharmacies: pharmacies ?? fallback.pharmacies,
    };
  }

  // No Supabase data – return full mock set.
  return fallback;
}
