import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd, type KbdProps } from "./kbd";

const meta: Meta<typeof Kbd> = {
  title: "Components/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A keyboard key indicator component for displaying keyboard shortcuts. Supports single keys, combo keys with separator, 3 sizes, and 3 variants.",
      },
    },
  },
  args: {
    size: "sm",
    variant: "default",
    children: "K",
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md"] },
    variant: { control: "select", options: ["default", "outline", "ghost"] },
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

// ── Playground ───────────────────────────────

export const Default: Story = {};

// ── Single Keys ──────────────────────────────

export const SingleKeys: Story = {
  render: (args: KbdProps) => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Kbd {...args}>⌘</Kbd>
      <Kbd {...args}>Shift</Kbd>
      <Kbd {...args}>Enter</Kbd>
      <Kbd {...args}>Tab</Kbd>
      <Kbd {...args}>Esc</Kbd>
      <Kbd {...args}>Space</Kbd>
      <Kbd {...args}>↑</Kbd>
      <Kbd {...args}>↓</Kbd>
    </div>
  ),
};

// ── Combo Keys ───────────────────────────────

export const ComboKeys: Story = {
  render: (args: KbdProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="flex items-center gap-3">
        <Kbd {...args} keys={["⌘", "C"]} />
        <span className="text-sm text-zinc-500">Copy</span>
      </div>
      <div className="flex items-center gap-3">
        <Kbd {...args} keys={["⌘", "V"]} />
        <span className="text-sm text-zinc-500">Paste</span>
      </div>
      <div className="flex items-center gap-3">
        <Kbd {...args} keys={["⌘", "Shift", "P"]} />
        <span className="text-sm text-zinc-500">Command Palette</span>
      </div>
      <div className="flex items-center gap-3">
        <Kbd {...args} keys={["Ctrl", "Alt", "Del"]} />
        <span className="text-sm text-zinc-500">Task Manager</span>
      </div>
    </div>
  ),
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: (args: KbdProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {(["xs", "sm", "md"] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-6">{size}</span>
          <Kbd {...args} size={size} keys={["⌘", "K"]} />
        </div>
      ))}
    </div>
  ),
};

// ── Variants ─────────────────────────────────

export const Variants: Story = {
  render: (args: KbdProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {(["default", "outline", "ghost"] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-12">{variant}</span>
          <Kbd {...args} variant={variant} keys={["⌘", "Shift", "K"]} />
        </div>
      ))}
    </div>
  ),
};

// ── Inline Usage ─────────────────────────────

export const InlineUsage: Story = {
  render: (args: KbdProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      <p className="text-sm text-zinc-600">
        Press <Kbd {...args} keys={["⌘", "K"]} /> to open the command palette.
      </p>
      <p className="text-sm text-zinc-600">
        Use <Kbd {...args}>↑</Kbd> and <Kbd {...args}>↓</Kbd> to navigate, <Kbd {...args}>Enter</Kbd> to select.
      </p>
      <p className="text-sm text-zinc-600">
        Press <Kbd {...args}>Esc</Kbd> to close the dialog.
      </p>
    </div>
  ),
};

// ── Shortcut List ────────────────────────────

export const ShortcutList: Story = {
  render: (args: KbdProps) => {
    const shortcuts = [
      { keys: ["⌘", "N"], label: "New file" },
      { keys: ["⌘", "O"], label: "Open file" },
      { keys: ["⌘", "S"], label: "Save" },
      { keys: ["⌘", "Shift", "S"], label: "Save as" },
      { keys: ["⌘", "W"], label: "Close tab" },
      { keys: ["⌘", "Q"], label: "Quit" },
    ];
    return (
      <div className="border border-zinc-200 rounded-lg divide-y divide-zinc-100" style={{ maxWidth: 320 }}>
        {shortcuts.map((s, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5">
            <span className="text-sm text-zinc-700">{s.label}</span>
            <Kbd {...args} keys={s.keys} size="xs" />
          </div>
        ))}
      </div>
    );
  },
};
