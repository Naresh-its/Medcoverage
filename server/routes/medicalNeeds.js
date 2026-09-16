import express from 'express';
import { MEDICAL_NEEDS } from '../../src/data/medicalNeeds.js';

const router = express.Router();

// GET all medical emergencies
router.get('/medical-needs', (req, res) => {
  res.json({
    success: true,
    count: MEDICAL_NEEDS.length,
    data: MEDICAL_NEEDS
  });
});

// GET single medical need by ID
router.get('/medical-needs/:id', (req, res) => {
  const need = MEDICAL_NEEDS.find(n => n.id === req.params.id);
  if (!need) {
    return res.status(404).json({
      success: false,
      error: `Medical need '${req.params.id}' not found`
    });
  }
  res.json({ success: true, data: need });
});

export default router;
