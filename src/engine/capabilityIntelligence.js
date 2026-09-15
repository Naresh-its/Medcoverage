/**
 * MedCoverage — Hospital Capability & Availability Intelligence Layer
 *
 * Grounded in the MedCoverage Intelligence Engine:
 * Matches: Medical Need -> Required Capabilities -> Hospital Capabilities -> Accessibility -> Recommendation.
 * 
 * Provides deterministic facility capability profiles, care pathways,
 * resource availability states, specialist coverage data fields, and data provenance indicators.
 */

import { MEDICAL_NEEDS } from '../data/medicalNeeds.js';

// Care Pathway definitions per medical emergency
const CARE_PATHWAYS = {
  severe_bleeding: [
    { id: 'stabilization', label: 'Emergency Stabilization', reqKey: 'emergency' },
    { id: 'hemorrhage', label: 'Hemorrhage Control', reqKey: 'trauma' },
    { id: 'blood', label: 'Blood Availability (O- / Matched)', reqKey: 'blood' },
    { id: 'surgery', label: 'Surgical Haemostasis Support', reqKey: 'surgery' },
    { id: 'icu', label: 'Post-Op ICU Readiness', reqKey: 'icu' },
  ],
  stroke: [
    { id: 'triage', label: 'Rapid Neurological Triage', reqKey: 'emergency' },
    { id: 'ct_scan', label: '24/7 Rapid CT / MRI Imaging', reqKey: 'ct_scan' },
    { id: 'specialist', label: 'Stroke Specialist Assessment', reqKey: 'neurology' },
    { id: 'icu', label: 'Neuro-ICU Critical Care Bed', reqKey: 'icu' },
    { id: 'transport', label: 'ALS Ambulance Transport', reqKey: 'ambulance' },
  ],
  trauma: [
    { id: 'extraction', label: 'Field ALS Extraction', reqKey: 'ambulance' },
    { id: 'trauma_bay', label: 'Level 1/2 Trauma Bay Resuscitation', reqKey: 'trauma' },
    { id: 'surgery', label: 'Multi-Specialty Emergency Surgery', reqKey: 'surgery' },
    { id: 'blood', label: 'Massive Transfusion Blood Bank', reqKey: 'blood' },
    { id: 'icu', label: 'Post-Op ICU & Ventilator Readiness', reqKey: 'icu' },
  ],
  dialysis: [
    { id: 'stabilization', label: 'Emergency Electrolyte Stabilization', reqKey: 'emergency' },
    { id: 'nephrology', label: 'Nephrology Clinical Review', reqKey: 'nephrology' },
    { id: 'station', label: 'Operational Hemodialysis Station', reqKey: 'dialysis' },
    { id: 'monitoring', label: 'Continuous Cardiac & Fluid Monitoring', reqKey: 'icu' },
  ],
  emergency: [
    { id: 'triage', label: 'Emergency Department Triage', reqKey: 'emergency' },
    { id: 'airway', label: 'Airway & Cardiac Resuscitation', reqKey: 'emergency' },
    { id: 'icu', label: 'ICU Step-Down Readiness', reqKey: 'icu' },
    { id: 'ambulance', label: 'Regional ALS Ambulance Dispatch', reqKey: 'ambulance' },
  ],
  diagnostics: [
    { id: 'triage', label: 'Emergency Clinical Workup', reqKey: 'emergency' },
    { id: 'ct_imaging', label: 'Emergency 128-Slice CT Imaging', reqKey: 'ct_scan' },
    { id: 'lab', label: 'Stat Biomarker & Cardiac Lab', reqKey: 'emergency' },
    { id: 'radiologist', label: 'Radiology Diagnostic Review', reqKey: 'emergency' },
  ]
};

// Emergency-specific capability requirements
const NEED_CAPABILITIES_CONFIG = {
  severe_bleeding: [
    { key: 'emergency', label: 'Emergency Department', check: (h) => h.capabilities?.emergency !== false },
    { key: 'trauma', label: 'Trauma Care', check: (h) => Boolean(h.traumaReady || h.capabilities?.trauma) },
    { key: 'blood', label: 'Blood Bank', check: (h) => Boolean(h.bloodAvailable) },
    { key: 'blood_o_neg', label: 'O− Blood Supply', check: (h) => Boolean(h.bloodAvailable) },
    { key: 'surgery', label: 'Vascular / General Surgery', check: (h) => Boolean(h.surgeryReady || h.capabilities?.surgery) },
    { key: 'icu', label: 'ICU Readiness', check: (h) => (h.availableIcuBeds || 0) > 0 },
    { key: 'ambulance', label: 'ALS Ambulance Support', check: (h) => h.status !== 'red' },
    { key: 'physician', label: 'Emergency Physician', check: () => true },
  ],
  stroke: [
    { key: 'emergency', label: 'Emergency Department', check: (h) => h.capabilities?.emergency !== false },
    { key: 'ct_scan', label: 'CT Imaging (24/7)', check: (h) => Boolean(h.capabilities?.ct_scan) },
    { key: 'stroke_care', label: 'Stroke Acute Care', check: (h) => Boolean(h.capabilities?.ct_scan && h.status !== 'red') },
    { key: 'neurology', label: 'Neurology Coverage', check: (h) => h.status !== 'red' },
    { key: 'icu', label: 'Neuro-ICU Readiness', check: (h) => (h.availableIcuBeds || 0) > 0 },
    { key: 'ambulance', label: 'ALS Ambulance Support', check: (h) => h.status !== 'red' },
  ],
  trauma: [
    { key: 'emergency', label: 'Emergency Department', check: (h) => h.capabilities?.emergency !== false },
    { key: 'trauma', label: 'Level 1/2 Trauma Bay', check: (h) => Boolean(h.traumaReady || h.capabilities?.trauma) },
    { key: 'surgery', label: 'Orthopedic / Trauma Surgery', check: (h) => Boolean(h.surgeryReady || h.capabilities?.surgery) },
    { key: 'blood', label: 'Blood Bank Support', check: (h) => Boolean(h.bloodAvailable) },
    { key: 'icu', label: 'ICU & Ventilators', check: (h) => (h.availableIcuBeds || 0) > 0 && (h.ventilatorAvailable || 0) > 0 },
    { key: 'ambulance', label: 'ALS Extraction Ambulance', check: (h) => h.status !== 'red' },
  ],
  dialysis: [
    { key: 'emergency', label: 'Emergency Department', check: (h) => h.capabilities?.emergency !== false },
    { key: 'dialysis', label: 'Hemodialysis Unit', check: (h) => Boolean(h.capabilities?.dialysis) },
    { key: 'renal_care', label: 'Renal Acute Care', check: (h) => Boolean(h.capabilities?.dialysis && h.status !== 'red') },
    { key: 'icu', label: 'ICU Resuscitation Readiness', check: (h) => (h.availableIcuBeds || 0) > 0 },
    { key: 'monitoring', label: 'Continuous Emergency Monitoring', check: (h) => h.capabilities?.emergency !== false },
  ],
  emergency: [
    { key: 'emergency', label: '24/7 Emergency Department', check: (h) => h.capabilities?.emergency !== false },
    { key: 'icu', label: 'ICU Capacity', check: (h) => (h.availableIcuBeds || 0) > 0 },
    { key: 'ambulance', label: 'Emergency Ambulance', check: (h) => h.status !== 'red' },
    { key: 'stat_lab', label: 'Stat Diagnostic Laboratory', check: (h) => h.capabilities?.emergency !== false },
    { key: 'physician', label: 'Emergency Physician', check: () => true },
  ],
  diagnostics: [
    { key: 'emergency', label: 'Emergency Department', check: (h) => h.capabilities?.emergency !== false },
    { key: 'ct_scan', label: '128-Slice CT / Imaging', check: (h) => Boolean(h.capabilities?.ct_scan) },
    { key: 'stat_lab', label: 'Stat Cardiac / Blood Biomarkers', check: (h) => h.capabilities?.emergency !== false },
    { key: 'ultrasound', label: 'Emergency FAST Ultrasound', check: (h) => h.status !== 'red' },
    { key: 'physician', label: 'Emergency Physician', check: () => true },
  ],
};

// Specialist coverage mapping per medical condition
const NEED_SPECIALISTS_CONFIG = {
  severe_bleeding: [
    { role: 'Emergency Physician', required: true, check: () => true },
    { role: 'Trauma / Vascular Surgeon', required: true, check: (h) => Boolean(h.surgeryReady || h.capabilities?.surgery) },
    { role: 'Transfusion Specialist', required: false, check: (h) => Boolean(h.bloodAvailable) },
  ],
  stroke: [
    { role: 'Emergency Physician', required: true, check: () => true },
    { role: 'Stroke Neurologist', required: true, check: (h) => h.status !== 'red' },
    { role: 'Interventional Radiologist', required: false, check: (h) => Boolean(h.capabilities?.ct_scan) },
  ],
  trauma: [
    { role: 'Emergency Physician', required: true, check: () => true },
    { role: 'Trauma Surgeon', required: true, check: (h) => Boolean(h.traumaReady || h.capabilities?.trauma) },
    { role: 'Critical Care Intensivist', required: true, check: (h) => (h.availableIcuBeds || 0) > 0 },
  ],
  dialysis: [
    { role: 'Emergency Physician', required: true, check: () => true },
    { role: 'Nephrologist', required: true, check: (h) => Boolean(h.capabilities?.dialysis) },
    { role: 'Dialysis Specialist Nurse', required: true, check: (h) => Boolean(h.capabilities?.dialysis) },
  ],
  emergency: [
    { role: 'Emergency Physician', required: true, check: () => true },
    { role: 'Critical Care Intensivist', required: true, check: (h) => (h.availableIcuBeds || 0) > 0 },
    { role: 'Triage Specialist', required: true, check: () => true },
  ],
  diagnostics: [
    { role: 'Emergency Physician', required: true, check: () => true },
    { role: 'Diagnostic Radiologist', required: true, check: (h) => Boolean(h.capabilities?.ct_scan) },
    { role: 'Emergency Pathologist', required: false, check: () => true },
  ],
};

/**
 * Computes the full explainable capability and availability intelligence profile
 * for a selected hospital and medical condition.
 */
export function getHospitalCapabilityProfile(hospital, needId = 'severe_bleeding') {
  if (!hospital) return null;

  const currentNeed = MEDICAL_NEEDS.find(n => n.id === needId) || MEDICAL_NEEDS[0];
  const goldenWindowMin = currentNeed.goldenWindowMin || 30;

  // 1. Care Pathway Satisfaction
  const pathwayConfig = CARE_PATHWAYS[needId] || CARE_PATHWAYS.severe_bleeding;
  const pathway = pathwayConfig.map(step => {
    let satisfied = true;
    let detail = 'Verified available';

    if (step.reqKey === 'blood') {
      satisfied = Boolean(hospital.bloodAvailable);
      detail = satisfied ? 'Universal O- stock available' : 'Stockout risk detected';
    } else if (step.reqKey === 'trauma') {
      satisfied = Boolean(hospital.traumaReady || hospital.capabilities?.trauma);
      detail = satisfied ? 'Trauma bay operational' : 'Lacks certified trauma bay';
    } else if (step.reqKey === 'surgery') {
      satisfied = Boolean(hospital.surgeryReady || hospital.capabilities?.surgery);
      detail = satisfied ? 'Vascular / surgical suite open' : 'No dedicated surgical suite';
    } else if (step.reqKey === 'icu') {
      satisfied = (hospital.availableIcuBeds || 0) > 0;
      detail = satisfied ? `${hospital.availableIcuBeds} beds available` : '0 ICU beds free';
    } else if (step.reqKey === 'ct_scan') {
      satisfied = Boolean(hospital.capabilities?.ct_scan);
      detail = satisfied ? 'Operational 24/7 CT scan' : 'No 24/7 CT imaging';
    } else if (step.reqKey === 'dialysis') {
      satisfied = Boolean(hospital.capabilities?.dialysis);
      detail = satisfied ? 'Active hemodialysis station' : 'No hemodialysis station';
    } else if (step.reqKey === 'ambulance') {
      satisfied = hospital.status !== 'red';
      detail = satisfied ? 'ALS ambulance unit in sector' : 'Limited regional ambulance';
    } else if (step.reqKey === 'neurology') {
      satisfied = hospital.status !== 'red' && Boolean(hospital.capabilities?.ct_scan);
      detail = satisfied ? 'Neurology coverage status: Active' : 'Limited neurology coverage';
    } else if (step.reqKey === 'nephrology') {
      satisfied = Boolean(hospital.capabilities?.dialysis);
      detail = satisfied ? 'Nephrologist on-call status' : 'No renal service';
    }

    return {
      id: step.id,
      label: step.label,
      satisfied,
      detail,
    };
  });

  // 2. Condition-Specific Care Capabilities
  const capConfig = NEED_CAPABILITIES_CONFIG[needId] || NEED_CAPABILITIES_CONFIG.severe_bleeding;
  const capabilities = capConfig.map(c => {
    const isAvail = c.check(hospital);
    return {
      key: c.key,
      label: c.label,
      available: isAvail,
      statusText: isAvail ? 'Available' : 'Unavailable',
    };
  });

  // 3. Resource Availability Statuses (Deterministic)
  const isIcuAvail = (hospital.availableIcuBeds || 0) > 0;
  const isBloodAvail = Boolean(hospital.bloodAvailable);
  const isSurgeryAvail = Boolean(hospital.surgeryReady || hospital.capabilities?.surgery);
  const isTraumaAvail = Boolean(hospital.traumaReady || hospital.capabilities?.trauma);
  const isAmbulanceAvail = hospital.status === 'green' ? 'Available' : hospital.status === 'yellow' ? 'Limited' : 'Limited';

  const availabilityItems = [
    {
      label: 'Emergency Department',
      status: hospital.capabilities?.emergency !== false ? 'AVAILABLE' : 'LIMITED',
      statusText: 'Available',
      badgeColor: 'green'
    },
    {
      label: 'ICU Capacity',
      status: isIcuAvail ? 'AVAILABLE' : 'UNAVAILABLE',
      statusText: isIcuAvail ? `${hospital.availableIcuBeds} Beds Available` : '0 Beds Available',
      badgeColor: isIcuAvail ? 'green' : 'red'
    },
    {
      label: 'Blood — O− Universal',
      status: isBloodAvail ? 'AVAILABLE' : 'UNAVAILABLE',
      statusText: isBloodAvail ? 'Available' : 'Stockout Risk',
      badgeColor: isBloodAvail ? 'green' : 'red'
    },
    {
      label: 'Surgical Suite',
      status: isSurgeryAvail ? 'AVAILABLE' : (hospital.status === 'red' ? 'UNAVAILABLE' : 'LIMITED'),
      statusText: isSurgeryAvail ? 'Available' : 'Limited',
      badgeColor: isSurgeryAvail ? 'green' : 'yellow'
    },
    {
      label: 'Trauma Bay',
      status: isTraumaAvail ? 'AVAILABLE' : 'LIMITED',
      statusText: isTraumaAvail ? 'Available' : 'Limited',
      badgeColor: isTraumaAvail ? 'green' : 'yellow'
    },
    {
      label: 'Ambulance Transport',
      status: isAmbulanceAvail === 'Available' ? 'AVAILABLE' : 'LIMITED',
      statusText: isAmbulanceAvail,
      badgeColor: isAmbulanceAvail === 'Available' ? 'green' : 'yellow'
    }
  ];

  // 4. Doctor / Specialist Availability Data Fields (Transparent demo representation)
  const specConfig = NEED_SPECIALISTS_CONFIG[needId] || NEED_SPECIALISTS_CONFIG.severe_bleeding;
  const specialists = specConfig.map(s => {
    const isAvail = s.check(hospital);
    return {
      role: s.role,
      required: s.required,
      status: isAvail ? 'Available' : 'Off-duty / Limited',
      statusLabel: isAvail ? '✓ Available status' : '⚠ Limited in dataset',
      isAvailable: isAvail
    };
  });

  // 5. Why This Hospital Explanation (Ground in actual engine output)
  const travelTime = hospital.estTimeMin || 10;
  const withinWindow = travelTime <= goldenWindowMin;
  
  const reasons = [];
  if (hospital.status === 'green') {
    reasons.push(`Directly satisfies all critical capabilities for ${currentNeed.name}`);
    if (hospital.bloodAvailable && (needId === 'severe_bleeding' || needId === 'trauma')) {
      reasons.push('Verified O− universal blood bank supply in dataset');
    }
    if (hospital.capabilities?.ct_scan && (needId === 'stroke' || needId === 'diagnostics')) {
      reasons.push('24/7 Rapid cross-sectional CT scanner operational');
    }
    if (hospital.capabilities?.dialysis && needId === 'dialysis') {
      reasons.push('Operational emergency hemodialysis station');
    }
    if (withinWindow) {
      reasons.push(`Estimated arrival (~${travelTime} min) well within ${goldenWindowMin} min accessibility window`);
    }
  } else if (hospital.status === 'yellow') {
    reasons.push(`Secondary alternative with partial resource match for ${currentNeed.name}`);
    if (hospital.missingReason) {
      reasons.push(`Notice: ${hospital.missingReason}`);
    }
    reasons.push(`Estimated transit: ~${travelTime} min`);
  } else {
    reasons.push(`Critical deficit for ${currentNeed.name}: not recommended as primary destination`);
    if (hospital.missingReason) {
      reasons.push(`Deficit: ${hospital.missingReason}`);
    }
  }

  // 6. Data Status / Trust Indicator
  const dataStatus = {
    facilityProfile: 'Structured facility profile',
    resourceAvailability: 'Latest available dataset',
    doctorAvailability: 'Availability status (Demo)',
    prototype: 'DEMO DATA',
    notice: 'Live availability would require hospital-side integration.'
  };

  return {
    hospital,
    need: currentNeed,
    goldenWindowMin,
    effectiveAccess: hospital.effectiveScore || hospital.baseCoveragePct || 90,
    effectiveAccessExplainer: 'Combines care capability, resource availability and estimated accessibility.',
    whyHeadline: hospital.status === 'green'
      ? 'Selected because it matches the required emergency capabilities and remains within the emergency accessibility window.'
      : hospital.status === 'yellow'
        ? 'Identified as a secondary backup option with moderate transit or partial resource constraints.'
        : 'Identified as having critical capability deficits for this specific emergency profile.',
    whyReasons: reasons.slice(0, 3),
    pathway,
    capabilities,
    availabilityItems,
    specialists,
    dataStatus,
  };
}
