import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings, Plus, Check, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from "lucide-react";
import { Button } from "../button";
import { ButtonGroup, type ButtonGroupProps } from "./button-group";

const meta: Meta<typeof ButtonGroup> = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
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
      <Button icon={<Settings />} />
      <Button icon={<Plus />} />
      <Button icon={<Check />} />
    </ButtonGroup>
  ),
};

export const Segmented: Story = {
  args: { variant: "segmented" },
  render: (args: ButtonGroupProps) => (
    <ButtonGroup {...args}>
      <Button icon={<Settings />} active />
      <Button icon={<Plus />} />
      <Button icon={<Check />} />
    </ButtonGroup>
  ),
};

export const TextAlignment: Story = {
  render: (args: ButtonGroupProps) => (
    <ButtonGroup {...args}>
      <Button icon={<AlignLeft />} />
      <Button icon={<AlignCenter />} />
      <Button icon={<AlignRight />} />
    </ButtonGroup>
  ),
};

export const TextFormatting: Story = {
  args: { variant: "segmented" },
  render: (args: ButtonGroupProps) => (
    <ButtonGroup {...args}>
      <Button icon={<Bold />} active />
      <Button icon={<Italic />} />
      <Button icon={<Underline />} />
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
