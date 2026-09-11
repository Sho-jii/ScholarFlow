import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/services/supabase/server";
import { DEMO_MANUSCRIPT_AUDIT, DEMO_RESEARCH_GROUPS } from "@/services/mock/fallbackData";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Use admin client to ensure seed operations bypass restrictive RLS policies
    const admin = createAdminClient();

    let effectiveUserId = user?.id;

    if (!effectiveUserId) {
      // Find or create demo teacher user via admin auth
      const { data: existingUsers } = await admin.auth.admin.listUsers();
      const demoUser = existingUsers?.users?.find((u) => u.email === "adviser@canubing.deped.gov.ph");

      if (demoUser) {
        effectiveUserId = demoUser.id;
      } else {
        const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
          email: "adviser@canubing.deped.gov.ph",
          password: "DepEdScholar2026!",
          email_confirm: true,
          user_metadata: {
            full_name: "Mrs. Carmela Reyes (Adviser)",
            role: "teacher",
            school_name: "Canubing National High School",
          },
        });
        if (createErr || !newUser.user) {
          throw new Error(createErr?.message || "Failed to create demo adviser account");
        }
        effectiveUserId = newUser.user.id;
      }
    }

    // Upsert demo teacher profile
    await admin.from("profiles").upsert({
      id: effectiveUserId,
      email: user?.email || "adviser@canubing.deped.gov.ph",
      full_name: "Mrs. Carmela Reyes (Adviser)",
      role: "teacher",
      school_name: "Canubing National High School",
    });

    // Create or find demo section
    const { data: section } = await admin
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
        const { data: group } = await admin
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
          const { data: manuscript } = await admin
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
            const { data: report } = await admin
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
              await admin.from("alignment_issues").insert(issues);
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
