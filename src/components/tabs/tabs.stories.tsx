import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings, User, Bell } from "lucide-react";
import { Tabs, type TabsProps } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A compound tabs component with default, bordered, and segmented variants. Supports icons, disabled tabs, and controlled mode.",
      },
    },
  },
  args: {
    variant: "default",
    size: "sm",
  },
  argTypes: {
    variant: { control: "select", options: ["default", "bordered", "segmented"] },
    size: { control: "select", options: ["xs", "sm", "md"] },
    onValueChange: { action: "valueChanged" },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: TabsProps) => (
    <Tabs {...args} defaultValue="account">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">
        <div className="p-4 text-sm text-zinc-600">Account settings content.</div>
      </Tabs.Content>
      <Tabs.Content value="password">
        <div className="p-4 text-sm text-zinc-600">Password settings content.</div>
      </Tabs.Content>
      <Tabs.Content value="settings">
        <div className="p-4 text-sm text-zinc-600">General settings content.</div>
      </Tabs.Content>
    </Tabs>
  ),
};

// ── Bordered ─────────────────────────────────

export const Bordered: Story = {
  args: { variant: "bordered" },
  render: (args: TabsProps) => (
    <Tabs {...args} defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Overview</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Analytics</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Reports</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <div className="p-4 text-sm text-zinc-600">Overview content.</div>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <div className="p-4 text-sm text-zinc-600">Analytics content.</div>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <div className="p-4 text-sm text-zinc-600">Reports content.</div>
      </Tabs.Content>
    </Tabs>
  ),
};

// ── Segmented ────────────────────────────────

export const Segmented: Story = {
  args: { variant: "segmented" },
  render: (args: TabsProps) => (
    <Tabs {...args} defaultValue="all">
      <Tabs.List>
        <Tabs.Trigger value="all">All</Tabs.Trigger>
        <Tabs.Trigger value="active">Active</Tabs.Trigger>
        <Tabs.Trigger value="archived">Archived</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="all">
        <div className="p-4 text-sm text-zinc-600">All items.</div>
      </Tabs.Content>
      <Tabs.Content value="active">
        <div className="p-4 text-sm text-zinc-600">Active items.</div>
      </Tabs.Content>
      <Tabs.Content value="archived">
        <div className="p-4 text-sm text-zinc-600">Archived items.</div>
      </Tabs.Content>
    </Tabs>
  ),
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["xs", "sm", "md"] as const).map((size) => (
        <Tabs key={size} defaultValue="tab1" variant="segmented" size={size}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1"><p className="text-sm text-zinc-500 mt-2">Size: {size}</p></Tabs.Content>
          <Tabs.Content value="tab2"><p className="text-sm text-zinc-500 mt-2">Tab 2 content</p></Tabs.Content>
          <Tabs.Content value="tab3"><p className="text-sm text-zinc-500 mt-2">Tab 3 content</p></Tabs.Content>
        </Tabs>
      ))}
    </div>
  ),
};

// ── With Icons ───────────────────────────────

export const WithIcons: Story = {
  render: (args: TabsProps) => (
    <Tabs {...args} defaultValue="profile" variant="bordered">
      <Tabs.List>
        <Tabs.Trigger value="profile" icon={<User />}>Profile</Tabs.Trigger>
        <Tabs.Trigger value="notifications" icon={<Bell />}>Notifications</Tabs.Trigger>
        <Tabs.Trigger value="settings" icon={<Settings />}>Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="profile">
        <div className="p-4 text-sm text-zinc-600">Profile content.</div>
      </Tabs.Content>
      <Tabs.Content value="notifications">
        <div className="p-4 text-sm text-zinc-600">Notifications content.</div>
      </Tabs.Content>
      <Tabs.Content value="settings">
        <div className="p-4 text-sm text-zinc-600">Settings content.</div>
      </Tabs.Content>
    </Tabs>
  ),
};

// ── Disabled Tab ─────────────────────────────

export const DisabledTab: Story = {
  render: (args: TabsProps) => (
    <Tabs {...args} defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Enabled</Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled>Disabled</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Enabled</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <div className="p-4 text-sm text-zinc-600">First tab content.</div>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <div className="p-4 text-sm text-zinc-600">Third tab content.</div>
      </Tabs.Content>
    </Tabs>
  ),
};

// ── Controlled ───────────────────────────────

export const Controlled: Story = {
  render: (args: TabsProps) => {
    const [value, setValue] = useState("tab1");
    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs text-zinc-400">Active: {value}</span>
        <Tabs {...args} value={value} onValueChange={setValue} variant="segmented">
          <Tabs.List>
            <Tabs.Trigger value="tab1">First</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Second</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Third</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">
            <div className="p-4 text-sm text-zinc-600">First tab.</div>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <div className="p-4 text-sm text-zinc-600">Second tab.</div>
          </Tabs.Content>
          <Tabs.Content value="tab3">
            <div className="p-4 text-sm text-zinc-600">Third tab.</div>
          </Tabs.Content>
        </Tabs>
      </div>
    );
  },
};
