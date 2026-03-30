import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search, Mail, Eye, Check, Lock } from "lucide-react";
import { Input, type InputProps } from "./input";

const ALL_COLORS = ["default", "black", "primary", "danger", "success", "warning", "info"] as const;

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A text input component with 3 variants, 7 colors, 3 sizes, icon support, loading state, and error/success states.",
      },
    },
  },
  args: {
    placeholder: "Type something...",
    variant: "default",
    color: "default",
    size: "sm",
    shape: "rounded",
    state: "idle",
    loading: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outline", "ghost"] },
    color: { control: "select", options: [...ALL_COLORS] },
    size: { control: "select", options: ["xs", "sm", "md"] },
    shape: { control: "select", options: ["square", "rounded"] },
    state: { control: "select", options: ["idle", "error", "success"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    errorMessage: { control: "text" },
    successMessage: { control: "text" },
    onChange: { action: "changed" },
    onFocus: { action: "focused" },
    onBlur: { action: "blurred" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// ── Playground ───────────────────────────────

export const Default: Story = {};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: (args: InputProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 320 }}>
      <Input {...args} size="xs" placeholder="Extra Small" />
      <Input {...args} size="sm" placeholder="Small" />
      <Input {...args} size="md" placeholder="Medium" />
    </div>
  ),
};

// ── Colors ───────────────────────────────────

export const Colors: Story = {
  render: (args: InputProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 320 }}>
      {ALL_COLORS.map((c) => (
        <Input {...args} key={c} color={c} placeholder={c.charAt(0).toUpperCase() + c.slice(1)} />
      ))}
    </div>
  ),
};

// ── Variants ─────────────────────────────────

export const Variants: Story = {
  render: (args: InputProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 320 }}>
      <Input {...args} variant="default" placeholder="Default" />
      <Input {...args} variant="outline" placeholder="Outline" />
      <Input {...args} variant="ghost" placeholder="Ghost" />
    </div>
  ),
};

// ── With Label ───────────────────────────────

export const WithLabel: Story = {
  render: (args: InputProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
      <Input {...args} label="Email" type="email" placeholder="you@example.com" icon={<Mail />} />
      <Input {...args} label="Password" type="password" placeholder="••••••••" icon={<Lock />} />
    </div>
  ),
};

// ── With Icons ───────────────────────────────

export const WithLeftIcon: Story = {
  render: (args: InputProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 320 }}>
      <Input {...args} icon={<Search />} placeholder="Search..." />
      <Input {...args} icon={<Mail />} placeholder="Email address" />
    </div>
  ),
};

export const WithRightIcon: Story = {
  render: (args: InputProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 320 }}>
      <Input {...args} iconRight={<Eye />} type="password" placeholder="Password" />
      <Input {...args} iconRight={<Check />} placeholder="Verified" />
    </div>
  ),
};

export const WithBothIcons: Story = {
  render: (args: InputProps) => (
    <div style={{ width: 320 }}>
      <Input {...args} icon={<Mail />} iconRight={<Check />} placeholder="you@example.com" />
    </div>
  ),
};

// ── States ───────────────────────────────────

export const ErrorState: Story = {
  render: (args: InputProps) => (
    <div style={{ width: 320 }}>
      <Input {...args} state="error" errorMessage="This field is required." placeholder="Email" label="Email" />
    </div>
  ),
};

export const SuccessState: Story = {
  render: (args: InputProps) => (
    <div style={{ width: 320 }}>
      <Input {...args} state="success" successMessage="Valid email address." placeholder="Email" label="Email" />
    </div>
  ),
};

export const Loading: Story = {
  render: (args: InputProps) => (
    <div style={{ width: 320 }}>
      <Input {...args} loading placeholder="Checking availability..." />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args: InputProps) => (
    <div style={{ width: 320 }}>
      <Input {...args} disabled placeholder="Disabled input" label="Disabled" />
    </div>
  ),
};

// ── Shapes ───────────────────────────────────

export const Shapes: Story = {
  render: (args: InputProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 320 }}>
      <Input {...args} shape="square" placeholder="Square" />
      <Input {...args} shape="rounded" placeholder="Rounded" />
    </div>
  ),
};
