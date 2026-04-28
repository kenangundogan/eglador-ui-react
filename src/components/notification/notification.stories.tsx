import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info, CheckCircle, AlertTriangle, XCircle, Bell, Zap, Download } from "lucide-react";
import { Button } from "../button";
import {
  Notification,
  NotificationContainer,
  useNotification,
  type NotificationColor,
  type NotificationShape,
} from "./notification";

const COLOR_OPTIONS: NotificationColor[] = ["default", "primary", "danger", "success", "warning", "info"];

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
  argTypes: {
    item: { table: { disable: true } },
    onDismiss: { table: { disable: true } },
  },
};

export default meta;

// ── Shared arg types ─────────────────────────

const baseArgTypes = {
  title: { control: "text" as const },
  message: { control: "text" as const },
  color: { control: "select" as const, options: COLOR_OPTIONS },
  showProgress: { control: "boolean" as const },
  duration: { control: "number" as const },
  pauseOnHover: { control: "boolean" as const },
};

// ── Playground ───────────────────────────────

interface PlaygroundArgs {
  title: string;
  message: string;
  color: NotificationColor;
  showProgress: boolean;
  duration: number;
  pauseOnHover: boolean;
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    title: "Notification Title",
    message: "This is the notification message body.",
    color: "primary",
    showProgress: true,
    duration: 5000,
    pauseOnHover: true,
  },
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      source: {
        transform: (_src: string, ctx: { args: PlaygroundArgs }) => `<Button
  onClick={() =>
    push({
      title: "${ctx.args.title}",
      message: "${ctx.args.message}",
      color: "${ctx.args.color}",
      showProgress: ${ctx.args.showProgress},
      duration: ${ctx.args.duration},
      pauseOnHover: ${ctx.args.pauseOnHover},
    })
  }
>
  Show Notification
</Button>`,
      },
    },
  },
  render: (args) => {
    const { notifications, push, dismiss } = useNotification();
    return (
      <div className="flex flex-col gap-3 max-w-80">
        <Button
          size="xs"
          color="black"
          onClick={() =>
            push({
              title: args.title,
              message: args.message,
              color: args.color,
              showProgress: args.showProgress,
              duration: args.duration,
              pauseOnHover: args.pauseOnHover,
            })
          }
        >
          Show Notification
        </Button>
        <NotificationContainer position="top-right">
          {notifications.map((item) => (
            <Notification key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </NotificationContainer>
      </div>
    );
  },
};

// ── Interactive Demo ─────────────────────────

export const Default: StoryObj<typeof Notification> = {
  parameters: {
    docs: {
      source: {
        code: `<Button onClick={() => push({ title: "Success", message: "Your changes have been saved.", icon: <CheckCircle />, color: "success" })}>Success</Button>
<Button onClick={() => push({ title: "Error", message: "Failed to save changes.", icon: <XCircle />, color: "danger" })}>Error</Button>
<Button onClick={() => push({ title: "Warning", message: "Your session expires soon.", icon: <AlertTriangle />, color: "warning" })}>Warning</Button>
<Button onClick={() => push({ title: "Info", message: "New version available.", icon: <Info />, color: "info" })}>Info</Button>`,
      },
    },
  },
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

interface WithProgressArgs {
  title: string;
  message: string;
  color: NotificationColor;
  showProgress: boolean;
  duration: number;
}

export const WithProgressBar: StoryObj<WithProgressArgs> = {
  args: {
    title: "Uploading...",
    message: "Your file is being processed.",
    color: "primary",
    showProgress: true,
    duration: 8000,
  },
  argTypes: {
    title: { control: "text" },
    message: { control: "text" },
    color: { control: "select", options: COLOR_OPTIONS },
    showProgress: { control: "boolean" },
    duration: { control: "number" },
  },
  parameters: {
    docs: {
      source: {
        transform: (_src: string, ctx: { args: WithProgressArgs }) => `<Button
  onClick={() =>
    push({
      title: "${ctx.args.title}",
      message: "${ctx.args.message}",
      icon: <Download />,
      color: "${ctx.args.color}",
      showProgress: ${ctx.args.showProgress},
      duration: ${ctx.args.duration},
    })
  }
>
  With Progress
</Button>`,
      },
    },
  },
  render: (args) => {
    const { notifications, push, dismiss } = useNotification();
    return (
      <div className="flex gap-2">
        <Button
          size="xs"
          color="black"
          onClick={() =>
            push({
              title: args.title,
              message: args.message,
              icon: <Download />,
              color: args.color,
              showProgress: args.showProgress,
              duration: args.duration,
            })
          }
        >
          With Progress
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

export const WithActions: StoryObj<typeof Notification> = {
  parameters: {
    docs: {
      source: {
        code: `<Button
  onClick={() => {
    const id = push({
      title: "New update available",
      message: "Version 2.0 is ready to install.",
      icon: <Zap />,
      color: "primary",
      duration: 0,
      actions: [
        { label: "Update now", onClick: () => alert("Updating..."), variant: "primary" },
        { label: "Later", onClick: () => dismiss(id) },
      ],
    });
  }}
>
  Show with Actions
</Button>`,
      },
    },
  },
  render: () => {
    const { notifications, push, dismiss } = useNotification();
    let counter = 0;
    return (
      <div>
        <Button
          size="xs"
          color="black"
          onClick={() => {
            const id = `action-notif-${++counter}`;
            push({
              id,
              title: "New update available",
              message: "Version 2.0 is ready to install.",
              icon: <Zap />,
              color: "primary",
              duration: 0,
              actions: [
                { label: "Update now", onClick: () => alert("Updating..."), variant: "primary" },
                { label: "Later", onClick: () => dismiss(id) },
              ],
            });
          }}
        >
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

interface WithTimestampArgs {
  title: string;
  message: string;
  color: NotificationColor;
  duration: number;
}

export const WithTimestamp: StoryObj<WithTimestampArgs> = {
  args: {
    title: "New message",
    message: "You have a new message from the team.",
    color: "info",
    duration: 0,
  },
  argTypes: {
    title: { control: "text" },
    message: { control: "text" },
    color: { control: "select", options: COLOR_OPTIONS },
    duration: { control: "number" },
  },
  parameters: {
    docs: {
      source: {
        transform: (_src: string, ctx: { args: WithTimestampArgs }) => `<Button
  onClick={() =>
    push({
      title: "${ctx.args.title}",
      message: "${ctx.args.message}",
      icon: <Bell />,
      color: "${ctx.args.color}",
      duration: ${ctx.args.duration},
      timestamp: new Date(),
    })
  }
>
  Show with Timestamp
</Button>`,
      },
    },
  },
  render: (args) => {
    const { notifications, push, dismiss } = useNotification();
    return (
      <div>
        <Button
          size="xs"
          color="black"
          onClick={() =>
            push({
              title: args.title,
              message: args.message,
              icon: <Bell />,
              color: args.color,
              duration: args.duration,
              timestamp: new Date(),
            })
          }
        >
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

interface PauseOnHoverArgs {
  title: string;
  message: string;
  color: NotificationColor;
  showProgress: boolean;
  duration: number;
  pauseOnHover: boolean;
}

export const PauseOnHover: StoryObj<PauseOnHoverArgs> = {
  args: {
    title: "Hover to pause",
    message: "This notification pauses its timer when you hover over it.",
    color: "warning",
    showProgress: true,
    duration: 6000,
    pauseOnHover: true,
  },
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      source: {
        transform: (_src: string, ctx: { args: PauseOnHoverArgs }) => `<Button
  onClick={() =>
    push({
      title: "${ctx.args.title}",
      message: "${ctx.args.message}",
      icon: <AlertTriangle />,
      color: "${ctx.args.color}",
      showProgress: ${ctx.args.showProgress},
      duration: ${ctx.args.duration},
      pauseOnHover: ${ctx.args.pauseOnHover},
    })
  }
>
  Show (hover to pause)
</Button>`,
      },
    },
  },
  render: (args) => {
    const { notifications, push, dismiss } = useNotification();
    return (
      <div className="flex flex-col gap-2 max-w-80">
        <Button
          size="xs"
          color="black"
          onClick={() =>
            push({
              title: args.title,
              message: args.message,
              icon: <AlertTriangle />,
              color: args.color,
              showProgress: args.showProgress,
              duration: args.duration,
              pauseOnHover: args.pauseOnHover,
            })
          }
        >
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

export const Positions: StoryObj<typeof Notification> = {
  parameters: {
    docs: {
      source: {
        code: `// position is set on NotificationContainer, not per notification
<Button onClick={() => push({ title: "top-right", message: "Notification at top-right", icon: <Bell />, color: "primary" })}>
  top-right
</Button>

<NotificationContainer position="top-right">
  {notifications.map((item) => (
    <Notification key={item.id} item={item} onDismiss={dismiss} />
  ))}
</NotificationContainer>`,
      },
    },
  },
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

interface MaxVisibleArgs {
  title: string;
  message: string;
  color: NotificationColor;
  showProgress: boolean;
  duration: number;
  maxVisible: number;
}

export const MaxVisible: StoryObj<MaxVisibleArgs> = {
  args: {
    title: "Notification",
    message: "Click multiple times to test stacking limit.",
    color: "primary",
    showProgress: true,
    duration: 15000,
    maxVisible: 3,
  },
  argTypes: {
    title: { control: "text" },
    message: { control: "text" },
    color: { control: "select", options: COLOR_OPTIONS },
    showProgress: { control: "boolean" },
    duration: { control: "number" },
    maxVisible: { control: "number" },
  },
  parameters: {
    docs: {
      source: {
        transform: (_src: string, ctx: { args: MaxVisibleArgs }) => `<Button
  onClick={() =>
    push({
      title: "${ctx.args.title}",
      message: "${ctx.args.message}",
      color: "${ctx.args.color}",
      showProgress: ${ctx.args.showProgress},
      duration: ${ctx.args.duration},
    })
  }
>
  Add Notification
</Button>

<NotificationContainer maxVisible={${ctx.args.maxVisible}}>
  {notifications.map((item) => (
    <Notification key={item.id} item={item} onDismiss={dismiss} />
  ))}
</NotificationContainer>`,
      },
    },
  },
  render: (args) => {
    const { notifications, push, dismiss, dismissAll } = useNotification();
    let counter = 0;
    return (
      <div className="flex gap-2">
        <Button
          size="xs"
          color="black"
          onClick={() =>
            push({
              title: `${args.title} ${++counter}`,
              message: args.message,
              icon: <Bell />,
              color: args.color,
              showProgress: args.showProgress,
              duration: args.duration,
            })
          }
        >
          Add Notification
        </Button>
        <Button size="xs" variant="outline" onClick={dismissAll}>
          Clear All
        </Button>
        <span className="text-xs text-zinc-400 self-center">maxVisible: {args.maxVisible}</span>
        <NotificationContainer maxVisible={args.maxVisible}>
          {notifications.map((item) => (
            <Notification key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </NotificationContainer>
      </div>
    );
  },
};

// ── Persistent (No Auto Dismiss) ─────────────

interface PersistentArgs {
  title: string;
  message: string;
  color: NotificationColor;
}

export const Persistent: StoryObj<PersistentArgs> = {
  args: {
    title: "Critical Error",
    message: "Database connection lost. Manual action required.",
    color: "danger",
  },
  argTypes: {
    title: { control: "text" },
    message: { control: "text" },
    color: { control: "select", options: COLOR_OPTIONS },
  },
  parameters: {
    docs: {
      source: {
        transform: (_src: string, ctx: { args: PersistentArgs }) => `// duration: 0 means the notification will not auto-dismiss
<Button
  onClick={() =>
    push({
      title: "${ctx.args.title}",
      message: "${ctx.args.message}",
      icon: <XCircle />,
      color: "${ctx.args.color}",
      duration: 0,
    })
  }
>
  Show Persistent
</Button>`,
      },
    },
  },
  render: (args) => {
    const { notifications, push, dismiss } = useNotification();
    return (
      <div>
        <Button
          size="xs"
          color="danger"
          onClick={() =>
            push({
              title: args.title,
              message: args.message,
              icon: <XCircle />,
              color: args.color,
              duration: 0,
            })
          }
        >
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

// ── Shapes ──────────────────────────────────

interface ShapesArgs {
  title: string;
  message: string;
  color: NotificationColor;
  shape: NotificationShape;
}

export const Shapes: StoryObj<ShapesArgs> = {
  args: {
    title: "Notification",
    message: "This notification demonstrates the shape prop.",
    color: "primary",
    shape: "rounded",
  },
  argTypes: {
    title: { control: "text" },
    message: { control: "text" },
    color: { control: "select", options: COLOR_OPTIONS },
    shape: { control: "radio", options: ["rounded", "square"] },
  },
  parameters: {
    docs: {
      source: {
        transform: (_src: string, ctx: { args: ShapesArgs }) => `<Button
  onClick={() =>
    push({
      title: "${ctx.args.title}",
      message: "${ctx.args.message}",
      icon: <Bell />,
      color: "${ctx.args.color}",
      shape: "${ctx.args.shape}",
      duration: 0,
    })
  }
>
  Show Notification
</Button>`,
      },
    },
  },
  render: (args) => {
    const { notifications, push, dismiss } = useNotification();
    return (
      <div className="flex flex-col gap-3">
        <Button
          size="xs"
          color="black"
          onClick={() =>
            push({
              title: args.title,
              message: args.message,
              icon: <Bell />,
              color: args.color,
              shape: args.shape,
              duration: 0,
            })
          }
        >
          Show Notification
        </Button>
        <NotificationContainer position="top-right">
          {notifications.map((item) => (
            <Notification key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </NotificationContainer>
      </div>
    );
  },
};

// ── Update Existing ──────────────────────────

export const UpdateExisting: StoryObj<typeof Notification> = {
  parameters: {
    docs: {
      source: {
        code: `<Button
  onClick={() => {
    const id = push({
      title: "Uploading...",
      message: "0% complete",
      icon: <Download />,
      color: "primary",
      duration: 0,
      showProgress: true,
    });
    setTimeout(() => update(id, { message: "50% complete" }), 1500);
    setTimeout(() => update(id, { title: "Complete!", message: "File uploaded successfully.", color: "success", icon: <CheckCircle />, duration: 3000 }), 3000);
  }}
>
  Simulate Upload
</Button>`,
      },
    },
  },
  render: () => {
    const { notifications, push, dismiss, update } = useNotification();
    return (
      <div className="flex gap-2">
        <Button
          size="xs"
          color="black"
          onClick={() => {
            const id = push({ title: "Uploading...", message: "0% complete", icon: <Download />, color: "primary", duration: 0, showProgress: true });
            setTimeout(() => update(id, { message: "50% complete" }), 1500);
            setTimeout(() => update(id, { title: "Complete!", message: "File uploaded successfully.", color: "success", icon: <CheckCircle />, duration: 3000 }), 3000);
          }}
        >
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
