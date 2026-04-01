"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { useClickOutside } from "../../lib/use-click-outside";
import { useEscapeClose } from "../../lib/use-escape-close";
import { Tooltip } from "../tooltip";

// ── Types ────────────────────────────────────

export type SpeedDialDirection = "up" | "down" | "left" | "right";
export type SpeedDialSize = "sm" | "md" | "lg";

export interface SpeedDialAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface SpeedDialProps {
  actions: SpeedDialAction[];
  icon?: React.ReactNode;
  openIcon?: React.ReactNode;
  direction?: SpeedDialDirection;
  size?: SpeedDialSize;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
}

// ── Icons ────────────────────────────────────

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

// ── Size definitions ─────────────────────────

const SIZES: Record<SpeedDialSize, {
  trigger: string;
  triggerIcon: string;
  action: string;
  actionIcon: string;
  gap: string;
}> = {
  sm: { trigger: "size-10", triggerIcon: "size-4", action: "size-8", actionIcon: "size-3.5", gap: "gap-2" },
  md: { trigger: "size-12", triggerIcon: "size-5", action: "size-10", actionIcon: "size-4", gap: "gap-2.5" },
  lg: { trigger: "size-14", triggerIcon: "size-6", action: "size-12", actionIcon: "size-5", gap: "gap-3" },
};

// ── Direction styles ─────────────────────────

const DIRECTION_STYLES: Record<SpeedDialDirection, string> = {
  up: "flex-col-reverse",
  down: "flex-col",
  left: "flex-row-reverse",
  right: "flex-row",
};

const TOOLTIP_FOR_DIRECTION: Record<SpeedDialDirection, "left" | "right" | "top" | "bottom"> = {
  up: "left",
  down: "left",
  left: "top",
  right: "top",
};

// ── Component ────────────────────────────────

export function SpeedDial({
  actions,
  icon,
  openIcon,
  direction = "up",
  size = "md",
  tooltipPosition,
  open: controlledOpen,
  onOpenChange,
  disabled = false,
  className,
}: SpeedDialProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const s = SIZES[size];

  const setOpen = React.useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const toggle = React.useCallback(() => {
    if (disabled) return;
    setOpen(!isOpen);
  }, [isOpen, setOpen, disabled]);

  const close = React.useCallback(() => setOpen(false), [setOpen]);

  useClickOutside(containerRef, close, isOpen);
  useEscapeClose(close, isOpen);

  const resolvedTooltipPosition = tooltipPosition || TOOLTIP_FOR_DIRECTION[direction];

  const handleActionClick = (action: SpeedDialAction) => {
    if (action.disabled) return;
    action.onClick?.();
    close();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "inline-flex items-center",
        DIRECTION_STYLES[direction],
        s.gap,
        className,
      )}
    >
      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-zinc-900 text-white transition-all cursor-pointer",
          s.trigger,
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "hover:bg-zinc-800",
        )}
      >
        <span className={cn("transition-transform duration-200", isOpen && "rotate-45")}>
          {isOpen && openIcon ? (
            <span className={cn("[&>svg]:w-full [&>svg]:h-full", s.triggerIcon)}>{openIcon}</span>
          ) : icon ? (
            <span className={cn("[&>svg]:w-full [&>svg]:h-full", s.triggerIcon)}>{icon}</span>
          ) : isOpen ? (
            <XIcon className={s.triggerIcon} />
          ) : (
            <PlusIcon className={s.triggerIcon} />
          )}
        </span>
      </button>

      {/* Actions */}
      {isOpen && (
        <div className={cn("flex items-center", DIRECTION_STYLES[direction], s.gap)}>
          {actions.map((action) => (
            <Tooltip key={action.id} content={action.label} position={resolvedTooltipPosition} delay={0}>
              <button
                type="button"
                disabled={action.disabled}
                onClick={() => handleActionClick(action)}
                className={cn(
                  "inline-flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-700 transition-colors cursor-pointer",
                  s.action,
                  action.disabled && "opacity-40 cursor-not-allowed",
                  !action.disabled && "hover:bg-zinc-100 hover:text-zinc-900",
                )}
              >
                <span className={cn("[&>svg]:w-full [&>svg]:h-full", s.actionIcon)}>
                  {action.icon}
                </span>
              </button>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}

SpeedDial.displayName = "SpeedDial";
