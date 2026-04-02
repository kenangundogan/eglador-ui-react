import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type ProgressSize = "xs" | "sm" | "md";
export type ProgressColor = "default" | "primary" | "danger" | "success" | "warning" | "info";
export type ProgressVariant = "default" | "striped";
export type ProgressShape = "square" | "rounded" | "pill";

export interface ProgressProps {
  value?: number;
  max?: number;
  size?: ProgressSize;
  color?: ProgressColor;
  variant?: ProgressVariant;
  shape?: ProgressShape;
  showValue?: boolean;
  label?: React.ReactNode;
  animated?: boolean;
  className?: string;
}

// ── Size definitions ─────────────────────────

const SIZES: Record<ProgressSize, { track: string; font: string }> = {
  xs: { track: "h-1", font: "text-[10px]" },
  sm: { track: "h-2", font: "text-xs" },
  md: { track: "h-3", font: "text-sm" },
};

// ── Shape definitions ────────────────────────

const SHAPES: Record<ProgressShape, string> = {
  square: "",
  rounded: "rounded",
  pill: "rounded-full",
};

// ── Color definitions ────────────────────────

const BAR_COLORS: Record<ProgressColor, string> = {
  default: "bg-zinc-900",
  primary: "bg-blue-500",
  danger: "bg-red-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  info: "bg-indigo-500",
};

const TEXT_COLORS: Record<ProgressColor, string> = {
  default: "text-zinc-700",
  primary: "text-blue-600",
  danger: "text-red-600",
  success: "text-green-600",
  warning: "text-yellow-600",
  info: "text-indigo-600",
};

// ── Component ────────────────────────────────

export function Progress({
  value = 0,
  max = 100,
  size = "sm",
  color = "primary",
  variant = "default",
  shape = "pill",
  showValue = false,
  label,
  animated = false,
  className,
}: ProgressProps) {
  const s = SIZES[size];
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className={cn("font-medium text-zinc-700", s.font)}>{label}</span>}
          {showValue && <span className={cn("font-semibold", s.font, TEXT_COLORS[color])}>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label ? String(label) : "Progress"}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn("w-full bg-zinc-100 overflow-hidden", s.track, SHAPES[shape])}
      >
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            BAR_COLORS[color],
            SHAPES[shape],
            variant === "striped" && "bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)]",
            animated && "animate-[progress-stripe_1s_linear_infinite]",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

Progress.displayName = "Progress";
