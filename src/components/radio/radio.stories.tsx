import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio, type RadioProps } from "./radio";

const ALL_COLORS = ["default", "black", "primary", "danger", "success", "warning", "info"] as const;

const meta: Meta<typeof Radio> = {
  title: "Components/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A radio button component with default, card, and list variants. Supports 7 colors, 3 sizes, label, and description.",
      },
    },
  },
  args: {
    checked: false,
    size: "sm",
    color: "default",
    variant: "default",
    disabled: false,
    label: "Radio",
  },
  argTypes: {
    variant: { control: "select", options: ["default", "card", "list"] },
    color: { control: "select", options: [...ALL_COLORS] },
    size: { control: "select", options: ["xs", "sm", "md"] },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

// ── Playground ───────────────────────────────

export const Default: Story = {};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: () => {
    const [selected, setSelected] = useState("sm");
    return (
      <div className="flex gap-6">
        {(["xs", "sm", "md"] as const).map((size) => (
          <Radio key={size} size={size} checked={selected === size} onChange={() => setSelected(size)} label={size.toUpperCase()} />
        ))}
      </div>
    );
  },
};

// ── Colors — Checked ─────────────────────────

export const ColorsChecked: Story = {
  render: (args: RadioProps) => (
    <div className="flex gap-6">
      {ALL_COLORS.map((c) => (
        <Radio {...args} key={c} color={c} checked label={c.charAt(0).toUpperCase() + c.slice(1)} />
      ))}
    </div>
  ),
};

// ── Colors — Unchecked ───────────────────────

export const ColorsUnchecked: Story = {
  render: (args: RadioProps) => (
    <div className="flex gap-6">
      {ALL_COLORS.map((c) => (
        <Radio {...args} key={c} color={c} label={c.charAt(0).toUpperCase() + c.slice(1)} />
      ))}
    </div>
  ),
};

// ── Single Selection ─────────────────────────

export const SingleSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState("option1");
    return (
      <div className="flex flex-col gap-3">
        <Radio name="plan" checked={selected === "option1"} onChange={() => setSelected("option1")} label="Free plan" description="Up to 5 projects" />
        <Radio name="plan" checked={selected === "option2"} onChange={() => setSelected("option2")} label="Pro plan" description="Unlimited projects" />
        <Radio name="plan" checked={selected === "option3"} onChange={() => setSelected("option3")} label="Enterprise" description="Custom solutions" />
      </div>
    );
  },
};

// ── With Description ─────────────────────────

export const WithDescription: Story = {
  render: () => {
    const [selected, setSelected] = useState("email");
    return (
      <div className="flex flex-col gap-4">
        <Radio color="primary" checked={selected === "email"} onChange={() => setSelected("email")} label="Email notifications" description="Receive updates via email." />
        <Radio color="primary" checked={selected === "push"} onChange={() => setSelected("push")} label="Push notifications" description="Get instant alerts on your device." />
        <Radio color="primary" size="md" checked={selected === "sms"} onChange={() => setSelected("sms")} label="SMS notifications" description="Be informed via text message." />
      </div>
    );
  },
};

// ── Disabled ─────────────────────────────────

export const Disabled: Story = {
  render: (args: RadioProps) => (
    <div className="flex gap-6">
      <Radio {...args} disabled label="Unchecked" />
      <Radio {...args} disabled checked label="Checked" color="primary" />
    </div>
  ),
};

// ── Without Label ────────────────────────────

export const WithoutLabel: Story = {
  render: () => {
    const [selected, setSelected] = useState(1);
    return (
      <div className="flex items-center gap-4">
        {[0, 1, 2].map((i) => (
          <Radio key={i} size="sm" checked={selected === i} onChange={() => setSelected(i)} />
        ))}
        <Radio size="sm" color="primary" checked />
        <Radio size="sm" color="danger" checked />
        <Radio size="sm" color="success" checked />
      </div>
    );
  },
};

// ── Variant: List ────────────────────────────

export const VariantList: Story = {
  render: () => {
    const items = ["Standard", "Express", "Overnight", "Same Day"];
    const [selected, setSelected] = useState("Standard");
    return (
      <div className="flex flex-col gap-0.5 border border-zinc-200 rounded-xl p-2 w-70">
        {items.map((name) => (
          <Radio key={name} variant="list" color="primary" checked={selected === name} onChange={() => setSelected(name)} label={name} />
        ))}
      </div>
    );
  },
};

// ── Variant: Card ────────────────────────────

export const VariantCard: Story = {
  render: () => {
    const items = ["Monthly", "Quarterly", "Yearly", "Lifetime"];
    const [selected, setSelected] = useState("Monthly");
    return (
      <div className="grid grid-cols-2 gap-2 w-80">
        {items.map((name) => (
          <Radio key={name} variant="card" size="xs" checked={selected === name} onChange={() => setSelected(name)} label={name} />
        ))}
      </div>
    );
  },
};

// ── Variant: Card Colors ─────────────────────

export const VariantCardColors: Story = {
  render: () => {
    const [selected, setSelected] = useState("primary");
    return (
      <div className="grid grid-cols-2 gap-2 w-80">
        {ALL_COLORS.map((c) => (
          <Radio key={c} variant="card" color={c} checked={selected === c} onChange={() => setSelected(c)} label={c.charAt(0).toUpperCase() + c.slice(1)} />
        ))}
      </div>
    );
  },
};
