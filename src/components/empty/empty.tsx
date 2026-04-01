import * as React from "react";
import { cn } from "../../lib/utils";
import { InboxIcon } from "../../lib/icons";

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

Empty.displayName = "Empty";
