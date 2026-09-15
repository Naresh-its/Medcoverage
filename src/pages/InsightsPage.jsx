import React from 'react';
import PageTransition from '../components/PageTransition';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';
import Medical3DBackground from '../components/MotionGraphics/Medical3DBackground';

export default function InsightsPage() {
  return (
    <PageTransition className="relative overflow-hidden">
      {/* Subtle 3D Medical Telemetry Background */}
      <Medical3DBackground variant="insights" />

      <div className="relative z-10 p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Regional Healthcare Intelligence
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Healthcare Insights & Analytics
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed max-w-3xl">
              Synthesizes real-world facility density against clinical requirement constraints to reveal coverage disparities.
            </p>
          </div>
        </div>

        <AnalyticsDashboard />
      </div>
    </PageTransition>
  );
}
