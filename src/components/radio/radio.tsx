"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type RadioSize = "xs" | "sm" | "md";
export type RadioColor = "default" | "black" | "primary" | "danger" | "success" | "warning" | "info";
export type RadioVariant = "default" | "card" | "list";

export interface RadioProps {
  variant?: RadioVariant;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: RadioSize;
  color?: RadioColor;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  name?: string;
  value?: string;
  id?: string;
}

// ── Size definitions ─────────────────────────

const SIZES: Record<RadioSize, {
  box: string;
  dotSize: string;
  labelFont: string;
  descFont: string;
  gap: string;
  cardPadding: string;
}> = {
  xs: {
    box: "size-3.5",
    dotSize: "size-1.5",
    labelFont: "text-xs",
    descFont: "text-[10px]",
    gap: "gap-1.5",
    cardPadding: "p-2",
  },
  sm: {
    box: "size-4",
    dotSize: "size-2",
    labelFont: "text-sm",
    descFont: "text-xs",
    gap: "gap-2",
    cardPadding: "p-2.5",
  },
  md: {
    box: "size-5",
    dotSize: "size-2.5",
    labelFont: "text-base",
    descFont: "text-sm",
    gap: "gap-2.5",
    cardPadding: "p-3",
  },
};

// ── Color definitions ────────────────────────

interface RadioColorDef {
  checked: string;
  hover: string;
}

const COLORS: Record<RadioColor, RadioColorDef> = {
  default: {
    checked: "border-zinc-900 bg-zinc-900",
    hover: "group-hover/radio:border-zinc-400",
  },
  black: {
    checked: "border-zinc-900 bg-zinc-900",
    hover: "group-hover/radio:border-zinc-400",
  },
  primary: {
    checked: "border-blue-600 bg-blue-600",
    hover: "group-hover/radio:border-blue-300",
  },
  danger: {
    checked: "border-red-500 bg-red-500",
    hover: "group-hover/radio:border-red-300",
  },
  success: {
    checked: "border-green-500 bg-green-500",
    hover: "group-hover/radio:border-green-300",
  },
  warning: {
    checked: "border-yellow-500 bg-yellow-500",
    hover: "group-hover/radio:border-yellow-300",
  },
  info: {
    checked: "border-indigo-500 bg-indigo-500",
    hover: "group-hover/radio:border-indigo-300",
  },
};

// ── Card variant colors ──────────────────────

interface CardColorDef {
  checked: string;
  unchecked: string;
}

const CARD_COLORS: Record<RadioColor, CardColorDef> = {
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

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      variant = "default",
      checked = false,
      onChange,
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
            checked ? cc.checked : cc.unchecked,
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
          "group/radio inline-flex items-start select-none",
          s.gap,
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          variantClasses,
          className,
        )}
      >
        <input
          ref={ref}
          id={id}
          type="radio"
          className="sr-only"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          name={name}
          value={value}
        />

        <div
          className={cn(
            "shrink-0 flex items-center justify-center rounded-full transition-all duration-150 mt-0.5",
            s.box,
            checked
              ? cn(c.checked, "text-white")
              : cn("border border-zinc-300 bg-white", !disabled && c.hover),
          )}
        >
          {checked && (
            <div className={cn("rounded-full bg-white", s.dotSize)} />
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

Radio.displayName = "Radio";
