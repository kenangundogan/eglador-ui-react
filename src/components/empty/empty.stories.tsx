import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cloud, FolderPlus, Bell, Search, FileX, ShieldX, WifiOff, Import } from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";
import { Empty, type EmptyProps } from "./empty";

const meta: Meta<typeof Empty> = {
  title: "Components/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "An empty state component for displaying when there is no data. Supports custom icon in a circular container, title, description, action buttons, and 3 sizes.",
      },
    },
  },
  args: {
    size: "md",
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    title: { control: "text" },
    description: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Empty>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-lg max-w-md">
      <Empty {...args} title="No data" description="There is no data to display at the moment." />
    </div>
  ),
};

// ── Cloud Storage ────────────────────────────

export const CloudStorage: Story = {
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-lg max-w-md">
      <Empty
        {...args}
        icon={<Cloud strokeWidth={1} />}
        title="Cloud Storage Empty"
        description="Upload files to your cloud storage to access them anywhere."
        action={<Button size="xs" color="primary">Upload Files</Button>}
      />
    </div>
  ),
};

// ── No Projects ──────────────────────────────

export const NoProjects: Story = {
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-lg max-w-md">
      <Empty
        {...args}
        icon={<FolderPlus strokeWidth={1} />}
        title="No Projects Yet"
        description="You haven't created any projects yet. Get started by creating your first project."
      >
        <div className="flex gap-2 mt-1">
          <Button size="xs" color="primary">Create Project</Button>
          <Button size="xs" variant="outline" icon={<Import />}>Import Project</Button>
        </div>
      </Empty>
    </div>
  ),
};

// ── No Notifications ─────────────────────────

export const NoNotifications: Story = {
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-lg max-w-md">
      <Empty
        {...args}
        icon={<Bell strokeWidth={1} />}
        title="No Notifications"
        description="You're all caught up. New notifications will appear here."
        action={<Button size="xs" variant="outline">Refresh</Button>}
      />
    </div>
  ),
};

// ── 404 Not Found ────────────────────────────

export const NotFound: Story = {
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-lg max-w-lg">
      <Empty
        {...args}
        size="lg"
        title="404 - Not Found"
        description="The page you're looking for doesn't exist. Try searching for what you need below."
      >
        <div className="flex flex-col items-center gap-3 mt-1 w-full max-w-xs">
          <Input size="xs" icon={<Search />} placeholder="Try searching for pages..." className="w-full" />
          <span className="text-xs text-zinc-400">
            Need help? <a href="#" className="text-blue-500 hover:text-blue-600 font-medium">Contact support</a>
          </span>
        </div>
      </Empty>
    </div>
  ),
};

// ── No Search Results ────────────────────────

export const NoSearchResults: Story = {
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-lg max-w-md">
      <Empty
        {...args}
        icon={<Search strokeWidth={1} />}
        title="No results found"
        description="We couldn't find anything matching your search. Try adjusting your filters or search terms."
        action={<Button size="xs" variant="outline">Clear filters</Button>}
      />
    </div>
  ),
};

// ── Error State ──────────────────────────────

export const ErrorState: Story = {
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-lg max-w-md">
      <Empty
        {...args}
        icon={<FileX strokeWidth={1} />}
        title="Failed to load"
        description="Something went wrong while loading the data. Please try again."
        action={<Button size="xs" color="danger" variant="outline">Retry</Button>}
      />
    </div>
  ),
};

// ── Permission Denied ────────────────────────

export const PermissionDenied: Story = {
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-lg max-w-md">
      <Empty
        {...args}
        icon={<ShieldX strokeWidth={1} />}
        title="Access denied"
        description="You don't have permission to view this content. Contact your administrator."
      />
    </div>
  ),
};

// ── Offline ──────────────────────────────────

export const Offline: Story = {
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-lg max-w-md">
      <Empty
        {...args}
        icon={<WifiOff strokeWidth={1} />}
        title="You're offline"
        description="Check your internet connection and try again."
        action={<Button size="xs" variant="outline">Retry</Button>}
      />
    </div>
  ),
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="border border-zinc-200 rounded-lg max-w-md">
          <Empty size={size} icon={<Bell strokeWidth={1} />} title={`Size: ${size}`} description="This is an empty state placeholder." />
        </div>
      ))}
    </div>
  ),
};
