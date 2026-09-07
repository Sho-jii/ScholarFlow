import { GoogleGenAI } from "@google/genai";
import { DEMO_MANUSCRIPT_AUDIT } from "@/services/mock/fallbackData";

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not defined in environment variables. Falling back to mock data.");
}

const gatewayBaseUrl = process.env.CLOUDFLARE_AI_GATEWAY_URL;

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy_key",
  ...(gatewayBaseUrl ? { baseUrl: gatewayBaseUrl } : {}),
});

// Primary Workhorse: 15 RPM / 1,500 RPD
export const FAST_MODEL = process.env.FAST_MODEL || "gemini-1.5-flash";

// Reserved Deep Model: 2 RPM / 50 RPD
export const DEEP_ANALYSIS_MODEL = process.env.DEEP_ANALYSIS_MODEL || "gemini-1.5-pro";

export const isMockMode = process.env.MOCK_AI_RESPONSES === "true";

export interface GenerateOptions {
  contents: unknown;
  config?: Record<string, unknown>;
  preferDeep?: boolean;
}

export async function generateContentWithFailover(options: GenerateOptions) {
  if (isMockMode) {
    return {
      text: JSON.stringify(DEMO_MANUSCRIPT_AUDIT),
    };
  }

  const modelToUse = options.preferDeep ? DEEP_ANALYSIS_MODEL : FAST_MODEL;

  try {
    return await ai.models.generateContent({
      model: modelToUse,
      contents: options.contents as Parameters<typeof ai.models.generateContent>[0]["contents"],
      config: options.config,
    });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    // If DEEP_ANALYSIS_MODEL hits a 429 rate limit error, failover to FAST_MODEL
    if (options.preferDeep && (err?.status === 429 || err?.message?.includes("429"))) {
      console.warn(`[Gemini Router] ${DEEP_ANALYSIS_MODEL} quota reached. Failing over to ${FAST_MODEL}...`);
      return await ai.models.generateContent({
        model: FAST_MODEL,
        contents: options.contents as Parameters<typeof ai.models.generateContent>[0]["contents"],
        config: options.config,
      });
    }
    throw error;
  }
}
