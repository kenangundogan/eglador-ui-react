"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type TabsVariant = "default" | "bordered" | "segmented";
export type TabsSize = "xs" | "sm" | "md";

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  className?: string;
  children: React.ReactNode;
}

export interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export interface TabsTriggerProps {
  value: string;
  icon?: React.ReactNode;
  activeClassName?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

// ── Context ──────────────────────────────────

interface TabsContextValue {
  activeValue: string;
  onSelect: (value: string) => void;
  variant: TabsVariant;
  size: TabsSize;
  baseId: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs(): TabsContextValue {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs sub-components must be used within <Tabs>");
  return ctx;
}

// ── Size definitions ─────────────────────────

const SIZES: Record<TabsSize, { list: string; trigger: string; font: string; iconSize: string }> = {
  xs: { list: "h-9", trigger: "px-3 gap-1", font: "text-xs", iconSize: "size-3" },
  sm: { list: "h-10", trigger: "px-4 gap-1.5", font: "text-sm", iconSize: "size-3.5" },
  md: { list: "h-12", trigger: "px-5 gap-2", font: "text-base", iconSize: "size-4" },
};

// ── Variant styles ───────────────────────────

const LIST_VARIANTS: Record<TabsVariant, string> = {
  default: "border-b border-zinc-200",
  bordered: "border border-zinc-200 rounded-lg bg-white p-1 gap-1",
  segmented: "bg-zinc-100 rounded-lg p-1 gap-px",
};

const TRIGGER_VARIANTS: Record<TabsVariant, { active: string; inactive: string }> = {
  default: {
    active: "text-zinc-900 border-b-2 border-zinc-900",
    inactive: "text-zinc-400 hover:text-zinc-600",
  },
  bordered: {
    active: "bg-zinc-50 text-zinc-900 rounded-md shadow-sm",
    inactive: "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50/50 rounded-md",
  },
  segmented: {
    active: "bg-white text-zinc-900 rounded-md shadow-sm",
    inactive: "text-zinc-500 hover:text-zinc-700 hover:bg-white/50 rounded-md",
  },
};

// ── Tabs Root ────────────────────────────────

function TabsRoot({
  value,
  defaultValue = "",
  onValueChange,
  variant = "default",
  size = "sm",
  className,
  children,
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const baseId = React.useId();

  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;

  const onSelect = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ activeValue, onSelect, variant, size, baseId }}>
      <div className={cn("flex flex-col", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ── Tabs List ────────────────────────────────

function TabsList({ className, children }: TabsListProps) {
  const { variant, size } = useTabs();
  const s = SIZES[size];

  return (
    <div
      role="tablist"
      className={cn(
        "shrink-0 flex items-center",
        s.list,
        LIST_VARIANTS[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}

// ── Tabs Trigger ─────────────────────────────

function TabsTrigger({ value, icon, activeClassName, disabled = false, className, children }: TabsTriggerProps) {
  const { activeValue, onSelect, variant, size, baseId } = useTabs();
  const isActive = activeValue === value;
  const s = SIZES[size];
  const v = TRIGGER_VARIANTS[variant];

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      id={`${baseId}-tab-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => { if (!disabled) onSelect(value); }}
      className={cn(
        "flex-1 flex items-center justify-center h-full font-semibold transition-colors cursor-pointer",
        s.trigger,
        s.font,
        isActive ? (activeClassName ?? v.active) : v.inactive,
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {icon && <span className={cn("shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full", s.iconSize)}>{icon}</span>}
      {children}
    </button>
  );
}

// ── Tabs Content ─────────────────────────────

function TabsContent({ value, className, children }: TabsContentProps) {
  const { activeValue, baseId } = useTabs();

  if (activeValue !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      className={className}
    >
      {children}
    </div>
  );
}

// ── Export ────────────────────────────────────

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
