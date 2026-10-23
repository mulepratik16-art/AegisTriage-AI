import { HospitalFacility, FleetUnit, PatientIntake, AuditBlock, TriageEvaluation, DispatchRoutingDecision, AgentStep } from '../types';

export const INITIAL_HOSPITALS: HospitalFacility[] = [
  {
    id: 'hosp-01',
    name: 'Metropolitan General Hospital',
    type: 'LEVEL_1_TRAUMA',
    address: '1400 Civic Medical Plaza, Central Bay',
    lat: 37.7749,
    lng: -122.4194,
    icuBedsTotal: 36,
    icuBedsAvailable: 4,
    traumaBaysTotal: 6,
    traumaBaysAvailable: 2,
    ventilatorsAvailable: 9,
    operatingRoomsAvailable: 3,
    cathLabActive: true,
    strokeTeamActive: true,
    pediatricIcuActive: true,
    burnCenterActive: true,
    ecmoAvailable: true,
    isDiversion: false,
    averageOffloadMinutes: 14,
    contactFrequency: 'MedNet Channel 1 (155.340 MHz)'
  },
  {
    id: 'hosp-02',
    name: 'St. Jude Heart & Vascular Institute',
    type: 'STEMI_CENTER',
    address: '880 Coronado Parkway, South District',
    lat: 37.7562,
    lng: -122.3998,
    icuBedsTotal: 24,
    icuBedsAvailable: 6,
    traumaBaysTotal: 3,
    traumaBaysAvailable: 1,
    ventilatorsAvailable: 6,
    operatingRoomsAvailable: 2,
    cathLabActive: true,
    strokeTeamActive: false,
    pediatricIcuActive: false,
    burnCenterActive: false,
    ecmoAvailable: true,
    isDiversion: false,
    averageOffloadMinutes: 11,
    contactFrequency: 'MedNet Channel 2 (155.280 MHz)'
  },
  {
    id: 'hosp-03',
    name: 'Children’s Mercy Regional Hospital',
    type: 'PEDIATRIC_SPECIALTY',
    address: '320 University Valley Road, North Bay',
    lat: 37.7985,
    lng: -122.4352,
    icuBedsTotal: 28,
    icuBedsAvailable: 8,
    traumaBaysTotal: 4,
    traumaBaysAvailable: 3,
    ventilatorsAvailable: 12,
    operatingRoomsAvailable: 4,
    cathLabActive: false,
    strokeTeamActive: false,
    pediatricIcuActive: true,
    burnCenterActive: false,
    ecmoAvailable: true,
    isDiversion: false,
    averageOffloadMinutes: 9,
    contactFrequency: 'MedNet Channel 4 (155.400 MHz)'
  },
  {
    id: 'hosp-04',
    name: 'Bay Comprehensive Stroke & Neuro Center',
    type: 'COMPREHENSIVE_STROKE',
    address: '501 Pacific Heights Avenue, West Bay',
    lat: 37.7833,
    lng: -122.4467,
    icuBedsTotal: 20,
    icuBedsAvailable: 3,
    traumaBaysTotal: 3,
    traumaBaysAvailable: 2,
    ventilatorsAvailable: 5,
    operatingRoomsAvailable: 2,
    cathLabActive: true,
    strokeTeamActive: true,
    pediatricIcuActive: false,
    burnCenterActive: false,
    ecmoAvailable: false,
    isDiversion: false,
    averageOffloadMinutes: 12,
    contactFrequency: 'MedNet Channel 3 (155.160 MHz)'
  },
  {
    id: 'hosp-05',
    name: 'Harborview Community Medical Center',
    type: 'LEVEL_2_TRAUMA',
    address: '220 Industrial Maritime Blvd, East Harbor',
    lat: 37.7410,
    lng: -122.3850,
    icuBedsTotal: 18,
    icuBedsAvailable: 1,
    traumaBaysTotal: 4,
    traumaBaysAvailable: 1,
    ventilatorsAvailable: 3,
    operatingRoomsAvailable: 1,
    cathLabActive: false,
    strokeTeamActive: true,
    pediatricIcuActive: false,
    burnCenterActive: false,
    ecmoAvailable: false,
    isDiversion: true,
    diversionReason: 'ED Staffing Shortage - Level 2 Diversion',
    averageOffloadMinutes: 28,
    contactFrequency: 'MedNet Channel 5 (155.055 MHz)'
  },
  {
    id: 'hosp-06',
    name: 'Valley Acute Care & Trauma Center',
    type: 'COMMUNITY_ACUTE',
    address: '1150 Sunset Boulevard, Outer Valley',
    lat: 37.7320,
    lng: -122.4700,
    icuBedsTotal: 16,
    icuBedsAvailable: 5,
    traumaBaysTotal: 2,
    traumaBaysAvailable: 2,
    ventilatorsAvailable: 4,
    operatingRoomsAvailable: 2,
    cathLabActive: false,
    strokeTeamActive: false,
    pediatricIcuActive: false,
    burnCenterActive: false,
    ecmoAvailable: false,
    isDiversion: false,
    averageOffloadMinutes: 10,
    contactFrequency: 'MedNet Channel 6 (155.190 MHz)'
  }
];

export const INITIAL_FLEET: FleetUnit[] = [
  {
    id: 'unit-01',
    callSign: 'Medic 1 (ALS)',
    type: 'GROUND_ALS',
    status: 'AVAILABLE',
    lat: 37.7680,
    lng: -122.4150,
    crew: 'Capt. Vance (Paramedic) / Spec. Tran (EMT-A)',
    equipment: ['12-Lead ECG / Defibrillator', 'Video Laryngoscope', 'IV Infusion Pump', 'Cardiac Meds Pack']
  },
  {
    id: 'unit-02',
    callSign: 'Medic 4 (ALS)',
    type: 'GROUND_ALS',
    status: 'AVAILABLE',
    lat: 37.7850,
    lng: -122.4100,
    crew: 'Lt. Rodriguez (Paramedic) / Off. Chen (EMT)',
    equipment: ['12-Lead ECG / Defibrillator', 'Autopulse CPR', 'Advanced Airway Kit']
  },
  {
    id: 'unit-03',
    callSign: 'Air Medevac 1 (HEMS)',
    type: 'AIR_MEDEVAC_HEMS',
    status: 'AVAILABLE',
    lat: 37.7900,
    lng: -122.4600,
    crew: 'Pilot Miller / Flight Nurse Davis / Flight Paramedic Hayes',
    equipment: ['Mobile ECMO', 'Hamilton T1 Transport Vent', 'Whole Blood Packs (2U O-neg)', 'Point-of-Care Ultrasound']
  },
  {
    id: 'unit-04',
    callSign: 'CCT 2 (Critical Care)',
    type: 'CRITICAL_CARE_PARAMEDIC',
    status: 'AVAILABLE',
    lat: 37.7510,
    lng: -122.4300,
    crew: 'CCRN Kowalski / CCP Ramirez',
    equipment: ['Multi-channel IV Pumps', 'Arterial Line Monitor', 'Ventilator', 'IABP Console']
  },
  {
    id: 'unit-05',
    callSign: 'Medic 9 (BLS)',
    type: 'GROUND_BLS',
    status: 'AVAILABLE',
    lat: 37.7600,
    lng: -122.4500,
    crew: 'EMT Garcia / EMT Patel',
    equipment: ['AED', 'Oxygen Delivery System', 'Splints & Spinal Motion Restriction']
  }
];

export const PRESET_SCENARIOS: PatientIntake[] = [
  {
    id: 'PT-2026-9041',
    timestamp: '2026-10-23T08:42:00Z',
    age: 58,
    gender: 'M',
    chiefComplaint: 'Crushing substernal chest pressure radiating to left jaw and diaphoresis',
    symptomTimeline: 'Onset 35 minutes ago while ascending staircase at office; refractory to sublingual nitroglycerin x2',
    medicalHistory: ['Hypertension', 'Hyperlipidemia', 'Type 2 Diabetes', 'Previous smoker (20 pack-years)'],
    allergies: ['Penicillin (Hives)'],
    vitals: {
      heartRate: 112,
      systolicBp: 86,
      diastolicBp: 54,
      respiratoryRate: 24,
      spO2: 91,
      temperatureC: 36.8,
      gcs: 14,
      painScale: 9
    },
    fieldInterventions: [
      'Aspirin 324mg PO administered',
      'High-flow O2 via non-rebreather at 10 LPM',
      '18G IV established in right antecubital fossa',
      '12-lead ECG reveals 4mm ST-elevation in leads II, III, aVF with reciprocal depression in I, aVL (Inferior STEMI)'
    ],
    location: {
      lat: 37.7650,
      lng: -122.4210,
      address: '742 Market Street, Financial District'
    },
    incidentNarrative: 'Patient found pale, clammy, and clutching chest. Paramedics note hypotension (SBP 86) with inferior ST elevations. Shock index is 1.30, indicating impending cardiogenic shock. Door-to-balloon PCI window is urgent (<90 min).'
  },
  {
    id: 'PT-2026-9042',
    timestamp: '2026-10-23T08:47:00Z',
    age: 26,
    gender: 'F',
    chiefComplaint: 'High-speed motor vehicle collision with prolonged extrication, bilateral flail chest and blunt abdominal trauma',
    symptomTimeline: 'Collision occurred ~18 minutes ago; driver side T-bone impact at 55 mph with tree',
    medicalHistory: ['None known'],
    allergies: ['No Known Drug Allergies'],
    vitals: {
      heartRate: 138,
      systolicBp: 78,
      diastolicBp: 46,
      respiratoryRate: 32,
      spO2: 87,
      temperatureC: 35.9,
      gcs: 9,
      painScale: 10
    },
    fieldInterventions: [
      'Rapid sequence intubation (RSI) initiated with endotracheal tube secured at 22cm',
      'Right needle chest decompression performed for tension pneumothorax (audible rush of air)',
      'Pelvic binder placed',
      'Two large-bore 16G IVs running warmed Normal Saline'
    ],
    location: {
      lat: 37.7450,
      lng: -122.4020,
      address: 'Interstate 280 Southbound, Mile Marker 6'
    },
    incidentNarrative: 'Major polytrauma. Unstable hemodynamics (SBP 78, HR 138, Shock Index 1.77). Requires immediate Level 1 Trauma Center with emergent surgical resuscitation and massive transfusion protocol.'
  },
  {
    id: 'PT-2026-9043',
    timestamp: '2026-10-23T08:51:00Z',
    age: 7,
    gender: 'M',
    chiefComplaint: 'Continuous generalized tonic-clonic seizure refractory to pre-hospital benzodiazepines (Status Epilepticus)',
    symptomTimeline: 'Seizure activity began 26 minutes ago at school, witnessed by school nurse',
    medicalHistory: ['Known focal epilepsy with secondary generalization', 'Prior PICU admission in 2024'],
    allergies: ['Carbamazepine (Rash)'],
    vitals: {
      heartRate: 154,
      systolicBp: 108,
      diastolicBp: 68,
      respiratoryRate: 12,
      spO2: 89,
      temperatureC: 39.4,
      gcs: 6,
      painScale: 0
    },
    fieldInterventions: [
      'Midazolam 5mg IN administered by paramedics at minute 14, repeated 5mg IV at minute 22 with minimal cessation',
      'Bag-valve-mask ventilations with 100% O2',
      'End-tidal CO2 monitoring placed (ETCO2 52 mmHg)'
    ],
    location: {
      lat: 37.7910,
      lng: -122.4280,
      address: 'Marina Elementary School, 1800 Chestnut St'
    },
    incidentNarrative: 'Pediatric emergency. Status epilepticus exceeding 25 minutes requires immediate Pediatric Intensive Care Unit (PICU) with continuous video-EEG, second-line IV fosphenytoin/levetiracetam, and pediatric neuro-intensivist.'
  },
  {
    id: 'PT-2026-9044',
    timestamp: '2026-10-23T08:55:00Z',
    age: 71,
    gender: 'F',
    chiefComplaint: 'Sudden onset right-sided hemiplegia, expressive aphasia, and left gaze deviation (LVO Stroke)',
    symptomTimeline: 'Last known normal 42 minutes ago while having breakfast with spouse',
    medicalHistory: ['Atrial Fibrillation (non-compliant with anticoagulation)', 'Hypertension'],
    allergies: ['Sulfa drugs'],
    vitals: {
      heartRate: 88,
      systolicBp: 184,
      diastolicBp: 102,
      respiratoryRate: 18,
      spO2: 97,
      temperatureC: 37.0,
      gcs: 11,
      painScale: 2
    },
    fieldInterventions: [
      'Cincinnati Prehospital Stroke Scale: Facial droop (+), Arm drift (+), Abnormal speech (+)',
      'VAN screen positive for Large Vessel Occlusion (LVO)',
      'Blood glucose check: 118 mg/dL (rules out hypoglycemia)',
      '18G IV in left forearm'
    ],
    location: {
      lat: 37.7780,
      lng: -122.4550,
      address: 'Sunset Residential District, 14th Ave'
    },
    incidentNarrative: 'Acute ischemic stroke with suspected large vessel occlusion (LVO). Within thrombolysis window (<4.5 hrs) and mechanical endovascular thrombectomy window. Requires Comprehensive Stroke Center with active biplane neuro-angiography.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditBlock[] = [
  {
    index: 101,
    timestamp: '2026-10-23T07:15:22Z',
    incidentId: 'PT-2026-9038',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    blockHash: '7f9a8c14b2d398e09f58c7042a1768b725ef14a3875dc932e67df4807491cf02',
    agentSignature: 'AegisTriage-Protocol-v4.2-EdDSA',
    summary: 'Routed 64M STEMI to St. Jude Heart Institute. Cath lab prep alerted; ETA 8 mins.',
    verified: true,
    payloadSummary: {
      patientEsi: 1,
      destinationHospitalId: 'hosp-02',
      fleetUnitId: 'unit-01',
      overrideFlags: []
    }
  },
  {
    index: 102,
    timestamp: '2026-10-23T07:48:10Z',
    incidentId: 'PT-2026-9039',
    previousHash: '7f9a8c14b2d398e09f58c7042a1768b725ef14a3875dc932e67df4807491cf02',
    blockHash: '4d82b3a99e01f661cb27f8841a54728d141e6cc7a3f8983e870192bc51e89b21',
    agentSignature: 'AegisTriage-Protocol-v4.2-EdDSA',
    summary: 'Routed 31F Pelvic Crush Injury to Metro General Level 1 Trauma. Harborview bypassed due to Level 2 Diversion.',
    verified: true,
    payloadSummary: {
      patientEsi: 1,
      destinationHospitalId: 'hosp-01',
      fleetUnitId: 'unit-04',
      overrideFlags: ['DIVERSION_BYPASS_VERIFIED']
    }
  }
];

export const DEFAULT_INITIAL_TRIAGE: TriageEvaluation = {
  esiLevel: 1,
  esiCategory: 'Resuscitation (Immediate Life Threat)',
  shockIndex: 1.3,
  mapBp: 64.7,
  acuityScore: 95,
  clinicalRationale: 'Patient presents with acute inferior STEMI (4mm ST elevations in II, III, aVF) accompanied by severe hypotension (SBP 86 mmHg) and tachycardia (HR 112 bpm), yielding a Shock Index of 1.30 diagnostic of impending cardiogenic shock. Requires immediate emergent cardiac catheterization and percutaneous coronary intervention (PCI) within the 90-minute window.',
  requiredSpecialties: ['Interventional Cardiology / Cath Lab', 'Cardiovascular ICU', 'Coronary Care Unit'],
  criticalTimeWindowMinutes: 90,
  recommendedFieldActions: [
    'Acquire serial 12-lead ECGs every 10 minutes',
    'Withhold sublingual nitroglycerin due to right ventricular involvement and hypotension',
    'Initiate cautious IV crystalloid bolus (250ml) to maintain RV preload',
    'Transmit live rhythm telemetry directly to destination STEMI receiving center'
  ],
  safetyAlerts: [
    'Cardiogenic shock alert: Hemodynamic instability with SBP < 90',
    'Right ventricular infarction suspected: Nitrates contraindicated'
  ]
};

export const DEFAULT_INITIAL_ROUTING: DispatchRoutingDecision = {
  destinationHospital: INITIAL_HOSPITALS[1], // St. Jude Heart & Vascular Institute
  assignedFleetUnit: INITIAL_FLEET[0], // Medic 1 (ALS)
  transportType: 'GROUND_ALS',
  estimatedTransitMinutes: 7,
  totalTimeMinutes: 13,
  goldenHourRisk: 'LOW',
  optimizationScore: 98.4,
  diversionOverridden: false,
  preArrivalInstructions: [
    'Transmit 12-lead ECG telemetry directly to St. Jude Cardiac Emergency Intake',
    'Notify On-Duty Interventional Cardiologist on MedNet Channel 2 (155.280 MHz)',
    'Prepare Cath Lab Suite #1 for emergent primary PCI and radial artery access',
    'Pre-alert cardiac ICU for post-revascularization impella / inotrope support'
  ],
  reservedResources: {
    icuBedReserved: true,
    traumaBayReserved: true,
    cathLabPreAlerted: true,
    strokeTeamStandby: false,
    holdConfirmationId: 'HOLD-9041-CARD'
  }
};

export const DEFAULT_INITIAL_STEPS: AgentStep[] = [
  {
    agentName: 'Clinical Triage & Risk Stratification Agent',
    role: 'ESI & Resuscitation Diagnostics',
    status: 'COMPLETED',
    durationMs: 412,
    summary: 'Classified as ESI 1 (Resuscitation) with Shock Index 1.30. Required service: Interventional Cardiology / Cath Lab.',
    reasoning: 'Evaluated 12-lead ECG showing 4mm ST elevations with refractory chest pain, hypotension SBP 86, and tachycardia HR 112. Calculated Shock Index 1.30 confirms cardiogenic shock physiology requiring emergent revascularization.',
    metrics: {
      'ESI Level': 1,
      'Shock Index': 1.3,
      'Acuity Score': '95/100',
      'Golden Window': '90m'
    },
    guardrailsPassed: true,
    guardrailNotes: [
      'Validated hemodynamics against ESI-5 clinical triage criteria',
      'Identified critical contraindication: Nitroglycerin contraindicated in inferior/RV STEMI'
    ]
  },
  {
    agentName: 'Geospatial & Bed-Capacity Optimization Solver',
    role: 'Multi-Objective Resource Allocator',
    status: 'COMPLETED',
    durationMs: 284,
    summary: 'Selected St. Jude Heart & Vascular Institute (Score: 98.4, Transit: 7m). Assigned unit Medic 1 (ALS).',
    reasoning: 'Evaluated 6 regional medical centers. St. Jude Heart Institute features an active 24/7 STEMI Cath Lab with zero offload delay (11m avg) and 6 open ICU beds. Distance is 2.8 km with 7m transit time, well inside the 90m door-to-balloon benchmark.',
    metrics: {
      'Candidate Centers': 6,
      'Top Facility Score': 98.4,
      'Est. Transit Time': '7 min',
      'Distance': '2.8 km'
    },
    guardrailsPassed: true,
    guardrailNotes: [
      'Door-to-balloon target window satisfied (7m transit + 6m scene = 13m vs 90m limit)',
      'ALS crew certified for 12-lead ECG telemetry transmission'
    ]
  },
  {
    agentName: 'Clinical Safety & Protocol Guardrail Agent',
    role: 'Independent Adversarial Compliance Auditor',
    status: 'COMPLETED',
    durationMs: 198,
    summary: 'All safety guardrails verified: EMTALA compliance, cath lab readiness, and golden hour windows passed.',
    reasoning: 'Conducted independent regulatory verification: St. Jude is operating normally with no diversion. Receiving cath lab confirmed operational and accepting code STEMI alerts.',
    metrics: {
      'EMTALA Status': 'COMPLIANT',
      'Golden Window Status': 'LOW_RISK',
      'Checks Executed': 5
    },
    guardrailsPassed: true,
    guardrailNotes: [
      'Verified St. Jude Heart Institute is active and not on diversion',
      'Pre-arrival bypass protocol activated for direct catheterization suite entry'
    ]
  },
  {
    agentName: 'Autonomous Dispatch & Bed-Reservation Coordinator',
    role: 'Execution & Cryptographic Tamper-Proofing',
    status: 'COMPLETED',
    durationMs: 165,
    summary: 'Dispatched Medic 1 (ALS). Hold ID #HOLD-9041-CARD locked. Cryptographic SHA-256 seal generated.',
    reasoning: 'Locked automated cardiac ICU bed hold #HOLD-9041-CARD, signaled receiving cath team, and anchored the complete decision graph into the cryptographic SHA-256 ledger.',
    metrics: {
      'Bed Hold ID': 'HOLD-9041-CARD',
      'Dispatch Latency': '1059ms',
      'Audit Block': '#103'
    },
    guardrailsPassed: true,
    guardrailNotes: [
      'Cryptographic hash chain validated against parent block #102',
      'Pre-arrival notification transmitted over MedNet Channel 2'
    ]
  }
];

