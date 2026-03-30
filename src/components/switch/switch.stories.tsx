import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch, type SwitchProps } from "./switch";

const ALL_COLORS = ["default", "black", "primary", "danger", "success", "warning", "info"] as const;

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A toggle switch component with 7 colors, 3 sizes, label, and description support.",
      },
    },
  },
  args: {
    checked: false,
    size: "sm",
    color: "default",
    disabled: false,
    label: "Switch",
  },
  argTypes: {
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
type Story = StoryObj<typeof Switch>;

// ── Playground ───────────────────────────────

export const Default: Story = {};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: () => {
    const [checks, setChecks] = useState({ xs: false, sm: true, md: false });
    return (
      <div style={{ display: "flex", gap: 24 }}>
        <Switch size="xs" checked={checks.xs} onChange={() => setChecks((p) => ({ ...p, xs: !p.xs }))} label="Extra Small" />
        <Switch size="sm" checked={checks.sm} onChange={() => setChecks((p) => ({ ...p, sm: !p.sm }))} label="Small" />
        <Switch size="md" checked={checks.md} onChange={() => setChecks((p) => ({ ...p, md: !p.md }))} label="Medium" />
      </div>
    );
  },
};

// ── Colors — Checked ─────────────────────────

export const ColorsChecked: Story = {
  render: (args: SwitchProps) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      {ALL_COLORS.map((c) => (
        <Switch {...args} key={c} color={c} checked label={c.charAt(0).toUpperCase() + c.slice(1)} />
      ))}
    </div>
  ),
};

// ── Colors — Unchecked ───────────────────────

export const ColorsUnchecked: Story = {
  render: (args: SwitchProps) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      {ALL_COLORS.map((c) => (
        <Switch {...args} key={c} color={c} label={c.charAt(0).toUpperCase() + c.slice(1)} />
      ))}
    </div>
  ),
};

// ── With Label ───────────────────────────────

export const WithLabel: Story = {
  render: () => {
    const [checks, setChecks] = useState({ terms: false, remember: true });
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Switch checked={checks.terms} onChange={() => setChecks((p) => ({ ...p, terms: !p.terms }))} label="Accept terms and conditions" />
        <Switch checked={checks.remember} onChange={() => setChecks((p) => ({ ...p, remember: !p.remember }))} label="Remember me" />
      </div>
    );
  },
};

// ── Label + Description ──────────────────────

export const LabelDescription: Story = {
  render: () => {
    const [checks, setChecks] = useState({ email: true, push: false, sms: false });
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Switch
          color="primary"
          checked={checks.email}
          onChange={() => setChecks((p) => ({ ...p, email: !p.email }))}
          label="Email Notifications"
          description="Receive emails for news and updates."
        />
        <Switch
          color="primary"
          checked={checks.push}
          onChange={() => setChecks((p) => ({ ...p, push: !p.push }))}
          label="Push Notifications"
          description="Get instant alerts for breaking news."
        />
        <Switch
          color="primary"
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

// ── Disabled ─────────────────────────────────

export const Disabled: Story = {
  render: (args: SwitchProps) => (
    <div style={{ display: "flex", gap: 24 }}>
      <Switch {...args} disabled label="Off (disabled)" />
      <Switch {...args} disabled checked label="On (disabled)" color="primary" />
    </div>
  ),
};

// ── Without Label ────────────────────────────

export const WithoutLabel: Story = {
  render: () => {
    const [checks, setChecks] = useState({ a: true, b: false, c: true });
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Switch size="xs" checked={checks.a} onChange={() => setChecks((p) => ({ ...p, a: !p.a }))} />
        <Switch size="sm" checked={checks.b} onChange={() => setChecks((p) => ({ ...p, b: !p.b }))} />
        <Switch size="md" checked={checks.c} onChange={() => setChecks((p) => ({ ...p, c: !p.c }))} />
        <Switch size="sm" color="primary" checked />
        <Switch size="sm" color="danger" checked />
        <Switch size="sm" color="success" checked />
      </div>
    );
  },
};

// ── Settings Panel ───────────────────────────

export const SettingsPanel: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      darkMode: false,
      notifications: true,
      analytics: true,
      marketing: false,
    });
    const toggle = (key: keyof typeof settings) =>
      setSettings((p) => ({ ...p, [key]: !p[key] }));
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320, border: "1px solid #e4e4e7", borderRadius: 12, padding: 16 }}>
        <Switch color="primary" checked={settings.darkMode} onChange={() => toggle("darkMode")} label="Dark Mode" description="Switch to dark theme." />
        <Switch color="primary" checked={settings.notifications} onChange={() => toggle("notifications")} label="Notifications" description="Enable push notifications." />
        <Switch color="primary" checked={settings.analytics} onChange={() => toggle("analytics")} label="Analytics" description="Help us improve with usage data." />
        <Switch color="primary" checked={settings.marketing} onChange={() => toggle("marketing")} label="Marketing" description="Receive promotional emails." />
      </div>
    );
  },
};
