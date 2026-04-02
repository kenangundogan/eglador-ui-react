import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { InputOTP, type InputOTPProps } from "./input-otp";

const meta: Meta<typeof InputOTP> = {
  title: "Components/InputOTP",
  component: InputOTP,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A one-time password input component with individual character slots. Supports configurable length, number/text mode, masking, separator, paste support, keyboard navigation, and error/success states.",
      },
    },
  },
  args: {
    length: 6,
    size: "md",
    variant: "default",
    separator: false,
    mask: false,
    disabled: false,
    autoFocus: false,
    type: "text",
    state: "idle",
  },
  argTypes: {
    length: { control: { type: "number", min: 3, max: 8 } },
    size: { control: "select", options: ["sm", "md", "lg"] },
    shape: { control: "select", options: ["square", "rounded"] },
    variant: { control: "select", options: ["default", "outline"] },
    type: { control: "select", options: ["text", "number"] },
    state: { control: "select", options: ["idle", "error", "success"] },
    separator: { control: "boolean" },
    mask: { control: "boolean" },
    disabled: { control: "boolean" },
    autoFocus: { control: "boolean" },
    onChange: { action: "changed" },
    onComplete: { action: "completed" },
  },
};

export default meta;
type Story = StoryObj<typeof InputOTP>;

// ── Playground ───────────────────────────────

export const Default: Story = {};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: (args: InputOTPProps) => (
    <div className="flex flex-col gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size}>
          <span className="text-xs text-zinc-400 mb-2 block">{size}</span>
          <InputOTP {...args} size={size} length={4} />
        </div>
      ))}
    </div>
  ),
};

// ── With Separator ───────────────────────────

export const WithSeparator: Story = {
  args: { separator: true, length: 6 },
};

// ── Custom Separator Position ────────────────

export const CustomSeparator: Story = {
  args: { length: 8, separatorAfter: [1, 4] },
};

// ── Numbers Only ─────────────────────────────

export const NumbersOnly: Story = {
  args: { type: "number", length: 6, separator: true },
};

// ── Masked ───────────────────────────────────

export const Masked: Story = {
  args: { mask: true, length: 4 },
};

// ── 4-Digit PIN ──────────────────────────────

export const FourDigitPIN: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

    const handleComplete = (otp: string) => {
      if (otp === "1234") {
        setStatus("success");
      } else {
        setStatus("error");
      }
    };

    return (
      <div className="flex flex-col gap-3">
        <span className="text-sm text-zinc-600">Enter PIN: 1234</span>
        <InputOTP
          length={4}
          type="number"
          value={value}
          onChange={(v) => { setValue(v); setStatus("idle"); }}
          onComplete={handleComplete}
          state={status}
          errorMessage="Incorrect PIN. Try again."
          successMessage="PIN verified!"
          autoFocus
        />
        {status === "error" && (
          <Button size="xs" variant="outline" onClick={() => { setValue(""); setStatus("idle"); }}>
            Reset
          </Button>
        )}
      </div>
    );
  },
};

// ── Verification Flow ────────────────────────

export const VerificationFlow: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);

    const handleVerify = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setVerified(true);
      }, 1500);
    };

    return (
      <div className="flex flex-col gap-4 max-w-xs">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Verify your email</h3>
          <p className="text-sm text-zinc-500 mt-1">We sent a 6-digit code to john@example.com</p>
        </div>
        <InputOTP
          length={6}
          type="number"
          separator
          value={value}
          onChange={setValue}
          state={verified ? "success" : "idle"}
          successMessage="Email verified successfully!"
          disabled={loading || verified}
          autoFocus
        />
        <div className="flex gap-2">
          <Button
            size="xs"
            color="black"
            loading={loading}
            disabled={value.length < 6 || verified}
            onClick={handleVerify}
            className="flex-1"
          >
            Verify
          </Button>
          <Button size="xs" variant="outline" disabled={loading || verified} onClick={() => setValue("")}>
            Clear
          </Button>
        </div>
        <Button variant="ghost" size="xs">
          Didn't receive the code? Resend
        </Button>
      </div>
    );
  },
};

// ── Error State ──────────────────────────────

export const ErrorState: Story = {
  args: {
    length: 6,
    state: "error",
    errorMessage: "Invalid verification code.",
  },
};

// ── Success State ────────────────────────────

export const SuccessState: Story = {
  args: {
    length: 6,
    state: "success",
    successMessage: "Code verified successfully!",
  },
};

// ── Disabled ─────────────────────────────────

export const Disabled: Story = {
  args: { disabled: true, length: 6 },
};

// ── Outline Variant ──────────────────────────

export const Outline: Story = {
  args: { variant: "outline", length: 6, separator: true },
};

// ── Shapes ──────────────────────────────────

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">Rounded (default)</span>
        <InputOTP shape="rounded" length={4} />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">Square</span>
        <InputOTP shape="square" length={4} />
      </div>
    </div>
  ),
};

// ── With Placeholder ─────────────────────────

export const WithPlaceholder: Story = {
  args: { placeholder: "○", length: 6 },
};
