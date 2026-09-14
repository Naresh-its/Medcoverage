import React from 'react';
import PageTransition from '../components/PageTransition';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';

export default function InsightsPage() {
  return (
    <PageTransition>
      <div className="p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-slate-200/70">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
            Regional Healthcare Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Healthcare Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Synthesizes facility density against clinical requirement constraints to reveal coverage disparities.
          </p>
        </div>

        <AnalyticsDashboard />
      </div>
    </PageTransition>
  );
}