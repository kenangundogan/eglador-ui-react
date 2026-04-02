import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, Trash2, Download, Settings, Heart } from "lucide-react";
import { Button, type ButtonProps } from "./button";

const ALL_COLORS = ["default", "black", "primary", "danger", "success", "warning", "info"] as const;

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A versatile button component with multiple variants, colors, sizes, shapes, and icon support. Pass any React node (e.g. Lucide icons) via `icon` or `iconRight` props.",
      },
    },
  },
  args: {
    children: "Button",
    variant: "solid",
    color: "default",
    size: "sm",
    shape: "rounded",
    soft: false,
    loading: false,
    active: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: "select", options: ["solid", "outline", "ghost"] },
    color: { control: "select", options: [...ALL_COLORS] },
    size: { control: "select", options: ["xs", "sm", "md"] },
    shape: { control: "select", options: ["square", "rounded", "circle"] },
    soft: { control: "boolean" },
    loading: { control: "boolean" },
    active: { control: "boolean" },
    disabled: { control: "boolean" },
    onClick: { action: "clicked" },
    onMouseEnter: { action: "mouseEnter" },
    onFocus: { action: "focused" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ── Playground ───────────────────────────────

export const Default: Story = {};

// ── Variants ─────────────────────────────────

export const Solid: Story = {
  render: (args: ButtonProps) => (
    <div className="flex gap-2 flex-wrap">
      {ALL_COLORS.map((c) => (
        <Button {...args} key={c} color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Button>
      ))}
    </div>
  ),
};

export const SolidSoft: Story = {
  args: { soft: true },
  render: (args: ButtonProps) => (
    <div className="flex gap-2 flex-wrap">
      {ALL_COLORS.map((c) => (
        <Button {...args} key={c} color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Button>
      ))}
    </div>
  ),
};

export const Outline: Story = {
  args: { variant: "outline" },
  render: (args: ButtonProps) => (
    <div className="flex gap-2 flex-wrap">
      {ALL_COLORS.map((c) => (
        <Button {...args} key={c} color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Button>
      ))}
    </div>
  ),
};

export const Ghost: Story = {
  args: { variant: "ghost" },
  render: (args: ButtonProps) => (
    <div className="flex gap-2 flex-wrap">
      {ALL_COLORS.map((c) => (
        <Button {...args} key={c} color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Button>
      ))}
    </div>
  ),
};

// ── Sizes & Shapes ───────────────────────────

export const Sizes: Story = {
  args: { color: "default" },
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center">
      <Button {...args} size="xs">Extra Small</Button>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
    </div>
  ),
};

export const Shapes: Story = {
  args: { color: "default" },
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center">
      <Button {...args} shape="square">Square</Button>
      <Button {...args} shape="rounded">Rounded</Button>
      <Button {...args} shape="circle">Circle</Button>
    </div>
  ),
};

// ── Icons ────────────────────────────────────

export const WithLeftIcon: Story = {
  args: { color: "black" },
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center">
      <Button {...args} color="black" icon={<Plus />}>Add item</Button>
      <Button {...args} color="danger" icon={<Trash2 />}>Delete</Button>
      <Button {...args} color="success" icon={<Download />}>Download</Button>
      <Button {...args} color="black" icon={<Settings />}>Settings</Button>
    </div>
  ),
};

export const WithRightIcon: Story = {
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center">
      <Button {...args} color="black" iconRight={<Plus />}>Add item</Button>
      <Button {...args} color="danger" iconRight={<Trash2 />}>Delete</Button>
      <Button {...args} color="success" iconRight={<Download />}>Download</Button>
      <Button {...args} color="black" iconRight={<Settings />}>Settings</Button>
    </div>
  ),
};

export const IconOnly: Story = {
  args: { children: undefined },
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center">
      <Button {...args} icon={<Settings />} aria-label="Settings" />
      <Button {...args} icon={<Plus />} aria-label="Add" />
      <Button {...args} icon={<Trash2 />} aria-label="Delete" />
      <Button {...args} shape="circle" icon={<Heart />} aria-label="Like" />
      <Button {...args} variant="outline" icon={<Download />} aria-label="Download" />
      <Button {...args} variant="ghost" icon={<Settings />} aria-label="Settings" />
    </div>
  ),
};

// ── States ───────────────────────────────────

export const Loading: Story = {
  args: { color: "black" },
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center">
      <Button {...args} loading>Saving...</Button>
      <Button {...args} color="black" loading>Loading</Button>
      <Button {...args} color="danger" loading icon={<Trash2 />} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center">
      <Button {...args}>Primary</Button>
      <Button {...args} color="danger" variant="outline">Outline</Button>
      <Button {...args} color="black" variant="ghost">Ghost</Button>
    </div>
  ),
};

export const Active: Story = {
  args: { active: true },
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center">
      <Button {...args}>Active</Button>
      <Button {...args} active={false}>Inactive</Button>
    </div>
  ),
};
