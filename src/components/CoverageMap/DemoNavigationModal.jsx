import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { X, Navigation, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DemoNavigationModal({ hospital, origin, currentNeed, onClose }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    if (!mapContainerRef.current || !hospital || !origin) return;

    // Clean up any existing map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const origLat = origin.location.lat;
    const origLng = origin.location.lng;
    const destLat = hospital.location.lat;
    const destLng = hospital.location.lng;

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Mapbox Light-v11 raster tiles
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

    // 1. Origin Marker (Simulated Current Location)
    const originIcon = L.divIcon({
      className: 'demo-origin-marker',
      html: `
        <div style="position:relative; display:flex; align-items:center; justify-content:center;">
          <div style="width:20px; height:20px; border-radius:50%; background:#2563EB; border:3px solid #ffffff; box-shadow:0 0 14px rgba(37,99,235,0.7);"></div>
          <div style="position:absolute; width:36px; height:36px; border-radius:50%; background:rgba(37,99,235,0.25); animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const originMarker = L.marker([origLat, origLng], { icon: originIcon }).addTo(map);
    originMarker.bindTooltip(`
      <div style="font-size:11px; font-weight:700; color:#0F172A; padding:2px 4px;">
        📍 Simulated Origin<br/><span style="color:#2563EB; font-weight:600;">${origin.name}</span>
      </div>
    `, { permanent: true, direction: 'top', offset: [0, -10] });

    // 2. Destination Marker (Selected Hospital)
    const statusColor = hospital.status === 'green' ? '#10B981' : hospital.status === 'yellow' ? '#F59E0B' : '#EF4444';
    const destIcon = L.divIcon({
      className: 'demo-dest-marker',
      html: `
        <div style="position:relative; display:flex; flex-direction:column; align-items:center;">
          <div style="background:${statusColor}; color:#ffffff; font-weight:900; font-size:12px; width:30px; height:30px; border-radius:8px; border:2px solid #ffffff; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.25);">
            🏥
          </div>
          <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid ${statusColor}; margin-top:-1px;"></div>
        </div>
      `,
      iconSize: [30, 36],
      iconAnchor: [15, 36],
    });

    const destMarker = L.marker([destLat, destLng], { icon: destIcon }).addTo(map);
    destMarker.bindTooltip(`
      <div style="font-size:11px; font-weight:700; color:#0F172A; padding:2px 4px;">
        🏥 Destination<br/><span style="color:${statusColor}; font-weight:800;">${hospital.name}</span>
      </div>
    `, { permanent: true, direction: 'top', offset: [0, -38] });

    // 3. Realistic Arterial Road Route Simulation (interpolating 2 road bends)
    const midLat1 = origLat + (destLat - origLat) * 0.35 + (destLng - origLng) * 0.12;
    const midLng1 = origLng + (destLng - origLng) * 0.35 - (destLat - origLat) * 0.12;

    const midLat2 = origLat + (destLat - origLat) * 0.70 - (destLng - origLng) * 0.08;
    const midLng2 = origLng + (destLng - origLng) * 0.70 + (destLat - origLat) * 0.08;

    const routeCoords = [
      [origLat, origLng],
      [midLat1, midLng1],
      [midLat2, midLng2],
      [destLat, destLng]
    ];

    // Shadow line for depth
    L.polyline(routeCoords, {
      color: '#0F172A',
      weight: 6,
      opacity: 0.15,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Main vibrant arterial route line
    L.polyline(routeCoords, {
      color: statusColor,
      weight: 4,
      opacity: 0.9,
      dashArray: hospital.status === 'red' ? '6, 6' : null,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Fit map view to encompass both origin and destination with padding
    const bounds = L.latLngBounds([
      [origLat, origLng],
      [destLat, destLng]
    ]);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [hospital, origin, mapboxToken]);

  if (!hospital || !origin) return null;

  const statusBadge = hospital.status === 'green' 
    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
    : hospital.status === 'yellow' 
      ? 'bg-amber-50 text-amber-800 border-amber-200' 
      : 'bg-red-50 text-red-800 border-red-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  DEMO MODE • SIMULATED NAVIGATION ROUTE
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge}`}>
                  {hospital.effectiveScore}% Effective Access
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                Route Guidance to {hospital.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
            title="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Details Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-white border-b border-slate-100 text-xs">
          
          {/* Origin & Destination Nodes */}
          <div className="sm:col-span-7 space-y-1.5 border-r border-slate-100 sm:pr-4">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
              <span className="font-medium text-slate-500 text-[11px]">Simulated Origin:</span>
              <strong className="text-slate-900 font-bold truncate">{origin.name}</strong>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
              <span className="font-medium text-slate-500 text-[11px]">Hospital Destination:</span>
              <strong className="text-slate-900 font-bold truncate">{hospital.name}</strong>
            </div>
            <div className="text-[11px] text-slate-500 italic pt-0.5">
              Corridor: <strong className="text-slate-700 not-italic font-semibold">{hospital.corridor}</strong>
            </div>
          </div>

          {/* Distance & Golden Hour Check */}
          <div className="sm:col-span-5 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 sm:pl-2">
            <div className="text-right">
              <div className="text-lg font-black text-slate-900">
                {hospital.distKm} km • ~{hospital.estTimeMin} min
              </div>
              <span className={`text-[11px] font-bold ${hospital.estTimeMin <= (currentNeed?.goldenWindowMin || 30) ? 'text-emerald-700' : 'text-amber-700'}`}>
                {hospital.estTimeMin <= (currentNeed?.goldenWindowMin || 30) ? '✓ Within Golden Hour Window' : '⚠️ Exceeds Recommended Window'}
              </span>
            </div>
          </div>

        </div>

        {/* Interactive Leaflet + Mapbox Route Map */}
        <div className="relative flex-1 min-h-[320px] sm:min-h-[380px] w-full bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full" />
          
          {/* Floating Map Watermark */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-200 text-[10px] font-bold text-slate-600 shadow-xs pointer-events-none">
            📍 Simulated Route: {origin.name.split(' ')[0]} ➔ {hospital.name.split(' ')[0]}
          </div>
        </div>

        {/* Clinical Capabilities Confirmation & Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-1 rounded-md text-[11px] font-bold border ${
              hospital.bloodAvailable ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {hospital.bloodAvailable ? '✓ Blood Bank Ready' : '⚠ Blood Stockout Risk'}
            </span>

            <span className={`px-2 py-1 rounded-md text-[11px] font-bold border ${
              hospital.traumaReady ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {hospital.traumaReady ? '✓ Trauma Bay Ready' : '✕ No Trauma Bay'}
            </span>

            <span className="px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold">
              ICU: {hospital.availableIcuBeds} beds free
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              to="/coverage"
              onClick={onClose}
              className="flex-1 sm:flex-initial py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              <span>View Full Coverage Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs"
            >
              Close Guidance
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
