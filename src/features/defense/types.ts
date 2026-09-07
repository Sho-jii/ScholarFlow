export interface DefenseEvaluation {
  masteryScore: number;
  justificationScore: number;
  evaluatorFeedback: string;
  nextFollowupQuestion: string;
}

export interface DefenseTurn {
  id: string;
  questionIndex: number;
  panelistQuestion: string;
  targetedWeakness: string;
  studentTranscript?: string;
  evaluation?: DefenseEvaluation;
}
