import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type InputSize = "xs" | "sm" | "md";
export type InputShape = "square" | "rounded";
export type InputVariant = "default" | "outline" | "ghost";
export type InputColor = "default" | "black" | "primary" | "danger" | "success" | "warning" | "info";
export type InputState = "idle" | "error" | "success";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariant;
  size?: InputSize;
  shape?: InputShape;
  color?: InputColor;
  state?: InputState;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  label?: string;
  errorMessage?: string;
  successMessage?: string;
  wrapperClassName?: string;
  className?: string;
}

// ── Spinner ──────────────────────────────────

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// ── Size definitions ─────────────────────────

const SIZES: Record<InputSize, {
  height: string;
  font: string;
  iconSize: string;
  paddingX: string;
  paddingWithLeftIcon: string;
  paddingWithRightIcon: string;
  paddingWithBothIcons: string;
  iconLeft: string;
  iconRight: string;
  labelFont: string;
}> = {
  xs: {
    height: "h-8",
    font: "text-xs",
    iconSize: "size-3.5",
    paddingX: "px-2.5",
    paddingWithLeftIcon: "pl-8 pr-2.5",
    paddingWithRightIcon: "pl-2.5 pr-8",
    paddingWithBothIcons: "pl-8 pr-8",
    iconLeft: "left-2.5",
    iconRight: "right-2.5",
    labelFont: "text-xs",
  },
  sm: {
    height: "h-10",
    font: "text-sm",
    iconSize: "size-4",
    paddingX: "px-3",
    paddingWithLeftIcon: "pl-9 pr-3",
    paddingWithRightIcon: "pl-3 pr-9",
    paddingWithBothIcons: "pl-9 pr-9",
    iconLeft: "left-3",
    iconRight: "right-3",
    labelFont: "text-sm",
  },
  md: {
    height: "h-12",
    font: "text-base",
    iconSize: "size-4",
    paddingX: "px-4",
    paddingWithLeftIcon: "pl-10 pr-4",
    paddingWithRightIcon: "pl-4 pr-10",
    paddingWithBothIcons: "pl-10 pr-10",
    iconLeft: "left-3.5",
    iconRight: "right-3.5",
    labelFont: "text-sm",
  },
};

// ── Shape definitions ────────────────────────

const SHAPES: Record<InputShape, string> = {
  square: "",
  rounded: "rounded-lg",
};

// ── Color definitions ────────────────────────

interface InputColorDef {
  bg: string;
  border: string;
  focusRing: string;
  iconColor: string;
}

const INPUT_COLORS: Record<InputColor, InputColorDef> = {
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

interface InputVariantDef {
  bg: string;
  border: string;
  focusRing: string;
}

const VARIANT_STYLES: Record<InputVariant, InputVariantDef> = {
  default: { bg: "", border: "", focusRing: "" },
  outline: { bg: "bg-transparent", border: "", focusRing: "" },
  ghost: {
    bg: "bg-transparent",
    border: "border border-transparent",
    focusRing: "focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-200",
  },
};

// ── State overrides ──────────────────────────

interface InputStateOverride {
  border: string;
  focusRing: string;
  iconColor: string;
  messageColor: string;
}

const STATE_OVERRIDES: Record<Exclude<InputState, "idle">, InputStateOverride> = {
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

function resolveStyles(variant: InputVariant, color: InputColor, state: InputState) {
  const colorDef = INPUT_COLORS[color];
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

// ── Padding resolver ─────────────────────────

function resolvePadding(
  s: (typeof SIZES)[InputSize],
  hasLeftIcon: boolean,
  hasRightIcon: boolean,
): string {
  if (hasLeftIcon && hasRightIcon) return s.paddingWithBothIcons;
  if (hasLeftIcon) return s.paddingWithLeftIcon;
  if (hasRightIcon) return s.paddingWithRightIcon;
  return s.paddingX;
}

// ── Component ────────────────────────────────

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      size = "sm",
      shape = "rounded",
      color = "default",
      state = "idle",
      icon,
      iconRight,
      loading = false,
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
    const hasLeftIcon = !!icon;
    const hasRightIcon = !!iconRight || loading;
    const padding = resolvePadding(s, hasLeftIcon, hasRightIcon);

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
          {hasLeftIcon && (
            <span
              className={cn(
                "absolute top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none",
                s.iconLeft,
              )}
            >
              <span className={cn(
                "shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full",
                s.iconSize,
                styles.iconColor,
              )}>
                {icon}
              </span>
            </span>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled || loading}
            aria-describedby={message ? messageId : undefined}
            className={cn(
              "w-full transition-colors duration-200",
              "text-zinc-900 placeholder:text-zinc-400",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
              SHAPES[shape],
              s.height,
              s.font,
              padding,
              styles.bg,
              styles.border,
              styles.focusRing,
              className,
            )}
            {...rest}
          />

          {hasRightIcon && (
            <span
              className={cn(
                "absolute top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none",
                s.iconRight,
              )}
            >
              {loading ? (
                <Spinner className={cn(s.iconSize, styles.iconColor)} />
              ) : (
                <span className={cn(
                  "shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full",
                  s.iconSize,
                  styles.iconColor,
                )}>
                  {iconRight}
                </span>
              )}
            </span>
          )}
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

Input.displayName = "Input";
