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
      {/* Left: Medical Brand Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 via-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-100">
          <svg 
            className="w-4 h-4 stroke-white fill-none stroke-[3]" 
            viewBox="0 0 24 24" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
        </div>
        <div>
          <span className="text-base font-black tracking-tight text-slate-900">
            Med<span className="text-blue-600">Coverage</span>
          </span>
          <span className="hidden sm:inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Emergency Network
          </span>
        </div>
      </Link>

      {/* Right: Navigation Tabs */}
      <nav className="flex items-center gap-1 sm:gap-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.path;
          return (
            <motion.div
              key={link.path}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
            >
              <Link
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-xs shadow-blue-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </header>
  );
}
