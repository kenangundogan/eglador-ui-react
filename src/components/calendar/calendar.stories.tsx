import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, type CalendarProps, type DateRange } from "./calendar";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A date picker calendar with single, range, and multiple selection modes. Supports min/max dates, disabled dates/days, outside days visibility, locale, week start day, and two sizes.",
      },
    },
  },
  args: {
    mode: "single",
    size: "md",
    showOutsideDays: true,
    weekStartsOn: 1,
  },
  argTypes: {
    mode: { control: "select", options: ["single", "range", "multiple"] },
    size: { control: "select", options: ["sm", "md"] },
    weekStartsOn: { control: "select", options: [0, 1] },
    showOutsideDays: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

// ── Single Selection ─────────────────────────

export const Single: Story = {
  render: (args: CalendarProps) => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="flex flex-col gap-3">
        <Calendar {...args} selected={date} onSelect={(d) => setDate(d as Date)} />
        <span className="text-xs text-zinc-400">
          Selected: {date ? date.toLocaleDateString() : "none"}
        </span>
      </div>
    );
  },
};

// ── Range Selection ──────────────────────────

export const Range: Story = {
  render: (args: CalendarProps) => {
    const [range, setRange] = useState<DateRange>({ from: null, to: null });
    return (
      <div className="flex flex-col gap-3">
        <Calendar {...args} mode="range" selected={range} onSelect={(r) => setRange(r as DateRange)} />
        <span className="text-xs text-zinc-400">
          From: {range.from?.toLocaleDateString() || "—"} → To: {range.to?.toLocaleDateString() || "—"}
        </span>
      </div>
    );
  },
};

// ── Range with Two Months ────────────────────

export const RangeTwoMonths: Story = {
  render: (args: CalendarProps) => {
    const [range, setRange] = useState<DateRange>({ from: null, to: null });
    return (
      <div className="flex flex-col gap-3">
        <Calendar {...args} mode="range" numberOfMonths={2} selected={range} onSelect={(r) => setRange(r as DateRange)} />
        <span className="text-xs text-zinc-400">
          From: {range.from?.toLocaleDateString() || "—"} → To: {range.to?.toLocaleDateString() || "—"}
        </span>
      </div>
    );
  },
};

// ── Three Months ─────────────────────────────

export const ThreeMonths: Story = {
  render: (args: CalendarProps) => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <Calendar {...args} numberOfMonths={3} selected={date} onSelect={(d) => setDate(d as Date)} />
    );
  },
};

// ── Multiple Selection ───────────────────────

export const Multiple: Story = {
  render: (args: CalendarProps) => {
    const [dates, setDates] = useState<Date[]>([]);
    return (
      <div className="flex flex-col gap-3">
        <Calendar {...args} mode="multiple" selected={dates} onSelect={(d) => setDates(d as Date[])} />
        <span className="text-xs text-zinc-400">
          Selected: {dates.length} date{dates.length !== 1 ? "s" : ""}
        </span>
      </div>
    );
  },
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4">
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">sm</span>
        <Calendar size="sm" />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">md</span>
        <Calendar size="md" />
      </div>
    </div>
  ),
};

// ── With Min/Max Dates ───────────────────────

export const MinMaxDates: Story = {
  render: (args: CalendarProps) => {
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5);
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
    const [date, setDate] = useState<Date | null>(null);

    return (
      <div className="flex flex-col gap-3">
        <Calendar {...args} selected={date} onSelect={(d) => setDate(d as Date)} minDate={minDate} maxDate={maxDate} />
        <span className="text-xs text-zinc-400">
          Only dates between {minDate.toLocaleDateString()} and {maxDate.toLocaleDateString()} are selectable.
        </span>
      </div>
    );
  },
};

// ── Disabled Weekends ────────────────────────

export const DisabledWeekends: Story = {
  render: (args: CalendarProps) => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="flex flex-col gap-3">
        <Calendar {...args} selected={date} onSelect={(d) => setDate(d as Date)} disabledDaysOfWeek={[0, 6]} />
        <span className="text-xs text-zinc-400">Weekends are disabled.</span>
      </div>
    );
  },
};

// ── Disabled Specific Dates ──────────────────

export const DisabledDates: Story = {
  render: (args: CalendarProps) => {
    const today = new Date();
    const disabled = [
      new Date(today.getFullYear(), today.getMonth(), 10),
      new Date(today.getFullYear(), today.getMonth(), 15),
      new Date(today.getFullYear(), today.getMonth(), 20),
      new Date(today.getFullYear(), today.getMonth(), 25),
    ];
    const [date, setDate] = useState<Date | null>(null);

    return (
      <div className="flex flex-col gap-3">
        <Calendar {...args} selected={date} onSelect={(d) => setDate(d as Date)} disabledDates={disabled} />
        <span className="text-xs text-zinc-400">10th, 15th, 20th, 25th are disabled.</span>
      </div>
    );
  },
};

// ── Week Starts on Sunday ────────────────────

export const WeekStartsSunday: Story = {
  render: (args: CalendarProps) => (
    <Calendar {...args} weekStartsOn={0} />
  ),
};

// ── Hide Outside Days ────────────────────────

export const HideOutsideDays: Story = {
  render: (args: CalendarProps) => (
    <Calendar {...args} showOutsideDays={false} />
  ),
};

// ── Preselected Date ─────────────────────────

export const Preselected: Story = {
  render: (args: CalendarProps) => {
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <Calendar {...args} selected={date} onSelect={(d) => setDate(d as Date)} />
    );
  },
};

// ── Booking Example ──────────────────────────

export const BookingExample: Story = {
  render: (args: CalendarProps) => {
    const today = new Date();
    const [range, setRange] = useState<DateRange>({ from: null, to: null });
    const nights = range.from && range.to ? Math.round((range.to.getTime() - range.from.getTime()) / 86400000) : 0;

    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-zinc-900">Select dates</h3>
        <Calendar
          {...args}
          mode="range"
          numberOfMonths={2}
          selected={range}
          onSelect={(r) => setRange(r as DateRange)}
          minDate={today}
          disabledDaysOfWeek={[]}
        />
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Check-in: {range.from?.toLocaleDateString() || "—"}</span>
          <span>Check-out: {range.to?.toLocaleDateString() || "—"}</span>
        </div>
        {nights > 0 && (
          <div className="text-sm font-medium text-zinc-900 text-center">
            {nights} night{nights !== 1 ? "s" : ""} · ${nights * 89}/total
          </div>
        )}
      </div>
    );
  },
};
