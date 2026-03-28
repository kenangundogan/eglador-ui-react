import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, ChevronRight, Slash } from "lucide-react";
import { Breadcrumb } from "./breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
      <Breadcrumb.Item isActive>Details</Breadcrumb.Item>
    </Breadcrumb>
  ),
};

// ── With Icon ────────────────────────────────

export const WithIcon: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.Item href="/">
        <Home className="size-3.5" />
        Home
      </Breadcrumb.Item>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item href="/dashboard/settings">Settings</Breadcrumb.Item>
      <Breadcrumb.Item isActive>Profile</Breadcrumb.Item>
    </Breadcrumb>
  ),
};

// ── Custom Separator ─────────────────────────

export const CustomSeparator: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Breadcrumb separator={<Slash className="size-3.5 text-zinc-300" />}>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/docs">Docs</Breadcrumb.Item>
        <Breadcrumb.Item isActive>API</Breadcrumb.Item>
      </Breadcrumb>

      <Breadcrumb separator={<span className="text-zinc-300">→</span>}>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/blog">Blog</Breadcrumb.Item>
        <Breadcrumb.Item isActive>Post Title</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  ),
};

// ── Long Path ────────────────────────────────

export const LongPath: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="/category">Category</Breadcrumb.Item>
      <Breadcrumb.Item href="/category/sub">Subcategory</Breadcrumb.Item>
      <Breadcrumb.Item href="/category/sub/items">Items</Breadcrumb.Item>
      <Breadcrumb.Item isActive>Item Detail</Breadcrumb.Item>
    </Breadcrumb>
  ),
};
