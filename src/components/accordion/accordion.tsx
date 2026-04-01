"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronDownIcon } from "../../lib/icons";

// ── Types ────────────────────────────────────

export type AccordionVariant = "default" | "bordered" | "filled";
export type AccordionSize = "xs" | "sm" | "md";

export interface AccordionProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  extra?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: AccordionVariant;
  size?: AccordionSize;
  disabled?: boolean;
  hideChevron?: boolean;
  children: React.ReactNode;
  className?: string;
}

// ── Size definitions ─────────────────────────

const SIZES: Record<AccordionSize, {
  trigger: string;
  triggerCompact: string;
  gap: string;
  font: string;
  chevronSize: string;
  contentPadding: string;
}> = {
  xs: { trigger: "px-2 py-1.5", triggerCompact: "px-1 py-0.5", gap: "gap-1", font: "text-xs", chevronSize: "size-4", contentPadding: "px-2 pb-2" },
  sm: { trigger: "px-3 py-2", triggerCompact: "px-1 py-0.5", gap: "gap-1.5", font: "text-sm", chevronSize: "size-5", contentPadding: "px-3 pb-3" },
  md: { trigger: "px-4 py-3", triggerCompact: "px-1 py-0.5", gap: "gap-2", font: "text-base", chevronSize: "size-6", contentPadding: "px-4 pb-4" },
};

// ── Component ────────────────────────────────

export function Accordion({
  title,
  icon,
  extra,
  defaultOpen = true,
  open,
  onOpenChange,
  variant = "default",
  size = "sm",
  disabled = false,
  hideChevron = false,
  children,
  className,
}: AccordionProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const id = React.useId();
  const s = SIZES[size];

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const toggle = () => {
    if (disabled) return;
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const isBoxed = variant === "bordered" || variant === "filled";

  return (
    <div
      className={cn(
        "flex flex-col",
        variant === "bordered" && "border border-zinc-200 rounded-lg",
        variant === "filled" && "bg-zinc-50 rounded-lg",
        disabled && "opacity-50",
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={id}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "flex items-center w-full text-left group transition-colors",
          s.gap,
          !disabled && "cursor-pointer",
          isBoxed ? s.trigger : s.triggerCompact,
          !disabled && isBoxed && "hover:bg-zinc-100/50 rounded-lg",
        )}
      >
        {icon && (
          <span className="shrink-0 text-zinc-400">
            {icon}
          </span>
        )}
        <span className={cn(
          "flex-1 font-bold text-zinc-400 uppercase tracking-wider",
          s.font,
        )}>
          {title}
        </span>
        {extra && <span className="shrink-0">{extra}</span>}
        {!hideChevron && (
          <ChevronDownIcon
            className={cn(
              "shrink-0 text-zinc-400 transition-transform duration-200",
              s.chevronSize,
              isOpen ? "rotate-0" : "-rotate-90",
            )}
          />
        )}
      </button>

      <div
        id={id}
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 mt-0",
        )}
      >
        <div className={cn(
          isOpen ? "overflow-visible" : "overflow-hidden",
          isBoxed && s.contentPadding,
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}

Accordion.displayName = "Accordion";
