import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

interface TopNavProps {
  activeTab: 'triage' | 'map' | 'agents' | 'hospitals' | 'metrics';
  setActiveTab: (tab: 'triage' | 'map' | 'agents' | 'hospitals' | 'metrics') => void;
  onOpenSimulation: () => void;
  onOpenAudit: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenSimulation,
  onOpenAudit
}) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
        <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
          <Activity className="w-4 h-4" />
        </div>
        <a href="#triage" className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
          AegisTriage AI
        </a>
      </div>

      {/* Zone 2: 4-5 concise single-line nav links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('triage')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'triage' ? 'text-white border-b-2 border-cyan-400 font-semibold' : ''
          }`}
        >
          Emergency Intake
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'map' ? 'text-white border-b-2 border-cyan-400 font-semibold' : ''
          }`}
        >
          Tactical Map
        </button>
        <button
          onClick={() => setActiveTab('agents')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'agents' ? 'text-white border-b-2 border-cyan-400 font-semibold' : ''
          }`}
        >
          Agent Reasoning
        </button>
        <button
          onClick={() => setActiveTab('hospitals')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'hospitals' ? 'text-white border-b-2 border-cyan-400 font-semibold' : ''
          }`}
        >
          Regional Hospitals
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'metrics' ? 'text-white border-b-2 border-cyan-400 font-semibold' : ''
          }`}
        >
          System Efficiency
        </button>
      </nav>

      {/* Zone 3: 1 primary action button + audit link */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenAudit}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-md border border-slate-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Audit Ledger</span>
        </button>
        <button
          onClick={onOpenSimulation}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          Run Crisis Simulation
        </button>
      </div>
    </header>
  );
};
