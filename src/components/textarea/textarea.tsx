"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type TextareaSize = "xs" | "sm" | "md";
export type TextareaVariant = "default" | "outline" | "ghost";
export type TextareaColor = "default" | "black" | "primary" | "danger" | "success" | "warning" | "info";
export type TextareaState = "idle" | "error" | "success";
export type TextareaShape = "square" | "rounded";
export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  variant?: TextareaVariant;
  size?: TextareaSize;
  shape?: TextareaShape;
  color?: TextareaColor;
  state?: TextareaState;
  label?: string;
  errorMessage?: string;
  successMessage?: string;
  resize?: TextareaResize;
  autoGrow?: boolean;
  maxRows?: number;
  wrapperClassName?: string;
  className?: string;
}

// ── Shape definitions ────────────────────────

const SHAPES: Record<TextareaShape, string> = {
  square: "",
  rounded: "rounded-lg",
};

// ── Size definitions ─────────────────────────

const SIZES: Record<TextareaSize, { padding: string; font: string; labelFont: string; minHeight: string }> = {
  xs: { padding: "px-2.5 py-2", font: "text-xs", labelFont: "text-xs", minHeight: "min-h-16" },
  sm: { padding: "px-3 py-2.5", font: "text-sm", labelFont: "text-sm", minHeight: "min-h-20" },
  md: { padding: "px-4 py-3", font: "text-base", labelFont: "text-sm", minHeight: "min-h-24" },
};

// ── Color definitions ────────────────────────

interface TextareaColorDef {
  bg: string;
  border: string;
  focusRing: string;
}

const TEXTAREA_COLORS: Record<TextareaColor, TextareaColorDef> = {
  default: { bg: "bg-zinc-50", border: "border border-zinc-200", focusRing: "focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/10" },
  black: { bg: "bg-zinc-50", border: "border border-zinc-300", focusRing: "focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400" },
  primary: { bg: "bg-blue-50/30", border: "border border-blue-200", focusRing: "focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" },
  danger: { bg: "bg-red-50/30", border: "border border-red-200", focusRing: "focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400" },
  success: { bg: "bg-green-50/30", border: "border border-green-200", focusRing: "focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-400" },
  warning: { bg: "bg-yellow-50/30", border: "border border-yellow-200", focusRing: "focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400" },
  info: { bg: "bg-indigo-50/30", border: "border border-indigo-200", focusRing: "focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" },
};

// ── Variant styles ───────────────────────────

const VARIANT_STYLES: Record<TextareaVariant, { bg: string; border: string; focusRing: string }> = {
  default: { bg: "", border: "", focusRing: "" },
  outline: { bg: "bg-transparent", border: "", focusRing: "" },
  ghost: { bg: "bg-transparent", border: "border border-transparent", focusRing: "focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-200" },
};

// ── State overrides ──────────────────────────

const STATE_OVERRIDES: Record<Exclude<TextareaState, "idle">, { border: string; focusRing: string; messageColor: string }> = {
  error: { border: "border border-red-300", focusRing: "focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400", messageColor: "text-red-500" },
  success: { border: "border border-green-300", focusRing: "focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-400", messageColor: "text-green-600" },
};

// ── Resize map ───────────────────────────────

const RESIZE_MAP: Record<TextareaResize, string> = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
};

// ── Component ────────────────────────────────

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = "default",
      size = "sm",
      shape = "rounded",
      color = "default",
      state = "idle",
      label,
      errorMessage,
      successMessage,
      resize = "vertical",
      autoGrow = false,
      maxRows,
      wrapperClassName,
      className,
      disabled = false,
      id: idProp,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const autoId = React.useId();
    const id = idProp || autoId;
    const messageId = `${id}-message`;
    const internalRef = React.useRef<HTMLTextAreaElement>(null);

    const s = SIZES[size];
    const colorDef = TEXTAREA_COLORS[color];
    const variantDef = VARIANT_STYLES[variant];

    const bg = variantDef.bg || colorDef.bg;
    const border = state !== "idle" ? STATE_OVERRIDES[state].border : (variantDef.border || colorDef.border);
    const focusRing = state !== "idle" ? STATE_OVERRIDES[state].focusRing : (variantDef.focusRing || colorDef.focusRing);
    const messageColor = state !== "idle" ? STATE_OVERRIDES[state].messageColor : "";

    const message = state === "error" ? errorMessage : state === "success" ? successMessage : undefined;

    // Auto-grow logic
    const adjustHeight = React.useCallback(() => {
      const el = internalRef.current;
      if (!el || !autoGrow) return;
      el.style.height = "auto";
      let newHeight = el.scrollHeight;
      if (maxRows) {
        const lineHeight = parseInt(getComputedStyle(el).lineHeight) || 20;
        const maxHeight = lineHeight * maxRows;
        newHeight = Math.min(newHeight, maxHeight);
      }
      el.style.height = `${newHeight}px`;
    }, [autoGrow, maxRows]);

    React.useEffect(() => {
      adjustHeight();
    }, [adjustHeight]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      adjustHeight();
    };

    // Merge refs
    const mergedRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        (internalRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      },
      [ref],
    );

    return (
      <div className={cn("flex flex-col", wrapperClassName)}>
        {label && (
          <label htmlFor={id} className={cn("mb-1.5 font-medium text-zinc-700", s.labelFont)}>
            {label}
          </label>
        )}

        <textarea
          ref={mergedRef}
          id={id}
          disabled={disabled}
          aria-describedby={message ? messageId : undefined}
          onChange={handleChange}
          className={cn(
            "w-full transition-colors duration-200",
            SHAPES[shape],
            "text-zinc-900 placeholder:text-zinc-400",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
            s.padding,
            s.font,
            s.minHeight,
            bg,
            border,
            focusRing,
            !autoGrow && RESIZE_MAP[resize],
            autoGrow && "resize-none overflow-hidden",
            className,
          )}
          {...rest}
        />

        {message && (
          <p id={messageId} className={cn("mt-1.5 text-xs", messageColor)}>{message}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
