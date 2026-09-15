import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { COVERAGE_ZONES } from '../../data/coverageZones';
import { HOSPITALS, BLOOD_BANKS, AMBULANCES, DIAGNOSTICS, PHARMACIES } from '../../data/mockHealthcareData';
import { MEDICAL_NEEDS } from '../../data/medicalNeeds';
import MapLegend from './MapLegend';
import DeadZonePanel from './DeadZonePanel';
import ResourceDetailModal from './ResourceDetailModal';
import { Search, MapPin, AlertTriangle, X, Loader2 } from 'lucide-react';

export default function CoverageMap({ 
  selectedNeedId = 'severe_bleeding', 
  selectedLocation = null,
  onSelectDeadZone, 
  onSimulateIntervention,
  activeSimulation,
  height = '100%'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);
  const userPinLayerRef = useRef(null);

  // Read Mapbox public access token strictly from environment
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [resourceFilters, setResourceFilters] = useState({
    hospitals: true,
    bloodBanks: true,
    ambulances: true,
    diagnostics: true,
    pharmacies: false,
  });

  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedNeedId) || MEDICAL_NEEDS[0];

  const toggleFilter = (key) => {
    setResourceFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper to create custom SVG marker icons (medical blue, emerald green, and red accents)
  const createCustomIcon = (emoji, bgColor, borderColor, isPulse = false) => {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background-color: ${bgColor};
          border: 2px solid ${borderColor};
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(15,23,42,0.18);
          font-size: 15px;
          cursor: pointer;
          transition: transform 0.2s ease;
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
      // Bounded around Chennai metro corridor (lng: 79.8 to 80.4, lat: 12.8 to 13.3)
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

  // Select Geocoded Location
  const handleSelectPlace = (feature) => {
    const [lng, lat] = feature.center;
    setSearchQuery(feature.text || feature.place_name);
    setSearchResults([]);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 1.4 });

      // Drop user search pin
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

  // Clear search pin
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchedPlaceName(null);
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

    // Centered around metropolitan healthcare network (Chennai core)
    const map = L.map(mapContainerRef.current, {
      center: [13.0827, 80.2407],
      zoom: 11,
      zoomControl: false, // Clean restrained UI
      attributionControl: true
    });

    // Minimal zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // MAPBOX LIGHT-V11 BASEMAP (Minimal, restrained, clinical medical intelligence aesthetic)
    // ZERO dependency on CARTO.
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
    mapInstanceRef.current = map;

    // Full screen auto-resize: Invalidate size on container resize so no white frames appear
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

  // 2. Pan to selectedLocation if passed from parent
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;
    const { lat, lng } = selectedLocation;
    if (lat && lng) {
      mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 1.2 });
    }
  }, [selectedLocation]);

  // 3. Render Coverage Zones & Healthcare Resource Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const group = layersGroupRef.current;
    group.clearLayers();

    // 1. Draw Zones Polygons with calibrated demo status (2 Green, 1 Yellow, 2 Red)
    COVERAGE_ZONES.forEach(zone => {
      let isSimulatedImproved = activeSimulation && activeSimulation.targetZoneId === zone.id;
      
      // Determine effective status based on zone clinical baseline and simulation state
      let effectiveStatus = isSimulatedImproved ? 'covered' : zone.status;
      let displayPct = isSimulatedImproved 
        ? (activeSimulation.expectedCoveragePct || 78) 
        : zone.baselineMetrics.overallCoveragePct;

      let fillColor = '#10B981'; // 🟢 Emerald Green (Good Access >= 70%)
      let strokeColor = '#059669';
      let fillOpacity = 0.28;

      if (effectiveStatus === 'dead_zone') {
        fillColor = '#EF4444'; // 🔴 Medical Dead Zone Red (< 50%)
        strokeColor = '#DC2626';
        fillOpacity = 0.38;
      } else if (effectiveStatus === 'limited') {
        fillColor = '#F59E0B'; // 🟡 Limited Access Yellow/Amber (50-69%)
        strokeColor = '#D97706';
        fillOpacity = 0.32;
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

      // Clinical tooltip displaying calibrated effective coverage
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

    // 2. Add Healthcare Markers with medical blue & clinical accents
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

    // 3. Simulated intervention marker
    if (activeSimulation && activeSimulation.simulatedMarker) {
      const sim = activeSimulation.simulatedMarker;
      const simMarker = L.marker([sim.location.lat, sim.location.lng], {
        icon: createCustomIcon('🚑', '#ECFDF5', '#059669', true)
      });
      simMarker.bindTooltip(`<div style="font-weight:bold; color:#059669;">✨ ${sim.name} (Simulated)</div>`, { permanent: true, direction: 'top' });
      group.addLayer(simMarker);
    }
  }, [selectedNeedId, resourceFilters, activeSimulation, currentNeed]);

  // If Mapbox token is missing, display clear developer error (No silent fallbacks)
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

      {/* 2. Leaflet Map Container rendered with Mapbox light tiles */}
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

      {/* 5. Floating Detail Panels (Bottom or Right) */}
      {selectedZone && (
        <div className="absolute top-3 right-3 bottom-3 z-400 max-w-sm w-full pointer-events-auto">
          <DeadZonePanel
            zone={selectedZone}
            onClose={() => setSelectedZone(null)}
            onSimulateIntervention={onSimulateIntervention}
          />
        </div>
      )}

      {selectedResource && (
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
