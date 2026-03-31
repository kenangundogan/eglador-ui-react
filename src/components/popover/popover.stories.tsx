import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings, HelpCircle, Bell, User } from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Switch } from "../switch";
import { Separator } from "../separator";
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

// ── Alignments ───────────────────────────────

export const Alignments: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, padding: 100 }}>
      {(["start", "center", "end"] as const).map((align) => (
        <Popover key={align} align={align}>
          <Popover.Trigger asChild>
            <Button variant="outline" size="xs">{align}</Button>
          </Popover.Trigger>
          <Popover.Content>
            <p className="text-sm text-zinc-600">Aligned: {align}</p>
          </Popover.Content>
        </Popover>
      ))}
    </div>
  ),
};

// ── Notification Panel ───────────────────────

export const NotificationPanel: Story = {
  render: (args: PopoverProps) => (
    <div style={{ padding: 80 }}>
      <Popover {...args}>
        <Popover.Trigger asChild>
          <Button variant="outline" icon={<Bell />}>Notifications</Button>
        </Popover.Trigger>
        <Popover.Content className="w-80 p-0">
          <div className="px-4 py-3 border-b border-zinc-100">
            <p className="text-sm font-semibold text-zinc-900">Notifications</p>
            <p className="text-xs text-zinc-400">You have 3 unread messages</p>
          </div>
          <div className="flex flex-col">
            {[
              { title: "New comment", desc: "Alice commented on your post", time: "2m ago" },
              { title: "Team invite", desc: "You were invited to Project X", time: "1h ago" },
              { title: "Deploy complete", desc: "Production deploy succeeded", time: "3h ago" },
            ].map((n, i) => (
              <div key={i} className="px-4 py-3 hover:bg-zinc-50 transition-colors cursor-pointer border-b border-zinc-50 last:border-0">
                <p className="text-sm font-medium text-zinc-900">{n.title}</p>
                <p className="text-xs text-zinc-400">{n.desc}</p>
                <p className="text-[10px] text-zinc-300 mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover>
    </div>
  ),
};

// ── Settings Form ────────────────────────────

export const SettingsForm: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    return (
      <div style={{ padding: 80 }}>
        <Popover>
          <Popover.Trigger asChild>
            <Button variant="outline" icon={<Settings />}>Preferences</Button>
          </Popover.Trigger>
          <Popover.Content className="w-72">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-zinc-900">Preferences</p>
              <div className="flex items-center justify-between">
                <Label size="xs">Notifications</Label>
                <Switch size="xs" checked={notifications} onChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <Label size="xs">Dark Mode</Label>
                <Switch size="xs" checked={darkMode} onChange={setDarkMode} />
              </div>
              <Separator />
              <Input size="xs" label="Display Name" placeholder="John Doe" />
              <Button size="xs" color="primary" className="w-full">Save</Button>
            </div>
          </Popover.Content>
        </Popover>
      </div>
    );
  },
};

// ── No Close on Outside ──────────────────────

export const NoCloseOnOutside: Story = {
  render: (args: PopoverProps) => (
    <div style={{ padding: 80 }}>
      <Popover {...args} closeOnOutside={false}>
        <Popover.Trigger asChild>
          <Button variant="outline">Persistent Popover</Button>
        </Popover.Trigger>
        <Popover.Content className="w-60">
          <p className="text-sm text-zinc-600">This popover won't close when clicking outside. Use the trigger to toggle.</p>
        </Popover.Content>
      </Popover>
    </div>
  ),
};

// ── Controlled ───────────────────────────────

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
