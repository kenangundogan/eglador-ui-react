import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { AreaChart, type AreaChartProps } from "./chart";

const monthly = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const meta: Meta<AreaChartProps> = {
  title: "Components/Chart/AreaChart",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Area chart with gradient fill for trend visualization. Supports single/multi series, stacked areas, step/curve interpolation, and dashed strokes.",
      },
    },
  },
  args: {
    data: monthly,
    series: [{ dataKey: "desktop", name: "Desktop" }],
    xAxis: { dataKey: "month" },
    height: 300,
    dot: false,
    grid: true,
    legend: false,
    tooltip: true,
    loading: false,
    animated: true,
  },
  argTypes: {
    height: { control: { type: "range", min: 150, max: 500, step: 10 } },
    dot: { control: "boolean" },
    grid: { control: "boolean" },
    legend: { control: "boolean" },
    tooltip: { control: "boolean" },
    loading: { control: "boolean" },
    animated: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<AreaChartProps>;


// ── Default ─────────────────────────────────

export const Default: Story = {
  render: (args) => <AreaChart {...args} />,
};

// ── Linear ──────────────────────────────────

export const Linear: Story = {
  args: {
    series: [
      { dataKey: "desktop", name: "Desktop", interpolation: "linear" },
      { dataKey: "mobile", name: "Mobile", interpolation: "linear" },
    ],
    legend: true,
  },
  render: (args) => <AreaChart {...args} />,
};

// ── Step ────────────────────────────────────

export const Step: Story = {
  args: {
    series: [
      { dataKey: "desktop", name: "Desktop", interpolation: "step" },
      { dataKey: "mobile", name: "Mobile", interpolation: "step" },
    ],
    legend: true,
  },
  render: (args) => <AreaChart {...args} />,
};

// ── Legend ───────────────────────────────────

export const WithLegend: Story = {
  args: {
    series: [
      { dataKey: "desktop", name: "Desktop" },
      { dataKey: "mobile", name: "Mobile" },
    ],
    legend: true,
  },
  render: (args) => <AreaChart {...args} />,
};

// ── Stacked ─────────────────────────────────

export const Stacked: Story = {
  args: {
    series: [
      { dataKey: "desktop", name: "Desktop", stackId: "a" },
      { dataKey: "mobile", name: "Mobile", stackId: "a" },
    ],
    legend: true,
  },
  render: (args) => <AreaChart {...args} />,
};

// ── Stacked Expanded ────────────────────────

const expandedData = monthly.map((d) => {
  const total = d.desktop + d.mobile;
  return {
    month: d.month,
    desktop: Math.round((d.desktop / total) * 100),
    mobile: Math.round((d.mobile / total) * 100),
  };
});

export const StackedExpanded: Story = {
  args: {
    data: expandedData,
    series: [
      { dataKey: "desktop", name: "Desktop", stackId: "a" },
      { dataKey: "mobile", name: "Mobile", stackId: "a" },
    ],
    yAxis: { tickFormatter: (v: number) => `${v}%`, domain: [0, 100] },
    legend: true,
  },
  render: (args) => <AreaChart {...args} />,
};

// ── Gradient ────────────────────────────────

export const Gradient: Story = {
  args: {
    series: [
      { dataKey: "desktop", name: "Desktop", color: "#1e40af" },
      { dataKey: "mobile", name: "Mobile", color: "#38bdf8" },
    ],
    legend: true,
  },
  render: (args) => <AreaChart {...args} />,
};

// ── Custom Color ────────────────────────────────

export const CustomColor: Story = {
  args: {
    series: [
      { dataKey: "desktop", name: "Desktop", color: "red" },
      { dataKey: "mobile", name: "Mobile", color: "green" },
    ],
    legend: true,
  },
  render: (args) => <AreaChart {...args} />,
};

// ── With Axes Labels ────────────────────────

export const Axes: Story = {
  args: {
    xAxis: { dataKey: "month", label: "Month" },
    yAxis: { label: "Visitors" },
  },
  render: (args) => <AreaChart {...args} />,
};

// ── With Dots ───────────────────────────────

export const WithDots: Story = {
  args: {
    series: [
      { dataKey: "desktop", name: "Desktop" },
      { dataKey: "mobile", name: "Mobile" },
    ],
    dot: true,
    legend: true,
  },
  render: (args) => <AreaChart {...args} />,
};

// ── Loading ─────────────────────────────────

export const Loading: Story = {
  args: { data: [], loading: true },
  render: (args) => <AreaChart {...args} />,
};

// ── Empty ───────────────────────────────────

export const Empty: Story = {
  args: { data: [], emptyMessage: "No trend data available" },
  render: (args) => <AreaChart {...args} />,
};
