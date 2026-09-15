import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { ArrowRight, HeartPulse, ShieldCheck, Clock, Award, PhoneCall } from 'lucide-react';

export default function AboutPage() {
  const principles = [
    {
      icon: Clock,
      title: '1. Minutes Matter More Than Miles',
      desc: 'In severe bleeding, stroke, or heart emergencies, survival is measured in minutes. Euclidean distance on a map is useless if traffic or ambulance delays keep help from arriving in time.'
    },
    {
      icon: ShieldCheck,
      title: '2. Equipment Matters More Than Buildings',
      desc: 'Having a hospital building nearby does not help if that facility lacks donor blood, an open trauma bay, or a 24/7 CT brain scanner. We measure verified clinical readiness, not brick-and-mortar locations.'
    },
    {
      icon: Award,
      title: '3. Test Digitally Before Spending Public Funds',
      desc: 'Cities and health departments should test where ambulances and blood storage units save the most lives before committing municipal capital budgets.'
    }
  ];

  const steps = [
    {
      step: '1',
      title: 'Map Community Resources',
      desc: 'Plot verified locations of hospitals, paramedic ambulances, blood banks, and 24/7 diagnostic facilities across our neighborhoods.'
    },
    {
      step: '2',
      title: 'Measure Real Arrival Times',
      desc: 'Calculate travel times using local roads and emergency windows to see where help arrives under the 15-minute standard.'
    },
    {
      step: '3',
      title: 'Spot Dangerous Care Gaps',
      desc: 'Identify areas where specialized equipment (like donor blood or stroke scanners) is missing within the critical first hour.'
    },
    {
      step: '4',
      title: 'Plan Practical Fixes',
      desc: 'Show leaders how adding 2 ambulances or 1 blood storage unit can protect 225,000 more families.'
    }
  ];

  return (
    <PageTransition>
      <div className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto text-slate-800 text-left">
        
        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-200">
          <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <HeartPulse className="w-7 h-7" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
              Our Public Mission
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              About MedCoverage
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Measuring real emergency medical access across our community.
            </p>
          </div>
        </div>

        {/* Mission Card */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-xs space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800 block">
            Why This Platform Exists
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            “Where are the hospitals?” is the wrong question.<br />
            <span className="text-blue-700">“Can patients reach the specific care they need in time?” is the real question.</span>
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed pt-1">
            Most healthcare maps simply show physical buildings as pins on a map. But if someone suffers from severe bleeding or a sudden stroke and arrives at a clinic that has no blood reserves or no working CT scanner, they face a dangerous delay. MedCoverage was built to replace simple distance maps with verified, life-saving readiness.
          </p>
        </div>

        {/* 3 Core Truths */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Our Three Public Health Principles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {principles.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-2">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Simple Steps */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              How the Community Access Service Works
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Four straightforward steps to verify and improve care in any neighborhood:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {steps.map((s) => (
              <div 
                key={s.step}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2"
              >
                <div className="w-6 h-6 rounded-md bg-blue-700 text-white flex items-center justify-center text-xs font-bold">
                  {s.step}
                </div>
                <h4 className="font-bold text-slate-900 text-xs">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Notice Box */}
        <div className="p-5 rounded-xl bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-900">
                Important Emergency Advisory
              </h4>
              <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
                MedCoverage is a public planning and educational service. In a life-threatening medical emergency, do not use website maps—call 911 or your local emergency number immediately.
              </p>
            </div>
          </div>

          <a
            href="tel:911"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shrink-0 transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Call 911 Now</span>
          </a>
        </div>

        {/* Footer Navigation */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link
            to="/coverage"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors"
          >
            <span>Open Coverage Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/needs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold shadow-2xs transition-colors"
          >
            <span>Check Emergency Needs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </PageTransition>
  );
}