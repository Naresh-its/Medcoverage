import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { COVERAGE_ZONES } from '../../data/coverageZones';
import { HOSPITALS, BLOOD_BANKS, AMBULANCES, DIAGNOSTICS, PHARMACIES } from '../../data/mockHealthcareData';
import { MEDICAL_NEEDS } from '../../data/medicalNeeds';
import { fetchMapboxDirections } from '../../services/mapboxDirections';
import { getHospitalCapabilityProfile } from '../../engine/capabilityIntelligence';
import MapLegend from './MapLegend';
import DeadZonePanel from './DeadZonePanel';
import ResourceDetailModal from './ResourceDetailModal';
import { 
  Search, MapPin, AlertTriangle, X, Loader2, 
  Navigation, Clock, Check, Bed, Phone, ArrowLeft, ArrowRight, ShieldCheck
} from 'lucide-react';

export default function CoverageMap({ 
  selectedNeedId = 'severe_bleeding', 
  selectedLocation = null,
  onSelectDeadZone, 
  onSimulateIntervention,
  activeSimulation,
  activeRoute = null,
  onClearRoute = null,
  onReturnToSearch = null,
  height = '100%'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);
  const userPinLayerRef = useRef(null);
  const routeLayerRef = useRef(null);

  // Read Mapbox public access token strictly from environment
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Route state (Primary + Backup Route support)
  const [routeData, setRouteData] = useState(null);
  const [selectedRouteKey, setSelectedRouteKey] = useState('primary'); // 'primary' | 'backup'
  const [simulateDelay, setSimulateDelay] = useState(false); // Demo Traffic Scenario
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  const [resourceFilters, setResourceFilters] = useState({
    hospitals: true,
    bloodBanks: true,
    ambulances: true,
    diagnostics: true,
    pharmacies: false,
  });

  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedNeedId) || MEDICAL_NEEDS[0];
  const goldenWindowMin = activeRoute?.need?.goldenWindowMin || currentNeed.goldenWindowMin || 30;
  const hospProfile = activeRoute?.hospital ? getHospitalCapabilityProfile(activeRoute.hospital, activeRoute.need?.id || selectedNeedId) : null;

  const toggleFilter = (key) => {
    setResourceFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper to create custom SVG marker icons
  const createCustomIcon = (emoji, bgColor, borderColor, isPulse = false, isSelected = false) => {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${isSelected ? '34px' : '30px'};
          height: ${isSelected ? '34px' : '30px'};
          background-color: ${bgColor};
          border: 2px solid ${isSelected ? '#2563EB' : borderColor};
          border-radius: 8px;
          box-shadow: ${isSelected ? '0 0 16px rgba(37,99,235,0.45)' : '0 4px 10px rgba(15,23,42,0.18)'};
          font-size: ${isSelected ? '17px' : '15px'};
          cursor: pointer;
          animation: markerPopIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        ">
          ${emoji}
          ${isPulse ? '<span style="position:absolute; inset:-5px; border-radius:12px; border:2.5px solid #10B981; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>' : ''}
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  // Mapbox Geocoding Autocomplete
  const handleSearchInputChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (!val || val.length < 3 || !mapboxToken) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(val)}.json?access_token=${mapboxToken}&bbox=79.8,12.8,80.4,13.3&limit=5`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.features) {
        setSearchResults(data.features);
      }
    } catch (err) {
      console.error('Mapbox geocoding error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlace = (feature) => {
    const [lng, lat] = feature.center;
    setSearchQuery(feature.text || feature.place_name);
    setSearchResults([]);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 1.4 });

      if (!userPinLayerRef.current) {
        userPinLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
      }
      userPinLayerRef.current.clearLayers();

      const userMarker = L.marker([lat, lng], {
        icon: createCustomIcon('📍', '#EFF6FF', '#2563EB', true)
      });
      userMarker.bindTooltip(`<div style="font-weight:bold; color:#2563EB;">Selected: ${feature.text || feature.place_name}</div>`, { permanent: true, direction: 'top' });
      userPinLayerRef.current.addLayer(userMarker);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    if (userPinLayerRef.current) {
      userPinLayerRef.current.clearLayers();
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([13.0827, 80.2407], 11, { duration: 1.2 });
    }
  };

  // 1. Initialize Map with Mapbox Basemap
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    if (!mapboxToken) {
      console.error('Mapbox token is missing: VITE_MAPBOX_ACCESS_TOKEN is not defined in .env');
      return;
    }

    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    const map = L.map(mapContainerRef.current, {
      center: [13.0827, 80.2407],
      zoom: 11,
      zoomControl: false,
      attributionControl: true
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const mapboxStyleId = 'mapbox/light-v11';
    const mapboxTileUrl = `https://api.mapbox.com/styles/v1/${mapboxStyleId}/tiles/512/{z}/{x}/{y}@2x?access_token=${mapboxToken}`;

    L.tileLayer(mapboxTileUrl, {
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
      tileSize: 512,
      zoomOffset: -1,
      id: mapboxStyleId
    }).addTo(map);

    layersGroupRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapboxToken]);

  // 2. Pan to selectedLocation if passed from parent and no active route
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation || activeRoute) return;
    const lat = selectedLocation.lat ?? (Array.isArray(selectedLocation) ? selectedLocation[0] : null);
    const lng = selectedLocation.lng ?? (Array.isArray(selectedLocation) ? selectedLocation[1] : null);
    if (typeof lat === 'number' && typeof lng === 'number') {
      mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 1.2 });
    }
  }, [selectedLocation, activeRoute]);

  // 3. Render Coverage Zones & Healthcare Resource Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const group = layersGroupRef.current;
    group.clearLayers();

    COVERAGE_ZONES.forEach(zone => {
      let isSimulatedImproved = activeSimulation && activeSimulation.targetZoneId === zone.id;
      let effectiveStatus = isSimulatedImproved ? 'covered' : zone.status;
      let displayPct = isSimulatedImproved 
        ? (activeSimulation.expectedCoveragePct || 78) 
        : zone.baselineMetrics.overallCoveragePct;

      let fillColor = '#10B981';
      let strokeColor = '#059669';
      let fillOpacity = activeRoute ? 0.10 : 0.28;

      if (effectiveStatus === 'dead_zone') {
        fillColor = '#EF4444';
        strokeColor = '#DC2626';
        fillOpacity = activeRoute ? 0.14 : 0.38;
      } else if (effectiveStatus === 'limited') {
        fillColor = '#F59E0B';
        strokeColor = '#D97706';
        fillOpacity = activeRoute ? 0.12 : 0.32;
      }

      const polygon = L.polygon(zone.polygon, {
        color: strokeColor,
        weight: effectiveStatus === 'dead_zone' ? 2.5 : 1.5,
        dashArray: effectiveStatus === 'dead_zone' ? '6, 6' : null,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
      });

      polygon.on('click', () => {
        setSelectedZone(zone);
        setSelectedResource(null);
        if (onSelectDeadZone) onSelectDeadZone(zone);
      });

      const statusLabel = effectiveStatus === 'dead_zone' 
        ? '🔴 Medical Dead Zone' 
        : effectiveStatus === 'limited' 
          ? '🟡 Limited Access' 
          : '🟢 Good Access';

      polygon.bindTooltip(`
        <div style="font-size:12px; padding:3px 5px; font-weight:600; line-height:1.4;">
          <div style="font-weight:bold; color:#0F172A;">${zone.name}</div>
          <div style="color:${strokeColor}; font-weight:700;">${statusLabel} (${displayPct}%)</div>
          <div style="font-size:10px; color:#64748B;">Golden Window: ${currentNeed.goldenWindowMin} min limit</div>
        </div>
      `, { sticky: true });

      group.addLayer(polygon);
    });

    // Add Healthcare Markers
    if (resourceFilters.hospitals) {
      HOSPITALS.forEach(hosp => {
        const marker = L.marker([hosp.location.lat, hosp.location.lng], {
          icon: createCustomIcon('🏥', '#EFF6FF', '#2563EB')
        });
        marker.on('click', () => {
          setSelectedResource({ ...hosp, _categoryLabel: 'Hospital / Trauma Centre', _categoryEmoji: '🏥' });
        });
        group.addLayer(marker);
      });
    }

    if (resourceFilters.bloodBanks) {
      BLOOD_BANKS.forEach(bb => {
        const marker = L.marker([bb.location.lat, bb.location.lng], {
          icon: createCustomIcon('🩸', '#FEF2F2', '#B91C1C')
        });
        marker.on('click', () => {
          setSelectedResource({ ...bb, _categoryLabel: 'Regional Blood Centre', _categoryEmoji: '🩸' });
        });
        group.addLayer(marker);
      });
    }

    if (resourceFilters.ambulances) {
      AMBULANCES.forEach(amb => {
        const marker = L.marker([amb.location.lat, amb.location.lng], {
          icon: createCustomIcon('🚑', '#FFFBEB', '#D97706')
        });
        marker.on('click', () => {
          setSelectedResource({ ...amb, _categoryLabel: 'Emergency Dispatch Ambulance', _categoryEmoji: '🚑' });
        });
        group.addLayer(marker);
      });
    }

    if (resourceFilters.diagnostics) {
      DIAGNOSTICS.forEach(diag => {
        const marker = L.marker([diag.location.lat, diag.location.lng], {
          icon: createCustomIcon('🧪', '#EFF6FF', '#0284C7')
        });
        marker.on('click', () => {
          setSelectedResource({ ...diag, _categoryLabel: 'Diagnostic & Imaging Lab', _categoryEmoji: '🧪' });
        });
        group.addLayer(marker);
      });
    }

    if (resourceFilters.pharmacies) {
      PHARMACIES.forEach(pharm => {
        const marker = L.marker([pharm.location.lat, pharm.location.lng], {
          icon: createCustomIcon('💊', '#ECFDF5', '#059669')
        });
        marker.on('click', () => {
          setSelectedResource({ ...pharm, _categoryLabel: '24/7 Emergency Pharmacy', _categoryEmoji: '💊' });
        });
        group.addLayer(marker);
      });
    }

    // Simulated intervention marker
    if (activeSimulation && activeSimulation.simulatedMarker) {
      const sim = activeSimulation.simulatedMarker;
      const simMarker = L.marker([sim.location.lat, sim.location.lng], {
        icon: createCustomIcon('🚑', '#ECFDF5', '#059669', true)
      });
      simMarker.bindTooltip(`<div style="font-weight:bold; color:#059669;">✨ ${sim.name} (Simulated)</div>`, { permanent: true, direction: 'top' });
      group.addLayer(simMarker);
    }
  }, [selectedNeedId, resourceFilters, activeSimulation, currentNeed, activeRoute]);

  // 4. REAL MAPBOX ROAD ROUTING LAYER (PRIMARY + BACKUP ROUTE SUPPORT)
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerRef.current) return;
    const routeGroup = routeLayerRef.current;
    routeGroup.clearLayers();

    if (!activeRoute || !activeRoute.hospital || !activeRoute.origin) {
      setRouteData(null);
      return;
    }

    let isMounted = true;
    setIsLoadingRoute(true);

    const origCoord = activeRoute.origin.location;
    const destCoord = activeRoute.hospital.location;

    fetchMapboxDirections(origCoord, destCoord)
      .then((directionResult) => {
        if (!isMounted || !directionResult || !mapInstanceRef.current) return;
        setRouteData(directionResult);

        // Safely re-render polylines
        renderRoutePolylines(directionResult, selectedRouteKey, routeGroup, origCoord, destCoord);
      })
      .catch((err) => {
        console.error('Failed to render Mapbox road route:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingRoute(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeRoute]);

  // Re-render polylines whenever user switches between PRIMARY and BACKUP
  useEffect(() => {
    if (!routeData || !routeLayerRef.current || !activeRoute) return;
    const origCoord = activeRoute.origin.location;
    const destCoord = activeRoute.hospital.location;
    renderRoutePolylines(routeData, selectedRouteKey, routeLayerRef.current, origCoord, destCoord);
  }, [selectedRouteKey, routeData]);

  // Helper function to draw Primary and Backup road polylines + Markers
  const renderRoutePolylines = (data, activeKey, routeGroup, origCoord, destCoord) => {
    routeGroup.clearLayers();

    const isPrimaryActive = activeKey === 'primary';
    const primaryCoords = data.primary.coordinates;
    const hasBackup = data.hasAlternative && data.backup;
    const backupCoords = hasBackup ? data.backup.coordinates : null;

    // 1. Draw BACKUP polyline first (if available)
    if (hasBackup) {
      if (!isPrimaryActive) {
        // Backup is active: render prominent cyan/blue line with glow
        const backupGlow = L.polyline(backupCoords, {
          color: '#0369A1',
          weight: 7,
          opacity: 0.25,
          lineCap: 'round',
          lineJoin: 'round',
        });
        const backupMain = L.polyline(backupCoords, {
          color: '#0284C7',
          weight: 4.5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
        });
        backupMain.bindTooltip('<strong style="color:#0284C7;">BACKUP ROUTE (Active)</strong>', { sticky: true });
        routeGroup.addLayer(backupGlow);
        routeGroup.addLayer(backupMain);
      } else {
        // Backup is secondary: render subtle secondary dashed line
        const backupSecondary = L.polyline(backupCoords, {
          color: '#64748B',
          weight: 3.5,
          opacity: 0.5,
          dashArray: '6, 6',
          lineCap: 'round',
          lineJoin: 'round',
        });
        backupSecondary.bindTooltip('<span style="color:#475569;">Backup Route</span>', { sticky: true });
        routeGroup.addLayer(backupSecondary);
      }
    }

    // 2. Draw PRIMARY polyline
    if (isPrimaryActive) {
      // Primary is active: render prominent vibrant royal blue line with glow
      const primaryGlow = L.polyline(primaryCoords, {
        color: '#1E3A8A',
        weight: 7,
        opacity: 0.25,
        lineCap: 'round',
        lineJoin: 'round',
      });
      const primaryMain = L.polyline(primaryCoords, {
        color: '#2563EB',
        weight: 4.5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      });
      primaryMain.bindTooltip('<strong style="color:#2563EB;">PRIMARY ROUTE (Active)</strong>', { sticky: true });
      routeGroup.addLayer(primaryGlow);
      routeGroup.addLayer(primaryMain);
    } else {
      // Primary is secondary: render subtle secondary dashed line
      const primarySecondary = L.polyline(primaryCoords, {
        color: '#64748B',
        weight: 3.5,
        opacity: 0.5,
        dashArray: '6, 6',
        lineCap: 'round',
        lineJoin: 'round',
      });
      primarySecondary.bindTooltip('<span style="color:#475569;">Primary Route</span>', { sticky: true });
      routeGroup.addLayer(primarySecondary);
    }

    // 3. Origin Marker (Clearly labeled DEMO ORIGIN)
    const origIcon = L.divIcon({
      className: 'custom-origin-pin',
      html: `
        <div style="position:relative; display:flex; align-items:center; justify-content:center;">
          <div style="width:18px; height:18px; border-radius:50%; background:#2563EB; border:3px solid #ffffff; box-shadow:0 0 14px rgba(37,99,235,0.75);"></div>
          <div style="position:absolute; width:34px; height:34px; border-radius:50%; background:rgba(37,99,235,0.25); animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const origMarker = L.marker([origCoord.lat, origCoord.lng], { icon: origIcon });
    origMarker.bindTooltip(`
      <div style="font-size:11px; font-weight:700; color:#0F172A; padding:3px 5px;">
        <div style="color:#2563EB; font-size:9px; text-transform:uppercase; font-weight:900;">📍 DEMO ORIGIN</div>
        <div>${activeRoute.origin.name}</div>
      </div>
    `, { permanent: true, direction: 'top', offset: [0, -10] });
    routeGroup.addLayer(origMarker);

    // 4. Destination Hospital Marker (SAME SELECTED HOSPITAL)
    const statusColor = activeRoute.hospital.status === 'green' ? '#10B981' : activeRoute.hospital.status === 'yellow' ? '#F59E0B' : '#EF4444';
    const destIcon = L.divIcon({
      className: 'custom-dest-pin',
      html: `
        <div style="position:relative; display:flex; flex-direction:column; align-items:center;">
          <div style="background:${statusColor}; color:#ffffff; font-weight:900; font-size:13px; width:32px; height:32px; border-radius:8px; border:2px solid #ffffff; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.25);">
            🏥
          </div>
          <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid ${statusColor}; margin-top:-1px;"></div>
        </div>
      `,
      iconSize: [32, 38],
      iconAnchor: [16, 38],
    });

    const destMarker = L.marker([destCoord.lat, destCoord.lng], { icon: destIcon });
    destMarker.bindTooltip(`
      <div style="font-size:11px; font-weight:700; color:#0F172A; padding:3px 5px;">
        <div style="color:${statusColor}; font-size:9px; text-transform:uppercase; font-weight:900;">🏥 DESTINATION</div>
        <div>${activeRoute.hospital.name}</div>
      </div>
    `, { permanent: true, direction: 'top', offset: [0, -38] });
    routeGroup.addLayer(destMarker);

    // Fit map view to encompass both routes with comfortable padding
    const allCoordinates = backupCoords ? [...primaryCoords, ...backupCoords] : primaryCoords;
    try {
      mapInstanceRef.current.fitBounds(L.latLngBounds(allCoordinates), {
        padding: [80, 80],
        maxZoom: 15,
        animate: true,
        duration: 1.0,
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Calculations for Route Evaluation & Accessibility Window
  const primaryDuration = routeData?.primary 
    ? (simulateDelay ? routeData.primary.durationMin + 12 : routeData.primary.durationMin)
    : 0;
  const primaryInWindow = primaryDuration <= goldenWindowMin;

  const backupDuration = routeData?.backup ? routeData.backup.durationMin : null;
  const backupInWindow = backupDuration != null ? backupDuration <= goldenWindowMin : false;

  // Active route being inspected in the detailed panel
  const activeInspectRoute = selectedRouteKey === 'backup' && routeData?.backup 
    ? routeData.backup 
    : routeData?.primary;
  const activeInspectDuration = selectedRouteKey === 'backup' ? backupDuration : primaryDuration;
  const activeInspectInWindow = selectedRouteKey === 'backup' ? backupInWindow : primaryInWindow;

  // Route comparison verdict sentence
  let comparisonVerdict = 'Evaluating accessibility window...';
  if (routeData) {
    if (routeData.hasAlternative && routeData.backup) {
      if (primaryInWindow && backupInWindow) {
        comparisonVerdict = 'Both routes remain within the emergency accessibility window.';
      } else if (primaryInWindow && !backupInWindow) {
        comparisonVerdict = 'Backup route exceeds the emergency accessibility window.';
      } else if (!primaryInWindow && backupInWindow) {
        comparisonVerdict = 'Backup route available within emergency accessibility window.';
      } else {
        comparisonVerdict = 'No available route currently meets the emergency accessibility window.';
      }
    } else {
      comparisonVerdict = primaryInWindow 
        ? 'Primary route meets the emergency accessibility window.' 
        : 'Primary route exceeds the emergency accessibility window.';
    }
  }

  // If Mapbox token is missing, display clear developer error
  if (!mapboxToken) {
    return (
      <div className="w-full h-full min-h-[520px] rounded-xl border-2 border-dashed border-red-400 bg-red-50/70 p-8 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Mapbox Token Configuration Required</h3>
        <p className="text-xs text-slate-600 max-w-md leading-relaxed">
          The map cannot load because <code className="bg-white px-1.5 py-0.5 rounded border border-red-200 font-mono text-red-700 font-bold">VITE_MAPBOX_ACCESS_TOKEN</code> is missing or undefined in your <code className="font-bold">.env</code> file.
        </p>
        <p className="text-[11px] text-slate-500">
          Add your Mapbox public token to <code className="font-mono">.env</code> and restart the development server.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full rounded-xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-50" 
      style={{ height, minHeight: '560px' }}
    >
      {/* 1. Integrated Mapbox Location Search Autocomplete (Top Center) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-400 w-full max-w-md px-3 pointer-events-auto">
        <div className="relative">
          <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-md">
            <Search className="w-4 h-4 text-blue-600 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search address or area in metro corridor..."
              className="w-full py-2.5 pl-2.5 pr-8 bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {isSearching && (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500 mr-2 shrink-0" />
            )}
            {searchQuery && !isSearching && (
              <button
                onClick={handleClearSearch}
                className="mr-2 p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
                title="Clear location"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg overflow-hidden z-50 divide-y divide-slate-100 max-h-56 overflow-y-auto">
              {searchResults.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => handleSelectPlace(feature)}
                  className="w-full p-2.5 text-left text-xs hover:bg-blue-50/70 flex items-start gap-2 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">{feature.text}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{feature.place_name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* 3. Floating Map Legend (Top Left) */}
      <div className="absolute top-3 left-3 z-400 max-w-xs pointer-events-auto">
        <MapLegend 
          resourceFilters={resourceFilters} 
          toggleFilter={toggleFilter} 
        />
      </div>

      {/* 4. Active Simulation Banner (Top Right) */}
      {activeSimulation && (
        <div className="absolute top-3 right-3 z-400 pointer-events-auto bg-slate-900 text-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-700 flex items-center gap-2 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Simulated Infrastructure: {activeSimulation.name}</span>
        </div>
      )}

      {/* 5. ENHANCED ROUTE INFORMATION PANEL WITH PRIMARY + BACKUP ROUTE SUPPORT */}
      {activeRoute && (
        <div className="absolute bottom-4 left-4 z-400 max-w-md w-full sm:w-[430px] max-h-[85vh] overflow-y-auto pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl p-4 space-y-3">
          
          {/* Panel Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                <Navigation className="w-3 h-3 text-blue-600" />
                TRAFFIC-AWARE ROUTING
              </span>
              {isLoadingRoute && (
                <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                  <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                  Calculating roads...
                </span>
              )}
            </div>

            {onClearRoute && (
              <button
                onClick={onClearRoute}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Clear route"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 1. PRIMARY ROUTE / BACKUP ROUTE TOGGLE SWITCH */}
          {routeData && (
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setSelectedRouteKey('primary')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedRouteKey === 'primary'
                    ? 'bg-white text-blue-800 shadow-2xs border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>PRIMARY ROUTE (~{primaryDuration}m)</span>
              </button>

              {routeData.hasAlternative ? (
                <button
                  onClick={() => setSelectedRouteKey('backup')}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedRouteKey === 'backup'
                      ? 'bg-white text-sky-800 shadow-2xs border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  <span>BACKUP ROUTE (~{backupDuration}m)</span>
                </button>
              ) : (
                <div className="flex-1 py-1.5 px-2 text-center text-[10px] text-slate-400 font-medium italic">
                  Alternative unavailable
                </div>
              )}
            </div>
          )}

          {/* Origin -> Steps -> Same Destination Hospital */}
          <div className="space-y-1.5 text-xs bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/70">
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-0.5"></span>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Demo Origin</span>
                <span className="font-bold text-slate-900">{activeRoute.origin?.name}</span>
              </div>
            </div>

            {activeInspectRoute && activeInspectRoute.roadNames && activeInspectRoute.roadNames.length > 0 && (
              <div className="pl-4 py-1 text-[11px] text-slate-600 border-l-2 border-dashed border-blue-300 ml-1 space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400 block">
                  {selectedRouteKey === 'backup' ? 'Backup Road Sequence:' : 'Primary Road Sequence:'}
                </span>
                <div className="font-medium text-slate-800">
                  {activeInspectRoute.roadNames.slice(0, 4).join(' ➔ ')}
                  {activeInspectRoute.roadNames.length > 4 && ' ➔ ...'}
                </div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0 mt-0.5"></span>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Same Hospital Destination</span>
                <span className="font-bold text-slate-900">{activeRoute.hospital?.name}</span>
              </div>
            </div>
          </div>

          {/* 2. TRAFFIC BACKUP SUMMARY & ROUTE COMPARISON */}
          {routeData && (
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-900">
                    TRAFFIC BACKUP OVERVIEW
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Golden Limit: <strong className="text-slate-900">{goldenWindowMin} min</strong>
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug">
                  {routeData.hasAlternative 
                    ? 'If the primary route is delayed, an alternative route is available.'
                    : 'Alternative route unavailable for this journey.'}
                </p>

                {/* Primary vs Backup Comparison Strip */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Primary Route Strip */}
                  <div className={`p-2 rounded-lg border text-[11px] space-y-0.5 ${
                    selectedRouteKey === 'primary' ? 'bg-white border-blue-300 shadow-2xs' : 'bg-slate-50/70 border-slate-200'
                  }`}>
                    <div className="font-bold text-slate-900">
                      PRIMARY: {routeData.primary.distanceKm} km · ~{primaryDuration} min
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {simulateDelay ? '⚠️ Delay Simulated (+12m)' : 'Recommended route'}
                    </div>
                    <div className={`text-[10px] font-bold ${primaryInWindow ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {primaryInWindow ? '✓ Within Window' : '⚠️ Exceeds Window'}
                    </div>
                  </div>

                  {/* Backup Route Strip */}
                  <div className={`p-2 rounded-lg border text-[11px] space-y-0.5 ${
                    selectedRouteKey === 'backup' ? 'bg-white border-sky-300 shadow-2xs' : 'bg-slate-50/70 border-slate-200'
                  }`}>
                    {routeData.hasAlternative && routeData.backup ? (
                      <>
                        <div className="font-bold text-slate-900">
                          BACKUP: {routeData.backup.distanceKm} km · ~{backupDuration} min
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">Alternative route</div>
                        <div className={`text-[10px] font-bold ${backupInWindow ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {backupInWindow ? '✓ Within Window' : '⚠️ Outside Window'}
                        </div>
                      </>
                    ) : (
                      <div className="text-slate-400 italic text-[10px] py-1">
                        Alternative route unavailable.
                      </div>
                    )}
                  </div>
                </div>

                {/* One Concise Comparison Sentence */}
                <div className="p-1.5 rounded-md bg-white border border-blue-200/70 text-[11px] font-bold text-slate-800 text-center">
                  {comparisonVerdict}
                </div>
              </div>

              {/* Controlled Demo Traffic Delay Simulation Toggle */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-[10px] font-black uppercase text-slate-500">
                  DEMO TRAFFIC SCENARIO
                </span>
                <button
                  onClick={() => setSimulateDelay(prev => !prev)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                    simulateDelay 
                      ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {simulateDelay ? 'Simulate Delay (+12m): ACTIVE' : 'Simulate Delay (+12m)'}
                </button>
              </div>
            </div>
          )}

          {/* 3. Hospital Care Capability + Availability Intelligence Layer */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800 text-[11px] uppercase tracking-wider">
                CARE CAPABILITY & AVAILABILITY
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                {hospProfile?.effectiveAccess || activeRoute.hospital?.effectiveScore || 90}% Effective Access
              </span>
            </div>
            
            <p className="text-[10px] text-slate-500 leading-tight">
              Combines care capability, resource availability and estimated accessibility.
            </p>

            {/* Why This Hospital Explanation */}
            <div className="text-[11px] text-slate-700 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 leading-snug space-y-1">
              <strong className="text-blue-900 block font-bold text-[10px] uppercase">WHY THIS HOSPITAL?</strong>
              <p className="font-semibold text-slate-800">{hospProfile?.whyHeadline || activeRoute.hospital?.rankingReason}</p>
              {hospProfile?.whyReasons && hospProfile.whyReasons.length > 0 && (
                <ul className="space-y-0.5 pt-0.5 text-[10px] text-slate-600">
                  {hospProfile.whyReasons.slice(0, 2).map((r, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Relevant Capabilities Pills */}
            {hospProfile?.capabilities && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Required Capabilities ({currentNeed?.name})
                </span>
                <div className="flex flex-wrap gap-1">
                  {hospProfile.capabilities.map(c => (
                    <span 
                      key={c.key} 
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        c.available 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                      }`}
                    >
                      {c.available ? '✓ ' : '✕ '}
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Resource Status Badges */}
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <div className={`p-1.5 rounded-lg border text-center font-bold ${
                activeRoute.hospital?.bloodAvailable 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                {activeRoute.hospital?.bloodAvailable ? '✓ O- Blood Avail' : '⚠️ Blood Stockout'}
              </div>

              <div className={`p-1.5 rounded-lg border text-center font-bold ${
                activeRoute.hospital?.traumaReady 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                {activeRoute.hospital?.traumaReady ? '✓ Trauma Bay' : '✕ No Trauma Bay'}
              </div>

              <div className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-center font-bold text-slate-700">
                ICU: {activeRoute.hospital?.availableIcuBeds || 0} free
              </div>
            </div>

            {/* Specialist & Data Provenance */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 border-t border-slate-100">
              <span>Coverage: <strong>{hospProfile?.specialists?.[0]?.role || 'Emergency Team'} (Available status)</strong></span>
              <span className="px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200 text-amber-800 font-black text-[9px]">
                DEMO DATA
              </span>
            </div>
          </div>

          {/* Actions: Return to search + Call Hospital */}
          <div className="flex items-center gap-2 pt-1">
            {onReturnToSearch && (
              <button
                onClick={onReturnToSearch}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Search</span>
              </button>
            )}

            {activeRoute.hospital?.contact && (
              <a
                href={`tel:${activeRoute.hospital.contact}`}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-slate-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call</span>
              </a>
            )}
          </div>

        </div>
      )}

      {/* 6. Floating Detail Panels (Bottom or Right) */}
      {selectedZone && !activeRoute && (
        <div className="absolute top-3 right-3 bottom-3 z-400 max-w-sm w-full pointer-events-auto">
          <DeadZonePanel
            zone={selectedZone}
            onClose={() => setSelectedZone(null)}
            onSimulateIntervention={onSimulateIntervention}
          />
        </div>
      )}

      {selectedResource && !activeRoute && (
        <div className="absolute bottom-3 right-3 z-400 pointer-events-auto">
          <ResourceDetailModal
            resource={selectedResource}
            onClose={() => setSelectedResource(null)}
          />
        </div>
      )}
    </div>
  );
}
