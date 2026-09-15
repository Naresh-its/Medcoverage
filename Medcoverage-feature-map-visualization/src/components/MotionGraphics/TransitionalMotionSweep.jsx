import React from 'react';
import { motion } from 'framer-motion';

export default function TransitionalMotionSweep({ pageKey }) {
  return (
    <div key={pageKey} className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* 1. Fast Glowing Crimson Laser Scanline */}
      <motion.div
        initial={{ x: '-100%', opacity: 0.8 }}
        animate={{ x: '200%', opacity: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 bottom-0 w-48 bg-gradient-to-r from-transparent via-red-500/25 to-transparent blur-md"
      />

      {/* 2. Razor-thin Crisp Pulse Beam */}
      <motion.div
        initial={{ x: '-100%', opacity: 1 }}
        animate={{ x: '200%', opacity: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(220,38,38,0.8)]"
      />

      {/* 3. ECG Heartbeat Audio-Visual Blip that bursts in center */}
      <motion.div
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: [0, 1.2, 0], opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_12px_rgba(220,38,38,0.9)] origin-center"
      />
    </div>
  );
}