import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A separator/divider component with horizontal and vertical orientations, solid/dashed/dotted variants, and optional label.",
      },
    },
  },
  args: {
    orientation: "horizontal",
    variant: "solid",
  },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    variant: { control: "select", options: ["solid", "dashed", "dotted"] },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <p className="text-sm text-zinc-600 mb-3">Content above the separator.</p>
      <Separator />
      <p className="text-sm text-zinc-600 mt-3">Content below the separator.</p>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">solid</span>
        <Separator variant="solid" />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">dashed</span>
        <Separator variant="dashed" />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">dotted</span>
        <Separator variant="dotted" />
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
      <Separator label="OR" />
      <Separator label="Section" variant="dashed" />
      <Separator label="End" variant="dotted" />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, height: 40 }}>
      <span className="text-sm text-zinc-600">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm text-zinc-600">Center</span>
      <Separator orientation="vertical" variant="dashed" />
      <span className="text-sm text-zinc-600">Right</span>
    </div>
  ),
};
