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

function AnimatedWorkspace({ 
  selectedNeedId, 
  setSelectedNeedId, 
  activeSimulation, 
  setActiveSimulation 
}) {
  const location = useLocation();

  return (
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
  );
}

function MainLayout() {
  // Shared application state
  const [selectedNeedId, setSelectedNeedId] = useState('severe_bleeding');
  const [activeSimulation, setActiveSimulation] = useState(null);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start p-2 sm:p-4 lg:p-6 overflow-x-hidden font-sans bg-slate-100/80">
      {/* Soft Ambient Background */}
      <BackgroundMotionGraphics />

      {/* Main Public Health Application Frame */}
      <div className="relative z-10 w-full max-w-6xl min-h-[92vh] bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col my-2 transition-all">
        {/* Public Health Navigation Bar */}
        <AppNavbar />

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