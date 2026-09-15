// Coverage zones across the metro region with geographic centers and polygon boundaries

export const COVERAGE_ZONES = [
  {
    id: "zone-central",
    name: "Metro Central Core",
    code: "Z-101",
    status: "covered", // "covered" | "limited" | "dead_zone"
    center: { lat: 13.0720, lng: 80.2600 },
    radius: 4200,
    polygon: [
      [13.0950, 80.2400],
      [13.0900, 80.2850],
      [13.0550, 80.2800],
      [13.0450, 80.2450],
      [13.0700, 80.2300]
    ],
    population: 850000,
    baselineMetrics: {
      overallCoveragePct: 92,
      emergencyCoveragePct: 94,
      avgResponseMin: 8,
      nearestIcuKm: 1.8,
      nearestBloodKm: 1.2,
      icuBedAvailable: 18,
      ambulanceUnitsFree: 4
    },
    riskAssessment: "Optimal medical infrastructure with dense clustering of Level-1 trauma, blood banks, and 24/7 diagnostic hubs."
  },
  {
    id: "zone-south",
    name: "South Corridor & Adyar Basin",
    code: "Z-102",
    status: "covered",
    center: { lat: 13.0100, lng: 80.2500 },
    radius: 3800,
    polygon: [
      [13.0350, 80.2350],
      [13.0300, 80.2700],
      [12.9900, 80.2650],
      [12.9850, 80.2300],
      [13.0100, 80.2200]
    ],
    population: 610000,
    baselineMetrics: {
      overallCoveragePct: 86,
      emergencyCoveragePct: 88,
      avgResponseMin: 12,
      nearestIcuKm: 3.2,
      nearestBloodKm: 2.1,
      icuBedAvailable: 8,
      ambulanceUnitsFree: 2
    },
    riskAssessment: "Robust private hospital network, moderate traffic peak hour delay on arterial corridors."
  },
  {
    id: "zone-west",
    name: "West Suburban Belt (Porur - Valasaravakkam)",
    code: "Z-103",
    status: "limited",
    center: { lat: 13.0480, lng: 80.1650 },
    radius: 4600,
    polygon: [
      [13.0750, 80.1450],
      [13.0700, 80.1900],
      [13.0250, 80.1850],
      [13.0200, 80.1400],
      [13.0500, 80.1350]
    ],
    population: 520000,
    baselineMetrics: {
      overallCoveragePct: 62,
      emergencyCoveragePct: 58,
      avgResponseMin: 23,
      nearestIcuKm: 14.5,
      nearestBloodKm: 11.2,
      icuBedAvailable: 2,
      ambulanceUnitsFree: 1
    },
    riskAssessment: "Vulnerable: Population growth has outpaced critical care capacity. No 24/7 CT scan after 9 PM, frequent blood stockouts.",
    reasons: [
      "No 24/7 emergency CT imaging in secondary clinics",
      "Only 1 basic life support ambulance available in a 15km sector",
      "Blood storage unit runs out of emergency O-negative blood frequently"
    ],
    suggestedIntervention: {
      title: "Add 1 ALS Ambulance & 24/7 CT Operator",
      action: "ADD",
      resourceType: "ambulance",
      quantity: 1,
      expectedCoveragePct: 78,
      expectedResponseMin: 15,
      peopleBenefited: "110,000"
    }
  },
  {
    id: "zone-east",
    name: "East Industrial & Coastal Corridor",
    code: "Z-104",
    status: "dead_zone", // PRIMARY DEMO DEAD ZONE
    center: { lat: 13.1350, lng: 80.3000 },
    radius: 5200,
    polygon: [
      [13.1700, 80.2750],
      [13.1650, 80.3250],
      [13.1050, 80.3200],
      [13.1000, 80.2700],
      [13.1350, 80.2650]
    ],
    population: 380000,
    baselineMetrics: {
      overallCoveragePct: 38,
      emergencyCoveragePct: 34,
      avgResponseMin: 32,
      nearestIcuKm: 34.0,
      nearestBloodKm: 28.5,
      icuBedAvailable: 0,
      ambulanceUnitsFree: 0
    },
    riskAssessment: "CRITICAL MEDICAL DEAD ZONE: High density industrial workforce with near-zero rapid trauma access. Hospital in area is non-ICU primary clinic only.",
    reasons: [
      "❌ No ICU facility within 20-minute golden hour window",
      "❌ 0 ambulances stationed locally (average dispatch time >30 min)",
      "❌ Blood bank is 28.5 km away in central city (lethal for hemorrhagic trauma)",
      "⚠️ Local clinic lacks emergency surgical theatre and blood transfusion license"
    ],
    suggestedIntervention: {
      title: "Station 2 Dedicated ALS Ambulances",
      action: "ADD",
      resourceType: "ambulance",
      quantity: 2,
      expectedCoveragePct: 72,
      expectedResponseMin: 16,
      peopleBenefited: "180,000"
    }
  },
  {
    id: "zone-north",
    name: "North Logistics & Industrial Zone",
    code: "Z-105",
    status: "dead_zone",
    center: { lat: 13.1750, lng: 80.2150 },
    radius: 4900,
    polygon: [
      [13.2050, 80.1900],
      [13.2000, 80.2450],
      [13.1500, 80.2400],
      [13.1450, 80.1850],
      [13.1750, 80.1800]
    ],
    population: 240000,
    baselineMetrics: {
      overallCoveragePct: 41,
      emergencyCoveragePct: 37,
      avgResponseMin: 29,
      nearestIcuKm: 29.0,
      nearestBloodKm: 24.0,
      icuBedAvailable: 0,
      ambulanceUnitsFree: 1
    },
    riskAssessment: "HIGH-RISK DEAD ZONE: Heavy vehicle freight corridor with high highway trauma incidence, but nearest tertiary ICU is over 29 km away.",
    reasons: [
      "❌ Nearest Level-1 trauma facility is 29 km south",
      "❌ Only 1 BLS vehicle covers freight highway transit corridor",
      "⚠️ Lack of stat point-of-care laboratory diagnostics"
    ],
    suggestedIntervention: {
      title: "Add 1 Trauma First-Response Post & ALS Unit",
      action: "ADD",
      resourceType: "ambulance",
      quantity: 1,
      expectedCoveragePct: 69,
      expectedResponseMin: 17,
      peopleBenefited: "135,000"
    }
  }
];