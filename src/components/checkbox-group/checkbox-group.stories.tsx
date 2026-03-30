import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../checkbox";
import { CheckboxGroup, type CheckboxGroupProps } from "./checkbox-group";

const meta: Meta<typeof CheckboxGroup> = {
  title: "Components/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Groups multiple checkboxes together with bordered or segmented variants.",
      },
    },
  },
  args: {
    variant: "bordered",
  },
  argTypes: {
    variant: { control: "select", options: ["bordered", "segmented"] },
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

// ── Bordered ─────────────────────────────────

export const Bordered: Story = {
  render: (args: CheckboxGroupProps) => {
    const [checks, setChecks] = useState({ all: true, local: false, video: false });
    return (
      <CheckboxGroup {...args}>
        <Checkbox size="xs" checked={checks.all} onChange={() => setChecks((p) => ({ ...p, all: !p.all }))} label="All" className="px-3 py-2" />
        <Checkbox size="xs" checked={checks.local} onChange={() => setChecks((p) => ({ ...p, local: !p.local }))} label="Local" className="px-3 py-2" />
        <Checkbox size="xs" checked={checks.video} onChange={() => setChecks((p) => ({ ...p, video: !p.video }))} label="Video" className="px-3 py-2" />
      </CheckboxGroup>
    );
  },
};

// ── Segmented ────────────────────────────────

export const Segmented: Story = {
  args: { variant: "segmented" },
  render: (args: CheckboxGroupProps) => {
    const [checks, setChecks] = useState({ all: true, flash: false });
    return (
      <CheckboxGroup {...args}>
        <Checkbox size="xs" checked={checks.all} onChange={() => setChecks((p) => ({ ...p, all: !p.all }))} label="All" className="px-3 py-2 rounded-md" />
        <Checkbox size="xs" checked={checks.flash} onChange={() => setChecks((p) => ({ ...p, flash: !p.flash }))} label="Flash" className="px-3 py-2 rounded-md" />
      </CheckboxGroup>
    );
  },
};
