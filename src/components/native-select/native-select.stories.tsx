import type { Meta, StoryObj } from "@storybook/react-vite";
import { NativeSelect, type NativeSelectProps } from "./native-select";

const ALL_COLORS = ["default", "black", "primary", "danger", "success", "warning", "info"] as const;

const fruitOptions = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Grape", value: "grape" },
  { label: "Orange", value: "orange" },
];

const meta: Meta<typeof NativeSelect> = {
  title: "Components/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A native HTML select element with consistent styling. Supports 3 sizes, 7 colors, 3 variants, 2 shapes, validation states, option groups, labels, and validation messages.",
      },
    },
  },
  args: {
    options: fruitOptions,
    placeholder: "Select a fruit",
    variant: "default",
    color: "default",
    size: "sm",
    shape: "rounded",
    state: "idle",
    disabled: false,
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outline", "ghost"] },
    color: { control: "select", options: [...ALL_COLORS] },
    size: { control: "select", options: ["xs", "sm", "md"] },
    shape: { control: "select", options: ["square", "rounded"] },
    state: { control: "select", options: ["idle", "error", "success"] },
    disabled: { control: "boolean" },
    label: { control: "text" },
    placeholder: { control: "text" },
    errorMessage: { control: "text" },
    successMessage: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof NativeSelect>;

// ── Default ─────────────────────────────────

export const Default: Story = {};

// ── With Label ──────────────────────────────

export const WithLabel: Story = {
  args: { label: "Fruit" },
};

// ── Sizes ───────────────────────────────────

export const Sizes: Story = {
  render: (args: NativeSelectProps) => (
    <div className="flex flex-col gap-4 max-w-xs">
      {(["xs", "sm", "md"] as const).map((size) => (
        <NativeSelect {...args} key={size} size={size} label={size.toUpperCase()} defaultValue="apple" />
      ))}
    </div>
  ),
};

// ── Colors ──────────────────────────────────

export const Colors: Story = {
  render: (args: NativeSelectProps) => (
    <div className="flex flex-col gap-4 max-w-xs">
      {ALL_COLORS.map((color) => (
        <NativeSelect {...args} key={color} color={color} label={color.charAt(0).toUpperCase() + color.slice(1)} defaultValue="banana" />
      ))}
    </div>
  ),
};

// ── Variants ────────────────────────────────

export const Variants: Story = {
  render: (args: NativeSelectProps) => (
    <div className="flex flex-col gap-4 max-w-xs">
      {(["default", "outline", "ghost"] as const).map((variant) => (
        <NativeSelect {...args} key={variant} variant={variant} label={variant.charAt(0).toUpperCase() + variant.slice(1)} defaultValue="cherry" />
      ))}
    </div>
  ),
};

// ── Shapes ──────────────────────────────────

export const Shapes: Story = {
  render: (args: NativeSelectProps) => (
    <div className="flex flex-col gap-4 max-w-xs">
      <NativeSelect {...args} shape="rounded" label="Rounded (default)" defaultValue="apple" />
      <NativeSelect {...args} shape="square" label="Square" defaultValue="apple" />
    </div>
  ),
};

// ── States ──────────────────────────────────

export const States: Story = {
  render: (args: NativeSelectProps) => (
    <div className="flex flex-col gap-4 max-w-xs">
      <NativeSelect {...args} state="idle" label="Idle" defaultValue="apple" />
      <NativeSelect {...args} state="error" label="Error" defaultValue="apple" errorMessage="Please select a valid option" />
      <NativeSelect {...args} state="success" label="Success" defaultValue="apple" successMessage="Looks good!" />
    </div>
  ),
};

// ── Option Groups ───────────────────────────

export const OptionGroups: Story = {
  render: (args: NativeSelectProps) => (
    <div className="max-w-xs">
      <NativeSelect
        {...args}
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

// ── Error State ─────────────────────────────

export const ErrorState: Story = {
  args: {
    state: "error",
    label: "Fruit",
    errorMessage: "Please select a valid option.",
  },
};

// ── Success State ───────────────────────────

export const SuccessState: Story = {
  args: {
    state: "success",
    label: "Fruit",
    defaultValue: "apple",
    successMessage: "Looks good!",
  },
};

// ── Disabled ────────────────────────────────

export const Disabled: Story = {
  args: {
    label: "Disabled",
    defaultValue: "grape",
    disabled: true,
  },
};
