export interface SynthesisMessage {
  id: string;
  sender: "user" | "model";
  content: string;
  timestamp: string;
}

export interface SynthesisSession {
  id: string;
  topic: string;
  messages: SynthesisMessage[];
}
