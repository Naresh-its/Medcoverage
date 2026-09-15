import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MapPin, Stethoscope, BarChart3, Info } from 'lucide-react';

export default function AppNavbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { path: '/', label: 'Hospital Search', icon: Home },
    { path: '/coverage', label: 'Coverage Map', icon: MapPin },
    { path: '/needs', label: 'Medical Needs', icon: Stethoscope },
    { path: '/insights', label: 'Insights & Analytics', icon: BarChart3 },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <header className="w-full px-4 sm:px-8 py-3 border-b border-slate-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between sticky top-0 z-50 shadow-2xs">
      {/* Left: MedCoverage Monochrome Brand Logo */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white shadow-xs ring-1 ring-slate-800/10">
          <svg 
            className="w-4 h-4 stroke-white fill-none stroke-[2.5]" 
            viewBox="0 0 24 24" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base tracking-tight text-slate-900">
            <span className="font-semibold text-slate-900">Med</span>
            <span className="font-black text-slate-900">Coverage</span>
          </span>
        </div>
      </Link>

      {/* Right: Navigation Tabs */}
      <nav className="flex items-center gap-1 sm:gap-1.5">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.path;
          return (
            <motion.div
              key={link.path}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="relative"
            >
              <Link
                to={link.path}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-slate-900 rounded-lg shadow-xs"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />
                  )}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </header>
  );
}
