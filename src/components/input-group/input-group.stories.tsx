import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search, Mail, Lock, Globe, Copy, Eye } from "lucide-react";
import { Input } from "../input";
import { Button } from "../button";
import { Label } from "../label";
import { InputGroup, type InputGroupProps } from "./input-group";

const meta: Meta<typeof InputGroup> = {
  title: "Components/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Groups inputs, text labels, and addons together. Supports bordered (horizontal) and stacked (vertical) variants with Text and Addon sub-components for prefix/suffix content.",
      },
    },
  },
  args: {
    variant: "bordered",
  },
  argTypes: {
    variant: { control: "select", options: ["bordered", "stacked"] },
  },
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

// ── Bordered ─────────────────────────────────

export const Bordered: Story = {
  render: (args: InputGroupProps) => (
    <InputGroup {...args}>
      <Input placeholder="First name" />
      <Input placeholder="Last name" />
    </InputGroup>
  ),
};

// ── With Prefix Text ─────────────────────────

export const WithPrefixText: Story = {
  render: (args: InputGroupProps) => (
    <div className="flex flex-col gap-3 w-100">
      <InputGroup {...args}>
        <InputGroup.Text>https://</InputGroup.Text>
        <Input placeholder="example.com" />
      </InputGroup>

      <InputGroup {...args}>
        <InputGroup.Text>@</InputGroup.Text>
        <Input placeholder="username" />
      </InputGroup>

      <InputGroup {...args}>
        <InputGroup.Text>$</InputGroup.Text>
        <Input placeholder="0.00" type="number" />
        <InputGroup.Text>USD</InputGroup.Text>
      </InputGroup>
    </div>
  ),
};

// ── With Suffix Text ─────────────────────────

export const WithSuffixText: Story = {
  render: (args: InputGroupProps) => (
    <div className="flex flex-col gap-3 w-100">
      <InputGroup {...args}>
        <Input placeholder="you" />
        <InputGroup.Text>@example.com</InputGroup.Text>
      </InputGroup>

      <InputGroup {...args}>
        <Input placeholder="Width" type="number" />
        <InputGroup.Text>px</InputGroup.Text>
      </InputGroup>
    </div>
  ),
};

// ── With Button ──────────────────────────────

export const WithButton: Story = {
  render: (args: InputGroupProps) => (
    <div className="flex flex-col gap-3 w-100">
      <InputGroup {...args}>
        <Input icon={<Search />} placeholder="Search..." />
        <InputGroup.Addon>
          <Button color="black" shape="square" size="sm">Search</Button>
        </InputGroup.Addon>
      </InputGroup>

      <InputGroup {...args}>
        <Input placeholder="Enter invite code" />
        <InputGroup.Addon>
          <Button color="black" shape="square" size="sm">Apply</Button>
        </InputGroup.Addon>
      </InputGroup>
    </div>
  ),
};

// ── With Icon Button ─────────────────────────

export const WithIconButton: Story = {
  render: (args: InputGroupProps) => (
    <div className="flex flex-col gap-3 w-100">
      <InputGroup {...args}>
        <Input placeholder="https://eglador.com/share/abc123" />
        <InputGroup.Addon>
          <Button variant="ghost" shape="square" size="sm" icon={<Copy />} aria-label="Copy" />
        </InputGroup.Addon>
      </InputGroup>

      <InputGroup {...args}>
        <Input type="password" placeholder="Password" />
        <InputGroup.Addon>
          <Button variant="ghost" shape="square" size="sm" icon={<Eye />} aria-label="Show password" />
        </InputGroup.Addon>
      </InputGroup>
    </div>
  ),
};

// ── Complex: Text + Input + Button ───────────

export const Complex: Story = {
  render: (args: InputGroupProps) => (
    <div className="flex flex-col gap-3 w-120">
      <InputGroup {...args}>
        <InputGroup.Text>https://</InputGroup.Text>
        <Input placeholder="your-domain.com" />
        <InputGroup.Addon>
          <Button color="black" shape="square" size="sm" icon={<Globe />}>Verify</Button>
        </InputGroup.Addon>
      </InputGroup>
    </div>
  ),
};

// ── With Icons ───────────────────────────────

export const BorderedWithIcons: Story = {
  render: (args: InputGroupProps) => (
    <InputGroup {...args}>
      <Input icon={<Search />} placeholder="Search..." />
      <Input icon={<Mail />} placeholder="Email" />
    </InputGroup>
  ),
};

// ── Stacked ──────────────────────────────────

export const Stacked: Story = {
  args: { variant: "stacked" },
  render: (args: InputGroupProps) => (
    <div className="w-80">
      <InputGroup {...args}>
        <Input icon={<Mail />} placeholder="Email" />
        <Input icon={<Lock />} type="password" placeholder="Password" />
      </InputGroup>
    </div>
  ),
};

// ── Stacked Three Fields ─────────────────────

export const StackedThreeFields: Story = {
  args: { variant: "stacked" },
  render: (args: InputGroupProps) => (
    <div className="w-80">
      <InputGroup {...args}>
        <Input placeholder="First name" />
        <Input placeholder="Last name" />
        <Input placeholder="Email" type="email" />
      </InputGroup>
    </div>
  ),
};

// ── Login Form ───────────────────────────────

export const LoginForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <Label>Email</Label>
        <InputGroup variant="bordered">
          <InputGroup.Text><Mail className="size-4 text-zinc-400" /></InputGroup.Text>
          <Input placeholder="you@example.com" type="email" />
        </InputGroup>
      </div>
      <div>
        <Label>Password</Label>
        <InputGroup variant="bordered">
          <InputGroup.Text><Lock className="size-4 text-zinc-400" /></InputGroup.Text>
          <Input placeholder="••••••••" type="password" />
          <InputGroup.Addon>
            <Button variant="ghost" shape="square" size="sm" icon={<Eye />} aria-label="Show password" />
          </InputGroup.Addon>
        </InputGroup>
      </div>
      <Button color="black" className="w-full">Sign In</Button>
    </div>
  ),
};
