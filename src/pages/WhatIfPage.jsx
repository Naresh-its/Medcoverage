import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import WhatIfSimulator from '../components/WhatIf/WhatIfSimulator';
import { ArrowLeft } from 'lucide-react';

export default function WhatIfPage({ activeSimulation, setActiveSimulation }) {
  const navigate = useNavigate();

  const handleApplySimulation = (sim) => {
    setActiveSimulation(sim);
    navigate('/coverage');
  };

  return (
    <PageTransition>
      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/70">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
              Virtual Infrastructure Simulator
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              What If We Change the Infrastructure?
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Simulate capital decisions and test how ambulance posts and surgical beds transform survival odds.
            </p>
          </div>

          <button
            onClick={() => navigate('/coverage')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white/70 hover:bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Map
          </button>
        </div>

        <WhatIfSimulator
          initialZone={null}
          onApplySimulationToMap={handleApplySimulation}
        />
      </div>
    </PageTransition>
  );
}