// Medical Needs specification & requirements mapping

export const MEDICAL_NEEDS = [
  {
    id: "severe_bleeding",
    name: "Severe Bleeding",
    urgency: "CRITICAL",
    goldenWindowMin: 30,
    icon: "Droplets",
    description: "Massive hemorrhage from trauma, arterial rupture, or surgical complication requiring emergency blood transfusions and surgical haemostasis.",
    requiredResources: [
      { key: "blood", label: "Blood Bank (O- / Matched)", required: true, icon: "Droplet" },
      { key: "emergency", label: "Emergency Trauma Bay", required: true, icon: "Activity" },
      { key: "surgery", label: "Vascular / Trauma Surgery", required: true, icon: "Scissors" },
      { key: "ambulance", label: "ALS Ambulance (Oxygen/Fluid Resuscitation)", required: true, icon: "Ambulance" }
    ],
    bottleneckFactor: "Without immediate type-specific or universal O- blood and an open surgical suite, survival drops 10% every 15 minutes."
  },
  {
    id: "stroke",
    name: "Acute Stroke",
    urgency: "CRITICAL",
    goldenWindowMin: 45,
    icon: "Brain",
    description: "Acute ischemic or hemorrhagic cerebrovascular accident. Requires rapid non-contrast CT scan to administer thrombolysis (tPA) within the 3-4.5 hour window.",
    requiredResources: [
      { key: "emergency", label: "Emergency Room", required: true, icon: "Activity" },
      { key: "ct_scan", label: "24/7 Rapid CT / MRI Scan", required: true, icon: "ScanLine" },
      { key: "specialist", label: "Neurologist / Stroke Specialist", required: true, icon: "UserCheck" },
      { key: "ambulance", label: "ALS Transport with Telemetry", required: true, icon: "Ambulance" }
    ],
    bottleneckFactor: "A hospital without an operational CT scanner cannot differentiate ischemic from hemorrhagic stroke, making treatment dangerous."
  },
  {
    id: "trauma",
    name: "Severe Trauma",
    urgency: "CRITICAL",
    goldenWindowMin: 40,
    icon: "ShieldAlert",
    description: "High-impact motor vehicle collision or industrial accident with multiple injuries, fractures, and internal bleeding.",
    requiredResources: [
      { key: "trauma", label: "Level 1/2 Trauma Bay", required: true, icon: "AlertTriangle" },
      { key: "surgery", label: "General & Orthopedic Surgery", required: true, icon: "Scissors" },
      { key: "icu", label: "Available ICU Bed & Ventilator", required: true, icon: "Bed" },
      { key: "ambulance", label: "ALS Ambulance Extraction", required: true, icon: "Ambulance" }
    ],
    bottleneckFactor: "Requires multidisciplinary surgeon teams and post-op ICU bed readiness."
  },
  {
    id: "dialysis",
    name: "Urgent Dialysis",
    urgency: "HIGH",
    goldenWindowMin: 120,
    icon: "Filter",
    description: "End-Stage Renal Disease (ESRD) with fluid overload, acute pulmonary edema, or hyperkalemia requiring emergency hemodialysis.",
    requiredResources: [
      { key: "dialysis", label: "Operational Dialysis Station", required: true, icon: "Activity" },
      { key: "transport", label: "Dedicated Medical Transport", required: true, icon: "Truck" },
      { key: "emergency", label: "Nephrology Emergency Support", required: true, icon: "HeartHandshake" }
    ],
    bottleneckFactor: "General hospitals often lack sanitized dialysis slots or reverse-osmosis water plants during off-peak hours."
  },
  {
    id: "emergency",
    name: "General Emergency",
    urgency: "HIGH",
    goldenWindowMin: 30,
    icon: "HeartPulse",
    description: "Acute chest pain, severe asthma exacerbation, anaphylaxis, or acute poisoning requiring rapid stabilization.",
    requiredResources: [
      { key: "emergency", label: "24/7 Emergency Care", required: true, icon: "Activity" },
      { key: "icu", label: "ICU Resuscitation Capacity", required: true, icon: "Bed" },
      { key: "ambulance", label: "Emergency Ambulance Support", required: true, icon: "Ambulance" }
    ],
    bottleneckFactor: "Emergency department crowding and ambulance transfer turnaround times."
  },
  {
    id: "diagnostics",
    name: "Emergency Diagnostics",
    urgency: "STANDARD",
    goldenWindowMin: 60,
    icon: "Stethoscope",
    description: "Suspicion of pulmonary embolism, acute abdominal perforation, or aortic dissection requiring immediate cross-sectional imaging.",
    requiredResources: [
      { key: "ct_scan", label: "Emergency 128-Slice CT", required: true, icon: "ScanLine" },
      { key: "ultrasound", label: "FAST Emergency Ultrasound", required: true, icon: "Activity" },
      { key: "stat_lab", label: "Stat Blood & Cardiac Biomarkers", required: true, icon: "TestTube" }
    ],
    bottleneckFactor: "Diagnostics centers without on-duty radiologist reporting delay surgical decision-making."
  }
];