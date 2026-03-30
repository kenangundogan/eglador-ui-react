import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings } from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";
import { Popover, type PopoverProps } from "./popover";

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A popover component with compound API, configurable side/align positioning, click-outside and escape-key close.",
      },
    },
  },
  args: {
    side: "bottom",
    align: "start",
    closeOnOutside: true,
    closeOnEscape: true,
  },
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
    closeOnOutside: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    onOpenChange: { action: "openChanged" },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: (args: PopoverProps) => (
    <div style={{ padding: 80 }}>
      <Popover {...args}>
        <Popover.Trigger asChild>
          <Button variant="outline" icon={<Settings />}>Open Popover</Button>
        </Popover.Trigger>
        <Popover.Content className="w-72">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-zinc-900">Settings</p>
            <Input size="xs" label="Width" placeholder="100%" />
            <Input size="xs" label="Height" placeholder="auto" />
          </div>
        </Popover.Content>
      </Popover>
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, padding: 100, flexWrap: "wrap" }}>
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Popover key={side} side={side} align="center">
          <Popover.Trigger asChild>
            <Button variant="outline" size="xs">{side}</Button>
          </Popover.Trigger>
          <Popover.Content>
            <p className="text-sm text-zinc-600">Popover on {side}</p>
          </Popover.Content>
        </Popover>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  render: (args: PopoverProps) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 80 }}>
        <Popover {...args} open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button color="primary">Toggle</Button>
          </Popover.Trigger>
          <Popover.Content className="w-60">
            <p className="text-sm text-zinc-600">This popover is controlled externally.</p>
            <Button size="xs" variant="outline" className="mt-3" onClick={() => setOpen(false)}>Close</Button>
          </Popover.Content>
        </Popover>
        <span className="text-xs text-zinc-400">State: {open ? "open" : "closed"}</span>
      </div>
    );
  },
};
