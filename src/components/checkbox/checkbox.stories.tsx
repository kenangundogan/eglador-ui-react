import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, type CheckboxProps } from "./checkbox";

const ALL_COLORS = ["default", "black", "primary", "danger", "success", "warning", "info"] as const;

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A checkbox component with default, card, and list variants. Supports 7 colors, 3 sizes, indeterminate state, label, and description.",
      },
    },
  },
  args: {
    checked: false,
    indeterminate: false,
    size: "sm",
    color: "default",
    variant: "default",
    disabled: false,
    label: "Checkbox",
  },
  argTypes: {
    variant: { control: "select", options: ["default", "card", "list"] },
    color: { control: "select", options: [...ALL_COLORS] },
    size: { control: "select", options: ["xs", "sm", "md"] },
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// ── Playground ───────────────────────────────

export const Default: Story = {};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: () => {
    const [checks, setChecks] = useState({ xs: false, sm: true, md: false });
    return (
      <div className="flex gap-6">
        <Checkbox size="xs" checked={checks.xs} onChange={() => setChecks((p) => ({ ...p, xs: !p.xs }))} label="Extra Small" />
        <Checkbox size="sm" checked={checks.sm} onChange={() => setChecks((p) => ({ ...p, sm: !p.sm }))} label="Small" />
        <Checkbox size="md" checked={checks.md} onChange={() => setChecks((p) => ({ ...p, md: !p.md }))} label="Medium" />
      </div>
    );
  },
};

// ── Colors — Checked ─────────────────────────

export const ColorsChecked: Story = {
  render: (args: CheckboxProps) => (
    <div className="flex gap-6">
      {ALL_COLORS.map((c) => (
        <Checkbox {...args} key={c} color={c} checked label={c.charAt(0).toUpperCase() + c.slice(1)} />
      ))}
    </div>
  ),
};

// ── Colors — Unchecked ───────────────────────

export const ColorsUnchecked: Story = {
  render: (args: CheckboxProps) => (
    <div className="flex gap-6">
      {ALL_COLORS.map((c) => (
        <Checkbox {...args} key={c} color={c} label={c.charAt(0).toUpperCase() + c.slice(1)} />
      ))}
    </div>
  ),
};

// ── With Label ───────────────────────────────

export const WithLabel: Story = {
  render: () => {
    const [checks, setChecks] = useState({ terms: false, remember: true });
    return (
      <div className="flex flex-col gap-3">
        <Checkbox checked={checks.terms} onChange={() => setChecks((p) => ({ ...p, terms: !p.terms }))} label="I accept the terms and conditions" />
        <Checkbox checked={checks.remember} onChange={() => setChecks((p) => ({ ...p, remember: !p.remember }))} label="Remember me" />
      </div>
    );
  },
};

// ── Label + Description ──────────────────────

export const LabelDescription: Story = {
  render: () => {
    const [checks, setChecks] = useState({ email: true, push: false, sms: false });
    return (
      <div className="flex flex-col gap-4">
        <Checkbox
          checked={checks.email}
          onChange={() => setChecks((p) => ({ ...p, email: !p.email }))}
          label="Email Notifications"
          description="Receive emails for news and updates."
        />
        <Checkbox
          checked={checks.push}
          onChange={() => setChecks((p) => ({ ...p, push: !p.push }))}
          label="Push Notifications"
          description="Get instant alerts for breaking news."
        />
        <Checkbox
          size="md"
          checked={checks.sms}
          onChange={() => setChecks((p) => ({ ...p, sms: !p.sms }))}
          label="SMS Notifications"
          description="Be informed via SMS in emergencies."
        />
      </div>
    );
  },
};

// ── Indeterminate ────────────────────────────

export const Indeterminate: Story = {
  render: (args: CheckboxProps) => (
    <div className="flex gap-6">
      <Checkbox {...args} indeterminate label="Default" />
      <Checkbox {...args} indeterminate color="primary" label="Primary" />
      <Checkbox {...args} indeterminate color="danger" label="Danger" />
      <Checkbox {...args} indeterminate color="info" label="Info" />
    </div>
  ),
};

// ── Disabled ─────────────────────────────────

export const Disabled: Story = {
  render: (args: CheckboxProps) => (
    <div className="flex gap-6">
      <Checkbox {...args} disabled label="Unchecked" />
      <Checkbox {...args} disabled checked label="Checked" />
      <Checkbox {...args} disabled indeterminate label="Indeterminate" />
    </div>
  ),
};

// ── Without Label ────────────────────────────

export const WithoutLabel: Story = {
  render: () => {
    const [checks, setChecks] = useState({ a: true, b: false, c: true });
    return (
      <div className="flex items-center gap-4">
        <Checkbox size="xs" checked={checks.a} onChange={() => setChecks((p) => ({ ...p, a: !p.a }))} />
        <Checkbox size="sm" checked={checks.b} onChange={() => setChecks((p) => ({ ...p, b: !p.b }))} />
        <Checkbox size="md" checked={checks.c} onChange={() => setChecks((p) => ({ ...p, c: !p.c }))} />
        <Checkbox size="sm" color="primary" checked />
        <Checkbox size="sm" color="danger" checked />
        <Checkbox size="sm" color="success" checked />
        <Checkbox size="sm" color="info" checked />
      </div>
    );
  },
};

// ── Variant: List ────────────────────────────

export const VariantList: Story = {
  render: () => {
    const items = ["Reuters", "Associated Press", "Bloomberg", "AFP", "DPA"];
    const [selected, setSelected] = useState<Record<string, boolean>>(
      Object.fromEntries(items.map((name, i) => [name, i < 3])),
    );
    return (
      <div className="flex flex-col gap-0.5 border border-zinc-200 rounded-xl p-2 w-70">
        {items.map((name) => (
          <Checkbox
            key={name}
            variant="list"
            checked={selected[name]}
            onChange={() => setSelected((p) => ({ ...p, [name]: !p[name] }))}
            label={name}
          />
        ))}
      </div>
    );
  },
};

// ── Variant: Card ────────────────────────────

export const VariantCard: Story = {
  render: () => {
    const items = ["Status", "Time", "Agency", "Category"];
    const [selected, setSelected] = useState<Record<string, boolean>>(
      Object.fromEntries(items.map((name, i) => [name, i < 2])),
    );
    return (
      <div className="grid grid-cols-2 gap-2 w-80">
        {items.map((name) => (
          <Checkbox
            key={name}
            variant="card"
            size="xs"
            checked={selected[name]}
            onChange={() => setSelected((p) => ({ ...p, [name]: !p[name] }))}
            label={name}
          />
        ))}
      </div>
    );
  },
};

// ── Variant: Card Colors ─────────────────────

export const VariantCardColors: Story = {
  render: (args: CheckboxProps) => (
    <div className="grid grid-cols-2 gap-2 w-80">
      {ALL_COLORS.map((c) => (
        <Checkbox {...args} key={c} variant="card" color={c} checked label={c.charAt(0).toUpperCase() + c.slice(1)} />
      ))}
      <Checkbox {...args} variant="card" color="primary" label="Unchecked" />
    </div>
  ),
};
