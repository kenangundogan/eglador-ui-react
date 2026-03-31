import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateTimePicker, type DateTimePickerProps } from "./date-time-picker";

const meta: Meta<typeof DateTimePicker> = {
  title: "Components/DateTimePicker",
  component: DateTimePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A date and time picker that combines Calendar with hour/minute spinners. Supports 24-hour and 12-hour formats, step configuration, min/max dates, and clearable state.",
      },
    },
  },
  args: {
    disabled: false,
    clearable: true,
    use24Hour: true,
    state: "idle",
    weekStartsOn: 1,
    hourStep: 1,
    minuteStep: 1,
  },
  argTypes: {
    state: { control: "select", options: ["idle", "error", "success"] },
    disabled: { control: "boolean" },
    clearable: { control: "boolean" },
    use24Hour: { control: "boolean" },
    hourStep: { control: { type: "number", min: 1, max: 6 } },
    minuteStep: { control: { type: "number", min: 1, max: 30 } },
    weekStartsOn: { control: "select", options: [0, 1] },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: DateTimePickerProps) => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ width: 300 }}>
        <DateTimePicker {...args} value={date} onChange={setDate} label="Date & Time" />
      </div>
    );
  },
};

// ── Preselected ──────────────────────────────

export const Preselected: Story = {
  render: (args: DateTimePickerProps) => {
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <div style={{ width: 300 }}>
        <DateTimePicker {...args} value={date} onChange={setDate} label="Event Start" />
      </div>
    );
  },
};

// ── 15-Minute Steps ──────────────────────────

export const FifteenMinuteSteps: Story = {
  render: (args: DateTimePickerProps) => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 300 }}>
        <DateTimePicker {...args} value={date} onChange={setDate} label="Meeting Time" minuteStep={15} />
        <span className="text-xs text-zinc-400">Minutes step in 15-minute intervals.</span>
      </div>
    );
  },
};

// ── With Min Date ────────────────────────────

export const WithMinDate: Story = {
  render: (args: DateTimePickerProps) => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 300 }}>
        <DateTimePicker {...args} value={date} onChange={setDate} label="Scheduled At" minDate={new Date()} />
        <span className="text-xs text-zinc-400">Only future dates allowed.</span>
      </div>
    );
  },
};

// ── Error State ──────────────────────────────

export const ErrorState: Story = {
  render: (args: DateTimePickerProps) => (
    <div style={{ width: 300 }}>
      <DateTimePicker {...args} state="error" errorMessage="Please select a future date and time." label="Deadline" />
    </div>
  ),
};

// ── Disabled ─────────────────────────────────

export const Disabled: Story = {
  render: (args: DateTimePickerProps) => (
    <div style={{ width: 300 }}>
      <DateTimePicker {...args} disabled label="Locked" value={new Date()} />
    </div>
  ),
};

// ── Appointment Scheduler ────────────────────

export const AppointmentScheduler: Story = {
  render: (args: DateTimePickerProps) => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Schedule Appointment</h3>
          <p className="text-sm text-zinc-500 mt-1">Pick a date and time for your appointment.</p>
        </div>
        <DateTimePicker
          {...args}
          value={date}
          onChange={setDate}
          label="Appointment Date & Time"
          minDate={new Date()}
          minuteStep={15}
          disabledDaysOfWeek={[0, 6]}
        />
        {date && (
          <div className="bg-zinc-50 rounded-lg p-3 text-sm text-zinc-600">
            Confirmed: <span className="font-medium text-zinc-900">{date.toLocaleString()}</span>
          </div>
        )}
      </div>
    );
  },
};
