"use client";

import { useState, useRef, useCallback } from "react";

export function useAudioRecorder(onTranscriptionComplete?: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startRecording = useCallback(() => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setIsFallbackMode(true);
      setIsRecording(true);
      const simulatedText =
        "For our sampling strategy, we utilized purposive sampling of 40 hydroponic lettuce plants across two separate test troughs. While this sample size was restricted by greenhouse facility space, we rigorously controlled for ambient water temperature and executed daily electrical conductivity sensor buffer calibrations.";
      setTranscript(simulatedText);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-PH";

      recognition.onresult = (event: any) => {
        let accumulated = "";
        for (let i = 0; i < event.results.length; i++) {
          accumulated += event.results[i][0].transcript;
        }
        setTranscript(accumulated);
      };

      recognition.onerror = () => {
        setIsFallbackMode(true);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      setIsFallbackMode(false);
    } catch {
      setIsFallbackMode(true);
      setIsRecording(true);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    if (onTranscriptionComplete) {
      onTranscriptionComplete(transcript);
    }
  }, [transcript, onTranscriptionComplete]);

  return {
    isRecording,
    transcript,
    setTranscript,
    isFallbackMode,
    startRecording,
    stopRecording,
    resetTranscript: () => setTranscript(""),
  };
}
