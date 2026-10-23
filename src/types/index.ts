export type EsiLevel = 1 | 2 | 3 | 4 | 5;

export type TransportType = 'GROUND_ALS' | 'GROUND_BLS' | 'CRITICAL_CARE_PARAMEDIC' | 'AIR_MEDEVAC_HEMS';

export interface PatientVitals {
  heartRate: number;
  systolicBp: number;
  diastolicBp: number;
  respiratoryRate: number;
  spO2: number;
  temperatureC: number;
  gcs: number; // Glasgow Coma Scale (3-15)
  painScale: number; // 0-10
}

export interface PatientIntake {
  id: string;
  timestamp: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  chiefComplaint: string;
  symptomTimeline: string;
  medicalHistory: string[];
  allergies: string[];
  vitals: PatientVitals;
  fieldInterventions: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  incidentNarrative: string;
}

export interface TriageEvaluation {
  esiLevel: EsiLevel;
  esiCategory: string; // e.g. "Resuscitation" | "Emergent" | "Urgent" | "Less Urgent" | "Non-urgent"
  shockIndex: number; // HR / SBP (>0.9 indicates shock risk)
  mapBp: number; // Mean Arterial Pressure
  acuityScore: number; // 0-100
  clinicalRationale: string;
  requiredSpecialties: string[];
  criticalTimeWindowMinutes: number; // e.g. 60 min golden hour
  recommendedFieldActions: string[];
  safetyAlerts: string[];
}

export interface HospitalFacility {
  id: string;
  name: string;
  type: 'LEVEL_1_TRAUMA' | 'LEVEL_2_TRAUMA' | 'COMPREHENSIVE_STROKE' | 'STEMI_CENTER' | 'PEDIATRIC_SPECIALTY' | 'COMMUNITY_ACUTE';
  address: string;
  lat: number;
  lng: number;
  icuBedsTotal: number;
  icuBedsAvailable: number;
  traumaBaysTotal: number;
  traumaBaysAvailable: number;
  ventilatorsAvailable: number;
  operatingRoomsAvailable: number;
  cathLabActive: boolean;
  strokeTeamActive: boolean;
  pediatricIcuActive: boolean;
  burnCenterActive: boolean;
  ecmoAvailable: boolean;
  isDiversion: boolean;
  diversionReason?: string;
  averageOffloadMinutes: number;
  contactFrequency: string;
}

export interface FleetUnit {
  id: string;
  callSign: string;
  type: TransportType;
  status: 'AVAILABLE' | 'EN_ROUTE_INCIDENT' | 'ON_SCENE' | 'TRANSPORTING' | 'AT_HOSPITAL' | 'OFFLINE';
  lat: number;
  lng: number;
  crew: string;
  equipment: string[];
  etaMinutesToTarget?: number;
  assignedIncidentId?: string;
}

export interface AgentStep {
  agentName: string;
  role: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'OVERRIDDEN' | 'FAILED';
  durationMs: number;
  summary: string;
  reasoning: string;
  metrics?: Record<string, string | number>;
  guardrailsPassed?: boolean;
  guardrailNotes?: string[];
}

export interface DispatchRoutingDecision {
  destinationHospital: HospitalFacility;
  assignedFleetUnit: FleetUnit;
  transportType: TransportType;
  estimatedTransitMinutes: number;
  totalTimeMinutes: number; // Scene to Bed
  goldenHourRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL_EXCEEDED';
  optimizationScore: number;
  diversionOverridden: boolean;
  preArrivalInstructions: string[];
  reservedResources: {
    icuBedReserved: boolean;
    traumaBayReserved: boolean;
    cathLabPreAlerted: boolean;
    strokeTeamStandby: boolean;
    holdConfirmationId: string;
  };
}

export interface AuditBlock {
  index: number;
  timestamp: string;
  incidentId: string;
  previousHash: string;
  blockHash: string;
  agentSignature: string;
  summary: string;
  verified: boolean;
  payloadSummary: {
    patientEsi: number;
    destinationHospitalId: string;
    fleetUnitId: string;
    overrideFlags: string[];
  };
}

export interface OrchestrationResult {
  incidentId: string;
  patient: PatientIntake;
  triage: TriageEvaluation;
  routing: DispatchRoutingDecision;
  steps: AgentStep[];
  auditBlock: AuditBlock;
  timestamp: string;
}

export interface MCICasualty {
  id: string;
  tag: 'RED' | 'YELLOW' | 'GREEN' | 'BLACK';
  triageCategory: string;
  age: number;
  gender: string;
  chiefInjury: string;
  vitalsSummary: string;
  recommendedHospital: string;
  transportUnit: string;
  etaMinutes: number;
  status: 'PENDING' | 'DISPATCHED' | 'EN_ROUTE' | 'ADMITTED';
}

export interface MCISimulationResult {
  scenarioName: string;
  totalCasualties: number;
  triageDistribution: {
    red: number;
    yellow: number;
    green: number;
    black: number;
  };
  casualties: MCICasualty[];
  facilityLoadImpact: {
    hospitalId: string;
    hospitalName: string;
    assignedCount: number;
    postSurgeIcuPercent: number;
  }[];
  bottlenecksAverted: string[];
  dispatchExecutionDurationSec: number;
}
