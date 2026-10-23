import React, { useState } from 'react';
import { AgentStep, AuditBlock } from '../types';
import { Bot, CheckCircle2, ShieldCheck, Cpu, ChevronDown, ChevronRight, Hash, Clock, FileCheck } from 'lucide-react';

interface AgentTraceViewerProps {
  steps: AgentStep[];
  auditBlock?: AuditBlock;
  isOrchestrating: boolean;
}

export const AgentTraceViewer: React.FC<AgentTraceViewerProps> = ({
  steps,
  auditBlock,
  isOrchestrating
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const totalDuration = steps.reduce((acc, curr) => acc + curr.durationMs, 0);

  return (
    <div className="space-y-6">
      {/* Header and Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Multi-Agent Reasoning & Execution Graph</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous multi-agent consensus pipeline with independent adversarial guardrails and cryptographic hashing.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 font-mono tabular-nums">
          <div>
            <span>Active Agents: </span>
            <strong className="text-slate-200">4</strong>
          </div>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <div>
            <span>Total Latency: </span>
            <strong className="text-cyan-400 font-semibold">{totalDuration}ms</strong>
          </div>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <div>
            <span>Audit Proof: </span>
            <strong className="text-emerald-400">{auditBlock ? 'SHA-256 Chained' : 'Pending'}</strong>
          </div>
        </div>
      </div>

      {/* Loading Skeleton if Orchestrating */}
      {isOrchestrating && (
        <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-200">Executing Multi-Agent Reasoning Chain...</p>
          <p className="text-[11px] text-slate-500">Evaluating clinical vitals, solving multi-objective capacity constraints, and auditing EMTALA regulations.</p>
        </div>
      )}

      {/* Agent Step Nodes */}
      {!isOrchestrating && steps.length > 0 && (
        <div className="space-y-3">
          {steps.map((step, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
              >
                {/* Step Header */}
                <div
                  onClick={() => toggleExpand(idx)}
                  className="flex items-center justify-between gap-4 p-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-cyan-400">
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{step.agentName}</span>
                        <span className="text-xs text-slate-500">·</span>
                        <span className="text-xs text-slate-400">{step.role}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{step.summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-400 font-mono tabular-nums">{step.durationMs}ms</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider ${
                        step.status === 'COMPLETED'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                          : step.status === 'OVERRIDDEN'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {step.status}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Reasoning & Telemetry Drawer */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-800 bg-slate-950/70 space-y-4 text-xs">
                    {/* Internal Monologue / Reasoning Trace */}
                    <div>
                      <span className="font-semibold text-slate-300 block mb-1">Deliberation & Clinical Reasoning:</span>
                      <p className="text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 font-sans">
                        {step.reasoning}
                      </p>
                    </div>

                    {/* Parametric Metrics */}
                    {step.metrics && (
                      <div>
                        <span className="font-semibold text-slate-300 block mb-1.5">Evaluated Constraint Parameters:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {Object.entries(step.metrics).map(([key, value]) => (
                            <div key={key} className="p-2 rounded bg-slate-900 border border-slate-800">
                              <span className="text-[10px] text-slate-400 block">{key}</span>
                              <span className="text-xs font-mono font-semibold text-white tabular-nums">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Guardrails Verification */}
                    {step.guardrailNotes && step.guardrailNotes.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-300 block mb-1.5">Regulatory & Safety Invariants Verified:</span>
                        <ul className="space-y-1">
                          {step.guardrailNotes.map((note, noteIdx) => (
                            <li key={noteIdx} className="flex items-start gap-1.5 text-slate-300">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cryptographic Audit Stamp Block */}
      {auditBlock && (
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-white">Cryptographic Decision Block #{auditBlock.index}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Immutable SHA-256 Sealed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 break-all">
              <span className="text-[10px] text-slate-400 block font-sans">Current Block Hash</span>
              <span className="text-cyan-300 text-[11px]">{auditBlock.blockHash}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 break-all">
              <span className="text-[10px] text-slate-400 block font-sans">Previous Block Hash (Parent)</span>
              <span className="text-slate-400 text-[11px]">{auditBlock.previousHash}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
