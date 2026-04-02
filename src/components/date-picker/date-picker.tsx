"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { CalendarIcon, XIcon } from "../../lib/icons";
import { Popover } from "../popover";
import { Calendar, type DateRange } from "../calendar";

// ── Types ────────────────────────────────────

export type DatePickerMode = "single" | "range";

export interface DatePickerProps {
  mode?: DatePickerMode;
  value?: Date | DateRange | null;
  onChange?: (value: Date | DateRange | null) => void;
  placeholder?: string;
  locale?: string;
  numberOfMonths?: number;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[];
  weekStartsOn?: 0 | 1;
  disabled?: boolean;
  clearable?: boolean;
  state?: "idle" | "error" | "success";
  errorMessage?: string;
  successMessage?: string;
  label?: string;
  className?: string;
}

// ── State styles ─────────────────────────────

const STATE_STYLES: Record<string, { border: string; focus: string; message: string }> = {
  idle: { border: "border-zinc-200", focus: "border-zinc-300 ring-2 ring-zinc-900/5", message: "" },
  error: { border: "border-red-300", focus: "border-red-500 ring-2 ring-red-100", message: "text-red-500" },
  success: { border: "border-green-300", focus: "border-green-500 ring-2 ring-green-100", message: "text-green-600" },
};

// ── Format helpers ───────────────────────────

function formatDate(date: Date | null, locale: string): string {
  if (!date) return "";
  return date.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}

function formatRange(range: DateRange | null, locale: string): string {
  if (!range || !range.from) return "";
  const from = formatDate(range.from, locale);
  const to = range.to ? formatDate(range.to, locale) : "...";
  return `${from} → ${to}`;
}

// ── Component ────────────────────────────────

export function DatePicker({
  mode = "single",
  value,
  onChange,
  placeholder,
  locale = "en-US",
  numberOfMonths,
  minDate,
  maxDate,
  disabledDates,
  disabledDaysOfWeek,
  weekStartsOn = 1,
  disabled = false,
  clearable = true,
  state = "idle",
  errorMessage,
  successMessage,
  label,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const autoId = React.useId();
  const stateStyle = STATE_STYLES[state];

  const defaultPlaceholder = mode === "range" ? "Select date range..." : "Select date...";
  const displayPlaceholder = placeholder || defaultPlaceholder;

  const defaultMonths = numberOfMonths ?? (mode === "range" ? 2 : 1);

  const displayValue = mode === "single"
    ? formatDate(value as Date | null, locale)
    : formatRange(value as DateRange | null, locale);

  const hasValue = mode === "single"
    ? value instanceof Date
    : value && (value as DateRange).from;

  const handleSelect = (selected: Date | Date[] | DateRange | null) => {
    if (mode === "single") {
      onChange?.(selected as Date);
      setOpen(false);
    } else {
      const range = selected as DateRange;
      onChange?.(range);
      if (range?.from && range?.to) {
        setOpen(false);
      }
    }
  };

  const handleClear = (e?: { stopPropagation: () => void }) => {
    e?.stopPropagation();
    onChange?.(mode === "range" ? { from: null, to: null } : null);
  };

  const message = state === "error" ? errorMessage : state === "success" ? successMessage : undefined;

  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <label htmlFor={autoId} className="mb-1.5 text-sm font-medium text-zinc-700">{label}</label>
      )}

      <Popover open={open} onOpenChange={setOpen} side="bottom" align="start">
        <div className="relative flex items-center">
          <Popover.Trigger asChild>
            <button
              type="button"
              id={autoId}
              disabled={disabled}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg border bg-white px-3 h-10 text-sm transition-colors outline-none text-left",
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                open ? stateStyle.focus : stateStyle.border,
                !open && !disabled && "hover:border-zinc-300",
                clearable && hasValue && !disabled && "pr-8",
              )}
            >
              <CalendarIcon className="size-4 text-zinc-400 shrink-0" />
              <span className={cn("flex-1 truncate", hasValue ? "text-zinc-900" : "text-zinc-400")}>
                {displayValue || displayPlaceholder}
              </span>
            </button>
          </Popover.Trigger>
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              aria-label="Clear date"
              onClick={handleClear}
              className="absolute right-2 shrink-0 size-4 flex items-center justify-center rounded text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
            >
              <XIcon className="size-3" />
            </button>
          )}
        </div>
        <Popover.Content className="p-0 w-auto max-w-[calc(100vw-2rem)]">
          <Calendar
            mode={mode}
            selected={value}
            onSelect={handleSelect}
            numberOfMonths={defaultMonths}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            disabledDaysOfWeek={disabledDaysOfWeek}
            weekStartsOn={weekStartsOn}
            locale={locale}
            className="border-0"
          />
        </Popover.Content>
      </Popover>

      {message && (
        <p className={cn("mt-1.5 text-xs", stateStyle.message)}>{message}</p>
      )}
    </div>
  );
}

DatePicker.displayName = "DatePicker";
