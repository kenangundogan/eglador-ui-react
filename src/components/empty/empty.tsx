import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type EmptySize = "sm" | "md" | "lg";

export interface EmptyProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  size?: EmptySize;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

// ── Default Icon ─────────────────────────────

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

// ── Size definitions ─────────────────────────

const SIZES: Record<EmptySize, {
  containerSize: string;
  iconSize: string;
  titleFont: string;
  descFont: string;
  maxWidth: string;
  padding: string;
}> = {
  sm: {
    containerSize: "size-12",
    iconSize: "size-6",
    titleFont: "text-sm",
    descFont: "text-xs",
    maxWidth: "max-w-xs",
    padding: "py-8 px-4",
  },
  md: {
    containerSize: "size-16",
    iconSize: "size-7",
    titleFont: "text-base",
    descFont: "text-sm",
    maxWidth: "max-w-sm",
    padding: "py-12 px-6",
  },
  lg: {
    containerSize: "size-20",
    iconSize: "size-9",
    titleFont: "text-lg",
    descFont: "text-base",
    maxWidth: "max-w-md",
    padding: "py-16 px-8",
  },
};

// ── Component ────────────────────────────────

export function Empty({
  icon,
  title,
  description,
  size = "md",
  action,
  className,
  children,
}: EmptyProps) {
  const s = SIZES[size];

  return (
    <div className={cn("flex flex-col items-center justify-center text-center gap-4", s.padding, className)}>
      <div className={cn("flex items-center justify-center rounded-full bg-zinc-100", s.containerSize)}>
        <span className={cn("text-zinc-400 [&>svg]:w-full [&>svg]:h-full", s.iconSize)}>
          {icon || <InboxIcon className="w-full h-full" />}
        </span>
      </div>

      {(title || description) && (
        <div className="flex flex-col gap-1.5">
          {title && (
            <h3 className={cn("font-semibold text-zinc-900", s.titleFont)}>
              {title}
            </h3>
          )}
          {description && (
            <p className={cn("text-zinc-400 leading-relaxed", s.descFont, s.maxWidth)}>
              {description}
            </p>
          )}
        </div>
      )}

      {action && (
        <div className="mt-1">
          {action}
        </div>
      )}

      {children}
    </div>
  );
}
