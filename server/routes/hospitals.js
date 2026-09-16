import express from 'express';
import { REGIONAL_SECTORS, getRankedHospitalsForRegion } from '../../src/data/regionalHospitalData.js';
import { getHospitalCapabilityProfile } from '../../src/engine/capabilityIntelligence.js';
import { HOSPITALS } from '../../src/data/mockHealthcareData.js';

const router = express.Router();

// GET /api/hospitals/ranked?sectorId=zone-central&needId=severe_bleeding
// Returns 4 ranked hospitals with guaranteed 2G + 1Y + 1R distribution
router.get('/hospitals/ranked', (req, res) => {
  const sectorId = req.query.sectorId || 'zone-central';
  const needId = req.query.needId || 'severe_bleeding';

  const sector = REGIONAL_SECTORS.find(s => s.id === sectorId) || REGIONAL_SECTORS[0];
  const ranked = getRankedHospitalsForRegion(sector.id, needId);

  res.json({
    success: true,
    sector: { id: sector.id, name: sector.name, simulatedOrigin: sector.simulatedOrigin },
    emergencyId: needId,
    distribution: '2 GREEN (Optimal), 1 YELLOW (Limited), 1 RED (Critical Deficit)',
    count: ranked.length,
    data: ranked
  });
});

// GET /api/hospitals/:id/capability-profile?needId=severe_bleeding
// Returns deep clinical capability & availability intelligence profile
router.get('/hospitals/:id/capability-profile', (req, res) => {
  const { id } = req.params;
  const needId = req.query.needId || 'severe_bleeding';

  // Search across regional hospitals and mock hospitals
  let hospital = null;
  for (const sector of REGIONAL_SECTORS) {
    const found = sector.hospitals.find(h => h.id === id);
    if (found) { hospital = found; break; }
  }
  if (!hospital) {
    hospital = HOSPITALS.find(h => h.id === id);
  }

  if (!hospital) {
    return res.status(404).json({
      success: false,
      error: `Hospital '${id}' not found`
    });
  }

  const profile = getHospitalCapabilityProfile(hospital, needId);

  res.json({
    success: true,
    hospitalId: id,
    emergencyId: needId,
    data: profile
  });
});

export default router;
