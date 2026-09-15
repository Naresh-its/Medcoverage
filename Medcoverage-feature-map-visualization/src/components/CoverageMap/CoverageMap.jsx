import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { COVERAGE_ZONES } from '../../data/coverageZones';
import { HOSPITALS, BLOOD_BANKS, AMBULANCES, DIAGNOSTICS, PHARMACIES } from '../../data/mockHealthcareData';
import { MEDICAL_NEEDS } from '../../data/medicalNeeds';
import { calculateEffectiveCoverage, matchResourceRequirement } from '../../engine';
import MapLegend from './MapLegend';
import DeadZonePanel from './DeadZonePanel';
import ResourceDetailModal from './ResourceDetailModal';

const RESOURCES = { hospitals: HOSPITALS, bloodBanks: BLOOD_BANKS, ambulances: AMBULANCES, diagnostics: DIAGNOSTICS, pharmacies: PHARMACIES };

export default function CoverageMap({ 
  selectedNeedId = 'severe_bleeding', 
  onSelectDeadZone, 
  onSimulateIntervention,
  activeSimulation
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);
  const onSelectDeadZoneRef = useRef(onSelectDeadZone);

  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceFilters, setResourceFilters] = useState({
    hospitals: true,
    bloodBanks: true,
    ambulances: true,
    diagnostics: true,
    pharmacies: true,
  });

  const currentNeed = MEDICAL_NEEDS.find(n => n.id === selectedNeedId) || MEDICAL_NEEDS[0];

  useEffect(() => {
    onSelectDeadZoneRef.current = onSelectDeadZone;
  }, [onSelectDeadZone]);

  const toggleFilter = (key) => {
    setResourceFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper to create custom SVG marker icons with capability dimming / highlighting
  const createCustomIcon = (emoji, bgColor, borderColor, isQualified = true) => {
    if (!isQualified) {
      // Dimmed / Desaturated Marker for facilities lacking capability
      return L.divIcon({
        className: 'medcoverage-custom-marker marker-dimmed',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 26px;
            height: 26px;
            background-color: #F8FAFC;
            border: 1.5px dashed #94A3B8;
            border-radius: 7px;
            box-shadow: none;
            font-size: 13px;
            opacity: 0.32;
            filter: grayscale(90%) contrast(75%);
            cursor: pointer;
            transition: all 0.3s ease;
          ">
            ${emoji}
            <span style="
              position: absolute;
              top: -3px;
              right: -3px;
              width: 10px;
              height: 10px;
              background-color: #EF4444;
              border: 1.5px solid #FFFFFF;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #FFFFFF;
              font-size: 7px;
              font-weight: 900;
            ">✕</span>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
    }

    // Fully Qualified & Active Facility Marker
    return L.divIcon({
      className: 'medcoverage-custom-marker marker-qualified',
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
          border-radius: 9px;
          box-shadow: 0 4px 10px -2px rgba(0,0,0,0.22), 0 0 0 2px rgba(16, 185, 129, 0.35);
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        ">
          ${emoji}
          <span style="
            position: absolute;
            top: -3px;
            right: -3px;
            width: 12px;
            height: 12px;
            background-color: #10B981;
            border: 2px solid #FFFFFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 8px;
            font-weight: 900;
          ">✓</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  // Helper for Simulated Resource Marker with Multi-Ring Pulsing Radar Halo
  const createSimulatedMarkerIcon = (emoji = '🚑') => {
    return L.divIcon({
      className: 'simulated-pulsing-marker',
      html: `
        <div style="
          position: relative;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          <!-- Concentric Animated Pulsing Radar Waves -->
          <div style="
            position: absolute;
            inset: 0px;
            border-radius: 50%;
            background: rgba(16, 185, 129, 0.22);
            animation: simRadarPulse 2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
          "></div>
          <div style="
            position: absolute;
            inset: 6px;
            border-radius: 50%;
            border: 2px solid #10B981;
            animation: simRingPulse 2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite 0.4s;
          "></div>

          <!-- Central Resource Icon Core -->
          <div style="
            position: relative;
            z-index: 2;
            width: 34px;
            height: 34px;
            background: #ECFDF5;
            border: 2.5px solid #059669;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 17px;
            box-shadow: 0 0 16px rgba(16, 185, 129, 0.7), 0 4px 6px -1px rgba(0,0,0,0.15);
          ">
            ${emoji}
            <span style="
              position: absolute;
              bottom: -6px;
              left: 50%;
              transform: translateX(-50%);
              background: #059669;
              color: white;
              font-size: 8px;
              font-weight: 900;
              padding: 0px 4px;
              border-radius: 4px;
              letter-spacing: 0.5px;
              white-space: nowrap;
              box-shadow: 0 1px 3px rgba(0,0,0,0.25);
            ">SIM</span>
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24]
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

  // Render Polygons with Smooth Transitions and Markers with Capability Layering
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const group = layersGroupRef.current;
    group.clearLayers();

    // 1. Draw Zones Polygons with Dynamic Simulation Morphing
    COVERAGE_ZONES.forEach(zone => {
      const isSimulatedTarget = activeSimulation && activeSimulation.targetZoneId === zone.id;
      const engineResult = calculateEffectiveCoverage(zone, currentNeed, RESOURCES);
      let effectiveStatus = engineResult.status;
      let coveragePct = engineResult.effectiveCoveragePct;

      if (isSimulatedTarget) {
        if (activeSimulation.result) {
          effectiveStatus = activeSimulation.result.after.zoneStatus;
          coveragePct = activeSimulation.result.after.coveragePct ?? activeSimulation.result.after.effectiveCoveragePct;
        } else {
          effectiveStatus = engineResult.status;
          coveragePct = engineResult.effectiveCoveragePct;
        }
      }

      // Determine colors based on effective status (morphing from Red to Amber/Green)
      let fillColor = '#10B981'; // Green
      let strokeColor = '#059669';
      let fillOpacity = 0.25;
      let dashArray = null;
      let strokeWidth = 1.5;

      if (effectiveStatus === 'dead_zone') {
        fillColor = '#EF4444'; // Medical Dead Zone Red
        strokeColor = '#DC2626';
        fillOpacity = 0.38;
        dashArray = '5, 5';
        strokeWidth = 2.5;
      } else if (effectiveStatus === 'limited') {
        fillColor = '#F59E0B'; // Amber
        strokeColor = '#D97706';
        fillOpacity = 0.30;
        dashArray = null;
        strokeWidth = 2.0;
      } else if (isSimulatedTarget) {
        // Highlighting morphed simulated zone
        fillColor = '#10B981';
        strokeColor = '#047857';
        fillOpacity = 0.34;
        strokeWidth = 3.0;
      }

      const polygon = L.polygon(zone.polygon, {
        color: strokeColor,
        weight: strokeWidth,
        dashArray: dashArray,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        className: 'medcoverage-zone-polygon',
      });

      polygon.on('click', () => {
        setSelectedZone(zone);
        setSelectedResource(null);
        if (onSelectDeadZoneRef.current) onSelectDeadZoneRef.current(zone);
      });

      // Tooltip with simulation and clinical details
      const statusLabel = isSimulatedTarget
        ? `✨ Simulated: ${effectiveStatus === 'covered' ? 'Covered (Resolved)' : 'Improved'}`
        : effectiveStatus === 'dead_zone' 
        ? '🔴 Medical Dead Zone' 
        : effectiveStatus === 'limited' 
        ? '🟠 Limited Access' 
        : '🟢 Well Covered';

      polygon.bindTooltip(`
        <div style="font-size:11px; padding:3px 6px; font-weight:600; line-height:1.35;">
          <div style="font-weight:700; color:#0f172a;">${zone.name}</div>
          <div style="color:${strokeColor}; font-weight:700;">${statusLabel} (${coveragePct}%)</div>
          ${isSimulatedTarget ? '<div style="color:#059669; font-size:10px; font-weight:700;">+34% Simulated Access Boost</div>' : ''}
          <div style="color:#64748b; font-size:10px;">Click to inspect bottlenecks & interventions</div>
        </div>
      `, { sticky: true });

      group.addLayer(polygon);
    });

    // 2. Add Facility Markers based on resourceFilters with capability layering
    if (resourceFilters.hospitals) {
      HOSPITALS.forEach(hosp => {
        const capability = matchResourceRequirement(hosp, 'hospitals', currentNeed, COVERAGE_ZONES.find(zone => zone.id === hosp.zoneId)?.center);
        const marker = L.marker([hosp.location.lat, hosp.location.lng], {
          icon: createCustomIcon('🏥', '#FFFFFF', '#DC2626', capability.qualified)
        });

        marker.bindTooltip(`
          <div style="font-size:11px; padding:3px 5px; font-weight:600; line-height:1.3; max-width:210px;">
            <div style="font-weight:700; color:${capability.qualified ? '#0f172a' : '#64748b'};">${hosp.name}</div>
            <div style="color:${capability.qualified ? '#059669' : '#DC2626'}; font-size:10px; font-weight:700; margin-top:2px;">
              ${capability.qualified ? `✓ Qualified for ${currentNeed.name}` : `⚠️ Dimmed: Lacks ${currentNeed.name} Req.`}
            </div>
            <div style="color:${capability.qualified ? '#475569' : '#94A3B8'}; font-size:9.5px; margin-top:1px;">
              ${capability.reason}
            </div>
          </div>
        `, { direction: 'top' });

        marker.on('click', () => {
          setSelectedResource({ 
            ...hosp, 
            _categoryLabel: 'Hospital / Trauma Centre', 
            _categoryEmoji: '🏥',
            _capabilityStatus: capability 
          });
        });
        group.addLayer(marker);
      });
    }

    if (resourceFilters.bloodBanks) {
      BLOOD_BANKS.forEach(bb => {
        const capability = matchResourceRequirement(bb, 'bloodBanks', currentNeed, COVERAGE_ZONES.find(zone => zone.id === bb.zoneId)?.center);
        const marker = L.marker([bb.location.lat, bb.location.lng], {
          icon: createCustomIcon('🩸', '#FEF2F2', '#B91C1C', capability.qualified)
        });

        marker.bindTooltip(`
          <div style="font-size:11px; padding:3px 5px; font-weight:600; line-height:1.3; max-width:210px;">
            <div style="font-weight:700; color:${capability.qualified ? '#0f172a' : '#64748b'};">${bb.name}</div>
            <div style="color:${capability.qualified ? '#059669' : '#DC2626'}; font-size:10px; font-weight:700; margin-top:2px;">
              ${capability.qualified ? `✓ Qualified for ${currentNeed.name}` : `⚠️ Dimmed: Lacks ${currentNeed.name} Req.`}
            </div>
            <div style="color:${capability.qualified ? '#475569' : '#94A3B8'}; font-size:9.5px; margin-top:1px;">
              ${capability.reason}
            </div>
          </div>
        `, { direction: 'top' });

        marker.on('click', () => {
          setSelectedResource({ 
            ...bb, 
            _categoryLabel: 'Regional Blood Centre', 
            _categoryEmoji: '🩸',
            _capabilityStatus: capability 
          });
        });
        group.addLayer(marker);
      });
    }

    if (resourceFilters.ambulances) {
      AMBULANCES.forEach(amb => {
        const capability = matchResourceRequirement(amb, 'ambulances', currentNeed, COVERAGE_ZONES.find(zone => zone.id === amb.zoneId)?.center);
        const marker = L.marker([amb.location.lat, amb.location.lng], {
          icon: createCustomIcon('🚑', '#FFFBEB', '#D97706', capability.qualified)
        });

        marker.bindTooltip(`
          <div style="font-size:11px; padding:3px 5px; font-weight:600; line-height:1.3; max-width:210px;">
            <div style="font-weight:700; color:${capability.qualified ? '#0f172a' : '#64748b'};">${amb.name}</div>
            <div style="color:${capability.qualified ? '#059669' : '#DC2626'}; font-size:10px; font-weight:700; margin-top:2px;">
              ${capability.qualified ? `✓ Qualified for ${currentNeed.name}` : `⚠️ Dimmed: Lacks ${currentNeed.name} Req.`}
            </div>
            <div style="color:${capability.qualified ? '#475569' : '#94A3B8'}; font-size:9.5px; margin-top:1px;">
              ${capability.reason}
            </div>
          </div>
        `, { direction: 'top' });

        marker.on('click', () => {
          setSelectedResource({ 
            ...amb, 
            _categoryLabel: 'Emergency Dispatch Ambulance', 
            _categoryEmoji: '🚑',
            _capabilityStatus: capability 
          });
        });
        group.addLayer(marker);
      });
    }

    if (resourceFilters.diagnostics) {
      DIAGNOSTICS.forEach(diag => {
        const capability = matchResourceRequirement(diag, 'diagnostics', currentNeed, COVERAGE_ZONES.find(zone => zone.id === diag.zoneId)?.center);
        const marker = L.marker([diag.location.lat, diag.location.lng], {
          icon: createCustomIcon('🧪', '#EFF6FF', '#2563EB', capability.qualified)
        });

        marker.bindTooltip(`
          <div style="font-size:11px; padding:3px 5px; font-weight:600; line-height:1.3; max-width:210px;">
            <div style="font-weight:700; color:${capability.qualified ? '#0f172a' : '#64748b'};">${diag.name}</div>
            <div style="color:${capability.qualified ? '#059669' : '#DC2626'}; font-size:10px; font-weight:700; margin-top:2px;">
              ${capability.qualified ? `✓ Qualified for ${currentNeed.name}` : `⚠️ Dimmed for ${currentNeed.name}`}
            </div>
            <div style="color:${capability.qualified ? '#475569' : '#94A3B8'}; font-size:9.5px; margin-top:1px;">
              ${capability.reason}
            </div>
          </div>
        `, { direction: 'top' });

        marker.on('click', () => {
          setSelectedResource({ 
            ...diag, 
            _categoryLabel: 'Diagnostic & Imaging Lab', 
            _categoryEmoji: '🧪',
            _capabilityStatus: capability 
          });
        });
        group.addLayer(marker);
      });
    }

    if (resourceFilters.pharmacies) {
      PHARMACIES.forEach(pharm => {
        const capability = matchResourceRequirement(pharm, 'pharmacies', currentNeed, COVERAGE_ZONES.find(zone => zone.id === pharm.zoneId)?.center);
        const marker = L.marker([pharm.location.lat, pharm.location.lng], {
          icon: createCustomIcon('💊', '#ECFDF5', '#059669', capability.qualified)
        });

        marker.bindTooltip(`
          <div style="font-size:11px; padding:3px 5px; font-weight:600; line-height:1.3; max-width:210px;">
            <div style="font-weight:700; color:${capability.qualified ? '#0f172a' : '#64748b'};">${pharm.name}</div>
            <div style="color:${capability.qualified ? '#059669' : '#DC2626'}; font-size:10px; font-weight:700; margin-top:2px;">
              ${capability.qualified ? `✓ Qualified for ${currentNeed.name}` : `⚠️ Dimmed for ${currentNeed.name}`}
            </div>
            <div style="color:${capability.qualified ? '#475569' : '#94A3B8'}; font-size:9.5px; margin-top:1px;">
              ${capability.reason}
            </div>
          </div>
        `, { direction: 'top' });

        marker.on('click', () => {
          setSelectedResource({ 
            ...pharm, 
            _categoryLabel: '24/7 Emergency Pharmacy', 
            _categoryEmoji: '💊',
            _capabilityStatus: capability 
          });
        });
        group.addLayer(marker);
      });
    }

    // 3. Dynamic Simulated Resource Marker with Animated Pulsing Radar Halo
    if (activeSimulation && activeSimulation.simulatedMarker) {
      const sim = activeSimulation.simulatedMarker;
      const simEmoji = sim.type?.toLowerCase().includes('blood') ? '🩸' : sim.type?.toLowerCase().includes('trauma') || sim.type?.toLowerCase().includes('hospital') ? '🏥' : '🚑';
      const simMarker = L.marker([sim.location.lat, sim.location.lng], {
        icon: createSimulatedMarkerIcon(simEmoji),
        zIndexOffset: 1000
      });

      simMarker.bindTooltip(`
        <div style="font-size:11px; padding:4px 6px; font-weight:bold; line-height:1.3; color:#059669;">
          <div>✨ ${sim.name} (Simulated)</div>
          <div style="color:#047857; font-size:10px; margin-top:1px;">Live Virtual Intervention Active</div>
        </div>
      `, { permanent: true, direction: 'top', className: 'sim-permanent-tooltip' });

      simMarker.on('click', () => {
        setSelectedResource({
          id: sim.id,
          name: sim.name,
          type: sim.type || 'Simulated Advanced Resource',
          _categoryLabel: 'Simulated Virtual Intervention',
          _categoryEmoji: simEmoji,
          address: 'Stationed at high-incidence corridor',
          hours: '24/7 Simulated Deployment',
          contact: 'Virtual Simulation Protocol',
          _capabilityStatus: {
            qualified: true,
            reason: 'Deploys dedicated clinical capacity directly into previously isolated bottleneck sector.'
          }
        });
      });

      group.addLayer(simMarker);
    }
  }, [selectedNeedId, resourceFilters, activeSimulation, currentNeed]);

  return (
    <div className="relative w-full h-[620px] rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-slate-100">
      {/* CSS Keyframes & Smooth SVG Polygon Transitions */}
      <style>{`
        @keyframes simRadarPulse {
          0% { transform: scale(0.5); opacity: 0.85; }
          60% { transform: scale(1.6); opacity: 0.3; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes simRingPulse {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(2.1); opacity: 0; }
        }
        .medcoverage-zone-polygon {
          transition: fill 1.2s cubic-bezier(0.4, 0, 0.2, 1),
                      fill-opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1),
                      stroke 1.2s cubic-bezier(0.4, 0, 0.2, 1),
                      stroke-width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sim-permanent-tooltip {
          background-color: #ECFDF5 !important;
          border: 1.5px solid #10B981 !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2) !important;
        }
      `}</style>

      {/* Leaflet Map Root */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Legend (Top Left) */}
      <div className="absolute top-4 left-4 z-400 max-w-xs pointer-events-auto">
        <MapLegend 
          resourceFilters={resourceFilters} 
          toggleFilter={toggleFilter}
          selectedNeedId={selectedNeedId}
          activeSimulation={activeSimulation}
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
            selectedNeedId={selectedNeedId}
            activeSimulation={activeSimulation}
            onClose={() => setSelectedZone(null)}
            onSimulateIntervention={onSimulateIntervention}
          />
        </div>
      )}

      {selectedResource && (
        <div className="absolute bottom-4 right-4 z-400 pointer-events-auto">
          <ResourceDetailModal
            resource={selectedResource}
            selectedNeedId={selectedNeedId}
            onClose={() => setSelectedResource(null)}
          />
        </div>
      )}
    </div>
  );
}