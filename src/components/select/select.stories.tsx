import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select, type SelectProps } from "./select";

const sampleOptions = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Next.js", value: "nextjs" },
  { label: "Remix", value: "remix" },
  { label: "Gatsby", value: "gatsby" },
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A single-select dropdown with auto-flip positioning, keyboard support, and customizable options.",
      },
    },
  },
  args: {
    placeholder: "Select...",
    disabled: false,
    autoFlip: true,
    maxHeight: 240,
  },
  argTypes: {
    disabled: { control: "boolean" },
    autoFlip: { control: "boolean" },
    maxHeight: { control: "number" },
    placeholder: { control: "text" },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: SelectProps) => {
    const [value, setValue] = useState<string | undefined>();
    return (
      <div className="w-70">
        <Select {...args} options={sampleOptions} value={value} onChange={(v) => setValue(v)} />
      </div>
    );
  },
};

// ── With Preselected Value ───────────────────

export const Preselected: Story = {
  render: (args: SelectProps) => {
    const [value, setValue] = useState("react");
    return (
      <div className="w-70">
        <Select {...args} options={sampleOptions} value={value} onChange={(v) => setValue(v)} />
      </div>
    );
  },
};

// ── Disabled ─────────────────────────────────

export const Disabled: Story = {
  render: (args: SelectProps) => (
    <div className="w-70">
      <Select {...args} options={sampleOptions} value="react" disabled />
    </div>
  ),
};

// ── Empty Options ────────────────────────────

export const EmptyOptions: Story = {
  render: (args: SelectProps) => {
    const [value, setValue] = useState<string | undefined>();
    return (
      <div className="w-70">
        <Select {...args} options={[]} value={value} onChange={(v) => setValue(v)} placeholder="No options available" />
      </div>
    );
  },
};

// ── Many Options (Scroll) ────────────────────

export const ManyOptions: Story = {
  render: (args: SelectProps) => {
    const manyOptions = Array.from({ length: 20 }, (_, i) => ({
      label: `Option ${i + 1}`,
      value: `option-${i + 1}`,
    }));
    const [value, setValue] = useState<string | undefined>();
    return (
      <div className="w-70">
        <Select {...args} options={manyOptions} value={value} onChange={(v) => setValue(v)} maxHeight={200} />
      </div>
    );
  },
};
