"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type HoverCardSide = "top" | "bottom" | "left" | "right";
export type HoverCardAlign = "start" | "center" | "end";

export interface HoverCardProps {
  side?: HoverCardSide;
  align?: HoverCardAlign;
  openDelay?: number;
  closeDelay?: number;
  className?: string;
  children: React.ReactNode;
}

export interface HoverCardTriggerProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface HoverCardContentProps {
  className?: string;
  children: React.ReactNode;
}

// ── Position calculator ──────────────────────

const GAP = 8;

function computePosition(
  triggerRect: DOMRect,
  contentRect: DOMRect,
  side: HoverCardSide,
  align: HoverCardAlign,
): { top: number; left: number } {
  let top = 0;
  let left = 0;

  switch (side) {
    case "bottom":
      top = triggerRect.bottom + GAP;
      break;
    case "top":
      top = triggerRect.top - contentRect.height - GAP;
      break;
    case "right":
      left = triggerRect.right + GAP;
      break;
    case "left":
      left = triggerRect.left - contentRect.width - GAP;
      break;
  }

  if (side === "bottom" || side === "top") {
    if (align === "start") left = triggerRect.left;
    else if (align === "center") left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
    else if (align === "end") left = triggerRect.right - contentRect.width;
  } else {
    if (align === "start") top = triggerRect.top;
    else if (align === "center") top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
    else if (align === "end") top = triggerRect.bottom - contentRect.height;
  }

  const { innerWidth, innerHeight } = window;
  if (left + contentRect.width > innerWidth - 8) left = innerWidth - contentRect.width - 8;
  if (top + contentRect.height > innerHeight - 8) top = innerHeight - contentRect.height - 8;
  if (left < 8) left = 8;
  if (top < 8) top = 8;

  return { top, left };
}

// ── Context ──────────────────────────────────

interface HoverCardContextValue {
  isOpen: boolean;
  side: HoverCardSide;
  align: HoverCardAlign;
  triggerRef: React.RefObject<HTMLElement | null>;
  setTriggerNode: (node: HTMLElement | null) => void;
  show: () => void;
  hide: () => void;
  cancelHide: () => void;
}

const HoverCardContext = React.createContext<HoverCardContextValue | null>(null);

function useHoverCard(): HoverCardContextValue {
  const ctx = React.useContext(HoverCardContext);
  if (!ctx) throw new Error("HoverCard sub-components must be used within <HoverCard>");
  return ctx;
}

// ── HoverCard Root ───────────────────────────

function HoverCardRoot({
  side = "bottom",
  align = "center",
  openDelay = 300,
  closeDelay = 200,
  className,
  children,
}: HoverCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const openTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelTimers = React.useCallback(() => {
    if (openTimerRef.current) { clearTimeout(openTimerRef.current); openTimerRef.current = null; }
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
  }, []);

  const show = React.useCallback(() => {
    cancelTimers();
    openTimerRef.current = setTimeout(() => setIsOpen(true), openDelay);
  }, [openDelay, cancelTimers]);

  const hide = React.useCallback(() => {
    cancelTimers();
    closeTimerRef.current = setTimeout(() => setIsOpen(false), closeDelay);
  }, [closeDelay, cancelTimers]);

  const cancelHide = React.useCallback(() => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
  }, []);

  const setTriggerNode = React.useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
  }, []);

  React.useEffect(() => {
    return () => cancelTimers();
  }, [cancelTimers]);

  return (
    <HoverCardContext.Provider value={{ isOpen, side, align, triggerRef, setTriggerNode, show, hide, cancelHide }}>
      <div className={cn("relative inline-flex", className)}>
        {children}
      </div>
    </HoverCardContext.Provider>
  );
}
HoverCardRoot.displayName = "HoverCard";

// ── Trigger ──────────────────────────────────

function HoverCardTrigger({ asChild = false, className, children }: HoverCardTriggerProps) {
  const { show, hide, setTriggerNode } = useHoverCard();

  const props = {
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
  };

  if (asChild && React.isValidElement(children)) {
    const ChildType = children.type as React.ElementType;
    const childProps = children.props as Record<string, unknown>;
    return (
      <ChildType
        {...childProps}
        ref={setTriggerNode}
        {...props}
        className={cn(childProps.className as string | undefined, className)}
      />
    );
  }

  return (
    <span ref={setTriggerNode as React.Ref<HTMLSpanElement>} {...props} className={cn("inline-flex", className)}>
      {children}
    </span>
  );
}
HoverCardTrigger.displayName = "HoverCard.Trigger";

// ── Content ──────────────────────────────────

function HoverCardContent({ className, children }: HoverCardContentProps) {
  const { isOpen, side, align, triggerRef, show, hide, cancelHide } = useHoverCard();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      setPos(null);
      return;
    }

    const updatePosition = () => {
      if (!triggerRef.current || !contentRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      setPos(computePosition(triggerRect, contentRect, side, align));
    };

    requestAnimationFrame(updatePosition);

    window.addEventListener("scroll", updatePosition, { passive: true, capture: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, { capture: true } as EventListenerOptions);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, side, align, triggerRef]);

  if (!isOpen || typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      ref={contentRef}
      onMouseEnter={cancelHide}
      onMouseLeave={hide}
      className={cn(
        "fixed z-9999 bg-white border border-zinc-200 rounded-lg p-4",
        className,
      )}
      style={{ top: pos?.top ?? 0, left: pos?.left ?? 0, visibility: pos ? "visible" : "hidden" }}
    >
      {children}
    </div>,
    document.body,
  );
}
HoverCardContent.displayName = "HoverCard.Content";

// ── Export ────────────────────────────────────

export const HoverCard = Object.assign(HoverCardRoot, {
  Trigger: HoverCardTrigger,
  Content: HoverCardContent,
});
