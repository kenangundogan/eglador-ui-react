import type { Meta, StoryObj } from "@storybook/react-vite";
import { Resizable, type ResizableProps } from "./resizable";

const meta: Meta<typeof Resizable> = {
  title: "Components/Resizable",
  component: Resizable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A resizable panel layout with compound API. Supports horizontal and vertical directions, drag handles with optional grip indicator, and per-panel min/max size constraints.",
      },
    },
  },
  args: {
    direction: "horizontal",
  },
  argTypes: {
    direction: { control: "select", options: ["horizontal", "vertical"] },
  },
};

export default meta;
type Story = StoryObj<typeof Resizable>;

// ── Horizontal ───────────────────────────────

export const Horizontal: Story = {
  render: (args: ResizableProps) => (
    <Resizable {...args} className="h-48 border border-zinc-200 rounded-lg">
      <Resizable.Panel className="flex items-center justify-center bg-zinc-50 text-sm font-medium text-zinc-500">
        Panel A
      </Resizable.Panel>
      <Resizable.Handle withHandle />
      <Resizable.Panel className="flex items-center justify-center bg-white text-sm font-medium text-zinc-500">
        Panel B
      </Resizable.Panel>
    </Resizable>
  ),
};

// ── Vertical ─────────────────────────────────

export const Vertical: Story = {
  render: (args: ResizableProps) => (
    <Resizable {...args} direction="vertical" className="h-80 border border-zinc-200 rounded-lg">
      <Resizable.Panel className="flex items-center justify-center bg-zinc-50 text-sm font-medium text-zinc-500">
        Top Panel
      </Resizable.Panel>
      <Resizable.Handle withHandle />
      <Resizable.Panel className="flex items-center justify-center bg-white text-sm font-medium text-zinc-500">
        Bottom Panel
      </Resizable.Panel>
    </Resizable>
  ),
};

// ── Three Panels ─────────────────────────────

export const ThreePanels: Story = {
  render: (args: ResizableProps) => (
    <Resizable {...args} defaultSizes={[25, 50, 25]} className="h-48 border border-zinc-200 rounded-lg">
      <Resizable.Panel className="flex items-center justify-center bg-zinc-50 text-sm font-medium text-zinc-500">
        Sidebar
      </Resizable.Panel>
      <Resizable.Handle withHandle />
      <Resizable.Panel className="flex items-center justify-center bg-white text-sm font-medium text-zinc-500">
        Content
      </Resizable.Panel>
      <Resizable.Handle withHandle />
      <Resizable.Panel className="flex items-center justify-center bg-zinc-50 text-sm font-medium text-zinc-500">
        Inspector
      </Resizable.Panel>
    </Resizable>
  ),
};

// ── Without Grip Handle ──────────────────────

export const WithoutGripHandle: Story = {
  render: (args: ResizableProps) => (
    <Resizable {...args} className="h-48 border border-zinc-200 rounded-lg">
      <Resizable.Panel className="flex items-center justify-center bg-zinc-50 text-sm font-medium text-zinc-500">
        Left
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel className="flex items-center justify-center bg-white text-sm font-medium text-zinc-500">
        Right
      </Resizable.Panel>
    </Resizable>
  ),
};

// ── Min/Max Constraints ──────────────────────

export const MinMaxConstraints: Story = {
  render: (args: ResizableProps) => (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-zinc-400">Left panel: min 20%, max 60%</span>
      <Resizable {...args} className="h-48 border border-zinc-200 rounded-lg">
        <Resizable.Panel minSize={20} maxSize={60} className="flex items-center justify-center bg-zinc-50 text-sm font-medium">
          Constrained (20-60%)
        </Resizable.Panel>
        <Resizable.Handle withHandle />
        <Resizable.Panel className="flex items-center justify-center bg-white text-sm font-medium text-zinc-500">
          Flexible
        </Resizable.Panel>
      </Resizable>
    </div>
  ),
};

// ── Nested ───────────────────────────────────

export const Nested: Story = {
  render: (args: ResizableProps) => (
    <Resizable {...args} className="h-72 border border-zinc-200 rounded-lg">
      <Resizable.Panel className="flex items-center justify-center bg-zinc-50 text-sm font-medium text-zinc-500">
        Sidebar
      </Resizable.Panel>
      <Resizable.Handle withHandle />
      <Resizable.Panel>
        <Resizable direction="vertical" className="h-full">
          <Resizable.Panel className="flex items-center justify-center bg-white text-sm font-medium text-zinc-500">
            Editor
          </Resizable.Panel>
          <Resizable.Handle withHandle />
          <Resizable.Panel className="flex items-center justify-center bg-zinc-50 text-sm font-medium text-zinc-500">
            Terminal
          </Resizable.Panel>
        </Resizable>
      </Resizable.Panel>
    </Resizable>
  ),
};

// ── IDE Layout ───────────────────────────────

export const IDELayout: Story = {
  render: (args: ResizableProps) => (
    <Resizable {...args} defaultSizes={[20, 60, 20]} className="h-80 border border-zinc-200 rounded-lg">
      <Resizable.Panel minSize={15} maxSize={30}>
        <div className="h-full bg-zinc-900 text-zinc-400 text-xs p-3">
          <p className="font-semibold text-zinc-300 mb-2">Explorer</p>
          {["src/", "  components/", "    button.tsx", "    input.tsx", "  lib/", "    utils.ts", "  index.ts"].map((f, i) => (
            <p key={i} className="py-0.5 font-mono">{f}</p>
          ))}
        </div>
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel>
        <Resizable direction="vertical" className="h-full">
          <Resizable.Panel>
            <div className="h-full bg-zinc-950 text-green-400 text-xs p-3 font-mono">
              <p className="text-zinc-500 mb-1">// editor</p>
              <p>{"export function Button() {"}</p>
              <p>{"  return <button>Click</button>"}</p>
              <p>{"}"}</p>
            </div>
          </Resizable.Panel>
          <Resizable.Handle />
          <Resizable.Panel minSize={15}>
            <div className="h-full bg-zinc-900 text-zinc-400 text-xs p-3 font-mono">
              <p className="text-zinc-500">$ npm run build</p>
              <p className="text-green-400">✓ Build success</p>
            </div>
          </Resizable.Panel>
        </Resizable>
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel minSize={15} maxSize={30}>
        <div className="h-full bg-zinc-50 text-zinc-500 text-xs p-3">
          <p className="font-semibold text-zinc-700 mb-2">Properties</p>
          <p className="py-0.5">variant: solid</p>
          <p className="py-0.5">color: primary</p>
          <p className="py-0.5">size: sm</p>
        </div>
      </Resizable.Panel>
    </Resizable>
  ),
};
