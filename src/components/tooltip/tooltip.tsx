"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
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

// ── Arrow styles ─────────────────────────────

const ARROW_STYLES: Record<TooltipPosition, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-zinc-800 border-x-transparent border-b-transparent border-4",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-zinc-800 border-x-transparent border-t-transparent border-4",
  left: "left-full top-1/2 -translate-y-1/2 border-l-zinc-800 border-y-transparent border-r-transparent border-4",
  right: "right-full top-1/2 -translate-y-1/2 border-r-zinc-800 border-y-transparent border-l-transparent border-4",
};

// ── Position calculator ──────────────────────

const GAP = 8;

function computeTooltipPosition(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  position: TooltipPosition,
): { top: number; left: number } {
  let top = 0;
  let left = 0;

  switch (position) {
    case "top":
      top = triggerRect.top - tooltipRect.height - GAP;
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      break;
    case "bottom":
      top = triggerRect.bottom + GAP;
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      break;
    case "left":
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.left - tooltipRect.width - GAP;
      break;
    case "right":
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.right + GAP;
      break;
  }

  // Viewport clamp
  const { innerWidth, innerHeight } = window;
  if (left + tooltipRect.width > innerWidth - 8) left = innerWidth - tooltipRect.width - 8;
  if (top + tooltipRect.height > innerHeight - 8) top = innerHeight - tooltipRect.height - 8;
  if (left < 8) left = 8;
  if (top < 8) top = 8;

  return { top, left };
}

// ── Component ────────────────────────────────

export function Tooltip({
  content,
  position = "top",
  delay = 300,
  children,
  className,
}: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const show = React.useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = React.useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  React.useEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return;

    requestAnimationFrame(() => {
      if (!triggerRef.current || !tooltipRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      setPos(computeTooltipPosition(triggerRect, tooltipRect, position));
    });
  }, [visible, position]);

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </div>
      {visible && ReactDOM.createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          className={cn(
            "fixed z-9999 pointer-events-none",
            "px-2 py-1 rounded-md bg-zinc-800 text-white text-xs font-medium whitespace-nowrap",
            className,
          )}
          style={{ top: pos.top, left: pos.left }}
        >
          {content}
          <span className={cn("absolute w-0 h-0", ARROW_STYLES[position])} />
        </div>,
        document.body,
      )}
    </>
  );
}

Tooltip.displayName = "Tooltip";
