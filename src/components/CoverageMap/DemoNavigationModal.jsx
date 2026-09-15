import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Navigation, ExternalLink, Copy, Check, Clock, Loader2, 
  ShieldCheck, AlertTriangle, Activity, UserCheck, Stethoscope, 
  Bed, FileText, ChevronDown, ChevronUp, Compass, Phone, Info, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchMapboxDirections } from '../../services/mapboxDirections';
import { getHospitalCapabilityProfile } from '../../engine/capabilityIntelligence';

export default function DemoNavigationModal({ hospital, origin, currentNeed, selectedZoneId, onClose }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayersRef = useRef([]);

  const [activeTab, setActiveTab] = useState('capabilities'); // 'capabilities' | 'route'
  const [copied, setCopied] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [activeRouteType, setActiveRouteType] = useState('primary'); // 'primary' | 'backup'
  const [simulateDelay, setSimulateDelay] = useState(false);
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);
  const [showDataDetails, setShowDataDetails] = useState(false);

  const navigate = useNavigate();
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  // Compute capability intelligence profile for the selected hospital & emergency
  const profile = getHospitalCapabilityProfile(hospital, currentNeed?.id || 'severe_bleeding');

  // Active route info
  const primaryRoute = routeData?.primary || null;
  const backupRoute = routeData?.backup || null;
  const hasAlternative = routeData?.hasAlternative || false;

  const currentActiveRoute = activeRouteType === 'backup' && backupRoute ? backupRoute : primaryRoute;

  // Simulate +12m delay on primary route for traffic demonstration
  const primaryEffectiveDuration = primaryRoute 
    ? (simulateDelay ? primaryRoute.durationMin + 12 : primaryRoute.durationMin)
    : hospital.estTimeMin;
  
  const backupEffectiveDuration = backupRoute ? backupRoute.durationMin : null;
  const goldenWindowMin = currentNeed?.goldenWindowMin || 30;

  const primaryInWindow = primaryEffectiveDuration <= goldenWindowMin;
  const backupInWindow = backupEffectiveDuration ? backupEffectiveDuration <= goldenWindowMin : false;

  const currentDuration = activeRouteType === 'backup' && backupRoute 
    ? backupEffectiveDuration 
    : primaryEffectiveDuration;
  const currentDistance = currentActiveRoute?.distanceKm || hospital.distKm;
  const currentInWindow = currentDuration <= goldenWindowMin;

  const handleCopyTelemetry = () => {
    const roadSeq = currentActiveRoute?.roadNames?.join(' -> ') || hospital.corridor || 'Direct Arterial';
    const text = `[MEDCOVERAGE DISPATCH TELEMETRY]
Hospital: ${hospital.name}
Condition: ${currentNeed.name} (Golden Window: ${goldenWindowMin} min)
Effective Access: ${profile?.effectiveAccess || hospital.effectiveScore}%
Reason Selected: ${profile?.whyHeadline}
Required Capabilities: ${profile?.capabilities.filter(c => c.available).map(c => c.label).join(', ')}
Care Pathway Satisfied: ${profile?.pathway.filter(p => p.satisfied).map(p => p.label).join(' -> ')}
Specialist Coverage: ${profile?.specialists.map(s => `${s.role} (${s.status})`).join(' | ')}
Data Provenance: Structured Demo Dataset (Prototype)
Origin: ${origin.name}
Active Corridor: ${activeRouteType.toUpperCase()} (${roadSeq})
Primary Route: ${primaryRoute?.distanceKm || hospital.distKm} km | ~${primaryEffectiveDuration} min (${primaryInWindow ? 'WITHIN WINDOW' : 'EXCEEDS WINDOW'})${simulateDelay ? ' [DEMO DELAY ACTIVE]' : ''}
Backup Route: ${hasAlternative ? `${backupRoute.distanceKm} km | ~${backupRoute.durationMin} min (${backupInWindow ? 'WITHIN WINDOW' : 'EXCEEDS WINDOW'})` : 'Alternative unavailable'}
Contact: ${hospital.contact}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenInCoverageMap = () => {
    onClose();
    navigate('/coverage', {
      state: {
        routeData: {
          hospital,
          origin,
          need: currentNeed,
          selectedDiseaseId: currentNeed.id,
          selectedZoneId: selectedZoneId || origin.zoneId,
          activeRouteType,
        }
      }
    });
  };

  const renderPolylines = (data, activeType) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    routeLayersRef.current.forEach(l => {
      try { map.removeLayer(l); } catch(e) {}
    });
    routeLayersRef.current = [];

    const pCoords = data?.primary?.coordinates || [];
    const bCoords = data?.backup?.coordinates || [];

    // Draw Backup Route
    if (bCoords.length > 0) {
      const isBackupActive = activeType === 'backup';
      const bShadow = L.polyline(bCoords, {
        color: isBackupActive ? '#0369A1' : '#475569',
        weight: isBackupActive ? 7 : 4,
        opacity: isBackupActive ? 0.25 : 0.1,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      const bMain = L.polyline(bCoords, {
        color: isBackupActive ? '#0284C7' : '#64748B',
        weight: isBackupActive ? 4.5 : 3.5,
        opacity: isBackupActive ? 0.95 : 0.5,
        dashArray: isBackupActive ? undefined : '6, 6',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      routeLayersRef.current.push(bShadow, bMain);
    }

    // Draw Primary Route
    if (pCoords.length > 0) {
      const isPrimaryActive = activeType === 'primary';
      const pShadow = L.polyline(pCoords, {
        color: isPrimaryActive ? '#1E3A8A' : '#475569',
        weight: isPrimaryActive ? 7 : 4,
        opacity: isPrimaryActive ? 0.25 : 0.1,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      const pMain = L.polyline(pCoords, {
        color: isPrimaryActive ? '#2563EB' : '#64748B',
        weight: isPrimaryActive ? 4.5 : 3.5,
        opacity: isPrimaryActive ? 0.95 : 0.5,
        dashArray: isPrimaryActive ? undefined : '6, 6',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      routeLayersRef.current.push(pShadow, pMain);
    }

    const activeCoords = (activeType === 'backup' && bCoords.length > 0) ? bCoords : pCoords;
    if (activeCoords.length > 0) {
      try {
        map.fitBounds(L.latLngBounds(activeCoords), { padding: [40, 40], maxZoom: 15 });
      } catch (e) {}
    }
  };

  // Initialize Map whenever activeTab switches to 'route'
  useEffect(() => {
    if (activeTab !== 'route') return;
    if (!mapContainerRef.current || !hospital || !origin) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const origLat = origin.location.lat;
    const origLng = origin.location.lng;
    const destLat = hospital.location.lat;
    const destLng = hospital.location.lng;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    if (mapboxToken) {
      L.tileLayer(
        `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/512/{z}/{x}/{y}@2x?access_token=${mapboxToken}`,
        {
          tileSize: 512,
          zoomOffset: -1,
          maxZoom: 18,
        }
      ).addTo(map);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);
    }

    // Origin Marker
    const originIcon = L.divIcon({
      className: 'demo-origin-marker',
      html: `
        <div style="position:relative; display:flex; align-items:center; justify-content:center;">
          <div style="width:18px; height:18px; border-radius:50%; background:#2563EB; border:3px solid #ffffff; box-shadow:0 0 12px rgba(37,99,235,0.7);"></div>
          <div style="position:absolute; width:32px; height:32px; border-radius:50%; background:rgba(37,99,235,0.25); animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const originMarker = L.marker([origLat, origLng], { icon: originIcon }).addTo(map);
    originMarker.bindTooltip(`
      <div style="font-size:11px; font-weight:700; color:#0F172A; padding:2px 4px;">
        📍 Demo Origin<br/><span style="color:#2563EB; font-weight:600;">${origin.name}</span>
      </div>
    `, { permanent: true, direction: 'top', offset: [0, -10] });

    // Destination Marker (Selected Hospital)
    const statusColor = hospital.status === 'green' ? '#10B981' : hospital.status === 'yellow' ? '#F59E0B' : '#EF4444';
    const destIcon = L.divIcon({
      className: 'demo-dest-marker',
      html: `
        <div style="position:relative; display:flex; flex-direction:column; align-items:center;">
          <div style="background:${statusColor}; color:#ffffff; font-weight:900; font-size:12px; width:28px; height:28px; border-radius:8px; border:2px solid #ffffff; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.25);">
            🏥
          </div>
          <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid ${statusColor}; margin-top:-1px;"></div>
        </div>
      `,
      iconSize: [28, 34],
      iconAnchor: [14, 34],
    });

    const destMarker = L.marker([destLat, destLng], { icon: destIcon }).addTo(map);
    destMarker.bindTooltip(`
      <div style="font-size:11px; font-weight:700; color:#0F172A; padding:2px 4px;">
        🏥 Destination<br/><span style="color:${statusColor}; font-weight:800;">${hospital.name}</span>
      </div>
    `, { permanent: true, direction: 'top', offset: [0, -36] });

    if (routeData) {
      renderPolylines(routeData, activeRouteType);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeTab, hospital, origin, mapboxToken]);

  // Initial fetch for directions
  useEffect(() => {
    if (!hospital || !origin) return;

    setIsLoadingRoute(true);
    fetchMapboxDirections(origin.location, hospital.location)
      .then((directionData) => {
        setRouteData(directionData);
        if (mapInstanceRef.current) {
          renderPolylines(directionData, activeRouteType);
        }
      })
      .catch((err) => {
        console.warn('Mapbox route fetch failed, fallback to straight line:', err);
        const fallbackData = {
          primary: {
            coordinates: [[origin.location.lat, origin.location.lng], [hospital.location.lat, hospital.location.lng]],
            distanceKm: hospital.distKm,
            durationMin: hospital.estTimeMin,
            roadNames: [hospital.corridor || 'Direct Arterial'],
          },
          backup: null,
          hasAlternative: false,
        };
        setRouteData(fallbackData);
        if (mapInstanceRef.current) {
          renderPolylines(fallbackData, 'primary');
        }
      })
      .finally(() => {
        setIsLoadingRoute(false);
      });
  }, [hospital, origin]);

  const handleToggleRoute = (type) => {
    setActiveRouteType(type);
    if (routeData && mapInstanceRef.current) {
      renderPolylines(routeData, type);
    }
  };

  if (!hospital || !origin) return null;

  const statusBadge = hospital.status === 'green' 
    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
    : hospital.status === 'yellow' 
      ? 'bg-amber-50 text-amber-800 border-amber-200' 
      : 'bg-red-50 text-red-800 border-red-200';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        
        {/* ========================================================================= */}
        {/* MODAL HEADER: Hospital, Effective Access, Condition Badge                 */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between gap-3 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                {currentNeed?.name || 'EMERGENCY PROFILE'}
              </span>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${statusBadge}`}>
                {profile?.effectiveAccess}% EFFECTIVE ACCESS
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                • {profile?.effectiveAccessExplainer}
              </span>
            </div>
            
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {hospital.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{hospital.address || hospital.corridor}</span>
              <span>•</span>
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="font-mono">{hospital.contact}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* NAVIGATION TABS: Clinical Capability Intelligence vs Access Route         */}
        {/* ========================================================================= */}
        <div className="px-4 pt-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('capabilities')}
              className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'capabilities'
                  ? 'bg-white text-blue-700 border-t border-x border-slate-200 shadow-2xs -mb-px'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>Care Capability & Availability</span>
            </button>

            <button
              onClick={() => setActiveTab('route')}
              className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'route'
                  ? 'bg-white text-blue-700 border-t border-x border-slate-200 shadow-2xs -mb-px'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>Access Route & Road Map</span>
              {routeData && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-semibold">
                  ~{primaryEffectiveDuration}m
                </span>
              )}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 pb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Matched to {currentNeed?.name}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: CLINICAL CAPABILITY + AVAILABILITY INTELLIGENCE VIEW               */}
        {/* ========================================================================= */}
        {activeTab === 'capabilities' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
            
            {/* 1. WHY THIS HOSPITAL? */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100/90 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>WHY THIS HOSPITAL?</span>
                </div>
                <span className="text-[11px] font-bold text-blue-800">
                  {hospital.effectiveScore}% Effective Access
                </span>
              </div>

              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                "{profile?.whyHeadline}"
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {profile?.whyReasons.map((reason, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-white/90 border border-blue-200/70 text-[11px] text-slate-700 flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. REQUIRED CARE PATHWAY FOR THIS EMERGENCY */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 text-xs uppercase tracking-wider">
                  REQUIRED CARE PATHWAY FOR THIS EMERGENCY
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {profile?.pathway.filter(p => p.satisfied).length} of {profile?.pathway.length} Requirements Satisfied
                </span>
              </div>

              {/* Pathway Pipeline Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {profile?.pathway.map((step, idx) => (
                  <div 
                    key={step.id}
                    className={`p-2 rounded-lg border text-left flex flex-col justify-between ${
                      step.satisfied 
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' 
                        : 'bg-amber-50/60 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold opacity-60">Step {idx + 1}</span>
                      {step.satisfied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-[11px] leading-tight">{step.label}</div>
                      <div className="text-[10px] opacity-75 mt-0.5 truncate">{step.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. CARE CAPABILITIES (RELEVANT TO SELECTED EMERGENCY) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 text-xs uppercase tracking-wider">
                  CARE CAPABILITIES — RELEVANT TO {currentNeed?.name.toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-500">
                  Showing only capabilities required for this emergency
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {profile?.capabilities.map((c) => (
                  <div 
                    key={c.key}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                      c.available 
                        ? 'bg-white border-slate-200 text-slate-900 shadow-2xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <span className="font-bold text-xs">{c.label}</span>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                      c.available 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {c.available ? '✓ AVAILABLE' : '✕ UNAVAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. CURRENT RESOURCE AVAILABILITY & SPECIALIST COVERAGE */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Resource Availability States */}
              <div className="md:col-span-6 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-[11px] uppercase tracking-wider">
                    RESOURCE AVAILABILITY STATUS
                  </span>
                  <span className="text-[10px] text-slate-400">Deterministic Data</span>
                </div>

                <div className="space-y-1.5 divide-y divide-slate-100">
                  {profile?.availabilityItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between pt-1.5 first:pt-0">
                      <span className="text-slate-700 font-medium text-xs">{item.label}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        item.badgeColor === 'green'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : item.badgeColor === 'yellow'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {item.badgeColor === 'green' ? '✓ ' : item.badgeColor === 'yellow' ? '⚠ ' : '✕ '}
                        {item.statusText}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor / Specialist Availability Data Fields */}
              <div className="md:col-span-6 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>SPECIALIST / EMERGENCY COVERAGE</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                      DATA FIELD
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 mt-1 mb-2 leading-tight">
                    On-duty specialist coverage status from structured facility profile.
                  </p>

                  <div className="space-y-1.5 divide-y divide-slate-100">
                    {profile?.specialists.map((spec, idx) => (
                      <div key={idx} className="flex items-center justify-between pt-1.5 first:pt-0">
                        <span className="text-slate-800 font-medium text-xs">{spec.role}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          spec.isAvailable 
                            ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {spec.statusLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 italic">
                  Note: Status represents facility roster profile. Live biometric tracking is not claimed.
                </div>
              </div>

            </div>

            {/* 5. RECOMMENDED ACCESS ROUTE SUMMARY */}
            <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  RECOMMENDED ACCESS ROUTE
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-900 font-bold">
                  <span>{origin.name}</span>
                  <span className="text-slate-400">➔</span>
                  <span className="text-blue-700 font-black">{currentDistance} km · ~{currentDuration} min</span>
                  <span className="text-slate-400">➔</span>
                  <span>{hospital.name}</span>
                </div>
                <div className={`text-[11px] font-bold ${currentInWindow ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {currentInWindow 
                    ? `✓ Within Emergency Accessibility Window (${goldenWindowMin} min limit)`
                    : `⚠️ Exceeds Emergency Accessibility Window (${goldenWindowMin} min limit)`}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('route')}
                className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Navigation className="w-3.5 h-3.5 text-white" />
                <span>View Road Route & Map</span>
              </button>
            </div>

            {/* 6. DATA STATUS / TRUST INDICATOR */}
            <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-800 text-[10px] uppercase tracking-wider">DATA STATUS:</span>
                  <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-semibold">
                    ✓ Structured facility profile
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-semibold">
                    ◷ Latest available dataset
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                    DEMO DATA
                  </span>
                </div>

                <button
                  onClick={() => setShowDataDetails(!showDataDetails)}
                  className="text-blue-600 hover:text-blue-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{showDataDetails ? 'Hide Trust Framework' : 'How MedCoverage Matches Care'}</span>
                  {showDataDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {showDataDetails && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-2 border-t border-slate-200 text-slate-600 space-y-1 text-[11px] leading-relaxed"
                >
                  <p>
                    <strong>Honest Data Representation:</strong> MedCoverage does not assume that the nearest hospital is clinically appropriate. Each emergency is mapped to a required care pathway. We compare those requirements against the hospital's structured capability and availability data, then evaluate whether the matched care is realistically accessible via Mapbox road routing.
                  </p>
                  <p className="text-slate-500 italic">
                    For this prototype, facility capabilities and availability data originate from a deterministic regional healthcare dataset. In production, time-sensitive fields such as blood stock, ICU capacity, and specialist availability would connect to verified hospital-side integration APIs.
                  </p>
                </motion.div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ACCESS ROUTE & INTERACTIVE MAP VIEW                                */}
        {/* ========================================================================= */}
        {activeTab === 'route' && (
          <div className="flex-1 flex flex-col min-h-0">
            
            {/* Primary vs Backup Route Switcher Bar */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Route Corridor:</span>
                
                {/* Primary Toggle */}
                <button
                  onClick={() => handleToggleRoute('primary')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                    activeRouteType === 'primary'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>Primary Route</span>
                  {primaryRoute && <span className="text-[10px] font-medium opacity-80">({primaryEffectiveDuration}m)</span>}
                </button>

                {/* Backup Toggle */}
                {hasAlternative ? (
                  <button
                    onClick={() => handleToggleRoute('backup')}
                    className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                      activeRouteType === 'backup'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-300"></span>
                    <span>Backup Route</span>
                    {backupRoute && <span className="text-[10px] font-medium opacity-80">({backupRoute.durationMin}m)</span>}
                  </button>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-400 text-[10px] font-semibold">
                    Alternative route unavailable for this corridor
                  </span>
                )}
              </div>

              {/* Hackathon Demo Delay Simulation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSimulateDelay(!simulateDelay)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                    simulateDelay
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Demonstrate dynamic rerouting when primary arterial encounters heavy traffic delay"
                >
                  <span>{simulateDelay ? 'Simulated Delay: Active (+12m)' : 'Simulate Delay (+12m)'}</span>
                  <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-amber-200/80 text-amber-900 font-extrabold">DEMO</span>
                </button>
              </div>
            </div>

            {/* Route Details Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 px-4 py-2.5 bg-white border-b border-slate-100 text-xs shrink-0">
              <div className="sm:col-span-7 space-y-1 border-r border-slate-100 sm:pr-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
                  <span className="font-medium text-slate-500 text-[11px]">Demo Origin:</span>
                  <strong className="text-slate-900 font-bold truncate">{origin.name}</strong>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
                  <span className="font-medium text-slate-500 text-[11px]">Destination:</span>
                  <strong className="text-slate-900 font-bold truncate">{hospital.name}</strong>
                  <span className="text-[10px] text-slate-500">(Same destination for backup)</span>
                </div>
                <div className="text-[11px] text-slate-600 pt-0.5 truncate">
                  <span className="font-semibold text-slate-500">Corridor: </span>
                  <strong className="text-slate-800 font-bold">
                    {currentActiveRoute?.roadNames && currentActiveRoute.roadNames.length > 0 
                      ? currentActiveRoute.roadNames.slice(0, 3).join(' ➔ ')
                      : hospital.corridor}
                  </strong>
                </div>
              </div>

              <div className="sm:col-span-5 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 sm:pl-2">
                <div className="text-right">
                  <div className="text-lg font-black text-slate-900">
                    {currentDistance} km • ~{currentDuration} min
                    {simulateDelay && activeRouteType === 'primary' && (
                      <span className="text-xs text-amber-600 font-bold ml-1.5">(+12m delay)</span>
                    )}
                  </div>
                  <span className={`text-[11px] font-bold flex items-center justify-end gap-1 ${
                    currentInWindow ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {currentInWindow ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Within Emergency Accessibility Window</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Outside Emergency Accessibility Window</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Leaflet Map Container */}
            <div className="relative flex-1 min-h-[280px] sm:min-h-[340px] w-full bg-slate-100">
              <div ref={mapContainerRef} className="w-full h-full" />

              <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700 shadow-xs pointer-events-none flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-blue-600 rounded"></span>
                  <span>Primary: {primaryRoute ? `${primaryEffectiveDuration} min` : 'Computing...'}</span>
                </div>
                {hasAlternative && (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-sky-500 rounded border-b border-dashed"></span>
                    <span>Backup: {backupRoute?.durationMin} min ({backupRoute?.roadNames?.[0] || 'Alternative'})</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* FOOTER ACTIONS: Copy Dispatch Brief, Access Route in Full Map, Close     */}
        {/* ========================================================================= */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-1 rounded-md text-[11px] font-bold border ${
              hospital.bloodAvailable ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {hospital.bloodAvailable ? '✓ Blood Bank Ready' : '⚠ Blood Stockout Risk'}
            </span>

            <span className={`px-2 py-1 rounded-md text-[11px] font-bold border ${
              hospital.traumaReady ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {hospital.traumaReady ? '✓ Trauma Bay' : '✕ No Trauma Bay'}
            </span>

            <span className="px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold">
              ICU: {hospital.availableIcuBeds} beds free
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyTelemetry}
              className="flex-1 sm:flex-initial py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs shadow-2xs"
              title="Copy Emergency Brief to Clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{copied ? 'Copied Brief!' : 'Copy Dispatch Brief'}</span>
            </button>

            <button
              onClick={handleOpenInCoverageMap}
              className="flex-1 sm:flex-initial py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              <span>Access Route in Full Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer text-xs border border-slate-200"
            >
              Close
            </button>
          </div>

        </div>

      </motion.div>
    </motion.div>
  );
}
