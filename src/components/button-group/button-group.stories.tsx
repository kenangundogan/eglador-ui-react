import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings, Plus, Check, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from "lucide-react";
import { Button } from "../button";
import { ButtonGroup, type ButtonGroupProps } from "./button-group";

const meta: Meta<typeof ButtonGroup> = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Groups multiple buttons together with bordered or segmented variants.",
      },
    },
  },
  args: {
    variant: "bordered",
  },
  argTypes: {
    variant: { control: "select", options: ["bordered", "segmented"] },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: (args: ButtonGroupProps) => (
    <ButtonGroup {...args}>
      <Button icon={<Settings />} aria-label="Settings" />
      <Button icon={<Plus />} aria-label="Add" />
      <Button icon={<Check />} aria-label="Confirm" />
    </ButtonGroup>
  ),
};

export const Segmented: Story = {
  args: { variant: "segmented" },
  render: (args: ButtonGroupProps) => (
    <ButtonGroup {...args}>
      <Button icon={<Settings />} aria-label="Settings" active />
      <Button icon={<Plus />} aria-label="Add" />
      <Button icon={<Check />} aria-label="Confirm" />
    </ButtonGroup>
  ),
};

export const TextAlignment: Story = {
  render: (args: ButtonGroupProps) => (
    <ButtonGroup {...args}>
      <Button icon={<AlignLeft />} aria-label="Align left" />
      <Button icon={<AlignCenter />} aria-label="Align center" />
      <Button icon={<AlignRight />} aria-label="Align right" />
    </ButtonGroup>
  ),
};

export const TextFormatting: Story = {
  args: { variant: "segmented" },
  render: (args: ButtonGroupProps) => (
    <ButtonGroup {...args}>
      <Button icon={<Bold />} aria-label="Bold" active />
      <Button icon={<Italic />} aria-label="Italic" />
      <Button icon={<Underline />} aria-label="Underline" />
    </ButtonGroup>
  ),
};

export const WithLabels: Story = {
  render: (args: ButtonGroupProps) => (
    <ButtonGroup {...args}>
      <Button>Day</Button>
      <Button>Week</Button>
      <Button>Month</Button>
    </ButtonGroup>
  )
};
