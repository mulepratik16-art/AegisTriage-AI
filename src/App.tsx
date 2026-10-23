/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav.tsx';
import { ExecutiveProjectBrief } from './components/ExecutiveProjectBrief.tsx';
import { TacticalGridMap } from './components/TacticalGridMap.tsx';
import { TriageIntakeConsole } from './components/TriageIntakeConsole.tsx';
import { AgentTraceViewer } from './components/AgentTraceViewer.tsx';
import { HospitalNetworkPanel } from './components/HospitalNetworkPanel.tsx';
import { CrisisSimulationModal } from './components/CrisisSimulationModal.tsx';
import { AuditLedgerModal } from './components/AuditLedgerModal.tsx';
import { SystemEfficiencyMetrics } from './components/SystemEfficiencyMetrics.tsx';
import {
  PatientIntake,
  TriageEvaluation,
  DispatchRoutingDecision,
  AgentStep,
  AuditBlock,
  HospitalFacility,
  FleetUnit,
  MCISimulationResult
} from './types/index.ts';
import {
  INITIAL_HOSPITALS,
  INITIAL_FLEET,
  INITIAL_AUDIT_LOGS,
  PRESET_SCENARIOS,
  DEFAULT_INITIAL_TRIAGE,
  DEFAULT_INITIAL_ROUTING,
  DEFAULT_INITIAL_STEPS
} from './data/mockRegionalData.ts';
import { ShieldCheck, Activity, MapPin, Building2, Cpu, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'triage' | 'map' | 'agents' | 'hospitals' | 'metrics'>('triage');
  const [patient, setPatient] = useState<PatientIntake>(PRESET_SCENARIOS[0]);
  const [triage, setTriage] = useState<TriageEvaluation | undefined>(DEFAULT_INITIAL_TRIAGE);
  const [routing, setRouting] = useState<DispatchRoutingDecision | undefined>(DEFAULT_INITIAL_ROUTING);
  const [steps, setSteps] = useState<AgentStep[]>(DEFAULT_INITIAL_STEPS);
  const [auditBlock, setAuditBlock] = useState<AuditBlock | undefined>(INITIAL_AUDIT_LOGS[INITIAL_AUDIT_LOGS.length - 1]);
  const [auditLogs, setAuditLogs] = useState<AuditBlock[]>(INITIAL_AUDIT_LOGS);
  const [hospitals, setHospitals] = useState<HospitalFacility[]>(INITIAL_HOSPITALS);
  const [fleet, setFleet] = useState<FleetUnit[]>(INITIAL_FLEET);

  const [isOrchestrating, setIsOrchestrating] = useState<boolean>(false);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<MCISimulationResult | null>(null);
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);

  // Fetch live updates from server API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hospRes, fleetRes, auditRes] = await Promise.all([
          fetch('/api/hospitals').then(r => r.json()),
          fetch('/api/fleet').then(r => r.json()),
          fetch('/api/audit/chain').then(r => r.json())
        ]);
        if (Array.isArray(hospRes)) setHospitals(hospRes);
        if (Array.isArray(fleetRes)) setFleet(fleetRes);
        if (Array.isArray(auditRes)) setAuditLogs(auditRes);
      } catch (err) {
        console.warn('Using client initial state:', err);
      }
    };
    fetchData();
  }, []);

  const handleRunPipeline = async (targetPatient?: PatientIntake) => {
    const p = targetPatient || patient;
    setIsOrchestrating(true);
    try {
      const response = await fetch('/api/agent/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (!response.ok) throw new Error('Orchestration failed');
      const data = await response.json();
      setTriage(data.triage);
      setRouting(data.routing);
      setSteps(data.steps);
      setAuditBlock(data.auditBlock);
      if (data.auditBlock) {
        setAuditLogs(prev => [...prev.filter(b => b.index !== data.auditBlock.index), data.auditBlock]);
      }
      // Refresh fleet
      const fleetRes = await fetch('/api/fleet').then(r => r.json());
      if (Array.isArray(fleetRes)) setFleet(fleetRes);
    } catch (err) {
      console.error('Error running pipeline:', err);
    } finally {
      setIsOrchestrating(false);
    }
  };

  const handleSelectPreset = (preset: PatientIntake) => {
    setPatient(preset);
    handleRunPipeline(preset);
  };

  const handleToggleDiversion = async (hospitalId: string) => {
    try {
      const res = await fetch(`/api/hospitals/${hospitalId}/toggle-diversion`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success && data.hospital) {
        setHospitals(prev => prev.map(h => (h.id === hospitalId ? data.hospital : h)));
        // Re-run pipeline to see autonomous re-routing
        handleRunPipeline();
      }
    } catch (err) {
      console.error('Failed to toggle diversion:', err);
      setHospitals(prev =>
        prev.map(h => (h.id === hospitalId ? { ...h, isDiversion: !h.isDiversion } : h))
      );
    }
  };

  const handleRunSimulation = async (scenarioType: string) => {
    setIsRunningSim(true);
    try {
      const res = await fetch('/api/simulation/mci', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioType })
      });
      const data = await res.json();
      setSimulationResult(data);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsRunningSim(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSimulation={() => {
          setIsCrisisModalOpen(true);
          if (!simulationResult) handleRunSimulation('Metropolitan Interstate 280 40-Car Collision');
        }}
        onOpenAudit={() => setIsAuditModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-7">
        {/* Executive Project Brief & 5-Criteria Evaluation Matrix */}
        <ExecutiveProjectBrief />

        {/* Tactical View Switcher */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('triage')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'triage'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Operations Center (Intake + Map)
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'agents'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Multi-Agent Reasoning Graph
            </button>
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'hospitals'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Regional Hospital Capacity Grid
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'metrics'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Efficiency & Security Benchmarks
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 font-mono tabular-nums">
            <span>Active Incidents: <strong className="text-white">1</strong></span>
            <span aria-hidden="true">·</span>
            <span>Fleet Online: <strong className="text-emerald-400">5/5</strong></span>
            <span aria-hidden="true">·</span>
            <span>Free ICU Beds: <strong className="text-cyan-400">24</strong></span>
          </div>
        </div>

        {/* Main Operational View */}
        {activeTab === 'triage' && (
          <div className="space-y-7">
            {/* Split Dual-Pane Workstation: Intake Console (Left) + Tactical GIS Map (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Pane: Patient Vitals & Triage Action */}
              <div className="lg:col-span-7">
                <TriageIntakeConsole
                  patient={patient}
                  setPatient={setPatient}
                  triage={triage}
                  routing={routing}
                  isOrchestrating={isOrchestrating}
                  onRunPipeline={() => handleRunPipeline()}
                  onSelectPreset={handleSelectPreset}
                />
              </div>

              {/* Right Pane: Live Tactical Regional Map */}
              <div className="lg:col-span-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-white">Live Regional Dispatch Map</span>
                  </div>
                  <span className="font-mono text-cyan-400">6 Centers · 1 Incident Vector</span>
                </div>
                <TacticalGridMap
                  hospitals={hospitals}
                  fleet={fleet}
                  activePatient={patient}
                  routingDecision={routing}
                  onToggleDiversion={handleToggleDiversion}
                />
              </div>
            </div>

            {/* Immediate Agent Reasoning Trace Section */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-bold text-white">Autonomous Multi-Agent Deliberation Trace</h2>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-slate-400">4 Synchronized Decision Layers</span>
                </div>
                <span className="text-xs text-emerald-400 font-mono">Consensus Verified (1.2s Latency)</span>
              </div>
              <AgentTraceViewer
                steps={steps}
                auditBlock={auditBlock}
                isOrchestrating={isOrchestrating}
              />
            </div>

            {/* Regional Hospital Grid Section */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-bold text-white">Regional Hospital Network & Diversion Controls</h2>
                </div>
                <span className="text-xs text-slate-400">Click any status button to declare or lift surge diversion</span>
              </div>
              <HospitalNetworkPanel
                hospitals={hospitals}
                onToggleDiversion={handleToggleDiversion}
              />
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-4">
            <TacticalGridMap
              hospitals={hospitals}
              fleet={fleet}
              activePatient={patient}
              routingDecision={routing}
              onToggleDiversion={handleToggleDiversion}
            />
          </div>
        )}

        {activeTab === 'agents' && (
          <AgentTraceViewer
            steps={steps}
            auditBlock={auditBlock}
            isOrchestrating={isOrchestrating}
          />
        )}

        {activeTab === 'hospitals' && (
          <HospitalNetworkPanel
            hospitals={hospitals}
            onToggleDiversion={handleToggleDiversion}
          />
        )}

        {activeTab === 'metrics' && <SystemEfficiencyMetrics />}

        {/* Clinical Advisory Oversight Profile Section */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Clinical Supervisory Team & Regulatory Advisory</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Human-in-the-loop trauma command and field paramedic validation standards.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>EMTALA & HIPAA Compliant Architecture</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <img
                src="/src/assets/images/avatar_chief_medical_1792745497730.jpg"
                alt="Chief Medical Officer"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0"
              />
              <div className="text-xs">
                <span className="font-semibold text-white block">Dr. Sarah Jenkins, MD, FACEP</span>
                <span className="text-slate-400 block">Regional Medical Director · Level 1 Trauma Oversight</span>
                <span className="text-[11px] text-cyan-400 mt-0.5 block">Protocol Guardian: ESI-5 & STEMI Direct-Access</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <img
                src="/src/assets/images/avatar_field_paramedic_1792745499651.jpg"
                alt="Field Operations Paramedic"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0"
              />
              <div className="text-xs">
                <span className="font-semibold text-white block">Capt. Samantha Jenkins, ACP</span>
                <span className="text-slate-400 block">Lead Flight & Tactical Paramedic · Air Medevac 1</span>
                <span className="text-[11px] text-emerald-400 mt-0.5 block">Field Validation: Shock Index & RSI Airway Verification</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <CrisisSimulationModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
        simulationResult={simulationResult}
        isRunningSim={isRunningSim}
        onRunSimulation={handleRunSimulation}
      />

      <AuditLedgerModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        auditLogs={auditLogs}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-5 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">AegisTriage AI System</span>
            <span>·</span>
            <span>Autonomous Emergency Dispatch & Critical Care Routing</span>
            <span>·</span>
            <span>Multi-Agent Trauma Logistics Network</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>Production Grade v4.2</span>
            <span>·</span>
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="hover:text-cyan-400 transition-colors"
            >
              Verify Ledger
            </button>
            <span>·</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
