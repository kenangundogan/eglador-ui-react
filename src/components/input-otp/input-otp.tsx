"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type InputOTPSize = "sm" | "md" | "lg";
export type InputOTPVariant = "default" | "outline";

export interface InputOTPProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  size?: InputOTPSize;
  variant?: InputOTPVariant;
  separator?: boolean;
  separatorAfter?: number[];
  mask?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  type?: "text" | "number";
  placeholder?: string;
  state?: "idle" | "error" | "success";
  errorMessage?: string;
  successMessage?: string;
  className?: string;
}

// ── Size definitions ─────────────────────────

const SIZES: Record<InputOTPSize, { slot: string; font: string; gap: string }> = {
  sm: { slot: "size-9", font: "text-sm", gap: "gap-1.5" },
  md: { slot: "size-11", font: "text-lg", gap: "gap-2" },
  lg: { slot: "size-13", font: "text-xl", gap: "gap-2.5" },
};

// ── State styles ─────────────────────────────

const STATE_STYLES: Record<string, { border: string; focusBorder: string; message: string }> = {
  idle: {
    border: "border-zinc-200",
    focusBorder: "border-zinc-900 ring-2 ring-zinc-900/5",
    message: "",
  },
  error: {
    border: "border-red-300",
    focusBorder: "border-red-500 ring-2 ring-red-100",
    message: "text-red-500",
  },
  success: {
    border: "border-green-300",
    focusBorder: "border-green-500 ring-2 ring-green-100",
    message: "text-green-600",
  },
};

// ── Separator Dot ────────────────────────────

function SeparatorDot({ size }: { size: InputOTPSize }) {
  return (
    <div className="flex items-center justify-center px-1">
      <div className={cn("rounded-full bg-zinc-300", size === "sm" ? "size-1" : size === "md" ? "size-1.5" : "size-2")} />
    </div>
  );
}

// ── Component ────────────────────────────────

export function InputOTP({
  length = 6,
  value: controlledValue,
  onChange,
  onComplete,
  size = "md",
  variant = "default",
  separator = false,
  separatorAfter,
  mask = false,
  disabled = false,
  autoFocus = false,
  type = "text",
  placeholder = "",
  state = "idle",
  errorMessage,
  successMessage,
  className,
}: InputOTPProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState("");
  const otp = isControlled ? controlledValue : internalValue;

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const s = SIZES[size];
  const stateStyle = STATE_STYLES[state];

  const setOtp = React.useCallback((newValue: string) => {
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue);
    if (newValue.length === length) {
      onComplete?.(newValue);
    }
  }, [isControlled, onChange, onComplete, length]);

  const focusSlot = React.useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, length - 1));
    requestAnimationFrame(() => {
      inputRefs.current[clamped]?.focus();
      inputRefs.current[clamped]?.select();
    });
  }, [length]);

  React.useEffect(() => {
    if (autoFocus) focusSlot(0);
  }, [autoFocus, focusSlot]);

  const handleChange = (index: number, inputValue: string) => {
    if (disabled) return;

    // Handle paste of multiple characters
    if (inputValue.length > 1) {
      const chars = inputValue.slice(0, length - index);
      const newOtp = otp.slice(0, index) + chars + otp.slice(index + chars.length);
      setOtp(newOtp.slice(0, length));
      focusSlot(Math.min(index + chars.length, length - 1));
      return;
    }

    // Validate input type
    if (type === "number" && inputValue && !/^\d$/.test(inputValue)) return;

    const newOtp = otp.slice(0, index) + inputValue + otp.slice(index + 1);
    setOtp(newOtp.slice(0, length));

    if (inputValue && index < length - 1) {
      focusSlot(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      if (otp[index]) {
        const newOtp = otp.slice(0, index) + otp.slice(index + 1);
        setOtp(newOtp);
      } else if (index > 0) {
        focusSlot(index - 1);
        const newOtp = otp.slice(0, index - 1) + otp.slice(index);
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusSlot(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      focusSlot(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (disabled) return;
    const pastedData = e.clipboardData.getData("text").trim();
    const filtered = type === "number" ? pastedData.replace(/\D/g, "") : pastedData;
    const chars = filtered.slice(0, length);
    setOtp(chars);
    focusSlot(Math.min(chars.length, length - 1));
  };

  const defaultSeparatorAfter = separatorAfter || (separator && length > 3 ? [Math.floor(length / 2) - 1] : []);
  const message = state === "error" ? errorMessage : state === "success" ? successMessage : undefined;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className={cn("flex items-center", s.gap)}>
        {Array.from({ length }, (_, index) => {
          const char = otp[index] || "";
          const isFocusable = index === otp.length || (index === length - 1 && otp.length === length);
          const showSeparator = (defaultSeparatorAfter as number[]).includes(index);

          return (
            <React.Fragment key={index}>
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type={type === "number" ? "tel" : "text"}
                inputMode={type === "number" ? "numeric" : "text"}
                maxLength={1}
                value={mask && char ? "●" : char}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                aria-label={`Digit ${index + 1} of ${length}`}
                className={cn(
                  "flex items-center justify-center text-center font-semibold rounded-lg border bg-white transition-colors outline-none",
                  s.slot,
                  s.font,
                  stateStyle.border,
                  "focus:" + stateStyle.focusBorder.split(" ").join(" focus:"),
                  disabled && "opacity-50 cursor-not-allowed bg-zinc-50",
                  variant === "outline" && "bg-transparent",
                )}
              />
              {showSeparator && <SeparatorDot size={size} />}
            </React.Fragment>
          );
        })}
      </div>
      {message && (
        <p className={cn("mt-2 text-xs", stateStyle.message)}>{message}</p>
      )}
    </div>
  );
}

InputOTP.displayName = "InputOTP";
