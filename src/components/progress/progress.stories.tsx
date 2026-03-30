import { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress, type ProgressProps } from "./progress";
import { Button } from "../button";

const ALL_COLORS = ["default", "primary", "danger", "success", "warning", "info"] as const;

const meta: Meta<typeof Progress> = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A progress bar component with 6 colors, 3 sizes, 3 shapes, striped and animated variants, label and value display.",
      },
    },
  },
  args: {
    value: 60,
    max: 100,
    size: "sm",
    color: "primary",
    variant: "default",
    shape: "pill",
    showValue: false,
    animated: false,
  },
  argTypes: {
    value: { control: { type: "number", min: 0, max: 100 } },
    size: { control: "select", options: ["xs", "sm", "md"] },
    color: { control: "select", options: [...ALL_COLORS] },
    variant: { control: "select", options: ["default", "striped"] },
    shape: { control: "select", options: ["square", "rounded", "pill"] },
    showValue: { control: "boolean" },
    animated: { control: "boolean" },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {};

export const Colors: Story = {
  render: (args: ProgressProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
      {ALL_COLORS.map((c) => (
        <Progress {...args} key={c} color={c} value={65} label={c.charAt(0).toUpperCase() + c.slice(1)} showValue />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args: ProgressProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
      {(["xs", "sm", "md"] as const).map((size) => (
        <Progress {...args} key={size} size={size} value={70} label={size} showValue />
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: (args: ProgressProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
      {(["square", "rounded", "pill"] as const).map((shape) => (
        <Progress {...args} key={shape} shape={shape} value={55} label={shape} />
      ))}
    </div>
  ),
};

export const Striped: Story = {
  args: { variant: "striped", value: 75, label: "Uploading...", showValue: true },
};

export const Animated: Story = {
  args: { variant: "striped", animated: true, value: 80, label: "Processing...", showValue: true },
};

export const WithLabel: Story = {
  render: (args: ProgressProps) => (
    <div style={{ maxWidth: 400 }}>
      <Progress {...args} value={42} label="Storage used" showValue />
    </div>
  ),
};

export const LiveProgress: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    const [running, setRunning] = useState(false);

    useEffect(() => {
      if (!running) return;
      if (value >= 100) { setRunning(false); return; }
      const timer = setTimeout(() => setValue((v) => Math.min(100, v + 2)), 100);
      return () => clearTimeout(timer);
    }, [value, running]);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
        <Progress value={value} color={value >= 100 ? "success" : "primary"} label={value >= 100 ? "Complete!" : "Downloading..."} showValue />
        <div style={{ display: "flex", gap: 8 }}>
          <Button size="xs" color="primary" disabled={running} onClick={() => { setValue(0); setRunning(true); }}>Start</Button>
          <Button size="xs" variant="outline" onClick={() => { setValue(0); setRunning(false); }}>Reset</Button>
        </div>
      </div>
    );
  },
};
