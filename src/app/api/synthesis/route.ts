import { NextRequest, NextResponse } from "next/server";
import { generateContentWithFailover, isMockMode } from "@/services/ai/gemini";

const SOCRATIC_COACH_INSTRUCTION = `
You are the Socratic RRL Synthesis Coach for Canubing National High School senior high research students (Practical Research 1, Practical Research 2, and 3Is).

STRICT DEPED RESEARCH INTEGRITY RULES:
1. NEVER draft, write, outline full paragraphs, or summarize on behalf of the student.
2. If the user asks "write my RRL", "draft chapter 2 for me", or "summarize this article for my paper", politely REFUSE and redirect them to think about conceptual connections.
3. Prompt students with comparative inquiries: How do two authors' conclusions align or differ? What are the trade-offs of their data gathering methods?
4. Actively push students to ground foreign findings into local Philippine realities (e.g., MIMAROPA / Calapan City agricultural, economic, or school settings).
5. Keep your tone encouraging, scholarly, and mentor-like.
`;

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (isMockMode) {
      if (message.toLowerCase().includes("write my") || message.toLowerCase().includes("draft")) {
        return NextResponse.json({
          reply:
            "I must decline this request under DepEd research integrity guidelines. I cannot write or draft literature reviews for you. Instead, let's explore: What specific variables from your conceptual framework are you trying to synthesize?",
        });
      }
      return NextResponse.json({
        reply:
          "That is an interesting inquiry. When comparing your two reference studies, notice that one used an experimental hydroponic setup while the other relied on descriptive surveys. How might this methodological difference explain why their reported vegetative growth rates diverge?",
      });
    }

    const contents = [
      { text: SOCRATIC_COACH_INSTRUCTION },
      ...(conversationHistory || []).map((m: { sender: string; content: string }) => ({
        text: `${m.sender === "user" ? "Student" : "Coach"}: ${m.content}`,
      })),
      { text: `Student: ${message}` },
    ];

    const response = await generateContentWithFailover({
      contents,
      config: {
        temperature: 0.4,
      },
      preferDeep: false, // Use FAST_MODEL (gemini-1.5-flash) for rapid Socratic chat
    });

    return NextResponse.json({
      reply: response.text || "Let us evaluate that hypothesis against your conceptual framework...",
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      {
        reply:
          "Under DepEd academic standards, I guide literature synthesis through inquiry rather than ghostwriting. How does your selected variable relate to your participants in Oriental Mindoro?",
      },
      { status: 200 }
    );
  }
}
