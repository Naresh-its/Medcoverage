# MedCoverage — Healthcare Accessibility & Resource Planning Intelligence

> **"Healthcare exists. But is it actually accessible?"**  
> MedCoverage measures whether people can reach the right medical care when they need it — detecting healthcare dead zones, explaining accessibility bottlenecks, and simulating infrastructure interventions.

---

## 🌟 Key Differentiator

| Traditional Healthcare Maps | MedCoverage Intelligence |
| :--- | :--- |
| *"Where are the nearest hospitals?"* | *"Can patients reach the specific care they need in time?"* |
| Measures simple straight-line distance. | Evaluates travel window, required clinical modalities, blood readiness, and emergency dispatch. |
| Ignores ICU bed availability and specialized equipment. | Identifies clinical dead zones where facilities exist but critical capabilities are missing. |

---

## 🧭 Core Capabilities

1. **Interactive Coverage Map (Leaflet GIS)**
   - Custom markers for **Hospitals 🏥**, **Blood Banks 🩸**, **Ambulances 🚑**, **Diagnostic Centers 🧪**, and **Pharmacies 💊**.
   - Zonal accessibility overlays:
     - 🟢 **Covered**: ≥70% effective readiness
     - 🟠 **Limited Access**: 50–69% readiness
     - 🔴 **Medical Dead Zone**: <50% readiness (breaches golden hour window)

2. **Clinical Requirement Engine**
   - Condition-to-resource matrix:
     - **Severe Bleeding**: Requires O- blood + emergency trauma bay + vascular surgery + ALS ambulance.
     - **Acute Stroke**: Requires emergency room + 24/7 CT scanner + neurologist + ALS transport.
     - **Severe Trauma**: Requires Level 1/2 trauma bay + surgery + ICU bed + ventilator + ALS ambulance.
     - **Urgent Dialysis**: Requires operational dialysis station + medical transport.
     - **General Emergency & Diagnostics**: Resuscitation and stat pathology.

3. **Dead-Zone Root Cause Inspector**
   - Click any underserved red sector on the map to inspect:
     - Root cause breakdown (e.g. nearest ICU >30 km, 0 ALS ambulances free, blood bank stockout).
     - Automated **Suggested Intervention** (e.g. *"Station 2 Dedicated ALS Ambulances"*).
     - 1-click **"Simulate This Intervention"** action.

4. **What-If Infrastructure Simulator**
   - Model infrastructure modifications before capital investment:
     - **Actions**: ADD, REMOVE, RELOCATE.
     - **Resource Types**: Ambulances, Hospitals, ICU Beds, Blood Banks, Diagnostic Centers.
   - **Dynamic Before → After Matrix**:
     - Coverage % increase (e.g. 38% → 72%)
     - Response time reduction (e.g. 32 min → 16 min)
     - Population impact (e.g. +180,000 residents protected)
   - Real-time visual map morphing with animated pulse indicators for simulated resources.

5. **Healthcare Insights & Analytics (Recharts)**
   - 5 High-level KPIs: Overall Coverage (72%), Emergency Coverage (64%), Population Covered (1.8M), Dead Zones (14%), Avg Emergency Response (18 min).
   - Effective coverage readiness by medical condition.
   - Sector response times measured against the 15-minute golden hour standard.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, JavaScript (ES6+), React Hooks
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **Motion & Interactions**: Framer Motion (page transitions, spring jiggle micro-interactions)
- **Mapping & GIS**: Leaflet.js with CartoDB Positron clean clinical tiles
- **Analytics & Data Viz**: Recharts
- **Build Tool**: Vite 8

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

# Install dependencies
npm install

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
├── src/
│   ├── assets/               # Medical images, logos & vector graphics
│   ├── components/
│   │   ├── CoverageMap/      # Leaflet map, legend, dead-zone drawer & resource modal
│   │   ├── MotionGraphics/   # ECG lifeline background & transitional laser scanline
│   │   ├── Navigation/       # Persistent frosted glass navigation header
│   │   ├── WhatIf/           # What-If simulator workspace & Before/After card
│   │   ├── Analytics/        # Recharts KPI dashboards
│   │   └── Shared/           # Reusable badges and demo tour banners
│   ├── data/
│   │   ├── mockHealthcareData.js  # Hospitals, blood banks, ambulances, diagnostics
│   │   ├── medicalNeeds.js        # Clinical requirement engine matrices
│   │   ├── coverageZones.js       # Geographic sector boundaries & baseline metrics
│   │   └── simulationPresets.js   # Deterministic spatial simulation algorithms
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
├── package.json
└── vite.config.js
```

---

## 📄 License
MIT License. Created for the Healthcare Accessibility & Resource Planning initiative.
