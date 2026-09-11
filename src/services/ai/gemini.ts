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

// Primary Workhorse: High-speed, ultra-low token consumption (500 RPD, 15 RPM)
export const FAST_MODEL = process.env.FAST_MODEL || "gemini-3.1-flash-lite";

// Primary Deep Analysis: Generous 500 RPD free-tier quota with deep structural audit capability
export const DEEP_ANALYSIS_MODEL = process.env.DEEP_ANALYSIS_MODEL || "gemini-3.5-flash-lite";

// 3.x Free-Tier Fallback Cascades: Protects against single-model rate limits (429) & transient 503s
export const FAST_MODEL_CANDIDATES = [
  FAST_MODEL,
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
].filter((v, i, a) => a.indexOf(v) === i);

export const DEEP_MODEL_CANDIDATES = [
  DEEP_ANALYSIS_MODEL,
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
].filter((v, i, a) => a.indexOf(v) === i);

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

  const candidates = options.preferDeep ? DEEP_MODEL_CANDIDATES : FAST_MODEL_CANDIDATES;
  let lastError: unknown = null;

  for (let i = 0; i < candidates.length; i++) {
    const currentModel = candidates[i];
    try {
      return await ai.models.generateContent({
        model: currentModel,
        contents: options.contents as Parameters<typeof ai.models.generateContent>[0]["contents"],
        config: options.config,
      });
    } catch (error: unknown) {
      lastError = error;
      const err = error as { status?: number; message?: string };
      const status = err?.status;
      const message = err?.message || "";

      const isQuotaOrAvailabilityError =
        status === 429 ||
        status === 503 ||
        status === 404 ||
        status === 500 ||
        message.includes("429") ||
        message.includes("RESOURCE_EXHAUSTED") ||
        message.includes("503") ||
        message.includes("overloaded") ||
        message.includes("not found");

      if (isQuotaOrAvailabilityError && i < candidates.length - 1) {
        console.warn(
          `[Gemini Router] Model ${currentModel} returned ${status || "error"}. Cascading to failover candidate: ${candidates[i + 1]}...`
        );
        continue;
      }

      // If it's a permanent error (e.g. invalid 400 bad request) or last candidate, stop cascade
      throw error;
    }
  }

  throw lastError;
}
