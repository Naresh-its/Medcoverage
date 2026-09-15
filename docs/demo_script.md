# MedCoverage: Evaluator 30-Second Demo Storyline & Pitch Script

> **Document Type**: Hackathon Stage & Booth Presentation Guide  
> **Role Owner**: Research, Validation, Testing & Presentation Lead  
> **Target Duration**: Exactly 30 Seconds (with 60-Second Extended Version)  

---

## 1. Quick Reference: The 30-Second Stage Demo Track

```
[00:00 - 00:05] THE HOOK & IDENTITY
Screen: Home / Live Coverage Map with Clean White Glass UI
Voice:  "Most healthcare maps lie. They tell you a hospital is 5 minutes away, but omit that it has zero blood or no open trauma bay."

[00:05 - 00:10] SCENARIO SELECTION
Action: Click Medical Need dropdown -> Select "Severe Bleeding"
Voice:  "In severe hemorrhage, survival requires a synchronized bundle: O- Blood + Trauma Bay + ICU + ALS Transport within a 30-minute golden window."

[00:10 - 00:18] BOTTLENECK DISCOVERY
Action: Click the crimson zone: "East Industrial Corridor"
Voice:  "Notice East Industrial Corridor is glowing red at 38% coverage. Why? A hospital is just 4 km away, but the nearest O- blood is 28 km away. MedCoverage detects the exact bottleneck: Blood Access."

[00:18 - 00:25] WHAT-IF SIMULATION
Action: Click "What-If Simulator" tab -> View AI Recommendations -> Select "Add 2 Ambulances + Blood Reserve"
Voice:  "Instead of guessing where to spend millions, we simulate targeted interventions in real-time."

[00:25 - 00:30] LIVE TRANSFORMATION & PUNCHLINE
Screen: Map polygon shifts from Red to Emerald Green (72% Coverage)
Voice:  "Instantly, coverage leaps from 38% to 72% — resolving the dead zone and protecting 180,000 vulnerable workers. That is MedCoverage: from proximity illusions to clinical reality."
```

---

## 2. Step-by-Step Evaluator Walkthrough (Visual & Action Cues)

### Phase 1: Establish Authority (00:00 – 00:05)
- **UI State**: Start on `/coverage` with the persistent frosted glass application window centered on the telemetry canvas.
- **Physical Action**: Point to the live telemetry indicators (ECG pulse, active resource counts).
- **Key Takeaway**: Establish that this is an operational healthcare intelligence platform, not a simple map locator.

### Phase 2: Select High-Acuity Clinical Need (00:05 – 00:10)
- **UI State**: Open the Medical Need selector pill.
- **Physical Action**: Click **Severe Bleeding** (`severe_bleeding`).
- **Visual Feedback**:
  - Golden Hour countdown badge illuminates: **30 min**.
  - Requirement chip bar populates: `[Blood Bank (O-)]`, `[Trauma Bay (Tier 1/2)]`, `[ICU Bed]`, `[ALS Ambulance]`.

### Phase 3: Inspect Clinical Dead Zone (00:10 – 00:18)
- **UI State**: Interactive Leaflet map renders zoned polygons.
- **Physical Action**: Click directly on the red polygon labeled **East Industrial Corridor** (`zone-east`).
- **Visual Feedback**:
  - The **Dead Zone Diagnostic Panel** slides out.
  - Coverage gauge: **38% (High-Risk Dead Zone)**.
  - Primary Bottleneck Highlight: **`Blood Inventory Access (Nearest O- unit: 28.4 km / 38 min)`**.
  - Secondary status: Trauma hospital is verified at 4.2 km (8 min), proving proximity alone is clinically ineffective.

### Phase 4: Run Real-Time What-If Simulation (00:18 – 00:25)
- **UI State**: Navigate to `/what-if` (or launch via Quick Simulation drawer).
- **Physical Action**:
  - The engine has pre-ranked candidate options for the East Industrial Corridor.
  - Click **Option B: "Add 2 Ambulances + Blood Reserve"** (Rank #1 Score: 88).
- **Visual Feedback**:
  - The Before $\to$ After comparison cards light up.
  - Virtual resource pins appear on the map with glowing radar rings.

### Phase 5: The Punchline & Closing (00:25 – 00:30)
- **Visual Feedback**:
  - Zone status transitions: **`dead_zone` $\to$ `covered`**.
  - Metrics diff:
    - **Effective Coverage**: `38%` $\to$ `72%` (+34% Gain)
    - **Average Response Time**: `38 min` $\to$ `16 min` (-22 min Reduction)
    - **Protected Population**: **180,000 residents**
- **Presenter Stance**: Look directly at the judges and deliver the closing thesis statement clearly.

---

## 3. Judge & Evaluator FAQ (Handling Tough Questions)

### Q1: "How is this different from Google Maps or Uber for Ambulances?"
> **Answer**:  
> "Google Maps directs a patient to the nearest physical door with a hospital sign. If that facility lacks an emergency blood refrigerator or an available ICU bed, the patient dies waiting for an inter-facility transfer. MedCoverage bundles the four non-negotiable clinical requirements needed for specific pathologies before calculating access."

### Q2: "Are you using real road networks or straight-line distance?"
> **Answer**:  
> "Our current prototype utilizes Haversine distance calibrated with localized emergency vehicle velocity multipliers (e.g., 48 km/h for ALS units with sirens, 32 km/h for standard transit through industrial traffic corridors). In our architecture, the `geoutils.js` layer is an abstraction designed to plug directly into OpenStreetMap OSRM or Google Distance Matrix APIs."

### Q3: "Does this replace municipal EMS dispatchers?"
> **Answer**:  
> "No. MedCoverage is a strategic planning and simulation tool for municipal health commissioners, hospital network planners, and EMS directors to diagnose systemic blind spots and allocate ambulances, blood banks, and surgical wings where they prevent the most deaths."

### Q4: "Can a city afford to run these What-If calculations in real-time?"
> **Answer**:  
> "Yes. Traditional academic models like 2SFCA run heavy batch jobs that take hours or days. Our intelligence engine uses an in-memory spatial graph with zero side-effects and sub-millisecond evaluation, allowing decision makers to drag-and-drop virtual assets and see instantaneous population impact."

---

## 4. Presenter Checklist Before Pitching

- [ ] Browser window resolution set to 1920x1080 (100% zoom).
- [ ] Active route set to `http://localhost:5173/coverage`.
- [ ] Network tab disconnected / offline-ready (mock data is completely deterministic and local).
- [ ] Leaflet map centered on Chennai coordinates (`[13.0600, 80.2500]`, Zoom 11).
- [ ] "Severe Bleeding" selected as default scenario.
