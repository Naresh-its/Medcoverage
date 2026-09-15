import React from 'react';
import { motion } from 'framer-motion';

export default function BackgroundMotionGraphics() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Ultra-clean luminous white base with fine grid pattern */}
      <div 
        className="absolute inset-0 bg-[#FAFAFA]" 
        style={{
          backgroundImage: `
            radial-gradient(#E2E8F0 1px, transparent 1px),
            radial-gradient(#F1F5F9 1px, #FAFAFA 1px)
          `,
          backgroundSize: '40px 40px, 80px 80px',
          backgroundPosition: '0 0, 20px 20px'
        }}
      />

      {/* 2. Floating Ambient Luminous Orbs (Red & Rose Soft Glows) */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -35, 25, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/6 left-1/5 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-red-500/10 via-rose-400/5 to-transparent blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/5 right-1/6 w-[550px] h-[550px] rounded-full bg-gradient-to-tl from-red-600/8 via-amber-500/4 to-transparent blur-3xl"
      />

      {/* 3. Animated Radar Pulse Rings (Expanding from Center Top & Right) */}
      <div className="absolute top-24 right-1/4 w-80 h-80">
        <motion.div
          animate={{ scale: [0.6, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border border-red-400/25"
        />
        <motion.div
          animate={{ scale: [0.6, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, delay: 2.25, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border border-red-500/20"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500/40" />
      </div>

      {/* 4. Animated ECG Heartbeat Waveform Line across Canvas */}
      <div className="absolute top-1/3 left-0 right-0 h-28 opacity-25 overflow-hidden">
        <svg className="w-[200%] h-full stroke-red-600 fill-none stroke-[2]" viewBox="0 0 1600 100" preserveAspectRatio="none">
          <motion.path
            d="M 0,50 L 300,50 L 320,40 L 330,60 L 340,50 L 360,50 L 375,10 L 390,90 L 405,40 L 420,55 L 435,50 L 800,50 L 820,40 L 830,60 L 840,50 L 860,50 L 875,10 L 890,90 L 905,40 L 920,55 L 935,50 L 1600,50"
            initial={{ strokeDashoffset: 1600, strokeDasharray: 1600 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Second ECG Line at the bottom with slight delay & inverted offset */}
      <div className="absolute bottom-20 left-0 right-0 h-20 opacity-15 overflow-hidden">
        <svg className="w-[200%] h-full stroke-slate-500 fill-none stroke-[1.5]" viewBox="0 0 1600 100" preserveAspectRatio="none">
          <motion.path
            d="M 0,50 L 200,50 L 215,35 L 225,65 L 235,50 L 250,50 L 265,15 L 280,85 L 295,45 L 310,55 L 325,50 L 700,50 L 715,35 L 725,65 L 735,50 L 750,50 L 765,15 L 780,85 L 795,45 L 810,55 L 825,50 L 1600,50"
            initial={{ strokeDashoffset: 0, strokeDasharray: 1600 }}
            animate={{ strokeDashoffset: -1600 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      {/* 5. Clinical Telemetry HUD Markings */}
      <div className="absolute top-6 left-8 text-[10px] font-mono tracking-widest text-slate-400/80 flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          SYS_STATUS: ONLINE
        </span>
        <span className="hidden sm:inline">COORD: 13.0827° N, 80.2707° E</span>
        <span className="hidden md:inline">GOLDEN_HOUR_METRIC: ACTIVE</span>
      </div>

      <div className="absolute bottom-6 right-8 text-[10px] font-mono tracking-widest text-slate-400/80 flex items-center gap-4">
        <span className="hidden sm:inline">TELEMETRY STREAM: 240Hz</span>
        <span>LATENCY: 1.2ms</span>
      </div>
    </div>
  );
}