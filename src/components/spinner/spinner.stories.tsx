import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner, type SpinnerProps } from "./spinner";

const ALL_COLORS = ["default", "primary", "danger", "success", "warning", "info", "white"] as const;

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A loading spinner component with 7 colors, 4 sizes, and optional label text.",
      },
    },
  },
  args: {
    size: "sm",
    color: "default",
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    color: { control: "select", options: [...ALL_COLORS] },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args: SpinnerProps) => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <Spinner {...args} size="xs" />
      <Spinner {...args} size="sm" />
      <Spinner {...args} size="md" />
      <Spinner {...args} size="lg" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args: SpinnerProps) => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      {ALL_COLORS.filter((c) => c !== "white").map((c) => (
        <Spinner {...args} key={c} color={c} />
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  render: (args: SpinnerProps) => (
    <div style={{ display: "flex", gap: 32, alignItems: "start" }}>
      <Spinner {...args} size="sm" color="primary" label="Loading..." />
      <Spinner {...args} size="md" color="success" label="Saving" />
      <Spinner {...args} size="lg" color="danger" label="Processing" />
    </div>
  ),
};

export const OnDarkBackground: Story = {
  render: (args: SpinnerProps) => (
    <div style={{ display: "flex", gap: 24, alignItems: "center", background: "#18181b", padding: 32, borderRadius: 12 }}>
      <Spinner {...args} size="sm" color="white" />
      <Spinner {...args} size="md" color="white" label="Loading..." />
      <Spinner {...args} size="lg" color="white" />
    </div>
  ),
};

export const InlineWithText: Story = {
  render: (args: SpinnerProps) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Spinner {...args} size="xs" color="primary" />
      <span className="text-sm text-zinc-600">Checking availability...</span>
    </div>
  ),
};
