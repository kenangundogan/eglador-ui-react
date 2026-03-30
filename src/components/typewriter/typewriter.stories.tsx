import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typewriter, type TypewriterProps } from "./typewriter";

const meta: Meta<typeof Typewriter> = {
  title: "Components/Typewriter",
  component: Typewriter,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "An animated typewriter text component with backspace/clear delete modes, configurable speed, and multiple cursor styles.",
      },
    },
  },
  args: {
    texts: ["Hello, World!", "Welcome to eglador-ui-react.", "Build something great."],
    typingSpeed: 40,
    deletingSpeed: 25,
    pauseDuration: 3000,
    deleteMode: "backspace",
    loop: true,
    startDelay: 0,
    cursor: true,
    cursorStyle: "line",
  },
  argTypes: {
    deleteMode: { control: "select", options: ["backspace", "clear"] },
    cursorStyle: { control: "select", options: ["line", "block", "underscore"] },
    typingSpeed: { control: { type: "number", min: 10, max: 200 } },
    deletingSpeed: { control: { type: "number", min: 10, max: 200 } },
    pauseDuration: { control: { type: "number", min: 500, max: 10000 } },
    startDelay: { control: { type: "number", min: 0, max: 5000 } },
    loop: { control: "boolean" },
    cursor: { control: "boolean" },
    onComplete: { action: "completed" },
  },
};

export default meta;
type Story = StoryObj<typeof Typewriter>;

// ── Playground ───────────────────────────────

export const Default: Story = {};

// ── Cursor Styles ────────────────────────────

export const CursorStyles: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="text-lg">
        <span className="text-zinc-400 text-sm mr-2">line:</span>
        <Typewriter texts={["Line cursor style"]} cursorStyle="line" loop={false} />
      </div>
      <div className="text-lg">
        <span className="text-zinc-400 text-sm mr-2">block:</span>
        <Typewriter texts={["Block cursor style"]} cursorStyle="block" loop={false} />
      </div>
      <div className="text-lg">
        <span className="text-zinc-400 text-sm mr-2">underscore:</span>
        <Typewriter texts={["Underscore cursor style"]} cursorStyle="underscore" loop={false} />
      </div>
    </div>
  ),
};

// ── Delete Modes ─────────────────────────────

export const BackspaceMode: Story = {
  args: {
    texts: ["Backspace delete mode", "Characters removed one by one"],
    deleteMode: "backspace",
    pauseDuration: 1500,
  },
};

export const ClearMode: Story = {
  args: {
    texts: ["Clear delete mode", "Text cleared instantly"],
    deleteMode: "clear",
    pauseDuration: 1500,
  },
};

// ── No Loop ──────────────────────────────────

export const NoLoop: Story = {
  args: {
    texts: ["This text is typed once and stops."],
    loop: false,
  },
};

// ── Fast Typing ──────────────────────────────

export const FastTyping: Story = {
  args: {
    texts: ["Speed typing!", "Very fast!", "Can you read this?"],
    typingSpeed: 15,
    deletingSpeed: 10,
    pauseDuration: 1000,
  },
};

// ── Slow Typing ──────────────────────────────

export const SlowTyping: Story = {
  args: {
    texts: ["Slow and dramatic typing..."],
    typingSpeed: 120,
    deletingSpeed: 80,
    pauseDuration: 2000,
    loop: false,
  },
};

// ── With Start Delay ─────────────────────────

export const WithStartDelay: Story = {
  args: {
    texts: ["This text appears after a 2 second delay."],
    startDelay: 2000,
    loop: false,
  },
};

// ── Styled ───────────────────────────────────

export const Styled: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 className="text-3xl font-bold text-zinc-900">
        <Typewriter texts={["Build.", "Ship.", "Scale."]} pauseDuration={1500} />
      </h1>
      <p className="text-lg text-blue-600">
        <Typewriter texts={["React components", "Tailwind CSS v4", "TypeScript ready"]} typingSpeed={30} pauseDuration={2000} />
      </p>
      <span className="text-sm text-zinc-400 font-mono">
        <Typewriter texts={["npm install eglador-ui-react"]} loop={false} cursorStyle="block" typingSpeed={50} />
      </span>
    </div>
  ),
};
