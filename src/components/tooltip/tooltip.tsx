"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  children: React.ReactElement;
  className?: string;
}

// ── Position styles ──────────────────────────

const POSITIONS: Record<TooltipPosition, {
  tooltip: string;
  arrow: string;
}> = {
  top: {
    tooltip: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    arrow: "top-full left-1/2 -translate-x-1/2 border-t-zinc-800 border-x-transparent border-b-transparent border-4",
  },
  bottom: {
    tooltip: "top-full left-1/2 -translate-x-1/2 mt-2",
    arrow: "bottom-full left-1/2 -translate-x-1/2 border-b-zinc-800 border-x-transparent border-t-transparent border-4",
  },
  left: {
    tooltip: "right-full top-1/2 -translate-y-1/2 mr-2",
    arrow: "left-full top-1/2 -translate-y-1/2 border-l-zinc-800 border-y-transparent border-r-transparent border-4",
  },
  right: {
    tooltip: "left-full top-1/2 -translate-y-1/2 ml-2",
    arrow: "right-full top-1/2 -translate-y-1/2 border-r-zinc-800 border-y-transparent border-l-transparent border-4",
  },
};

// ── Component ────────────────────────────────

export function Tooltip({
  content,
  position = "top",
  delay = 300,
  children,
  className,
}: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pos = POSITIONS[position];

  const show = React.useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = React.useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible && (
        <div
          className={cn(
            "absolute z-50 pointer-events-none",
            "px-2 py-1 rounded-md bg-zinc-800 text-white text-xs font-medium whitespace-nowrap shadow-lg",
            pos.tooltip,
            className,
          )}
        >
          {content}
          <span className={cn("absolute w-0 h-0", pos.arrow)} />
        </div>
      )}
    </div>
  );
}
