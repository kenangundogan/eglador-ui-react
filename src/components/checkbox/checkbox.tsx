"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type CheckboxSize = "xs" | "sm" | "md";
export type CheckboxColor = "default" | "black" | "primary" | "danger" | "success" | "warning" | "info";
export type CheckboxVariant = "default" | "card" | "list";

export interface CheckboxProps {
  variant?: CheckboxVariant;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  size?: CheckboxSize;
  color?: CheckboxColor;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  name?: string;
  value?: string;
  id?: string;
}

// ── Icons ────────────────────────────────────

function CheckIcon({ className, strokeWidth }: { className?: string; strokeWidth?: number }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function MinusIcon({ className, strokeWidth }: { className?: string; strokeWidth?: number }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
    </svg>
  );
}

// ── Size definitions ─────────────────────────

const SIZES: Record<CheckboxSize, {
  box: string;
  iconSize: string;
  iconStroke: number;
  labelFont: string;
  descFont: string;
  gap: string;
  cardPadding: string;
}> = {
  xs: {
    box: "size-3.5",
    iconSize: "size-2.5",
    iconStroke: 3,
    labelFont: "text-xs",
    descFont: "text-[10px]",
    gap: "gap-1.5",
    cardPadding: "p-2",
  },
  sm: {
    box: "size-4",
    iconSize: "size-3",
    iconStroke: 3,
    labelFont: "text-sm",
    descFont: "text-xs",
    gap: "gap-2",
    cardPadding: "p-2.5",
  },
  md: {
    box: "size-5",
    iconSize: "size-3.5",
    iconStroke: 2.5,
    labelFont: "text-base",
    descFont: "text-sm",
    gap: "gap-2.5",
    cardPadding: "p-3",
  },
};

// ── Color definitions ────────────────────────

interface CheckboxColorDef {
  checked: string;
  hover: string;
}

const COLORS: Record<CheckboxColor, CheckboxColorDef> = {
  default: {
    checked: "bg-zinc-900 border-zinc-900",
    hover: "group-hover/cb:border-zinc-400",
  },
  black: {
    checked: "bg-zinc-900 border-zinc-900",
    hover: "group-hover/cb:border-zinc-400",
  },
  primary: {
    checked: "bg-blue-600 border-blue-600",
    hover: "group-hover/cb:border-blue-300",
  },
  danger: {
    checked: "bg-red-500 border-red-500",
    hover: "group-hover/cb:border-red-300",
  },
  success: {
    checked: "bg-green-500 border-green-500",
    hover: "group-hover/cb:border-green-300",
  },
  warning: {
    checked: "bg-yellow-500 border-yellow-500",
    hover: "group-hover/cb:border-yellow-300",
  },
  info: {
    checked: "bg-indigo-500 border-indigo-500",
    hover: "group-hover/cb:border-indigo-300",
  },
};

// ── Card variant colors ──────────────────────

interface CardColorDef {
  checked: string;
  unchecked: string;
}

const CARD_COLORS: Record<CheckboxColor, CardColorDef> = {
  default: {
    checked: "bg-zinc-50 border-zinc-300 text-zinc-800",
    unchecked: "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300",
  },
  black: {
    checked: "bg-zinc-100 border-zinc-300 text-zinc-900",
    unchecked: "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300",
  },
  primary: {
    checked: "bg-blue-50/50 border-blue-200 text-blue-700",
    unchecked: "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300",
  },
  danger: {
    checked: "bg-red-50/50 border-red-200 text-red-700",
    unchecked: "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300",
  },
  success: {
    checked: "bg-green-50/50 border-green-200 text-green-700",
    unchecked: "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300",
  },
  warning: {
    checked: "bg-yellow-50/50 border-yellow-200 text-yellow-700",
    unchecked: "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300",
  },
  info: {
    checked: "bg-indigo-50/50 border-indigo-200 text-indigo-700",
    unchecked: "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300",
  },
};

// ── Component ────────────────────────────────

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      variant = "default",
      checked = false,
      onChange,
      indeterminate = false,
      size = "sm",
      color = "default",
      label,
      description,
      disabled = false,
      className,
      name,
      value,
      id: idProp,
    },
    ref,
  ) => {
    const autoId = React.useId();
    const id = idProp || autoId;

    const s = SIZES[size];
    const c = COLORS[color];
    const isActive = checked || indeterminate;

    const handleChange = () => {
      if (disabled) return;
      onChange?.(!checked);
    };

    const variantClasses = (() => {
      switch (variant) {
        case "card": {
          const cc = CARD_COLORS[color];
          return cn(
            "rounded-xl border font-medium transition-colors",
            s.cardPadding,
            isActive ? cc.checked : cc.unchecked,
          );
        }
        case "list":
          return "p-2 rounded-lg hover:bg-zinc-50 transition-colors";
        default:
          return "";
      }
    })();

    return (
      <label
        htmlFor={id}
        className={cn(
          "group/cb inline-flex items-start select-none",
          s.gap,
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          variantClasses,
          className,
        )}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          name={name}
          value={value}
        />

        <div
          className={cn(
            "shrink-0 flex items-center justify-center rounded transition-all duration-150 mt-0.5",
            s.box,
            isActive
              ? cn(c.checked, "text-white")
              : cn("border border-zinc-300 bg-white", !disabled && c.hover),
          )}
        >
          {checked && !indeterminate && (
            <CheckIcon className={s.iconSize} strokeWidth={s.iconStroke} />
          )}
          {indeterminate && (
            <MinusIcon className={s.iconSize} strokeWidth={s.iconStroke} />
          )}
        </div>

        {(label || description) && (
          <div className="flex flex-col min-w-0">
            {label && (
              <span className={cn("font-medium", s.labelFont, variant === "default" && "text-zinc-700")}>
                {label}
              </span>
            )}
            {description && (
              <span className={cn("text-zinc-400 mt-0.5", s.descFont)}>
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
