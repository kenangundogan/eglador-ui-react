"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";
export type ScrollbarVisibility = "auto" | "always" | "hover";

export interface ScrollAreaProps {
  orientation?: ScrollAreaOrientation;
  scrollbarVisibility?: ScrollbarVisibility;
  maxHeight?: string | number;
  maxWidth?: string | number;
  className?: string;
  viewportClassName?: string;
  children: React.ReactNode;
}

// ── Scrollbar styles ─────────────────────────

const SCROLLBAR_BASE = [
  "[&::-webkit-scrollbar]:w-1.5",
  "[&::-webkit-scrollbar]:h-1.5",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:bg-zinc-300",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb]:hover:bg-zinc-400",
  "[&::-webkit-scrollbar-corner]:bg-transparent",
].join(" ");

const VISIBILITY_STYLES: Record<ScrollbarVisibility, string> = {
  auto: SCROLLBAR_BASE,
  always: SCROLLBAR_BASE,
  hover: cn(
    "[&::-webkit-scrollbar-thumb]:bg-transparent",
    "[&:hover::-webkit-scrollbar-thumb]:bg-zinc-300",
    "[&:hover::-webkit-scrollbar-thumb]:hover:bg-zinc-400",
    "[&::-webkit-scrollbar]:w-1.5",
    "[&::-webkit-scrollbar]:h-1.5",
    "[&::-webkit-scrollbar-track]:bg-transparent",
    "[&::-webkit-scrollbar-corner]:bg-transparent",
  ),
};

const OVERFLOW_STYLES: Record<ScrollAreaOrientation, string> = {
  vertical: "overflow-y-auto overflow-x-hidden",
  horizontal: "overflow-x-auto overflow-y-hidden",
  both: "overflow-auto",
};

// ── Component ────────────────────────────────

export function ScrollArea({
  orientation = "vertical",
  scrollbarVisibility = "auto",
  maxHeight,
  maxWidth,
  className,
  viewportClassName,
  children,
}: ScrollAreaProps) {
  const style: React.CSSProperties = {};
  if (maxHeight) style.maxHeight = typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  if (maxWidth) style.maxWidth = typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;

  return (
    <div className={cn("relative", className)}>
      <div
        tabIndex={0}
        className={cn(
          OVERFLOW_STYLES[orientation],
          VISIBILITY_STYLES[scrollbarVisibility],
          viewportClassName,
        )}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}

ScrollArea.displayName = "ScrollArea";
