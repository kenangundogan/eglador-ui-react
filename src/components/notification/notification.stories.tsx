import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info, CheckCircle, AlertTriangle, XCircle, Bell, Zap, Download } from "lucide-react";
import { Button } from "../button";
import { Notification, NotificationContainer, useNotification } from "./notification";

const meta: Meta<typeof Notification> = {
  title: "Components/Notification",
  component: Notification,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A toast notification system with useNotification hook. Supports 6 colors, auto-dismiss with progress bar, pause on hover, action buttons, timestamps, and stacking with max visible limit.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Notification>;

// ── Interactive Demo ─────────────────────────

export const Default: Story = {
  render: () => {
    const { notifications, push, dismiss } = useNotification();
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 flex-wrap">
          <Button size="xs" color="success" onClick={() => push({ title: "Success", message: "Your changes have been saved.", icon: <CheckCircle />, color: "success" })}>
            Success
          </Button>
          <Button size="xs" color="danger" onClick={() => push({ title: "Error", message: "Failed to save changes.", icon: <XCircle />, color: "danger" })}>
            Error
          </Button>
          <Button size="xs" color="warning" onClick={() => push({ title: "Warning", message: "Your session expires soon.", icon: <AlertTriangle />, color: "warning" })}>
            Warning
          </Button>
          <Button size="xs" color="info" onClick={() => push({ title: "Info", message: "New version available.", icon: <Info />, color: "info" })}>
            Info
          </Button>
        </div>
        <NotificationContainer position="top-right">
          {notifications.map((item) => (
            <Notification key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </NotificationContainer>
      </div>
    );
  },
};

// ── With Progress Bar ────────────────────────

export const WithProgressBar: Story = {
  render: () => {
    const { notifications, push, dismiss } = useNotification();
    return (
      <div className="flex gap-2">
        <Button size="xs" color="primary" onClick={() => push({ title: "Uploading...", message: "Your file is being processed.", icon: <Download />, color: "primary", showProgress: true, duration: 8000 })}>
          With Progress (8s)
        </Button>
        <Button size="xs" color="success" onClick={() => push({ title: "Saved", message: "Changes saved successfully.", icon: <CheckCircle />, color: "success", showProgress: true, duration: 5000 })}>
          With Progress (5s)
        </Button>
        <NotificationContainer>
          {notifications.map((item) => (
            <Notification key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </NotificationContainer>
      </div>
    );
  },
};

// ── With Actions ─────────────────────────────

export const WithActions: Story = {
  render: () => {
    const { notifications, push, dismiss } = useNotification();
    return (
      <div>
        <Button size="xs" color="primary" onClick={() => push({
          title: "New update available",
          message: "Version 2.0 is ready to install.",
          icon: <Zap />,
          color: "primary",
          duration: 0,
          actions: [
            { label: "Update now", onClick: () => alert("Updating..."), variant: "primary" },
            { label: "Later", onClick: () => dismiss(notifications[notifications.length - 1]?.id || "") },
          ],
        })}>
          Show with Actions
        </Button>
        <NotificationContainer>
          {notifications.map((item) => (
            <Notification key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </NotificationContainer>
      </div>
    );
  },
};

// ── With Timestamp ───────────────────────────

export const WithTimestamp: Story = {
  render: () => {
    const { notifications, push, dismiss } = useNotification();
    return (
      <div>
        <Button size="xs" color="info" onClick={() => push({
          title: "New message",
          message: "You have a new message from the team.",
          icon: <Bell />,
          color: "info",
          duration: 0,
          timestamp: new Date(),
        })}>
          Show with Timestamp
        </Button>
        <NotificationContainer>
          {notifications.map((item) => (
            <Notification key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </NotificationContainer>
      </div>
    );
  },
};

// ── Pause on Hover ───────────────────────────

export const PauseOnHover: Story = {
  render: () => {
    const { notifications, push, dismiss } = useNotification();
    return (
      <div className="flex flex-col gap-2">
        <Button size="xs" color="warning" onClick={() => push({
          title: "Hover to pause",
          message: "This notification pauses its timer when you hover over it.",
          icon: <AlertTriangle />,
          color: "warning",
          showProgress: true,
          duration: 6000,
          pauseOnHover: true,
        })}>
          Show (hover to pause)
        </Button>
        <span className="text-xs text-zinc-400">Hover over the notification to pause the countdown.</span>
        <NotificationContainer>
          {notifications.map((item) => (
            <Notification key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </NotificationContainer>
      </div>
    );
  },
};

// ── Positions ────────────────────────────────

export const Positions: Story = {
  render: () => {
    const { notifications, push, dismiss } = useNotification();
    const positions = ["top-right", "top-left", "top-center", "bottom-right", "bottom-left", "bottom-center"] as const;
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 flex-wrap">
          {positions.map((pos) => (
            <Button key={pos} size="xs" variant="outline" onClick={() => push({ title: pos, message: `Notification at ${pos}`, icon: <Bell />, color: "primary", id: pos })}>
              {pos}
            </Button>
          ))}
        </div>
        {positions.map((pos) => (
          <NotificationContainer key={pos} position={pos}>
            {notifications.filter((n) => n.id === pos).map((item) => (
              <Notification key={item.id} item={item} onDismiss={dismiss} />
            ))}
          </NotificationContainer>
        ))}
      </div>
    );
  },
};

// ── Max Visible (Stacking) ───────────────────

export const MaxVisible: Story = {
  render: () => {
    const { notifications, push, dismiss, dismissAll } = useNotification();
    let counter = 0;
    return (
      <div className="flex gap-2">
        <Button size="xs" color="primary" onClick={() => push({ title: `Notification ${++counter}`, message: "Click multiple times to test stacking limit.", icon: <Bell />, color: "primary", duration: 15000, showProgress: true })}>
          Add Notification
        </Button>
        <Button size="xs" variant="outline" onClick={dismissAll}>
          Clear All
        </Button>
        <span className="text-xs text-zinc-400 self-center">maxVisible: 3</span>
        <NotificationContainer maxVisible={3}>
          {notifications.map((item) => (
            <Notification key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </NotificationContainer>
      </div>
    );
  },
};

// ── Persistent (No Auto Dismiss) ─────────────

export const Persistent: Story = {
  render: () => {
    const { notifications, push, dismiss } = useNotification();
    return (
      <div>
        <Button size="xs" color="danger" onClick={() => push({ title: "Critical Error", message: "Database connection lost. Manual action required.", icon: <XCircle />, color: "danger", duration: 0 })}>
          Show Persistent
        </Button>
        <NotificationContainer>
          {notifications.map((item) => (
            <Notification key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </NotificationContainer>
      </div>
    );
  },
};

// ── Update Existing ──────────────────────────

export const UpdateExisting: Story = {
  render: () => {
    const { notifications, push, dismiss, update } = useNotification();
    return (
      <div className="flex gap-2">
        <Button size="xs" color="primary" onClick={() => {
          const id = push({ title: "Uploading...", message: "0% complete", icon: <Download />, color: "primary", duration: 0, showProgress: true });
          setTimeout(() => update(id, { message: "50% complete" }), 1500);
          setTimeout(() => update(id, { title: "Complete!", message: "File uploaded successfully.", color: "success", icon: <CheckCircle />, duration: 3000 }), 3000);
        }}>
          Simulate Upload
        </Button>
        <NotificationContainer>
          {notifications.map((item) => (
            <Notification key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </NotificationContainer>
      </div>
    );
  },
};
