import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Home } from 'lucide-react';

export default function AppNavbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { path: '/coverage', label: 'Coverage' },
    { path: '/needs', label: 'Medical Needs' },
    { path: '/what-if', label: 'What-If' },
    { path: '/insights', label: 'Insights' },
    { path: '/about', label: 'About' },
  ];

  return (
    <header className="px-6 py-3.5 border-b border-white/60 flex items-center justify-between bg-white/45 backdrop-blur-md select-none">
      {/* Left: Window Status Dot & Brand Logo */}
      <div className="flex items-center gap-3">
        {/* Subtle Window Dots */}
        <div className="flex items-center gap-1.5 mr-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 border border-red-500/40"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 border border-amber-500/40"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 border border-emerald-500/40"></span>
        </div>

        <motion.div
          whileHover={{ scale: 1.04, rotate: [0, -2, 2, 0] }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/" 
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
          >
            {/* Red Pulse Icon */}
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white shadow-sm shadow-red-500/30 ring-2 ring-white/80">
              <svg 
                className="w-4 h-4 stroke-white fill-none stroke-[3]" 
                viewBox="0 0 24 24" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="text-base font-black tracking-tight text-slate-900">
              Med<span className="text-red-600">Coverage</span>
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Right: Frosted Pill Nav Bar with Jiggle Interactions */}
      <nav className="flex items-center gap-1 bg-white/65 p-1 rounded-xl border border-white/80 shadow-2xs">
        <motion.div
          whileHover={{ y: -2, rotate: [0, -2, 2, 0] }}
          whileTap={{ scale: 0.94 }}
        >
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              currentPath === '/'
                ? 'bg-white text-red-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </motion.div>

        {navLinks.map((link) => {
          const isActive = currentPath === link.path;
          return (
            <motion.div
              key={link.path}
              whileHover={{ y: -2, rotate: [0, -1.5, 1.5, 0] }}
              whileTap={{ scale: 0.94 }}
            >
              <Link
                to={link.path}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all block ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </header>
  );
}