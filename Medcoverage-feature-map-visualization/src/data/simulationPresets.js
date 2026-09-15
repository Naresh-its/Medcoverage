// Infrastructure simulation models and calculation logic

export const SIMULATION_PRESETS = [
  {
    id: "sim-add-2-amb-east",
    name: "Add 2 ALS Ambulances to East Industrial Corridor",
    targetZoneId: "zone-east",
    action: "ADD",
    resourceType: "ambulance",
    quantity: 2,
    badge: "Recommended Hackathon Flow",
    description: "Station 2 Advanced Life Support ambulances at the Ennore Industrial Hub to eliminate the 32-minute response bottleneck.",
    before: {
      coveragePct: 38,
      responseMin: 32,
      deadZoneSeverity: "Critical (Large)",
      populationCovered: 144400,
      zoneStatus: "dead_zone"
    },
    after: {
      coveragePct: 72,
      responseMin: 16,
      deadZoneSeverity: "Minimized / Stable",
      populationCovered: 273600,
      populationImpact: "+129,200",
      zoneStatus: "covered"
    },
    simulatedMarker: {
      id: "sim-amb-new-1",
      name: "Simulated ALS Unit 21 (East Station)",
      type: "ALS (Advanced Life Support)",
      location: { lat: 13.1380, lng: 80.2950 },
      isSimulated: true
    }
  },
  {
    id: "sim-add-trauma-north",
    name: "Establish Level-2 Trauma & ICU Unit in North Zone",
    targetZoneId: "zone-north",
    action: "ADD",
    resourceType: "hospital",
    quantity: 1,
    badge: "Capital Infrastructure",
    description: "Upgrade Madhavaram Health Center with a 6-bed surgical ICU and 24/7 Trauma resuscitation bay.",
    before: {
      coveragePct: 41,
      responseMin: 29,
      deadZoneSeverity: "High Risk",
      populationCovered: 98400,
      zoneStatus: "dead_zone"
    },
    after: {
      coveragePct: 79,
      responseMin: 15,
      deadZoneSeverity: "Resolved",
      populationCovered: 189600,
      populationImpact: "+91,200",
      zoneStatus: "covered"
    },
    simulatedMarker: {
      id: "sim-hosp-new-1",
      name: "Simulated North Trauma Center & ICU",
      type: "Level-2 Trauma Center",
      location: { lat: 13.1760, lng: 80.2180 },
      isSimulated: true
    }
  },
  {
    id: "sim-add-blood-west",
    name: "Deploy 24/7 Automated Blood Bank to West Belt",
    targetZoneId: "zone-west",
    action: "ADD",
    resourceType: "blood_bank",
    quantity: 1,
    badge: "Specialized Resource",
    description: "Install cryogenic blood storage and universal O- negative reserve in Porur.",
    before: {
      coveragePct: 62,
      responseMin: 23,
      deadZoneSeverity: "Moderate / Limited",
      populationCovered: 322400,
      zoneStatus: "limited"
    },
    after: {
      coveragePct: 82,
      responseMin: 18,
      deadZoneSeverity: "Optimal",
      populationCovered: 426400,
      populationImpact: "+104,000",
      zoneStatus: "covered"
    },
    simulatedMarker: {
      id: "sim-blood-new-1",
      name: "Simulated West Metro Cryo Blood Bank",
      type: "Blood Bank (O- Guaranteed)",
      location: { lat: 13.0490, lng: 80.1620 },
      isSimulated: true
    }
  }
];

// Calculation function for dynamic simulation input
export function calculateSimulationResult(zone, action, resourceType, quantity) {
  const currentCoverage = zone.baselineMetrics.overallCoveragePct;
  const currentResponse = zone.baselineMetrics.avgResponseMin;
  const population = zone.population;

  let coverageGain = 0;
  let responseReduction = 0;

  if (action === "ADD") {
    if (resourceType === "ambulance") {
      coverageGain = Math.min(35, quantity * 17);
      responseReduction = Math.min(18, quantity * 8);
    } else if (resourceType === "hospital" || resourceType === "icu") {
      coverageGain = Math.min(42, quantity * 38);
      responseReduction = Math.min(16, quantity * 14);
    } else if (resourceType === "blood_bank") {
      coverageGain = Math.min(24, quantity * 20);
      responseReduction = Math.min(8, quantity * 5);
    } else if (resourceType === "diagnostic") {
      coverageGain = Math.min(22, quantity * 18);
      responseReduction = Math.min(7, quantity * 4);
    } else {
      coverageGain = Math.min(12, quantity * 10);
      responseReduction = Math.min(4, quantity * 2);
    }
  } else if (action === "REMOVE") {
    coverageGain = -Math.min(30, quantity * 15);
    responseReduction = -Math.min(15, quantity * 6);
  } else {
    // RELOCATE
    coverageGain = Math.min(25, quantity * 14);
    responseReduction = Math.min(12, quantity * 6);
  }

  const newCoverage = Math.max(15, Math.min(96, currentCoverage + coverageGain));
  const newResponse = Math.max(7, Math.min(55, currentResponse - responseReduction));
  const newZoneStatus = newCoverage >= 70 ? "covered" : newCoverage >= 50 ? "limited" : "dead_zone";
  const peopleImpact = Math.round(population * Math.abs(coverageGain) / 100);

  return {
    before: {
      coveragePct: currentCoverage,
      responseMin: currentResponse,
      zoneStatus: zone.status,
      populationCovered: Math.round(population * currentCoverage / 100)
    },
    after: {
      coveragePct: newCoverage,
      responseMin: newResponse,
      zoneStatus: newZoneStatus,
      populationCovered: Math.round(population * newCoverage / 100),
      populationImpact: (coverageGain >= 0 ? "+" : "-") + peopleImpact.toLocaleString()
    }
  };
}