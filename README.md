# MedCoverage — Healthcare Accessibility & Resource Planning Intelligence

> **"Healthcare exists. But is it actually accessible?"**  
> MedCoverage measures whether people can reach the right medical care when they need it — detecting healthcare dead zones, explaining accessibility bottlenecks, and simulating infrastructure interventions in real-time.

---

## 🌟 Key Differentiator

| Traditional Healthcare Maps | Academic Spatial Models (2SFCA) | MedCoverage Intelligence |
| :--- | :--- | :--- |
| *"Where are the nearest hospitals?"* | *"What is the aggregate bed-to-population ratio?"* | *"Can patients reach the synchronized clinical bundle they need in time?"* |
| Measures simple straight-line distance. | Assumes all hospital beds and doctors are fungible. | Need-specific multi-resource bundle matching (Blood + Trauma + ICU + ALS Transport). |
| Ignores ICU capacity, blood inventory, and specialist on-call readiness. | Static catchment calculations taking hours/days. | Real-time clinical dead-zone detection with programmatic bottleneck explainability. |
| No intervention modeling. | Macro epidemiology policy papers. | Actionable **What-If Intervention Simulator** with multi-criteria candidate ranking. |

📖 *For an in-depth academic comparison, see [Research & Existing Solution Matrix](docs/novelty_research.md).*

---

## 🧭 Core Capabilities

1. **Interactive Coverage Map (Leaflet GIS)**
   - Custom markers for **Hospitals 🏥**, **Blood Banks 🩸**, **Ambulances 🚑**, **Diagnostic Centers 🧪**, and **Pharmacies 💊**.
   - Zonal accessibility overlays:
     - 🟢 **Covered**: ≥75% effective readiness
     - 🟠 **Limited Access**: 50–74% readiness
     - 🔴 **Medical Dead Zone**: <50% readiness (breaches golden hour window or missing critical clinical modality)

2. **Clinical Requirement Engine (`src/engine/`)**
   - Need-specific clinical requirement bundles:
     - **Severe Bleeding**: Requires O- blood + emergency trauma bay + vascular surgery + ALS ambulance within 30 min.
     - **Acute Stroke**: Requires emergency room + 24/7 CT scanner + neurologist + ALS transport within 60 min.
     - **Severe Trauma**: Requires Level 1/2 trauma bay + surgery + ICU bed + ventilator + ALS ambulance within 45 min.
     - **Urgent Dialysis**: Requires operational dialysis station + medical transport within 90 min.
     - **General Emergency & Diagnostics**: Resuscitation, stat pathology, and ultrasound within 45 min.
   - **Critical Modality Penalty**: If any non-negotiable critical modality is missing or outside the physiological golden window, effective coverage drops to **dead-zone status (<50%)**, preventing deceptive proximity metrics.

3. **Dead-Zone Root Cause Inspector**
   - Click any underserved red sector on the map to inspect:
     - Root cause breakdown (e.g. nearest ICU >30 km, 0 ALS ambulances free, blood bank stockout).
     - Automated **Suggested Intervention** (e.g. *"Station 2 Dedicated ALS Ambulances"*).
     - 1-click **"Simulate This Intervention"** action.

4. **What-If Infrastructure Simulator**
   - Model infrastructure modifications before capital investment:
     - **Actions**: `ADD`, `REMOVE`, `RELOCATE`.
     - **Resource Types**: Ambulances, Hospitals, ICU Beds, Blood Banks, Diagnostic Centers.
   - **Dynamic Before → After Matrix**:
     - Coverage % increase (e.g. 38% → 72%)
     - Response time reduction (e.g. 38 min → 16 min)
     - Population impact (e.g. +180,000 residents protected)
   - Real-time visual map morphing with animated pulse indicators for simulated resources.

5. **Healthcare Insights & Analytics (Recharts)**
   - 5 High-level KPIs: Overall Coverage, Emergency Readiness, Population Covered, Active Dead Zones, Average Response Time.
   - Effective coverage readiness by medical condition.
   - Sector response times measured against physiological golden hour standards.

---

## 🎬 Evaluator 30-Second Demo Storyline

Pitching to hackathon judges or executive evaluators? Follow our step-by-step 30-second presentation script:
1. **The Hook (0:00 - 0:05)**: Open MedCoverage on clean glass canvas. Contrast proximity vs actual clinical readiness.
2. **Scenario Selection (0:05 - 0:10)**: Select *"Severe Bleeding"* (requires Blood + Trauma + ICU + ALS Transport).
3. **Bottleneck Discovery (0:10 - 0:18)**: Click crimson *"East Industrial Corridor"*. Explain: *"Hospital is 4 km away, but nearest O- blood is 28 km away — Primary Bottleneck: Blood Access"*.
4. **What-If Simulation (0:18 - 0:25)**: Open What-If Simulator. Compare ranked options. Select *"Add 2 Ambulances + Blood Reserve"*.
5. **The Punchline (0:25 - 0:30)**: Live polygon turns green: Coverage leaps from 38% to 72%, protecting 180,000 residents.

📖 *Full narration script, visual cues, and judge Q&A defense: [Evaluator Demo Script](docs/demo_script.md).*

---

## 🧪 Automated Testing Suite

The repository includes a comprehensive, modular test suite covering the coverage calculation algorithms, What-If simulation engine, and route integrity.

```bash
# Run the complete test suite
npm test

# Run unit tests directly via Node
node tests/engine.test.js
```

### Test Coverage Highlights:
- **`tests/coverageEngine.test.js`**:
  - Validates full coverage calculation when all clinical capabilities are reachable within the golden window.
  - Validates **Critical Modality Penalty**: Verifies that a missing critical resource (e.g., Blood Bank or Trauma Bay for Severe Bleeding) drops effective coverage below 50% into `dead_zone` status even if a clinic is adjacent.
  - Validates golden window distance/time threshold failures.
  - Validates inventory zero-stock failure logic (e.g., O- blood stockouts).
  - Validates centralized threshold classifications (`covered` ≥ 75%, `limited` ≥ 50%, `dead_zone` < 50%).
- **`tests/whatIfEngine.test.js`**:
  - Validates Before → After metrics consistency across population, response times, and coverage gains.
  - Validates dead-zone resolution flags (`isDeadZoneResolved === true`).
  - Validates candidate intervention ranking by composite impact score.
  - Validates zero-mutation guarantee on baseline resource datasets.
- **`tests/routes.test.jsx`**:
  - Verifies that all 6 application routes (`/`, `/coverage`, `/needs`, `/what-if`, `/insights`, `/about`) render cleanly without runtime exceptions.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, JavaScript (ES6+), React Hooks
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **Motion & Interactions**: Framer Motion (glass transitions, spring micro-interactions)
- **Mapping & GIS**: Leaflet.js with CartoDB Positron clean clinical tiles
- **Analytics & Data Viz**: Recharts
- **Build Tool**: Vite 8
- **Testing**: Vitest & Node Assert Test Harness

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Naresh-its/Medcoverage.git
cd Medcoverage

# Switch to the research & QA branch
git checkout feature/research-qa

# Install dependencies
npm install

# Run automated tests
npm test

# Start the local development server
npm run dev
```

The application will be running at `http://localhost:5173/`.

### Production Build

```bash
# Compile and bundle for production
npm run build

# Preview production build
npm run preview
```

---

## 📂 Project Structure

```text
medcoverage/
├── docs/
│   ├── novelty_research.md   # Academic comparison (2SFCA vs MedCoverage) & disclaimer
│   ├── demo_script.md        # 30-second evaluator judging storyline & FAQ
│   └── coverage_engine.md    # Engine architecture & mathematical specifications
├── src/
│   ├── assets/               # Medical images, logos & vector graphics
│   ├── components/
│   │   ├── CoverageMap/      # Leaflet map, legend, dead-zone drawer & resource modal
│   │   ├── MotionGraphics/   # ECG lifeline background & transitional laser scanline
│   │   ├── Navigation/       # Persistent frosted glass navigation header
│   │   ├── WhatIf/           # What-If simulator workspace & Before/After card
│   │   ├── Analytics/        # Recharts KPI dashboards
│   │   └── Shared/           # Reusable badges and demo tour banners
│   ├── engine/               # Dynamic Coverage & Simulation Intelligence Engine
│   │   ├── coverageEngine.js # Effective coverage & critical modality penalty
│   │   ├── whatIfEngine.js   # Virtual intervention simulator & multi-criteria ranking
│   │   ├── bottleneckEngine.js # Explainable bottleneck detection
│   │   ├── resourceMatcher.js # Need-specific clinical bundle matching
│   │   ├── geoutils.js       # Haversine distance & emergency transit speeds
│   │   └── config.js         # Centralized clinical weights and thresholds
│   ├── data/
│   │   ├── mockHealthcareData.js  # Hospitals, blood banks, ambulances, diagnostics
│   │   ├── medicalNeeds.js        # Clinical requirement engine matrices
│   │   ├── coverageZones.js       # Geographic sector boundaries & baseline metrics
│   │   └── simulationPresets.js   # Deterministic spatial simulation presets
│   ├── pages/
│   │   ├── HomePage.jsx           # Minimal glass entry point & 5 navigation cards
│   │   ├── CoveragePage.jsx       # Dedicated GIS map interface
│   │   ├── MedicalNeedsPage.jsx   # Clinical requirement analysis interface
│   │   ├── WhatIfPage.jsx         # Infrastructure simulation workspace
│   │   ├── InsightsPage.jsx       # Analytics dashboard
│   │   └── AboutPage.jsx          # Spatial methodology manifesto
│   ├── App.jsx                    # Routing & global shared state
│   ├── main.jsx                   # React root entry point
│   └── index.css                  # Tailwind styles & physical glassmorphic classes
├── tests/
│   ├── coverageEngine.test.js     # Unit tests for coverage engine & dead-zone drop
│   ├── whatIfEngine.test.js       # Unit tests for What-If calculations & ranking
│   ├── routes.test.jsx            # Integration tests for all page routes
│   └── engine.test.js             # Standalone runner for core engine algorithms
├── package.json
└── vite.config.js
```

---

## ⚖️ Clinical Simulation Disclaimer

> [!IMPORTANT]
> **Prototype Simulation Disclaimer**:  
> MedCoverage is a rapid spatial planning and accessibility optimization prototype developed for research, simulation, and hackathon evaluation purposes.
> 
> Calculations, travel time estimates, and coverage percentages are generated using deterministic simulation models, synthetic regional datasets, and generalized speed factors. MedCoverage is **NOT an FDA-cleared, CE-marked, or clinically certified medical diagnostic device**, and is **NOT intended for live 911 / 108 / 112 emergency dispatch**, patient triaging, or clinical medical diagnosis.

---

## 📄 License
MIT License. Created for the Healthcare Accessibility & Resource Planning initiative.
