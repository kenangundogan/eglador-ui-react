import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type LabelSize = "xs" | "sm" | "md";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  size?: LabelSize;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

// ── Size definitions ─────────────────────────

const SIZES: Record<LabelSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
};

// ── Component ────────────────────────────────

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ size = "sm", required = false, disabled = false, className, children, ...rest }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "font-medium text-zinc-700 leading-none",
          SIZES[size],
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-default",
          className,
        )}
        {...rest}
      >
        {children}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    );
  },
);

Label.displayName = "Label";
