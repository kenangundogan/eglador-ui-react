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
  setTriggerNode: (node: HTMLElement | null) => void;
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

  const autoId = React.useId();
  const triggerId = `popover-trigger-${autoId}`;
  const contentId = `popover-content-${autoId}`;

  const setOpen = React.useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const toggle = React.useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);
  const close = React.useCallback(() => setOpen(false), [setOpen]);

  useClickOutside(containerRef, close, isOpen && closeOnOutside);
  useEscapeClose(close, isOpen && closeOnEscape);

  const setTriggerNode = React.useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
  }, []);

  return (
    <PopoverContext.Provider value={{ isOpen, toggle, close, side, align, triggerId, contentId, triggerRef, setTriggerNode }}>
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

const SIDE_STYLES: Record<PopoverSide, string> = {
  bottom: "top-full mt-2",
  top: "bottom-full mb-2",
  right: "left-full ml-2",
  left: "right-full mr-2",
};

const ALIGN_HORIZONTAL: Record<PopoverAlign, string> = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

const ALIGN_VERTICAL: Record<PopoverAlign, string> = {
  start: "top-0",
  center: "top-1/2 -translate-y-1/2",
  end: "bottom-0",
};

function PopoverContent({ className, children }: PopoverContentProps) {
  const { isOpen, side, align, triggerId, contentId } = usePopover();

  if (!isOpen) return null;

  const isHorizontalSide = side === "top" || side === "bottom";
  const alignStyles = isHorizontalSide ? ALIGN_HORIZONTAL : ALIGN_VERTICAL;

  return (
    <div
      id={contentId}
      aria-labelledby={triggerId}
      className={cn(
        "absolute z-50",
        SIDE_STYLES[side],
        alignStyles[align],
        "bg-white border border-zinc-200 rounded-xl shadow-lg p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
PopoverContent.displayName = "PopoverContent";

// ── Export ────────────────────────────────────

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
});
