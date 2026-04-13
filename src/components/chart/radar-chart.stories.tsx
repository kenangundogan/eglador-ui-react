import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadarChart, type RadarChartProps } from "./chart";

const radarData = [
  { subject: "Performance", product: 80, competitor: 65 },
  { subject: "Reliability", product: 90, competitor: 75 },
  { subject: "Security", product: 70, competitor: 85 },
  { subject: "Usability", product: 85, competitor: 70 },
  { subject: "Scalability", product: 60, competitor: 80 },
  { subject: "Support", product: 75, competitor: 90 },
];

const skillData = [
  { subject: "React", level: 90 },
  { subject: "TypeScript", level: 85 },
  { subject: "Node.js", level: 70 },
  { subject: "CSS", level: 80 },
  { subject: "Testing", level: 65 },
  { subject: "DevOps", level: 50 },
];

const meta: Meta<RadarChartProps> = {
  title: "Components/Chart/RadarChart",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Radar (spider) chart for multi-dimensional comparisons. Supports single/multi series, fill/outline toggle, adjustable opacity, and various grid styles.",
      },
    },
  },
  args: {
    data: skillData,
    series: [{ dataKey: "level", name: "Skill Level" }],
    angleKey: "subject",
    outerRadius: "70%",
    height: 300,
    tooltip: true,
    legend: false,
    loading: false,
    animated: true,
  },
  argTypes: {
    height: { control: { type: "range", min: 150, max: 500, step: 10 } },
    outerRadius: { control: "select", options: ["50%", "60%", "70%", "80%"] },
    tooltip: { control: "boolean" },
    legend: { control: "boolean" },
    loading: { control: "boolean" },
    animated: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<RadarChartProps>;

// ── Default ─────────────────────────────────

export const Default: Story = {
  render: (args) => <RadarChart {...args} />,
};

// ── Dots ────────────────────────────────────

export const Dots: Story = {
  render: (args) => <RadarChart {...args} />,
};

// ── Lines Only ──────────────────────────────

export const LinesOnly: Story = {
  args: {
    data: radarData,
    series: [
      { dataKey: "product", name: "Our Product", fill: false },
      { dataKey: "competitor", name: "Competitor", fill: false },
    ],
    legend: true,
  },
  render: (args) => <RadarChart {...args} />,
};

// ── Custom Colors ───────────────────────────

export const CustomColors: Story = {
  args: {
    data: radarData,
    series: [
      { dataKey: "product", name: "Our Product", color: "#8b5cf6" },
      { dataKey: "competitor", name: "Competitor", color: "#f97316" },
    ],
    legend: true,
  },
  render: (args) => <RadarChart {...args} />,
};

// ── Grid Filled ─────────────────────────────

export const GridFilled: Story = {
  args: {
    series: [{ dataKey: "level", name: "Skill Level", fillOpacity: 0.4 }],
  },
  render: (args) => <RadarChart {...args} />,
};

// ── Grid Circle ─────────────────────────────

export const GridCircle: Story = {
  args: {
    data: radarData,
    series: [
      { dataKey: "product", name: "Our Product" },
      { dataKey: "competitor", name: "Competitor" },
    ],
    legend: true,
  },
  render: (args) => <RadarChart {...args} />,
};

// ── Grid Circle Filled ──────────────────────

export const GridCircleFilled: Story = {
  args: {
    data: radarData,
    series: [
      { dataKey: "product", name: "Our Product", fillOpacity: 0.35 },
      { dataKey: "competitor", name: "Competitor", fillOpacity: 0.35 },
    ],
    legend: true,
  },
  render: (args) => <RadarChart {...args} />,
};

// ── Grid Circle No Lines ────────────────────

export const GridCircleNoLines: Story = {
  args: {
    series: [{ dataKey: "level", name: "Skill Level", fill: false }],
  },
  render: (args) => <RadarChart {...args} />,
};

// ── Multiple ────────────────────────────────

export const Multiple: Story = {
  args: {
    data: radarData,
    series: [
      { dataKey: "product", name: "Our Product" },
      { dataKey: "competitor", name: "Competitor" },
    ],
    legend: true,
  },
  render: (args) => <RadarChart {...args} />,
};

// ── With Legend ──────────────────────────────

export const WithLegend: Story = {
  args: {
    data: radarData,
    series: [
      { dataKey: "product", name: "Our Product" },
      { dataKey: "competitor", name: "Competitor" },
    ],
    legend: true,
  },
  render: (args) => <RadarChart {...args} />,
};

// ── Sizes ───────────────────────────────────

export const Sizes: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-6">
      {(["50%", "70%", "80%"] as const).map((radius) => (
        <div key={radius}>
          <p className="mb-2 text-xs font-medium text-zinc-500">outerRadius: {radius}</p>
          <RadarChart {...args} outerRadius={radius} height={220} />
        </div>
      ))}
    </div>
  ),
};

// ── Loading ─────────────────────────────────

export const Loading: Story = {
  args: { data: [], loading: true },
  render: (args) => <RadarChart {...args} />,
};

// ── Empty ───────────────────────────────────

export const Empty: Story = {
  args: { data: [], emptyMessage: "No comparison data" },
  render: (args) => <RadarChart {...args} />,
};
