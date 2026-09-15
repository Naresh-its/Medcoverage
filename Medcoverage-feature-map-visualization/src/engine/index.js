const CATEGORY_LABELS = {
  hospitals: 'hospital',
  bloodBanks: 'blood bank',
  ambulances: 'ambulance',
  diagnostics: 'diagnostic centre',
  pharmacies: 'pharmacy',
};

const toNeed = (need) => typeof need === 'string' ? { id: need } : need;

const distanceKm = (from, to) => {
  if (!from || !to) return Infinity;
  const latDistance = (to.lat - from.lat) * 111;
  const lngDistance = (to.lng - from.lng) * 111 * Math.cos((from.lat * Math.PI) / 180);
  return Math.sqrt((latDistance ** 2) + (lngDistance ** 2));
};

const travelTimeMin = (distance, resource) => {
  const speed = resource?.avgSpeedKmh || 35;
  return Math.round((distance / speed) * 60 + 4);
};

const clinicalMatch = (resource, category, need) => {
  const capabilities = resource.capabilities || {};
  const modalities = resource.modalities || {};
  const hasONegative = (resource.inventory?.['O-'] || 0) > 0;
  const isALS = resource.type?.includes('ALS');

  switch (need.id) {
    case 'severe_bleeding':
      if (category === 'hospitals') return capabilities.emergency && capabilities.trauma && capabilities.surgery;
      if (category === 'bloodBanks') return hasONegative;
      if (category === 'ambulances') return Boolean(isALS);
      if (category === 'pharmacies') return Boolean(resource.traumaSuppliesStocked);
      return false;
    case 'stroke':
      if (category === 'hospitals') return capabilities.emergency && capabilities.ct_scan;
      if (category === 'diagnostics') return Boolean(modalities.ct_scan);
      if (category === 'ambulances') return Boolean(isALS);
      return false;
    case 'trauma':
      if (category === 'hospitals') return capabilities.trauma && capabilities.surgery && capabilities.icu;
      if (category === 'ambulances') return Boolean(isALS);
      if (category === 'bloodBanks') return hasONegative;
      return false;
    case 'dialysis':
      return category === 'hospitals' && Boolean(capabilities.dialysis);
    case 'emergency':
      if (category === 'hospitals') return capabilities.emergency && capabilities.icu;
      if (category === 'ambulances') return Boolean(isALS);
      return false;
    case 'diagnostics':
      if (category === 'diagnostics') return Boolean(modalities.ct_scan || modalities.stat_lab || modalities.ultrasound);
      if (category === 'hospitals') return Boolean(capabilities.ct_scan);
      return false;
    default:
      return Boolean(capabilities.emergency);
  }
};

export function matchResourceRequirement(resource, category, need, origin) {
  const resolvedNeed = toNeed(need);
  const distance = origin ? distanceKm(origin, resource.location) : 0;
  const responseMin = origin ? travelTimeMin(distance, resource) : 0;
  const qualified = clinicalMatch(resource, category, resolvedNeed);
  const withinWindow = !origin || responseMin <= (resolvedNeed.goldenWindowMin || 30);
  const label = CATEGORY_LABELS[category] || 'resource';

  return {
    qualified: qualified && withinWindow,
    clinicallyQualified: qualified,
    withinWindow,
    distanceKm: Number.isFinite(distance) ? Number(distance.toFixed(1)) : null,
    travelTimeMin: responseMin,
    reason: !qualified
      ? `Does not meet ${resolvedNeed.name || 'the active need'} requirements`
      : !withinWindow
      ? `${label} is ${Math.round(distance)} km away (${responseMin} min travel)`
      : `${label} meets ${resolvedNeed.name || 'the active need'} requirements within the golden window`,
    badges: qualified ? [withinWindow ? 'Engine qualified' : 'Beyond golden window'] : ['Requirement deficit'],
  };
}

const resourcesFor = (resources = {}, category) => resources[category] || [];

const requirementCategories = {
  blood: ['bloodBanks'],
  emergency: ['hospitals'],
  surgery: ['hospitals'],
  ambulance: ['ambulances'],
  trauma: ['hospitals'],
  ct_scan: ['hospitals', 'diagnostics'],
  specialist: ['hospitals'],
  icu: ['hospitals'],
  dialysis: ['hospitals'],
  transport: ['ambulances'],
  ultrasound: ['diagnostics'],
  stat_lab: ['diagnostics'],
};

export function calculateEffectiveCoverage(zone, need, resources = {}) {
  const resolvedNeed = toNeed(need);
  const required = resolvedNeed.requiredResources || [];
  const matches = required.map((requirement) => {
    const categories = requirementCategories[requirement.key] || [];
    const candidates = categories.flatMap((category) =>
      resourcesFor(resources, category).map((resource) => ({
        resource,
        result: matchResourceRequirement(resource, category, resolvedNeed, zone.center),
      }))
    );
    const best = candidates
      .filter(({ result }) => result.clinicallyQualified)
      .sort((a, b) => a.result.travelTimeMin - b.result.travelTimeMin)[0];
    return { requirement, best };
  });

  const satisfiedScore = matches.reduce((sum, { best }) => {
    if (!best?.result.qualified) return sum;
    const window = resolvedNeed.goldenWindowMin || 30;
    return sum + Math.max(0.25, 1 - (best.result.travelTimeMin / (window * 1.5)));
  }, 0);
  const effectiveCoveragePct = required.length
    ? Math.round((satisfiedScore / required.length) * 100)
    : 0;
  const responseValues = matches
    .map(({ best }) => best?.result.travelTimeMin)
    .filter((value) => Number.isFinite(value));
  const avgResponseMin = responseValues.length
    ? Math.round(responseValues.reduce((sum, value) => sum + value, 0) / responseValues.length)
    : zone.baselineMetrics.avgResponseMin;
  const bottlenecks = matches
    .filter(({ best }) => !best?.result.qualified)
    .map(({ requirement, best }) => ({
      key: requirement.key,
      title: best?.result.reason || `No ${requirement.label} within the ${resolvedNeed.goldenWindowMin || 30}-minute window`,
      severity: resolvedNeed.urgency === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      clinicalImpact: `${requirement.label} is unavailable for ${resolvedNeed.name}.`,
      keyFactor: requirement.label,
      metricValue: best?.result.distanceKm != null ? `${best.result.distanceKm} km` : 'Unavailable',
    }));

  return {
    effectiveCoveragePct,
    avgResponseMin,
    status: effectiveCoveragePct >= 70 ? 'covered' : effectiveCoveragePct >= 40 ? 'limited' : 'dead_zone',
    bottlenecks,
    primaryBottleneck: bottlenecks[0] || {
      title: 'All required resources reachable within the golden window',
      severity: 'NO ACTIVE BOTTLENECK',
      clinicalImpact: `${resolvedNeed.name} requirements are met for this zone.`,
      keyFactor: 'Clinical readiness',
      metricValue: `${effectiveCoveragePct}%`,
    },
  };
}

export function detectZoneBottlenecks(zone, need, resources) {
  return calculateEffectiveCoverage(zone, need, resources).bottlenecks;
}

export function simulateIntervention(zone, intervention, need, resources) {
  const before = calculateEffectiveCoverage(zone, need, resources);
  const boost = Math.min(100, before.effectiveCoveragePct + (intervention.quantity || 1) * 18);
  return {
    before,
    after: {
      ...before,
      effectiveCoveragePct: boost,
      coveragePct: boost,
      status: boost >= 70 ? 'covered' : boost >= 40 ? 'limited' : 'dead_zone',
      avgResponseMin: Math.max((need.goldenWindowMin || 30) - 1, before.avgResponseMin - (intervention.quantity || 1) * 6),
    },
  };
}
