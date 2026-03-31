"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Popover } from "../popover";
import { Calendar, type DateRange } from "../calendar";

// ── Types ────────────────────────────────────

export interface DateTimePickerProps {
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  placeholder?: string;
  locale?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[];
  weekStartsOn?: 0 | 1;
  hourStep?: number;
  minuteStep?: number;
  use24Hour?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  state?: "idle" | "error" | "success";
  errorMessage?: string;
  successMessage?: string;
  label?: string;
  className?: string;
}

// ── Icons ────────────────────────────────────

function CalendarClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h5" />
      <path d="M17.5 17.5 16 16.3V14" />
      <circle cx="16" cy="16" r="6" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// ── State styles ─────────────────────────────

const STATE_STYLES: Record<string, { border: string; focus: string; message: string }> = {
  idle: { border: "border-zinc-200", focus: "border-zinc-300 ring-2 ring-zinc-900/5", message: "" },
  error: { border: "border-red-300", focus: "border-red-500 ring-2 ring-red-100", message: "text-red-500" },
  success: { border: "border-green-300", focus: "border-green-500 ring-2 ring-green-100", message: "text-green-600" },
};

// ── Format helper ────────────────────────────

function formatDateTime(date: Date | null, locale: string, use24Hour: boolean): string {
  if (!date) return "";
  const dateStr = date.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
  const timeStr = date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: !use24Hour });
  return `${dateStr} ${timeStr}`;
}

function padZero(n: number): string {
  return n.toString().padStart(2, "0");
}

// ── Time Spinner ─────────────────────────────

function TimeSpinner({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
}) {
  const increment = () => {
    const next = value + step;
    onChange(next > max ? min : next);
  };

  const decrement = () => {
    const prev = value - step;
    onChange(prev < min ? max : prev);
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] text-zinc-400 font-medium">{label}</span>
      <button type="button" onClick={increment} className="size-7 flex items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors cursor-pointer">
        <ChevronUpIcon className="size-3.5" />
      </button>
      <div className="size-10 flex items-center justify-center rounded-lg bg-zinc-50 border border-zinc-200 text-sm font-semibold text-zinc-900 tabular-nums">
        {padZero(value)}
      </div>
      <button type="button" onClick={decrement} className="size-7 flex items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors cursor-pointer">
        <ChevronDownIcon className="size-3.5" />
      </button>
    </div>
  );
}

// ── Component ────────────────────────────────

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time...",
  locale = "en-US",
  minDate,
  maxDate,
  disabledDates,
  disabledDaysOfWeek,
  weekStartsOn = 1,
  hourStep = 1,
  minuteStep = 1,
  use24Hour = true,
  disabled = false,
  clearable = true,
  state = "idle",
  errorMessage,
  successMessage,
  label,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const autoId = React.useId();
  const stateStyle = STATE_STYLES[state];

  const currentDate = value || new Date();
  const [hours, setHours] = React.useState(currentDate.getHours());
  const [minutes, setMinutes] = React.useState(currentDate.getMinutes());

  // Sync time when value changes externally
  React.useEffect(() => {
    if (value) {
      setHours(value.getHours());
      setMinutes(value.getMinutes());
    }
  }, [value]);

  const displayValue = formatDateTime(value || null, locale, use24Hour);
  const hasValue = !!value;

  const updateDateTime = (date: Date, h: number, m: number) => {
    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0, 0);
    onChange?.(newDate);
  };

  const handleDateSelect = (selected: Date | Date[] | DateRange | null) => {
    if (selected instanceof Date) {
      updateDateTime(selected, hours, minutes);
    }
  };

  const handleHourChange = (h: number) => {
    setHours(h);
    const date = value || new Date();
    updateDateTime(date, h, minutes);
  };

  const handleMinuteChange = (m: number) => {
    setMinutes(m);
    const date = value || new Date();
    updateDateTime(date, hours, m);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  const handleNow = () => {
    const now = new Date();
    setHours(now.getHours());
    setMinutes(now.getMinutes());
    onChange?.(now);
  };

  const message = state === "error" ? errorMessage : state === "success" ? successMessage : undefined;

  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <label htmlFor={autoId} className="mb-1.5 text-sm font-medium text-zinc-700">{label}</label>
      )}

      <Popover open={open} onOpenChange={setOpen} side="bottom" align="start">
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
            )}
          >
            <CalendarClockIcon className="size-4 text-zinc-400 shrink-0" />
            <span className={cn("flex-1 truncate", hasValue ? "text-zinc-900" : "text-zinc-400")}>
              {displayValue || placeholder}
            </span>
            {clearable && hasValue && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => { if (e.key === "Enter") handleClear(e as unknown as React.MouseEvent); }}
                className="shrink-0 size-4 flex items-center justify-center rounded text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
              >
                <XIcon className="size-3" />
              </span>
            )}
          </button>
        </Popover.Trigger>
        <Popover.Content className="p-0 w-auto max-w-[calc(100vw-2rem)]">
          <div className="flex flex-col sm:flex-row">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={disabledDates}
              disabledDaysOfWeek={disabledDaysOfWeek}
              weekStartsOn={weekStartsOn}
              locale={locale}
              className="border-0"
            />
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-3 sm:py-0 border-t sm:border-t-0 sm:border-l border-zinc-200">
              <div className="flex items-center gap-2">
                <TimeSpinner value={hours} onChange={handleHourChange} min={0} max={23} step={hourStep} label="Hour" />
                <span className="text-lg font-bold text-zinc-300 mt-5">:</span>
                <TimeSpinner value={minutes} onChange={handleMinuteChange} min={0} max={59} step={minuteStep} label="Min" />
              </div>
              <button
                type="button"
                onClick={handleNow}
                className="text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
              >
                Now
              </button>
            </div>
          </div>
        </Popover.Content>
      </Popover>

      {message && (
        <p className={cn("mt-1.5 text-xs", stateStyle.message)}>{message}</p>
      )}
    </div>
  );
}

DateTimePicker.displayName = "DateTimePicker";
