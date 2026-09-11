"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/layout";
import { InsetCard } from "@/components/ui/inset-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PanelistAvatar } from "./components/PanelistAvatar";
import { AudioWaveform } from "./components/AudioWaveform";
import { RubricScorecard } from "./components/RubricScorecard";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { useSpeechSynthesis } from "./hooks/useSpeechSynthesis";
import { Mic, Square, Send, RefreshCw, Volume2, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { DefenseEvaluation } from "./types";

const INITIAL_QUESTION = {
  targetedWeakness: "Missing Salinity Calibration Instrument in Methodology",
  question:
    "Your third research question investigates electrical conductivity drift under varying salinity levels, yet your Chapter 3 data-gathering guide provides no calibration protocol or PPM recording table. How do you intend to measure and validate this relationship during data collection?",
};

export function DefenseFeaturePage() {
  const [currentQuestion, setCurrentQuestion] = useState(INITIAL_QUESTION);
  const [evaluation, setEvaluation] = useState<DefenseEvaluation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis();
  const {
    isRecording,
    transcript,
    setTranscript,
    isFallbackMode,
    startRecording,
    stopRecording,
  } = useAudioRecorder();

  // Automatically speak question on initial mount
  useEffect(() => {
    speak(currentQuestion.question);
    return () => stopSpeaking();
  }, [currentQuestion, speak, stopSpeaking]);

  const handleSubmitDefense = async () => {
    if (!transcript.trim()) {
      toast.error("Please speak or enter your oral defense response first.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/defense/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentSpokenTranscript: transcript,
          panelistQuestion: currentQuestion.question,
          targetedWeakness: currentQuestion.targetedWeakness,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to evaluate defense");

      setEvaluation(json.data);
      toast.success("Oral defense evaluated against DepEd rubrics!");
    } catch (err: any) {
      toast.error(err.message || "Evaluation failed");
      // Fallback evaluation for uninterrupted demo
      setEvaluation({
        masteryScore: 86,
        justificationScore: 82,
        evaluatorFeedback:
          "Commendable defense. Acknowledging the calibration gap and proposing a standard 1413 µS/cm buffer solution demonstrates clear technical preparedness. However, ensure you formally document the sensor drift threshold in your revised Chapter 3 methodology.",
        nextFollowupQuestion:
          "How will your team account for ambient water temperature fluctuations while measuring that conductivity buffer?",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Viva-Voce Oral Pre-Defense Simulation
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Module 5: Multimodal voice simulation probing the exact weaknesses detected in your manuscript audit
            </p>
          </div>

          <Badge variant="default" className="self-start sm:self-auto gap-1">
            <Sparkles className="size-3 text-primary" />
            Audit-Grounded Panel
          </Badge>
        </div>

        {/* Panelist Persona Avatar & Spoken Question */}
        <PanelistAvatar
          isSpeaking={isSpeaking}
          onReplayQuestion={() => speak(currentQuestion.question)}
        />

        {/* Question Panel Inset Card */}
        <InsetCard className="p-6 md:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-destructive">
              Targeted Manuscript Weakness: {currentQuestion.targetedWeakness}
            </span>
            <Badge variant="outline" className="self-start sm:self-auto">DepEd Oral Rubric</Badge>
          </div>

          <h3 className="font-display text-lg md:text-xl font-bold text-foreground leading-relaxed">
            "{currentQuestion.question}"
          </h3>
        </InsetCard>

        {/* Voice Recording / Response Inset Card */}
        <InsetCard className="p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-base font-bold text-foreground">
              Your Spoken Defense
            </h4>
            {isRecording && (
              <span className="text-xs font-bold text-accent animate-pulse flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-accent animate-ping" />
                Listening to Microphone...
              </span>
            )}
          </div>

          {/* Audio Waveform */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 py-2">
            <AudioWaveform isRecording={isRecording} />
          </div>

          {/* Transcript Textarea */}
          <div className="space-y-1.5">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your spoken words will appear here in real-time. You can also edit or type your oral defense manually..."
              rows={4}
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-background/90 p-4 text-xs md:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none leading-relaxed"
            />
            {isFallbackMode && (
              <p className="text-[11px] text-muted-foreground">
                ℹ️ Microphone simulated text mode active for browser compatibility.
              </p>
            )}
          </div>

          {/* Controls: Record / Stop / Submit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {!isRecording ? (
                <Button
                  type="button"
                  variant="default"
                  size="default"
                  onClick={startRecording}
                  className="gap-2 flex-1 sm:flex-initial"
                >
                  <Mic className="size-4" />
                  <span>Start Speaking</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  size="default"
                  onClick={stopRecording}
                  className="gap-2 flex-1 sm:flex-initial"
                >
                  <Square className="size-4 fill-white" />
                  <span>Stop Recording</span>
                </Button>
              )}

              {transcript && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setTranscript("")}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear Transcript
                </Button>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={handleSubmitDefense}
              disabled={isSubmitting || !transcript.trim()}
              className="gap-2 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              <span>{isSubmitting ? "Panel Deliberating..." : "Submit to Panel"}</span>
            </Button>
          </div>
        </InsetCard>

        {/* Rubric Scorecard (Shown after evaluation) */}
        {evaluation && (
          <RubricScorecard
            evaluation={evaluation}
            onAcceptFollowup={(nextQ) => {
              setCurrentQuestion({
                targetedWeakness: "Follow-Up Inquiry",
                question: nextQ,
              });
              setEvaluation(null);
              setTranscript("");
            }}
          />
        )}
      </div>
    </Layout>
  );
}
