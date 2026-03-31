"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type AlertVariant = "soft" | "outline" | "filled";
export type AlertColor = "default" | "primary" | "danger" | "success" | "warning" | "info";
export type AlertSize = "sm" | "md";

export interface AlertProps {
  variant?: AlertVariant;
  color?: AlertColor;
  size?: AlertSize;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  children?: React.ReactNode;
}

// ── Icons ────────────────────────────────────

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

// ── Size definitions ─────────────────────────

const SIZES: Record<AlertSize, { padding: string; font: string; titleFont: string; iconSize: string; gap: string }> = {
  sm: { padding: "px-3 py-2.5", font: "text-xs", titleFont: "text-sm", iconSize: "size-4", gap: "gap-2.5" },
  md: { padding: "px-4 py-3.5", font: "text-sm", titleFont: "text-base", iconSize: "size-5", gap: "gap-3" },
};

// ── Color definitions ────────────────────────

interface AlertColorDef {
  soft: string;
  outline: string;
  filled: string;
  icon: string;
  filledIcon: string;
  dismissHover: string;
  filledDismissHover: string;
}

const COLORS: Record<AlertColor, AlertColorDef> = {
  default: {
    soft: "bg-zinc-50 text-zinc-700 border border-zinc-200",
    outline: "bg-transparent text-zinc-700 border border-zinc-300",
    filled: "bg-zinc-900 text-zinc-100 border border-zinc-900",
    icon: "text-zinc-500",
    filledIcon: "text-zinc-300",
    dismissHover: "hover:bg-zinc-200 hover:text-zinc-900",
    filledDismissHover: "hover:bg-zinc-700 hover:text-white",
  },
  primary: {
    soft: "bg-blue-50 text-blue-800 border border-blue-100",
    outline: "bg-transparent text-blue-700 border border-blue-300",
    filled: "bg-blue-600 text-white border border-blue-600",
    icon: "text-blue-500",
    filledIcon: "text-blue-200",
    dismissHover: "hover:bg-blue-100 hover:text-blue-900",
    filledDismissHover: "hover:bg-blue-500 hover:text-white",
  },
  danger: {
    soft: "bg-red-50 text-red-800 border border-red-100",
    outline: "bg-transparent text-red-700 border border-red-300",
    filled: "bg-red-600 text-white border border-red-600",
    icon: "text-red-500",
    filledIcon: "text-red-200",
    dismissHover: "hover:bg-red-100 hover:text-red-900",
    filledDismissHover: "hover:bg-red-500 hover:text-white",
  },
  success: {
    soft: "bg-green-50 text-green-800 border border-green-100",
    outline: "bg-transparent text-green-700 border border-green-300",
    filled: "bg-green-600 text-white border border-green-600",
    icon: "text-green-500",
    filledIcon: "text-green-200",
    dismissHover: "hover:bg-green-100 hover:text-green-900",
    filledDismissHover: "hover:bg-green-500 hover:text-white",
  },
  warning: {
    soft: "bg-yellow-50 text-yellow-800 border border-yellow-100",
    outline: "bg-transparent text-yellow-700 border border-yellow-300",
    filled: "bg-yellow-500 text-white border border-yellow-500",
    icon: "text-yellow-500",
    filledIcon: "text-yellow-200",
    dismissHover: "hover:bg-yellow-100 hover:text-yellow-900",
    filledDismissHover: "hover:bg-yellow-400 hover:text-white",
  },
  info: {
    soft: "bg-indigo-50 text-indigo-800 border border-indigo-100",
    outline: "bg-transparent text-indigo-700 border border-indigo-300",
    filled: "bg-indigo-600 text-white border border-indigo-600",
    icon: "text-indigo-500",
    filledIcon: "text-indigo-200",
    dismissHover: "hover:bg-indigo-100 hover:text-indigo-900",
    filledDismissHover: "hover:bg-indigo-500 hover:text-white",
  },
};

// ── Component ────────────────────────────────

export function Alert({
  variant = "soft",
  color = "default",
  size = "md",
  icon,
  title,
  dismissible = false,
  onDismiss,
  className,
  children,
}: AlertProps) {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  const s = SIZES[size];
  const c = COLORS[color];
  const isFilled = variant === "filled";

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={cn(
        "relative flex rounded-lg",
        s.padding,
        s.gap,
        c[variant],
        className,
      )}
    >
      {icon && (
        <span className={cn("shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full mt-0.5", s.iconSize, isFilled ? c.filledIcon : c.icon)}>
          {icon}
        </span>
      )}

      <div className="flex-1 min-w-0">
        {title && (
          <div className={cn("font-semibold leading-snug", s.titleFont)}>
            {title}
          </div>
        )}
        {children && (
          <div className={cn("leading-relaxed", s.font, title && "mt-1")}>
            {children}
          </div>
        )}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className={cn(
            "shrink-0 flex items-center justify-center size-5 rounded transition-colors cursor-pointer",
            isFilled ? c.filledDismissHover : c.dismissHover,
          )}
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}

Alert.displayName = "Alert";
