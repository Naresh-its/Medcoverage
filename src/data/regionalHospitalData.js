// Structured Regional Healthcare Dataset for MedCoverage Demo
// Contains 8 distinct Chennai metropolitan sectors, each with 4 unique facilities
// Every region strictly adheres to: 2 GREEN (>=70%), 1 YELLOW (50-69%), 1 RED (<50%)

export const REGIONAL_SECTORS = [
  {
    id: "zone-central",
    name: "Metro Central Core",
    code: "Z-101",
    status: "covered",
    center: { lat: 13.0720, lng: 80.2600 },
    simulatedOrigin: {
      name: "Anna Salai Arterial Junction",
      location: { lat: 13.0650, lng: 80.2550 }
    },
    hospitals: [
      {
        id: "hosp-cen-1",
        name: "Apollo Central Super-Speciality",
        tierLabel: "TOP MATCH",
        tierRank: 1,
        status: "green",
        baseCoveragePct: 94,
        distKm: 1.7,
        estTimeMin: 5,
        address: "21 Greams Lane, Thousand Lights",
        contact: "+91 44 2829 0200",
        location: { lat: 13.0604, lng: 80.2496 },
        traumaTier: "Level 1",
        availableIcuBeds: 14,
        ventilatorAvailable: 8,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: true, cardiac_cath: true },
        corridor: "Via Thousand Lights Arterial Link",
        rankingReason: "Fastest transit with verified Level-1 trauma suite, co-located blood bank, and active resuscitation team."
      },
      {
        id: "hosp-cen-2",
        name: "Government General Hospital & Trauma Centre",
        tierLabel: "STRONG ALTERNATIVE",
        tierRank: 2,
        status: "green",
        baseCoveragePct: 84,
        distKm: 3.1,
        estTimeMin: 9,
        address: "EVR Periyar Salai, Park Town",
        contact: "+91 44 2530 5000",
        location: { lat: 13.0815, lng: 80.2777 },
        traumaTier: "Level 1",
        availableIcuBeds: 8,
        ventilatorAvailable: 4,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: true, cardiac_cath: true },
        corridor: "Via Poonamallee High Road",
        rankingReason: "High surgical surge capacity and dedicated 24/7 emergency diagnostic imaging wing."
      },
      {
        id: "hosp-cen-3",
        name: "Billroth Hospitals Shenoy Nagar",
        tierLabel: "LIMITED OPTION",
        tierRank: 3,
        status: "yellow",
        baseCoveragePct: 63,
        distKm: 5.8,
        estTimeMin: 17,
        address: "43 Lakshmi Talkies Rd, Shenoy Nagar",
        contact: "+91 44 2664 1777",
        location: { lat: 13.0788, lng: 80.2285 },
        traumaTier: "Level 2",
        availableIcuBeds: 3,
        ventilatorAvailable: 1,
        bloodAvailable: false, // Blood stockout / limited O-
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: false, cardiac_cath: false },
        corridor: "Via EVR Road & Aminjikarai Flyover",
        rankingReason: "Nearby surgical care, but emergency blood availability is constrained and CT scan operator is on-call only."
      },
      {
        id: "hosp-cen-4",
        name: "Central Metro Daycare & Minor Triage Centre",
        tierLabel: "CRITICAL DEFICIT",
        tierRank: 4,
        status: "red",
        baseCoveragePct: 36,
        distKm: 6.2,
        estTimeMin: 24,
        address: "Sydenhams Rd, Periamet",
        contact: "+91 44 2561 0340",
        location: { lat: 13.0890, lng: 80.2690 },
        traumaTier: "Level 3",
        availableIcuBeds: 0,
        ventilatorAvailable: 0,
        bloodAvailable: false,
        traumaReady: false,
        surgeryReady: false,
        ambulanceReady: false,
        capabilities: { emergency: true, icu: false, trauma: false, surgery: false, dialysis: false, ct_scan: false, cardiac_cath: false },
        corridor: "Via Wall Tax Road Corridor",
        rankingReason: "Lacks surgical theatre, blood storage license, and ICU beds; unsuited for critical trauma or hemorrhage."
      }
    ]
  },
  {
    id: "zone-south",
    name: "South Corridor & Adyar Basin",
    code: "Z-102",
    status: "covered",
    center: { lat: 13.0100, lng: 80.2500 },
    simulatedOrigin: {
      name: "Adyar Gate Signal & TTK Intersection",
      location: { lat: 13.0140, lng: 80.2450 }
    },
    hospitals: [
      {
        id: "hosp-sou-1",
        name: "Fortis Malar Emergency Care",
        tierLabel: "TOP MATCH",
        tierRank: 1,
        status: "green",
        baseCoveragePct: 91,
        distKm: 2.1,
        estTimeMin: 6,
        address: "52 1st Main Rd, Gandhi Nagar, Adyar",
        contact: "+91 44 4289 2222",
        location: { lat: 13.0067, lng: 80.2573 },
        traumaTier: "Level 1",
        availableIcuBeds: 11,
        ventilatorAvailable: 5,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: true, cardiac_cath: true },
        corridor: "Via Sardar Patel Road Trunk",
        rankingReason: "Direct access with active Level-1 trauma resus team and immediate blood transfusion dispatch."
      },
      {
        id: "hosp-sou-2",
        name: "Kauvery Hospital Alwarpet",
        tierLabel: "STRONG ALTERNATIVE",
        tierRank: 2,
        status: "green",
        baseCoveragePct: 82,
        distKm: 3.8,
        estTimeMin: 10,
        address: "199 Luz Church Rd, Alwarpet",
        contact: "+91 44 4000 6000",
        location: { lat: 13.0335, lng: 80.2515 },
        traumaTier: "Level 2",
        availableIcuBeds: 7,
        ventilatorAvailable: 3,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: true, cardiac_cath: true },
        corridor: "Via TTK Road South Corridor",
        rankingReason: "Comprehensive 24/7 diagnostic CT imaging and dedicated cardiology/stroke emergency bays."
      },
      {
        id: "hosp-sou-3",
        name: "Adyar Specialty Clinic & Triage Ward",
        tierLabel: "LIMITED OPTION",
        tierRank: 3,
        status: "yellow",
        baseCoveragePct: 60,
        distKm: 4.9,
        estTimeMin: 18,
        address: "Canal Bank Rd, Gandhi Nagar",
        contact: "+91 44 2491 1526",
        location: { lat: 13.0012, lng: 80.2520 },
        traumaTier: "Level 2",
        availableIcuBeds: 2,
        ventilatorAvailable: 1,
        bloodAvailable: false, // Blood bank unstocked
        traumaReady: true,
        surgeryReady: false, // No multi-trauma surgery
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: false, surgery: false, dialysis: true, ct_scan: true, cardiac_cath: false },
        corridor: "Via Adyar Bridge Link Road",
        rankingReason: "Equipped for stabilization and dialysis, but lacks emergency surgical suites and universal O- blood reserves."
      },
      {
        id: "hosp-sou-4",
        name: "Besant Nagar Community Dispensary",
        tierLabel: "CRITICAL DEFICIT",
        tierRank: 4,
        status: "red",
        baseCoveragePct: 31,
        distKm: 6.1,
        estTimeMin: 26,
        address: "Beach Rd, Besant Nagar",
        contact: "+91 44 2490 8810",
        location: { lat: 12.9980, lng: 80.2680 },
        traumaTier: "Level 3",
        availableIcuBeds: 0,
        ventilatorAvailable: 0,
        bloodAvailable: false,
        traumaReady: false,
        surgeryReady: false,
        ambulanceReady: false,
        capabilities: { emergency: true, icu: false, trauma: false, surgery: false, dialysis: false, ct_scan: false, cardiac_cath: false },
        corridor: "Via Elliot's Beach Promenade",
        rankingReason: "Outpatient primary clinic with 0 ICU capacity and no emergency blood handling capability."
      }
    ]
  },
  {
    id: "zone-west",
    name: "West Suburban Belt (Porur - Valasaravakkam)",
    code: "Z-103",
    status: "limited",
    center: { lat: 13.0480, lng: 80.1650 },
    simulatedOrigin: {
      name: "Porur Junction & Trunk Interchange",
      location: { lat: 13.0380, lng: 80.1580 }
    },
    hospitals: [
      {
        id: "hosp-wes-1",
        name: "Sri Ramachandra Medical Centre (SRMC)",
        tierLabel: "TOP MATCH",
        tierRank: 1,
        status: "green",
        baseCoveragePct: 89,
        distKm: 2.4,
        estTimeMin: 7,
        address: "No.1 Ramachandra Nagar, Porur",
        contact: "+91 44 4592 8500",
        location: { lat: 13.0382, lng: 80.1412 },
        traumaTier: "Level 1",
        availableIcuBeds: 16,
        ventilatorAvailable: 7,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: true, cardiac_cath: true },
        corridor: "Via Mount-Poonamallee Main Trunk",
        rankingReason: "Premier tertiary academic trauma centre with integrated regional blood bank and open neurotrauma suites."
      },
      {
        id: "hosp-wes-2",
        name: "MIOT International Trauma Hub",
        tierLabel: "STRONG ALTERNATIVE",
        tierRank: 2,
        status: "green",
        baseCoveragePct: 79,
        distKm: 4.3,
        estTimeMin: 12,
        address: "4/112 Mount Poonamallee Rd, Manapakkam",
        contact: "+91 44 4200 2288",
        location: { lat: 13.0225, lng: 80.1772 },
        traumaTier: "Level 1",
        availableIcuBeds: 8,
        ventilatorAvailable: 3,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: true, cardiac_cath: true },
        corridor: "Via Manapakkam Link Road",
        rankingReason: "Dedicated emergency polytrauma surgery bays and high-volume critical care transport links."
      },
      {
        id: "hosp-wes-3",
        name: "West Suburban Community Care Hospital",
        tierLabel: "LIMITED OPTION",
        tierRank: 3,
        status: "yellow",
        baseCoveragePct: 58,
        distKm: 6.7,
        estTimeMin: 21,
        address: "Poonamallee High Rd, Porur",
        contact: "+91 44 2476 8000",
        location: { lat: 13.0512, lng: 80.1588 },
        traumaTier: "Level 3",
        availableIcuBeds: 2,
        ventilatorAvailable: 1,
        bloodAvailable: false, // Frequent O- stockout
        traumaReady: false,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: false, surgery: true, dialysis: true, ct_scan: false, cardiac_cath: false },
        corridor: "Via Arcot Road Arterial",
        rankingReason: "Secondary hospital experiencing recurrent O- blood stockouts and lacking operational 24/7 stat CT imaging."
      },
      {
        id: "hosp-wes-4",
        name: "Valasaravakkam Local Care Clinic",
        tierLabel: "CRITICAL DEFICIT",
        tierRank: 4,
        status: "red",
        baseCoveragePct: 29,
        distKm: 7.8,
        estTimeMin: 32,
        address: "Arcot Rd, Valasaravakkam",
        contact: "+91 44 2486 1120",
        location: { lat: 13.0410, lng: 80.1750 },
        traumaTier: "Level 3",
        availableIcuBeds: 0,
        ventilatorAvailable: 0,
        bloodAvailable: false,
        traumaReady: false,
        surgeryReady: false,
        ambulanceReady: false,
        capabilities: { emergency: true, icu: false, trauma: false, surgery: false, dialysis: false, ct_scan: false, cardiac_cath: false },
        corridor: "Via Valasaravakkam Bypass",
        rankingReason: "Daytime clinical station only; zero ICU beds and no emergency surgical resuscitation capability."
      }
    ]
  },
  {
    id: "zone-east",
    name: "East Industrial & Coastal Corridor",
    code: "Z-104",
    status: "dead_zone",
    center: { lat: 13.1350, lng: 80.3000 },
    simulatedOrigin: {
      name: "Ennore Expressway Industrial Gate",
      location: { lat: 13.1400, lng: 80.3050 }
    },
    hospitals: [
      {
        id: "hosp-eas-1",
        name: "Port Trust Emergency Resuscitation Unit",
        tierLabel: "TOP MATCH",
        tierRank: 1,
        status: "green",
        baseCoveragePct: 76,
        distKm: 3.2,
        estTimeMin: 9,
        address: "Rajaji Salai, Port Area",
        contact: "+91 44 2536 2201",
        location: { lat: 13.0980, lng: 80.2980 },
        traumaTier: "Level 2",
        availableIcuBeds: 6,
        ventilatorAvailable: 3,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: false, ct_scan: true, cardiac_cath: false },
        corridor: "Via Ennore Expressway Southbound",
        rankingReason: "Best local option for industrial crush injury triage with dedicated occupational trauma stabilization."
      },
      {
        id: "hosp-eas-2",
        name: "Tiruvottiyur Government Peripheral Hospital",
        tierLabel: "STRONG ALTERNATIVE",
        tierRank: 2,
        status: "green",
        baseCoveragePct: 71,
        distKm: 5.1,
        estTimeMin: 14,
        address: "TH Road, Tiruvottiyur",
        contact: "+91 44 2573 1122",
        location: { lat: 13.1610, lng: 80.3020 },
        traumaTier: "Level 2",
        availableIcuBeds: 4,
        ventilatorAvailable: 2,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: false,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: false, cardiac_cath: false },
        corridor: "Via Tiruvottiyur High Road",
        rankingReason: "Public sector trauma unit with essential surgical readiness, but reliant on central ambulance dispatch."
      },
      {
        id: "hosp-eas-3",
        name: "Manali Petrochemical First-Aid Station",
        tierLabel: "LIMITED OPTION",
        tierRank: 3,
        status: "yellow",
        baseCoveragePct: 54,
        distKm: 7.6,
        estTimeMin: 22,
        address: "Expressway Phase 2, Manali",
        contact: "+91 44 2594 1055",
        location: { lat: 13.1680, lng: 80.2650 },
        traumaTier: "Level 3",
        availableIcuBeds: 2,
        ventilatorAvailable: 1,
        bloodAvailable: false, // No blood storage license
        traumaReady: true,
        surgeryReady: false,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: false, dialysis: false, ct_scan: false, cardiac_cath: false },
        corridor: "Via Manali Petro Corridor",
        rankingReason: "Capable of basic wound management, but lacks surgical capability and requires blood dispatch from 28 km away."
      },
      {
        id: "hosp-eas-4",
        name: "East Coast Primary Triage Centre",
        tierLabel: "CRITICAL DEFICIT",
        tierRank: 4,
        status: "red",
        baseCoveragePct: 27,
        distKm: 12.4,
        estTimeMin: 36,
        address: "Ennore Coastal Belt, Ernavoor",
        contact: "+91 44 2575 0090",
        location: { lat: 13.1290, lng: 80.3015 },
        traumaTier: "Level 3",
        availableIcuBeds: 0,
        ventilatorAvailable: 0,
        bloodAvailable: false,
        traumaReady: false,
        surgeryReady: false,
        ambulanceReady: false,
        capabilities: { emergency: true, icu: false, trauma: false, surgery: false, dialysis: false, ct_scan: false, cardiac_cath: false },
        corridor: "Via Coastal Freight Highway",
        rankingReason: "Severe transit breach (>35m); 0 ICU beds, no surgery, completely separated from blood inventory."
      }
    ]
  },
  {
    id: "zone-north",
    name: "North Logistics & Industrial Zone",
    code: "Z-105",
    status: "dead_zone",
    center: { lat: 13.1750, lng: 80.2150 },
    simulatedOrigin: {
      name: "Madhavaram Roundabout & Truck Terminal",
      location: { lat: 13.1680, lng: 80.2100 }
    },
    hospitals: [
      {
        id: "hosp-nor-1",
        name: "Madhavaram Multi-Speciality Trauma Care",
        tierLabel: "TOP MATCH",
        tierRank: 1,
        status: "green",
        baseCoveragePct: 78,
        distKm: 2.9,
        estTimeMin: 8,
        address: "GNT Road, Madhavaram",
        contact: "+91 44 2553 4400",
        location: { lat: 13.1550, lng: 80.2290 },
        traumaTier: "Level 2",
        availableIcuBeds: 6,
        ventilatorAvailable: 3,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: true, cardiac_cath: false },
        corridor: "Via Grand Northern Trunk Road",
        rankingReason: "Best rapid access along the freight artery with active surgical unit and staffed diagnostic CT."
      },
      {
        id: "hosp-nor-2",
        name: "Red Hills Emergency Transit Hospital",
        tierLabel: "STRONG ALTERNATIVE",
        tierRank: 2,
        status: "green",
        baseCoveragePct: 72,
        distKm: 4.8,
        estTimeMin: 13,
        address: "NH 16 Bypass, Red Hills",
        contact: "+91 44 2631 8890",
        location: { lat: 13.1920, lng: 80.1980 },
        traumaTier: "Level 2",
        availableIcuBeds: 5,
        ventilatorAvailable: 2,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: false,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: false, ct_scan: false, cardiac_cath: false },
        corridor: "Via Kolkata Highway Corridor",
        rankingReason: "Reliable highway emergency bay with good ICU capacity, though lacking on-site cardiac catheterization."
      },
      {
        id: "hosp-nor-3",
        name: "Puzhal Highway Emergency Post",
        tierLabel: "LIMITED OPTION",
        tierRank: 3,
        status: "yellow",
        baseCoveragePct: 57,
        distKm: 7.2,
        estTimeMin: 23,
        address: "Jail Rd, Puzhal",
        contact: "+91 44 2659 0112",
        location: { lat: 13.1780, lng: 80.1950 },
        traumaTier: "Level 3",
        availableIcuBeds: 2,
        ventilatorAvailable: 1,
        bloodAvailable: false, // Blood bank delay
        traumaReady: true,
        surgeryReady: false,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: false, dialysis: false, ct_scan: false, cardiac_cath: false },
        corridor: "Via Puzhal Bypass Link",
        rankingReason: "Single BLS transport vehicle stationed locally; blood supply must be fetched from central hospitals."
      },
      {
        id: "hosp-nor-4",
        name: "Logistics Sector Health Post",
        tierLabel: "CRITICAL DEFICIT",
        tierRank: 4,
        status: "red",
        baseCoveragePct: 33,
        distKm: 14.1,
        estTimeMin: 38,
        address: "Freight Ring Rd, Red Hills North",
        contact: "+91 44 2632 7710",
        location: { lat: 13.2100, lng: 80.1820 },
        traumaTier: "Level 3",
        availableIcuBeds: 0,
        ventilatorAvailable: 0,
        bloodAvailable: false,
        traumaReady: false,
        surgeryReady: false,
        ambulanceReady: false,
        capabilities: { emergency: true, icu: false, trauma: false, surgery: false, dialysis: false, ct_scan: false, cardiac_cath: false },
        corridor: "Via Outer Industrial Ring Road",
        rankingReason: "Severe transit delay exceeding 30-minute limit; 0 ICU beds and zero stat trauma resuscitation capability."
      }
    ]
  },
  {
    id: "zone-southwest",
    name: "South-West Growth Corridor (Tambaram - Chromepet)",
    code: "Z-106",
    status: "covered",
    center: { lat: 12.9300, lng: 80.1400 },
    simulatedOrigin: {
      name: "Tambaram Sanatorium Signal",
      location: { lat: 12.9350, lng: 80.1380 }
    },
    hospitals: [
      {
        id: "hosp-sw-1",
        name: "Dr. Rela Institute & Medical Centre",
        tierLabel: "TOP MATCH",
        tierRank: 1,
        status: "green",
        baseCoveragePct: 93,
        distKm: 1.9,
        estTimeMin: 6,
        address: "7 CLC Works Rd, Chromepet",
        contact: "+91 44 6666 7777",
        location: { lat: 12.9515, lng: 80.1432 },
        traumaTier: "Level 1",
        availableIcuBeds: 22,
        ventilatorAvailable: 10,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: true, cardiac_cath: true },
        corridor: "Via GST Road Flyover Expressway",
        rankingReason: "World-class quaternary trauma hub with 20+ open ICU beds and fully integrated round-the-clock blood bank."
      },
      {
        id: "hosp-sw-2",
        name: "Chromepet Government Hospital",
        tierLabel: "STRONG ALTERNATIVE",
        tierRank: 2,
        status: "green",
        baseCoveragePct: 77,
        distKm: 3.6,
        estTimeMin: 11,
        address: "GST Rd, Chromepet",
        contact: "+91 44 2238 2341",
        location: { lat: 12.9530, lng: 80.1400 },
        traumaTier: "Level 2",
        availableIcuBeds: 6,
        ventilatorAvailable: 3,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: true, cardiac_cath: false },
        corridor: "Via GST Road Arterial",
        rankingReason: "Public trauma centre with strong emergency triage capacity and rapid ambulance turnout."
      },
      {
        id: "hosp-sw-3",
        name: "Hindu Mission Hospital Tambaram",
        tierLabel: "LIMITED OPTION",
        tierRank: 3,
        status: "yellow",
        baseCoveragePct: 64,
        distKm: 5.4,
        estTimeMin: 19,
        address: "103 GST Rd, Tambaram West",
        contact: "+91 44 2226 2244",
        location: { lat: 12.9240, lng: 80.1200 },
        traumaTier: "Level 2",
        availableIcuBeds: 2,
        ventilatorAvailable: 1,
        bloodAvailable: false, // Blood supply constrained during peak
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: false,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: false, cardiac_cath: false },
        corridor: "Via Mudichur Main Road",
        rankingReason: "Reliable surgical hospital, but high bed occupancy has constrained ICU readiness and blood reserves."
      },
      {
        id: "hosp-sw-4",
        name: "Mudichur Primary Health Centre",
        tierLabel: "CRITICAL DEFICIT",
        tierRank: 4,
        status: "red",
        baseCoveragePct: 32,
        distKm: 8.2,
        estTimeMin: 30,
        address: "Old State Bank Rd, Mudichur",
        contact: "+91 44 2276 0199",
        location: { lat: 12.9050, lng: 80.0980 },
        traumaTier: "Level 3",
        availableIcuBeds: 0,
        ventilatorAvailable: 0,
        bloodAvailable: false,
        traumaReady: false,
        surgeryReady: false,
        ambulanceReady: false,
        capabilities: { emergency: true, icu: false, trauma: false, surgery: false, dialysis: false, ct_scan: false, cardiac_cath: false },
        corridor: "Via Mudichur-Tambaram Connector",
        rankingReason: "Outpatient primary clinic only; lacks emergency resuscitation bay and surgical care."
      }
    ]
  },
  {
    id: "zone-coastal",
    name: "Coastal Emergency Belt (Besant Nagar - ECR)",
    code: "Z-107",
    status: "limited",
    center: { lat: 12.9800, lng: 80.2650 },
    simulatedOrigin: {
      name: "Thiruvanmiyur Junction Signal",
      location: { lat: 12.9830, lng: 80.2600 }
    },
    hospitals: [
      {
        id: "hosp-coa-1",
        name: "Apollo Speciality Hospitals OMR",
        tierLabel: "TOP MATCH",
        tierRank: 1,
        status: "green",
        baseCoveragePct: 90,
        distKm: 2.5,
        estTimeMin: 7,
        address: "05/639 Old Mahabalipuram Rd, Perungudi",
        contact: "+91 44 3322 1111",
        location: { lat: 12.9680, lng: 80.2450 },
        traumaTier: "Level 1",
        availableIcuBeds: 12,
        ventilatorAvailable: 6,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: true, cardiac_cath: true },
        corridor: "Via Rajiv Gandhi IT Expressway",
        rankingReason: "Modern tertiary hospital on expressway with rapid ambulance access and stocked blood inventory."
      },
      {
        id: "hosp-coa-2",
        name: "Dr. Kamakshi Memorial Hospital Pallikaranai",
        tierLabel: "STRONG ALTERNATIVE",
        tierRank: 2,
        status: "green",
        baseCoveragePct: 80,
        distKm: 4.1,
        estTimeMin: 12,
        address: "1 Radial Rd, Dandeeswarar Nagar",
        contact: "+91 44 6630 0300",
        location: { lat: 12.9420, lng: 80.2080 },
        traumaTier: "Level 1",
        availableIcuBeds: 8,
        ventilatorAvailable: 4,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: true, cardiac_cath: true },
        corridor: "Via 200 Feet Radial Arterial Road",
        rankingReason: "Advanced trauma resuscitation with 24/7 dedicated neuro-imaging and cardiac catheterization suites."
      },
      {
        id: "hosp-coa-3",
        name: "Neelankarai Beach Road Emergency Clinic",
        tierLabel: "LIMITED OPTION",
        tierRank: 3,
        status: "yellow",
        baseCoveragePct: 55,
        distKm: 6.9,
        estTimeMin: 20,
        address: "East Coast Rd, Neelankarai",
        contact: "+91 44 2449 3300",
        location: { lat: 12.9480, lng: 80.2580 },
        traumaTier: "Level 2",
        availableIcuBeds: 2,
        ventilatorAvailable: 1,
        bloodAvailable: false, // Blood bank limited
        traumaReady: true,
        surgeryReady: false,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: false, dialysis: false, ct_scan: false, cardiac_cath: false },
        corridor: "Via East Coast Scenic Corridor",
        rankingReason: "Good for initial resuscitation, but lacks major surgical theater and specialized blood storage."
      },
      {
        id: "hosp-coa-4",
        name: "Thiruvanmiyur First-Contact Dispensary",
        tierLabel: "CRITICAL DEFICIT",
        tierRank: 4,
        status: "red",
        baseCoveragePct: 28,
        distKm: 9.4,
        estTimeMin: 33,
        address: "Lattice Bridge Rd, Thiruvanmiyur",
        contact: "+91 44 2441 5560",
        location: { lat: 12.9810, lng: 80.2540 },
        traumaTier: "Level 3",
        availableIcuBeds: 0,
        ventilatorAvailable: 0,
        bloodAvailable: false,
        traumaReady: false,
        surgeryReady: false,
        ambulanceReady: false,
        capabilities: { emergency: true, icu: false, trauma: false, surgery: false, dialysis: false, ct_scan: false, cardiac_cath: false },
        corridor: "Via LB Road Urban Arterial",
        rankingReason: "Local dispensary with no overnight ICU facilities or emergency surgical capabilities."
      }
    ]
  },
  {
    id: "zone-highway",
    name: "West Industrial Highway Belt (Poonamallee - Sriperumbudur)",
    code: "Z-108",
    status: "dead_zone",
    center: { lat: 13.0300, lng: 80.0500 },
    simulatedOrigin: {
      name: "Poonamallee Bypass Flyover",
      location: { lat: 13.0400, lng: 80.0800 }
    },
    hospitals: [
      {
        id: "hosp-hw-1",
        name: "Saveetha Medical College & Super Speciality Hospital",
        tierLabel: "TOP MATCH",
        tierRank: 1,
        status: "green",
        baseCoveragePct: 87,
        distKm: 2.8,
        estTimeMin: 8,
        address: "Saveetha Nagar, Thandalam",
        contact: "+91 44 2681 1172",
        location: { lat: 13.0280, lng: 80.0210 },
        traumaTier: "Level 1",
        availableIcuBeds: 18,
        ventilatorAvailable: 8,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: true, cardiac_cath: true },
        corridor: "Via Bangalore Highway NH 48",
        rankingReason: "Major tertiary academic hospital directly on the highway corridor with dedicated industrial trauma bay."
      },
      {
        id: "hosp-hw-2",
        name: "Panimalar Hospital & Trauma Centre",
        tierLabel: "STRONG ALTERNATIVE",
        tierRank: 2,
        status: "green",
        baseCoveragePct: 75,
        distKm: 4.9,
        estTimeMin: 13,
        address: "Bangalore Trunk Rd, Varadharajapuram",
        contact: "+91 44 2649 0505",
        location: { lat: 13.0490, lng: 80.0610 },
        traumaTier: "Level 2",
        availableIcuBeds: 7,
        ventilatorAvailable: 3,
        bloodAvailable: true,
        traumaReady: true,
        surgeryReady: true,
        ambulanceReady: false,
        capabilities: { emergency: true, icu: true, trauma: true, surgery: true, dialysis: true, ct_scan: true, cardiac_cath: false },
        corridor: "Via Poonamallee Arterial Trunk",
        rankingReason: "Robust emergency surgery and inpatient critical care with 24/7 emergency diagnostic support."
      },
      {
        id: "hosp-hw-3",
        name: "Poonamallee Urban Primary Health Post",
        tierLabel: "LIMITED OPTION",
        tierRank: 3,
        status: "yellow",
        baseCoveragePct: 52,
        distKm: 8.3,
        estTimeMin: 24,
        address: "Trunk Rd, Poonamallee Town",
        contact: "+91 44 2627 2200",
        location: { lat: 13.0480, lng: 80.1100 },
        traumaTier: "Level 3",
        availableIcuBeds: 1,
        ventilatorAvailable: 1,
        bloodAvailable: false, // Frequent stockouts
        traumaReady: false,
        surgeryReady: true,
        ambulanceReady: true,
        capabilities: { emergency: true, icu: true, trauma: false, surgery: true, dialysis: false, ct_scan: false, cardiac_cath: false },
        corridor: "Via Poonamallee Old Trunk Road",
        rankingReason: "Basic emergency stabilization with 1 ventilator, but lacks multi-trauma bay and blood reserves."
      },
      {
        id: "hosp-hw-4",
        name: "Irungattukottai Industrial First-Aid Post",
        tierLabel: "CRITICAL DEFICIT",
        tierRank: 4,
        status: "red",
        baseCoveragePct: 25,
        distKm: 15.2,
        estTimeMin: 39,
        address: "SIPCOT Industrial Park, Sriperumbudur",
        contact: "+91 44 2715 6001",
        location: { lat: 12.9850, lng: 79.9750 },
        traumaTier: "Level 3",
        availableIcuBeds: 0,
        ventilatorAvailable: 0,
        bloodAvailable: false,
        traumaReady: false,
        surgeryReady: false,
        ambulanceReady: false,
        capabilities: { emergency: true, icu: false, trauma: false, surgery: false, dialysis: false, ct_scan: false, cardiac_cath: false },
        corridor: "Via SIPCOT Internal Logistics Way",
        rankingReason: "Factory first-aid room only; zero ICU beds and 39-minute transit to the nearest surgical facility."
      }
    ]
  }
];

// Helper to retrieve the 4 ranked hospitals for a specific region and medical need
// Strictly guarantees the required hackathon demo distribution: 2 GREEN, 1 YELLOW, 1 RED
export function getRankedHospitalsForRegion(sectorId, needId = 'severe_bleeding') {
  const sector = REGIONAL_SECTORS.find(s => s.id === sectorId) || REGIONAL_SECTORS[0];
  
  return sector.hospitals.map((h, idx) => {
    let score = h.baseCoveragePct;
    let missingReason = null;
    let hasCapability = true;

    // Condition-specific capability matching
    if (needId === 'severe_bleeding') {
      if (!h.bloodAvailable) {
        missingReason = "Blood Availability Limited (O- Stockout)";
        hasCapability = false;
      }
      if (!h.capabilities.surgery || !h.capabilities.trauma) {
        missingReason = "No Trauma / Vascular Surgery";
        hasCapability = false;
      }
    } else if (needId === 'stroke') {
      if (!h.capabilities.ct_scan) {
        missingReason = "No Operational 24/7 CT Scan";
        hasCapability = false;
      }
      if (!h.capabilities.icu) {
        missingReason = "No Critical Care Stroke Bed";
        hasCapability = false;
      }
    } else if (needId === 'trauma') {
      if (!h.capabilities.trauma || !h.capabilities.icu) {
        missingReason = "Lacks Level-1 Trauma Bay & ICU";
        hasCapability = false;
      }
    } else if (needId === 'dialysis') {
      if (!h.capabilities.dialysis) {
        missingReason = "No Hemodialysis Station Available";
        hasCapability = false;
      }
    }

    // Ensure strict 2 GREEN + 1 YELLOW + 1 RED distribution for the hackathon demo
    let displayStatus = 'green';
    let effectiveScore = score;

    if (idx === 0) {
      // Hospital #1: Always Top Match Green (>= 70%)
      displayStatus = 'green';
      effectiveScore = Math.max(88, Math.min(95, h.baseCoveragePct));
    } else if (idx === 1) {
      // Hospital #2: Always Strong Alternative Green (>= 70%)
      displayStatus = 'green';
      effectiveScore = Math.max(74, Math.min(84, h.baseCoveragePct));
    } else if (idx === 2) {
      // Hospital #3: Always Limited Option Yellow (50 - 69%)
      displayStatus = 'yellow';
      effectiveScore = Math.max(54, Math.min(66, h.baseCoveragePct));
      if (!missingReason) {
        missingReason = "Transit delays during peak hours / blood reserves restricted";
      }
    } else {
      // Hospital #4: Always Critical Deficit Red (< 50%)
      displayStatus = 'red';
      effectiveScore = Math.max(24, Math.min(42, h.baseCoveragePct));
      if (!missingReason) {
        missingReason = "Lacks emergency surgical suite & 0 available ICU beds";
      }
    }

    return {
      ...h,
      effectiveScore,
      displayStatus,
      missingReason,
      hasCapability,
      origin: sector.simulatedOrigin
    };
  });
}
