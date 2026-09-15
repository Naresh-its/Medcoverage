import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, ShieldAlert, Clock, CheckCircle, ShieldCheck, Activity } from 'lucide-react';
import { staggerContainer, itemVariants } from '../../animations/variants';

function AnimatedNumber({ value }) {
  const match = String(value).match(/^([0-9.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : null;
  const suffix = match ? match[2] : '';
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (target === null) return;
    const duration = 850;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round((target * ease) * 10) / 10;
      setDisplay(Number.isInteger(target) ? Math.round(current) : current.toFixed(1));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    const req = requestAnimationFrame(step);
    return () => cancelAnimationFrame(req);
  }, [target]);

  if (target === null) return <span>{value}</span>;
  return <span>{display}{suffix}</span>;
}

export default function AnalyticsDashboard() {
  // Key Intelligence KPIs with polished typography
  const kpis = [
    { 
      label: 'Overall Effective Coverage', 
      value: '72%', 
      change: '+4.2%', 
      sub: 'Regional accessibility',
      accent: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    { 
      label: 'Emergency Care Coverage', 
      value: '64%', 
      change: '+2.1%', 
      sub: 'Trauma & resuscitation ready',
      accent: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    { 
      label: 'Population Covered', 
      value: '1.8M', 
      change: '82% of pop', 
      sub: 'Within golden window',
      accent: 'text-slate-700 bg-slate-100 border-slate-200'
    },
    { 
      label: 'Medical Dead Zone %', 
      value: '14%', 
      change: '2 sectors', 
      sub: 'Critical access breach',
      accent: 'text-red-700 bg-red-50 border-red-200',
      isCritical: true
    },
    { 
      label: 'Avg Emergency Response', 
      value: '18 min', 
      change: '-4 min', 
      sub: 'Standard is 15 min',
      accent: 'text-amber-800 bg-amber-50 border-amber-200'
    },
  ];

  // Access Gap Breakdown ("Why Coverage Falls")
  const accessGapFactors = [
    { factor: 'Missing Specialized Modality', pct: 32, desc: 'Lacks Level-1 trauma bay, 24/7 CT scanner, or ICU bed' },
    { factor: 'Physical Distance & Transit', pct: 28, desc: 'Distance exceeds condition golden-window threshold' },
    { factor: 'Blood Bank Stockout (O-)', pct: 24, desc: 'Emergency blood unstocked or beyond rapid delivery radius' },
    { factor: 'Ambulance Turnout Delay', pct: 16, desc: 'No locally stationed ALS vehicle available for stat dispatch' },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Staggered KPI Cards with Animated Numbers */}
      <motion.div 
        variants={staggerContainer(0.07)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {kpis.map((kpi, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="p-4 sm:p-5 rounded-xl bg-white/95 backdrop-blur-xs border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block truncate">
              {kpi.label}
            </span>
            <div className={`text-3xl sm:text-4xl font-black mt-1.5 ${kpi.isCritical ? 'text-red-600' : 'text-slate-900'}`}>
              <AnimatedNumber value={kpi.value} />
            </div>
            <div className="flex items-center justify-between text-xs mt-2.5 pt-2 border-t border-slate-100">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${kpi.accent}`}>
                {kpi.change}
              </span>
              <span className="text-[11px] text-slate-500 font-medium truncate">{kpi.sub}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 2. REPLACED BOTH CHARTS: ONE CLEAN VISUAL SECTION — "COVERAGE AT A GLANCE" */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="p-6 sm:p-7 rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200 shadow-2xs space-y-5"
      >
        <div className="border-b border-slate-100 pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
              Accessibility Overview
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Coverage at a Glance
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-slate-500 font-medium">
            Evaluated across 8 metropolitan sectors against golden-hour limits
          </span>
        </div>

        {/* 3 Large Percentage/Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          
          {/* Indicator 1: 🟢 COVERED */}
          <div className="p-5 sm:p-6 rounded-xl border border-emerald-200/90 bg-emerald-50/40 hover:bg-emerald-50/70 transition-colors space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-4xl sm:text-5xl font-black text-emerald-700 tracking-tight">
                <AnimatedNumber value="92%" />
              </div>
              <div className="pt-2 pb-1">
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  COVERED
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-1">
              Required emergency care is reachable within the accessibility window.
            </p>
          </div>

          {/* Indicator 2: 🟡 LIMITED */}
          <div className="p-5 sm:p-6 rounded-xl border border-amber-200/90 bg-amber-50/40 hover:bg-amber-50/70 transition-colors space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-4xl sm:text-5xl font-black text-amber-600 tracking-tight">
                <AnimatedNumber value="61%" />
              </div>
              <div className="pt-2 pb-1">
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  LIMITED
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-1">
              Some critical resources remain difficult to reach.
            </p>
          </div>

          {/* Indicator 3: 🔴 DEAD ZONE */}
          <div className="p-5 sm:p-6 rounded-xl border border-red-200/90 bg-red-50/40 hover:bg-red-50/70 transition-colors space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-4xl sm:text-5xl font-black text-red-600 tracking-tight">
                <AnimatedNumber value="34%" />
              </div>
              <div className="pt-2 pb-1">
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-red-100 text-red-800 border border-red-300 inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  DEAD ZONE
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-1">
              Required emergency capabilities are beyond practical access.
            </p>
          </div>

        </div>
      </motion.div>

      {/* 3. Access Gap Intelligence ("Why Coverage Falls") */}
      <motion.div 
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="p-6 sm:p-7 rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200 shadow-2xs space-y-4"
      >
        <div className="border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Bottleneck Analysis
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
            Why Coverage Falls: Proximity ≠ Access
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-normal">
            Physical distance accounts for less than one-third of coverage failures. Modality deficits and blood availability dominate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {accessGapFactors.map((item, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ y: -2, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 space-y-2 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  <AnimatedNumber value={`${item.pct}%`} />
                </span>
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Factor #{idx + 1}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">{item.factor}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Regional Insight Callout */}
        <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-start gap-3 mt-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-slate-900 font-bold block">Regional Access Disparity Insight:</strong>
            <p className="leading-relaxed font-normal">
              West Zone has multiple secondary clinics within 4 km, yet severe bleeding coverage remains at 61% because O− blood units are stockout-prone. In East Industrial Corridor, 380,000 workers experience a 34% medical dead zone due to 0 local ICU beds and an average 32-minute ambulance response.
            </p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
