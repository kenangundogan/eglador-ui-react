import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type SeparatorOrientation = "horizontal" | "vertical";
export type SeparatorVariant = "solid" | "dashed" | "dotted";

export interface SeparatorProps {
  orientation?: SeparatorOrientation;
  variant?: SeparatorVariant;
  label?: React.ReactNode;
  className?: string;
}

// ── Variant styles ───────────────────────────

const VARIANTS: Record<SeparatorVariant, string> = {
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
};

// ── Component ────────────────────────────────

export function Separator({
  orientation = "horizontal",
  variant = "solid",
  label,
  className,
}: SeparatorProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("self-stretch w-px border-l border-zinc-200", VARIANTS[variant], className)}
      />
    );
  }

  if (label) {
    return (
      <div role="separator" className={cn("flex items-center gap-3", className)}>
        <div className={cn("flex-1 border-t border-zinc-200", VARIANTS[variant])} />
        <span className="text-xs text-zinc-400 font-medium shrink-0">{label}</span>
        <div className={cn("flex-1 border-t border-zinc-200", VARIANTS[variant])} />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn("w-full border-t border-zinc-200", VARIANTS[variant], className)}
    />
  );
}
