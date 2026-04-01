import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoIcon, WarningIcon, SuccessIcon } from "../../lib/icons";
import { Accordion, type AccordionProps } from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A collapsible accordion component with default, bordered, and filled variants. Supports icon, extra content, and animated toggle.",
      },
    },
  },
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

const faqItems = [
  { title: "What are your shipping options?", content: "We offer standard shipping (5-7 business days), express shipping (2-3 business days), and overnight delivery. Free standard shipping is available on orders over $50." },
  { title: "What is your return policy?", content: "You can return any unused item within 30 days of purchase for a full refund. Items must be in their original packaging. Please contact our support team to initiate a return." },
  { title: "How can I contact customer support?", content: "Our support team is available via email at support@example.com, by phone at (555) 123-4567, or through our live chat feature. Business hours are Monday to Friday, 9am to 6pm EST." },
  { title: "Do you offer international shipping?", content: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination. Customs duties and taxes may apply." },
  { title: "How do I track my order?", content: "Once your order has shipped, you will receive an email with a tracking number. You can use this number on our website or the carrier's website to track your package in real time." },
];

export const Default: Story = {
  render: (args: AccordionProps) => (
    <div className="max-w-md flex flex-col gap-2">
      {faqItems.map((item, i) => (
        <Accordion key={item.title} {...args} title={item.title} defaultOpen={i === 0}>
          <div className="text-sm text-zinc-600 leading-relaxed pb-2">{item.content}</div>
        </Accordion>
      ))}
    </div>
  ),
};

// ── Variants ─────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-md">
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
    <div className="flex flex-col gap-3 max-w-md">
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
    <div className="flex flex-col gap-3 max-w-md">
      <Accordion variant="bordered" title="Success" icon={<SuccessIcon className="size-4" />}>
        {sampleContent}
      </Accordion>
      <Accordion variant="bordered" title="Information" icon={<InfoIcon className="size-4" />}>
        {sampleContent}
      </Accordion>
      <Accordion variant="bordered" title="Warning" icon={<WarningIcon className="size-4" />}>
        {sampleContent}
      </Accordion>
    </div>
  ),
};

// ── Multiple (FAQ style) ─────────────────────

export const Multiple: Story = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-md">
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
      <div className="flex flex-col gap-2 max-w-md">
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
    <div className="max-w-md">
      <Accordion variant="bordered" title="Disabled Section" disabled>
        {sampleContent}
      </Accordion>
    </div>
  ),
};
