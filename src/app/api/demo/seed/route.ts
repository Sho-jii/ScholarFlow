import { NextResponse } from "next/server";
import { createClient } from "@/services/supabase/server";
import { DEMO_MANUSCRIPT_AUDIT, DEMO_RESEARCH_GROUPS } from "@/services/mock/fallbackData";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If user is authenticated, use their ID. Otherwise, use a stable dummy UUID for demo
    const effectiveUserId = user?.id || "00000000-0000-0000-0000-000000000001";

    // Upsert demo teacher profile
    await supabase.from("profiles").upsert({
      id: effectiveUserId,
      email: user?.email || "adviser@canubing.deped.gov.ph",
      full_name: "Mrs. Carmela Reyes (Adviser)",
      role: "teacher",
      school_name: "Canubing National High School",
    });

    // Create or find demo section
    const { data: section } = await supabase
      .from("sections")
      .upsert(
        {
          teacher_id: effectiveUserId,
          name: "12 - STEM Copernicus",
          school_name: "Canubing National High School",
          academic_track: "STEM",
          enrollment_code: "STEM2026",
        },
        { onConflict: "enrollment_code" }
      )
      .select()
      .maybeSingle();

    const sectionId = section?.id;

    if (sectionId) {
      for (const groupData of DEMO_RESEARCH_GROUPS) {
        const { data: group } = await supabase
          .from("research_groups")
          .insert({
            section_id: sectionId,
            title: groupData.title,
            subject: groupData.subject,
            defense_clearance_issued: groupData.defense_clearance_issued,
          })
          .select()
          .single();

        if (group && groupData.isTargetAudit) {
          const { data: manuscript } = await supabase
            .from("manuscripts")
            .insert({
              group_id: group.id,
              file_path: "demo/solar_hydroponics_canubing.pdf",
              file_name: "Solar_Hydroponics_Calapan_Ch1-3.pdf",
              file_hash: "hash_calapan_solar_hydroponics_deped_2026",
              extracted_data: { pages: 38, chapters: [1, 2, 3] },
              uploaded_by: effectiveUserId,
            })
            .select()
            .single();

          if (manuscript) {
            const { data: report } = await supabase
              .from("audit_reports")
              .insert({
                manuscript_id: manuscript.id,
                readiness_score: DEMO_MANUSCRIPT_AUDIT.readinessScore,
                local_context_detected: DEMO_MANUSCRIPT_AUDIT.localContextDetected,
                synthesis_grade: DEMO_MANUSCRIPT_AUDIT.synthesisGrade,
                summary_critique: DEMO_MANUSCRIPT_AUDIT.summaryCritique,
              })
              .select()
              .single();

            if (report) {
              const issues = DEMO_MANUSCRIPT_AUDIT.alignmentMatrix.map((item) => ({
                audit_report_id: report.id,
                sop_statement: item.sopStatement,
                mapped_variable: item.mappedVariable,
                instrument_item: item.instrumentItem,
                status: item.status,
                feedback: item.feedback,
              }));
              await supabase.from("alignment_issues").insert(issues);
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Demo cohort & alignment matrix successfully populated.",
      data: DEMO_MANUSCRIPT_AUDIT,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err?.message || "Failed to seed demo" }, { status: 500 });
  }
}
