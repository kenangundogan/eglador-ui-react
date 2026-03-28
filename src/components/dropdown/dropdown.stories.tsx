import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings, Edit, Trash2, Copy, Share, ChevronDown } from "lucide-react";
import { Button } from "../button";
import { Dropdown, type DropdownProps } from "./dropdown";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  args: {
    side: "bottom",
    align: "right",
    width: "auto",
    autoFlip: false,
  },
  argTypes: {
    side: { control: "select", options: ["bottom", "top", "right", "left"] },
    align: { control: "select", options: ["left", "right", "start", "center", "end"] },
    width: { control: "select", options: ["auto", "trigger", 200, 300] },
    autoFlip: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const menuItems = [
  { icon: <Edit />, label: "Edit" },
  { icon: <Copy />, label: "Duplicate" },
  { icon: <Share />, label: "Share" },
  { icon: <Trash2 />, label: "Delete", danger: true },
];

function MenuItem({ icon, label, danger, onClick }: { icon: React.ReactNode; label: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors rounded-lg ${danger ? "text-red-600 hover:bg-red-50" : "text-zinc-700 hover:bg-zinc-100"}`}
    >
      <span className="size-4 shrink-0 [&>svg]:w-full [&>svg]:h-full">{icon}</span>
      {label}
    </button>
  );
}

// ── Default (Ellipsis trigger) ───────────────

export const Default: Story = {
  render: (args: DropdownProps) => (
    <div style={{ padding: 40 }}>
      <Dropdown {...args}>
        <Dropdown.Content>
          <div className="p-1.5 min-w-45">
            {menuItems.map((item) => (
              <MenuItem key={item.label} {...item} />
            ))}
          </div>
        </Dropdown.Content>
      </Dropdown>
    </div>
  ),
};

// ── Custom Trigger ───────────────────────────

export const CustomTrigger: Story = {
  render: (args: DropdownProps) => (
    <div style={{ padding: 40 }}>
      <Dropdown {...args} align="left">
        <Dropdown.Trigger asChild>
          <Button color="primary" iconRight={<ChevronDown />}>Options</Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <div className="p-1.5 min-w-45">
            {menuItems.map((item) => (
              <MenuItem key={item.label} {...item} />
            ))}
          </div>
        </Dropdown.Content>
      </Dropdown>
    </div>
  ),
};

// ── Positioning ──────────────────────────────

export const Positioning: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32, padding: 80 }}>
      <Dropdown side="bottom" align="left">
        <Dropdown.Trigger asChild>
          <Button variant="outline">Bottom Left</Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <div className="p-3 min-w-35 text-sm text-zinc-600">Bottom Left</div>
        </Dropdown.Content>
      </Dropdown>

      <Dropdown side="bottom" align="center">
        <Dropdown.Trigger asChild>
          <Button variant="outline">Bottom Center</Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <div className="p-3 min-w-35 text-sm text-zinc-600">Bottom Center</div>
        </Dropdown.Content>
      </Dropdown>

      <Dropdown side="top" align="left">
        <Dropdown.Trigger asChild>
          <Button variant="outline">Top Left</Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <div className="p-3 min-w-35 text-sm text-zinc-600">Top Left</div>
        </Dropdown.Content>
      </Dropdown>
    </div>
  ),
};

// ── Trigger Width ────────────────────────────

export const TriggerWidth: Story = {
  render: (args: DropdownProps) => (
    <div style={{ padding: 40 }}>
      <Dropdown {...args} width="trigger" align="left">
        <Dropdown.Trigger asChild>
          <Button color="black" iconRight={<ChevronDown />} className="w-60 justify-between">Select option</Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <div className="p-1.5">
            <MenuItem icon={<Settings />} label="Settings" />
            <MenuItem icon={<Edit />} label="Edit profile" />
            <MenuItem icon={<Share />} label="Share" />
          </div>
        </Dropdown.Content>
      </Dropdown>
    </div>
  ),
};

// ── With Max Height ──────────────────────────

export const WithMaxHeight: Story = {
  render: (args: DropdownProps) => (
    <div style={{ padding: 40 }}>
      <Dropdown {...args} maxHeight={200} align="left">
        <Dropdown.Trigger asChild>
          <Button variant="outline" iconRight={<ChevronDown />}>Scrollable</Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <div className="p-1.5 min-w-45">
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i} icon={<Settings />} label={`Option ${i + 1}`} />
            ))}
          </div>
        </Dropdown.Content>
      </Dropdown>
    </div>
  ),
};

// ── Controlled ───────────────────────────────

export const Controlled: Story = {
  render: (args: DropdownProps) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 40 }}>
        <Button color="primary" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Open"} Dropdown
        </Button>
        <Dropdown {...args} open={open} onOpenChange={setOpen} align="left">
          <Dropdown.Trigger asChild>
            <Button variant="outline" iconRight={<ChevronDown />}>Controlled</Button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <div className="p-1.5 min-w-45">
              {menuItems.map((item) => (
                <MenuItem key={item.label} {...item} />
              ))}
            </div>
          </Dropdown.Content>
        </Dropdown>
      </div>
    );
  },
};
