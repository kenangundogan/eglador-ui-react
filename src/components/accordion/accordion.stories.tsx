import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings, Info, AlertTriangle } from "lucide-react";
import { Accordion, type AccordionProps } from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  args: {
    variant: "default",
    size: "sm",
    defaultOpen: true,
    disabled: false,
    hideChevron: false,
  },
  argTypes: {
    variant: { control: "select", options: ["default", "bordered", "filled"] },
    size: { control: "select", options: ["xs", "sm", "md"] },
    defaultOpen: { control: "boolean" },
    disabled: { control: "boolean" },
    hideChevron: { control: "boolean" },
    onOpenChange: { action: "openChanged" },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const sampleContent = (
  <div className="text-sm text-zinc-600 leading-relaxed">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </div>
);

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: AccordionProps) => (
    <div style={{ width: 400 }}>
      <Accordion {...args} title="Section Title">
        {sampleContent}
      </Accordion>
    </div>
  ),
};

// ── Variants ─────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 400 }}>
      <Accordion variant="default" title="Default">
        {sampleContent}
      </Accordion>
      <Accordion variant="bordered" title="Bordered">
        {sampleContent}
      </Accordion>
      <Accordion variant="filled" title="Filled">
        {sampleContent}
      </Accordion>
    </div>
  ),
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 400 }}>
      <Accordion variant="bordered" size="xs" title="Extra Small">
        {sampleContent}
      </Accordion>
      <Accordion variant="bordered" size="sm" title="Small">
        {sampleContent}
      </Accordion>
      <Accordion variant="bordered" size="md" title="Medium">
        {sampleContent}
      </Accordion>
    </div>
  ),
};

// ── With Icon ────────────────────────────────

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 400 }}>
      <Accordion variant="bordered" title="Settings" icon={<Settings className="size-4" />}>
        {sampleContent}
      </Accordion>
      <Accordion variant="bordered" title="Information" icon={<Info className="size-4" />}>
        {sampleContent}
      </Accordion>
      <Accordion variant="bordered" title="Warning" icon={<AlertTriangle className="size-4" />}>
        {sampleContent}
      </Accordion>
    </div>
  ),
};

// ── Multiple (FAQ style) ─────────────────────

export const Multiple: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 400 }}>
      {["What is this?", "How does it work?", "Is it free?"].map((q, i) => (
        <Accordion key={q} variant="bordered" title={q} defaultOpen={i === 0}>
          <div className="text-sm text-zinc-600">
            This is the answer to "{q}". It provides detailed information about the topic.
          </div>
        </Accordion>
      ))}
    </div>
  ),
};

// ── Controlled ───────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 400 }}>
        <span className="text-xs text-zinc-400">State: {open ? "open" : "closed"}</span>
        <Accordion variant="bordered" title="Controlled" open={open} onOpenChange={setOpen}>
          {sampleContent}
        </Accordion>
      </div>
    );
  },
};

// ── Disabled ─────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <Accordion variant="bordered" title="Disabled Section" disabled>
        {sampleContent}
      </Accordion>
    </div>
  ),
};
