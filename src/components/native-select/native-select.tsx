"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronDownIcon } from "../../lib/icons";

// ── Types ────────────────────────────────────

export type NativeSelectSize = "xs" | "sm" | "md";
export type NativeSelectShape = "square" | "rounded";
export type NativeSelectVariant = "default" | "outline" | "ghost";
export type NativeSelectColor = "default" | "black" | "primary" | "danger" | "success" | "warning" | "info";
export type NativeSelectState = "idle" | "error" | "success";

export interface NativeSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface NativeSelectOptionGroup {
  label: string;
  options: NativeSelectOption[];
}

export interface NativeSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options?: (NativeSelectOption | NativeSelectOptionGroup)[];
  variant?: NativeSelectVariant;
  size?: NativeSelectSize;
  shape?: NativeSelectShape;
  color?: NativeSelectColor;
  state?: NativeSelectState;
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  successMessage?: string;
  wrapperClassName?: string;
  className?: string;
}

// ── Size definitions ─────────────────────────

const SIZES: Record<NativeSelectSize, {
  height: string;
  font: string;
  iconSize: string;
  paddingLeft: string;
  paddingRight: string;
  iconRight: string;
  labelFont: string;
}> = {
  xs: {
    height: "h-8",
    font: "text-xs",
    iconSize: "size-3.5",
    paddingLeft: "pl-2.5",
    paddingRight: "pr-7",
    iconRight: "right-2",
    labelFont: "text-xs",
  },
  sm: {
    height: "h-10",
    font: "text-sm",
    iconSize: "size-4",
    paddingLeft: "pl-3",
    paddingRight: "pr-9",
    iconRight: "right-2.5",
    labelFont: "text-sm",
  },
  md: {
    height: "h-12",
    font: "text-base",
    iconSize: "size-4",
    paddingLeft: "pl-4",
    paddingRight: "pr-10",
    iconRight: "right-3",
    labelFont: "text-sm",
  },
};

// ── Shape definitions ────────────────────────

const SHAPES: Record<NativeSelectShape, string> = {
  square: "",
  rounded: "rounded-lg",
};

// ── Color definitions ────────────────────────

interface ColorDef {
  bg: string;
  border: string;
  focusRing: string;
  iconColor: string;
}

const COLORS: Record<NativeSelectColor, ColorDef> = {
  default: {
    bg: "bg-zinc-50",
    border: "border border-zinc-200",
    focusRing: "focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/10",
    iconColor: "text-zinc-400",
  },
  black: {
    bg: "bg-zinc-50",
    border: "border border-zinc-300",
    focusRing: "focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400",
    iconColor: "text-zinc-600",
  },
  primary: {
    bg: "bg-blue-50/30",
    border: "border border-blue-200",
    focusRing: "focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400",
    iconColor: "text-blue-500",
  },
  danger: {
    bg: "bg-red-50/30",
    border: "border border-red-200",
    focusRing: "focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400",
    iconColor: "text-red-500",
  },
  success: {
    bg: "bg-green-50/30",
    border: "border border-green-200",
    focusRing: "focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-400",
    iconColor: "text-green-500",
  },
  warning: {
    bg: "bg-yellow-50/30",
    border: "border border-yellow-200",
    focusRing: "focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400",
    iconColor: "text-yellow-600",
  },
  info: {
    bg: "bg-indigo-50/30",
    border: "border border-indigo-200",
    focusRing: "focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400",
    iconColor: "text-indigo-500",
  },
};

// ── Variant styles ───────────────────────────

interface VariantDef {
  bg: string;
  border: string;
  focusRing: string;
}

const VARIANT_STYLES: Record<NativeSelectVariant, VariantDef> = {
  default: { bg: "", border: "", focusRing: "" },
  outline: { bg: "bg-transparent", border: "", focusRing: "" },
  ghost: {
    bg: "bg-transparent",
    border: "border border-transparent",
    focusRing: "focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-200",
  },
};

// ── State overrides ──────────────────────────

interface StateOverride {
  border: string;
  focusRing: string;
  iconColor: string;
  messageColor: string;
}

const STATE_OVERRIDES: Record<Exclude<NativeSelectState, "idle">, StateOverride> = {
  error: {
    border: "border border-red-300",
    focusRing: "focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400",
    iconColor: "text-red-400",
    messageColor: "text-red-500",
  },
  success: {
    border: "border border-green-300",
    focusRing: "focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-400",
    iconColor: "text-green-500",
    messageColor: "text-green-600",
  },
};

// ── Style resolver ───────────────────────────

function resolveStyles(variant: NativeSelectVariant, color: NativeSelectColor, state: NativeSelectState) {
  const colorDef = COLORS[color];
  const variantDef = VARIANT_STYLES[variant];

  if (state !== "idle") {
    const override = STATE_OVERRIDES[state];
    return {
      bg: variantDef.bg || colorDef.bg,
      border: override.border,
      focusRing: override.focusRing,
      iconColor: override.iconColor,
      messageColor: override.messageColor,
    };
  }

  return {
    bg: variantDef.bg || colorDef.bg,
    border: variantDef.border || colorDef.border,
    focusRing: variantDef.focusRing || colorDef.focusRing,
    iconColor: colorDef.iconColor,
    messageColor: "",
  };
}

// ── Helper ───────────────────────────────────

function isOptionGroup(item: NativeSelectOption | NativeSelectOptionGroup): item is NativeSelectOptionGroup {
  return "options" in item;
}

// ── Component ────────────────────────────────

export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    {
      options = [],
      variant = "default",
      size = "sm",
      shape = "rounded",
      color = "default",
      state = "idle",
      placeholder,
      label,
      errorMessage,
      successMessage,
      wrapperClassName,
      className,
      disabled = false,
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const autoId = React.useId();
    const id = idProp || autoId;
    const messageId = `${id}-message`;

    const s = SIZES[size];
    const styles = resolveStyles(variant, color, state);

    const message =
      state === "error" ? errorMessage
        : state === "success" ? successMessage
          : undefined;

    return (
      <div className={cn("flex flex-col", wrapperClassName)}>
        {label && (
          <label
            htmlFor={id}
            className={cn("mb-1.5 font-medium text-zinc-700", s.labelFont)}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            aria-label={!label ? (placeholder || "Select") : undefined}
            aria-describedby={message ? messageId : undefined}
            className={cn(
              "w-full appearance-none cursor-pointer transition-colors duration-200",
              "text-zinc-900",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              SHAPES[shape],
              s.height,
              s.font,
              s.paddingLeft,
              s.paddingRight,
              styles.bg,
              styles.border,
              styles.focusRing,
              className,
            )}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((item) => {
              if (isOptionGroup(item)) {
                return (
                  <optgroup key={item.label} label={item.label}>
                    {item.options.map((opt) => (
                      <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                );
              }
              return (
                <option key={item.value} value={item.value} disabled={item.disabled}>
                  {item.label}
                </option>
              );
            })}
          </select>

          <span
            className={cn(
              "absolute top-1/2 -translate-y-1/2 pointer-events-none",
              s.iconRight,
            )}
          >
            <ChevronDownIcon className={cn(s.iconSize, styles.iconColor)} />
          </span>
        </div>

        {message && (
          <p id={messageId} className={cn("mt-1.5 text-xs", styles.messageColor)}>
            {message}
          </p>
        )}
      </div>
    );
  },
);

NativeSelect.displayName = "NativeSelect";
