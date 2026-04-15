import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { BarChart, type BarChartProps } from "./chart";

const monthly = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const departmentData = [
  { dept: "Engineering", headcount: 48 },
  { dept: "Marketing", headcount: 22 },
  { dept: "Sales", headcount: 35 },
  { dept: "Design", headcount: 12 },
  { dept: "Operations", headcount: 18 },
];

const negativeData = [
  { month: "Jan", revenue: 4200, growth: 12 },
  { month: "Feb", revenue: 5800, growth: 38 },
  { month: "Mar", revenue: 3200, growth: -18 },
  { month: "Apr", revenue: 7100, growth: 22 },
  { month: "May", revenue: 4800, growth: -15 },
  { month: "Jun", revenue: 8200, growth: 71 },
];

const meta: Meta<BarChartProps> = {
  title: "Components/Chart/BarChart",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Bar chart for categorical comparisons. Supports vertical/horizontal layout, grouped/stacked bars, rounded corners, negative values, and custom bar sizes.",
      },
    },
  },
  args: {
    data: monthly,
    series: [{ dataKey: "desktop", name: "Desktop" }],
    xAxis: { dataKey: "month" },
    height: 300,
    layout: "horizontal",
    rounded: false,
    barSize: 32,
    grid: true,
    legend: false,
    tooltip: true,
    loading: false,
    animated: true,
  },
  argTypes: {
    height: { control: { type: "range", min: 150, max: 500, step: 10 } },
    layout: { control: "radio", options: ["horizontal", "vertical"] },
    rounded: { control: "boolean" },
    barSize: { control: { type: "range", min: 8, max: 80, step: 4 } },
    grid: { control: "boolean" },
    legend: { control: "boolean" },
    tooltip: { control: "boolean" },
    loading: { control: "boolean" },
    animated: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<BarChartProps>;

// ── Interactive ─────────────────────────────

function InteractiveDemo() {
  const [activeKey, setActiveKey] = React.useState<"desktop" | "mobile">("desktop");
  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["desktop", "mobile"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setActiveKey(key)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              activeKey === key
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>
      <BarChart
        data={monthly}
        series={[
          {
            dataKey: activeKey,
            name: activeKey.charAt(0).toUpperCase() + activeKey.slice(1),
            color: activeKey === "desktop" ? "#3b82f6" : "#10b981",
          },
        ]}
        xAxis={{ dataKey: "month" }}
        rounded
        height={300}
      />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

// ── Default ─────────────────────────────────

export const Default: Story = {
  render: (args) => <BarChart {...args} />,
};

// ── Horizontal ──────────────────────────────

export const Horizontal: Story = {
  args: {
    data: departmentData,
    series: [{ dataKey: "headcount", name: "Headcount" }],
    xAxis: { dataKey: "dept" },
    layout: "vertical",
    rounded: true,
  },
  render: (args) => <BarChart {...args} />,
};

// ── Multiple ────────────────────────────────

export const Multiple: Story = {
  args: {
    series: [
      { dataKey: "desktop", name: "Desktop" },
      { dataKey: "mobile", name: "Mobile" },
    ],
    legend: true,
  },
  render: (args) => <BarChart {...args} />,
};

// ── Stacked + Legend ─────────────────────────

export const StackedWithLegend: Story = {
  args: {
    series: [
      { dataKey: "desktop", name: "Desktop", stackId: "a" },
      { dataKey: "mobile", name: "Mobile", stackId: "a" },
    ],
    rounded: true,
    legend: true,
  },
  render: (args) => <BarChart {...args} />,
};

// ── Rounded ─────────────────────────────────

export const Rounded: Story = {
  args: { rounded: true },
  render: (args) => <BarChart {...args} />,
};

// ── Custom Colors ───────────────────────────

export const CustomColors: Story = {
  args: {
    series: [
      { dataKey: "desktop", name: "Desktop", color: "#8b5cf6" },
      { dataKey: "mobile", name: "Mobile", color: "#f97316" },
    ],
    rounded: true,
    legend: true,
  },
  render: (args) => <BarChart {...args} />,
};

// ── Negative Values ─────────────────────────

export const Negative: Story = {
  args: {
    data: negativeData,
    series: [{ dataKey: "growth", name: "Growth %" }],
    yAxis: { tickFormatter: (v: number) => `${v}%` },
    rounded: true,
  },
  render: (args) => <BarChart {...args} />,
};

// ── Bar Sizes ───────────────────────────────

export const BarSizes: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-6">
      {[16, 32, 48].map((size) => (
        <div key={size}>
          <p className="mb-2 text-xs font-medium text-zinc-500">barSize: {size}</p>
          <BarChart {...args} barSize={size} height={200} />
        </div>
      ))}
    </div>
  ),
};

// ── Loading ─────────────────────────────────

export const Loading: Story = {
  args: { data: [], loading: true },
  render: (args) => <BarChart {...args} />,
};

// ── Empty ───────────────────────────────────

export const Empty: Story = {
  args: { data: [], emptyMessage: "No data to display" },
  render: (args) => <BarChart {...args} />,
};
