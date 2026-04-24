import { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorIcon, WarningIcon, InfoIcon } from "../../lib/icons";
import { Button } from "../button";
import { AlertDialog } from "./alert-dialog";

const meta: Meta<typeof AlertDialog> = {
  title: "Components/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A confirmation dialog for destructive or critical actions. Unlike Dialog, it cannot be dismissed by clicking the backdrop — the user must explicitly confirm or cancel.",
      },
      source: { type: "dynamic" },
    },
  },
  args: {
    color: "default",
  },
  argTypes: {
    color: { control: "select", options: ["default", "danger", "warning"] },
    open: { table: { disable: true } },
    defaultOpen: { control: "boolean" },
    onOpenChange: { action: "openChanged" },
    children: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

// ── Playground ───────────────────────────────

export const Playground: Story = {
  args: {
    defaultOpen: false,
  },
  render: ({ defaultOpen, ...args }) => {
    const [open, setOpen] = useState(defaultOpen ?? false);
    useEffect(() => { setOpen(defaultOpen ?? false); }, [defaultOpen]);
    return (
      <AlertDialog {...args} open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger asChild>
          <Button variant="outline">Open Alert Dialog</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header icon={<ErrorIcon />}>
            Confirm Action
          </AlertDialog.Header>
          <AlertDialog.Description>
            This is an alert dialog. Change the <strong>color</strong> control above to see the icon style update.
          </AlertDialog.Description>
          <AlertDialog.Footer>
            <AlertDialog.Cancel asChild>
              <Button variant="outline" size="sm">Cancel</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button size="sm" color="black">Confirm</Button>
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    );
  },
};

// ── Delete Confirmation ──────────────────────

export const DeleteConfirmation: Story = {
  render: (args) => (
    <AlertDialog {...args} color="danger">
      <AlertDialog.Trigger asChild>
        <Button variant="outline">Delete Account</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header icon={<ErrorIcon />}>
          Delete Account?
        </AlertDialog.Header>
        <AlertDialog.Description>
          This action is permanent and cannot be undone. All your data, projects, and settings will be permanently removed from our servers.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel asChild>
            <Button variant="outline" size="sm">Cancel</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button size="sm" color="black">Delete</Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  ),
};

// ── Warning ──────────────────────────────────

export const Warning: Story = {
  render: (args) => (
    <AlertDialog {...args} color="warning">
      <AlertDialog.Trigger asChild>
        <Button variant="outline">Discard Changes</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header icon={<WarningIcon />}>
          Unsaved Changes
        </AlertDialog.Header>
        <AlertDialog.Description>
          You have unsaved changes that will be lost if you leave this page. Are you sure you want to discard them?
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel asChild>
            <Button variant="outline" size="sm">Keep Editing</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button size="sm" color="black">Discard</Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  ),
};

// ── Logout ───────────────────────────────────

export const Logout: Story = {
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialog.Trigger asChild>
        <Button variant="outline">Sign Out</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header icon={<InfoIcon />}>
          Sign Out?
        </AlertDialog.Header>
        <AlertDialog.Description>
          You will be signed out of your account. Any unsaved work will be preserved for your next session.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel asChild>
            <Button variant="outline" size="sm">Stay</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button size="sm" color="black">Sign Out</Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  ),
};

// ── Without Icon ─────────────────────────────

export const WithoutIcon: Story = {
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialog.Trigger asChild>
        <Button variant="outline">Reset Settings</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          Reset to Defaults?
        </AlertDialog.Header>
        <AlertDialog.Description>
          All your custom preferences and configurations will be restored to their original default values.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel asChild>
            <Button variant="outline" size="sm">Cancel</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button size="sm" color="black">Reset</Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  ),
};

// ── Controlled ───────────────────────────────

export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => setOpen(true)}>Revoke Access</Button>
        <span className="text-xs text-zinc-400">State: {open ? "open" : "closed"}</span>
        <AlertDialog {...args} open={open} onOpenChange={setOpen} color="danger">
          <AlertDialog.Content>
            <AlertDialog.Header icon={<ErrorIcon />}>
              Revoke API Access?
            </AlertDialog.Header>
            <AlertDialog.Description>
              All active API keys will be immediately invalidated. Applications using these keys will lose access.
            </AlertDialog.Description>
            <AlertDialog.Footer>
              <AlertDialog.Cancel asChild>
                <Button variant="outline" size="sm">Keep Access</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button size="sm" color="black" onClick={() => alert("Access revoked!")}>Revoke</Button>
              </AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </div>
    );
  },
};
