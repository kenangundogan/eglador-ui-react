import type { Meta, StoryObj } from "@storybook/react-vite";
import { Zap, BookOpen, LayoutGrid, Users, Settings, Code, Palette, Globe, Database, Shield, Rocket, FileText, HelpCircle, MessageSquare, Star } from "lucide-react";
import { NavigationMenu, type NavigationMenuProps } from "./navigation-menu";

const meta: Meta<typeof NavigationMenu> = {
  title: "Components/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A navigation menu with dropdown panels for site-wide navigation. Supports horizontal and vertical orientations, hover-triggered dropdowns with delay, rich content panels, and simple link items.",
      },
    },
  },
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: NavigationMenuProps) => (
    <div className="px-5 pt-5 pb-75">
      <NavigationMenu {...args}>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Getting Started</NavigationMenu.Trigger>
            <NavigationMenu.Content className="w-96">
              <div className="flex flex-col gap-1">
                <NavigationMenu.ListItem icon={<Zap />} title="Introduction" description="Build modern UIs with our component library." />
                <NavigationMenu.ListItem icon={<BookOpen />} title="Installation" description="Step-by-step guide to get started quickly." />
                <NavigationMenu.ListItem icon={<Code />} title="Usage" description="Learn how to use components in your project." />
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
            <NavigationMenu.Content className="w-130">
              <div className="grid grid-cols-2 gap-1">
                <NavigationMenu.ListItem icon={<LayoutGrid />} title="Layout" description="Separator, AspectRatio, ScrollArea" />
                <NavigationMenu.ListItem icon={<Palette />} title="Forms" description="Input, Select, Checkbox, Radio" />
                <NavigationMenu.ListItem icon={<MessageSquare />} title="Feedback" description="Alert, Toast, Notification" />
                <NavigationMenu.ListItem icon={<Globe />} title="Navigation" description="Tabs, Breadcrumb, Stepper" />
                <NavigationMenu.ListItem icon={<Database />} title="Data Display" description="Table, Accordion, Badge" />
                <NavigationMenu.ListItem icon={<Shield />} title="Overlays" description="Modal, Drawer, Dropdown" />
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="#">Documentation</NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="#">Blog</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </div>
  ),
};

// ── ListItem ─────────────────────────────────

export const ListItem: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-sm">
      <div>
        <p className="text-xs text-zinc-400 mb-2">title only</p>
        <NavigationMenu.ListItem title="Introduction" />
      </div>
      <div>
        <p className="text-xs text-zinc-400 mb-2">title + description</p>
        <NavigationMenu.ListItem
          title="Installation"
          description="Step-by-step guide to get started quickly."
        />
      </div>
      <div>
        <p className="text-xs text-zinc-400 mb-2">title + description + icon</p>
        <NavigationMenu.ListItem
          icon={<Zap />}
          title="Quick Start"
          description="Build modern UIs with our component library."
        />
      </div>
      <div>
        <p className="text-xs text-zinc-400 mb-2">title + description + icon + href</p>
        <NavigationMenu.ListItem
          icon={<BookOpen />}
          title="Documentation"
          description="Full API reference and guides."
          href="#docs"
        />
      </div>
    </div>
  ),
};

// ── With Featured Section ────────────────────

export const WithFeaturedSection: Story = {
  render: (args: NavigationMenuProps) => (
    <div className="px-5 pt-5 pb-87.5">
      <NavigationMenu {...args}>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content className="w-150">
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2 bg-zinc-50 rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <div className="size-10 rounded-lg bg-zinc-900 flex items-center justify-center mb-3">
                      <Rocket className="size-5 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-900">eglador-ui-react</h3>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">A lightweight UI component library built with Tailwind CSS v4.</p>
                  </div>
                  <a href="#" className="text-xs font-medium text-zinc-900 hover:text-zinc-600 transition-colors mt-4">
                    Get started →
                  </a>
                </div>
                <div className="col-span-3 flex flex-col gap-1">
                  <NavigationMenu.ListItem icon={<Code />} title="Components" description="40+ ready-to-use React components." />
                  <NavigationMenu.ListItem icon={<Palette />} title="Themes" description="Customizable design tokens." />
                  <NavigationMenu.ListItem icon={<FileText />} title="Templates" description="Pre-built page templates." />
                  <NavigationMenu.ListItem icon={<Star />} title="Examples" description="Real-world usage examples." />
                </div>
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
            <NavigationMenu.Content className="w-80">
              <div className="flex flex-col gap-1">
                <NavigationMenu.ListItem icon={<BookOpen />} title="Documentation" description="Complete API reference and guides." />
                <NavigationMenu.ListItem icon={<HelpCircle />} title="Support" description="Get help from the community." />
                <NavigationMenu.ListItem icon={<MessageSquare />} title="Changelog" description="Latest updates and releases." />
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="#">Pricing</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </div>
  ),
};

// ── Simple Links Only ────────────────────────

export const SimpleLinksOnly: Story = {
  render: (args: NavigationMenuProps) => (
    <NavigationMenu {...args}>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#" active>Home</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">About</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Services</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Contact</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  ),
};

// ── Vertical ─────────────────────────────────

export const Vertical: Story = {
  render: (args: NavigationMenuProps) => (
    <div className="p-5 flex gap-10">
      <div className="w-55">
        <NavigationMenu {...args} orientation="vertical">
          <NavigationMenu.List>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="#" active>
                <span className="flex items-center gap-2"><LayoutGrid className="size-4" /> Dashboard</span>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger>
                <span className="flex items-center gap-2"><Users className="size-4" /> Team</span>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="w-60">
                <div className="flex flex-col gap-1">
                  <NavigationMenu.ListItem title="Members" description="View all team members." />
                  <NavigationMenu.ListItem title="Invitations" description="Manage pending invites." />
                  <NavigationMenu.ListItem title="Roles" description="Configure permissions." />
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="#">
                <span className="flex items-center gap-2"><FileText className="size-4" /> Projects</span>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="#">
                <span className="flex items-center gap-2"><Settings className="size-4" /> Settings</span>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu>
      </div>
      <div className="flex-1 bg-zinc-50 rounded-lg p-6 text-sm text-zinc-400">
        Page content area
      </div>
    </div>
  ),
};

// ── With Active State ────────────────────────

export const WithActiveState: Story = {
  render: (args: NavigationMenuProps) => (
    <div className="border-b border-zinc-200 px-4">
      <NavigationMenu {...args}>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#" active>Overview</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#">Analytics</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#">Reports</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#">Settings</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </div>
  ),
};

// ── E-commerce Header ────────────────────────

export const EcommerceHeader: Story = {
  render: (args: NavigationMenuProps) => (
    <div className="px-5 pt-5 pb-80">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold text-zinc-900">Store</span>
          <NavigationMenu {...args}>
            <NavigationMenu.List>
              <NavigationMenu.Item>
                <NavigationMenu.Trigger>Categories</NavigationMenu.Trigger>
                <NavigationMenu.Content className="w-125">
                  <div className="grid grid-cols-3 gap-1">
                    <NavigationMenu.ListItem title="Electronics" description="Phones, laptops, accessories" />
                    <NavigationMenu.ListItem title="Clothing" description="Men's, women's, kids" />
                    <NavigationMenu.ListItem title="Home" description="Furniture, decor, kitchen" />
                    <NavigationMenu.ListItem title="Sports" description="Equipment, outdoor gear" />
                    <NavigationMenu.ListItem title="Books" description="Fiction, non-fiction, academic" />
                    <NavigationMenu.ListItem title="Toys" description="Games, puzzles, outdoor" />
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="#">Deals</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="#">New Arrivals</NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <a href="#" className="text-zinc-500 hover:text-zinc-700 transition-colors">Sign In</a>
          <span className="text-zinc-300">|</span>
          <a href="#" className="text-zinc-500 hover:text-zinc-700 transition-colors">Cart (0)</a>
        </div>
      </div>
    </div>
  ),
};
