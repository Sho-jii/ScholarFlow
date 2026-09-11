export interface SynthesisMessage {
  id: string;
  sender: "user" | "model";
  content: string;
  timestamp: string;
}

export interface SynthesisSessionItem {
  id: string;
  topic: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastSnippet: string;
}
