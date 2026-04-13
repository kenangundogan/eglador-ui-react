import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadialChart, type RadialChartProps } from "./chart";

const progressData = [
  { name: "React", value: 90 },
  { name: "TypeScript", value: 85 },
  { name: "Node.js", value: 70 },
  { name: "CSS", value: 80 },
  { name: "Testing", value: 65 },
];

const storageData = [
  { name: "Documents", value: 45 },
  { name: "Photos", value: 30 },
  { name: "Videos", value: 15 },
  { name: "Music", value: 10 },
];

const meta: Meta<RadialChartProps> = {
  title: "Components/Chart/RadialChart",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Radial bar chart for progress-style data. Each bar wraps around the center. Supports labels, center text, background tracks, and custom angle ranges.",
      },
    },
  },
  args: {
    data: progressData,
    series: { dataKey: "value", nameKey: "name" },
    height: 300,
    startAngle: 90,
    endAngle: -270,
    tooltip: true,
    legend: false,
    loading: false,
    animated: true,
  },
  argTypes: {
    height: { control: { type: "range", min: 150, max: 500, step: 10 } },
    startAngle: { control: { type: "range", min: 0, max: 360, step: 10 } },
    endAngle: { control: { type: "range", min: -360, max: 360, step: 10 } },
    tooltip: { control: "boolean" },
    legend: { control: "boolean" },
    loading: { control: "boolean" },
    animated: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<RadialChartProps>;

// ── Default ─────────────────────────────────

export const Default: Story = {
  render: (args) => <RadialChart {...args} />,
};

// ── With Label ──────────────────────────────

export const WithLabel: Story = {
  args: {
    series: { dataKey: "value", nameKey: "name", label: true },
  },
  render: (args) => <RadialChart {...args} />,
};

// ── With Center Text ────────────────────────

export const WithText: Story = {
  args: {
    data: storageData,
    series: {
      dataKey: "value",
      nameKey: "name",
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#ec4899"],
    },
    centerLabel: (
      <div className="text-center">
        <p className="text-sm font-bold" style={{ color: "var(--color-zinc-800)" }}>
          100 GB
        </p>
        <p className="text-xs" style={{ color: "var(--color-zinc-400)" }}>
          Total Storage
        </p>
      </div>
    ),
    legend: true,
  },
  render: (args) => <RadialChart {...args} />,
};

// ── Custom Shape (half circle) ──────────────

export const Shape: Story = {
  args: {
    series: { dataKey: "value", nameKey: "name", label: true },
    startAngle: 180,
    endAngle: 0,
    height: 250,
  },
  render: (args) => <RadialChart {...args} />,
};

// ── Stacked ─────────────────────────────────

export const Stacked: Story = {
  args: {
    series: {
      dataKey: "value",
      nameKey: "name",
      innerRadius: "20%",
      outerRadius: "95%",
    },
    legend: true,
  },
  render: (args) => <RadialChart {...args} />,
};

// ── With Legend ──────────────────────────────

export const WithLegend: Story = {
  args: {
    data: storageData,
    legend: true,
  },
  render: (args) => <RadialChart {...args} />,
};

// ── Custom Colors ───────────────────────────

export const CustomColors: Story = {
  args: {
    series: {
      dataKey: "value",
      nameKey: "name",
      colors: ["#8b5cf6", "#06b6d4", "#f97316", "#ec4899", "#14b8a6"],
    },
  },
  render: (args) => <RadialChart {...args} />,
};

// ── Loading ─────────────────────────────────

export const Loading: Story = {
  args: { data: [], loading: true },
  render: (args) => <RadialChart {...args} />,
};

// ── Empty ───────────────────────────────────

export const Empty: Story = {
  args: { data: [], emptyMessage: "No progress data" },
  render: (args) => <RadialChart {...args} />,
};
