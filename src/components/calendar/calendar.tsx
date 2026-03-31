"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type CalendarMode = "single" | "range" | "multiple";
export type CalendarSize = "sm" | "md";

export interface CalendarProps {
  mode?: CalendarMode;
  selected?: Date | Date[] | DateRange | null;
  onSelect?: (date: Date | Date[] | DateRange | null) => void;
  defaultMonth?: Date;
  size?: CalendarSize;
  numberOfMonths?: number;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[];
  showOutsideDays?: boolean;
  weekStartsOn?: 0 | 1;
  locale?: string;
  className?: string;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

// ── Icons ────────────────────────────────────

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// ── Size definitions ─────────────────────────

const SIZES: Record<CalendarSize, { cell: string; font: string; headerFont: string; dayFont: string; padding: string }> = {
  sm: { cell: "size-8", font: "text-xs", headerFont: "text-sm", dayFont: "text-[10px]", padding: "p-2" },
  md: { cell: "size-10", font: "text-sm", headerFont: "text-sm", dayFont: "text-xs", padding: "p-3" },
};

// ── Date helpers ─────────────────────────────

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function isInRange(date: Date, from: Date | null, to: Date | null): boolean {
  if (!from || !to) return false;
  const time = date.getTime();
  return time >= from.getTime() && time <= to.getTime();
}

function isRangeStart(date: Date, from: Date | null): boolean {
  return !!from && isSameDay(date, from);
}

function isRangeEnd(date: Date, to: Date | null): boolean {
  return !!to && isSameDay(date, to);
}

function getWeekDayNames(locale: string, weekStartsOn: number): string[] {
  const days: string[] = [];
  const base = new Date(2024, 0, weekStartsOn); // Jan 2024, starts on weekStartsOn
  // Find the first day that matches weekStartsOn (0=Sun, 1=Mon)
  while (base.getDay() !== weekStartsOn) {
    base.setDate(base.getDate() + 1);
  }
  for (let i = 0; i < 7; i++) {
    days.push(base.toLocaleDateString(locale, { weekday: "short" }).slice(0, 2));
    base.setDate(base.getDate() + 1);
  }
  return days;
}

function getCalendarDays(year: number, month: number, weekStartsOn: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  let startOffset = firstDay.getDay() - weekStartsOn;
  if (startOffset < 0) startOffset += 7;

  const days: (Date | null)[] = [];

  // Previous month days
  const prevMonth = new Date(year, month, 0);
  const prevMonthDays = prevMonth.getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, prevMonthDays - i));
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  // Next month days (fill to 42 = 6 rows)
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push(new Date(year, month + 1, d));
  }

  return days;
}

// ── Component ────────────────────────────────

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  defaultMonth,
  size = "md",
  numberOfMonths = 1,
  minDate,
  maxDate,
  disabledDates = [],
  disabledDaysOfWeek = [],
  showOutsideDays = true,
  weekStartsOn = 1,
  locale = "en-US",
  className,
}: CalendarProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = React.useState(() => {
    if (defaultMonth) return { year: defaultMonth.getFullYear(), month: defaultMonth.getMonth() };
    if (selected instanceof Date) return { year: selected.getFullYear(), month: selected.getMonth() };
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  const s = SIZES[size];
  const weekDays = React.useMemo(() => getWeekDayNames(locale, weekStartsOn), [locale, weekStartsOn]);

  const goToPrevMonth = () => {
    setViewMonth((prev) => {
      const d = new Date(prev.year, prev.month - 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const goToNextMonth = () => {
    setViewMonth((prev) => {
      const d = new Date(prev.year, prev.month + 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const isDisabledDate = (date: Date): boolean => {
    if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
    if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
    if (disabledDaysOfWeek.includes(date.getDay())) return true;
    if (disabledDates.some((d) => isSameDay(d, date))) return true;
    return false;
  };

  const isSelectedDate = (date: Date): boolean => {
    if (!selected) return false;
    if (mode === "single" && selected instanceof Date) return isSameDay(date, selected);
    if (mode === "multiple" && Array.isArray(selected)) return selected.some((d) => isSameDay(d, date));
    return false;
  };

  const isInSelectedRange = (date: Date): boolean => {
    if (mode !== "range" || !selected || selected instanceof Date || Array.isArray(selected)) return false;
    return isInRange(date, (selected as DateRange).from, (selected as DateRange).to);
  };

  const isRangeStartDay = (date: Date): boolean => {
    if (mode !== "range" || !selected || selected instanceof Date || Array.isArray(selected)) return false;
    return isRangeStart(date, (selected as DateRange).from);
  };

  const isRangeEndDay = (date: Date): boolean => {
    if (mode !== "range" || !selected || selected instanceof Date || Array.isArray(selected)) return false;
    return isRangeEnd(date, (selected as DateRange).to);
  };

  const handleDayClick = (date: Date) => {
    if (isDisabledDate(date)) return;

    if (mode === "single") {
      onSelect?.(date);
    } else if (mode === "multiple") {
      const current = (Array.isArray(selected) ? selected : []) as Date[];
      const exists = current.findIndex((d) => isSameDay(d, date));
      if (exists >= 0) {
        onSelect?.(current.filter((_, i) => i !== exists));
      } else {
        onSelect?.([...current, date]);
      }
    } else if (mode === "range") {
      const range = (selected && !(selected instanceof Date) && !Array.isArray(selected)) ? selected as DateRange : { from: null, to: null };
      if (!range.from || (range.from && range.to)) {
        onSelect?.({ from: date, to: null });
      } else {
        if (date < range.from) {
          onSelect?.({ from: date, to: range.from });
        } else {
          onSelect?.({ from: range.from, to: date });
        }
      }
    }
  };

  // Generate month offsets for multi-month view
  const months = React.useMemo(() => {
    return Array.from({ length: numberOfMonths }, (_, i) => {
      const d = new Date(viewMonth.year, viewMonth.month + i);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }, [viewMonth, numberOfMonths]);

  // Render a single month grid
  const renderMonth = (monthData: { year: number; month: number }, monthIndex: number) => {
    const days = getCalendarDays(monthData.year, monthData.month, weekStartsOn);
    const isFirst = monthIndex === 0;
    const isLast = monthIndex === numberOfMonths - 1;

    // Month names for dropdown
    const monthNames = Array.from({ length: 12 }, (_, i) =>
      new Date(2024, i).toLocaleDateString(locale, { month: "long" }),
    );

    // Year range for dropdown
    const minYear = minDate ? minDate.getFullYear() : monthData.year - 100;
    const maxYear = maxDate ? maxDate.getFullYear() : monthData.year + 10;
    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

    const handleMonthSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newMonth = parseInt(e.target.value, 10);
      setViewMonth((prev) => {
        const offset = monthIndex;
        const d = new Date(prev.year, newMonth - offset);
        return { year: d.getFullYear(), month: d.getMonth() };
      });
    };

    const handleYearSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newYear = parseInt(e.target.value, 10);
      setViewMonth((prev) => {
        const offset = monthIndex;
        const d = new Date(newYear, prev.month + offset);
        // Adjust back by offset so this panel shows the selected year
        const adjusted = new Date(d.getFullYear(), d.getMonth() - offset);
        return { year: adjusted.getFullYear(), month: adjusted.getMonth() };
      });
    };

    return (
      <div key={`${monthData.year}-${monthData.month}`} className="flex flex-col">
        {/* Month header */}
        <div className="relative flex items-center justify-center mb-2 h-8">
          {isFirst && (
            <button
              type="button"
              onClick={goToPrevMonth}
              className="absolute left-0 inline-flex items-center justify-center size-8 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
          )}

          <div className="flex items-center gap-1">
            <select
              value={monthData.month}
              onChange={handleMonthSelect}
              className={cn("appearance-none bg-transparent font-semibold text-zinc-900 hover:text-zinc-600 transition-colors cursor-pointer outline-none text-center", s.headerFont)}
            >
              {monthNames.map((name, i) => (
                <option key={i} value={i}>{name}</option>
              ))}
            </select>
            <select
              value={monthData.year}
              onChange={handleYearSelect}
              className={cn("appearance-none bg-transparent font-semibold text-zinc-900 hover:text-zinc-600 transition-colors cursor-pointer outline-none text-center", s.headerFont)}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {isLast && (
            <button
              type="button"
              onClick={goToNextMonth}
              className="absolute right-0 inline-flex items-center justify-center size-8 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          )}
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {weekDays.map((day, i) => (
            <div key={i} className={cn("flex items-center justify-center text-zinc-400 font-medium", s.cell, s.dayFont)}>
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {days.map((date, i) => {
            if (!date) return <div key={i} className={s.cell} />;

            const isCurrentMonth = isSameMonth(date, new Date(monthData.year, monthData.month));
            const isToday = isSameDay(date, today);
            const disabled = isDisabledDate(date);
            const sel = isSelectedDate(date);
            const inRange = isInSelectedRange(date);
            const rangeStart = isRangeStartDay(date);
            const rangeEnd = isRangeEndDay(date);

            if (!showOutsideDays && !isCurrentMonth) {
              return <div key={i} className={s.cell} />;
            }

            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => handleDayClick(date)}
                className={cn(
                  "inline-flex items-center justify-center rounded-lg transition-colors cursor-pointer",
                  s.cell,
                  s.font,
                  !isCurrentMonth && "text-zinc-300",
                  isCurrentMonth && !sel && !inRange && !rangeStart && !rangeEnd && "text-zinc-700 hover:bg-zinc-100",
                  isToday && !sel && !rangeStart && !rangeEnd && "font-bold text-zinc-900",
                  sel && "bg-zinc-900 text-white hover:bg-zinc-800",
                  inRange && !rangeStart && !rangeEnd && "bg-zinc-100 text-zinc-900 rounded-none",
                  rangeStart && "bg-zinc-900 text-white rounded-r-none",
                  rangeEnd && "bg-zinc-900 text-white rounded-l-none",
                  disabled && "opacity-30 cursor-not-allowed hover:bg-transparent",
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      "inline-flex bg-white border border-zinc-200 rounded-lg flex-wrap",
      numberOfMonths > 1 ? "flex-row gap-4" : "flex-col",
      s.padding,
      className,
    )}>
      {months.map((m, i) => renderMonth(m, i))}
    </div>
  );
}

Calendar.displayName = "Calendar";
