import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea, type TextareaProps } from "./textarea";

const ALL_COLORS = ["default", "black", "primary", "danger", "success", "warning", "info"] as const;

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A textarea component with 3 variants, 7 colors, 3 sizes, auto-grow, resize control, and error/success states. Mirrors Input API for consistency.",
      },
    },
  },
  args: {
    placeholder: "Type something...",
    variant: "default",
    color: "default",
    size: "sm",
    state: "idle",
    resize: "vertical",
    autoGrow: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outline", "ghost"] },
    color: { control: "select", options: [...ALL_COLORS] },
    size: { control: "select", options: ["xs", "sm", "md"] },
    state: { control: "select", options: ["idle", "error", "success"] },
    resize: { control: "select", options: ["none", "vertical", "horizontal", "both"] },
    autoGrow: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args: TextareaProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
      <Textarea {...args} size="xs" placeholder="Extra Small" label="XS" />
      <Textarea {...args} size="sm" placeholder="Small" label="SM" />
      <Textarea {...args} size="md" placeholder="Medium" label="MD" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args: TextareaProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      {ALL_COLORS.map((c) => (
        <Textarea {...args} key={c} color={c} placeholder={`${c.charAt(0).toUpperCase() + c.slice(1)} color`} />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args: TextareaProps) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      <Textarea {...args} variant="default" placeholder="Default variant" label="Default" />
      <Textarea {...args} variant="outline" placeholder="Outline variant" label="Outline" />
      <Textarea {...args} variant="ghost" placeholder="Ghost variant" label="Ghost" />
    </div>
  ),
};

export const WithLabel: Story = {
  render: (args: TextareaProps) => (
    <div style={{ maxWidth: 400 }}>
      <Textarea {...args} label="Description" placeholder="Write a brief description of your project..." rows={4} />
    </div>
  ),
};

export const ErrorState: Story = {
  render: (args: TextareaProps) => (
    <div style={{ maxWidth: 400 }}>
      <Textarea {...args} state="error" errorMessage="This field is required." label="Bio" placeholder="Tell us about yourself" />
    </div>
  ),
};

export const SuccessState: Story = {
  render: (args: TextareaProps) => (
    <div style={{ maxWidth: 400 }}>
      <Textarea {...args} state="success" successMessage="Looks good!" label="Message" placeholder="Your message" defaultValue="Lorem ipsum dolor sit amet." />
    </div>
  ),
};

export const AutoGrow: Story = {
  render: (args: TextareaProps) => (
    <div style={{ maxWidth: 400 }}>
      <Textarea {...args} autoGrow label="Auto-grow" placeholder="Start typing and the textarea will grow automatically..." />
    </div>
  ),
};

export const AutoGrowWithMaxRows: Story = {
  render: (args: TextareaProps) => (
    <div style={{ maxWidth: 400 }}>
      <Textarea {...args} autoGrow maxRows={5} label="Max 5 rows" placeholder="This textarea grows up to 5 rows, then scrolls..." />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args: TextareaProps) => (
    <div style={{ maxWidth: 400 }}>
      <Textarea {...args} disabled label="Disabled" placeholder="Cannot edit" defaultValue="This field is disabled." />
    </div>
  ),
};

export const NoResize: Story = {
  render: (args: TextareaProps) => (
    <div style={{ maxWidth: 400 }}>
      <Textarea {...args} resize="none" label="No resize" placeholder="Resize handle is disabled" />
    </div>
  ),
};
