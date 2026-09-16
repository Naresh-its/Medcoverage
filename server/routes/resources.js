import express from 'express';
import { 
  HOSPITALS, BLOOD_BANKS, AMBULANCES, DIAGNOSTICS, PHARMACIES 
} from '../../src/data/mockHealthcareData.js';

const router = express.Router();

// GET all resources with optional zone filtering
router.get('/resources', (req, res) => {
  const { zoneId, type } = req.query;

  let result = {
    hospitals: HOSPITALS,
    bloodBanks: BLOOD_BANKS,
    ambulances: AMBULANCES,
    diagnostics: DIAGNOSTICS,
    pharmacies: PHARMACIES
  };

  if (zoneId) {
    result = {
      hospitals: result.hospitals.filter(h => h.zoneId === zoneId),
      bloodBanks: result.bloodBanks.filter(b => b.zoneId === zoneId),
      ambulances: result.ambulances.filter(a => a.zoneId === zoneId),
      diagnostics: result.diagnostics.filter(d => d.zoneId === zoneId),
      pharmacies: result.pharmacies.filter(p => p.zoneId === zoneId)
    };
  }

  if (type && result[type]) {
    return res.json({
      success: true,
      count: result[type].length,
      type,
      data: result[type]
    });
  }

  res.json({
    success: true,
    counts: {
      hospitals: result.hospitals.length,
      bloodBanks: result.bloodBanks.length,
      ambulances: result.ambulances.length,
      diagnostics: result.diagnostics.length,
      pharmacies: result.pharmacies.length
    },
    data: result
  });
});

// Specific resource endpoints
router.get('/resources/hospitals', (req, res) => {
  res.json({ success: true, count: HOSPITALS.length, data: HOSPITALS });
});

router.get('/resources/blood-banks', (req, res) => {
  res.json({ success: true, count: BLOOD_BANKS.length, data: BLOOD_BANKS });
});

export default router;
