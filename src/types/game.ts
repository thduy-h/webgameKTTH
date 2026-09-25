export type QuestionTopic =
  | "reduce"
  | "reuse"
  | "repair"
  | "share"
  | "recycle"
  | "waste"
  | "food"
  | "general";
export type Question = {
  id: string;
  type: "multiple-choice" | "true-false";
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 1 | 2 | 3;
  topic: QuestionTopic;
};

export type Team = {
  id: string;
  name: string;
  mascot: string;
  color: string;
  position: number;
  score: number;
};
export type TileType =
  "NORMAL" | "QUESTION" | "BONUS" | "REPAIR" | "REUSE" | "PENALTY";
