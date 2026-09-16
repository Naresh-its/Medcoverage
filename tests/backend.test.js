/**
 * MedCoverage Backend API Test Suite
 * Validates all REST API endpoints, response structures, and engine integration.
 */

import app from '../server/index.js';
import http from 'http';

let server;
const PORT = 5002;
const BASE_URL = `http://localhost:${PORT}`;

async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const data = await res.json();
  return { status: res.status, data };
}

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function runTests() {
  console.log('=== Starting MedCoverage Backend API Integration Tests ===\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  // Start test server
  await new Promise((resolve) => {
    server = app.listen(PORT, resolve);
  });

  try {
    // 1. Root and Health
    const root = await get('/');
    assert(root.status === 200 && root.data.status === 'online', 'Root endpoint returns online status');

    const health = await get('/api/health');
    assert(health.status === 200 && health.data.status === 'healthy' && health.data.features.length >= 5, 'Healthcheck returns healthy status & 5 features');

    // 2. Medical Needs
    const needs = await get('/api/medical-needs');
    assert(needs.status === 200 && needs.data.count === 6, 'GET /api/medical-needs returns all 6 conditions');

    const singleNeed = await get('/api/medical-needs/severe_bleeding');
    assert(singleNeed.status === 200 && singleNeed.data.data.goldenWindowMin === 30, 'GET /api/medical-needs/:id returns correct golden window');

    // 3. Zones
    const zones = await get('/api/zones');
    assert(zones.status === 200 && zones.data.count >= 4, 'GET /api/zones returns coverage zones');

    const singleZone = await get('/api/zones/zone-central');
    assert(singleZone.status === 200 && singleZone.data.data.name.includes('Central'), 'GET /api/zones/:id returns zone details');

    // 4. Resources
    const resources = await get('/api/resources');
    assert(resources.status === 200 && resources.data.counts.hospitals >= 4, 'GET /api/resources returns hospital and blood bank counts');

    const hospitals = await get('/api/resources/hospitals');
    assert(hospitals.status === 200 && hospitals.data.count >= 4, 'GET /api/resources/hospitals returns hospital list');

    // 5. Coverage Evaluate
    const evalRes = await post('/api/coverage/evaluate', { zoneId: 'zone-central', needId: 'severe_bleeding' });
    assert(evalRes.status === 200 && evalRes.data.report.effectiveCoveragePct > 0, 'POST /api/coverage/evaluate computes coverage score');

    // 6. What-If Simulation
    const whatIfRes = await post('/api/coverage/what-if', { 
      zoneId: 'zone-south', 
      needId: 'severe_bleeding',
      action: 'ADD',
      resourceType: 'ambulance',
      quantity: 2
    });
    assert(whatIfRes.status === 200 && whatIfRes.data.simulation?.impact?.coverageGainPct !== undefined, 'POST /api/coverage/what-if returns delta impact');

    // 7. Ranked Hospitals (2G + 1Y + 1R distribution)
    const rankedRes = await get('/api/hospitals/ranked?sectorId=zone-central&needId=severe_bleeding');
    assert(rankedRes.status === 200 && rankedRes.data.count === 4, 'GET /api/hospitals/ranked returns 4 regional hospitals');
    const [h1, h2, h3, h4] = rankedRes.data.data;
    assert(h1.displayStatus === 'green' && h2.displayStatus === 'green' && h3.displayStatus === 'yellow' && h4.displayStatus === 'red', 
      'GET /api/hospitals/ranked guarantees 2 GREEN, 1 YELLOW, 1 RED demo distribution');

    // 8. Hospital Capability Profile
    const profileRes = await get('/api/hospitals/hosp-1/capability-profile?needId=severe_bleeding');
    assert(profileRes.status === 200 && profileRes.data.data.pathway.length === 5, 'GET /api/hospitals/:id/capability-profile returns 5-step clinical pathway');
    assert(profileRes.data.data.dataStatus.prototype === 'DEMO DATA', 'Capability profile provides transparent DEMO DATA badge');

    // 9. Route Evaluation
    const routeRes = await post('/api/routes/evaluate', {
      origin: { lat: 13.0827, lng: 80.2707 },
      destination: { lat: 13.0604, lng: 80.2496 },
      needId: 'severe_bleeding',
      simulateDelay: true
    });
    assert(routeRes.status === 200 && routeRes.data.metrics.delayAddedMin === 12, 'POST /api/routes/evaluate calculates +12m delay simulation');

  } catch (err) {
    console.error('Test execution error:', err);
    process.exitCode = 1;
  } finally {
    server.close();
    console.log(`\n========================================`);
    console.log(`Backend Tests Completed: ${passed} / ${total} passed`);
    console.log(`========================================\n`);
  }
}

runTests();
