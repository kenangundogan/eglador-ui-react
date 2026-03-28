import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search, Mail, Lock } from "lucide-react";
import { Input } from "../input";
import { InputGroup, type InputGroupProps } from "./input-group";

const meta: Meta<typeof InputGroup> = {
  title: "Components/InputGroup",
  component: InputGroup,
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
    <div style={{ width: 320 }}>
      <InputGroup {...args}>
        <Input icon={<Mail />} placeholder="Email" />
        <Input icon={<Lock />} type="password" placeholder="Password" />
      </InputGroup>
    </div>
  ),
};

export const StackedThreeFields: Story = {
  args: { variant: "stacked" },
  render: (args: InputGroupProps) => (
    <div style={{ width: 320 }}>
      <InputGroup {...args}>
        <Input placeholder="First name" />
        <Input placeholder="Last name" />
        <Input placeholder="Email" type="email" />
      </InputGroup>
    </div>
  ),
};
