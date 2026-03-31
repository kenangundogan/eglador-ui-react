import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";
export type SkeletonAnimation = "pulse" | "wave" | "none";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: string | number;
  height?: string | number;
  lines?: number;
  lineGap?: string;
  className?: string;
}

// ── Variant styles ───────────────────────────

const VARIANTS: Record<SkeletonVariant, string> = {
  text: "rounded",
  circular: "rounded-full",
  rectangular: "",
  rounded: "rounded-lg",
};

// ── Animation styles ─────────────────────────

const ANIMATIONS: Record<SkeletonAnimation, string> = {
  pulse: "animate-pulse",
  wave: "animate-[skeleton-wave_1.5s_ease-in-out_infinite] bg-[length:200%_100%] bg-[linear-gradient(90deg,theme(colors.zinc.200)_25%,theme(colors.zinc.100)_50%,theme(colors.zinc.200)_75%)]",
  none: "",
};

// ── Component ────────────────────────────────

export function Skeleton({
  variant = "text",
  animation = "pulse",
  width,
  height,
  lines,
  lineGap = "0.75rem",
  className,
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  // Default dimensions per variant
  if (!height) {
    switch (variant) {
      case "text":
        style.height = "1em";
        break;
      case "circular":
        style.height = style.width || "2.5rem";
        style.width = style.height;
        break;
      case "rectangular":
      case "rounded":
        style.height = "8rem";
        break;
    }
  }

  if (!width && variant !== "circular") {
    style.width = "100%";
  }

  const baseClass = cn(
    "bg-zinc-200",
    VARIANTS[variant],
    animation !== "wave" && ANIMATIONS[animation],
    animation === "wave" && ANIMATIONS.wave,
    className,
  );

  // Multi-line text skeleton
  if (lines && lines > 1) {
    return (
      <div className="flex flex-col" style={{ gap: lineGap }}>
        {Array.from({ length: lines }, (_, i) => {
          const isLast = i === lines - 1;
          return (
            <div
              key={i}
              className={baseClass}
              style={{
                ...style,
                width: isLast ? "60%" : style.width,
              }}
            />
          );
        })}
      </div>
    );
  }

  return <div className={baseClass} style={style} />;
}
