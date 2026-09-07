export type AlignmentStatus = "ALIGNED" | "MISALIGNED" | "PARTIALLY_ALIGNED" | "CRITICAL_GAP";

export interface AlignmentIssue {
  id?: string;
  sopStatement: string;
  mappedVariable?: string | null;
  instrumentItem?: string | null;
  status: AlignmentStatus;
  feedback: string;
}

export interface PreDefenseQuestion {
  targetedWeakness: string;
  question: string;
  rubricGuide: string;
}

export interface AuditReportData {
  id?: string;
  manuscriptId?: string;
  readinessScore: number;
  localContextDetected: boolean;
  synthesisGrade: string;
  summaryCritique: string;
  alignmentMatrix: AlignmentIssue[];
  preDefenseQuestions?: PreDefenseQuestion[];
  createdAt?: string;
}
