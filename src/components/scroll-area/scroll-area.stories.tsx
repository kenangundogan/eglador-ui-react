import type { Meta, StoryObj } from "@storybook/react-vite";
import { cn } from "../../lib/utils";
import { ScrollArea, type ScrollAreaProps } from "./scroll-area";
import { Separator } from "../separator";
import { Table } from "../table";

const meta: Meta<typeof ScrollArea> = {
  title: "Components/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A scroll area container with custom thin scrollbar styling. Supports vertical, horizontal, and both orientations with auto/always/hover scrollbar visibility.",
      },
    },
  },
  args: {
    orientation: "vertical",
    scrollbarVisibility: "auto",
  },
  argTypes: {
    orientation: { control: "select", options: ["vertical", "horizontal", "both"] },
    scrollbarVisibility: { control: "select", options: ["auto", "always", "hover"] },
    maxHeight: { control: "text" },
    maxWidth: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

// ── Vertical ─────────────────────────────────

export const Vertical: Story = {
  render: (args: ScrollAreaProps) => (
    <div className="w-75">
      <ScrollArea {...args} maxHeight={250} className="border border-zinc-200 rounded-lg">
        <div className="p-4">
          <h4 className="text-sm font-semibold text-zinc-900 mb-3">Notifications</h4>
          {Array.from({ length: 15 }, (_, i) => (
            <div key={i}>
              <div className="py-2.5">
                <p className="text-sm text-zinc-700">Notification {i + 1}</p>
                <p className="text-xs text-zinc-400 mt-0.5">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              {i < 14 && <Separator />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

// ── Horizontal ───────────────────────────────

export const Horizontal: Story = {
  render: (args: ScrollAreaProps) => (
    <div className="w-100">
      <ScrollArea {...args} orientation="horizontal" className="border border-zinc-200 rounded-lg">
        <div className="flex gap-3 p-4 w-max">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="flex-none w-32 h-24 rounded-lg bg-zinc-100 flex items-center justify-center text-sm font-medium text-zinc-500"
            >
              Item {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

// ── Both Directions ──────────────────────────

export const BothDirections: Story = {
  render: (args: ScrollAreaProps) => (
    <ScrollArea {...args} orientation="both" maxHeight={250} maxWidth={400} className="border border-zinc-200 rounded-lg">
      <div className="w-200 p-4">
        <Table size="xs">
          <Table.Head>
            <Table.Row>
              {Array.from({ length: 10 }, (_, i) => (
                <Table.Header key={i} className="whitespace-nowrap">Column {i + 1}</Table.Header>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {Array.from({ length: 20 }, (_, row) => (
              <Table.Row key={row}>
                {Array.from({ length: 10 }, (_, col) => (
                  <Table.Cell key={col} className="whitespace-nowrap">Row {row + 1}, Col {col + 1}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </ScrollArea>
  ),
};

// ── Hover Scrollbar ──────────────────────────

export const HoverScrollbar: Story = {
  render: (args: ScrollAreaProps) => (
    <div className="w-75">
      <ScrollArea {...args} scrollbarVisibility="hover" maxHeight={200} className="border border-zinc-200 rounded-lg">
        <div className="p-4">
          <h4 className="text-sm font-semibold text-zinc-900 mb-3">Hover to see scrollbar</h4>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} className="text-sm text-zinc-600 py-1.5">List item {i + 1}</p>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

// ── Always Visible Scrollbar ─────────────────

export const AlwaysVisible: Story = {
  render: (args: ScrollAreaProps) => (
    <div className="w-75">
      <ScrollArea {...args} scrollbarVisibility="always" maxHeight={200} className="border border-zinc-200 rounded-lg">
        <div className="p-4">
          <h4 className="text-sm font-semibold text-zinc-900 mb-3">Always visible scrollbar</h4>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} className="text-sm text-zinc-600 py-1.5">List item {i + 1}</p>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

// ── Chat Messages ────────────────────────────

export const ChatMessages: Story = {
  render: (args: ScrollAreaProps) => (
    <div className="w-87.5">
      <ScrollArea {...args} maxHeight={300} scrollbarVisibility="hover" className="border border-zinc-200 rounded-lg">
        <div className="p-4 flex flex-col gap-3">
          {[
            { from: "Alice", msg: "Hey, how's the project going?", self: false },
            { from: "You", msg: "Pretty good! Just finished the scroll area component.", self: true },
            { from: "Alice", msg: "Nice! Does it support custom scrollbar styles?", self: false },
            { from: "You", msg: "Yes, thin scrollbar with hover visibility option.", self: true },
            { from: "Alice", msg: "That's great. What about horizontal scrolling?", self: false },
            { from: "You", msg: "Supports vertical, horizontal, and both directions.", self: true },
            { from: "Alice", msg: "Perfect. Can you send me a preview?", self: false },
            { from: "You", msg: "Sure, I'll share the Storybook link.", self: true },
            { from: "Alice", msg: "Thanks! Looking forward to it.", self: false },
            { from: "You", msg: "No problem, give me a few minutes.", self: true },
          ].map((item, i) => (
            <div key={i} className={cn("flex flex-col max-w-4/5", item.self ? "self-end items-end" : "self-start items-start")}>
              <span className="text-[10px] text-zinc-400 mb-0.5">{item.from}</span>
              <div className={cn("px-3 py-2 rounded-xl text-sm", item.self ? "bg-black text-white rounded-br-sm" : "bg-zinc-100 text-zinc-700 rounded-bl-sm")}>
                {item.msg}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};
