import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown, Plus, Minus, Settings } from "lucide-react";
import { Button } from "../button";
import { Collapsible, type CollapsibleProps } from "./collapsible";

const meta: Meta<typeof Collapsible> = {
  title: "Components/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A headless collapsible component with compound API. Provides open/close logic and animation without imposing visual styles — fully customizable via Trigger and Content.",
      },
    },
  },
  args: {
    defaultOpen: false,
    disabled: false,
  },
  argTypes: {
    defaultOpen: { control: "boolean" },
    disabled: { control: "boolean" },
    onOpenChange: { action: "openChanged" },
  },
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: CollapsibleProps) => (
    <div className="max-w-md">
      <Collapsible {...args}>
        <Collapsible.Trigger asChild>
          <Button variant="outline" iconRight={<ChevronDown />} className="w-full justify-between">
            Show more
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="mt-3 p-4 bg-zinc-50 rounded-lg text-sm text-zinc-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
          </div>
        </Collapsible.Content>
      </Collapsible>
    </div>
  ),
};

// ── With Custom Trigger ──────────────────────

export const CustomTrigger: Story = {
  render: (args: CollapsibleProps) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="max-w-md">
        <Collapsible {...args} open={open} onOpenChange={setOpen}>
          <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
            <span className="text-sm font-semibold text-zinc-900">Advanced Settings</span>
            <Collapsible.Trigger asChild>
              <Button size="xs" variant="ghost" icon={open ? <Minus /> : <Plus />} />
            </Collapsible.Trigger>
          </div>
          <Collapsible.Content>
            <div className="flex flex-col gap-3 mt-2 p-3 border border-zinc-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">Cache duration</span>
                <span className="text-sm font-medium text-zinc-900">3600s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">Max retries</span>
                <span className="text-sm font-medium text-zinc-900">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">Timeout</span>
                <span className="text-sm font-medium text-zinc-900">30s</span>
              </div>
            </div>
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  },
};

// ── FAQ Style ────────────────────────────────

export const FAQStyle: Story = {
  render: () => {
    const faqs = [
      { q: "What is this library?", a: "A lightweight React UI component library built with Tailwind CSS v4. It provides a comprehensive set of accessible, customizable components for building modern interfaces." },
      { q: "How do I install it?", a: "Run npm install eglador-ui-react and add the Tailwind source directive to your global CSS file. See the README for detailed setup instructions." },
      { q: "Is it free to use?", a: "Yes, the library is open source and available under the MIT license. You can use it in personal and commercial projects without any restrictions." },
    ];
    return (
      <div className="flex flex-col gap-2 max-w-lg">
        {faqs.map((faq, i) => (
          <Collapsible key={i} className="border border-zinc-200 rounded-lg">
            <Collapsible.Trigger className="flex items-center justify-between w-full p-3 text-left text-sm font-semibold text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors">
              {faq.q}
              <ChevronDown className="size-4 text-zinc-400 shrink-0" />
            </Collapsible.Trigger>
            <Collapsible.Content>
              <div className="px-3 pb-3 text-sm text-zinc-500 leading-relaxed">
                {faq.a}
              </div>
            </Collapsible.Content>
          </Collapsible>
        ))}
      </div>
    );
  },
};

// ── Nested ───────────────────────────────────

export const Nested: Story = {
  render: () => (
    <div className="max-w-md">
      <Collapsible defaultOpen className="border border-zinc-200 rounded-lg p-3">
        <Collapsible.Trigger className="flex items-center gap-2 w-full text-left text-sm font-semibold text-zinc-900">
          <Settings className="size-4 text-zinc-400" />
          Settings
          <ChevronDown className="size-4 text-zinc-400 ml-auto" />
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="flex flex-col gap-2 mt-3">
            <Collapsible className="bg-zinc-50 rounded-lg p-2.5">
              <Collapsible.Trigger className="flex items-center justify-between w-full text-left text-xs font-medium text-zinc-700">
                General
                <ChevronDown className="size-3 text-zinc-400" />
              </Collapsible.Trigger>
              <Collapsible.Content>
                <p className="mt-2 text-xs text-zinc-500">Language, timezone, and display preferences.</p>
              </Collapsible.Content>
            </Collapsible>
            <Collapsible className="bg-zinc-50 rounded-lg p-2.5">
              <Collapsible.Trigger className="flex items-center justify-between w-full text-left text-xs font-medium text-zinc-700">
                Privacy
                <ChevronDown className="size-3 text-zinc-400" />
              </Collapsible.Trigger>
              <Collapsible.Content>
                <p className="mt-2 text-xs text-zinc-500">Data sharing, cookies, and tracking preferences.</p>
              </Collapsible.Content>
            </Collapsible>
          </div>
        </Collapsible.Content>
      </Collapsible>
    </div>
  ),
};

// ── Disabled ─────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <div className="max-w-md">
      <Collapsible disabled>
        <Collapsible.Trigger asChild>
          <Button variant="outline" className="w-full">Disabled Collapsible</Button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <p className="mt-3 text-sm text-zinc-600">This content is hidden and cannot be toggled.</p>
        </Collapsible.Content>
      </Collapsible>
    </div>
  ),
};

// ── Controlled ───────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col gap-3 max-w-md">
        <div className="flex items-center gap-3">
          <Button size="xs" color="black" onClick={() => setOpen(!open)}>
            {open ? "Close" : "Open"}
          </Button>
          <span className="text-xs text-zinc-400">State: {open ? "open" : "closed"}</span>
        </div>
        <Collapsible open={open} onOpenChange={setOpen}>
          <Collapsible.Content>
            <div className="p-4 bg-zinc-50 rounded-lg text-sm text-zinc-600">
              This content is controlled externally. Use the button above to toggle.
            </div>
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  },
};
