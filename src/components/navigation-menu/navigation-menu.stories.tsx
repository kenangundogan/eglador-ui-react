import type { Meta, StoryObj } from "@storybook/react-vite";
import { Zap, BookOpen, LayoutGrid, Users, Settings, Code, Palette, Globe, Database, Shield, Rocket, FileText, HelpCircle, MessageSquare, Star } from "lucide-react";
import { Link } from "../link";
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

// ── Helper: ListItem ─────────────────────────

function ListItem({ title, description, icon, href = "#" }: { title: string; description: string; icon?: React.ReactNode; href?: string }) {
  return (
    <Link href={href} className="flex gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors group">
      {icon && (
        <div className="shrink-0 size-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-200 transition-colors">
          <span className="[&>svg]:w-full [&>svg]:h-full size-4">{icon}</span>
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-zinc-900">{title}</span>
        <span className="text-xs text-zinc-400 leading-relaxed mt-0.5">{description}</span>
      </div>
    </Link>
  );
}

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
                <ListItem icon={<Zap />} title="Introduction" description="Build modern UIs with our component library." />
                <ListItem icon={<BookOpen />} title="Installation" description="Step-by-step guide to get started quickly." />
                <ListItem icon={<Code />} title="Usage" description="Learn how to use components in your project." />
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
            <NavigationMenu.Content className="w-[520px]">
              <div className="grid grid-cols-2 gap-1">
                <ListItem icon={<LayoutGrid />} title="Layout" description="Separator, AspectRatio, ScrollArea" />
                <ListItem icon={<Palette />} title="Forms" description="Input, Select, Checkbox, Radio" />
                <ListItem icon={<MessageSquare />} title="Feedback" description="Alert, Toast, Notification" />
                <ListItem icon={<Globe />} title="Navigation" description="Tabs, Breadcrumb, Stepper" />
                <ListItem icon={<Database />} title="Data Display" description="Table, Accordion, Badge" />
                <ListItem icon={<Shield />} title="Overlays" description="Modal, Drawer, Dropdown" />
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

// ── With Featured Section ────────────────────

export const WithFeaturedSection: Story = {
  render: (args: NavigationMenuProps) => (
    <div className="px-5 pt-5 pb-87.5">
      <NavigationMenu {...args}>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content className="w-[600px]">
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2 bg-zinc-50 rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <div className="size-10 rounded-lg bg-zinc-900 flex items-center justify-center mb-3">
                      <Rocket className="size-5 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-900">eglador-ui-react</h3>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">A lightweight UI component library built with Tailwind CSS v4.</p>
                  </div>
                  <Link href="#" className="text-xs font-medium text-zinc-900 hover:text-zinc-600 transition-colors mt-4">
                    Get started →
                  </Link>
                </div>
                <div className="col-span-3 flex flex-col gap-1">
                  <ListItem icon={<Code />} title="Components" description="40+ ready-to-use React components." />
                  <ListItem icon={<Palette />} title="Themes" description="Customizable design tokens." />
                  <ListItem icon={<FileText />} title="Templates" description="Pre-built page templates." />
                  <ListItem icon={<Star />} title="Examples" description="Real-world usage examples." />
                </div>
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
            <NavigationMenu.Content className="w-80">
              <div className="flex flex-col gap-1">
                <ListItem icon={<BookOpen />} title="Documentation" description="Complete API reference and guides." />
                <ListItem icon={<HelpCircle />} title="Support" description="Get help from the community." />
                <ListItem icon={<MessageSquare />} title="Changelog" description="Latest updates and releases." />
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
                  <ListItem title="Members" description="View all team members." />
                  <ListItem title="Invitations" description="Manage pending invites." />
                  <ListItem title="Roles" description="Configure permissions." />
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
                <NavigationMenu.Content className="w-[500px]">
                  <div className="grid grid-cols-3 gap-1">
                    <ListItem title="Electronics" description="Phones, laptops, accessories" />
                    <ListItem title="Clothing" description="Men's, women's, kids" />
                    <ListItem title="Home" description="Furniture, decor, kitchen" />
                    <ListItem title="Sports" description="Equipment, outdoor gear" />
                    <ListItem title="Books" description="Fiction, non-fiction, academic" />
                    <ListItem title="Toys" description="Games, puzzles, outdoor" />
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
          <Link href="#" className="hover:text-zinc-900 transition-colors">Sign In</Link>
          <span className="text-zinc-300">|</span>
          <Link href="#" className="hover:text-zinc-900 transition-colors">Cart (0)</Link>
        </div>
      </div>
    </div>
  ),
};
