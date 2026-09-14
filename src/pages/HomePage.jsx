import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Stethoscope, Sliders, BarChart3, Info, ArrowUpRight, Sparkles } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function HomePage() {
  const cards = [
    {
      to: '/coverage',
      icon: MapPin,
      badge: '🗺️ Coverage',
      title: 'Coverage Map',
      desc: 'Explore healthcare coverage and medical dead zones across metropolitan sectors.',
      highlight: 'Interactive GIS',
      delay: 0.1,
    },
    {
      to: '/needs',
      icon: Stethoscope,
      badge: '🩺 Medical Needs',
      title: 'Medical Needs',
      desc: 'Check whether the resources required for a specific medical condition are accessible.',
      highlight: 'Requirement Engine',
      delay: 0.15,
    },
    {
      to: '/what-if',
      icon: Sliders,
      badge: '⚡ What-If',
      title: 'What-If Simulation',
      desc: 'Simulate adding, removing or relocating healthcare resources before capital investment.',
      highlight: 'Virtual Lab',
      delay: 0.2,
    },
    {
      to: '/insights',
      icon: BarChart3,
      badge: '📊 Insights',
      title: 'Healthcare Insights',
      desc: 'View healthcare coverage statistics and regional resource analytics.',
      highlight: 'Recharts Intelligence',
      delay: 0.25,
    },
    {
      to: '/about',
      icon: Info,
      badge: 'ℹ️ About',
      title: 'About MedCoverage',
      desc: 'Understand MedCoverage and how spatial clinical accessibility is calculated.',
      highlight: 'Manifesto & Vision',
      delay: 0.3,
    },
  ];

  return (
    <PageTransition>
      <div className="flex-1 flex flex-col justify-between p-5 sm:p-8 lg:p-12 text-center select-none">
        {/* Subtle Window Top Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-slate-400 uppercase pb-4 border-b border-white/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-red-600 -ml-3"></span>
            <span className="font-bold text-slate-800">Spatial Clinical Intelligence</span>
          </div>
          <span className="hidden sm:inline text-slate-500">v2.5 • Glass Architecture</span>
        </div>

        {/* ========================================================================= */}
        {/* PREMIUM GLASS HERO BRAND BLOCK (Directly matching user's uploaded image) */}
        {/* ========================================================================= */}
        <motion.div 
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative my-6 sm:my-10 max-w-xl mx-auto w-full"
        >
          {/* Ambient Specular Red Glow Refraction behind glass */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-red-500/20 via-red-500/5 to-transparent blur-xl pointer-events-none" />

          {/* Frosted Glass Capsule Container */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-white/75 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.14),0_0_0_1px_rgba(255,255,255,0.8)_inset,0_1px_3px_rgba(220,38,38,0.1)] flex flex-col items-center justify-center space-y-4">
            
            {/* The Signature Rounded-Square Red Pulse Icon */}
            <motion.div
              whileHover={{ 
                scale: 1.08, 
                rotate: [0, -3, 3, -1.5, 0],
                transition: { duration: 0.5, ease: "easeInOut" }
              }}
              className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-[26px] bg-gradient-to-br from-red-600 to-red-700 text-white shadow-[0_12px_28px_-4px_rgba(220,38,38,0.45),inset_0_1px_2px_rgba(255,255,255,0.6)] ring-4 ring-white/90 cursor-pointer"
            >
              {/* Clean White ECG Waveform SVG */}
              <svg 
                className="w-12 h-12 sm:w-14 sm:h-14 stroke-white fill-none stroke-[3.5]" 
                viewBox="0 0 24 24" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>

              {/* Gentle ambient pulse highlight */}
              <span className="absolute inset-0 rounded-[26px] ring-2 ring-red-400/40 animate-pulse pointer-events-none" />
            </motion.div>

            {/* Brand Title: Med (Black/Slate) + Coverage (Red) */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-none pt-1">
              Med<span className="text-red-600">Coverage</span>
            </h1>

            {/* Subtitle & Supporting Statement */}
            <div className="space-y-1.5 pt-1 text-center">
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Healthcare access, measured.
              </p>
              <p className="text-sm sm:text-base text-slate-500 font-medium">
                Know what care is reachable. Know what is missing.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 5 GLASS NAVIGATION BUTTONS WITH JIGGLE / SPRING MICRO-INTERACTIONS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-4 text-left">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.to}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: card.delay, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ 
                  y: -7,
                  rotate: [0, -1.8, 1.8, -0.8, 0],
                  transition: { duration: 0.45, ease: "easeInOut" }
                }}
                whileTap={{ scale: 0.94, rotate: 0 }}
                className="h-full"
              >
                <Link
                  to={card.to}
                  className="glass-card group relative overflow-hidden p-4 sm:p-5 rounded-2xl flex flex-col justify-between h-full cursor-pointer hover:border-red-500/50 hover:shadow-[0_16px_32px_-6px_rgba(220,38,38,0.2),inset_0_1px_2px_rgba(255,255,255,1)]"
                >
                  {/* Glossy Sheen Sweep Effect on Hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold text-slate-800 bg-white/80 px-2.5 py-0.5 rounded-lg border border-white/90 shadow-2xs group-hover:bg-red-50 group-hover:text-red-700 transition-colors">
                        {card.badge}
                      </span>
                      <motion.div
                        className="p-1 rounded-md bg-white/60 group-hover:bg-red-600 group-hover:text-white transition-colors"
                        whileHover={{ scale: 1.15 }}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                      </motion.div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-red-600 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-red-600 transition-colors">
                        {card.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span>{card.highlight}</span>
                    <span className="text-red-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Explore →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Window Footer */}
        <div className="pt-3 border-t border-white/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>“Where are the hospitals?” vs <strong className="text-slate-800">“Can people reach the right care?”</strong></span>
          <span className="font-mono text-[11px] text-slate-400">Map → Analyze → Explain → Simulate → Improve</span>
        </div>
      </div>
    </PageTransition>
  );
}