import React from 'react';
import { HospitalFacility } from '../types';
import { Building2, AlertTriangle, ShieldCheck, Radio, Check, X } from 'lucide-react';

interface HospitalNetworkPanelProps {
  hospitals: HospitalFacility[];
  onToggleDiversion: (hospitalId: string) => void;
}

export const HospitalNetworkPanel: React.FC<HospitalNetworkPanelProps> = ({
  hospitals,
  onToggleDiversion
}) => {
  return (
    <div className="space-y-4">
      {/* Overview stats bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Regional Hospital Network & Critical Capacity</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-center bed telemetry, surgical suite readiness, and emergency diversion control.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 font-mono tabular-nums">
          <div>
            <span>Total ICU Beds: </span>
            <strong className="text-white">
              {hospitals.reduce((acc, h) => acc + h.icuBedsAvailable, 0)}/
              {hospitals.reduce((acc, h) => acc + h.icuBedsTotal, 0)} Free
            </strong>
          </div>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <div>
            <span>Trauma Bays: </span>
            <strong className="text-white">
              {hospitals.reduce((acc, h) => acc + h.traumaBaysAvailable, 0)} Free
            </strong>
          </div>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <div>
            <span>On Diversion: </span>
            <strong className={hospitals.some(h => h.isDiversion) ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
              {hospitals.filter(h => h.isDiversion).length} Facility
            </strong>
          </div>
        </div>
      </div>

      {/* High-Density Hospital Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Hospital Facility</th>
                <th className="py-3 px-4">Acuity Tier</th>
                <th className="py-3 px-4 text-right">ICU Capacity</th>
                <th className="py-3 px-4 text-right">Trauma Bays</th>
                <th className="py-3 px-4">Active Specialty Lines</th>
                <th className="py-3 px-4 text-right">Avg Offload</th>
                <th className="py-3 px-4 text-center">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {hospitals.map((hospital) => {
                const icuOccupied = hospital.icuBedsTotal - hospital.icuBedsAvailable;
                const icuPercent = Math.round((icuOccupied / hospital.icuBedsTotal) * 100);

                return (
                  <tr key={hospital.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">{hospital.name}</span>
                      <span className="text-[11px] text-slate-400">{hospital.address}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-300 font-medium">{hospital.type.replace(/_/g, ' ')}</span>
                      <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{hospital.contactFrequency}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono tabular-nums font-semibold text-white">
                        {hospital.icuBedsAvailable} <span className="text-slate-400 font-normal">/ {hospital.icuBedsTotal} free</span>
                      </div>
                      <div className="w-24 ml-auto h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                        <div
                          className={`h-full rounded-full ${
                            icuPercent > 85 ? 'bg-rose-500' : icuPercent > 70 ? 'bg-amber-400' : 'bg-cyan-400'
                          }`}
                          style={{ width: `${icuPercent}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-white">
                      {hospital.traumaBaysAvailable} / {hospital.traumaBaysTotal}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 text-[10px] text-slate-300">
                        {hospital.cathLabActive && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">Cath Lab</span>
                        )}
                        {hospital.strokeTeamActive && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700">Stroke LVO</span>
                        )}
                        {hospital.pediatricIcuActive && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">PICU</span>
                        )}
                        {hospital.ecmoAvailable && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">ECMO</span>
                        )}
                        {hospital.burnCenterActive && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-rose-300 border border-slate-700">Burn</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <span className={hospital.averageOffloadMinutes > 20 ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                        {hospital.averageOffloadMinutes} min
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onToggleDiversion(hospital.id)}
                        className={`px-3 py-1 text-[11px] font-semibold rounded border transition-colors whitespace-nowrap ${
                          hospital.isDiversion
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                        {hospital.isDiversion ? 'Diversion Active' : 'Active Intake'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
