import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { DonutChart, type DonutChartProps } from "./chart";

const browserData = [
  { name: "Chrome", value: 63 },
  { name: "Safari", value: 19 },
  { name: "Firefox", value: 9 },
  { name: "Edge", value: 5 },
  { name: "Other", value: 4 },
];

const statusData = [
  { name: "Completed", value: 72 },
  { name: "In Progress", value: 18 },
  { name: "Pending", value: 10 },
];

const meta: Meta<DonutChartProps> = {
  title: "Components/Chart/DonutChart",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Donut chart extending PieChart with an inner hole. Supports a center label overlay for totals or key metrics, active segment highlighting, and customizable radii.",
      },
    },
  },
  args: {
    data: browserData,
    series: { dataKey: "value", nameKey: "name" },
    height: 300,
    tooltip: true,
    legend: false,
    loading: false,
  },
  argTypes: {
    height: { control: { type: "range", min: 150, max: 500, step: 10 } },
    tooltip: { control: "boolean" },
    legend: { control: "boolean" },
    loading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<DonutChartProps>;

// ── Default ─────────────────────────────────

export const Default: Story = {
  args: { legend: true },
  render: (args) => <DonutChart {...args} />,
};

// ── Donut Active ────────────────────────────

function DonutActiveDemo() {
  const [active, setActive] = React.useState<string | null>("Chrome");
  const activeItem = browserData.find((d) => d.name === active);
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {browserData.map((d) => (
          <button
            key={d.name}
            onClick={() => setActive(d.name)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${active === d.name
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              }`}
          >
            {d.name}
          </button>
        ))}
      </div>
      <DonutChart
        data={browserData}
        series={{ dataKey: "value", nameKey: "name" }}
        centerLabel={
          activeItem ? (
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "var(--color-zinc-800)" }}>
                {activeItem.value}%
              </p>
              <p className="text-xs" style={{ color: "var(--color-zinc-400)" }}>
                {activeItem.name}
              </p>
            </div>
          ) : undefined
        }
      />
    </div>
  );
}

export const DonutActive: Story = {
  render: () => <DonutActiveDemo />,
};

// ── Donut with Text ─────────────────────────

export const DonutWithText: Story = {
  args: {
    data: statusData,
    series: {
      dataKey: "value",
      nameKey: "name",
    },
    centerLabel: (
      <div className="text-center">
        <p className="text-3xl font-bold" style={{ color: "var(--color-zinc-800)" }}>
          72%
        </p>
        <p className="text-xs" style={{ color: "var(--color-zinc-400)" }}>
          Completed
        </p>
      </div>
    ),
    legend: true,
  },
  render: (args) => <DonutChart {...args} />,
};

// ── Custom Radii ────────────────────────────

export const CustomRadii: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-6">
      {([
        { inner: "30%", outer: "70%" },
        { inner: "55%", outer: "75%" },
        { inner: "65%", outer: "90%" },
      ] as const).map(({ inner, outer }) => (
        <div key={`${inner}-${outer}`}>
          <p className="mb-2 text-xs font-medium text-zinc-500">
            {inner} / {outer}
          </p>
          <DonutChart
            {...args}
            series={{ dataKey: "value", nameKey: "name", innerRadius: inner, outerRadius: outer }}
            height={220}
          />
        </div>
      ))}
    </div>
  ),
};

// ── Custom Colors ───────────────────────────

export const CustomColors: Story = {
  args: {
    series: {
      dataKey: "value",
      nameKey: "name",
      colors: ["#8b5cf6", "#06b6d4", "#f97316", "#ec4899", "#14b8a6"],
    },
    centerLabel: (
      <div className="text-center">
        <p className="text-2xl font-bold" style={{ color: "var(--color-zinc-800)" }}>
          100%
        </p>
        <p className="text-xs" style={{ color: "var(--color-zinc-400)" }}>
          Total
        </p>
      </div>
    ),
    legend: true,
  },
  render: (args) => <DonutChart {...args} />,
};

// ── Loading ─────────────────────────────────

export const Loading: Story = {
  args: { data: [], loading: true },
  render: (args) => <DonutChart {...args} />,
};

// ── Empty ───────────────────────────────────

export const Empty: Story = {
  args: { data: [], emptyMessage: "No data" },
  render: (args) => <DonutChart {...args} />,
};
