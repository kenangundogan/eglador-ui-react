import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarDays, MapPin, Link as LinkIcon } from "lucide-react";
import { Avatar } from "../avatar";
import { Badge } from "../badge";
import { Button } from "../button";
import { Link } from "../link";
import { HoverCard, type HoverCardProps } from "./hover-card";

const meta: Meta<typeof HoverCard> = {
  title: "Components/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A hover card that displays rich content when hovering over a trigger element. Supports 4 sides, 3 alignments, configurable open/close delays, portal rendering, scroll-anchored positioning, and keyboard focus support.",
      },
    },
  },
  args: {
    side: "bottom",
    align: "center",
    openDelay: 300,
    closeDelay: 200,
  },
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
    openDelay: { control: { type: "number", min: 0, max: 1000 } },
    closeDelay: { control: { type: "number", min: 0, max: 1000 } },
  },
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

// ── User Profile ─────────────────────────────

export const UserProfile: Story = {
  render: (args: HoverCardProps) => (
    <div className="p-25 flex justify-center">
      <HoverCard {...args}>
        <HoverCard.Trigger>
          <Link href="#">@kenangundogan</Link>
        </HoverCard.Trigger>
        <HoverCard.Content className="w-72">
          <div className="flex gap-3">
            <Avatar name="Kenan Gundogan" size="md" />
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-900">Kenan Gundogan</span>
                <Badge size="xs" shape="pill">Pro</Badge>
              </div>
              <span className="text-xs text-zinc-400">@kenangundogan</span>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Full-stack developer. Building eglador-ui-react — a lightweight React UI component library.
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                <span className="flex items-center gap-1"><MapPin className="size-3" /> Istanbul</span>
                <span className="flex items-center gap-1"><CalendarDays className="size-3" /> Joined 2024</span>
              </div>
            </div>
          </div>
        </HoverCard.Content>
      </HoverCard>
    </div>
  ),
};

// ── Positions ────────────────────────────────

export const Positions: Story = {
  render: () => (
    <div className="flex gap-10 p-30 flex-wrap justify-center">
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <HoverCard key={side} side={side} openDelay={0}>
          <HoverCard.Trigger>
            <Button variant="outline">
              {side}
            </Button>
          </HoverCard.Trigger>
          <HoverCard.Content className="w-48">
            <p className="text-sm text-zinc-600">Card on the <strong>{side}</strong> side.</p>
          </HoverCard.Content>
        </HoverCard>
      ))}
    </div>
  ),
};

// ── Link Preview ─────────────────────────────

export const LinkPreview: Story = {
  render: (args: HoverCardProps) => (
    <div className="p-25 max-w-lg">
      <p className="text-sm text-zinc-600 leading-relaxed">
        Check out the{" "}
        <HoverCard {...args} openDelay={200}>
          <HoverCard.Trigger>
            <Link href="#">eglador-ui-react</Link>
          </HoverCard.Trigger>
          <HoverCard.Content className="w-80">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <LinkIcon className="size-4 text-zinc-400" />
                <span className="text-xs text-zinc-400">github.com/kenangundogan/eglador-ui-react</span>
              </div>
              <h4 className="text-sm font-semibold text-zinc-900">eglador-ui-react</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                A lightweight, reusable UI component library built with Tailwind CSS v4 for React-based projects. 50+ components with Storybook documentation.
              </p>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span>⭐ 128 stars</span>
                <span>TypeScript</span>
                <span>MIT License</span>
              </div>
            </div>
          </HoverCard.Content>
        </HoverCard>
        {" "}library for building modern UIs with React and Tailwind CSS.
      </p>
    </div>
  ),
};

// ── Product Card ─────────────────────────────

export const ProductCard: Story = {
  render: (args: HoverCardProps) => (
    <div className="p-25 flex justify-center">
      <HoverCard {...args} side="right" align="start">
        <HoverCard.Trigger>
          <div className="flex items-center gap-2 px-3 py-2 border border-zinc-200 rounded-lg cursor-pointer hover:bg-zinc-50">
            <div className="size-8 rounded bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500">P</div>
            <span className="text-sm font-medium text-zinc-900">Premium Plan</span>
          </div>
        </HoverCard.Trigger>
        <HoverCard.Content className="w-64">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-zinc-900">Premium Plan</h4>
              <Badge size="xs">Active</Badge>
            </div>
            <p className="text-xs text-zinc-500">Unlimited projects, priority support, and advanced analytics.</p>
            <div className="flex flex-col gap-1 mt-1 text-xs text-zinc-600">
              <span>✓ Unlimited projects</span>
              <span>✓ Priority support</span>
              <span>✓ Advanced analytics</span>
              <span>✓ Custom branding</span>
            </div>
            <div className="mt-2 pt-2 border-t border-zinc-100 text-xs text-zinc-400">
              $49/month · Renews Apr 15, 2026
            </div>
          </div>
        </HoverCard.Content>
      </HoverCard>
    </div>
  ),
};

// ── Inline Text ──────────────────────────────

export const InlineText: Story = {
  render: (args: HoverCardProps) => (
    <div className="p-20 max-w-lg">
      <p className="text-sm text-zinc-600 leading-relaxed">
        The team includes{" "}
        <HoverCard {...args} openDelay={200}>
          <HoverCard.Trigger>
            <span className="font-medium text-zinc-900 cursor-pointer hover:text-blue-600">Alice Johnson</span>
          </HoverCard.Trigger>
          <HoverCard.Content className="w-60">
            <div className="flex items-center gap-3">
              <Avatar name="Alice Johnson" size="sm" />
              <div>
                <p className="text-sm font-semibold text-zinc-900">Alice Johnson</p>
                <p className="text-xs text-zinc-400">Frontend Engineer</p>
              </div>
            </div>
          </HoverCard.Content>
        </HoverCard>
        ,{" "}
        <HoverCard {...args} openDelay={200}>
          <HoverCard.Trigger>
            <span className="font-medium text-zinc-900 cursor-pointer hover:text-blue-600">Bob Smith</span>
          </HoverCard.Trigger>
          <HoverCard.Content className="w-60">
            <div className="flex items-center gap-3">
              <Avatar name="Bob Smith" size="sm" />
              <div>
                <p className="text-sm font-semibold text-zinc-900">Bob Smith</p>
                <p className="text-xs text-zinc-400">Backend Engineer</p>
              </div>
            </div>
          </HoverCard.Content>
        </HoverCard>
        , and{" "}
        <HoverCard {...args} openDelay={200}>
          <HoverCard.Trigger>
            <span className="font-medium text-zinc-900 cursor-pointer hover:text-blue-600">Charlie Brown</span>
          </HoverCard.Trigger>
          <HoverCard.Content className="w-60">
            <div className="flex items-center gap-3">
              <Avatar name="Charlie Brown" size="sm" />
              <div>
                <p className="text-sm font-semibold text-zinc-900">Charlie Brown</p>
                <p className="text-xs text-zinc-400">Product Designer</p>
              </div>
            </div>
          </HoverCard.Content>
        </HoverCard>
        . Together they build amazing products.
      </p>
    </div>
  ),
};

// ── No Delay ─────────────────────────────────

export const NoDelay: Story = {
  render: (args: HoverCardProps) => (
    <div className="p-25 flex justify-center">
      <HoverCard {...args} openDelay={0} closeDelay={0}>
        <HoverCard.Trigger>
          <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">Instant hover</span>
        </HoverCard.Trigger>
        <HoverCard.Content className="w-48">
          <p className="text-sm text-zinc-600">Opens and closes instantly.</p>
        </HoverCard.Content>
      </HoverCard>
    </div>
  ),
};
