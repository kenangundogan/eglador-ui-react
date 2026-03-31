import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertTriangle, Trash2, Info } from "lucide-react";
import { Button } from "../button";
import { Modal } from "./modal";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A compound modal dialog with portal rendering, body scroll lock, backdrop/escape close, and multiple sizes.",
      },
    },
  },
  args: {
    size: "md",
    closeOnBackdrop: true,
    closeOnEscape: true,
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    closeOnBackdrop: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    onOpenChange: { action: "openChanged" },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <Modal {...args}>
      <Modal.Trigger asChild>
        <Button color="primary">Open Modal</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>Welcome</Modal.Header>
        <Modal.Body>
          This is a basic modal dialog. You can close it by clicking the X button, pressing Escape, or clicking the backdrop.
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" size="sm">Got it</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  ),
};

// ── With Icon Header ─────────────────────────

export const WithIcon: Story = {
  render: (args) => (
    <Modal {...args}>
      <Modal.Trigger asChild>
        <Button color="primary">Open Info Modal</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header icon={<Info className="size-5" />}>
          Information
        </Modal.Header>
        <Modal.Body>
          This modal has an icon in the header section. You can pass any React node as the icon prop.
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" size="sm">Understood</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  ),
};

// ── Confirmation Dialog ──────────────────────

export const Confirmation: Story = {
  render: (args) => (
    <Modal {...args} size="sm">
      <Modal.Trigger asChild>
        <Button color="danger" variant="outline">Delete Item</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header icon={<AlertTriangle className="size-5" />}>
          Are you sure?
        </Modal.Header>
        <Modal.Body>
          This action cannot be undone. This will permanently delete the item and all associated data.
        </Modal.Body>
        <Modal.Footer>
          <Modal.Trigger asChild>
            <Button variant="outline" size="sm">Cancel</Button>
          </Modal.Trigger>
          <Button color="danger" size="sm" icon={<Trash2 />}>Delete</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  ),
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Modal key={size} size={size}>
          <Modal.Trigger asChild>
            <Button variant="outline">{size.toUpperCase()}</Button>
          </Modal.Trigger>
          <Modal.Content>
            <Modal.Header>Size: {size}</Modal.Header>
            <Modal.Body>This modal is using the "{size}" size variant.</Modal.Body>
            <Modal.Footer>
              <Button color="primary" size="sm">Close</Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      ))}
    </div>
  ),
};

// ── Controlled ───────────────────────────────

export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button color="primary" onClick={() => setOpen(true)}>Open Controlled</Button>
        <span className="text-xs text-zinc-400">State: {open ? "open" : "closed"}</span>
        <Modal {...args} open={open} onOpenChange={setOpen}>
          <Modal.Content>
            <Modal.Header>Controlled Modal</Modal.Header>
            <Modal.Body>This modal is controlled externally via the open prop.</Modal.Body>
            <Modal.Footer>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button color="primary" size="sm" onClick={() => setOpen(false)}>Confirm</Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </div>
    );
  },
};

// ── No Backdrop Close ────────────────────────

export const NoBackdropClose: Story = {
  render: (args) => (
    <Modal {...args} closeOnBackdrop={false}>
      <Modal.Trigger asChild>
        <Button variant="outline">Persistent Modal</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>Persistent</Modal.Header>
        <Modal.Body>
          This modal cannot be closed by clicking the backdrop. Use the X button or Escape key instead.
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" size="sm">Close</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  ),
};

// ── Scrollable Content ───────────────────────

export const ScrollableContent: Story = {
  render: (args) => (
    <Modal {...args} size="md">
      <Modal.Trigger asChild>
        <Button color="primary">Terms & Conditions</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>Terms of Service</Modal.Header>
        <Modal.Body className="max-h-60 overflow-y-auto">
          {Array.from({ length: 10 }, (_, i) => (
            <p key={i} className="mb-3">
              Section {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Modal.Trigger asChild>
            <Button variant="outline" size="sm">Decline</Button>
          </Modal.Trigger>
          <Button color="primary" size="sm">Accept</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  ),
};

// ── Form Modal ───────────────────────────────

export const FormModal: Story = {
  render: (args) => (
    <Modal {...args}>
      <Modal.Trigger asChild>
        <Button color="primary">Edit Profile</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>Edit Profile</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700">First Name</label>
                <input className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg bg-zinc-50" placeholder="John" />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700">Last Name</label>
                <input className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg bg-zinc-50" placeholder="Doe" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Email</label>
              <input className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg bg-zinc-50" placeholder="john@example.com" type="email" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Bio</label>
              <textarea className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg bg-zinc-50 resize-none" rows={3} placeholder="Tell us about yourself..." />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Trigger asChild>
            <Button variant="outline" size="sm">Cancel</Button>
          </Modal.Trigger>
          <Button color="primary" size="sm">Save Changes</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  ),
};
