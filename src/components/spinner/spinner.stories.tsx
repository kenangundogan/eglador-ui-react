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
    <div className="flex gap-6 items-center">
      <Spinner {...args} size="xs" />
      <Spinner {...args} size="sm" />
      <Spinner {...args} size="md" />
      <Spinner {...args} size="lg" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args: SpinnerProps) => (
    <div className="flex gap-6 items-center">
      {ALL_COLORS.filter((c) => c !== "white").map((c) => (
        <Spinner {...args} key={c} color={c} />
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  render: (args: SpinnerProps) => (
    <div className="flex gap-8 items-start">
      <Spinner {...args} size="sm" label="Loading..." />
      <Spinner {...args} size="md" label="Saving" />
      <Spinner {...args} size="lg" label="Processing" />
    </div>
  ),
};

export const OnDarkBackground: Story = {
  render: (args: SpinnerProps) => (
    <div className="flex gap-6 items-center bg-zinc-900 p-8 rounded-xl">
      <Spinner {...args} size="sm" color="white" />
      <Spinner {...args} size="md" color="white" label="Loading..." />
      <Spinner {...args} size="lg" color="white" />
    </div>
  ),
};

export const InlineWithText: Story = {
  render: (args: SpinnerProps) => (
    <div className="flex items-center gap-2">
      <Spinner {...args} size="xs" />
      <span className="text-sm text-zinc-600">Checking availability...</span>
    </div>
  ),
};
