import type { Meta, StoryObj } from "@storybook/react-vite";
import { PieChart, type PieChartProps } from "./chart";

const browserData = [
  { name: "Chrome", value: 63 },
  { name: "Safari", value: 19 },
  { name: "Firefox", value: 9 },
  { name: "Edge", value: 5 },
  { name: "Other", value: 4 },
];

const meta: Meta<PieChartProps> = {
  title: "Components/Chart/PieChart",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Pie chart for part-to-whole relationships. Supports percentage labels, custom colors, tooltip, legend, and various sizes.",
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
    animated: true,
  },
  argTypes: {
    height: { control: { type: "range", min: 150, max: 500, step: 10 } },
    tooltip: { control: "boolean" },
    legend: { control: "boolean" },
    loading: { control: "boolean" },
    animated: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<PieChartProps>;

// ── Default ─────────────────────────────────

export const Default: Story = {
  render: (args) => <PieChart {...args} />,
};

// ── With Labels ─────────────────────────────

export const WithLabel: Story = {
  args: { series: { dataKey: "value", nameKey: "name", label: true } },
  render: (args) => <PieChart {...args} />,
};

// ── Custom Label ────────────────────────────

export const CustomLabel: Story = {
  args: {
    series: { dataKey: "value", nameKey: "name", label: true },
    tooltip: { formatter: (v: number, n: string) => [`${v}%`, n] },
  },
  render: (args) => <PieChart {...args} />,
};

// ── Label List ──────────────────────────────

export const LabelList: Story = {
  args: {
    series: { dataKey: "value", nameKey: "name", label: true, outerRadius: "80%" },
    height: 350,
  },
  render: (args) => <PieChart {...args} />,
};

// ── With Legend ──────────────────────────────

export const WithLegend: Story = {
  args: { legend: true },
  render: (args) => <PieChart {...args} />,
};

// ── Custom Colors ───────────────────────────

export const CustomColors: Story = {
  args: {
    series: {
      dataKey: "value",
      nameKey: "name",
      colors: ["#0ea5e9", "#a855f7", "#f97316", "#22c55e", "#ef4444"],
    },
    legend: true,
  },
  render: (args) => <PieChart {...args} />,
};

// ── Sizes ───────────────────────────────────

export const Sizes: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-6">
      {(["50%", "70%", "90%"] as const).map((radius) => (
        <div key={radius}>
          <p className="mb-2 text-xs font-medium text-zinc-500">outerRadius: {radius}</p>
          <PieChart
            {...args}
            series={{ dataKey: "value", nameKey: "name", outerRadius: radius }}
            height={220}
          />
        </div>
      ))}
    </div>
  ),
};

// ── Stacked ─────────────────────────────────

export const Stacked: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <p className="mb-2 text-xs font-medium text-zinc-500">Inner Ring</p>
        <PieChart
          {...args}
          data={browserData.slice(0, 3)}
          series={{ dataKey: "value", nameKey: "name", outerRadius: "50%" }}
          legend
          height={250}
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-zinc-500">Outer Ring</p>
        <PieChart
          {...args}
          series={{ dataKey: "value", nameKey: "name", outerRadius: "80%" }}
          legend
          height={250}
        />
      </div>
    </div>
  ),
};

// ── Without Tooltip ─────────────────────────

export const WithoutTooltip: Story = {
  args: {
    series: { dataKey: "value", nameKey: "name", label: true },
    tooltip: false,
    legend: true,
  },
  render: (args) => <PieChart {...args} />,
};

// ── Loading ─────────────────────────────────

export const Loading: Story = {
  args: { data: [], loading: true },
  render: (args) => <PieChart {...args} />,
};

// ── Empty ───────────────────────────────────

export const Empty: Story = {
  args: { data: [], emptyMessage: "No distribution data" },
  render: (args) => <PieChart {...args} />,
};
