# MedCoverage Intelligence Engine: Analytical Specifications & Architecture

## 1. Executive Summary & Problem Formulation

Standard healthcare accessibility dashboards rely on **static Euclidean buffers** (e.g. 5 km radius circles) and **crude beds-per-capita metrics**. In real-world emergency medicine, this creates deadly false positives:

> An underserved industrial corridor may have a community clinic 1 km away, but if a patient suffers severe arterial bleeding or acute ischemic stroke, that clinic lacks blood transfusions, emergency surgery, and rapid CT scanning. Geographically the area appears "covered", but clinically it is a **Medical Dead Zone**.

The **MedCoverage Intelligence Engine** transforms MedCoverage from a visual GIS map into an explainable, deterministic clinical accessibility system. It programmatically answers four pivotal questions:

1. **"Can this specific zone actually access the RIGHT care for a specific medical emergency?"**
2. **"Why is this zone underserved?"** (Clinical modality gap vs. transit time vs. resource stockout)
3. **"What is the actual limiting resource bottleneck?"**
4. **"What specific intervention yields the highest clinical coverage gain?"**

---

## 2. Architectural Structure

The intelligence layer is constructed as a **pure JavaScript, zero-dependency, deterministic engine** decoupled from React, Leaflet, or browser DOM APIs.

```
src/engine/
├── config.js              # Centralized speeds, road winding factors, thresholds, weights
├── geoutils.js            # Haversine distance, winding transit times, golden-hour window checks
├── resourceMatcher.js     # Clinical requirement matching (facilities, equipment, stock, distance)
├── coverageEngine.js      # Effective coverage scoring, critical modality penalty, narrative generator
├── bottleneckEngine.js    # Limiting factor identification (blood, trauma, ambulance, CT, staffing)
├── whatIfEngine.js        # Non-mutating virtual simulation & multi-intervention ranking
└── index.js               # Unified exports and backward-compatible UI adapters
```

---

## 3. The 6 Intelligence & Novelty Layers

### Layer 1: Dynamic Multi-Modality Resource Matching (`resourceMatcher.js`)
Instead of treating all hospitals as interchangeable facilities, each medical need maps to an array of **mandatory clinical modalities** with assigned criticality tiers:
- **Severe Bleeding**: Blood Bank (O- / Matched), Trauma Resuscitation Bay, Vascular Surgery, ALS Ambulance Transport.
- **Acute Stroke**: 24/7 CT / MRI Scanner, Emergency Department, Neurologist Specialist on call, ALS Ambulance with Telemetry.
- **Severe Trauma**: Level 1/2 Trauma Bay, Surgical Suite, Free ICU Bed & Ventilator, ALS Transport.

`resourceMatcher.js` cross-references zone coordinates against every facility's:
1. Exact capability flags (`trauma`, `surgery`, `icu`, `ct_scan`, `dialysis`).
2. Live inventory / capacity (e.g. O- negative blood unit reserve, free ICU bed count).
3. Operational availability (e.g. ambulance status `Available` vs `Dispatched`).
4. Travel time to ensure delivery within the procedure's golden window.

### Layer 2: Golden-Hour Distance & Realistic Transit Modeling (`geoutils.js`)
Standard air-distance metrics drastically underestimate urban response times. The engine models travel time using:

$$\text{Distance}_{\text{road}} = \text{Haversine}(P_1, P_2) \times f_{\text{winding}}$$

$$\text{TravelTime}_{\text{minutes}} = \left( \frac{\text{Distance}_{\text{road}}}{v_{\text{mode}}} \times 60 \right) + t_{\text{turnout}}$$

* **Urban Winding Detour Factor ($f_{\text{winding}}$)**: `1.3` (centralized in `config.js`).
* **Ambulance Emergency Speed ($v_{\text{ambulance}}$)**: `45 km/h` (priority lane clearing).
* **Patient Transit Speed ($v_{\text{standardTransit}}$)**: `30 km/h`.
* **Turnout Delay ($t_{\text{turnout}}$)**: `3 minutes` (dispatch and crew muster).

A modality is only considered accessible if:

$$\text{TravelTime} \le T_{\text{goldenWindow}}$$

### Layer 3: Effective Coverage Scoring with Critical Modality Penalty (`coverageEngine.js`)
Each requirement has a clinical weight:
* `CRITICAL`: Weight = `1.0`
* `HIGH`: Weight = `0.7`
* `STANDARD`: Weight = `0.4`

Raw accessibility score is computed as:

$$\text{RawScore} = \frac{\sum (w_i \times q_i)}{\sum w_i} \times 100$$

Where $q_i$ represents the quality of response within the golden window ($q_i = \max(0.75, 1.0 - 0.25 \times \frac{\text{TravelTime}}{T_{\text{window}}})$).

#### The Novelty Trigger: Critical Modality Penalty
If **any** requirement marked `CRITICAL` cannot be satisfied within the golden hour window (e.g., zero reachable blood bank with O- stock, or zero reachable trauma surgeon), the engine enforces the **Critical Missing Penalty Multiplier**:

$$\text{EffectiveCoverage} = \min(\text{RawScore} \times 0.40, 45\%)$$

This mathematically prevents high scores for areas that have general clinics but zero emergency capabilities for life-threatening conditions.

### Layer 4: Programmatic Bottleneck Detection (`bottleneckEngine.js`)
The engine dynamically pinpoints the primary operational bottleneck by analyzing unsatisfied requirements:
1. **Critical Modality Gap**: Lack of specialized equipment (e.g. no 24/7 CT Scanner or Trauma Bay).
2. **Inventory Stockout**: Regional blood center exists nearby, but units of type O- are depleted.
3. **Transport / Dispatch Deficit**: 0 ambulances available locally; nearest vehicle is outside response threshold.
4. **Distance / Transit Constraint**: Facility exists but road network travel time exceeds the physiological golden window.

### Layer 5: Virtual Non-Mutating Simulation (`whatIfEngine.js`)
When infrastructure planners or emergency dispatchers test interventions (`ADD`, `REMOVE`, or `RELOCATE`), the engine performs a **deep clone** of baseline resources:
* **Zero side effects**: Baseline state (`HOSPITALS`, `BLOOD_BANKS`, `AMBULANCES`) remains completely pristine and immutable.
* **Deterministic Before/After**: Generates precise deltas for:
  * Coverage Percentage Gain ($\Delta \%$).
  * Emergency Response Reduction ($\Delta \text{minutes}$).
  * Population Protected ($\text{Zone Population} \times \Delta \%$).
  * Dead-Zone Resolution status.
* Returns a `simulatedMarker` object ready for map rendering.

### Layer 6: Explainable Multi-Intervention Ranking (`rankCandidateInterventions`)
When deciding resource allocation, the engine can simulate multiple candidate actions in parallel and rank them by an explainable clinical impact score:

$$\text{Score} = (\Delta \text{Coverage} \times 0.5) + \text{DeadZoneResolvedBonus}(+30) + (\Delta \text{ResponseMin} \times 0.2)$$

The highest-scoring intervention is highlighted as `bestRecommendation` with full comparative analytics.

---

## 4. Centralized Configuration Reference (`config.js`)

```javascript
export const ENGINE_CONFIG = {
  speedsKmh: {
    ambulance: 45,        // Priority emergency transit
    standardTransit: 30,  // Patient non-emergency transit
    ruralTransit: 50      // Peripheral corridor transit
  },
  roadNetworkFactor: 1.3,
  dispatchTurnoutDelayMin: 3,
  statusThresholds: {
    coveredMin: 70,       // >= 70% is 'covered' (Green)
    limitedMin: 50,       // 50% - 69% is 'limited' (Amber)
    deadZoneMax: 49       // <= 49% is 'dead_zone' (Red)
  },
  criticalityWeights: {
    CRITICAL: 1.0,
    HIGH: 0.7,
    STANDARD: 0.4
  },
  criticalMissingPenaltyMultiplier: 0.40
};
```

---

## 5. UI Integration & Backward Compatibility

The engine maintains seamless backward compatibility with existing MedCoverage components:

1. **`src/data/simulationPresets.js`**:
   `calculateSimulationResult(zone, action, resourceType, quantity)` now delegates directly to `simulateIntervention()` under the hood. The return signature (`before`, `after`, `populationImpact`, `zoneStatus`) is identical to legacy presets, allowing `WhatIfSimulator.jsx` and `DeadZonePanel.jsx` to consume dynamic results with zero code breakage.

2. **`src/engine/index.js`**:
   Exports all individual functions and the `calculateSimulationResultAdapter()` for future modular imports.

---

## 6. Verification & Automated Test Suite

A comprehensive test suite in `tests/engine.test.js` verifies all 8 core intelligence acceptance criteria:

```bash
# Run unit tests
node tests/engine.test.js

# Build production bundle
npm run build
```

### Verification Results
* ✅ **Test 1**: Geo utilities calculate accurate Haversine distance and travel time.
* ✅ **Test 2**: High coverage score when all resources reachable within golden window (Zone Central).
* ✅ **Test 3**: Critical modality failure drops effective coverage score below 50% (Zone West with Severe Bleeding).
* ✅ **Test 4**: Resource distance exceeding golden window fails requirement.
* ✅ **Test 5**: Zero inventory for blood type fails requirement with explicit stockout reason.
* ✅ **Test 6**: Adding 2 ambulances in underserved zone increases coverage and reduces response time.
* ✅ **Test 7**: Multi-intervention ranking ranks options with highest clinical impact first.
* ✅ **Test 8**: Virtual simulation guarantees zero mutation of source baseline datasets.

---

## 7. Assumptions & Prototype Boundaries

1. **Road Network Detour**: Winding factor is fixed at 1.3 across the metro area. In a production deployment with GIS routing engines (e.g. OSRM or Google Maps Directions API), real-time road topology and live traffic congestion indexes would be substituted.
2. **Fixed Dispatch Speeds**: Uses representative average urban emergency velocity (45 km/h). Real-world dispatch can incorporate time-of-day traffic matrices.
3. **Resource Datasets**: Utilizes regional metro Chennai mock datasets with realistic coordinate clusters and clinical metrics.