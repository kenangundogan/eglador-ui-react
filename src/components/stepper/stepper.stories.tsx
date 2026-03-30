import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { User, CreditCard, CheckCircle, Package, Truck, MapPin, Mail, Lock, Settings } from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";
import { Stepper, type StepperProps } from "./stepper";

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A stepper/wizard component with horizontal and vertical orientations. Supports 6 colors, 3 sizes, custom icons, clickable steps, and step content.",
      },
    },
  },
  args: {
    activeStep: 1,
    variant: "default",
    size: "sm",
    color: "primary",
    orientation: "horizontal",
    clickable: false,
  },
  argTypes: {
    activeStep: { control: { type: "number", min: 0, max: 4 } },
    variant: { control: "select", options: ["default", "bordered"] },
    size: { control: "select", options: ["xs", "sm", "md"] },
    color: { control: "select", options: ["default", "primary", "success", "danger", "warning", "info"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    clickable: { control: "boolean" },
    onStepClick: { action: "stepClicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: StepperProps) => (
    <Stepper {...args} activeStep={1}>
      <Stepper.Step title="Account" description="Create your account" />
      <Stepper.Step title="Profile" description="Set up your profile" />
      <Stepper.Step title="Review" description="Review and confirm" />
    </Stepper>
  ),
};

// ── Interactive Wizard ───────────────────────

export const InteractiveWizard: Story = {
  render: (args: StepperProps) => {
    const [step, setStep] = useState(0);
    const steps = [
      { title: "Account", desc: "Enter your credentials" },
      { title: "Personal Info", desc: "Tell us about yourself" },
      { title: "Preferences", desc: "Customize your experience" },
      { title: "Done", desc: "All set!" },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 600 }}>
        <Stepper {...args} activeStep={step}>
          {steps.map((s) => (
            <Stepper.Step key={s.title} title={s.title} description={s.desc} />
          ))}
        </Stepper>

        <div className="border border-zinc-200 rounded-lg p-6">
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <Input label="Email" type="email" placeholder="you@example.com" icon={<Mail />} />
              <Input label="Password" type="password" placeholder="••••••••" icon={<Lock />} />
            </div>
          )}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <Input label="Full Name" placeholder="John Doe" icon={<User />} />
              <Input label="Phone" placeholder="+1 (555) 000-0000" />
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-zinc-600">Select your notification preferences and display settings. You can always change these later in your account settings.</p>
              <Input label="Timezone" placeholder="UTC+3" icon={<Settings />} />
            </div>
          )}
          {step === 3 && (
            <div className="flex flex-col items-center gap-2 py-4">
              <CheckCircle className="size-10 text-green-500" />
              <p className="text-lg font-semibold text-zinc-900">All done!</p>
              <p className="text-sm text-zinc-500">Your account has been created successfully.</p>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Button size="xs" variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Previous
          </Button>
          <Button size="xs" color="primary" disabled={step === steps.length} onClick={() => setStep((s) => s + 1)}>
            {step === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    );
  },
};

// ── Vertical with Content ────────────────────

export const VerticalWithContent: Story = {
  render: (args: StepperProps) => (
    <div style={{ maxWidth: 420 }}>
      <Stepper {...args} orientation="vertical" activeStep={1}>
        <Stepper.Step title="Order Placed" description="March 28, 2026" icon={<Package />}>
          <div className="bg-zinc-50 rounded-lg p-3 text-sm text-zinc-600">
            Your order #12345 has been confirmed. You will receive a confirmation email shortly with your order details and estimated delivery date.
          </div>
        </Stepper.Step>
        <Stepper.Step title="Shipped" description="March 29, 2026" icon={<Truck />}>
          <div className="bg-zinc-50 rounded-lg p-3 text-sm text-zinc-600">
            Your package is on the way! Tracking number: <span className="font-mono font-semibold">1Z999AA10123456784</span>. Expected delivery within 2-3 business days.
          </div>
        </Stepper.Step>
        <Stepper.Step title="Out for Delivery" description="Pending" icon={<MapPin />}>
          <div className="bg-zinc-50 rounded-lg p-3 text-sm text-zinc-400">
            Your package will be delivered to the address on file. You will receive a notification when the driver is nearby.
          </div>
        </Stepper.Step>
      </Stepper>
    </div>
  ),
};

// ── Vertical Simple ──────────────────────────

export const VerticalSimple: Story = {
  render: (args: StepperProps) => (
    <div style={{ maxWidth: 350 }}>
      <Stepper {...args} orientation="vertical" activeStep={2} color="success">
        <Stepper.Step title="Requirements gathered" description="Stakeholder interviews completed, scope document signed off." />
        <Stepper.Step title="Design approved" description="UI mockups reviewed and approved by the product team." />
        <Stepper.Step title="Development" description="Frontend and backend implementation in progress." />
        <Stepper.Step title="Testing" description="QA team will run regression and integration tests." />
        <Stepper.Step title="Deployment" description="Production release and monitoring." />
      </Stepper>
    </div>
  ),
};

// ── With Icons ───────────────────────────────

export const WithIcons: Story = {
  render: (args: StepperProps) => (
    <Stepper {...args} activeStep={2}>
      <Stepper.Step title="Account" icon={<User />} />
      <Stepper.Step title="Payment" icon={<CreditCard />} />
      <Stepper.Step title="Confirm" icon={<CheckCircle />} />
    </Stepper>
  ),
};

// ── Colors ───────────────────────────────────

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {(["default", "primary", "success", "danger", "warning", "info"] as const).map((color) => (
        <div key={color}>
          <span className="text-xs text-zinc-400 mb-2 block">{color}</span>
          <Stepper activeStep={1} color={color}>
            <Stepper.Step title="Step 1" />
            <Stepper.Step title="Step 2" />
            <Stepper.Step title="Step 3" />
          </Stepper>
        </div>
      ))}
    </div>
  ),
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {(["xs", "sm", "md"] as const).map((size) => (
        <div key={size}>
          <span className="text-xs text-zinc-400 mb-2 block">{size}</span>
          <Stepper activeStep={1} size={size}>
            <Stepper.Step title="Step 1" description="First step" />
            <Stepper.Step title="Step 2" description="Second step" />
            <Stepper.Step title="Step 3" description="Third step" />
          </Stepper>
        </div>
      ))}
    </div>
  ),
};

// ── Bordered ─────────────────────────────────

export const Bordered: Story = {
  render: (args: StepperProps) => (
    <div style={{ maxWidth: 600 }}>
      <Stepper {...args} variant="bordered" activeStep={2}>
        <Stepper.Step title="Cart" description="Review items" />
        <Stepper.Step title="Shipping" description="Enter address" />
        <Stepper.Step title="Payment" description="Add payment" />
        <Stepper.Step title="Confirm" description="Place order" />
      </Stepper>
    </div>
  ),
};

// ── Clickable ────────────────────────────────

export const Clickable: Story = {
  render: (args: StepperProps) => {
    const [step, setStep] = useState(2);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
        <Stepper {...args} activeStep={step} clickable onStepClick={setStep}>
          <Stepper.Step title="Account" />
          <Stepper.Step title="Profile" />
          <Stepper.Step title="Settings" />
          <Stepper.Step title="Done" />
        </Stepper>
        <span className="text-xs text-zinc-400 text-center">Click any step to navigate. Active: {step}</span>
      </div>
    );
  },
};

// ── All Completed ────────────────────────────

export const AllCompleted: Story = {
  render: (args: StepperProps) => (
    <Stepper {...args} activeStep={4} color="success">
      <Stepper.Step title="Account" />
      <Stepper.Step title="Profile" />
      <Stepper.Step title="Payment" />
      <Stepper.Step title="Complete" />
    </Stepper>
  ),
};
