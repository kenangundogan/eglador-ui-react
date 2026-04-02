import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, Slash } from "lucide-react";
import { EllipsisIcon } from "../../lib/icons";
import { Breadcrumb } from "./breadcrumb";
import { Dropdown } from "../dropdown";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A breadcrumb navigation component with compound API, custom separator, ellipsis for collapsed items, dropdown integration, and asChild support for custom link components.",
      },
    },
  },
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
    <div className="flex flex-col gap-4">
      <Breadcrumb aria-label="Slash separator" separator={<Slash className="size-3.5 text-zinc-300" />}>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/docs">Docs</Breadcrumb.Item>
        <Breadcrumb.Item isActive>API</Breadcrumb.Item>
      </Breadcrumb>

      <Breadcrumb aria-label="Arrow separator" separator={<span className="text-zinc-300">→</span>}>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/blog">Blog</Breadcrumb.Item>
        <Breadcrumb.Item isActive>Post Title</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  ),
};

// ── Separator Component ──────────────────────

export const SeparatorComponent: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/docs">Docs</Breadcrumb.Item>
      <Breadcrumb.Separator>
        <Slash className="size-3.5" />
      </Breadcrumb.Separator>
      <Breadcrumb.Item isActive>API</Breadcrumb.Item>
    </Breadcrumb>
  ),
};

// ── Ellipsis (Collapsed) ─────────────────────

export const Collapsed: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Ellipsis />
      <Breadcrumb.Item href="/category/sub">Subcategory</Breadcrumb.Item>
      <Breadcrumb.Item isActive>Current Page</Breadcrumb.Item>
    </Breadcrumb>
  ),
};

// ── With Dropdown ────────────────────────────

export const WithDropdown: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Ellipsis>
        <Dropdown side="bottom" align="start">
          <Dropdown.Trigger asChild>
            <button type="button" aria-label="Show hidden pages" className="flex items-center justify-center size-6 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer">
              <EllipsisIcon className="size-4" />
            </button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <a href="/category" className="block px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 rounded-md">Category</a>
            <a href="/category/sub" className="block px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 rounded-md">Subcategory</a>
            <a href="/category/sub/items" className="block px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 rounded-md">Items</a>
          </Dropdown.Content>
        </Dropdown>
      </Breadcrumb.Ellipsis>
      <Breadcrumb.Item href="/category/sub/items/detail">Detail</Breadcrumb.Item>
      <Breadcrumb.Item isActive>Current Page</Breadcrumb.Item>
    </Breadcrumb>
  ),
};

// ── asChild (Custom Link) ────────────────────

export const AsChild: Story = {
  render: () => {
    const CustomLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
      <a href={href} className={className} onClick={(e) => { e.preventDefault(); alert(`Navigate to ${href}`); }}>
        {children}
      </a>
    );

    return (
      <Breadcrumb>
        <Breadcrumb.Item asChild>
          <CustomLink href="/">Home</CustomLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item asChild>
          <CustomLink href="/products">Products</CustomLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item isActive>Details</Breadcrumb.Item>
      </Breadcrumb>
    );
  },
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
