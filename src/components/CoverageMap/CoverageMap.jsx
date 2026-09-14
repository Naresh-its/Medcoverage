import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { COVERAGE_ZONES } from '../../data/coverageZones';
import { HOSPITALS, BLOOD_BANKS, AMBULANCES, DIAGNOSTICS, PHARMACIES } from '../../data/mockHealthcareData';
import { MEDICAL_NEEDS } from '../../data/medicalNeeds';
import MapLegend from './MapLegend';
import DeadZonePanel from './DeadZonePanel';
import ResourceDetailModal from './ResourceDetailModal';

export default function CoverageMap({ 
  selectedNeedId, 
  onSelectDeadZone, 
  onSimulateIntervention,
  activeSimulation
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);

  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceFilters, setResourceFilters] = useState({
    hospitals: true,
    bloodBanks: true,
    ambulances: true,
    diagnostics: true,
    pharmacies: true,
  });

  const toggleFilter = (key) => {
    setResourceFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper to create custom SVG marker icons
  const createCustomIcon = (emoji, bgColor, borderColor, isPulse = false) => {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background-color: ${bgColor};
          border: 2px solid ${borderColor};
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.15);
          font-size: 16px;
          cursor: pointer;
        ">
          ${emoji}
          ${isPulse ? '<span style="position:absolute; inset:-4px; border-radius:10px; border:2px solid #10B981; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>' : ''}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered around Chennai / Metro Region
    const map = L.map(mapContainerRef.current, {
      center: [13.0827, 80.2407],
      zoom: 11,
      zoomControl: true,
      attributionControl: false
    });

    // CartoDB Positron clean map tiles (minimal, clinical, medical-tech feel)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    layersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render Polygons and Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const group = layersGroupRef.current;
    group.clearLayers();

    // 1. Draw Zones Polygons
    COVERAGE_ZONES.forEach(zone => {
      let isSimulatedImproved = activeSimulation && activeSimulation.targetZoneId === zone.id;
      let effectiveStatus = isSimulatedImproved ? 'covered' : zone.status;

      let fillColor = '#10B981'; // Green
      let strokeColor = '#059669';
      let fillOpacity = 0.25;

      if (effectiveStatus === 'dead_zone') {
        fillColor = '#EF4444'; // Medical Dead Zone Red
        strokeColor = '#DC2626';
        fillOpacity = 0.38;
      } else if (effectiveStatus === 'limited') {
        fillColor = '#F59E0B'; // Amber
        strokeColor = '#D97706';
        fillOpacity = 0.30;
      }

      const polygon = L.polygon(zone.polygon, {
        color: strokeColor,
        weight: effectiveStatus === 'dead_zone' ? 2.5 : 1.5,
        dashArray: effectiveStatus === 'dead_zone' ? '5, 5' : null,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
      });

      polygon.on('click', () => {
        setSelectedZone(zone);
        setSelectedResource(null);
        if (onSelectDeadZone) onSelectDeadZone(zone);
      });

      // Tooltip
      const statusLabel = effectiveStatus === 'dead_zone' ? '🔴 Medical Dead Zone' : effectiveStatus === 'limited' ? '🟠 Limited Access' : '🟢 Well Covered';
      polygon.bindTooltip(`
        <div style="font-size:11px; padding:2px 4px; font-weight:600;">
          <div>${zone.name}</div>
          <div style="color:${strokeColor}">${statusLabel}</div>
        </div>
      `, { sticky: true });

      group.addLayer(polygon);
    });

    // 2. Add Markers based on resourceFilters
    if (resourceFilters.hospitals) {
      HOSPITALS.forEach(hosp => {
        const marker = L.marker([hosp.location.lat, hosp.location.lng], {
          icon: createCustomIcon('🏥', '#FFFFFF', '#DC2626')
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
          icon: createCustomIcon('🧪', '#EFF6FF', '#2563EB')
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

    // 3. If active simulation has a new simulated marker, draw it with pulse
    if (activeSimulation && activeSimulation.simulatedMarker) {
      const sim = activeSimulation.simulatedMarker;
      const simMarker = L.marker([sim.location.lat, sim.location.lng], {
        icon: createCustomIcon('🚑', '#ECFDF5', '#059669', true)
      });
      simMarker.bindTooltip(`<div style="font-weight:bold; color:#059669;">✨ ${sim.name} (Simulated)</div>`, { permanent: true, direction: 'top' });
      group.addLayer(simMarker);
    }
  }, [selectedNeedId, resourceFilters, activeSimulation]);

  return (
    <div className="relative w-full h-[620px] rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-slate-100">
      {/* Leaflet Map Root */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Legend (Top Left) */}
      <div className="absolute top-4 left-4 z-400 max-w-xs pointer-events-auto">
        <MapLegend 
          resourceFilters={resourceFilters} 
          toggleFilter={toggleFilter} 
        />
      </div>

      {/* Floating Active Simulation Banner (Top Right) */}
      {activeSimulation && (
        <div className="absolute top-4 right-4 z-400 pointer-events-auto bg-emerald-600 text-white px-3.5 py-2 rounded-lg shadow-md flex items-center gap-2 text-xs font-semibold animate-bounce">
          <span>✨ Simulated Infrastructure Active: {activeSimulation.name}</span>
        </div>
      )}

      {/* Floating Detail Panels (Bottom or Right) */}
      {selectedZone && (
        <div className="absolute top-4 right-4 bottom-4 z-400 max-w-sm w-full pointer-events-auto">
          <DeadZonePanel
            zone={selectedZone}
            onClose={() => setSelectedZone(null)}
            onSimulateIntervention={onSimulateIntervention}
          />
        </div>
      )}

      {selectedResource && (
        <div className="absolute bottom-4 right-4 z-400 pointer-events-auto">
          <ResourceDetailModal
            resource={selectedResource}
            onClose={() => setSelectedResource(null)}
          />
        </div>
      )}
    </div>
  );
}