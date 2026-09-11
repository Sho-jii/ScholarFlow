import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/services/supabase/server";

export async function GET() {
  try {
    let supabase;
    let userId: string | null = null;

    try {
      supabase = await createClient();
      const { data: authData } = await supabase.auth.getUser();
      userId = authData?.user?.id || null;
    } catch {
      supabase = createAdminClient();
    }

    const admin = createAdminClient();

    let query = admin
      .from("synthesis_sessions")
      .select(`
        id,
        user_id,
        group_id,
        topic,
        created_at,
        updated_at,
        synthesis_messages (
          id,
          sender,
          content,
          created_at
        )
      `)
      .order("updated_at", { ascending: false });

    // If authenticated user, prioritize their sessions
    if (userId) {
      // Find user's group if any
      const { data: memberRows } = await admin
        .from("group_members")
        .select("group_id")
        .eq("student_id", userId);
      const groupIds = memberRows?.map((m) => m.group_id) || [];

      if (groupIds.length > 0) {
        query = query.or(`user_id.eq.${userId},group_id.in.(${groupIds.join(",")})`);
      } else {
        query = query.eq("user_id", userId);
      }
    }

    const { data: sessions, error } = await query.limit(20);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format summary for list
    const formatted = (sessions || []).map((s) => {
      const messages = s.synthesis_messages || [];
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
      return {
        id: s.id,
        topic: s.topic,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
        messageCount: messages.length,
        lastSnippet: lastMessage ? lastMessage.content.slice(0, 100) + "..." : "No messages yet",
      };
    });

    return NextResponse.json({ sessions: formatted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load synthesis sessions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { topic, groupId } = await req.json();
    let userId: string | null = null;

    try {
      const supabase = await createClient();
      const { data: authData } = await supabase.auth.getUser();
      userId = authData?.user?.id || null;
    } catch {
      // Not signed in
    }

    const admin = createAdminClient();

    const { data: session, error } = await admin
      .from("synthesis_sessions")
      .insert({
        user_id: userId,
        group_id: groupId || null,
        topic: topic || "New Synthesis Inquiry",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ session });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create synthesis session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
