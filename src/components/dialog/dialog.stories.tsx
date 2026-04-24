import { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { InfoIcon } from "../../lib/icons";
import { Dialog } from "./dialog";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A dialog overlay component with trigger, content, header, title, description, body, footer, and close sub-components. Supports controlled/uncontrolled state, backdrop close, escape close, and multiple sizes.",
      },
      source: { type: "dynamic" },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    closeOnBackdrop: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    open: { table: { disable: true } },
    defaultOpen: { control: "boolean" },
    onOpenChange: { table: { disable: true } },
    children: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

// ── Playground ───────────────────────────────

export const Playground: Story = {
  args: {
    size: "md",
    closeOnBackdrop: true,
    closeOnEscape: true,
    defaultOpen: false,
  },
  render: ({ defaultOpen, ...args }) => {
    const [open, setOpen] = useState(defaultOpen ?? false);
    useEffect(() => { setOpen(defaultOpen ?? false); }, [defaultOpen]);
    return (
      <Dialog {...args} open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Close />
          <Dialog.Header>
            <Dialog.Title>Dialog Title</Dialog.Title>
            <Dialog.Description>Use the controls panel to adjust size, backdrop close, and escape close.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <p className="text-sm text-zinc-600">Dialog body content. Try changing the <strong>size</strong>, <strong>closeOnBackdrop</strong>, and <strong>closeOnEscape</strong> controls.</p>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.Close>
            <Button color="black" onClick={() => setOpen(false)}>Save</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    );
  },
};

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Close />
        <Dialog.Header>
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Description>This is a description of the dialog content.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <p className="text-sm text-zinc-600">Dialog body content goes here. You can place any content inside.</p>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>
          <Button color="black">Save</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="outline">Open With Icon</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Close />
        <Dialog.Header icon={<InfoIcon className="size-5" />}>
          <Dialog.Title>Information</Dialog.Title>
          <Dialog.Description>This dialog includes an icon in the header for visual emphasis.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <p className="text-sm text-zinc-600">Icons help users quickly identify the purpose of the dialog.</p>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button color="black">Got it</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const Confirmation: Story = {
  render: () => (
    <Dialog size="sm">
      <Dialog.Trigger asChild>
        <Button variant="outline">Delete Item</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Close />
        <Dialog.Header>
          <Dialog.Title>Are you sure?</Dialog.Title>
          <Dialog.Description>This action cannot be undone. This will permanently delete the item from your account.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>
          <Button color="danger">Delete</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Dialog key={size} size={size}>
          <Dialog.Trigger asChild>
            <Button variant="outline" size="sm">{size}</Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Close />
            <Dialog.Header>
              <Dialog.Title>Size: {size}</Dialog.Title>
              <Dialog.Description>This dialog uses the {size} size variant.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <p className="text-sm text-zinc-600">Content for the {size} dialog.</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close asChild>
                <Button variant="outline">Close</Button>
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setOpen(true)}>Open Controlled Dialog</Button>
        <span className="text-xs text-zinc-400">State: {open ? "open" : "closed"}</span>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Content>
            <Dialog.Close />
            <Dialog.Header>
              <Dialog.Title>Controlled Dialog</Dialog.Title>
              <Dialog.Description>This dialog is controlled by external state.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <p className="text-sm text-zinc-600">You can control this dialog programmatically.</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Button color="black" onClick={() => setOpen(false)}>Done</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </div>
    );
  },
};

export const NoBackdropClose: Story = {
  render: () => (
    <Dialog closeOnBackdrop={false}>
      <Dialog.Trigger asChild>
        <Button variant="outline">Open (No Backdrop Close)</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Close />
        <Dialog.Header>
          <Dialog.Title>Persistent Dialog</Dialog.Title>
          <Dialog.Description>Clicking the backdrop will not close this dialog. Use the close button or escape key.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button>Close</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const ScrollableContent: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="outline">Open Scrollable</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Close />
        <Dialog.Header>
          <Dialog.Title>Terms of Service</Dialog.Title>
          <Dialog.Description>Please read and accept the terms below.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="max-h-60 overflow-y-auto">
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} className="text-sm text-zinc-600 mb-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Paragraph {i + 1}.
            </p>
          ))}
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline">Decline</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button color="black">Accept</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Close />
        <Dialog.Header>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Description>Make changes to your profile here.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <form className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" defaultValue="Kenan Gundogan" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="kenan@example.com" />
            </div>
          </form>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>
          <Button color="black">Save Changes</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};
