import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography, type TypographyProps } from "./typography";
import { Separator } from "../separator";

const meta: Meta<typeof Typography> = {
  title: "Components/Typography",
  component: Typography,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A typography component for consistent text rendering. Supports headings, paragraphs, lead text, blockquote, code, kbd, with color, alignment, weight, truncation, and line clamping.",
      },
    },
  },
  args: {
    variant: "p",
    children: "The quick brown fox jumps over the lazy dog.",
  },
  argTypes: {
    variant: { control: "select", options: ["h1", "h2", "h3", "h4", "p", "lead", "large", "small", "muted", "blockquote", "code", "kbd"] },
    color: { control: "select", options: ["default", "muted", "primary", "danger", "success", "warning", "info"] },
    align: { control: "select", options: ["left", "center", "right"] },
    weight: { control: "select", options: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"] },
    truncate: { control: "boolean" },
    lines: { control: { type: "number", min: 1, max: 10 } },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

// ── Playground ───────────────────────────────

export const Default: Story = {};

// ── Headings ─────────────────────────────────

export const Headings: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography variant="h1">Heading 1 — The quick brown fox</Typography>
      <Typography variant="h2">Heading 2 — The quick brown fox</Typography>
      <Typography variant="h3">Heading 3 — The quick brown fox</Typography>
      <Typography variant="h4">Heading 4 — The quick brown fox</Typography>
    </div>
  ),
};

// ── Body Text ────────────────────────────────

export const BodyText: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Typography variant="lead">Lead text — A larger introductory paragraph that draws the reader in.</Typography>
      <Typography variant="large">Large text — Slightly bigger than normal paragraph.</Typography>
      <Typography variant="p">Paragraph — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Typography>
      <Typography variant="small">Small text — A smaller, secondary piece of information.</Typography>
      <Typography variant="muted">Muted text — Subdued content like timestamps or helper text.</Typography>
    </div>
  ),
};

// ── Colors ───────────────────────────────────

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {(["default", "muted", "primary", "danger", "success", "warning", "info"] as const).map((color) => (
        <Typography key={color} color={color}>
          {color.charAt(0).toUpperCase() + color.slice(1)} colored text
        </Typography>
      ))}
    </div>
  ),
};

// ── Alignment ────────────────────────────────

export const Alignment: Story = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-lg">
      <Typography align="left">Left aligned text</Typography>
      <Typography align="center">Center aligned text</Typography>
      <Typography align="right">Right aligned text</Typography>
    </div>
  ),
};

// ── Weights ──────────────────────────────────

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {(["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"] as const).map((weight) => (
        <Typography key={weight} weight={weight}>
          {weight.charAt(0).toUpperCase() + weight.slice(1)} weight text
        </Typography>
      ))}
    </div>
  ),
};

// ── Blockquote ───────────────────────────────

export const Blockquote: Story = {
  render: () => (
    <div className="max-w-lg">
      <Typography variant="blockquote">
        "The best way to predict the future is to invent it." — Alan Kay
      </Typography>
    </div>
  ),
};

// ── Code & Kbd ───────────────────────────────

export const CodeAndKbd: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Typography>
        Install the package using <Typography variant="code" as="span">npm install eglador-ui-react</Typography> in your terminal.
      </Typography>
      <Typography>
        Press <Typography variant="kbd" as="span">Ctrl</Typography> + <Typography variant="kbd" as="span">C</Typography> to copy.
      </Typography>
    </div>
  ),
};

// ── Truncate ─────────────────────────────────

export const Truncate: Story = {
  render: (args: TypographyProps) => (
    <div className="max-w-xs">
      <Typography {...args} truncate>
        This is a very long text that should be truncated with an ellipsis when it overflows the container width.
      </Typography>
    </div>
  ),
};

// ── Line Clamp ───────────────────────────────

export const LineClamp: Story = {
  render: (args: TypographyProps) => {
    const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    return (
      <div className="flex flex-col gap-4 max-w-sm">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="flex flex-col gap-1">
            <span className="text-xs text-zinc-400">lines = {n}</span>
            <Typography {...args} lines={n}>{text}</Typography>
          </div>
        ))}
      </div>
    );
  },
};

// ── Custom Element ───────────────────────────

export const CustomElement: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Typography variant="h3" as="div">H3 styled but rendered as div</Typography>
      <Typography variant="p" as="span">Paragraph styled but rendered as span</Typography>
    </div>
  ),
};

// ── Article Example ──────────────────────────

export const ArticleExample: Story = {
  render: () => (
    <article className="max-w-xl flex flex-col gap-4">
      <Typography variant="h1">Building Modern UIs</Typography>
      <Typography variant="lead" color="muted">A comprehensive guide to creating beautiful, accessible user interfaces with React and Tailwind CSS.</Typography>
      <Separator />
      <Typography>
        Modern web development has evolved significantly over the past decade. Component-based architectures have become the standard, enabling developers to build complex interfaces from simple, reusable building blocks.
      </Typography>
      <Typography variant="h2">Getting Started</Typography>
      <Typography>
        To begin, install the required dependencies using <Typography variant="code" as="span">npm install</Typography>. This will set up everything you need to start building components.
      </Typography>
      <Typography variant="blockquote">
        "Simplicity is the ultimate sophistication." — Leonardo da Vinci
      </Typography>
      <Typography variant="muted">Published on March 31, 2026 · 5 min read</Typography>
    </article>
  ),
};
