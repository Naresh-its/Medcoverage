import express from 'express';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'MedCoverage Clinical Intelligence API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    features: [
      'Coverage Intelligence Engine',
      'Resource Matching & Fallbacks',
      'Care Capability & Availability Intelligence',
      'What-If Infrastructure Simulation',
      'Traffic-Aware Corridor Evaluation'
    ]
  });
});

export default router;
