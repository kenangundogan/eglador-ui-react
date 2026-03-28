import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type ButtonColor = "default" | "black" | "primary" | "danger" | "success" | "warning" | "info";
export type ButtonSize = "xs" | "sm" | "md";
export type ButtonShape = "square" | "rounded" | "circle";
export type ButtonVariant = "solid" | "outline" | "ghost";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "active"> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  soft?: boolean;
  size?: ButtonSize;
  shape?: ButtonShape;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  active?: boolean;
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

// ── Boyut tanimlari ──────────────────────────

const SIZES: Record<ButtonSize, { height: string; square: string; padding: string; gap: string; font: string; iconSize: string }> = {
  xs: { height: "h-8", square: "w-8", padding: "px-2", gap: "gap-1", font: "text-xs", iconSize: "size-3" },
  sm: { height: "h-10", square: "w-10", padding: "px-3", gap: "gap-1.5", font: "text-sm", iconSize: "size-3.5" },
  md: { height: "h-12", square: "w-12", padding: "px-4", gap: "gap-2", font: "text-base", iconSize: "size-4" },
};

// ── Sekil tanimlari ──────────────────────────

const SHAPES: Record<ButtonShape, string> = {
  square: "",
  rounded: "rounded-lg",
  circle: "rounded-full",
};

// ── Renk tanimlari ───────────────────────────

interface ColorDef {
  base: string;
  hover: string;
  text: string;
  iconColor: string;
}

const COLOR_DEFAULT_SOLID: ColorDef = {
  base: "bg-white border border-zinc-100",
  hover: "hover:bg-zinc-100",
  text: "text-zinc-700",
  iconColor: "text-zinc-500",
};

const COLORS: Record<Exclude<ButtonColor, "default">, { solid: ColorDef; soft: ColorDef }> = {
  black: {
    solid: { base: "bg-zinc-900 border border-zinc-900", hover: "hover:bg-zinc-800", text: "text-zinc-50", iconColor: "text-zinc-50" },
    soft: { base: "bg-zinc-100 border border-zinc-200", hover: "hover:bg-zinc-200", text: "text-zinc-800", iconColor: "text-zinc-600" },
  },
  primary: {
    solid: { base: "bg-blue-500 border border-blue-500", hover: "hover:bg-blue-600", text: "text-white", iconColor: "text-white" },
    soft: { base: "bg-blue-50 border border-blue-100", hover: "hover:bg-blue-100", text: "text-blue-600", iconColor: "text-blue-500" },
  },
  danger: {
    solid: { base: "bg-red-500 border border-red-500", hover: "hover:bg-red-600", text: "text-white", iconColor: "text-white" },
    soft: { base: "bg-red-100 border border-red-200", hover: "hover:bg-red-200", text: "text-red-600", iconColor: "text-red-500" },
  },
  success: {
    solid: { base: "bg-green-500 border border-green-500", hover: "hover:bg-green-600", text: "text-white", iconColor: "text-white" },
    soft: { base: "bg-green-50 border border-green-100", hover: "hover:bg-green-100", text: "text-green-600", iconColor: "text-green-500" },
  },
  warning: {
    solid: { base: "bg-yellow-500 border border-yellow-500", hover: "hover:bg-yellow-600", text: "text-white", iconColor: "text-white" },
    soft: { base: "bg-yellow-50 border border-yellow-100", hover: "hover:bg-yellow-100", text: "text-yellow-700", iconColor: "text-yellow-600" },
  },
  info: {
    solid: { base: "bg-indigo-500 border border-indigo-500", hover: "hover:bg-indigo-600", text: "text-white", iconColor: "text-white" },
    soft: { base: "bg-indigo-50 border border-indigo-100", hover: "hover:bg-indigo-100", text: "text-indigo-600", iconColor: "text-indigo-500" },
  },
};

const COLOR_DEFAULT_OUTLINE: ColorDef = {
  base: "bg-transparent border border-zinc-200",
  hover: "hover:bg-zinc-50",
  text: "text-zinc-700",
  iconColor: "text-zinc-500",
};

const OUTLINE_COLORS: Record<Exclude<ButtonColor, "default">, ColorDef> = {
  black: { base: "bg-transparent border border-zinc-300", hover: "hover:bg-zinc-50", text: "text-zinc-800", iconColor: "text-zinc-600" },
  primary: { base: "bg-transparent border border-blue-200", hover: "hover:bg-blue-50", text: "text-blue-600", iconColor: "text-blue-500" },
  danger: { base: "bg-transparent border border-red-200", hover: "hover:bg-red-50", text: "text-red-600", iconColor: "text-red-500" },
  success: { base: "bg-transparent border border-green-200", hover: "hover:bg-green-50", text: "text-green-600", iconColor: "text-green-500" },
  warning: { base: "bg-transparent border border-yellow-200", hover: "hover:bg-yellow-50", text: "text-yellow-700", iconColor: "text-yellow-600" },
  info: { base: "bg-transparent border border-indigo-200", hover: "hover:bg-indigo-50", text: "text-indigo-600", iconColor: "text-indigo-500" },
};

const COLOR_DEFAULT_GHOST: ColorDef = {
  base: "bg-transparent",
  hover: "hover:bg-zinc-100",
  text: "text-zinc-500",
  iconColor: "text-zinc-500",
};

const GHOST_COLORS: Record<Exclude<ButtonColor, "default">, ColorDef> = {
  black: { base: "bg-transparent", hover: "hover:bg-zinc-100", text: "text-zinc-800", iconColor: "text-zinc-600" },
  primary: { base: "bg-transparent", hover: "hover:bg-blue-50", text: "text-blue-600", iconColor: "text-blue-500" },
  danger: { base: "bg-transparent", hover: "hover:bg-red-50", text: "text-red-600", iconColor: "text-red-500" },
  success: { base: "bg-transparent", hover: "hover:bg-green-50", text: "text-green-600", iconColor: "text-green-500" },
  warning: { base: "bg-transparent", hover: "hover:bg-yellow-50", text: "text-yellow-700", iconColor: "text-yellow-600" },
  info: { base: "bg-transparent", hover: "hover:bg-indigo-50", text: "text-indigo-600", iconColor: "text-indigo-500" },
};

const ACTIVE_DEFAULT = "bg-zinc-50 border border-zinc-300";

// ── Yardimci: renk stillerini resolve et ─────

function resolveColor(color: ButtonColor, soft: boolean, active: boolean, variant: ButtonVariant): ColorDef {
  if (active && color === "default") {
    return { ...COLOR_DEFAULT_SOLID, base: ACTIVE_DEFAULT };
  }

  if (color === "default") {
    if (variant === "ghost") return COLOR_DEFAULT_GHOST;
    if (variant === "outline") return COLOR_DEFAULT_OUTLINE;
    return COLOR_DEFAULT_SOLID;
  }

  if (variant === "ghost") return GHOST_COLORS[color];
  if (variant === "outline") return OUTLINE_COLORS[color];

  return soft ? COLORS[color].soft : COLORS[color].solid;
}

// ── Bilesen ──────────────────────────────────

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "solid",
      color = "default",
      soft = false,
      size = "sm",
      shape = "rounded",
      icon,
      iconRight,
      loading = false,
      active = false,
      disabled = false,
      className,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const s = SIZES[size];
    const isIconOnly = !children && (!!icon || loading);
    const colorDef = resolveColor(color, soft, active, variant);

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          "group inline-flex items-center justify-center",
          "font-medium transition-all duration-200",
          "cursor-pointer select-none",
          "disabled:opacity-50 disabled:pointer-events-none",
          SHAPES[shape],
          s.height,
          isIconOnly ? s.square : [s.padding, s.gap],
          !isIconOnly && s.font,
          colorDef.base,
          colorDef.hover,
          colorDef.text,
          className,
        )}
        {...rest}
      >
        {loading ? (
          <Spinner className={cn(s.iconSize, colorDef.iconColor)} />
        ) : icon ? (
          <span className={cn("shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full", s.iconSize, colorDef.iconColor)}>
            {icon}
          </span>
        ) : null}

        {children}

        {iconRight && !loading && (
          <span className={cn("shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full", s.iconSize, colorDef.iconColor)}>
            {iconRight}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
