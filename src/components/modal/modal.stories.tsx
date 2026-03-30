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
