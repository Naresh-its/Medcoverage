import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppNavbar from './components/Navigation/AppNavbar';
import HomePage from './pages/HomePage';
import CoveragePage from './pages/CoveragePage';
import MedicalNeedsPage from './pages/MedicalNeedsPage';
import InsightsPage from './pages/InsightsPage';
import AboutPage from './pages/AboutPage';

function AnimatedWorkspace({ 
  selectedNeedId, 
  setSelectedNeedId 
}) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <HomePage 
              selectedNeedId={selectedNeedId}
              setSelectedNeedId={setSelectedNeedId}
            />
          } 
        />
        <Route 
          path="/coverage" 
          element={
            <CoveragePage 
              selectedNeedId={selectedNeedId}
              setSelectedNeedId={setSelectedNeedId}
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
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function MainLayout() {
  const [selectedNeedId, setSelectedNeedId] = useState('severe_bleeding');

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 antialiased">
      {/* Full-width seamless header */}
      <AppNavbar />

      {/* Edge-to-edge content container filling full viewport */}
      <div className="flex-1 flex flex-col w-full">
        <AnimatedWorkspace
          selectedNeedId={selectedNeedId}
          setSelectedNeedId={setSelectedNeedId}
        />
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
