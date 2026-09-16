import express from 'express';
import { COVERAGE_ZONES } from '../../src/data/coverageZones.js';

const router = express.Router();

// GET all coverage zones
router.get('/zones', (req, res) => {
  res.json({
    success: true,
    count: COVERAGE_ZONES.length,
    data: COVERAGE_ZONES
  });
});

// GET single zone by ID
router.get('/zones/:id', (req, res) => {
  const zone = COVERAGE_ZONES.find(z => z.id === req.params.id);
  if (!zone) {
    return res.status(404).json({
      success: false,
      error: `Zone '${req.params.id}' not found`
    });
  }
  res.json({ success: true, data: zone });
});

export default router;
