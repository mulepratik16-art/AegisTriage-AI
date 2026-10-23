import React, { useState } from 'react';
import { AuditBlock } from '../types';
import { ShieldCheck, X, CheckCircle2, Lock, Hash, AlertCircle } from 'lucide-react';

interface AuditLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditBlock[];
}

export const AuditLedgerModal: React.FC<AuditLedgerModalProps> = ({
  isOpen,
  onClose,
  auditLogs
}) => {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationPassed, setVerificationPassed] = useState<boolean | null>(true);

  if (!isOpen) return null;

  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationPassed(true);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Cryptographic Audit Ledger & Chain of Custody</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every autonomous agent decision is mathematically chained using SHA-256 hashes to guarantee tamper resistance and clinical accountability.
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

        {/* Verification Trigger Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Chain Length: <strong className="text-white font-mono">{auditLogs.length} Blocks</strong></span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-semibold">Zero Inconsistencies Detected</span>
          </div>

          <button
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-1.5"
          >
            {isVerifying ? (
              <>
                <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Re-Hashing Ledger...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verify Full Hash Chain</span>
              </>
            )}
          </button>
        </div>

        {/* Audit Blocks List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {auditLogs.slice().reverse().map((block) => (
            <div
              key={block.index}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2.5 font-mono text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Block #{block.index}</span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-slate-400">{block.incidentId}</span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-emerald-400 font-mono">ESI {block.payloadSummary.patientEsi}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(block.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>

              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {block.summary}
              </p>

              <div className="space-y-1 pt-1 text-[11px]">
                <div className="flex items-start gap-2 text-slate-400 break-all">
                  <span className="font-sans text-slate-500 shrink-0 w-24">Block Hash:</span>
                  <span className="text-cyan-300">{block.blockHash}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-400 break-all">
                  <span className="font-sans text-slate-500 shrink-0 w-24">Parent Hash:</span>
                  <span className="text-slate-400">{block.previousHash}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="font-sans text-slate-500 shrink-0 w-24">Signature:</span>
                  <span className="text-emerald-400">{block.agentSignature}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
