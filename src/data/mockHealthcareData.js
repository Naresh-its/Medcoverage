// Realistic mock healthcare resources data for MedCoverage
// Geographically clustered around a metro region (Chennai / Metro Central: ~13.0827, 80.2707)

export const HOSPITALS = [
  {
    id: "hosp-1",
    name: "Apollo Central Super-Speciality",
    zoneId: "zone-central",
    location: { lat: 13.0604, lng: 80.2496 },
    address: "21 Greams Lane, Thousand Lights",
    capabilities: {
      emergency: true,
      icu: true,
      trauma: true,
      surgery: true,
      dialysis: true,
      ct_scan: true,
      cardiac_cath: true,
      burn_unit: false
    },
    metrics: {
      totalBeds: 450,
      availableIcuBeds: 14,
      ventilatorAvailable: 8,
      traumaTier: "Level 1",
      avgWaitTimeMin: 12
    },
    contact: "+91 44 2829 0200"
  },
  {
    id: "hosp-2",
    name: "Government General Hospital & Trauma Centre",
    zoneId: "zone-central",
    location: { lat: 13.0815, lng: 80.2777 },
    address: "EVR Periyar Salai, Park Town",
    capabilities: {
      emergency: true,
      icu: true,
      trauma: true,
      surgery: true,
      dialysis: true,
      ct_scan: true,
      cardiac_cath: true,
      burn_unit: true
    },
    metrics: {
      totalBeds: 1200,
      availableIcuBeds: 4,
      ventilatorAvailable: 2,
      traumaTier: "Level 1",
      avgWaitTimeMin: 28
    },
    contact: "+91 44 2530 5000"
  },
  {
    id: "hosp-3",
    name: "Fortis Malar Emergency Care",
    zoneId: "zone-south",
    location: { lat: 13.0067, lng: 80.2573 },
    address: "52 1st Main Rd, Gandhi Nagar, Adyar",
    capabilities: {
      emergency: true,
      icu: true,
      trauma: true,
      surgery: true,
      dialysis: false,
      ct_scan: true,
      cardiac_cath: true,
      burn_unit: false
    },
    metrics: {
      totalBeds: 180,
      availableIcuBeds: 6,
      ventilatorAvailable: 3,
      traumaTier: "Level 2",
      avgWaitTimeMin: 15
    },
    contact: "+91 44 4289 2222"
  },
  {
    id: "hosp-4",
    name: "West Suburban Community Hospital",
    zoneId: "zone-west",
    location: { lat: 13.0512, lng: 80.1588 },
    address: "Poonamallee High Rd, Porur",
    capabilities: {
      emergency: true,
      icu: true,
      trauma: false,
      surgery: true,
      dialysis: true,
      ct_scan: false, // CT scanner down/lacking 24/7 operator
      cardiac_cath: false,
      burn_unit: false
    },
    metrics: {
      totalBeds: 120,
      availableIcuBeds: 2,
      ventilatorAvailable: 1,
      traumaTier: "Level 3",
      avgWaitTimeMin: 35
    },
    contact: "+91 44 2476 8000"
  },
  {
    id: "hosp-5",
    name: "East Coast Primary Clinic (Secondary Care)",
    zoneId: "zone-east",
    location: { lat: 13.1290, lng: 80.3015 },
    address: "Ennore Express Way, Tiruvottiyur",
    capabilities: {
      emergency: true, // basic triage only
      icu: false,      // NO ICU!
      trauma: false,   // NO Trauma bay!
      surgery: false,  // NO Major Surgery!
      dialysis: false,
      ct_scan: false,  // NO CT Scan!
      cardiac_cath: false,
      burn_unit: false
    },
    metrics: {
      totalBeds: 25,
      availableIcuBeds: 0,
      ventilatorAvailable: 0,
      traumaTier: "Non-Trauma",
      avgWaitTimeMin: 45
    },
    contact: "+91 44 2573 1100"
  },
  {
    id: "hosp-6",
    name: "North Logistics Sector Health Center",
    zoneId: "zone-north",
    location: { lat: 13.1780, lng: 80.2210 },
    address: "GNT Road, Madhavaram Industrial Area",
    capabilities: {
      emergency: true,
      icu: false,
      trauma: false,
      surgery: false,
      dialysis: false,
      ct_scan: false,
      cardiac_cath: false,
      burn_unit: false
    },
    metrics: {
      totalBeds: 30,
      availableIcuBeds: 0,
      ventilatorAvailable: 0,
      traumaTier: "Non-Trauma",
      avgWaitTimeMin: 40
    },
    contact: "+91 44 2553 4411"
  }
];

export const BLOOD_BANKS = [
  {
    id: "blood-1",
    name: "Red Cross Regional Blood Centre",
    zoneId: "zone-central",
    location: { lat: 13.0732, lng: 80.2605 },
    address: "50 Montieth Rd, Egmore",
    inventory: {
      "A+": 32,
      "A-": 8,
      "B+": 28,
      "B-": 6,
      "O+": 45,
      "O-": 7, // Rare emergency universal donor
      "AB+": 14,
      "AB-": 3
    },
    components: ["PRBC (Packed Cells)", "FFP (Frozen Plasma)", "Platelet Concentrates", "Cryoprecipitate"],
    operatingHours: "24/7 Emergency Dispatch",
    phone: "+91 44 2855 4425",
    verifiedMinutesAgo: 12
  },
  {
    id: "blood-2",
    name: "City Voluntary Blood Bank",
    zoneId: "zone-south",
    location: { lat: 13.0110, lng: 80.2330 },
    address: "Sardar Patel Rd, Guindy",
    inventory: {
      "A+": 18,
      "A-": 3,
      "B+": 22,
      "B-": 4,
      "O+": 30,
      "O-": 2,
      "AB+": 9,
      "AB-": 1
    },
    components: ["PRBC", "Whole Blood"],
    operatingHours: "24/7 Emergency Dispatch",
    phone: "+91 44 2235 1289",
    verifiedMinutesAgo: 25
  },
  {
    id: "blood-3",
    name: "West Suburban Blood Storage Unit",
    zoneId: "zone-west",
    location: { lat: 13.0480, lng: 80.1650 },
    address: "Arcot Road, Valasaravakkam",
    inventory: {
      "A+": 8,
      "A-": 1,
      "B+": 9,
      "B-": 1,
      "O+": 12,
      "O-": 0, // Out of O-!
      "AB+": 4,
      "AB-": 0
    },
    components: ["Whole Blood only"],
    operatingHours: "8:00 AM - 10:00 PM (On Call Emergency)",
    phone: "+91 44 2486 3390",
    verifiedMinutesAgo: 48
  }
];

export const AMBULANCES = [
  {
    id: "amb-1",
    name: "108 Metro ALS Unit 01",
    type: "ALS (Advanced Life Support)",
    zoneId: "zone-central",
    location: { lat: 13.0700, lng: 80.2550 },
    status: "Available",
    equipment: ["Ventilator", "Defibrillator", "Telemetry", "Suction", "Emergency Meds"],
    crew: "EMT-Paramedic + Pilot",
    baseStation: "Egmore Central Depot",
    avgSpeedKmh: 45
  },
  {
    id: "amb-2",
    name: "108 Metro BLS Unit 04",
    type: "BLS (Basic Life Support)",
    zoneId: "zone-central",
    location: { lat: 13.0850, lng: 80.2700 },
    status: "En Route",
    equipment: ["Oxygen", "Stretcher", "First Aid Kit", "Automated Defibrillator"],
    crew: "EMT-Basic + Pilot",
    baseStation: "Park Town Hub",
    avgSpeedKmh: 40
  },
  {
    id: "amb-3",
    name: "South Metro ALS Unit 09",
    type: "ALS",
    zoneId: "zone-south",
    location: { lat: 13.0150, lng: 80.2450 },
    status: "Available",
    equipment: ["Ventilator", "Defibrillator", "Cardiac Monitor"],
    crew: "EMT-Paramedic + Pilot",
    baseStation: "Adyar Trauma Post",
    avgSpeedKmh: 48
  },
  {
    id: "amb-4",
    name: "West Suburban BLS Unit 12",
    type: "BLS",
    zoneId: "zone-west",
    location: { lat: 13.0450, lng: 80.1700 },
    status: "Busy",
    equipment: ["Oxygen", "First Aid Kit", "Splints"],
    crew: "EMT-Basic + Pilot",
    baseStation: "Porur Toll Gate",
    avgSpeedKmh: 35
  },
  {
    id: "amb-5",
    name: "North Ring Road BLS Unit 15",
    type: "BLS",
    zoneId: "zone-north",
    location: { lat: 13.1600, lng: 80.2100 },
    status: "Available",
    equipment: ["Oxygen", "Stretcher", "Basic Meds"],
    crew: "EMT-Basic + Pilot",
    baseStation: "Madhavaram Roundabout",
    avgSpeedKmh: 40
  }
];

export const DIAGNOSTICS = [
  {
    id: "diag-1",
    name: "Medall Metro Advanced Imaging & CT",
    zoneId: "zone-central",
    location: { lat: 13.0650, lng: 80.2400 },
    modalities: {
      ct_scan: true,
      mri: true,
      ultrasound: true,
      stat_lab: true
    },
    turnaroundMin: 20,
    hours: "24/7 Emergency Diagnostics"
  },
  {
    id: "diag-2",
    name: "SouthScan Diagnostic Pavilion",
    zoneId: "zone-south",
    location: { lat: 13.0200, lng: 80.2500 },
    modalities: {
      ct_scan: true,
      mri: true,
      ultrasound: true,
      stat_lab: true
    },
    turnaroundMin: 30,
    hours: "24/7 Emergency Diagnostics"
  },
  {
    id: "diag-3",
    name: "Westside Clinical Lab & X-Ray",
    zoneId: "zone-west",
    location: { lat: 13.0400, lng: 80.1600 },
    modalities: {
      ct_scan: false,
      mri: false,
      ultrasound: true,
      stat_lab: true
    },
    turnaroundMin: 60,
    hours: "7:00 AM - 10:00 PM"
  }
];

export const PHARMACIES = [
  {
    id: "pharm-1",
    name: "Apollo 24/7 Emergency Pharmacy",
    zoneId: "zone-central",
    location: { lat: 13.0610, lng: 80.2510 },
    is24Hours: true,
    traumaSuppliesStocked: true,
    narcoticsLicense: true
  },
  {
    id: "pharm-2",
    name: "MedPlus 24-Hour South",
    zoneId: "zone-south",
    location: { lat: 13.0080, lng: 80.2550 },
    is24Hours: true,
    traumaSuppliesStocked: true,
    narcoticsLicense: true
  },
  {
    id: "pharm-3",
    name: "Apollo Pharmacy West Suburban",
    zoneId: "zone-west",
    location: { lat: 13.0530, lng: 80.1550 },
    is24Hours: true,
    traumaSuppliesStocked: false,
    narcoticsLicense: false
  },
  {
    id: "pharm-4",
    name: "Coastal Care Chemist (Closes 9 PM)",
    zoneId: "zone-east",
    location: { lat: 13.1250, lng: 80.2980 },
    is24Hours: false,
    traumaSuppliesStocked: false,
    narcoticsLicense: false
  }
];