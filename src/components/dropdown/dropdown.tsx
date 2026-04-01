"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { useClickOutside } from "../../lib/use-click-outside";
import { useEscapeClose } from "../../lib/use-escape-close";
import { useAutoFlip } from "../../lib/use-auto-flip";
import { Button } from "../button";

// ── Types ────────────────────────────────────

export type DropdownSide = "bottom" | "top" | "right" | "left";
export type DropdownAlign = "left" | "right" | "top" | "bottom" | "start" | "center" | "end";
export type DropdownWidth = number | "trigger" | "auto";

export interface DropdownProps {
  side?: DropdownSide;
  align?: DropdownAlign;
  width?: DropdownWidth;
  maxHeight?: number;
  scroll?: boolean;
  autoFlip?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: React.ReactNode;
}

export interface DropdownTriggerProps {
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}

export interface DropdownContentProps {
  className?: string;
  children: React.ReactNode;
}

// ── Ellipsis Icon ────────────────────────────

function EllipsisIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

// ── Context ──────────────────────────────────

interface DropdownContextValue {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  side: DropdownSide;
  align: DropdownAlign;
  width: DropdownWidth;
  maxHeight?: number;
  scroll: boolean;
  autoFlip: boolean;
  triggerId: string;
  contentId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  setTriggerNode: (node: HTMLElement | null) => void;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdown(): DropdownContextValue {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown sub-components must be used within <Dropdown>");
  return ctx;
}

// ── Dropdown (root) ──────────────────────────

const DropdownRoot = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ side = "bottom", align = "right", width = "auto", maxHeight, scroll = true, autoFlip = false, open, onOpenChange, className, children }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLElement | null>(null);

    const autoId = React.useId();
    const triggerId = `dropdown-trigger-${autoId}`;
    const contentId = `dropdown-content-${autoId}`;

    const setOpen = React.useCallback((next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    }, [isControlled, onOpenChange]);

    const toggle = React.useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);
    const close = React.useCallback(() => setOpen(false), [setOpen]);

    useClickOutside(containerRef, close, isOpen);
    useEscapeClose(close, isOpen);

    const childArray = React.Children.toArray(children);
    const hasTrigger = childArray.some(
      (child) => React.isValidElement(child) && child.type === DropdownTrigger,
    );

    const setTriggerNode = React.useCallback((node: HTMLElement | null) => {
      triggerRef.current = node;
    }, []);

    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    return (
      <DropdownContext.Provider value={{ isOpen, toggle, close, side, align, width, maxHeight, scroll, autoFlip, triggerId, contentId, triggerRef, setTriggerNode }}>
        <div ref={mergedRef} className={cn("relative inline-flex", className)}>
          {!hasTrigger && <DropdownTrigger />}
          {children}
        </div>
      </DropdownContext.Provider>
    );
  },
);
DropdownRoot.displayName = "Dropdown";

// ── Trigger ──────────────────────────────────

function DropdownTrigger({ className, children, asChild = false }: DropdownTriggerProps) {
  const { isOpen, toggle, triggerId, contentId, setTriggerNode } = useDropdown();

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

  if (!children) {
    return (
      <Button
        ref={setTriggerNode as React.Ref<HTMLButtonElement>}
        variant="ghost"
        size="xs"
        shape="circle"
        icon={<EllipsisIcon />}
        active={isOpen}
        aria-label="Open menu"
        className={className}
        {...triggerProps}
      />
    );
  }

  if (asChild && React.isValidElement(children)) {
    const ChildType = children.type as React.ElementType;
    const childProps = children.props as Record<string, unknown>;
    const isComponent = typeof ChildType !== "string";
    return (
      <ChildType
        {...childProps}
        ref={setTriggerNode}
        {...triggerProps}
        {...(isComponent ? { active: isOpen } : { "data-active": isOpen || undefined })}
        className={cn(childProps.className as string | undefined, className)}
      />
    );
  }

  return (
    <div ref={setTriggerNode as React.Ref<HTMLDivElement>} {...triggerProps} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  );
}
DropdownTrigger.displayName = "DropdownTrigger";

// ── Content ──────────────────────────────────

function DropdownContent({ className, children }: DropdownContentProps) {
  const { isOpen, side, align, width, maxHeight, scroll, autoFlip, triggerId, contentId, triggerRef } = useDropdown();
  const [triggerWidth, setTriggerWidth] = React.useState<number | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const currentSide = useAutoFlip(triggerRef, contentRef, side, isOpen && autoFlip);

  React.useEffect(() => {
    if (!isOpen || width !== "trigger") return;
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [isOpen, width, triggerRef]);

  if (!isOpen) return null;

  const widthStyle: React.CSSProperties = {};
  if (typeof width === "number") {
    widthStyle.width = `${width}px`;
  } else if (width === "trigger" && triggerWidth) {
    widthStyle.width = `${triggerWidth}px`;
  }

  const heightStyle: React.CSSProperties = {};
  if (maxHeight) {
    heightStyle.maxHeight = `${maxHeight}px`;
    if (scroll) {
      heightStyle.overflowY = "auto";
    } else {
      heightStyle.overflow = "hidden";
    }
  }

  return (
    <div
      ref={contentRef}
      id={contentId}
      aria-labelledby={triggerId}
      style={{ ...widthStyle, ...heightStyle }}
      className={cn(
        "absolute z-50",
        currentSide === "bottom" ? "top-full mt-2" : "",
        currentSide === "top" ? "bottom-full mb-2" : "",
        currentSide === "right" ? "left-full ml-2" : "",
        currentSide === "left" ? "right-full mr-2" : "",
        (currentSide === "bottom" || currentSide === "top") && (align === "left" || align === "start") ? "left-0" : "",
        (currentSide === "bottom" || currentSide === "top") && (align === "right" || align === "end") ? "right-0" : "",
        (currentSide === "bottom" || currentSide === "top") && align === "center" ? "left-1/2 -translate-x-1/2" : "",
        (currentSide === "left" || currentSide === "right") && (align === "top" || align === "start") ? "top-0" : "",
        (currentSide === "left" || currentSide === "right") && (align === "bottom" || align === "end") ? "bottom-0" : "",
        (currentSide === "left" || currentSide === "right") && align === "center" ? "top-1/2 -translate-y-1/2" : "",
        "bg-white border border-zinc-200 rounded-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}
DropdownContent.displayName = "DropdownContent";

// ── Export ────────────────────────────────────

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Content: DropdownContent,
});
