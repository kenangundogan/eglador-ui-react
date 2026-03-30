import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, type LabelProps } from "./label";
import { Input } from "../input";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A form label component with 3 sizes, required indicator, and disabled state.",
      },
    },
  },
  args: {
    children: "Label",
    size: "sm",
    required: false,
    disabled: false,
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md"] },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args: LabelProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Label {...args} size="xs">Extra Small Label</Label>
      <Label {...args} size="sm">Small Label</Label>
      <Label {...args} size="md">Medium Label</Label>
    </div>
  ),
};

export const Required: Story = {
  args: { required: true, children: "Email Address" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Disabled Label" },
};

export const WithInput: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 }}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" required>Email</Label>
        <Input id="email" placeholder="you@example.com" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="John Doe" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="disabled" disabled>Disabled Field</Label>
        <Input id="disabled" placeholder="Cannot edit" disabled />
      </div>
    </div>
  ),
};
