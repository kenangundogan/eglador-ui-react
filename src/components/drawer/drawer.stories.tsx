import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { Link } from "../link";
import { ScrollArea } from "../scroll-area";
import { Drawer } from "./drawer";

const meta: Meta<typeof Drawer> = {
  title: "Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A slide-out drawer panel with left/right/top/bottom positioning, multiple sizes, backdrop/escape close, and compound API.",
      },
    },
  },
  args: {
    side: "right",
    size: "md",
    closeOnBackdrop: true,
    closeOnEscape: true,
  },
  argTypes: {
    side: { control: "select", options: ["left", "right", "top", "bottom"] },
    size: { control: "select", options: ["sm", "md", "lg", "full"] },
    closeOnBackdrop: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    onOpenChange: { action: "openChanged" },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

// ── Default (Right) ──────────────────────────

export const Default: Story = {
  render: (args) => (
    <Drawer {...args}>
      <Drawer.Trigger asChild>
        <Button color="black">Open Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>Drawer Title</Drawer.Header>
        <Drawer.Body>
          <p>This is a drawer panel that slides in from the right side of the screen. It can contain any content.</p>
          <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </Drawer.Body>
        <Drawer.Footer>
          <Button color="black" size="sm">Save</Button>
          <Drawer.Trigger asChild>
            <Button variant="outline" size="sm">Cancel</Button>
          </Drawer.Trigger>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  ),
};

// ── Left Side ────────────────────────────────

export const LeftSide: Story = {
  render: (args) => (
    <Drawer {...args} side="left">
      <Drawer.Trigger asChild>
        <Button variant="outline">Open Left</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>Navigation</Drawer.Header>
        <Drawer.Body>
          <nav className="flex flex-col gap-2">
            {["Dashboard", "Projects", "Team", "Settings"].map((item) => (
              <Link key={item} href="#" variant="ghost" color="black" className="px-3 py-2 rounded-lg hover:bg-zinc-100 font-medium">
                {item}
              </Link>
            ))}
          </nav>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  ),
};

// ── Top Side ─────────────────────────────────

export const TopSide: Story = {
  render: (args) => (
    <Drawer {...args} side="top" size="sm">
      <Drawer.Trigger asChild>
        <Button variant="outline">Open Top</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>Notification</Drawer.Header>
        <Drawer.Body>
          <p>This drawer slides in from the top of the screen.</p>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  ),
};

// ── Bottom Side ──────────────────────────────

export const BottomSide: Story = {
  render: (args) => (
    <Drawer {...args} side="bottom" size="sm">
      <Drawer.Trigger asChild>
        <Button variant="outline">Open Bottom</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>Actions</Drawer.Header>
        <Drawer.Body>
          <div className="flex gap-3">
            <Button color="black" size="sm" className="flex-1">Share</Button>
            <Button color="danger" size="sm" className="flex-1">Delete</Button>
          </div>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  ),
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Drawer key={size} side="right" size={size}>
          <Drawer.Trigger asChild>
            <Button variant="outline">{size.toUpperCase()}</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>Size: {size}</Drawer.Header>
            <Drawer.Body>This drawer uses the "{size}" size variant.</Drawer.Body>
            <Drawer.Footer>
              <Button color="black" size="sm">Close</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      ))}
    </div>
  ),
};

// ── Controlled ───────────────────────────────

export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex items-center gap-3">
        <Button color="black" onClick={() => setOpen(true)}>Open Controlled</Button>
        <span className="text-xs text-zinc-400">State: {open ? "open" : "closed"}</span>
        <Drawer {...args} open={open} onOpenChange={setOpen}>
          <Drawer.Content>
            <Drawer.Header>Controlled Drawer</Drawer.Header>
            <Drawer.Body>This drawer is controlled externally via the open prop.</Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button color="black" size="sm" onClick={() => setOpen(false)}>Confirm</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </div>
    );
  },
};

// ── No Backdrop Close ────────────────────────

export const NoBackdropClose: Story = {
  render: (args) => (
    <Drawer {...args} closeOnBackdrop={false}>
      <Drawer.Trigger asChild>
        <Button variant="outline">Persistent Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>Persistent</Drawer.Header>
        <Drawer.Body>This drawer cannot be closed by clicking the backdrop. Use the X button or Escape key.</Drawer.Body>
        <Drawer.Footer>
          <Button color="black" size="sm">Close</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  ),
};

// ── With Scrollable Content ──────────────────

export const ScrollableContent: Story = {
  render: (args) => (
    <Drawer {...args} size="sm">
      <Drawer.Trigger asChild>
        <Button color="black">Open Scrollable</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>Long Content</Drawer.Header>
        <Drawer.Body>
          <ScrollArea orientation="vertical" scrollbarVisibility="hover" maxHeight="calc(100vh - 160px)">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className="mb-4">Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
            ))}
          </ScrollArea>
        </Drawer.Body>
        <Drawer.Footer>
          <Button color="black" size="sm">Done</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  ),
};
