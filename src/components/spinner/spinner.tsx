import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type SpinnerSize = "xs" | "sm" | "md" | "lg";
export type SpinnerColor = "default" | "primary" | "danger" | "success" | "warning" | "info" | "white";

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  label?: string;
  className?: string;
}

// ── Size definitions ─────────────────────────

const SIZES: Record<SpinnerSize, { spinner: string; labelFont: string; gap: string }> = {
  xs: { spinner: "size-4", labelFont: "text-xs", gap: "gap-1.5" },
  sm: { spinner: "size-5", labelFont: "text-sm", gap: "gap-2" },
  md: { spinner: "size-8", labelFont: "text-sm", gap: "gap-2.5" },
  lg: { spinner: "size-12", labelFont: "text-base", gap: "gap-3" },
};

// ── Color definitions ────────────────────────

const COLORS: Record<SpinnerColor, { track: string; arc: string; label: string }> = {
  default: { track: "text-zinc-200", arc: "text-zinc-600", label: "text-zinc-500" },
  primary: { track: "text-blue-100", arc: "text-blue-600", label: "text-blue-600" },
  danger: { track: "text-red-100", arc: "text-red-500", label: "text-red-500" },
  success: { track: "text-green-100", arc: "text-green-500", label: "text-green-500" },
  warning: { track: "text-yellow-100", arc: "text-yellow-500", label: "text-yellow-500" },
  info: { track: "text-indigo-100", arc: "text-indigo-500", label: "text-indigo-500" },
  white: { track: "text-white/20", arc: "text-white", label: "text-white" },
};

// ── Component ────────────────────────────────

export function Spinner({
  size = "sm",
  color = "default",
  label,
  className,
}: SpinnerProps) {
  const s = SIZES[size];
  const c = COLORS[color];

  return (
    <div
      role="status"
      className={cn("inline-flex flex-col items-center", s.gap, className)}
    >
      <svg className={cn("animate-spin", s.spinner)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className={c.track} />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className={c.arc}
        />
      </svg>
      {label && (
        <span className={cn("font-medium", s.labelFont, c.label)}>{label}</span>
      )}
    </div>
  );
}
