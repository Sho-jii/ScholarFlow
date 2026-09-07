interface AudioWaveformProps {
  isRecording: boolean;
}

export function AudioWaveform({ isRecording }: AudioWaveformProps) {
  const bars = [12, 28, 45, 20, 36, 52, 18, 40, 24, 48, 14, 32];

  return (
    <div className="flex items-center justify-center gap-1.5 h-12 px-4 py-2">
      {bars.map((height, idx) => (
        <span
          key={idx}
          className={`w-1 rounded-full transition-all duration-150 ${
            isRecording ? "bg-accent animate-pulse" : "bg-muted-foreground/30 h-2"
          }`}
          style={{
            height: isRecording ? `${Math.max(8, (height * (idx % 2 === 0 ? 1 : 0.7)))}px` : "6px",
            animationDelay: `${idx * 80}ms`,
          }}
        />
      ))}
    </div>
  );
}
