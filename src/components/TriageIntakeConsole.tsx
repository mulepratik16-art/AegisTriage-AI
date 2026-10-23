import React, { useState } from 'react';
import { PatientIntake, TriageEvaluation, DispatchRoutingDecision } from '../types/index.ts';
import { PRESET_SCENARIOS } from '../data/mockRegionalData.ts';
import { HeartPulse, Stethoscope, AlertCircle, ArrowRight, ShieldAlert, CheckCircle2, Clock, MapPin, Ambulance } from 'lucide-react';

interface TriageIntakeConsoleProps {
  patient: PatientIntake;
  setPatient: (patient: PatientIntake) => void;
  triage?: TriageEvaluation;
  routing?: DispatchRoutingDecision;
  isOrchestrating: boolean;
  onRunPipeline: () => void;
  onSelectPreset: (scenario: PatientIntake) => void;
}

export const TriageIntakeConsole: React.FC<TriageIntakeConsoleProps> = ({
  patient,
  setPatient,
  triage,
  routing,
  isOrchestrating,
  onRunPipeline,
  onSelectPreset
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Live physiological derivations
  const shockIndex = Number((patient.vitals.heartRate / (patient.vitals.systolicBp || 1)).toFixed(2));
  const mapBp = Number(((patient.vitals.systolicBp + 2 * patient.vitals.diastolicBp) / 3).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Preset Emergency Intake Scenarios Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Emergency Scenarios & Field Presets</h2>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Validated Clinical Profiles</span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {isEditing ? 'Done Editing' : 'Customize Patient Vitals'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_SCENARIOS.map((preset) => {
            const isSelected = patient.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-cyan-500/60 bg-cyan-950/30 ring-1 ring-cyan-500/30'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-200 mb-1">
                  <span className="truncate">{preset.age}{preset.gender} · {preset.chiefComplaint.split(' ')[0]} {preset.chiefComplaint.split(' ')[1] || ''}</span>
                  <span className="text-slate-400 font-mono text-[10px] shrink-0">{preset.id.slice(-4)}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.chiefComplaint}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400 font-mono tabular-nums">
                  <span>HR {preset.vitals.heartRate}</span>
                  <span>·</span>
                  <span>BP {preset.vitals.systolicBp}/{preset.vitals.diastolicBp}</span>
                  <span>·</span>
                  <span>GCS {preset.vitals.gcs}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Patient Telemetry & Vitals Monitor Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Incident ID: <strong className="text-slate-200 font-mono">{patient.id}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Intake: {new Date(patient.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span aria-hidden="true">·</span>
              <span>{patient.location.address}</span>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              {patient.age}-Year-Old {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Patient'} — {patient.chiefComplaint}
            </h1>
          </div>

          {/* Action Trigger */}
          <button
            onClick={onRunPipeline}
            disabled={isOrchestrating}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-md whitespace-nowrap shrink-0 ${
              isOrchestrating
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 active:scale-[0.98]'
            }`}
          >
            {isOrchestrating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Orchestrating Agents...</span>
              </>
            ) : (
              <>
                <HeartPulse className="w-4 h-4 text-slate-950" />
                <span>Run Autonomous Multi-Agent Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </>
            )}
          </button>
        </div>

        {/* Live Vitals Grid with Calculated Physiological Indices */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-5">
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Heart Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono tabular-nums text-white">{patient.vitals.heartRate}</span>
              <span className="text-[10px] text-slate-400">bpm</span>
            </div>
            <span className={`text-[10px] block mt-0.5 ${patient.vitals.heartRate > 100 ? 'text-amber-400' : 'text-slate-400'}`}>
              {patient.vitals.heartRate > 100 ? 'Tachycardia' : 'Nominal'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Blood Pressure</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono tabular-nums text-white">
                {patient.vitals.systolicBp}/{patient.vitals.diastolicBp}
              </span>
              <span className="text-[10px] text-slate-400">mmHg</span>
            </div>
            <span className={`text-[10px] block mt-0.5 ${patient.vitals.systolicBp < 90 ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
              {patient.vitals.systolicBp < 90 ? 'Hypotension (Shock)' : 'Normotensive'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Oxygen (SpO2)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono tabular-nums text-white">{patient.vitals.spO2}%</span>
            </div>
            <span className={`text-[10px] block mt-0.5 ${patient.vitals.spO2 < 92 ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
              {patient.vitals.spO2 < 90 ? 'Severe Hypoxemia' : patient.vitals.spO2 < 94 ? 'Mild Hypoxia' : 'Adequate'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Respiratory Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono tabular-nums text-white">{patient.vitals.respiratoryRate}</span>
              <span className="text-[10px] text-slate-400">/min</span>
            </div>
            <span className={`text-[10px] block mt-0.5 ${patient.vitals.respiratoryRate > 24 ? 'text-amber-400' : 'text-slate-400'}`}>
              {patient.vitals.respiratoryRate > 24 ? 'Tachypnea' : 'Regular'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Glasgow Coma (GCS)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono tabular-nums text-white">{patient.vitals.gcs}</span>
              <span className="text-[10px] text-slate-400">/15</span>
            </div>
            <span className={`text-[10px] block mt-0.5 ${patient.vitals.gcs <= 8 ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
              {patient.vitals.gcs <= 8 ? 'Severe (RSI Airway)' : patient.vitals.gcs <= 12 ? 'Moderate' : 'Intact'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-cyan-900/40 bg-cyan-950/20">
            <span className="text-[11px] text-cyan-300 block mb-1">Shock Index (HR/SBP)</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-bold font-mono tabular-nums ${shockIndex > 1.0 ? 'text-rose-400' : shockIndex > 0.9 ? 'text-amber-400' : 'text-cyan-400'}`}>
                {shockIndex}
              </span>
            </div>
            <span className={`text-[10px] block mt-0.5 ${shockIndex > 1.0 ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
              {shockIndex > 1.0 ? 'Impaired Perfusion' : shockIndex > 0.9 ? 'Elevated Alert' : 'Normal Range'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">MAP Pressure</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono tabular-nums text-white">{mapBp}</span>
              <span className="text-[10px] text-slate-400">mmHg</span>
            </div>
            <span className={`text-[10px] block mt-0.5 ${mapBp < 65 ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
              {mapBp < 65 ? 'Inadequate Organ Perfusion' : 'Adequate'}
            </span>
          </div>
        </div>

        {/* Clinical Narrative & Field Interventions Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-semibold text-slate-200 block">Symptom Timeline & Context</span>
            <p className="text-slate-300 leading-relaxed">{patient.symptomTimeline}</p>
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-slate-400">
              <span>Hx: {patient.medicalHistory.join(', ')}</span>
              <span aria-hidden="true">·</span>
              <span className="text-rose-300/80">Allergies: {patient.allergies.join(', ')}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-semibold text-slate-200 block">Pre-Hospital EMS Interventions</span>
            <ul className="space-y-1 text-slate-300">
              {patient.fieldInterventions.map((action: string, i: number) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">›</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Real-Time Resolved Triage & Dispatch Result (If available) */}
      {triage && routing && (
        <div className="rounded-xl border border-cyan-500/30 bg-slate-900/80 p-5 backdrop-blur-sm shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3.5">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded font-bold text-xs uppercase tracking-wider ${
                triage.esiLevel === 1 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                triage.esiLevel === 2 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}>
                ESI LEVEL {triage.esiLevel} · {triage.esiCategory}
              </div>
              <div className="text-xs text-slate-400">
                <span>Door-to-Bed Window: <strong className="text-white font-mono">{triage.criticalTimeWindowMinutes} min</strong></span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>Acuity Score: <strong className="text-white font-mono">{triage.acuityScore}/100</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Multi-Agent Consensus Reached</span>
            </div>
          </div>

          {/* Clinical Rationale Box */}
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs leading-relaxed text-slate-300">
            <span className="font-semibold text-cyan-400 block mb-1">Autonomous Clinical Assessment</span>
            {triage.clinicalRationale}
          </div>

          {/* Autonomous Routing & Destination Dispatch Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Destination Facility</span>
              <span className="text-sm font-bold text-white block">{routing.destinationHospital.name}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {routing.destinationHospital.type.replace(/_/g, ' ')}
              </span>
              {routing.diversionOverridden && (
                <span className="inline-block mt-2 text-[10px] font-semibold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/60">
                  EMTALA Override Applied
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Assigned Transport Unit</span>
              <div className="flex items-center gap-2">
                <Ambulance className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white">{routing.assignedFleetUnit.callSign}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Est. Transit: <strong className="text-white font-mono tabular-nums">{routing.estimatedTransitMinutes} min</strong> (Total: {routing.totalTimeMinutes}m)
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Cryptographic Hold Token</span>
              <span className="text-xs font-mono text-cyan-300 font-semibold block">
                {routing.reservedResources.holdConfirmationId}
              </span>
              <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Trauma Bay & Bed Locked</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
