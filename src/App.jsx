import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppNavbar from './components/Navigation/AppNavbar';
import HomePage from './pages/HomePage';
import CoveragePage from './pages/CoveragePage';
import MedicalNeedsPage from './pages/MedicalNeedsPage';
import WhatIfPage from './pages/WhatIfPage';
import InsightsPage from './pages/InsightsPage';
import AboutPage from './pages/AboutPage';
import BackgroundMotionGraphics from './components/MotionGraphics/BackgroundMotionGraphics';
import TransitionalMotionSweep from './components/MotionGraphics/TransitionalMotionSweep';

function AnimatedWorkspace({ 
  selectedNeedId, 
  setSelectedNeedId, 
  activeSimulation, 
  setActiveSimulation 
}) {
  const location = useLocation();

  return (
    <>
      {/* Transitional Glowing Laser Sweep between routes */}
      <TransitionalMotionSweep pageKey={location.pathname} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/coverage" 
            element={
              <CoveragePage 
                selectedNeedId={selectedNeedId}
                setSelectedNeedId={setSelectedNeedId}
                activeSimulation={activeSimulation}
                setActiveSimulation={setActiveSimulation}
              />
            } 
          />
          <Route 
            path="/needs" 
            element={
              <MedicalNeedsPage 
                selectedNeedId={selectedNeedId}
                setSelectedNeedId={setSelectedNeedId}
              />
            } 
          />
          <Route 
            path="/what-if" 
            element={
              <WhatIfPage 
                activeSimulation={activeSimulation}
                setActiveSimulation={setActiveSimulation}
              />
            } 
          />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function MainLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Shared application state
  const [selectedNeedId, setSelectedNeedId] = useState('severe_bleeding');
  const [activeSimulation, setActiveSimulation] = useState(null);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-3 sm:p-6 lg:p-10 overflow-x-hidden font-sans selection:bg-red-100 selection:text-red-900 bg-[#FAFAFA]">
      {/* 1. CLEAN WHITE CANVAS WITH LIVE MOTION GRAPHICS (ECG pulse, sonar rings, telemetry HUD) */}
      <BackgroundMotionGraphics />

      {/* 2. THE PERSISTENT FLOATING GLASS APPLICATION WINDOW */}
      <div className="relative z-10 w-full max-w-7xl min-h-[86vh] glass-window rounded-3xl overflow-hidden flex flex-col my-auto transition-all duration-500 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.12),0_0_0_1px_rgba(255,255,255,0.9)_inset,0_2px_4px_rgba(220,38,38,0.06)]">
        {/* Glass Header Navigation (visible on internal pages) */}
        {!isHomePage && <AppNavbar />}

        {/* Content Workspace inside the Persistent Glass Frame */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <AnimatedWorkspace
            selectedNeedId={selectedNeedId}
            setSelectedNeedId={setSelectedNeedId}
            activeSimulation={activeSimulation}
            setActiveSimulation={setActiveSimulation}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}