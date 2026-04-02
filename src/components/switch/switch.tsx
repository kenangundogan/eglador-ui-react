"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type SwitchSize = "xs" | "sm" | "md";
export type SwitchColor = "default" | "black" | "primary" | "danger" | "success" | "warning" | "info";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: SwitchSize;
  color?: SwitchColor;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  name?: string;
  value?: string;
  id?: string;
}

// ── Size definitions ─────────────────────────

const SIZES: Record<SwitchSize, {
  track: string;
  thumb: string;
  thumbTranslate: string;
  labelFont: string;
  descFont: string;
  gap: string;
}> = {
  xs: {
    track: "w-7 h-4",
    thumb: "size-3",
    thumbTranslate: "translate-x-3",
    labelFont: "text-xs",
    descFont: "text-[10px]",
    gap: "gap-1.5",
  },
  sm: {
    track: "w-9 h-5",
    thumb: "size-3.5",
    thumbTranslate: "translate-x-4",
    labelFont: "text-sm",
    descFont: "text-xs",
    gap: "gap-2",
  },
  md: {
    track: "w-11 h-6",
    thumb: "size-4.5",
    thumbTranslate: "translate-x-5",
    labelFont: "text-base",
    descFont: "text-sm",
    gap: "gap-2.5",
  },
};

// ── Color definitions ────────────────────────

interface SwitchColorDef {
  checked: string;
  hover: string;
}

const COLORS: Record<SwitchColor, SwitchColorDef> = {
  default: {
    checked: "bg-zinc-900",
    hover: "group-hover/switch:bg-zinc-300",
  },
  black: {
    checked: "bg-zinc-900",
    hover: "group-hover/switch:bg-zinc-300",
  },
  primary: {
    checked: "bg-blue-600",
    hover: "group-hover/switch:bg-blue-200",
  },
  danger: {
    checked: "bg-red-500",
    hover: "group-hover/switch:bg-red-200",
  },
  success: {
    checked: "bg-green-500",
    hover: "group-hover/switch:bg-green-200",
  },
  warning: {
    checked: "bg-yellow-500",
    hover: "group-hover/switch:bg-yellow-200",
  },
  info: {
    checked: "bg-indigo-500",
    hover: "group-hover/switch:bg-indigo-200",
  },
};

// ── Component ────────────────────────────────

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
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

    return (
      <label
        htmlFor={id}
        className={cn(
          "group/switch inline-flex items-start select-none",
          s.gap,
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          className,
        )}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          aria-label={!label ? (typeof name === "string" ? name : "Toggle") : undefined}
          className="sr-only"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          name={name}
          value={value}
        />

        <div
          className={cn(
            "shrink-0 relative rounded-full transition-colors duration-200 mt-0.5",
            s.track,
            checked
              ? c.checked
              : cn("bg-zinc-200", !disabled && c.hover),
          )}
        >
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 left-0.5 rounded-full bg-white transition-transform duration-200",
              s.thumb,
              checked && s.thumbTranslate,
            )}
          />
        </div>

        {(label || description) && (
          <div className="flex flex-col min-w-0">
            {label && (
              <span className={cn("font-medium text-zinc-700", s.labelFont)}>
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

Switch.displayName = "Switch";
