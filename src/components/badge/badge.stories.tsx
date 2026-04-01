import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Star, Zap, AlertTriangle, Check, Clock } from "lucide-react";
import { Badge, type BadgeProps } from "./badge";

const ALL_COLORS = ["default", "black", "primary", "danger", "success", "warning", "info"] as const;

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A badge/tag component with solid, soft, and outline variants. Supports 7 colors, 3 sizes, 3 shapes, icons, and removable state.",
      },
    },
  },
  args: {
    children: "Badge",
    variant: "soft",
    color: "default",
    size: "sm",
    shape: "rounded",
    removable: false,
  },
  argTypes: {
    variant: { control: "select", options: ["solid", "soft", "outline"] },
    color: { control: "select", options: [...ALL_COLORS] },
    size: { control: "select", options: ["xs", "sm", "md"] },
    shape: { control: "select", options: ["square", "rounded", "pill"] },
    removable: { control: "boolean" },
    onRemove: { action: "removed" },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// ── Playground ───────────────────────────────

export const Default: Story = {};

// ── Solid ────────────────────────────────────

export const Solid: Story = {
  render: (args: BadgeProps) => (
    <div className="flex gap-2 flex-wrap">
      {ALL_COLORS.map((c) => (
        <Badge {...args} key={c} variant="solid" color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Badge>
      ))}
    </div>
  ),
};

// ── Soft ─────────────────────────────────────

export const Soft: Story = {
  render: (args: BadgeProps) => (
    <div className="flex gap-2 flex-wrap">
      {ALL_COLORS.map((c) => (
        <Badge {...args} key={c} variant="soft" color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Badge>
      ))}
    </div>
  ),
};

// ── Outline ──────────────────────────────────

export const Outline: Story = {
  render: (args: BadgeProps) => (
    <div className="flex gap-2 flex-wrap">
      {ALL_COLORS.map((c) => (
        <Badge {...args} key={c} variant="outline" color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Badge>
      ))}
    </div>
  ),
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: (args: BadgeProps) => (
    <div className="flex gap-2 items-center">
      <Badge {...args} size="xs">Extra Small</Badge>
      <Badge {...args} size="sm">Small</Badge>
      <Badge {...args} size="md">Medium</Badge>
    </div>
  ),
};

// ── Shapes ───────────────────────────────────

export const Shapes: Story = {
  render: (args: BadgeProps) => (
    <div className="flex gap-2 items-center">
      <Badge {...args} shape="square">Square</Badge>
      <Badge {...args} shape="rounded">Rounded</Badge>
      <Badge {...args} shape="pill">Pill</Badge>
    </div>
  ),
};

// ── With Icons ───────────────────────────────

export const WithIcons: Story = {
  render: (args: BadgeProps) => (
    <div className="flex gap-2 flex-wrap">
      <Badge {...args} icon={<Star />}>Featured</Badge>
      <Badge {...args} icon={<Zap />}>New</Badge>
      <Badge {...args} icon={<AlertTriangle />}>Critical</Badge>
      <Badge {...args} icon={<Check />}>Verified</Badge>
      <Badge {...args} iconRight={<Clock />}>Pending</Badge>
    </div>
  ),
};

// ── Removable ────────────────────────────────

export const Removable: Story = {
  render: (args: BadgeProps) => {
    const [tags, setTags] = useState(["React", "TypeScript", "Tailwind", "Storybook", "Next.js"]);
    return (
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <Badge
            {...args}
            key={tag}
            shape="pill"
            removable
            onRemove={() => setTags((t) => t.filter((v) => v !== tag))}
          >
            {tag}
          </Badge>
        ))}
        {tags.length === 0 && <span className="text-sm text-zinc-400">All tags removed</span>}
      </div>
    );
  },
};

// ── Status Badges ────────────────────────────

export const StatusBadges: Story = {
  render: (args: BadgeProps) => (
    <div className="flex gap-2 flex-wrap">
      <Badge {...args} variant="soft" color="success" shape="pill" icon={<Check />}>Active</Badge>
      <Badge {...args} variant="soft" color="warning" shape="pill" icon={<Clock />}>Pending</Badge>
      <Badge {...args} variant="soft" color="danger" shape="pill" icon={<AlertTriangle />}>Error</Badge>
      <Badge {...args} variant="soft" color="default" shape="pill">Draft</Badge>
    </div>
  ),
};
