import React, { useState } from 'react';
import { MCISimulationResult } from '../types';
import { AlertOctagon, X, Zap, CheckCircle2, TrendingUp, ShieldAlert, Ambulance } from 'lucide-react';

interface CrisisSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulationResult: MCISimulationResult | null;
  isRunningSim: boolean;
  onRunSimulation: (scenarioType: string) => void;
}

export const CrisisSimulationModal: React.FC<CrisisSimulationModalProps> = ({
  isOpen,
  onClose,
  simulationResult,
  isRunningSim,
  onRunSimulation
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('Metropolitan Interstate 280 40-Car Collision');

  if (!isOpen) return null;

  const scenarios = [
    'Metropolitan Interstate 280 40-Car Collision',
    'Industrial Petrochemical Flash Explosion',
    'Mass Transit Subway Structural Collapse'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-5 my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Mass Casualty Incident (MCI) Autonomous Load Balancer</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Stress-test regional capacity under disaster surges with multi-patient triage and diversion optimization.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenario Selector & Run Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {scenarios.map((scen) => (
              <button
                key={scen}
                onClick={() => setSelectedScenario(scen)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedScenario === scen
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {scen.split(' ')[0]} {scen.split(' ')[1]}
              </button>
            ))}
          </div>

          <button
            onClick={() => onRunSimulation(selectedScenario)}
            disabled={isRunningSim}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-rose-400 hover:bg-rose-300 rounded-md transition-all shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            {isRunningSim ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Simulating Dispatch...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Execute Surge Balancer</span>
              </>
            )}
          </button>
        </div>

        {/* Results Container */}
        {simulationResult && (
          <div className="space-y-4">
            {/* Triage Summary Tickers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/40">
                <span className="text-[11px] text-rose-300 font-semibold block mb-0.5">Immediate (Red)</span>
                <span className="text-xl font-bold font-mono text-rose-400 tabular-nums">
                  {simulationResult.triageDistribution.red} Casualties
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Surgical Resuscitation</span>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40">
                <span className="text-[11px] text-amber-300 font-semibold block mb-0.5">Delayed (Yellow)</span>
                <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                  {simulationResult.triageDistribution.yellow} Casualties
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Serious / Stabilized</span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40">
                <span className="text-[11px] text-emerald-300 font-semibold block mb-0.5">Minor (Green)</span>
                <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                  {simulationResult.triageDistribution.green} Casualties
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Walking Wounded</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Expectant (Black)</span>
                <span className="text-xl font-bold font-mono text-slate-300 tabular-nums">
                  {simulationResult.triageDistribution.black} Deceased
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Morgue Hold</span>
              </div>
            </div>

            {/* Averted Bottlenecks Callout */}
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
              <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Autonomous Load Distribution Proof</span>
              </span>
              <ul className="space-y-1 text-slate-300">
                {simulationResult.bottlenecksAverted.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-cyan-400">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Casualty Manifest Table */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-medium sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Tag / ID</th>
                      <th className="py-2.5 px-3">Patient Injury</th>
                      <th className="py-2.5 px-3">Assigned Hospital</th>
                      <th className="py-2.5 px-3">Unit</th>
                      <th className="py-2.5 px-3 text-right">ETA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {simulationResult.casualties.map((cas) => (
                      <tr key={cas.id} className="hover:bg-slate-800/20">
                        <td className="py-2 px-3 font-mono">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              cas.tag === 'RED'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : cas.tag === 'YELLOW'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : cas.tag === 'GREEN'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {cas.tag} · {cas.id}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-white block font-medium">{cas.chiefInjury}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{cas.vitalsSummary}</span>
                        </td>
                        <td className="py-2 px-3 font-medium text-cyan-300">{cas.recommendedHospital}</td>
                        <td className="py-2 px-3 text-slate-400">{cas.transportUnit}</td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums text-white">{cas.etaMinutes}m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            Close Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
