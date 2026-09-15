/**
 * Mapbox Directions API Service for MedCoverage
 * Fetches real driving routes with traffic-awareness and alternative BACKUP ROUTE support.
 * Does NOT fake routes or invent geometry.
 */

function parseRoute(route, profile = 'driving') {
  if (!route || !route.geometry) return null;

  // Mapbox GeoJSON LineString is [[lng, lat], ...]
  // Leaflet L.polyline expects [[lat, lng], ...]
  const leafletCoordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

  // Extract road corridor sequence from leg steps
  const rawSteps = route.legs?.[0]?.steps || [];
  const roadNames = [];
  rawSteps.forEach((step) => {
    const name = step.name?.trim();
    if (name && name.length > 0 && roadNames[roadNames.length - 1] !== name) {
      roadNames.push(name);
    }
  });

  return {
    coordinates: leafletCoordinates,
    rawGeoJson: route.geometry,
    distanceMeters: route.distance,
    distanceKm: (route.distance / 1000).toFixed(1),
    durationSeconds: route.duration,
    durationMin: Math.max(1, Math.round(route.duration / 60)),
    roadNames,
    corridorSummary: roadNames.slice(0, 3).join(' ➔ ') || 'Arterial Link',
    trafficProfile: profile,
  };
}

export async function fetchMapboxDirections(origin, destination, options = {}) {
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  if (!token) {
    console.warn('[MapboxDirections] VITE_MAPBOX_ACCESS_TOKEN is missing in .env');
    return null;
  }

  const origLat = origin?.lat ?? (Array.isArray(origin) ? origin[0] : null);
  const origLng = origin?.lng ?? (Array.isArray(origin) ? origin[1] : null);
  const destLat = destination?.lat ?? (Array.isArray(destination) ? destination[0] : null);
  const destLng = destination?.lng ?? (Array.isArray(destination) ? destination[1] : null);

  if (origLat == null || origLng == null || destLat == null || destLng == null) {
    console.warn('[MapboxDirections] Invalid coordinates', { origin, destination });
    return null;
  }

  const coordinatesString = `${origLng},${origLat};${destLng},${destLat}`;
  
  // Prefer driving-traffic with alternatives=true for real congestion & alternative routes
  const profile = options.profile || 'mapbox/driving-traffic';
  const url = `https://api.mapbox.com/directions/v5/${profile}/${coordinatesString}?geometries=geojson&steps=true&alternatives=true&overview=full&access_token=${token}`;

  try {
    let response = await fetch(url);
    
    // Fallback to standard driving if driving-traffic is not supported in region
    if (!response.ok) {
      const fallbackUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?geometries=geojson&steps=true&alternatives=true&overview=full&access_token=${token}`;
      response = await fetch(fallbackUrl);
    }

    if (!response.ok) {
      console.warn(`[MapboxDirections] HTTP ${response.status} from Directions API`);
      return null;
    }

    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      console.warn('[MapboxDirections] No route returned:', data);
      return null;
    }

    // Parse Primary Route (Route 0)
    const primary = parseRoute(data.routes[0], profile);

    // Parse Backup Route (Route 1) if Mapbox returned a genuine alternative
    const hasAlternative = data.routes.length >= 2;
    const backup = hasAlternative ? parseRoute(data.routes[1], profile) : null;

    return {
      success: true,
      hasAlternative,
      primary,
      backup,
      unavailableReason: hasAlternative ? null : 'Alternative route unavailable for this journey.',
      
      // Backward-compatibility references mapping to primary route
      coordinates: primary.coordinates,
      rawGeoJson: primary.rawGeoJson,
      distanceMeters: primary.distanceMeters,
      distanceKm: primary.distanceKm,
      durationSeconds: primary.durationSeconds,
      durationMin: primary.durationMin,
      roadNames: primary.roadNames,
      corridorSummary: primary.corridorSummary,
      trafficProfile: primary.trafficProfile,
    };
  } catch (error) {
    console.error('[MapboxDirections] Error fetching directions:', error);
    return null;
  }
}
