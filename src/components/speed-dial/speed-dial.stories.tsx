import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText, Image, Link, Share, Mail, Copy, Edit, Trash2, Plus, Upload, Download, MessageSquare } from "lucide-react";
import { SpeedDial, type SpeedDialProps } from "./speed-dial";

const meta: Meta<typeof SpeedDial> = {
  title: "Components/SpeedDial",
  component: SpeedDial,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A floating action button that expands to reveal a set of actions. Supports 4 directions, 3 sizes, tooltips, custom icons, controlled mode, and click-outside/escape close.",
      },
    },
  },
  args: {
    direction: "up",
    size: "md",
    disabled: false,
  },
  argTypes: {
    direction: { control: "select", options: ["up", "down", "left", "right"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    onOpenChange: { action: "openChanged" },
  },
};

export default meta;
type Story = StoryObj<typeof SpeedDial>;

const defaultActions = [
  { id: "copy", icon: <Copy />, label: "Copy", onClick: () => alert("Copied!") },
  { id: "share", icon: <Share />, label: "Share" },
  { id: "edit", icon: <Edit />, label: "Edit" },
  { id: "delete", icon: <Trash2 />, label: "Delete" },
];

// ── Default (Up) ─────────────────────────────

export const Default: Story = {
  render: (args: SpeedDialProps) => (
    <div className="flex justify-center items-end h-75 p-10">
      <SpeedDial {...args} actions={defaultActions} />
    </div>
  ),
};

// ── Directions ───────────────────────────────

export const Directions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-10 p-20">
      <div className="flex justify-center items-end h-50">
        <div>
          <span className="text-xs text-zinc-400 block text-center mb-2">up</span>
          <SpeedDial direction="up" actions={defaultActions.slice(0, 3)} />
        </div>
      </div>
      <div className="flex justify-center items-start h-50">
        <div>
          <span className="text-xs text-zinc-400 block text-center mb-2">down</span>
          <SpeedDial direction="down" actions={defaultActions.slice(0, 3)} />
        </div>
      </div>
      <div className="flex justify-end items-center h-25">
        <div className="flex flex-col items-end">
          <span className="text-xs text-zinc-400 mb-2">left</span>
          <SpeedDial direction="left" actions={defaultActions.slice(0, 3)} />
        </div>
      </div>
      <div className="flex justify-start items-center h-25">
        <div>
          <span className="text-xs text-zinc-400 mb-2 block">right</span>
          <SpeedDial direction="right" actions={defaultActions.slice(0, 3)} />
        </div>
      </div>
    </div>
  ),
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-15 items-end h-70 p-10">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <span className="text-xs text-zinc-400">{size}</span>
          <SpeedDial size={size} actions={defaultActions.slice(0, 3)} />
        </div>
      ))}
    </div>
  ),
};

// ── Custom Icon ──────────────────────────────

export const CustomIcon: Story = {
  render: (args: SpeedDialProps) => (
    <div className="flex justify-center items-end h-75 p-10">
      <SpeedDial
        {...args}
        icon={<Plus />}
        actions={[
          { id: "doc", icon: <FileText />, label: "New Document" },
          { id: "img", icon: <Image />, label: "Upload Image" },
          { id: "link", icon: <Link />, label: "Add Link" },
        ]}
      />
    </div>
  ),
};

// ── With Disabled Actions ────────────────────

export const WithDisabledActions: Story = {
  render: (args: SpeedDialProps) => (
    <div className="flex justify-center items-end h-75 p-10">
      <SpeedDial
        {...args}
        actions={[
          { id: "upload", icon: <Upload />, label: "Upload" },
          { id: "download", icon: <Download />, label: "Download" },
          { id: "share", icon: <Share />, label: "Share", disabled: true },
          { id: "delete", icon: <Trash2 />, label: "Delete", disabled: true },
        ]}
      />
    </div>
  ),
};

// ── Controlled ───────────────────────────────

export const Controlled: Story = {
  render: (args: SpeedDialProps) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4 h-75 justify-end p-10">
        <span className="text-xs text-zinc-400">State: {open ? "open" : "closed"}</span>
        <SpeedDial {...args} open={open} onOpenChange={setOpen} actions={defaultActions} />
      </div>
    );
  },
};

// ── Chat FAB ─────────────────────────────────

export const ChatFAB: Story = {
  render: (args: SpeedDialProps) => (
    <div className="relative h-100 border border-dashed border-zinc-200 rounded-xl overflow-hidden">
      <div className="p-6 text-sm text-zinc-400">Page content area</div>
      <div className="absolute bottom-6 right-6">
        <SpeedDial
          {...args}
          icon={<MessageSquare />}
          actions={[
            { id: "email", icon: <Mail />, label: "Email Support" },
            { id: "chat", icon: <MessageSquare />, label: "Live Chat" },
            { id: "docs", icon: <FileText />, label: "Documentation" },
          ]}
        />
      </div>
    </div>
  ),
};

// ── Disabled ─────────────────────────────────

export const Disabled: Story = {
  render: (args: SpeedDialProps) => (
    <div className="flex justify-center items-end h-50 p-10">
      <SpeedDial {...args} disabled actions={defaultActions} />
    </div>
  ),
};
