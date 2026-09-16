import express from 'express';
import { haversineDistance, estimateTravelTime } from '../../src/engine/geoutils.js';
import { MEDICAL_NEEDS } from '../../src/data/medicalNeeds.js';

const router = express.Router();

// POST /api/routes/evaluate
// Evaluates distance, ETA, and emergency window compliance
router.post('/routes/evaluate', (req, res) => {
  try {
    const { origin, destination, needId, simulateDelay = false } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ success: false, error: 'origin and destination coordinates required' });
    }

    const currentNeed = MEDICAL_NEEDS.find(n => n.id === needId) || MEDICAL_NEEDS[0];
    const goldenWindowMin = currentNeed.goldenWindowMin || 30;

    const distanceKm = parseFloat(haversineDistance(origin, destination).toFixed(2));
    const baseDurationMin = estimateTravelTime(distanceKm, false);
    const effectiveDurationMin = simulateDelay ? baseDurationMin + 12 : baseDurationMin;

    const withinWindow = effectiveDurationMin <= goldenWindowMin;

    res.json({
      success: true,
      metrics: {
        distanceKm,
        baseDurationMin,
        effectiveDurationMin,
        delayAddedMin: simulateDelay ? 12 : 0,
        goldenWindowMin,
        withinWindow,
        statusText: withinWindow 
          ? 'Within Emergency Accessibility Window' 
          : 'Outside Emergency Accessibility Window'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
