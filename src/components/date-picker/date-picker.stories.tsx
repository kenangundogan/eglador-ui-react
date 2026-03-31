import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type DateRange } from "../calendar";
import { DatePicker, type DatePickerProps } from "./date-picker";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A date picker input that opens a Calendar in a Popover. Supports single and range modes, clearable, min/max dates, disabled states, and multi-month range view.",
      },
    },
  },
  args: {
    mode: "single",
    disabled: false,
    clearable: true,
    state: "idle",
    weekStartsOn: 1,
  },
  argTypes: {
    mode: { control: "select", options: ["single", "range"] },
    state: { control: "select", options: ["idle", "error", "success"] },
    disabled: { control: "boolean" },
    clearable: { control: "boolean" },
    weekStartsOn: { control: "select", options: [0, 1] },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

// ── Single ───────────────────────────────────

export const Single: Story = {
  render: (args: DatePickerProps) => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ width: 280 }}>
        <DatePicker {...args} value={date} onChange={(d) => setDate(d as Date)} label="Date" />
      </div>
    );
  },
};

// ── Range ────────────────────────────────────

export const Range: Story = {
  render: (args: DatePickerProps) => {
    const [range, setRange] = useState<DateRange>({ from: null, to: null });
    return (
      <div style={{ width: 320 }}>
        <DatePicker {...args} mode="range" value={range} onChange={(r) => setRange(r as DateRange)} label="Date Range" />
      </div>
    );
  },
};

// ── Preselected ──────────────────────────────

export const Preselected: Story = {
  render: (args: DatePickerProps) => {
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <div style={{ width: 280 }}>
        <DatePicker {...args} value={date} onChange={(d) => setDate(d as Date)} label="Birthday" />
      </div>
    );
  },
};

// ── With Min/Max ─────────────────────────────

export const WithMinMax: Story = {
  render: (args: DatePickerProps) => {
    const today = new Date();
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 280 }}>
        <DatePicker
          {...args}
          value={date}
          onChange={(d) => setDate(d as Date)}
          label="Appointment"
          minDate={today}
          maxDate={new Date(today.getFullYear(), today.getMonth() + 2, 0)}
        />
        <span className="text-xs text-zinc-400">Only future dates within 2 months.</span>
      </div>
    );
  },
};

// ── Disabled Weekends ────────────────────────

export const DisabledWeekends: Story = {
  render: (args: DatePickerProps) => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ width: 280 }}>
        <DatePicker {...args} value={date} onChange={(d) => setDate(d as Date)} label="Working Day" disabledDaysOfWeek={[0, 6]} />
      </div>
    );
  },
};

// ── Error State ──────────────────────────────

export const ErrorState: Story = {
  render: (args: DatePickerProps) => (
    <div style={{ width: 280 }}>
      <DatePicker {...args} state="error" errorMessage="Please select a valid date." label="Event Date" />
    </div>
  ),
};

// ── Success State ────────────────────────────

export const SuccessState: Story = {
  render: (args: DatePickerProps) => {
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <div style={{ width: 280 }}>
        <DatePicker {...args} value={date} onChange={(d) => setDate(d as Date)} state="success" successMessage="Date confirmed." label="Check-in" />
      </div>
    );
  },
};

// ── Disabled ─────────────────────────────────

export const Disabled: Story = {
  render: (args: DatePickerProps) => (
    <div style={{ width: 280 }}>
      <DatePicker {...args} disabled label="Locked Date" value={new Date()} />
    </div>
  ),
};

// ── Booking Flow ─────────────────────────────

export const BookingFlow: Story = {
  render: (args: DatePickerProps) => {
    const today = new Date();
    const [range, setRange] = useState<DateRange>({ from: null, to: null });
    const nights = range.from && range.to ? Math.round((range.to.getTime() - range.from.getTime()) / 86400000) : 0;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 360 }}>
        <DatePicker
          {...args}
          mode="range"
          value={range}
          onChange={(r) => setRange(r as DateRange)}
          label="Travel Dates"
          minDate={today}
          disabledDaysOfWeek={[]}
        />
        {nights > 0 && (
          <div className="text-sm text-zinc-600 bg-zinc-50 rounded-lg p-3">
            <span className="font-medium">{nights} night{nights !== 1 ? "s" : ""}</span> · Check-in: {range.from?.toLocaleDateString()} · Check-out: {range.to?.toLocaleDateString()}
          </div>
        )}
      </div>
    );
  },
};
