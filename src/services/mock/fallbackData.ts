export interface AlignmentMatrixItem {
  sopStatement: string;
  mappedVariable: string;
  instrumentItem: string;
  status: "ALIGNED" | "MISALIGNED" | "PARTIALLY_ALIGNED" | "CRITICAL_GAP";
  feedback: string;
}

export interface DemoAuditReport {
  readinessScore: number;
  localContextDetected: boolean;
  synthesisGrade: string;
  summaryCritique: string;
  alignmentMatrix: AlignmentMatrixItem[];
  preDefenseQuestions: {
    targetedWeakness: string;
    question: string;
    rubricGuide: string;
  }[];
}

export const DEMO_MANUSCRIPT_AUDIT: DemoAuditReport = {
  readinessScore: 84,
  localContextDetected: true,
  synthesisGrade: "A",
  summaryCritique:
    "The manuscript demonstrates strong thematic synthesis in Chapter 2, referencing local climate conditions in Calapan City, Oriental Mindoro. However, Chapter 1 SOP #3 lacks an operationalized survey questionnaire item in the Chapter 3 data-gathering instrument.",
  alignmentMatrix: [
    {
      sopStatement:
        "1. What is the baseline power generation efficiency of the 50W polycrystalline solar panel during peak sunlight hours in Barangay Canubing?",
      mappedVariable: "Solar Power Output (Watts / Lux)",
      instrumentItem: "Instrument Item 1.1–1.4: Daily Multimeter & Pyranometer Log Sheet",
      status: "ALIGNED",
      feedback: "Measurable and directly paired with physical sensor logging protocol.",
    },
    {
      sopStatement:
        "2. How does the automated water recirculation rate affect the vegetative growth (plant height and leaf count) of Lactuca sativa (lettuce)?",
      mappedVariable: "Water Recirculation Interval (Liters/Hour) & Vegetative Biomass",
      instrumentItem: "Instrument Item 2.1: Weekly Agronomic Ruler & Caliper Observation Matrix",
      status: "ALIGNED",
      feedback: "Clear operationalization with valid agronomic measurement scales.",
    },
    {
      sopStatement:
        "3. Is there a significant relationship between ambient water salinity levels and electrical conductivity (EC) sensor drift over a 30-day testing cycle?",
      mappedVariable: "Salinity Concentration (PPM) vs. EC Sensor Drift",
      instrumentItem: "MISSING / NOT OPERATIONALIZED",
      status: "CRITICAL_GAP",
      feedback:
        "Critical Gap: The Statement of the Problem explicitly investigates salinity drift, but the Chapter 3 Survey & Observation Guide contains no test procedure or data table for recording PPM benchmarks.",
    },
    {
      sopStatement:
        "4. What is the cost-benefit viability of deploying this automated system compared to traditional soil-based backyard farming for DepEd Gulayan sa Paaralan?",
      mappedVariable: "Return on Investment (ROI) & Maintenance Cost per Crop Cycle",
      instrumentItem: "Instrument Item 4.1–4.5: Cost Analysis Worksheet & Farmer Interview Protocol",
      status: "ALIGNED",
      feedback: "Complete economic feasibility table matched with stakeholder interview guide.",
    },
  ],
  preDefenseQuestions: [
    {
      targetedWeakness: "Missing Salinity Calibration Instrument in Methodology",
      question:
        "Your third research question investigates electrical conductivity drift under varying salinity levels, yet your Chapter 3 data-gathering guide provides no calibration protocol or PPM recording table. How do you intend to measure and validate this relationship during data collection?",
      rubricGuide:
        "The student must acknowledge the gap and provide a concrete technical workaround (e.g., standardizing a 1413 µS/cm calibration buffer solution logged at 25°C intervals).",
    },
    {
      targetedWeakness: "Purposive Sampling Limitations in Agricultural Setup",
      question:
        "You selected only 40 sample plants across two deep-water culture troughs. How does this sample size withstand mortality risks, and can your findings be generalized to commercial hydroponics?",
      rubricGuide:
        "The student must justify the sample size by referencing statistical power or pilot-study constraints, and emphasize scope boundaries (Gulayan sa Paaralan micro-farms rather than commercial estates).",
    },
    {
      targetedWeakness: "Solar Battery Storage Autonomy under Calapan Monsoon Season",
      question:
        "Calapan City experiences intense rainfall and typhoon frequency during the third quarter. How does your battery reserve calculations sustain pump automation during consecutive overcast days?",
      rubricGuide:
        "The student should explain the 12V 18Ah lead-acid capacity, days of autonomy calculation (typically 48 hours), and low-power microcontroller sleep mode integration.",
    },
  ],
};

export const DEMO_RESEARCH_GROUPS = [
  {
    title: "Development & Performance Evaluation of an Automated Solar-Powered Hydroponic Monitoring System in Calapan City",
    subject: "PR2_QUANTITATIVE",
    isTargetAudit: true,
    defense_clearance_issued: false,
  },
  {
    title: "Lived Experiences of Senior High School Students in Balancing Academic Demands and Gig Economy Work in Oriental Mindoro",
    subject: "PR1_QUALITATIVE",
    isTargetAudit: false,
    defense_clearance_issued: true,
  },
  {
    title: "Synthesizing Banana Pseudostem Fibers as an Eco-Friendly Packaging Alternative for Local Public Markets",
    subject: "3IS",
    isTargetAudit: false,
    defense_clearance_issued: false,
  },
];
