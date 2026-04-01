import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MultiSelect, type MultiSelectProps } from "./multi-select";

const sampleOptions = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Next.js", value: "nextjs" },
  { label: "Remix", value: "remix" },
  { label: "Gatsby", value: "gatsby" },
  { label: "Astro", value: "astro" },
  { label: "Nuxt", value: "nuxt" },
  { label: "SvelteKit", value: "sveltekit" },
];

const meta: Meta<typeof MultiSelect> = {
  title: "Components/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A multi-select component with chips, search filtering, max selection limit, and clear all functionality.",
      },
    },
  },
  args: {
    placeholder: "Select...",
    disabled: false,
    autoFlip: true,
    maxHeight: 240,
    searchable: false,
    maxVisibleChips: 3,
  },
  argTypes: {
    disabled: { control: "boolean" },
    autoFlip: { control: "boolean" },
    searchable: { control: "boolean" },
    maxHeight: { control: "number" },
    maxSelected: { control: "number" },
    maxVisibleChips: { control: "number" },
    placeholder: { control: "text" },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: MultiSelectProps) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className="w-80">
        <MultiSelect {...args} options={sampleOptions} value={value} onChange={(v) => setValue(v)} />
      </div>
    );
  },
};

// ── With Preselected ─────────────────────────

export const Preselected: Story = {
  render: (args: MultiSelectProps) => {
    const [value, setValue] = useState(["react", "nextjs", "svelte"]);
    return (
      <div className="w-80">
        <MultiSelect {...args} options={sampleOptions} value={value} onChange={(v) => setValue(v)} />
      </div>
    );
  },
};

// ── Searchable ───────────────────────────────

export const Searchable: Story = {
  render: (args: MultiSelectProps) => {
    const [value, setValue] = useState<string[]>(["react"]);
    return (
      <div className="w-80">
        <MultiSelect {...args} options={sampleOptions} value={value} onChange={(v) => setValue(v)} searchable />
      </div>
    );
  },
};

// ── Max Selected ─────────────────────────────

export const MaxSelected: Story = {
  render: (args: MultiSelectProps) => {
    const [value, setValue] = useState<string[]>(["react", "vue"]);
    return (
      <div className="w-80">
        <MultiSelect {...args} options={sampleOptions} value={value} onChange={(v) => setValue(v)} maxSelected={3} />
      </div>
    );
  },
};

// ── Overflow Chips ───────────────────────────

export const OverflowChips: Story = {
  render: (args: MultiSelectProps) => {
    const [value, setValue] = useState(["react", "vue", "angular", "svelte", "nextjs"]);
    return (
      <div className="w-80">
        <MultiSelect {...args} options={sampleOptions} value={value} onChange={(v) => setValue(v)} />
      </div>
    );
  },
};

// ── Disabled ─────────────────────────────────

export const Disabled: Story = {
  render: (args: MultiSelectProps) => (
    <div className="w-80">
      <MultiSelect {...args} options={sampleOptions} value={["react", "vue"]} disabled />
    </div>
  ),
};
