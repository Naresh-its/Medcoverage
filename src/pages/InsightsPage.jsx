import React from 'react';
import PageTransition from '../components/PageTransition';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';

export default function InsightsPage() {
  return (
    <PageTransition>
      <div className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto w-full text-slate-800">
        <div className="pb-4 border-b border-slate-200 text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
            Public Health Report
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Community Healthcare Access Report
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            A clear summary of ambulance arrival times, hospital readiness, and priority improvements across our 5 city sectors.
          </p>
        </div>

        <AnalyticsDashboard />
      </div>
    </PageTransition>
  );
}