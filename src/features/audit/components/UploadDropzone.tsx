"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { InsetCard } from "@/components/ui/inset-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { AuditReportData } from "../types";

interface UploadDropzoneProps {
  onAuditComplete: (report: AuditReportData) => void;
}

export function UploadDropzone({ onAuditComplete }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stageMessage, setStageMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    try {
      setIsProcessing(true);
      setStageMessage("Calculating SHA-256 cryptographic draft fingerprint...");

      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const fileHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      setStageMessage("Extracting structural boundaries (Chapters 1–3)...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileHash", fileHash);
      formData.append("fileName", file.name);

      setStageMessage("Running Gemini 3.5 structural alignment audit...");

      const res = await fetch("/api/audit", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to process manuscript");

      toast.success(
        json.deduplicated
          ? "SHA-256 match found! Retrieved cached audit report instantly."
          : "Manuscript audit completed successfully!"
      );

      onAuditComplete(json.data);
    } catch (err: any) {
      toast.error(err.message || "Audit failed");
    } finally {
      setIsProcessing(false);
      setStageMessage("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processFile(file);
    }
  };

  return (
    <InsetCard className="p-6 md:p-8">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-[28px] border-2 border-dashed p-6 sm:p-8 md:p-12 text-center transition-all ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-white/30 bg-black/[0.02] dark:bg-white/[0.02]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleFileChange}
        />

        {isProcessing ? (
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="size-10 text-primary animate-spin" />
            <h4 className="font-display font-bold text-base text-foreground">
              Auditing Research Manuscript
            </h4>
            <p className="text-xs text-muted-foreground animate-pulse">
              {stageMessage}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 max-w-md">
            <div className="grid size-14 place-items-center rounded-3xl bg-[#0d1217] text-white dark:bg-white dark:text-[#0d1217] shadow-sm">
              <UploadCloud className="size-6" />
            </div>

            <div className="space-y-1">
              <h4 className="font-display text-base font-bold text-foreground">
                Upload Senior High Research Draft (Chapters 1–3)
              </h4>
              <p className="text-xs text-muted-foreground">
                Drag and drop your PDF or DOCX file here, or browse from your computer.
                SHA-256 fingerprinting prevents redundant LLM token spend.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 rounded-full"
              >
                <FileText className="size-4" />
                <span>Select File</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </InsetCard>
  );
}
