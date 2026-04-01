import type { Meta, StoryObj } from "@storybook/react-vite";
import { User, Bot, Crown } from "lucide-react";
import { Avatar, AvatarGroup, type AvatarProps } from "./avatar";

const ALL_COLORS = ["default", "primary", "danger", "success", "warning", "info"] as const;

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "An avatar component with image, initials, icon fallbacks. Supports 5 sizes, 3 shapes, 6 colors, status indicator, and AvatarGroup for stacking.",
      },
    },
  },
  args: {
    size: "md",
    shape: "circle",
    color: "default",
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["circle", "rounded", "square"] },
    color: { control: "select", options: [...ALL_COLORS] },
    status: { control: "select", options: [undefined, "online", "offline", "away", "busy"] },
    src: { control: "text" },
    name: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

const SAMPLE_IMAGE = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";

// ── Default ──────────────────────────────────

export const Default: Story = {
  args: { src: SAMPLE_IMAGE, alt: "User avatar" },
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: (args: AvatarProps) => (
    <div className="flex gap-3 items-center">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar {...args} key={size} size={size} src={SAMPLE_IMAGE} />
      ))}
    </div>
  ),
};

// ── Shapes ───────────────────────────────────

export const Shapes: Story = {
  render: (args: AvatarProps) => (
    <div className="flex gap-3 items-center">
      <Avatar {...args} shape="circle" src={SAMPLE_IMAGE} size="lg" />
      <Avatar {...args} shape="rounded" src={SAMPLE_IMAGE} size="lg" />
      <Avatar {...args} shape="square" src={SAMPLE_IMAGE} size="lg" />
    </div>
  ),
};

// ── Initials ─────────────────────────────────

export const Initials: Story = {
  render: (args: AvatarProps) => (
    <div className="flex gap-3 items-center">
      {ALL_COLORS.map((c) => (
        <Avatar {...args} key={c} color={c} name="John Doe" size="lg" />
      ))}
    </div>
  ),
};

// ── Single Initial ───────────────────────────

export const Names: Story = {
  render: (args: AvatarProps) => (
    <div className="flex gap-3 items-center">
      <Avatar {...args} name="Alice" />
      <Avatar {...args} name="Bob Smith" />
      <Avatar {...args} name="Charlie Brown" />
      <Avatar {...args} name="Diana" />
    </div>
  ),
};

// ── With Icon ────────────────────────────────

export const WithIcon: Story = {
  render: (args: AvatarProps) => (
    <div className="flex gap-3 items-center">
      <Avatar {...args} icon={<User />} size="lg" />
      <Avatar {...args} icon={<Bot />} size="lg" />
      <Avatar {...args} icon={<Crown />} size="lg" />
    </div>
  ),
};

// ── Fallback (no src, no name) ───────────────

export const Fallback: Story = {
  render: (args: AvatarProps) => (
    <div className="flex gap-3 items-center">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar {...args} key={size} size={size} color="default" />
      ))}
    </div>
  ),
};

// ── Broken Image ─────────────────────────────

export const BrokenImage: Story = {
  render: (args: AvatarProps) => (
    <div className="flex gap-3 items-center">
      <Avatar {...args} src="https://broken-url.com/no-image.jpg" name="Error User" color="danger" size="lg" />
      <Avatar {...args} src="https://broken-url.com/no-image.jpg" color="default" size="lg" />
    </div>
  ),
};

// ── Status ───────────────────────────────────

export const Status: Story = {
  render: (args: AvatarProps) => (
    <div className="flex gap-4 items-center">
      <Avatar {...args} src={SAMPLE_IMAGE} status="online" size="lg" />
      <Avatar {...args} src={SAMPLE_IMAGE} status="away" size="lg" />
      <Avatar {...args} src={SAMPLE_IMAGE} status="busy" size="lg" />
      <Avatar {...args} src={SAMPLE_IMAGE} status="offline" size="lg" />
    </div>
  ),
};

// ── Status with Initials ─────────────────────

export const StatusWithInitials: Story = {
  render: (args: AvatarProps) => (
    <div className="flex gap-4 items-center">
      <Avatar {...args} name="Alice B" status="online" />
      <Avatar {...args} name="Bob C" status="away" />
      <Avatar {...args} name="Charlie D" status="busy" />
      <Avatar {...args} name="Diana E" status="offline" />
    </div>
  ),
};

// ── AvatarGroup ──────────────────────────────

export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <AvatarGroup size="md">
        <Avatar src={SAMPLE_IMAGE} />
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Charlie" />
      </AvatarGroup>

      <AvatarGroup size="lg">
        <Avatar src={SAMPLE_IMAGE} />
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Charlie" />
        <Avatar name="Diana" />
      </AvatarGroup>
    </div>
  ),
};

// ── AvatarGroup with Max ─────────────────────

export const GroupWithMax: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <AvatarGroup size="md" max={3}>
        <Avatar src={SAMPLE_IMAGE} />
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Charlie" />
        <Avatar name="Diana" />
        <Avatar name="Edward" />
      </AvatarGroup>

      <AvatarGroup size="sm" max={4}>
        <Avatar name="A" />
        <Avatar name="B" />
        <Avatar name="C" />
        <Avatar name="D" />
        <Avatar name="E" />
        <Avatar name="F" />
        <Avatar name="G" />
      </AvatarGroup>
    </div>
  ),
};
