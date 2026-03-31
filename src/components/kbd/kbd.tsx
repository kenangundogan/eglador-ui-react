import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type KbdSize = "xs" | "sm" | "md";
export type KbdVariant = "default" | "outline" | "ghost";

export interface KbdProps {
  size?: KbdSize;
  variant?: KbdVariant;
  keys?: string[];
  separator?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

// ── Size definitions ─────────────────────────

const SIZES: Record<KbdSize, { padding: string; font: string; minWidth: string; gap: string }> = {
  xs: { padding: "px-1 py-px", font: "text-[10px]", minWidth: "min-w-4", gap: "gap-0.5" },
  sm: { padding: "px-1.5 py-0.5", font: "text-xs", minWidth: "min-w-5", gap: "gap-1" },
  md: { padding: "px-2 py-1", font: "text-sm", minWidth: "min-w-6", gap: "gap-1.5" },
};

// ── Variant styles ───────────────────────────

const VARIANTS: Record<KbdVariant, string> = {
  default: "bg-zinc-100 border border-zinc-300",
  outline: "bg-transparent border border-zinc-300",
  ghost: "bg-zinc-50 border border-transparent",
};

// ── Key ──────────────────────────────────────

function Key({ children, size, variant, className }: { children: React.ReactNode; size: KbdSize; variant: KbdVariant; className?: string }) {
  const s = SIZES[size];

  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded font-mono font-medium text-zinc-700 leading-none",
        s.padding,
        s.font,
        s.minWidth,
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </kbd>
  );
}

// ── Component ────────────────────────────────

export function Kbd({
  size = "sm",
  variant = "default",
  keys,
  separator,
  className,
  children,
}: KbdProps) {
  const s = SIZES[size];

  // Single key mode
  if (!keys || keys.length === 0) {
    return (
      <Key size={size} variant={variant} className={className}>
        {children}
      </Key>
    );
  }

  // Combo key mode
  const sep = separator || (
    <span className={cn("text-zinc-400 font-mono font-medium", s.font)}>+</span>
  );

  return (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      {keys.map((key, i) => (
        <React.Fragment key={i}>
          <Key size={size} variant={variant}>{key}</Key>
          {i < keys.length - 1 && sep}
        </React.Fragment>
      ))}
    </span>
  );
}
