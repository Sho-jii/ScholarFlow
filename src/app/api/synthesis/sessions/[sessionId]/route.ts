import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/services/supabase/server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params;
    const admin = createAdminClient();

    const { data: session, error: sessionErr } = await admin
      .from("synthesis_sessions")
      .select("id, user_id, group_id, topic, created_at, updated_at")
      .eq("id", sessionId)
      .single();

    if (sessionErr || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const { data: messages, error: messagesErr } = await admin
      .from("synthesis_messages")
      .select("id, sender, content, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (messagesErr) {
      return NextResponse.json({ error: messagesErr.message }, { status: 500 });
    }

    const formattedMessages = (messages || []).map((m) => ({
      id: m.id,
      sender: m.sender,
      content: m.content,
      timestamp: new Date(m.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    return NextResponse.json({
      session,
      messages: formattedMessages,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load session messages";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params;
    const admin = createAdminClient();

    const { error } = await admin
      .from("synthesis_sessions")
      .delete()
      .eq("id", sessionId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
