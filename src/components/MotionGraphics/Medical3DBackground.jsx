import React from 'react';
import { motion } from 'framer-motion';

/**
 * Medical3DBackground
 * A sophisticated semi-transparent 3D anatomical cardiovascular & telemetry
 * network positioned primarily toward the right side of the viewport.
 * 
 * Live Medical Animations:
 * A. ECG / Heartbeat line: slowly traces, pauses, repeats naturally in blue/green palette.
 * B. Medical Network Nodes: connection points pulse softly at staggered intervals.
 * C. Soft Medical Pulse: calm ambient scale (1.0 -> 1.04 -> 1.0 over 4-5s).
 * D. Subtle Floating Motion: translateY(0 -> -5px -> 0) over 6s, zero rotation.
 */
export default function Medical3DBackground({ variant = 'hero', className = '' }) {
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div 
      className={`pointer-events-none select-none absolute inset-0 overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Ambient Medical Glow (Initial powering-on atmosphere) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.38 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="absolute top-0 right-0 w-[550px] lg:w-[750px] h-[550px] lg:h-[750px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.14) 0%, rgba(16, 185, 129, 0.08) 45%, transparent 70%)'
        }}
      />

      {/* 2. Floating 3D Cardiovascular Structure with calm vertical float (D: 0 -> -5px -> 0 over 6s) */}
      <motion.div
        className="absolute -top-6 lg:top-4 right-[-40px] sm:right-[-20px] lg:right-4 w-[340px] sm:w-[460px] lg:w-[600px] h-[360px] sm:h-[480px] lg:h-[620px] opacity-[0.12] sm:opacity-[0.14] lg:opacity-[0.18]"
        animate={prefersReducedMotion ? {} : {
          y: [0, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg 
          viewBox="0 0 500 500" 
          className="w-full h-full filter drop-shadow-[0_12px_32px_rgba(37,99,235,0.10)]"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="medAortaGrad" x1="180" y1="60" x2="320" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0284C7" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
            </linearGradient>

            <linearGradient id="medVentricleGrad" x1="160" y1="200" x2="360" y2="440" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
            </linearGradient>

            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="vesselStroke" x1="100" y1="100" x2="400" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#0284C7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Background Volumetric Chamber Form */}
          <path
            d="M 250,150 
               C 210,110 160,130 160,190 
               C 160,250 200,310 250,420 
               C 300,310 350,250 350,190 
               C 350,130 295,110 250,150 Z"
            fill="url(#medVentricleGrad)"
            stroke="url(#medAortaGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Superior Vena Cava & Ascending Aortic Arch */}
          <path
            d="M 210,150 C 205,100 230,60 275,60 C 310,60 325,90 320,135 C 315,180 300,210 270,240"
            stroke="url(#medAortaGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Branching Arteries */}
          <path d="M 250,62 L 250,30" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 275,60 L 285,32" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 300,68 L 320,38" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />

          {/* Pulmonary Artery Bifurcation */}
          <path
            d="M 180,140 C 210,150 240,165 290,150 C 320,140 350,160 365,175"
            stroke="url(#vesselStroke)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeDasharray="6 3"
          />

          {/* Wireframe Latitudes & Longitudes */}
          <path d="M 175,190 C 220,215 285,215 335,190" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.4" />
          <path d="M 185,240 C 225,270 280,270 320,240" stroke="#0284C7" strokeWidth="1" strokeOpacity="0.35" />
          <path d="M 205,300 C 235,330 270,330 298,300" stroke="#10B981" strokeWidth="1" strokeOpacity="0.3" />
          <path d="M 250,150 Q 250,280 250,418" stroke="#2563EB" strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="3 3" />

          {/* Coronary Artery Micro-Network */}
          <path d="M 255,190 Q 240,240 220,280 Q 205,310 215,350" stroke="url(#vesselStroke)" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 235,250 Q 260,270 275,320 Q 285,345 275,380" stroke="url(#vesselStroke)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 220,280 Q 200,295 190,325" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 268,295 Q 295,305 315,340" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" />

          {/* B & C: Animated Medical Network Nodes with soft staggered pulsing (scale 1.0 -> 1.04 -> 1.0) */}
          <circle cx="250" cy="30" r="3.5" fill="#2563EB" />
          <circle cx="285" cy="32" r="3" fill="#0284C7" />
          <circle cx="320" cy="38" r="3.5" fill="#059669" />
          
          {/* Node 1: Main Myocardial Center Node */}
          <motion.circle 
            cx="255" 
            cy="190" 
            r="4.5" 
            fill="url(#nodeGlow)"
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.04, 1],
              opacity: [0.75, 1, 0.75]
            }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Node 2: Left Ventricle Modality Node */}
          <motion.circle 
            cx="220" 
            cy="280" 
            r="3.5" 
            fill="url(#nodeGlow)"
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.04, 1],
              opacity: [0.65, 0.95, 0.65]
            }}
            transition={{ duration: 3.8, repeat: Infinity, delay: 1.2, ease: "easeInOut" }}
          />

          {/* Node 3: Right Ventricle Resuscitation Node */}
          <motion.circle 
            cx="275" 
            cy="320" 
            r="4" 
            fill="url(#nodeGlow)"
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.04, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 4.6, repeat: Infinity, delay: 2.2, ease: "easeInOut" }}
          />

          {/* Node 4: Apex Terminal Node */}
          <motion.circle 
            cx="250" 
            cy="418" 
            r="4.5" 
            fill="#10B981"
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.04, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
          />
          
          {/* Soft Telemetry Radar Rings with subtle staggered expansion */}
          <motion.circle 
            cx="255" 
            cy="190" 
            r="16" 
            stroke="#10B981" 
            strokeWidth="0.8" 
            strokeDasharray="2 3"
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.08, 1],
              opacity: [0.5, 0.2, 0.5]
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle 
            cx="275" 
            cy="320" 
            r="12" 
            stroke="#3B82F6" 
            strokeWidth="0.8" 
            strokeDasharray="2 2" 
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.08, 1],
              opacity: [0.45, 0.15, 0.45]
            }}
            transition={{ duration: 4.0, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
          />

          {/* Connecting Healthcare Resource Synapse Line */}
          <motion.line
            x1="255" y1="190" x2="275" y2="320"
            stroke="#38BDF8"
            strokeWidth="0.8"
            strokeDasharray="3 3"
            animate={prefersReducedMotion ? {} : {
              opacity: [0.25, 0.6, 0.25]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      {/* 3. A: LIVE ECG / HEARTBEAT TRACE ANIMATION (Top-Right Background Monitor) */}
      <div className="absolute top-28 sm:top-36 right-4 sm:right-10 lg:right-16 w-44 sm:w-56 h-10 hidden sm:block opacity-[0.22] lg:opacity-[0.28]">
        <svg viewBox="0 0 200 40" className="w-full h-full overflow-visible" fill="none">
          {/* Faint static baseline reference */}
          <path
            d="M 0,20 L 200,20"
            stroke="#CBD5E1"
            strokeWidth="0.8"
            strokeDasharray="2 4"
            opacity="0.5"
          />

          {/* Animated Clinical ECG Trace (slow draw -> pause -> gentle repeat) */}
          <motion.path
            d="M 0,20 L 40,20 L 48,20 L 53,16 L 58,24 L 64,4 L 71,36 L 77,14 L 82,22 L 88,20 L 108,20 C 118,20 125,14 135,20 L 200,20"
            stroke="url(#ecgGradient)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={prefersReducedMotion ? { pathLength: 1, opacity: 0.3 } : {
              pathLength: [0, 1, 1, 0],
              opacity: [0, 0.85, 0.85, 0]
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              times: [0, 0.55, 0.85, 1],
              ease: "easeInOut"
            }}
          />

          {/* Soft lead pulse point at R-peak */}
          <motion.circle
            cx="64"
            cy="4"
            r="2.5"
            fill="#10B981"
            initial={{ opacity: 0 }}
            animate={prefersReducedMotion ? {} : {
              opacity: [0, 0, 0.9, 0],
              scale: [0.8, 0.8, 1.4, 0.8]
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              times: [0, 0.16, 0.22, 0.35],
              ease: "easeOut"
            }}
          />

          <defs>
            <linearGradient id="ecgGradient" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="40%" stopColor="#0284C7" />
              <stop offset="70%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 4. Clinical Telemetry Coordinate Readout (Bottom Right) */}
      <div className="absolute bottom-8 right-12 opacity-[0.12] hidden lg:block font-mono text-[10px] text-slate-500 space-y-0.5 text-right">
        <div>SYS_CARDIOVASCULAR_MAP: ACTIVE</div>
        <div>HEURISTIC_DEPTH_TIER: L3_TRAUMA</div>
        <div>VECTOR_GRID: 13.0827N / 80.2707E</div>
      </div>
    </div>
  );
}
