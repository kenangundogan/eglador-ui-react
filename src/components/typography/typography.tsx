import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type TypographyVariant = "h1" | "h2" | "h3" | "h4" | "p" | "lead" | "large" | "small" | "muted" | "blockquote" | "code" | "kbd";
export type TypographyColor = "default" | "muted" | "primary" | "danger" | "success" | "warning" | "info";
export type TypographyAlign = "left" | "center" | "right";
export type TypographyWeight = "normal" | "medium" | "semibold" | "bold";

export interface TypographyProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  align?: TypographyAlign;
  weight?: TypographyWeight;
  truncate?: boolean;
  lines?: number;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

// ── Variant styles & default tags ────────────

interface VariantDef {
  tag: React.ElementType;
  style: string;
}

const VARIANTS: Record<TypographyVariant, VariantDef> = {
  h1: { tag: "h1", style: "text-4xl font-bold tracking-tight" },
  h2: { tag: "h2", style: "text-3xl font-bold tracking-tight" },
  h3: { tag: "h3", style: "text-2xl font-semibold tracking-tight" },
  h4: { tag: "h4", style: "text-xl font-semibold tracking-tight" },
  p: { tag: "p", style: "text-base leading-relaxed" },
  lead: { tag: "p", style: "text-xl leading-relaxed" },
  large: { tag: "p", style: "text-lg font-medium" },
  small: { tag: "p", style: "text-sm" },
  muted: { tag: "p", style: "text-sm text-zinc-400" },
  blockquote: { tag: "blockquote", style: "border-l-4 border-zinc-300 pl-4 italic" },
  code: { tag: "code", style: "bg-zinc-100 px-1.5 py-0.5 rounded text-sm font-mono" },
  kbd: { tag: "kbd", style: "bg-zinc-100 border border-zinc-300 px-1.5 py-0.5 rounded text-xs font-mono" },
};

// ── Color styles ─────────────────────────────

const COLORS: Record<TypographyColor, string> = {
  default: "text-zinc-900",
  muted: "text-zinc-400",
  primary: "text-blue-600",
  danger: "text-red-600",
  success: "text-green-600",
  warning: "text-yellow-600",
  info: "text-indigo-600",
};

// ── Align styles ─────────────────────────────

const ALIGNS: Record<TypographyAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// ── Weight styles ────────────────────────────

const WEIGHTS: Record<TypographyWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

// ── Component ────────────────────────────────

export function Typography({
  variant = "p",
  color,
  align,
  weight,
  truncate = false,
  lines,
  as,
  className,
  children,
}: TypographyProps) {
  const v = VARIANTS[variant];
  const Tag = as || v.tag;

  // Don't override color for muted variant unless explicitly set
  const colorClass = color
    ? COLORS[color]
    : variant === "muted" ? "" : COLORS.default;

  return (
    <Tag
      className={cn(
        v.style,
        colorClass,
        align && ALIGNS[align],
        weight && WEIGHTS[weight],
        truncate && !lines && "truncate",
        lines && `line-clamp-${lines}`,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
