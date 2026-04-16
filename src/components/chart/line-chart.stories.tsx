import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { LineChart, type LineChartProps } from "./chart";

const monthly = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const meta: Meta<LineChartProps> = {
  title: "Components/Chart/LineChart",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Line chart for time-series and trend data. Supports single/multi series, smooth/step/linear interpolation, dashed lines, dot markers, and dual Y-axis.",
      },
    },
  },
  args: {
    data: monthly,
    series: [{ dataKey: "desktop", name: "Desktop" }],
    xAxis: { dataKey: "month" },
    height: 300,
    dot: false,
    activeDot: true,
    grid: true,
    legend: false,
    tooltip: true,
    loading: false,
    animated: true,
  },
  argTypes: {
    height: { control: { type: "range", min: 150, max: 500, step: 10 } },
    dot: { control: "boolean" },
    activeDot: { control: "boolean" },
    grid: { control: "boolean" },
    legend: { control: "boolean" },
    tooltip: { control: "boolean" },
    loading: { control: "boolean" },
    animated: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<LineChartProps>;

// ── Default ─────────────────────────────────

export const Default: Story = {
  render: (args) => <LineChart {...args} />,
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
  render: (args) => <LineChart {...args} />,
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
  render: (args) => <LineChart {...args} />,
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
  render: (args) => <LineChart {...args} />,
};

// ── Dots ────────────────────────────────────

export const Dots: Story = {
  args: { dot: true },
  render: (args) => <LineChart {...args} />,
};

// ── Custom Dots ─────────────────────────────

export const CustomDots: Story = {
  args: {
    series: [
      { dataKey: "desktop", name: "Desktop" },
      { dataKey: "mobile", name: "Mobile" },
    ],
    dot: true,
    activeDot: true,
    legend: true,
  },
  render: (args) => <LineChart {...args} />,
};

// ── Dots Colors ─────────────────────────────

export const DotsColors: Story = {
  args: {
    series: [
      { dataKey: "desktop", name: "Desktop", color: "#8b5cf6" },
      { dataKey: "mobile", name: "Mobile", color: "#f97316" },
    ],
    dot: true,
    legend: true,
  },
  render: (args) => <LineChart {...args} />,
};

// ── Dashed ──────────────────────────────────

export const Dashed: Story = {
  args: {
    series: [
      { dataKey: "desktop", name: "Desktop" },
      { dataKey: "mobile", name: "Mobile", dashed: true },
    ],
    legend: true,
  },
  render: (args) => <LineChart {...args} />,
};

// ── No Grid ─────────────────────────────────

export const WithoutGrid: Story = {
  args: { grid: false },
  render: (args) => <LineChart {...args} />,
};

// ── Loading ─────────────────────────────────

export const Loading: Story = {
  args: { data: [], loading: true },
  render: (args) => <LineChart {...args} />,
};

// ── Empty ───────────────────────────────────

export const Empty: Story = {
  args: { data: [], emptyMessage: "No data available" },
  render: (args) => <LineChart {...args} />,
};
