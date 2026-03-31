"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { useClickOutside } from "../../lib/use-click-outside";
import { useEscapeClose } from "../../lib/use-escape-close";

// ── Types ────────────────────────────────────

export type PopoverSide = "top" | "bottom" | "left" | "right";
export type PopoverAlign = "start" | "center" | "end";

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: PopoverSide;
  align?: PopoverAlign;
  closeOnOutside?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface PopoverTriggerProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface PopoverContentProps {
  className?: string;
  children: React.ReactNode;
}

// ── Context ──────────────────────────────────

interface PopoverContextValue {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  side: PopoverSide;
  align: PopoverAlign;
  triggerId: string;
  contentId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
  setTriggerNode: (node: HTMLElement | null) => void;
  setContentNode: (node: HTMLElement | null) => void;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopover(): PopoverContextValue {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) throw new Error("Popover sub-components must be used within <Popover>");
  return ctx;
}

// ── Popover Root ─────────────────────────────

function PopoverRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  side = "bottom",
  align = "start",
  closeOnOutside = true,
  closeOnEscape = true,
  className,
  children,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentRef = React.useRef<HTMLElement | null>(null);

  const autoId = React.useId();
  const triggerId = `popover-trigger-${autoId}`;
  const contentId = `popover-content-${autoId}`;

  const setOpen = React.useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const toggle = React.useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);
  const close = React.useCallback(() => setOpen(false), [setOpen]);

  // Custom click-outside that checks both container and portal content
  React.useEffect(() => {
    if (!isOpen || !closeOnOutside) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const inContainer = containerRef.current?.contains(target);
      const inContent = contentRef.current?.contains(target);
      if (!inContainer && !inContent) close();
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen, closeOnOutside, close]);

  useEscapeClose(close, isOpen && closeOnEscape);

  const setTriggerNode = React.useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
  }, []);

  const setContentNode = React.useCallback((node: HTMLElement | null) => {
    contentRef.current = node;
  }, []);

  return (
    <PopoverContext.Provider value={{ isOpen, toggle, close, side, align, triggerId, contentId, triggerRef, contentRef, setTriggerNode, setContentNode }}>
      <div ref={containerRef} className={cn("relative inline-flex", className)}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
}
PopoverRoot.displayName = "Popover";

// ── Trigger ──────────────────────────────────

function PopoverTrigger({ asChild = false, className, children }: PopoverTriggerProps) {
  const { isOpen, toggle, triggerId, contentId, setTriggerNode } = usePopover();

  const handleClick = React.useCallback((e: React.MouseEvent) => {
    if (asChild && React.isValidElement(children)) {
      const originalOnClick = (children.props as Record<string, unknown>).onClick as ((e: React.MouseEvent) => void) | undefined;
      originalOnClick?.(e);
    }
    toggle();
  }, [asChild, children, toggle]);

  const triggerProps = {
    id: triggerId,
    "aria-expanded": isOpen,
    "aria-haspopup": true as const,
    "aria-controls": isOpen ? contentId : undefined,
    onClick: handleClick,
  };

  if (asChild && React.isValidElement(children)) {
    const ChildType = children.type as React.ElementType;
    const childProps = children.props as Record<string, unknown>;
    return (
      <ChildType
        {...childProps}
        ref={setTriggerNode}
        {...triggerProps}
        className={cn(childProps.className as string | undefined, className)}
      />
    );
  }

  return (
    <button type="button" ref={setTriggerNode as React.Ref<HTMLButtonElement>} {...triggerProps} className={cn("cursor-pointer", className)}>
      {children}
    </button>
  );
}
PopoverTrigger.displayName = "PopoverTrigger";

// ── Content ──────────────────────────────────

const GAP = 8;

function computePosition(
  triggerRect: DOMRect,
  contentRect: DOMRect,
  side: PopoverSide,
  align: PopoverAlign,
): { top: number; left: number } {
  let top = 0;
  let left = 0;

  // Side
  if (side === "bottom") {
    top = triggerRect.bottom + GAP;
  } else if (side === "top") {
    top = triggerRect.top - contentRect.height - GAP;
  } else if (side === "right") {
    left = triggerRect.right + GAP;
  } else if (side === "left") {
    left = triggerRect.left - contentRect.width - GAP;
  }

  // Align
  if (side === "bottom" || side === "top") {
    if (align === "start") left = triggerRect.left;
    else if (align === "center") left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
    else if (align === "end") left = triggerRect.right - contentRect.width;
  } else {
    if (align === "start") top = triggerRect.top;
    else if (align === "center") top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
    else if (align === "end") top = triggerRect.bottom - contentRect.height;
  }

  // Viewport clamp
  const { innerWidth, innerHeight } = window;
  if (left + contentRect.width > innerWidth - 8) left = innerWidth - contentRect.width - 8;
  if (top + contentRect.height > innerHeight - 8) top = innerHeight - contentRect.height - 8;
  if (left < 8) left = 8;
  if (top < 8) top = 8;

  return { top, left };
}

function PopoverContent({ className, children }: PopoverContentProps) {
  const { isOpen, side, align, triggerId, contentId, triggerRef, setContentNode } = usePopover();
  const localRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });

  const mergedRef = React.useCallback((node: HTMLDivElement | null) => {
    (localRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    setContentNode(node);
  }, [setContentNode]);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !localRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = localRef.current.getBoundingClientRect();
    setPos(computePosition(triggerRect, contentRect, side, align));
  }, [triggerRef, side, align]);

  React.useEffect(() => {
    if (!isOpen) return;

    requestAnimationFrame(updatePosition);

    window.addEventListener("scroll", updatePosition, { passive: true, capture: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, { capture: true } as EventListenerOptions);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      ref={mergedRef}
      id={contentId}
      aria-labelledby={triggerId}
      className={cn(
        "fixed z-9999 bg-white border border-zinc-200 rounded-lg p-4",
        className,
      )}
      style={{ top: pos.top, left: pos.left }}
    >
      {children}
    </div>,
    document.body,
  );
}
PopoverContent.displayName = "PopoverContent";

// ── Export ────────────────────────────────────

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
});
