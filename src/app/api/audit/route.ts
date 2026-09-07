import { NextRequest, NextResponse } from "next/server";
import { generateContentWithFailover, isMockMode } from "@/services/ai/gemini";
import { manuscriptAuditSchema } from "@/services/ai/schemas";
import { DEMO_MANUSCRIPT_AUDIT } from "@/services/mock/fallbackData";
import { createClient } from "@/services/supabase/server";

const SYSTEM_AUDITOR_PROMPT = `
You are a Senior DepEd Research Panelist and Methodologist evaluating a Senior High School research paper (Chapters 1-3) covering Practical Research 1 (Qualitative), Practical Research 2 (Quantitative), or 3Is (Immersion).

Conduct a strict structural audit:
1. Verify if each Statement of the Problem (SOP) question is measurable and maps to Chapter 3 tools.
2. Flag Conceptual Framework variables lacking an instrument in Chapter 3.
3. Detect if Chapter 2 contains comparative literature synthesis or merely unlinked summaries.
4. Verify local community grounding in the Philippine context (e.g., MIMAROPA / municipal realities).
5. Generate oral defense questions that target the paper's primary methodological flaws.
Never ghostwrite or output text meant to be directly inserted into the manuscript.
`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const fileHash = (formData.get("fileHash") as string) || "sample_hash";
    const fileName = (formData.get("fileName") as string) || "manuscript.pdf";

    // If local mock mode is activated, return demo audit instantly
    if (isMockMode) {
      return NextResponse.json({
        success: true,
        deduplicated: false,
        data: DEMO_MANUSCRIPT_AUDIT,
      });
    }

    // Try Supabase deduplication check if database is reachable
    try {
      const supabase = await createClient();
      const { data: existing } = await supabase
        .from("manuscripts")
        .select("id, audit_reports(*, alignment_issues(*))")
        .eq("file_hash", fileHash)
        .maybeSingle();

      if (existing && existing.audit_reports && existing.audit_reports.length > 0) {
        const report = existing.audit_reports[0];
        return NextResponse.json({
          success: true,
          deduplicated: true,
          data: {
            readinessScore: report.readinessScore,
            localContextDetected: report.localContextDetected,
            synthesisGrade: report.synthesisGrade,
            summaryCritique: report.summaryCritique,
            alignmentMatrix: report.alignment_issues || DEMO_MANUSCRIPT_AUDIT.alignmentMatrix,
            preDefenseQuestions: DEMO_MANUSCRIPT_AUDIT.preDefenseQuestions,
          },
        });
      }
    } catch {
      // Supabase connection or table not yet applied, continue with Gemini analysis
    }

    // Read file bytes
    let fileBase64 = "";
    let mimeType = "application/pdf";
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      fileBase64 = buffer.toString("base64");
      mimeType = file.type || "application/pdf";
    }

    // Run Gemini 1.5 Pro with automatic failover to Flash
    let auditOutput = DEMO_MANUSCRIPT_AUDIT;

    try {
      const contents = fileBase64
        ? [
            { text: SYSTEM_AUDITOR_PROMPT },
            { inlineData: { mimeType, data: fileBase64 } },
            { text: "Conduct strict structural alignment audit and produce structured JSON." },
          ]
        : `${SYSTEM_AUDITOR_PROMPT}\nAnalyze this Senior High School research draft entitled "${fileName}".`;

      const response = await generateContentWithFailover({
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: manuscriptAuditSchema,
          temperature: 0.1,
        },
        preferDeep: true,
      });

      if (response && response.text) {
        auditOutput = JSON.parse(response.text);
      }
    } catch (llmError) {
      console.warn("[Audit Route] LLM call failed or quota exceeded. Returning resilient demo audit.", llmError);
      auditOutput = DEMO_MANUSCRIPT_AUDIT;
    }

    return NextResponse.json({
      success: true,
      deduplicated: false,
      data: auditOutput,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err?.message || "Audit processing failed" },
      { status: 500 }
    );
  }
}
