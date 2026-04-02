import * as React from "react";
import { cn } from "../../lib/utils";
import { XIcon } from "../../lib/icons";

// ── Types ────────────────────────────────────

export type BadgeVariant = "solid" | "soft" | "outline";
export type BadgeColor = "default" | "black" | "primary" | "danger" | "success" | "warning" | "info";
export type BadgeSize = "xs" | "sm" | "md";
export type BadgeShape = "square" | "rounded" | "pill";

export interface BadgeProps {
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  shape?: BadgeShape;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  children: React.ReactNode;
}

// ── Size definitions ─────────────────────────

const SIZES: Record<BadgeSize, { padding: string; font: string; iconSize: string; gap: string }> = {
  xs: { padding: "px-1.5 py-0.5", font: "text-[10px]", iconSize: "size-2.5", gap: "gap-0.5" },
  sm: { padding: "px-2 py-0.5", font: "text-xs", iconSize: "size-3", gap: "gap-1" },
  md: { padding: "px-2.5 py-1", font: "text-sm", iconSize: "size-3.5", gap: "gap-1" },
};

// ── Shape definitions ────────────────────────

const SHAPES: Record<BadgeShape, string> = {
  square: "rounded",
  rounded: "rounded-md",
  pill: "rounded-full",
};

// ── Color definitions ────────────────────────

interface BadgeColorDef {
  solid: string;
  soft: string;
  outline: string;
  removeHover: string;
}

const COLORS: Record<BadgeColor, BadgeColorDef> = {
  default: {
    solid: "bg-zinc-100 text-zinc-700 border border-zinc-200",
    soft: "bg-zinc-50 text-zinc-600 border border-zinc-100",
    outline: "bg-transparent text-zinc-600 border border-zinc-300",
    removeHover: "hover:text-zinc-900 hover:bg-zinc-200",
  },
  black: {
    solid: "bg-zinc-900 text-white border border-zinc-900",
    soft: "bg-zinc-100 text-zinc-800 border border-zinc-200",
    outline: "bg-transparent text-zinc-800 border border-zinc-300",
    removeHover: "hover:text-zinc-900 hover:bg-zinc-200",
  },
  primary: {
    solid: "bg-blue-500 text-white border border-blue-500",
    soft: "bg-blue-50 text-blue-700 border border-blue-100",
    outline: "bg-transparent text-blue-600 border border-blue-300",
    removeHover: "hover:text-blue-900 hover:bg-blue-100",
  },
  danger: {
    solid: "bg-red-500 text-white border border-red-500",
    soft: "bg-red-50 text-red-700 border border-red-100",
    outline: "bg-transparent text-red-600 border border-red-300",
    removeHover: "hover:text-red-900 hover:bg-red-100",
  },
  success: {
    solid: "bg-green-500 text-white border border-green-500",
    soft: "bg-green-50 text-green-700 border border-green-100",
    outline: "bg-transparent text-green-600 border border-green-300",
    removeHover: "hover:text-green-900 hover:bg-green-100",
  },
  warning: {
    solid: "bg-yellow-500 text-white border border-yellow-500",
    soft: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    outline: "bg-transparent text-yellow-600 border border-yellow-300",
    removeHover: "hover:text-yellow-900 hover:bg-yellow-100",
  },
  info: {
    solid: "bg-indigo-500 text-white border border-indigo-500",
    soft: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    outline: "bg-transparent text-indigo-600 border border-indigo-300",
    removeHover: "hover:text-indigo-900 hover:bg-indigo-100",
  },
};

// ── Component ────────────────────────────────

export function Badge({
  variant = "soft",
  color = "default",
  size = "sm",
  shape = "rounded",
  icon,
  iconRight,
  removable = false,
  onRemove,
  className,
  children,
}: BadgeProps) {
  const s = SIZES[size];
  const c = COLORS[color];

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium whitespace-nowrap",
        s.padding,
        s.font,
        s.gap,
        SHAPES[shape],
        c[variant],
        className,
      )}
    >
      {icon && (
        <span className={cn("shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full", s.iconSize)}>
          {icon}
        </span>
      )}

      {children}

      {iconRight && !removable && (
        <span className={cn("shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full", s.iconSize)}>
          {iconRight}
        </span>
      )}

      {removable && (
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          className={cn(
            "shrink-0 flex items-center justify-center rounded-full transition-colors cursor-pointer -mr-0.5",
            s.iconSize,
            c.removeHover,
          )}
        >
          <XIcon className="size-full" strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
}

Badge.displayName = "Badge";
