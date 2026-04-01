import type { Meta, StoryObj } from "@storybook/react-vite";
import { NativeSelect } from "./native-select";

const meta: Meta<typeof NativeSelect> = {
  title: "Components/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A native HTML select element with consistent styling. Supports sizes, colors, variants, states, option groups, labels, and validation messages.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md"] },
    variant: { control: "select", options: ["default", "outline", "ghost"] },
    color: { control: "select", options: ["default", "black", "primary", "danger", "success", "warning", "info"] },
    state: { control: "select", options: ["idle", "error", "success"] },
    shape: { control: "select", options: ["square", "rounded"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof NativeSelect>;

const fruitOptions = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Grape", value: "grape" },
  { label: "Orange", value: "orange" },
];

export const Default: Story = {
  render: () => (
    <div className="max-w-xs">
      <NativeSelect options={fruitOptions} placeholder="Select a fruit" />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="max-w-xs">
      <NativeSelect label="Fruit" options={fruitOptions} placeholder="Select a fruit" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-xs">
      {(["xs", "sm", "md"] as const).map((size) => (
        <NativeSelect key={size} size={size} label={size} options={fruitOptions} defaultValue="apple" />
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-xs">
      {(["default", "black", "primary", "danger", "success", "warning", "info"] as const).map((color) => (
        <NativeSelect key={color} color={color} label={color} options={fruitOptions} defaultValue="banana" />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-xs">
      {(["default", "outline", "ghost"] as const).map((variant) => (
        <NativeSelect key={variant} variant={variant} label={variant} options={fruitOptions} defaultValue="cherry" />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-xs">
      <NativeSelect state="idle" label="Idle" options={fruitOptions} defaultValue="apple" />
      <NativeSelect state="error" label="Error" options={fruitOptions} defaultValue="apple" errorMessage="Please select a valid option" />
      <NativeSelect state="success" label="Success" options={fruitOptions} defaultValue="apple" successMessage="Looks good!" />
    </div>
  ),
};

export const OptionGroups: Story = {
  render: () => (
    <div className="max-w-xs">
      <NativeSelect
        label="Food"
        placeholder="Select a food"
        options={[
          {
            label: "Fruits",
            options: [
              { label: "Apple", value: "apple" },
              { label: "Banana", value: "banana" },
            ],
          },
          {
            label: "Vegetables",
            options: [
              { label: "Carrot", value: "carrot" },
              { label: "Broccoli", value: "broccoli" },
            ],
          },
        ]}
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="max-w-xs">
      <NativeSelect label="Disabled" options={fruitOptions} defaultValue="grape" disabled />
    </div>
  ),
};
