import React from 'react';
import { ArrowRight, Play, CheckCircle2, ShieldAlert, Sparkles, MapPin, Activity, HelpCircle } from 'lucide-react';
import heroMapImg from '../assets/hero_map.jpg';

export default function Hero({ onExploreCoverage, onRunWhatIf, onStartDemo }) {
  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-10 pb-16 lg:pt-14 lg:pb-20">
      {/* Background Subtle Map Image with soft gradient fade to white */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 pointer-events-none opacity-20 lg:opacity-25 overflow-hidden">
        <img
          src={heroMapImg}
          alt="Healthcare coverage map visualization"
          className="w-full h-full object-cover object-left"
        />
        {/* Soft fade overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/60"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Subtle Pipeline Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
            <span>MAP</span>
            <span className="text-slate-400">→</span>
            <span>ANALYZE</span>
            <span className="text-slate-400">→</span>
            <span>EXPLAIN</span>
            <span className="text-slate-400">→</span>
            <span className="text-red-600 font-bold">IMPROVE</span>
          </div>

          {/* Core Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Healthcare Exists.{' '}
            <span className="block text-red-600 mt-1">
              But Is It Actually Accessible?
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
            MedCoverage measures whether people can reach the <strong className="text-slate-900 font-semibold">right medical care</strong> when they need it — detecting medical dead zones, revealing hidden clinical bottlenecks, and simulating infrastructure upgrades.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreCoverage}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-red-600 text-white font-semibold text-sm hover:bg-red-700 shadow-sm shadow-red-200 transition-all cursor-pointer"
            >
              Explore Coverage
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onRunWhatIf}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-white border border-slate-300 text-slate-800 font-semibold text-sm hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer"
            >
              Run a What-If
            </button>
            <button
              onClick={onStartDemo}
              className="inline-flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold text-red-700 hover:text-red-800 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-red-600" />
              Watch 30s Interactive Demo
            </button>
          </div>

          {/* Traditional Map vs MedCoverage Concept Box */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Traditional Healthcare Map
              </span>
              <p className="text-sm font-medium text-slate-700 mt-1 flex items-start gap-2">
                <span className="text-slate-400 text-base">“</span>
                <span>Where are the nearest hospitals? (Simple distance)</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Fails to verify if the hospital has blood, ICU beds, trauma surgeons, or working CT machines.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-red-50/70 border border-red-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-700">
                MedCoverage Intelligence
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1 flex items-start gap-2">
                <span className="text-red-600 text-base">“</span>
                <span>Can people reach the specific care they need in time?</span>
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Calculates travel window, required clinical modalities, blood readiness, and emergency dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}