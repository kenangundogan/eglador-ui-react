import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info, AlertTriangle, CheckCircle, XCircle, Bell } from "lucide-react";
import { Alert, type AlertProps } from "./alert";

const ALL_COLORS = ["default", "primary", "danger", "success", "warning", "info"] as const;

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "An alert/notification component with soft, outline, and filled variants. Supports 6 colors, 2 sizes, icon, title, and dismissible state.",
      },
    },
  },
  args: {
    variant: "soft",
    color: "default",
    size: "md",
    dismissible: false,
  },
  argTypes: {
    variant: { control: "select", options: ["soft", "outline", "filled"] },
    color: { control: "select", options: [...ALL_COLORS] },
    size: { control: "select", options: ["sm", "md"] },
    shape: { control: "select", options: ["square", "rounded"] },
    dismissible: { control: "boolean" },
    title: { control: "text" },
    onDismiss: { action: "dismissed" },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

// ── Playground ───────────────────────────────

export const Default: Story = {
  args: {
    title: "Heads up!",
    children: "This is a default alert message.",
  },
};

// ── Soft ─────────────────────────────────────

export const Soft: Story = {
  render: (args: AlertProps) => (
    <div className="flex flex-col gap-3 max-w-lg">
      {ALL_COLORS.map((c) => (
        <Alert {...args} key={c} variant="soft" color={c} title={c.charAt(0).toUpperCase() + c.slice(1)}>
          This is a {c} soft alert.
        </Alert>
      ))}
    </div>
  ),
};

// ── Outline ──────────────────────────────────

export const Outline: Story = {
  render: (args: AlertProps) => (
    <div className="flex flex-col gap-3 max-w-lg">
      {ALL_COLORS.map((c) => (
        <Alert {...args} key={c} variant="outline" color={c} title={c.charAt(0).toUpperCase() + c.slice(1)}>
          This is a {c} outline alert.
        </Alert>
      ))}
    </div>
  ),
};

// ── Filled ───────────────────────────────────

export const Filled: Story = {
  render: (args: AlertProps) => (
    <div className="flex flex-col gap-3 max-w-lg">
      {ALL_COLORS.map((c) => (
        <Alert {...args} key={c} variant="filled" color={c} title={c.charAt(0).toUpperCase() + c.slice(1)}>
          This is a {c} filled alert.
        </Alert>
      ))}
    </div>
  ),
};

// ── With Icons ───────────────────────────────

export const WithIcons: Story = {
  render: (args: AlertProps) => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Alert {...args} color="info" icon={<Info />} title="Information">
        Your account has been updated successfully.
      </Alert>
      <Alert {...args} color="success" icon={<CheckCircle />} title="Success">
        Your changes have been saved.
      </Alert>
      <Alert {...args} color="warning" icon={<AlertTriangle />} title="Warning">
        Your session will expire in 5 minutes.
      </Alert>
      <Alert {...args} color="danger" icon={<XCircle />} title="Error">
        Failed to save changes. Please try again.
      </Alert>
    </div>
  ),
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: (args: AlertProps) => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Alert {...args} size="sm" icon={<Info />} title="Small">
        This is a small alert.
      </Alert>
      <Alert {...args} size="md" icon={<Info />} title="Medium">
        This is a medium alert.
      </Alert>
    </div>
  ),
};

// ── Shapes ──────────────────────────────────

export const Shapes: Story = {
  render: (args: AlertProps) => (
    <div className="flex flex-col gap-3 max-w-lg">
      {(["square", "rounded"] as const).map((shape) => (
        <Alert {...args} key={shape} shape={shape} color="info" icon={<Info />} title={shape.charAt(0).toUpperCase() + shape.slice(1)}>
          This is a {shape} alert.
        </Alert>
      ))}
    </div>
  ),
};

// ── Dismissible ──────────────────────────────

export const Dismissible: Story = {
  render: (args: AlertProps) => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Alert {...args} color="info" icon={<Bell />} title="Notification" dismissible>
        You have 3 unread messages. Click the X to dismiss.
      </Alert>
      <Alert {...args} color="warning" variant="outline" icon={<AlertTriangle />} title="Attention" dismissible>
        Your subscription is about to expire.
      </Alert>
      <Alert {...args} color="danger" variant="filled" icon={<XCircle />} title="Critical" dismissible>
        Server is unreachable. Please check your connection.
      </Alert>
    </div>
  ),
};

// ── Title Only ───────────────────────────────

export const TitleOnly: Story = {
  render: (args: AlertProps) => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Alert {...args} color="success" icon={<CheckCircle />} title="Changes saved successfully!" />
      <Alert {...args} color="danger" icon={<XCircle />} title="Something went wrong." />
    </div>
  ),
};

// ── Description Only ─────────────────────────

export const DescriptionOnly: Story = {
  render: (args: AlertProps) => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Alert {...args} color="info" icon={<Info />}>
        You can customize your notification preferences in the settings page.
      </Alert>
    </div>
  ),
};
