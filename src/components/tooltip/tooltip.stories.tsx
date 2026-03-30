import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { Tooltip, type TooltipProps } from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A lightweight tooltip component with top/bottom/left/right positioning and configurable delay.",
      },
    },
  },
  args: {
    content: "Tooltip text",
    position: "top",
    delay: 300,
  },
  argTypes: {
    position: { control: "select", options: ["top", "bottom", "left", "right"] },
    delay: { control: { type: "number", min: 0, max: 2000 } },
    content: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: (args: TooltipProps) => (
    <div style={{ padding: 80, display: "flex", justifyContent: "center" }}>
      <Tooltip {...args}>
        <Button>Hover me</Button>
      </Tooltip>
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div style={{ padding: 80, display: "flex", gap: 24, justifyContent: "center" }}>
      <Tooltip content="Top" position="top"><Button variant="outline">Top</Button></Tooltip>
      <Tooltip content="Bottom" position="bottom"><Button variant="outline">Bottom</Button></Tooltip>
      <Tooltip content="Left" position="left"><Button variant="outline">Left</Button></Tooltip>
      <Tooltip content="Right" position="right"><Button variant="outline">Right</Button></Tooltip>
    </div>
  ),
};

export const NoDelay: Story = {
  render: () => (
    <div style={{ padding: 80, display: "flex", justifyContent: "center" }}>
      <Tooltip content="Instant tooltip" delay={0}>
        <Button color="primary">No delay</Button>
      </Tooltip>
    </div>
  ),
};
