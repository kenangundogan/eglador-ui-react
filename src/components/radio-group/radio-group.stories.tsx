import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio } from "../radio";
import { RadioGroup, type RadioGroupProps } from "./radio-group";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Groups multiple radio buttons together with bordered or segmented variants.",
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
type Story = StoryObj<typeof RadioGroup>;

// ── Bordered ─────────────────────────────────

export const Bordered: Story = {
  render: (args: RadioGroupProps) => {
    const [selected, setSelected] = useState("all");
    return (
      <RadioGroup {...args}>
        <Radio size="xs" checked={selected === "all"} onChange={() => setSelected("all")} label="All" className="px-3 py-2" />
        <Radio size="xs" checked={selected === "active"} onChange={() => setSelected("active")} label="Active" className="px-3 py-2" />
        <Radio size="xs" checked={selected === "inactive"} onChange={() => setSelected("inactive")} label="Inactive" className="px-3 py-2" />
      </RadioGroup>
    );
  },
};

// ── Segmented ────────────────────────────────

export const Segmented: Story = {
  args: { variant: "segmented" },
  render: (args: RadioGroupProps) => {
    const [selected, setSelected] = useState("day");
    return (
      <RadioGroup {...args}>
        <Radio size="xs" checked={selected === "day"} onChange={() => setSelected("day")} label="Day" className="px-3 py-2 rounded-md" />
        <Radio size="xs" checked={selected === "week"} onChange={() => setSelected("week")} label="Week" className="px-3 py-2 rounded-md" />
        <Radio size="xs" checked={selected === "month"} onChange={() => setSelected("month")} label="Month" className="px-3 py-2 rounded-md" />
      </RadioGroup>
    );
  },
};
