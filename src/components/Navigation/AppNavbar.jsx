import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, PhoneCall, HeartPulse } from 'lucide-react';

export default function AppNavbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/coverage', label: 'Coverage Map' },
    { path: '/needs', label: 'Emergency Needs' },
    { path: '/what-if', label: 'Plan Solutions' },
    { path: '/insights', label: 'Health Report' },
    { path: '/about', label: 'About' },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 select-none">
      {/* 1. Subtle Public Health Emergency Advisory Bar */}
      <div className="bg-slate-900 text-white px-4 py-1.5 text-xs sm:text-xs flex items-center justify-between">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-slate-200">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <strong className="text-white font-semibold">Emergency Notice:</strong> In a life-threatening emergency, call 911 immediately.
          </span>
          <a 
            href="tel:911" 
            className="hidden sm:inline-flex items-center gap-1 text-red-300 hover:text-white font-bold transition-colors"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Call 911</span>
          </a>
        </div>
      </div>

      {/* 2. Main Hospital-Grade Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Identity */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group"
          title="MedCoverage Public Healthcare Access Home"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
            <HeartPulse className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
              Med<span className="text-blue-700">Coverage</span>
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Community Emergency Access Service
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-blue-800'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div className="flex items-center gap-2">
          <Link
            to="/coverage"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-xs transition-colors"
          >
            <span>Check Your Area</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden px-4 pb-2.5 pt-1 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
        {navLinks.map((link) => {
          const isActive = currentPath === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}