import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Medical3DBackground from '../components/MotionGraphics/Medical3DBackground';
import { 
  ArrowRight, CheckCircle2, MapPin, Search, Cpu, Zap, 
  ShieldCheck, AlertTriangle, Layers, Database, Compass
} from 'lucide-react';
import { staggerContainer, itemVariants } from '../animations/variants';

export default function AboutPage() {
  const steps = [
    { 
      title: 'MAP', 
      label: '1. MAP',
      desc: 'Ingest and geolocate verified healthcare resources — tertiary hospitals, blood banks, ALS ambulances, and emergency diagnostic centers.' 
    },
    { 
      title: 'ANALYZE', 
      label: '2. ANALYZE',
      desc: 'Evaluate effective clinical accessibility by testing whether patients can reach matching capabilities within critical golden-hour transit limits.' 
    },
    { 
      title: 'EXPLAIN', 
      label: '3. EXPLAIN',
      desc: 'Isolate the precise bottleneck causing coverage failure — identifying whether stockouts, missing trauma tiers, or dispatch delays dominate.' 
    },
    { 
      title: 'IMPROVE', 
      label: '4. IMPROVE',
      desc: 'Simulate strategic infrastructure interventions to test how adding units or blood reserves converts medical dead zones into covered territory.' 
    },
  ];

  const technologies = [
    { name: 'React 19 & Vite', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Design System' },
    { name: 'Mapbox API', category: 'Geospatial Tiles & Directions' },
    { name: 'Leaflet GIS', category: 'Vector Layering' },
    { name: 'Node.js & Express', category: 'Backend Engine' },
    { name: 'Supabase', category: 'Database & Auth' },
  ];

  return (
    <PageTransition className="relative overflow-hidden">
      {/* 3D Medical Tech Visual Background */}
      <Medical3DBackground variant="about" />

      <div className="relative z-10 p-6 sm:p-10 max-w-4xl mx-auto space-y-10 w-full">
        
        {/* 1. Header & Brand Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-3.5 text-left border-b border-slate-200 pb-7"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white shadow-xs">
              <svg 
                className="w-4 h-4 stroke-white fill-none stroke-[2.5]" 
                viewBox="0 0 24 24" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
              MedCoverage Intelligence
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-slate-900 tracking-tight leading-[1.15]">
            Healthcare accessibility intelligence.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-normal max-w-2xl leading-relaxed">
            MedCoverage determines whether the <strong className="text-slate-900 font-semibold">right care</strong> is actually reachable when it matters most.
          </p>
        </motion.div>

        {/* 2. Visual Product Architecture Flow */}
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Intelligence Pipeline
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              How MedCoverage Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((s, idx) => (
              <motion.div 
                key={s.title} 
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: idx * 0.08, ease: "easeOut" }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="p-5 rounded-xl bg-white/95 backdrop-blur-xs border border-slate-200 shadow-2xs space-y-2 hover:border-blue-300 transition-colors"
              >
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 inline-block">
                  {s.label}
                </span>
                <h3 className="text-base font-black text-slate-900">{s.title}</h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. Core Philosophy: PROXIMITY ≠ ACCESS */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45 }}
          className="p-6 sm:p-8 rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200 shadow-2xs space-y-5"
        >
          <div className="flex items-center gap-2 text-blue-700">
            <Compass className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Core Differentiator
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              PROXIMITY ≠ ACCESS
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl font-normal">
              Traditional maps measure pure geodesic distance to any hospital. But during medical emergencies, a nearby facility is clinically ineffective if required modalities are missing:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-[13px]">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold text-sm">Matched Clinical Capability</strong>
                <span className="text-slate-500 text-xs font-normal">Level-1 trauma resuscitation, dedicated stroke CT scanner, or surgical theatre.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold text-sm">Stocked Blood Inventory</strong>
                <span className="text-slate-500 text-xs font-normal">Zero units of matched or universal O− blood causes immediate treatment failure.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold text-sm">Emergency Golden Window</strong>
                <span className="text-slate-500 text-xs font-normal">Transit time factoring real-time turnout must not exceed critical survival limits.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold text-sm">Active ALS Transport</strong>
                <span className="text-slate-500 text-xs font-normal">Advanced life support vehicle availability for fluid resuscitation and oxygenation.</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. Production Technology Stack */}
        <div className="space-y-3.5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Architecture & Stack
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              Production Technologies
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            {technologies.map((t) => (
              <motion.div
                key={t.name}
                whileHover={{ y: -2 }}
                className="p-3.5 rounded-xl bg-white/95 border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs space-y-1 transition-colors"
              >
                <div className="font-bold text-sm text-slate-900">{t.name}</div>
                <div className="text-xs text-slate-500 font-normal">{t.category}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 5. CTA Button with Micro-Interaction */}
        <div className="pt-2">
          <motion.div 
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link
              to="/coverage"
              className="btn-med-primary inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <span>Explore Coverage Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

      </div>
    </PageTransition>
  );
}
