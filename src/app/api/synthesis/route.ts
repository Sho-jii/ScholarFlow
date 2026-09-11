import { NextRequest, NextResponse } from "next/server";
import { generateContentWithFailover, isMockMode } from "@/services/ai/gemini";
import { createClient, createAdminClient } from "@/services/supabase/server";

const SOCRATIC_COACH_INSTRUCTION = `
You are the Socratic Literature Synthesis Coach for AxiomProof assisting academic researchers, thesis candidates, and students across empirical, qualitative, and applied disciplines.

STRICT RESEARCH INTEGRITY & ANTI-GHOSTWRITING RULES:
1. NEVER draft, write, outline full paragraphs, or summarize on behalf of the researcher.
2. If the user asks "write my RRL", "draft chapter 2 for me", or "summarize this article for my paper", politely REFUSE and redirect them to analyze conceptual connections.
3. Prompt researchers with comparative inquiries: How do two authors' conclusions align or contrast? What are the trade-offs of their data gathering methods?
4. Actively push researchers to ground foreign literature into their declared local, regional, or institutional realities.
5. Keep your tone encouraging, scholarly, analytical, and mentor-like.
`;

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory, sessionId: incomingSessionId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const admin = createAdminClient();
    let userId: string | null = null;
    let groupId: string | null = null;

    try {
      const supabase = await createClient();
      const { data: authData } = await supabase.auth.getUser();
      userId = authData?.user?.id || null;

      if (userId) {
        const { data: member } = await admin
          .from("group_members")
          .select("group_id")
          .eq("student_id", userId)
          .maybeSingle();
        groupId = member?.group_id || null;
      }
    } catch {
      // Unauthenticated / guest session
    }

    // Determine or create session
    let sessionId = incomingSessionId;
    let sessionTopic = "";

    if (!sessionId || sessionId === "new") {
      // Derive topic from message (clean first sentence or first 50 chars)
      const cleanTopic =
        message.length > 50 ? message.slice(0, 48).trim() + "..." : message.trim();
      sessionTopic = cleanTopic;

      const { data: newSession, error: createErr } = await admin
        .from("synthesis_sessions")
        .insert({
          user_id: userId,
          group_id: groupId,
          topic: sessionTopic || "Socratic Synthesis Discussion",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("id, topic")
        .single();

      if (!createErr && newSession) {
        sessionId = newSession.id;
        sessionTopic = newSession.topic;
      }
    }

    // Save user message to database
    if (sessionId) {
      await admin.from("synthesis_messages").insert({
        session_id: sessionId,
        sender: "user",
        content: message,
        created_at: new Date().toISOString(),
      });
    }

    let reply = "";

    if (isMockMode) {
      if (message.toLowerCase().includes("write my") || message.toLowerCase().includes("draft")) {
        reply =
          "I must decline this request under DepEd research integrity guidelines. I cannot write or draft literature reviews for you. Instead, let's explore: What specific variables from your conceptual framework are you trying to synthesize?";
      } else {
        reply =
          "That is an interesting inquiry. When comparing your reference studies, notice how their environmental parameters differ. How might that explain divergent outcomes in your local Philippine setting?";
      }
    } else {
      const contents = [
        { text: SOCRATIC_COACH_INSTRUCTION },
        ...(conversationHistory || []).map((m: { sender: string; content: string }) => ({
          text: `${m.sender === "user" ? "Student" : "Coach"}: ${m.content}`,
        })),
        { text: `Student: ${message}` },
      ];

      try {
        const response = await generateContentWithFailover({
          contents,
          config: {
            temperature: 0.4,
          },
          preferDeep: false, // FAST_MODEL cascade: gemini-3.1-flash-lite -> gemini-3.5-flash-lite -> gemini-3.6-flash
        });

        reply = response?.text || "Let us evaluate that hypothesis against your conceptual framework...";
      } catch {
        reply =
          "Under DepEd academic standards, I guide literature synthesis through inquiry rather than ghostwriting. How does your selected variable relate to your participants in Oriental Mindoro?";
      }
    }

    // Save model reply to database
    if (sessionId) {
      await admin.from("synthesis_messages").insert({
        session_id: sessionId,
        sender: "model",
        content: reply,
        created_at: new Date().toISOString(),
      });

      // Update session timestamp
      await admin
        .from("synthesis_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", sessionId);
    }

    return NextResponse.json({
      reply,
      sessionId,
      topic: sessionTopic,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      {
        reply:
          "Under DepEd academic standards, I guide literature synthesis through inquiry rather than ghostwriting. What literature connection are you examining?",
      },
      { status: 200 }
    );
  }
}
