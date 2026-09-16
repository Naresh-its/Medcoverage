import express from 'express';
import { calculateEffectiveCoverage } from '../../src/engine/coverageEngine.js';
import { simulateIntervention, rankCandidateInterventions } from '../../src/engine/whatIfEngine.js';
import { COVERAGE_ZONES } from '../../src/data/coverageZones.js';
import { MEDICAL_NEEDS } from '../../src/data/medicalNeeds.js';
import { 
  HOSPITALS, BLOOD_BANKS, AMBULANCES, DIAGNOSTICS, PHARMACIES 
} from '../../src/data/mockHealthcareData.js';

const router = express.Router();

const defaultResources = {
  hospitals: HOSPITALS,
  bloodBanks: BLOOD_BANKS,
  ambulances: AMBULANCES,
  diagnostics: DIAGNOSTICS,
  pharmacies: PHARMACIES
};

// POST /api/coverage/evaluate
// Evaluates zone coverage against medical emergency requirements
router.post('/coverage/evaluate', (req, res) => {
  try {
    const { zoneId, needId, zone: customZone, medicalNeed: customNeed } = req.body;

    const targetZone = customZone || COVERAGE_ZONES.find(z => z.id === zoneId) || COVERAGE_ZONES[0];
    const targetNeed = customNeed || MEDICAL_NEEDS.find(n => n.id === needId) || MEDICAL_NEEDS[0];

    const report = calculateEffectiveCoverage(targetZone, targetNeed, defaultResources);

    res.json({
      success: true,
      evaluatedZone: { id: targetZone.id, name: targetZone.name, center: targetZone.center },
      evaluatedNeed: { id: targetNeed.id, name: targetNeed.name, urgency: targetNeed.urgency, goldenWindowMin: targetNeed.goldenWindowMin },
      report
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/coverage/what-if
// Simulates an intervention (adding ambulances, trauma bays, blood units)
router.post('/coverage/what-if', (req, res) => {
  try {
    const { zoneId, needId, action, resourceType, quantity, details } = req.body;

    const targetZone = COVERAGE_ZONES.find(z => z.id === zoneId) || COVERAGE_ZONES[3];
    const targetNeed = MEDICAL_NEEDS.find(n => n.id === needId) || MEDICAL_NEEDS[0];

    const normalizedAction = (action || 'ADD').toUpperCase();
    const simulationResult = simulateIntervention(
      targetZone,
      normalizedAction,
      resourceType || 'ambulance',
      quantity !== undefined ? quantity : 2,
      targetNeed,
      defaultResources
    );

    res.json({
      success: true,
      zone: { id: targetZone.id, name: targetZone.name },
      need: { id: targetNeed.id, name: targetNeed.name },
      intervention: { action, resourceType, quantity },
      simulation: simulationResult
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/coverage/rank-interventions
router.post('/coverage/rank-interventions', (req, res) => {
  try {
    const { zoneId, needId, candidates } = req.body;
    const targetZone = COVERAGE_ZONES.find(z => z.id === zoneId) || COVERAGE_ZONES[3];
    const targetNeed = MEDICAL_NEEDS.find(n => n.id === needId) || MEDICAL_NEEDS[0];

    const ranked = rankCandidateInterventions(targetZone, targetNeed, defaultResources, candidates);
    res.json({ success: true, ranked });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
