import { Schema, Type } from "@google/genai";

export const manuscriptAuditSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    readinessScore: {
      type: Type.INTEGER,
      description: "Overall score from 0-100 based on DepEd Senior High School research criteria",
    },
    localContextDetected: {
      type: Type.BOOLEAN,
      description: "True if the study is grounded in a Philippine local municipal or provincial setting",
    },
    synthesisGrade: {
      type: Type.STRING,
      description: "A, B, C, D, or F evaluating Chapter 2 literature synthesis quality",
    },
    summaryCritique: {
      type: Type.STRING,
      description: "High-level summary critique of structural alignment and methodology gaps",
    },
    alignmentMatrix: {
      type: Type.ARRAY,
      description: "Evaluation mapping of Statement of the Problem to Chapter 3 data gathering tools",
      items: {
        type: Type.OBJECT,
        properties: {
          sopStatement: {
            type: Type.STRING,
            description: "Specific question from Statement of the Problem (SOP)",
          },
          mappedVariable: {
            type: Type.STRING,
            description: "Corresponding conceptual framework or IPO variable",
          },
          instrumentItem: {
            type: Type.STRING,
            description: "Corresponding survey questionnaire or sensor logging tool in Chapter 3",
          },
          status: {
            type: Type.STRING,
            enum: ["ALIGNED", "MISALIGNED", "PARTIALLY_ALIGNED", "CRITICAL_GAP"],
            description: "Alignment classification",
          },
          feedback: {
            type: Type.STRING,
            description: "Actionable advisory on how to resolve the gap before oral defense",
          },
        },
        required: ["sopStatement", "status", "feedback"],
      },
    },
    preDefenseQuestions: {
      type: Type.ARRAY,
      description: "Challenging oral defense questions probing specific methodological vulnerabilities",
      items: {
        type: Type.OBJECT,
        properties: {
          targetedWeakness: {
            type: Type.STRING,
            description: "The specific gap or limitation in the paper being targeted",
          },
          question: {
            type: Type.STRING,
            description: "The oral defense panelist inquiry",
          },
          rubricGuide: {
            type: Type.STRING,
            description: "Criteria for an acceptable student oral defense response",
          },
        },
        required: ["targetedWeakness", "question", "rubricGuide"],
      },
    },
  },
  required: [
    "readinessScore",
    "localContextDetected",
    "synthesisGrade",
    "summaryCritique",
    "alignmentMatrix",
    "preDefenseQuestions",
  ],
};

export const defenseEvaluationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    masteryScore: {
      type: Type.INTEGER,
      description: "Score from 0-100 on student domain understanding and subject mastery",
    },
    justificationScore: {
      type: Type.INTEGER,
      description: "Score from 0-100 on defensibility of methodology, instruments, and sampling",
    },
    evaluatorFeedback: {
      type: Type.STRING,
      description: "Constructive spoken feedback pointing out flaws and strengths",
    },
    nextFollowupQuestion: {
      type: Type.STRING,
      description: "Follow-up question pressing deeper on limitations or alternatives",
    },
  },
  required: [
    "masteryScore",
    "justificationScore",
    "evaluatorFeedback",
    "nextFollowupQuestion",
  ],
};
