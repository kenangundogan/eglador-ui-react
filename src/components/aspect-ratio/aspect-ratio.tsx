import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type AspectRatioPreset = "1:1" | "16:9" | "4:3" | "21:9" | "3:2" | "2:3" | "9:16";

export interface AspectRatioProps {
  ratio?: AspectRatioPreset | number;
  className?: string;
  children: React.ReactNode;
}

// ── Preset ratios ────────────────────────────

const PRESETS: Record<AspectRatioPreset, string> = {
  "1:1": "aspect-square",
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "21:9": "aspect-[21/9]",
  "3:2": "aspect-[3/2]",
  "2:3": "aspect-[2/3]",
  "9:16": "aspect-[9/16]",
};

// ── Component ────────────────────────────────

export function AspectRatio({
  ratio = "16:9",
  className,
  children,
}: AspectRatioProps) {
  const isPreset = typeof ratio === "string" && ratio in PRESETS;

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isPreset && PRESETS[ratio as AspectRatioPreset],
        className,
      )}
      style={!isPreset && typeof ratio === "number" ? { aspectRatio: ratio } : undefined}
    >
      {children}
    </div>
  );
}
