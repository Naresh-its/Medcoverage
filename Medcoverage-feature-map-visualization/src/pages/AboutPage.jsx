import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const steps = [
    { title: 'MAP', subtitle: 'Healthcare resources across regional sectors' },
    { title: 'ANALYZE', subtitle: 'Effective clinical accessibility & travel times' },
    { title: 'EXPLAIN', subtitle: 'Root causes behind medical dead zones' },
    { title: 'SIMULATE', subtitle: 'Infrastructure additions, removals & relocations' },
    { title: 'IMPROVE', subtitle: 'Actionable policy & resource allocation decisions' },
  ];

  const technologies = [
    'React.js',
    'Tailwind CSS',
    'Framer Motion',
    'Leaflet GIS',
    'Recharts',
    'Node.js & Express',
    'MongoDB Schema Ready',
  ];

  return (
    <PageTransition>
      <div className="p-8 sm:p-12 max-w-3xl mx-auto space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-600 text-white shadow-xs">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Med<span className="text-red-600">Coverage</span>
          </h1>
          <p className="text-lg sm:text-xl font-medium text-slate-800 leading-snug">
            Healthcare accessibility isn't just about distance.<br />
            <span className="text-red-600">It's about whether the right care is reachable when it matters.</span>
          </p>
        </div>

        <div className="glass-card p-6 rounded-xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            The MedCoverage Pipeline
          </span>
          <div className="space-y-2.5">
            {steps.map((s, idx) => (
              <div key={s.title} className="flex items-center gap-3 text-slate-800 text-xs">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {idx + 1}
                </span>
                <span className="font-extrabold text-slate-900">{s.title}</span>
                <span className="text-slate-500">— {s.subtitle}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Production Technology Stack
          </span>
          <div className="flex flex-wrap gap-2">
            {technologies.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-white text-xs font-medium text-slate-800 shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Link
            to="/coverage"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <span>Open Coverage Interface</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}