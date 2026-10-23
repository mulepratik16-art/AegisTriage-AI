import React, { useState } from 'react';
import { HospitalFacility, FleetUnit, PatientIntake, DispatchRoutingDecision } from '../types';
import { Building2, Navigation, Wind, Info, Radio, AlertTriangle } from 'lucide-react';

interface TacticalGridMapProps {
  hospitals: HospitalFacility[];
  fleet: FleetUnit[];
  activePatient: PatientIntake;
  routingDecision?: DispatchRoutingDecision;
  onToggleDiversion: (hospitalId: string) => void;
}

export const TacticalGridMap: React.FC<TacticalGridMapProps> = ({
  hospitals,
  fleet,
  activePatient,
  routingDecision,
  onToggleDiversion
}) => {
  const [selectedHospital, setSelectedHospital] = useState<HospitalFacility | null>(null);
  const [selectedFleetUnit, setSelectedFleetUnit] = useState<FleetUnit | null>(null);
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<'ALL' | 'AVAILABLE' | 'HEMS'>('ALL');

  // Convert geographic coordinates to SVG viewport bounds
  // Lat: ~37.72 to 37.81, Lng: -122.48 to -122.37
  const minLat = 37.72;
  const maxLat = 37.81;
  const minLng = -122.48;
  const maxLng = -122.37;

  const projectToSvg = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 880 + 60;
    const y = 560 - ((lat - minLat) / (maxLat - minLat)) * 480 + 20;
    return { x: Math.max(40, Math.min(960, x)), y: Math.max(30, Math.min(540, y)) };
  };

  const patientCoords = projectToSvg(activePatient.location.lat, activePatient.location.lng);

  const destinationHospital = routingDecision
    ? hospitals.find(h => h.id === routingDecision.destinationHospital.id) || routingDecision.destinationHospital
    : null;

  const destCoords = destinationHospital
    ? projectToSvg(destinationHospital.lat, destinationHospital.lng)
    : null;

  const filteredFleet = fleet.filter(unit => {
    if (filterType === 'AVAILABLE') return unit.status === 'AVAILABLE';
    if (filterType === 'HEMS') return unit.type === 'AIR_MEDEVAC_HEMS';
    return true;
  });

  return (
    <div className="relative w-full rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-sm">
      {/* Top Map Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Regional Tactical GIS</span>
            <span aria-hidden="true">·</span>
            <span>Bay Metro Emergency Service Area</span>
            <span aria-hidden="true">·</span>
            <span>6 Primary Centers</span>
          </div>
        </div>

        {/* Interactive Filter Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                filterType === 'ALL' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Fleet ({fleet.length})
            </button>
            <button
              onClick={() => setFilterType('AVAILABLE')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                filterType === 'AVAILABLE' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Available ({fleet.filter(f => f.status === 'AVAILABLE').length})
            </button>
            <button
              onClick={() => setFilterType('HEMS')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                filterType === 'HEMS' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Air Medevac
            </button>
          </div>

          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`px-3 py-1 text-xs font-medium rounded border transition-colors whitespace-nowrap ${
              showTraffic
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {showTraffic ? 'Traffic Overlay: High Congestion' : 'Traffic: Hidden'}
          </button>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="relative w-full h-[520px] bg-slate-950 overflow-hidden select-none">
        <svg
          viewBox="0 0 1000 580"
          className="w-full h-full"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, #090e17 0%, #030712 100%)' }}
        >
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.2)" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <rect width="1000" height="580" fill="url(#grid)" />

          {/* Water coastline backdrop simulation */}
          <path
            d="M 680 0 Q 720 180 840 280 T 960 580 L 1000 580 L 1000 0 Z"
            fill="#081426"
            stroke="#1e293b"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <text x="880" y="80" fill="#334155" fontSize="12" fontFamily="sans-serif" letterSpacing="2">
            PACIFIC WATERWAY
          </text>

          {/* Main Transportation Arteries */}
          {/* I-280 corridor */}
          <path
            d="M 120 540 Q 340 380 520 220 T 700 40"
            fill="none"
            stroke={showTraffic ? '#b45309' : '#334155'}
            strokeWidth={showTraffic ? '4' : '2'}
            strokeDasharray={showTraffic ? '8 4' : undefined}
            opacity="0.85"
          />
          <text x="280" y="440" fill="#64748b" fontSize="10" transform="rotate(-36 280 440)">
            I-280 HIGHWAY CORRIDOR
          </text>

          {/* US-101 arterial */}
          <path
            d="M 380 560 Q 560 380 620 180 T 640 20"
            fill="none"
            stroke={showTraffic ? '#dc2626' : '#334155'}
            strokeWidth={showTraffic ? '3.5' : '2'}
            opacity="0.85"
          />
          <text x="560" y="320" fill="#64748b" fontSize="10" transform="rotate(-58 560 320)">
            US-101 ARTERIAL (HEAVY CONGESTION)
          </text>

          {/* Secondary Boulevard */}
          <path
            d="M 60 260 L 900 260"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Route path from active patient incident to recommended hospital */}
          {destCoords && (
            <g>
              <line
                x1={patientCoords.x}
                y1={patientCoords.y}
                x2={destCoords.x}
                y2={destCoords.y}
                stroke="url(#routeGradient)"
                strokeWidth="3.5"
                strokeDasharray="6 4"
                filter="url(#glow)"
              />
              {/* Midpoint ETA Badge */}
              <rect
                x={(patientCoords.x + destCoords.x) / 2 - 42}
                y={(patientCoords.y + destCoords.y) / 2 - 14}
                width="84"
                height="24"
                rx="4"
                fill="#0f172a"
                stroke="#06b6d4"
                strokeWidth="1.5"
              />
              <text
                x={(patientCoords.x + destCoords.x) / 2}
                y={(patientCoords.y + destCoords.y) / 2 + 3}
                fill="#38bdf8"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
                className="font-mono tabular-nums"
              >
                ETA {routingDecision?.estimatedTransitMinutes || 8} min
              </text>
            </g>
          )}

          {/* Render Hospital Nodes */}
          {hospitals.map(hospital => {
            const pos = projectToSvg(hospital.lat, hospital.lng);
            const isDestination = destinationHospital?.id === hospital.id;
            const isSelected = selectedHospital?.id === hospital.id;
            const icuPercent = Math.round(
              ((hospital.icuBedsTotal - hospital.icuBedsAvailable) / hospital.icuBedsTotal) * 100
            );

            return (
              <g
                key={hospital.id}
                className="cursor-pointer transition-transform"
                onClick={() => setSelectedHospital(hospital)}
              >
                {/* Diversion Warning Halo if active */}
                {hospital.isDiversion && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="24"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    opacity="0.8"
                  />
                )}

                {/* Primary Destination Pulse Halo */}
                {isDestination && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="28"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    opacity="0.9"
                    filter="url(#glow)"
                  />
                )}

                {/* Center Hospital Anchor Node */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="16"
                  fill={isDestination ? '#0284c7' : hospital.isDiversion ? '#450a0a' : '#0f172a'}
                  stroke={isDestination ? '#38bdf8' : hospital.isDiversion ? '#ef4444' : isSelected ? '#38bdf8' : '#334155'}
                  strokeWidth={isSelected || isDestination ? '2.5' : '1.5'}
                />

                {/* Medical Cross Icon inside node */}
                <path
                  d={`M ${pos.x - 4} ${pos.y} L ${pos.x + 4} ${pos.y} M ${pos.x} ${pos.y - 4} L ${pos.x} ${pos.y + 4}`}
                  stroke={hospital.isDiversion ? '#f87171' : '#ffffff'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Capacity Arc indicator: ICU Load */}
                <text
                  x={pos.x}
                  y={pos.y - 20}
                  fill={isDestination ? '#38bdf8' : '#e2e8f0'}
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {hospital.name.replace('Hospital', '').replace('Institute', '').trim()}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 28}
                  fill="#94a3b8"
                  fontSize="9.5"
                  textAnchor="middle"
                  className="font-mono tabular-nums"
                >
                  {hospital.isDiversion ? 'DIVERSION ACTIVE' : `ICU: ${hospital.icuBedsAvailable} free (${icuPercent}%)`}
                </text>
              </g>
            );
          })}

          {/* Render Active Patient Incident Marker */}
          <g>
            <circle
              cx={patientCoords.x}
              cy={patientCoords.y}
              r="18"
              fill="rgba(239, 68, 68, 0.2)"
              stroke="#ef4444"
              strokeWidth="2"
              filter="url(#glow)"
            />
            <circle
              cx={patientCoords.x}
              cy={patientCoords.y}
              r="6"
              fill="#ef4444"
            />
            <text
              x={patientCoords.x}
              y={patientCoords.y - 24}
              fill="#f87171"
              fontSize="11"
              fontWeight="700"
              textAnchor="middle"
            >
              ACTIVE INCIDENT #{activePatient.id.slice(-4)}
            </text>
            <text
              x={patientCoords.x}
              y={patientCoords.y + 26}
              fill="#cbd5e1"
              fontSize="9"
              textAnchor="middle"
            >
              {activePatient.location.address}
            </text>
          </g>

          {/* Render Fleet Units */}
          {filteredFleet.map(unit => {
            const uPos = projectToSvg(unit.lat, unit.lng);
            const isAssigned = routingDecision?.assignedFleetUnit.id === unit.id;
            const isAir = unit.type === 'AIR_MEDEVAC_HEMS';

            return (
              <g
                key={unit.id}
                className="cursor-pointer"
                onClick={() => setSelectedFleetUnit(unit)}
              >
                <circle
                  cx={uPos.x}
                  cy={uPos.y}
                  r={isAir ? '10' : '8'}
                  fill={isAssigned ? '#10b981' : isAir ? '#8b5cf6' : '#1e293b'}
                  stroke={isAssigned ? '#34d399' : isAir ? '#c084fc' : '#475569'}
                  strokeWidth="1.5"
                />
                <text
                  x={uPos.x}
                  y={uPos.y - 12}
                  fill={isAssigned ? '#34d399' : '#cbd5e1'}
                  fontSize="9.5"
                  fontWeight="500"
                  textAnchor="middle"
                >
                  {unit.callSign}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Quick Stats Overlay on Map */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-slate-950/90 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-300 backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Target Destination</span>
          </div>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Assigned Unit</span>
          </div>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <span>Air Medevac</span>
          </div>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Incident / Diversion</span>
          </div>
        </div>
      </div>

      {/* Selected Node Inspection Drawer */}
      {selectedHospital && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/95 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">{selectedHospital.name}</span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">{selectedHospital.type.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{selectedHospital.address}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">ICU Beds: {selectedHospital.icuBedsAvailable}/{selectedHospital.icuBedsTotal} free</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">Trauma Bays: {selectedHospital.traumaBaysAvailable}/{selectedHospital.traumaBaysTotal}</span>
              <span aria-hidden="true">·</span>
              <span>Avg Offload: {selectedHospital.averageOffloadMinutes}m</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleDiversion(selectedHospital.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors whitespace-nowrap ${
                selectedHospital.isDiversion
                  ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
            >
              {selectedHospital.isDiversion ? 'Deactivate Diversion Status' : 'Declare Surge Diversion'}
            </button>
            <button
              onClick={() => setSelectedHospital(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {selectedFleetUnit && !selectedHospital && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/95 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-white">{selectedFleetUnit.callSign}</span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">{selectedFleetUnit.type}</span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-emerald-400 font-mono">{selectedFleetUnit.status}</span>
            </div>
            <div className="text-xs text-slate-400">
              <span>Crew: {selectedFleetUnit.crew}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>Equipment: {selectedFleetUnit.equipment.slice(0, 3).join(', ')}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedFleetUnit(null)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
