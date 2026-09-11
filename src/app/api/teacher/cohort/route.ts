import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/services/supabase/server";

export async function GET() {
  try {
    const admin = createAdminClient();

    // Query research groups with their sections, members, manuscripts, audits, and defense sessions
    const { data: groups, error } = await admin
      .from("research_groups")
      .select(`
        id,
        title,
        subject,
        defense_clearance_issued,
        clearance_issued_at,
        created_at,
        sections (
          id,
          name,
          academic_track
        ),
        group_members (
          id,
          student_id
        ),
        manuscripts (
          id,
          file_name,
          audit_reports (
            id,
            readiness_score,
            synthesis_grade,
            summary_critique,
            alignment_issues (
              id,
              sop_statement,
              mapped_variable,
              instrument_item,
              status,
              feedback
            )
          )
        ),
        defense_sessions (
          id,
          defense_turns (
            id
          )
        )
      `)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedCohort = (groups || []).map((g, index) => {
      const section = Array.isArray(g.sections) ? g.sections[0] : g.sections;
      const strand = section?.academic_track || "STEM";
      const membersCount = g.group_members?.length || 1;

      // Extract audit info from latest manuscript
      const manuscripts = g.manuscripts || [];
      const latestManuscript = manuscripts.length > 0 ? manuscripts[manuscripts.length - 1] : null;
      const auditReports = latestManuscript?.audit_reports || [];
      const latestAudit = auditReports.length > 0 ? auditReports[auditReports.length - 1] : null;

      const readinessScore = latestAudit?.readiness_score ?? 75;
      const synthesisGrade = latestAudit?.synthesis_grade || "B";
      const alignmentIssues = latestAudit?.alignment_issues || [];
      const unalignedCount = alignmentIssues.filter(
        (iss: { status: string }) => iss.status === "MISALIGNED" || iss.status === "CRITICAL_GAP"
      ).length;

      // Count mock turns across defense sessions
      const defenseSessions = g.defense_sessions || [];
      const mockTurnsCount = defenseSessions.reduce(
        (acc: number, ds: { defense_turns: unknown[] }) => acc + (ds.defense_turns?.length || 0),
        0
      );

      let status: "DEFENSE_READY" | "MODERATE_GAPS" | "CRITICAL_GAPS" = "DEFENSE_READY";
      if (readinessScore >= 80) status = "DEFENSE_READY";
      else if (readinessScore >= 60) status = "MODERATE_GAPS";
      else status = "CRITICAL_GAPS";

      return {
        id: g.id,
        groupNumber: index + 1,
        title: g.title,
        strand,
        membersCount,
        readinessScore,
        synthesisGrade,
        status,
        unalignedItemsCount: unalignedCount,
        mockTurnsCount: mockTurnsCount > 0 ? mockTurnsCount : 1,
        clearanceIssued: g.defense_clearance_issued,
        alignmentMatrix: alignmentIssues.map((iss: { sop_statement: string; mapped_variable: string; instrument_item: string; status: string; feedback: string }) => ({
          sopStatement: iss.sop_statement,
          mappedVariable: iss.mapped_variable,
          instrumentItem: iss.instrument_item,
          status: iss.status,
          feedback: iss.feedback,
        })),
      };
    });

    return NextResponse.json({ cohort: formattedCohort });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load cohort data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { groupId, clearanceIssued } = await req.json();

    if (!groupId) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
    }

    const admin = createAdminClient();

    const { error } = await admin
      .from("research_groups")
      .update({
        defense_clearance_issued: Boolean(clearanceIssued),
        clearance_issued_at: clearanceIssued ? new Date().toISOString() : null,
      })
      .eq("id", groupId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, clearanceIssued });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update clearance";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
