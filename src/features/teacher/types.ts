export interface CohortGroup {
  id: string;
  groupNumber: number;
  title: string;
  strand: string;
  membersCount: number;
  readinessScore: number;
  synthesisGrade: string;
  status: "DEFENSE_READY" | "MODERATE_GAPS" | "CRITICAL_GAPS";
  unalignedItemsCount: number;
  mockTurnsCount: number;
  clearanceIssued: boolean;
}
