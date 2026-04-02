"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type CollapsibleShape = "square" | "rounded";

export interface CollapsibleProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  shape?: CollapsibleShape;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface CollapsibleTriggerProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface CollapsibleContentProps {
  className?: string;
  children: React.ReactNode;
}

// ── Context ──────────────────────────────────

interface CollapsibleContextValue {
  isOpen: boolean;
  toggle: () => void;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);

function useCollapsible(): CollapsibleContextValue {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx) throw new Error("Collapsible sub-components must be used within <Collapsible>");
  return ctx;
}

// ── Shape definitions ────────────────────────

const SHAPES: Record<CollapsibleShape, string> = {
  square: "",
  rounded: "rounded-lg",
};

// ── Collapsible Root ─────────────────────────

function CollapsibleRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  shape = "rounded",
  disabled = false,
  className,
  children,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const autoId = React.useId();
  const triggerId = `collapsible-trigger-${autoId}`;
  const contentId = `collapsible-content-${autoId}`;

  const toggle = React.useCallback(() => {
    if (disabled) return;
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isOpen, isControlled, disabled, onOpenChange]);

  return (
    <CollapsibleContext.Provider value={{ isOpen, toggle, disabled, triggerId, contentId }}>
      <div className={cn(SHAPES[shape], disabled && "opacity-50", className)}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}
CollapsibleRoot.displayName = "Collapsible";

// ── Trigger ──────────────────────────────────

function CollapsibleTrigger({ asChild = false, className, children }: CollapsibleTriggerProps) {
  const { isOpen, toggle, disabled, triggerId, contentId } = useCollapsible();

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
    "aria-controls": contentId,
    "aria-disabled": disabled,
    onClick: handleClick,
  };

  if (asChild && React.isValidElement(children)) {
    const ChildType = children.type as React.ElementType;
    const childProps = children.props as Record<string, unknown>;
    return (
      <ChildType
        {...childProps}
        {...triggerProps}
        className={cn(childProps.className as string | undefined, className)}
      />
    );
  }

  return (
    <button type="button" disabled={disabled} {...triggerProps} className={cn(!disabled && "cursor-pointer", className)}>
      {children}
    </button>
  );
}
CollapsibleTrigger.displayName = "CollapsibleTrigger";

// ── Content ──────────────────────────────────

function CollapsibleContent({ className, children }: CollapsibleContentProps) {
  const { isOpen, triggerId, contentId } = useCollapsible();

  if (!isOpen) return null;

  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      className={className}
    >
      {children}
    </div>
  );
}
CollapsibleContent.displayName = "CollapsibleContent";

// ── Export ────────────────────────────────────

export const Collapsible = Object.assign(CollapsibleRoot, {
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
});
