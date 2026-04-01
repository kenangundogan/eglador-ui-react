import * as React from "react";
import { cn } from "../../lib/utils";
import { ExternalLinkIcon } from "../../lib/icons";

// ── Types ────────────────────────────────────

export type LinkVariant = "default" | "underline" | "ghost";
export type LinkColor = "default" | "black" | "primary" | "danger" | "success" | "warning" | "info";
export type LinkSize = "xs" | "sm" | "md";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
  color?: LinkColor;
  size?: LinkSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  external?: boolean;
  disabled?: boolean;
  className?: string;
}

// ── Size definitions ─────────────────────────

const SIZES: Record<LinkSize, { font: string; iconSize: string; gap: string }> = {
  xs: { font: "text-xs", iconSize: "size-3", gap: "gap-1" },
  sm: { font: "text-sm", iconSize: "size-3.5", gap: "gap-1.5" },
  md: { font: "text-base", iconSize: "size-4", gap: "gap-2" },
};

// ── Color definitions ────────────────────────

interface LinkColorDef {
  text: string;
  hover: string;
  iconColor: string;
}

const COLORS: Record<LinkColor, LinkColorDef> = {
  default: {
    text: "text-zinc-700",
    hover: "hover:text-zinc-900",
    iconColor: "text-zinc-400",
  },
  black: {
    text: "text-zinc-900",
    hover: "hover:text-black",
    iconColor: "text-zinc-600",
  },
  primary: {
    text: "text-blue-600",
    hover: "hover:text-blue-700",
    iconColor: "text-blue-500",
  },
  danger: {
    text: "text-red-600",
    hover: "hover:text-red-700",
    iconColor: "text-red-500",
  },
  success: {
    text: "text-green-600",
    hover: "hover:text-green-700",
    iconColor: "text-green-500",
  },
  warning: {
    text: "text-yellow-600",
    hover: "hover:text-yellow-700",
    iconColor: "text-yellow-500",
  },
  info: {
    text: "text-indigo-600",
    hover: "hover:text-indigo-700",
    iconColor: "text-indigo-500",
  },
};

// ── Variant styles ───────────────────────────

const VARIANT_STYLES: Record<LinkVariant, string> = {
  default: "",
  underline: "underline underline-offset-4",
  ghost: "no-underline hover:bg-zinc-100 px-2 py-1 rounded-md -mx-2 -my-1",
};

// ── Component ────────────────────────────────

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      variant = "default",
      color = "primary",
      size = "sm",
      icon,
      iconRight,
      external = false,
      disabled = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const s = SIZES[size];
    const c = COLORS[color];

    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};

    return (
      <a
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium transition-colors",
          s.font,
          s.gap,
          c.text,
          !disabled && c.hover,
          VARIANT_STYLES[variant],
          disabled && "opacity-50 pointer-events-none cursor-not-allowed",
          className,
        )}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        {...externalProps}
        {...rest}
      >
        {icon && (
          <span className={cn("shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full", s.iconSize, c.iconColor)}>
            {icon}
          </span>
        )}

        {children}

        {external && !iconRight && (
          <ExternalLinkIcon className={cn(s.iconSize, c.iconColor)} />
        )}

        {iconRight && (
          <span className={cn("shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full", s.iconSize, c.iconColor)}>
            {iconRight}
          </span>
        )}
      </a>
    );
  },
);

Link.displayName = "Link";
