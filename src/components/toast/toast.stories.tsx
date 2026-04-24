import { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { toast, Toaster, type ToastPosition } from "./toast";

const meta: Meta<typeof Toaster> = {
  title: "Components/Toast",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "An opinionated toast component with a Sonner-like API. Call toast(), toast.success(), toast.error() etc. from anywhere. Supports promise-based toasts, action buttons, pause on hover, and 6 positions.",
      },
      source: { type: "dynamic" },
    },
  },
  argTypes: {
    position: {
      control: "select",
      options: ["top-right", "top-left", "top-center", "bottom-right", "bottom-left", "bottom-center"],
    },
    maxVisible: { control: "number" },
    gap: { control: "number" },
  },
  args: {
    maxVisible: 5,
    gap: 8,
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        return () => toast.dismissAll();
      }, []);
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

// ── Playground ───────────────────────────────

export const Playground: Story = {
  render: (args) => {
    useEffect(() => {
      toast.dismissAll();
    }, [args.position]);
    console.log(args.position)

    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 flex-wrap">
          <Button size="xs" variant="outline" onClick={() => toast("Default toast message")}>Default</Button>
          <Button size="xs" color="success" onClick={() => toast.success("Operation completed successfully!")}>Success</Button>
          <Button size="xs" color="danger" onClick={() => toast.error("Something went wrong!")}>Error</Button>
          <Button size="xs" color="warning" onClick={() => toast.warning("Please check your input")}>Warning</Button>
          <Button size="xs" color="info" onClick={() => toast.info("New version available")}>Info</Button>
          <Button size="xs" color="black" onClick={() => toast.loading("Loading data...")}>Loading</Button>
        </div>
        <p className="text-xs text-zinc-400">Use the controls panel to change <strong>position</strong>, <strong>maxVisible</strong>, and <strong>gap</strong>.</p>
        <Toaster key={args.position} {...args} />
      </div>
    );
  },
};

// ── Basic Types ──────────────────────────────

export const BasicTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
        <Button size="xs" variant="outline" onClick={() => toast("This is a default toast")}>Default</Button>
        <Button size="xs" color="success" onClick={() => toast.success("Changes saved successfully!")}>Success</Button>
        <Button size="xs" color="danger" onClick={() => toast.error("Something went wrong!")}>Error</Button>
        <Button size="xs" color="warning" onClick={() => toast.warning("Please check your input")}>Warning</Button>
        <Button size="xs" color="info" onClick={() => toast.info("New version available")}>Info</Button>
        <Button size="xs" color="black" onClick={() => toast.loading("Loading data...")}>Loading</Button>
      </div>
      <Toaster />
    </div>
  ),
};

// ── With Description ─────────────────────────

export const WithDescription: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button size="xs" color="success" onClick={() => toast.success({ title: "Profile updated", description: "Your changes have been saved and are now visible to others." })}>
        With Description
      </Button>
      <Button size="xs" color="danger" onClick={() => toast.error({ title: "Upload failed", description: "The file exceeds the maximum allowed size of 10MB." })}>
        Error + Desc
      </Button>
      <Toaster />
    </div>
  ),
};

// ── With Action ──────────────────────────────

export const WithAction: Story = {
  render: () => (
    <div>
      <Button size="xs" variant="outline" onClick={() => toast({
        title: "Message archived",
        description: "The conversation has been moved to archive.",
        action: { label: "Undo", onClick: () => toast.success("Restored!") },
        cancel: { label: "Dismiss" },
      })}>
        Show with Action
      </Button>
      <Toaster />
    </div>
  ),
};

// ── Promise ──────────────────────────────────

export const PromiseToast: Story = {
  render: () => {
    const fakeUpload = () => new Promise<{ name: string }>((resolve, reject) => {
      setTimeout(() => {
        const rnd = Math.round(Math.random() * 10);
        rnd >= 5 ? resolve({ name: "report.pdf" }) : reject(new Error("Network error"));
      }, 2000);
    });

    return (
      <div className="flex gap-2">
        <Button size="xs" color="black" onClick={() => toast.promise(fakeUpload(), {
          loading: "Uploading file...",
          success: (data) => `${data.name} uploaded successfully!`,
          error: "Upload failed. Please try again.",
        })}>
          Upload File (random success/fail)
        </Button>
        <Toaster />
      </div>
    );
  },
};

// ── Custom Duration ──────────────────────────

export const CustomDuration: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button size="xs" variant="outline" onClick={() => toast({ title: "Quick toast", duration: 1500 })}>1.5s</Button>
      <Button size="xs" variant="outline" onClick={() => toast({ title: "Normal toast", duration: 4000 })}>4s (default)</Button>
      <Button size="xs" variant="outline" onClick={() => toast({ title: "Long toast", duration: 10000 })}>10s</Button>
      <Button size="xs" variant="outline" onClick={() => toast({ title: "Persistent toast", duration: Infinity, description: "This won't auto-close." })}>Persistent</Button>
      <Toaster />
    </div>
  ),
};

// ── Positions ────────────────────────────────

export const Positions: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-2">

      </div>
    );
  },
};

// ── Stacking ─────────────────────────────────

export const Stacking: Story = {
  render: () => {
    let counter = 0;
    return (
      <div className="flex gap-2">
        <Button size="xs" color="black" onClick={() => toast.info({ title: `Toast ${++counter}`, description: "Click multiple times to stack.", duration: 10000 })}>
          Add Toast
        </Button>
        <Button size="xs" variant="outline" onClick={() => toast.dismissAll()}>
          Clear All
        </Button>
        <Toaster maxVisible={3} />
      </div>
    );
  },
};

// ── Custom Icon ──────────────────────────────

export const CustomIcon: Story = {
  render: () => (
    <div>
      <Button size="xs" variant="outline" onClick={() => toast({
        title: "Event scheduled",
        description: "Your meeting has been added to the calendar.",
        icon: <span className="text-lg">📅</span>,
      })}>
        With Emoji Icon
      </Button>
      <Toaster />
    </div>
  ),
};

// ── Update Existing ──────────────────────────

export const UpdateExisting: Story = {
  render: () => (
    <div>
      <Button size="xs" color="black" onClick={() => {
        const id = toast.loading("Processing payment...");
        setTimeout(() => toast.update(id, { type: "success", title: "Payment complete!", description: "$49.99 charged.", duration: 4000 }), 2500);
      }}>
        Simulate Payment
      </Button>
      <Toaster />
    </div>
  ),
};

// ── Non-dismissible ──────────────────────────

export const NonDismissible: Story = {
  render: () => (
    <div>
      <Button size="xs" variant="outline" onClick={() => toast({
        title: "Critical update in progress",
        description: "Please do not close this window.",
        dismissible: false,
        duration: 5000,
      })}>
        Non-dismissible
      </Button>
      <Toaster />
    </div>
  ),
};
