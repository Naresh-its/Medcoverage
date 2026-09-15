// server/routes/coverageRoutes.js
// Express router that exposes the MedCoverage Intelligence Engine via HTTP.
// All routes validate input, locate the requested zone & medical need, and forward
// to the pure‑JS engine functions imported from src/engine.

import express from "express";
import { calculateEffectiveCoverage } from "../../src/engine/coverageEngine.js";
import { detectZoneBottlenecks } from "../../src/engine/bottleneckEngine.js";
import { simulateIntervention, rankCandidateInterventions } from "../../src/engine/whatIfEngine.js";
import {
  getCoverageZones,
  getCoverageZoneById,
  getMedicalNeeds,
  getMedicalNeedById,
  getResources,
} from "../services/dataAccess.js";

const router = express.Router();

// Helper to resolve resources, preferring custom overrides or Supabase data.
async function resolveResources(customResources) {
  if (customResources && typeof customResources === "object") {
    return customResources;
  }
  // Fallback to Supabase (or mock) data
  return await getResources();
}

// POST /api/coverage – effective coverage calculation
router.post("/coverage", async (req, res) => {
  try {
    const { zoneId, needId, resources: customResources } = req.body;
    if (!zoneId || !needId) {
      return res.status(400).json({ error: "Missing required fields: zoneId, needId" });
    }
    const zone = await getCoverageZoneById(zoneId);
    const need = await getMedicalNeedById(needId);
    if (!zone || !need) {
      return res.status(400).json({ error: "Invalid zoneId or needId" });
    }
    const resources = await resolveResources(customResources);
    const result = calculateEffectiveCoverage(zone, need, resources);
    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/bottlenecks – return bottleneck analysis only
router.post("/bottlenecks", async (req, res) => {
  try {
    const { zoneId, needId, resources: customResources } = req.body;
    if (!zoneId || !needId) {
      return res.status(400).json({ error: "Missing required fields: zoneId, needId" });
    }
    const zone = await getCoverageZoneById(zoneId);
    const need = await getMedicalNeedById(needId);
    if (!zone || !need) {
      return res.status(400).json({ error: "Invalid zoneId or needId" });
    }
    const resources = await resolveResources(customResources);
    const result = detectZoneBottlenecks(zone, need, resources);
    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/simulate – what‑if intervention simulation
router.post("/simulate", async (req, res) => {
  try {
    const {
      zoneId,
      needId,
      action,
      resourceType,
      quantity = 1,
      customLocation,
      resources: customResources,
    } = req.body;
    if (!zoneId || !needId || !action || !resourceType) {
      return res
        .status(400)
        .json({ error: "Missing required fields: zoneId, needId, action, resourceType" });
    }
    const zone = await getCoverageZoneById(zoneId);
    const need = await getMedicalNeedById(needId);
    if (!zone || !need) {
      return res.status(400).json({ error: "Invalid zoneId or needId" });
    }
    const resources = await resolveResources(customResources);
    const result = simulateIntervention(
      zone,
      action,
      resourceType,
      Number(quantity),
      need,
      resources,
      customLocation
    );
    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/interventions/evaluate – ranking of candidate interventions
router.post("/interventions/evaluate", async (req, res) => {
  try {
    const { zoneId, needId, resources: customResources } = req.body;
    if (!zoneId || !needId) {
      return res.status(400).json({ error: "Missing required fields: zoneId, needId" });
    }
    const zone = await getCoverageZoneById(zoneId);
    const need = await getMedicalNeedById(needId);
    if (!zone || !need) {
      return res.status(400).json({ error: "Invalid zoneId or needId" });
    }
    const resources = await resolveResources(customResources);
    const result = rankCandidateInterventions(zone, need, resources);
    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ----- New GET Endpoints -----

// GET all resources
router.get("/resources", async (req, res) => {
  try {
    const resources = await getResources();
    return res.json(resources);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to fetch resources" });
  }
});

// GET specific resource collection by type (e.g., hospitals, bloodBanks, ambulances, diagnostics, pharmacies)
router.get("/resources/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const resources = await getResources();
    if (resources && resources[type] !== undefined) {
      return res.json(resources[type]);
    }
    return res.status(404).json({ error: "Resource type not found" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to fetch resource type" });
  }
});

// GET all medical needs
router.get("/medical-needs", async (req, res) => {
  try {
    const needs = await getMedicalNeeds();
    return res.json(needs);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to fetch medical needs" });
  }
});

// GET all coverage zones
router.get("/coverage", async (req, res) => {
  try {
    const zones = await getCoverageZones();
    return res.json(zones);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to fetch coverage zones" });
  }
});

// GET specific coverage zone by ID
router.get("/coverage/:zoneId", async (req, res) => {
  try {
    const { zoneId } = req.params;
    const zone = await getCoverageZoneById(zoneId);
    if (!zone) {
      return res.status(404).json({ error: "Coverage zone not found" });
    }
    return res.json(zone);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to fetch coverage zone" });
  }
});

// GET analytics summary
router.get("/analytics", async (req, res) => {
  try {
    const [zones, needs, resources] = await Promise.all([
      getCoverageZones(),
      getMedicalNeeds(),
      getResources(),
    ]);
    return res.json({
      zonesCount: zones.length,
      needsCount: needs.length,
      resourcesCount: {
        hospitals: resources.hospitals?.length ?? 0,
        bloodBanks: resources.bloodBanks?.length ?? 0,
        ambulances: resources.ambulances?.length ?? 0,
        diagnostics: resources.diagnostics?.length ?? 0,
        pharmacies: resources.pharmacies?.length ?? 0,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
