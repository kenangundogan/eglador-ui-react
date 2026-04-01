import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Download, Mail } from "lucide-react";
import { Link, type LinkProps } from "./link";

const ALL_COLORS = ["default", "black", "primary", "danger", "success", "warning", "info"] as const;

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A versatile link component with multiple variants, colors, sizes, icon support, and external link handling.",
      },
    },
  },
  args: {
    children: "Click here",
    href: "#",
    variant: "default",
    color: "default",
    size: "sm",
    external: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: "select", options: ["default", "underline", "ghost"] },
    color: { control: "select", options: [...ALL_COLORS] },
    size: { control: "select", options: ["xs", "sm", "md"] },
    external: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

// ── Playground ───────────────────────────────

export const Default: Story = {};

// ── Variants ─────────────────────────────────

export const Variants: Story = {
  render: (args: LinkProps) => (
    <div className="flex gap-6">
      <Link {...args} variant="default">Default</Link>
      <Link {...args} variant="underline">Underline</Link>
      <Link {...args} variant="ghost">Ghost</Link>
    </div>
  ),
};

// ── Colors ───────────────────────────────────

export const Colors: Story = {
  render: (args: LinkProps) => (
    <div className="flex gap-6 flex-wrap">
      {ALL_COLORS.map((c) => (
        <Link {...args} key={c} color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Link>
      ))}
    </div>
  ),
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: (args: LinkProps) => (
    <div className="flex gap-6 items-center">
      <Link {...args} size="xs">Extra Small</Link>
      <Link {...args} size="sm">Small</Link>
      <Link {...args} size="md">Medium</Link>
    </div>
  ),
};

// ── With Left Icon ───────────────────────────

export const WithLeftIcon: Story = {
  render: (args: LinkProps) => (
    <div className="flex gap-6">
      <Link {...args} icon={<Mail />}>Contact us</Link>
      <Link {...args} icon={<Download />}>Download</Link>
    </div>
  ),
};

// ── With Right Icon ──────────────────────────

export const WithRightIcon: Story = {
  render: (args: LinkProps) => (
    <div className="flex gap-6">
      <Link {...args} iconRight={<ArrowRight />}>Learn more</Link>
    </div>
  ),
};

// ── External ─────────────────────────────────

export const External: Story = {
  render: (args: LinkProps) => (
    <div className="flex gap-6">
      <Link {...args} href="https://github.com" external>GitHub</Link>
      <Link {...args} href="https://npmjs.com" external>npm</Link>
      <Link {...args} href="https://tailwindcss.com" external variant="underline">Tailwind CSS</Link>
    </div>
  ),
};

// ── Disabled ─────────────────────────────────

export const Disabled: Story = {
  render: (args: LinkProps) => (
    <div className="flex gap-6">
      <Link {...args} disabled>Disabled link</Link>
      <Link {...args} disabled>Disabled danger</Link>
    </div>
  ),
};
