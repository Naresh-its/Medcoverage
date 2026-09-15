import React from 'react';
import { Activity, Shield, MapPin, Sliders, BarChart3, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onStartDemo }) {
  const navItems = [
    { id: 'coverage', label: 'Coverage Map', icon: MapPin },
    { id: 'needs', label: 'Medical Needs', icon: Activity },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('hero')}
          >
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm shadow-red-200">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Med<span className="text-red-600">Coverage</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  Prototype
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Healthcare Accessibility & Resource Planning
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-950 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onStartDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-all shadow-xs"
              title="Launch 30-Second Guided Tour"
            >
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden sm:inline">Guided Demo</span> (30s)
            </button>
            <button
              onClick={() => setActiveTab('coverage')}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-xs shadow-red-200 transition-colors"
            >
              Explore Coverage
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}