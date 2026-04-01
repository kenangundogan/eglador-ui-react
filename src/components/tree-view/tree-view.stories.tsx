import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Folder, FileText, Image, Code, Settings, Database, Globe, Package, GitBranch, Lock } from "lucide-react";
import { TreeView, type TreeViewProps, type TreeViewNode } from "./tree-view";
import { Button } from "../button";

const meta: Meta<typeof TreeView> = {
  title: "Components/TreeView",
  component: TreeView,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A tree view component for displaying hierarchical data. Supports expand/collapse, checkbox selection with indeterminate state, auto-select parents/descendants, secondary labels, connector lines, 3 sizes, custom icons, and disabled items.",
      },
    },
  },
  args: {
    selectable: false,
    multiSelect: false,
    checkbox: false,
    expandAll: false,
    showLines: false,
    size: "md",
    autoSelectParents: false,
    autoSelectDescendants: false,
  },
  argTypes: {
    selectable: { control: "boolean" },
    multiSelect: { control: "boolean" },
    checkbox: { control: "boolean" },
    expandAll: { control: "boolean" },
    showLines: { control: "boolean" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    autoSelectParents: { control: "boolean" },
    autoSelectDescendants: { control: "boolean" },
    onExpand: { action: "expanded" },
    onSelect: { action: "selected" },
  },
};

export default meta;
type Story = StoryObj<typeof TreeView>;

// ── Sample Data ──────────────────────────────

const fileSystemData: TreeViewNode[] = [
  {
    id: "src",
    label: "src",
    icon: <Folder />,
    children: [
      {
        id: "components",
        label: "components",
        icon: <Folder />,
        children: [
          {
            id: "button",
            label: "button",
            icon: <Folder />,
            children: [
              { id: "button.tsx", label: "button.tsx", icon: <Code /> },
              { id: "button.stories.tsx", label: "button.stories.tsx", icon: <Code /> },
              { id: "index.ts", label: "index.ts", icon: <Code /> },
            ],
          },
          {
            id: "input",
            label: "input",
            icon: <Folder />,
            children: [
              { id: "input.tsx", label: "input.tsx", icon: <Code /> },
              { id: "input.stories.tsx", label: "input.stories.tsx", icon: <Code /> },
            ],
          },
        ],
      },
      {
        id: "lib",
        label: "lib",
        icon: <Folder />,
        children: [
          { id: "utils.ts", label: "utils.ts", icon: <Code /> },
        ],
      },
      { id: "index.ts-root", label: "index.ts", icon: <Code /> },
    ],
  },
  {
    id: "public",
    label: "public",
    icon: <Folder />,
    children: [
      { id: "favicon.ico", label: "favicon.ico", icon: <Image /> },
      { id: "logo.svg", label: "logo.svg", icon: <Image /> },
    ],
  },
  { id: "package.json", label: "package.json", icon: <FileText /> },
  { id: "tsconfig.json", label: "tsconfig.json", icon: <Settings /> },
  { id: "README.md", label: "README.md", icon: <FileText /> },
];

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: TreeViewProps) => (
    <div className="w-75 border border-zinc-200 rounded-lg">
      <TreeView {...args} data={fileSystemData} defaultExpanded={["src"]} />
    </div>
  ),
};

// ── Expand All ───────────────────────────────

export const ExpandAll: Story = {
  render: (args: TreeViewProps) => (
    <div className="w-75 border border-zinc-200 rounded-lg">
      <TreeView {...args} data={fileSystemData} expandAll />
    </div>
  ),
};

// ── Selectable ───────────────────────────────

export const Selectable: Story = {
  render: (args: TreeViewProps) => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-3 w-75">
        <div className="border border-zinc-200 rounded-lg">
          <TreeView {...args} data={fileSystemData} selectable defaultExpanded={["src", "components"]} selected={selected} onSelect={setSelected} />
        </div>
        <span className="text-xs text-zinc-400">Selected: {selected.join(", ") || "none"}</span>
      </div>
    );
  },
};

// ── Multi Select ─────────────────────────────

export const MultiSelect: Story = {
  render: (args: TreeViewProps) => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-3 w-75">
        <div className="border border-zinc-200 rounded-lg">
          <TreeView {...args} data={fileSystemData} selectable multiSelect defaultExpanded={["src", "components"]} selected={selected} onSelect={setSelected} />
        </div>
        <span className="text-xs text-zinc-400">Selected ({selected.length}): {selected.join(", ") || "none"}</span>
      </div>
    );
  },
};

// ── With Disabled Items ──────────────────────

export const WithDisabledItems: Story = {
  render: (args: TreeViewProps) => {
    const data: TreeViewNode[] = [
      {
        id: "projects",
        label: "Projects",
        icon: <Folder />,
        children: [
          { id: "project-a", label: "Project Alpha", icon: <Package /> },
          { id: "project-b", label: "Project Beta (locked)", icon: <Lock />, disabled: true },
          { id: "project-c", label: "Project Gamma", icon: <Package /> },
        ],
      },
      {
        id: "archived",
        label: "Archived",
        icon: <Folder />,
        disabled: true,
        children: [
          { id: "old-project", label: "Old Project", icon: <Package /> },
        ],
      },
    ];

    return (
      <div className="w-75 border border-zinc-200 rounded-lg">
        <TreeView {...args} data={data} defaultExpanded={["projects"]} selectable />
      </div>
    );
  },
};

// ── Database Schema ──────────────────────────

export const DatabaseSchema: Story = {
  render: (args: TreeViewProps) => {
    const data: TreeViewNode[] = [
      {
        id: "production",
        label: "Production",
        icon: <Database />,
        children: [
          {
            id: "users-table",
            label: "users",
            icon: <Globe />,
            children: [
              { id: "users-id", label: "id (INT, PK)" },
              { id: "users-name", label: "name (VARCHAR)" },
              { id: "users-email", label: "email (VARCHAR, UNIQUE)" },
              { id: "users-created", label: "created_at (TIMESTAMP)" },
            ],
          },
          {
            id: "posts-table",
            label: "posts",
            icon: <Globe />,
            children: [
              { id: "posts-id", label: "id (INT, PK)" },
              { id: "posts-title", label: "title (VARCHAR)" },
              { id: "posts-body", label: "body (TEXT)" },
              { id: "posts-user", label: "user_id (INT, FK)" },
            ],
          },
        ],
      },
      {
        id: "staging",
        label: "Staging",
        icon: <Database />,
        children: [
          { id: "staging-users", label: "users", icon: <Globe /> },
          { id: "staging-posts", label: "posts", icon: <Globe /> },
        ],
      },
    ];

    return (
      <div className="w-80 border border-zinc-200 rounded-lg">
        <TreeView {...args} data={data} defaultExpanded={["production"]} />
      </div>
    );
  },
};

// ── Git Branches ─────────────────────────────

export const GitBranches: Story = {
  render: (args: TreeViewProps) => {
    const data: TreeViewNode[] = [
      {
        id: "local",
        label: "Local Branches",
        icon: <GitBranch />,
        children: [
          { id: "main", label: "main", icon: <GitBranch /> },
          { id: "develop", label: "develop", icon: <GitBranch /> },
          { id: "feature-auth", label: "feature/auth", icon: <GitBranch /> },
          { id: "feature-calendar", label: "feature/calendar", icon: <GitBranch /> },
          { id: "fix-scroll", label: "fix/scroll-issue", icon: <GitBranch /> },
        ],
      },
      {
        id: "remote",
        label: "Remote (origin)",
        icon: <Globe />,
        children: [
          { id: "origin-main", label: "origin/main", icon: <GitBranch /> },
          { id: "origin-develop", label: "origin/develop", icon: <GitBranch /> },
        ],
      },
    ];

    return (
      <div className="w-70 border border-zinc-200 rounded-lg">
        <TreeView {...args} data={data} expandAll selectable />
      </div>
    );
  },
};

// ── Controlled ───────────────────────────────

export const Controlled: Story = {
  render: (args: TreeViewProps) => {
    const [expanded, setExpanded] = useState<string[]>(["src"]);
    const [selected, setSelected] = useState<string[]>([]);

    return (
      <div className="flex flex-col gap-3 w-75">
        <div className="flex gap-2">
          <Button variant="outline" size="xs" onClick={() => setExpanded(collectAllExpandable(fileSystemData))}>
            Expand All
          </Button>
          <Button variant="outline" size="xs" onClick={() => setExpanded([])}>
            Collapse All
          </Button>
          <Button variant="outline" size="xs" onClick={() => setSelected([])}>
            Clear Selection
          </Button>
        </div>
        <div className="border border-zinc-200 rounded-lg">
          <TreeView
            {...args}
            data={fileSystemData}
            selectable
            multiSelect
            expanded={expanded}
            onExpand={setExpanded}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
        <span className="text-xs text-zinc-400">Expanded: {expanded.length} · Selected: {selected.length}</span>
      </div>
    );
  },
};

// ── Checkbox Selection ────────────────────────

export const CheckboxSelection: Story = {
  render: (args: TreeViewProps) => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-3 w-75">
        <div className="border border-zinc-200 rounded-lg">
          <TreeView {...args} data={fileSystemData} checkbox multiSelect defaultExpanded={["src", "components"]} selected={selected} onSelect={setSelected} />
        </div>
        <span className="text-xs text-zinc-400">Checked: {selected.join(", ") || "none"}</span>
      </div>
    );
  },
};

// ── Auto Select Descendants ──────────────────

export const AutoSelectDescendants: Story = {
  render: (args: TreeViewProps) => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-3 w-75">
        <p className="text-xs text-zinc-400">Checking a folder auto-checks all children.</p>
        <div className="border border-zinc-200 rounded-lg">
          <TreeView {...args} data={fileSystemData} checkbox multiSelect autoSelectDescendants defaultExpanded={["src", "components"]} selected={selected} onSelect={setSelected} />
        </div>
        <span className="text-xs text-zinc-400">Checked ({selected.length}): {selected.slice(0, 5).join(", ")}{selected.length > 5 ? "..." : ""}</span>
      </div>
    );
  },
};

// ── Auto Select Parents ──────────────────────

export const AutoSelectParents: Story = {
  render: (args: TreeViewProps) => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-3 w-75">
        <p className="text-xs text-zinc-400">Checking all children auto-checks the parent.</p>
        <div className="border border-zinc-200 rounded-lg">
          <TreeView {...args} data={fileSystemData} checkbox multiSelect autoSelectParents autoSelectDescendants defaultExpanded={["src", "components"]} selected={selected} onSelect={setSelected} />
        </div>
      </div>
    );
  },
};

// ── With Connector Lines ─────────────────────

export const WithConnectorLines: Story = {
  render: (args: TreeViewProps) => (
    <div className="w-75 border border-zinc-200 rounded-lg">
      <TreeView {...args} data={fileSystemData} showLines defaultExpanded={["src", "components", "button"]} />
    </div>
  ),
};

// ── Sizes ────────────────────────────────────

export const SizeComparison: Story = {
  render: () => (
    <div className="flex gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="w-60">
          <span className="text-xs text-zinc-400 mb-2 block">{size}</span>
          <div className="border border-zinc-200 rounded-lg">
            <TreeView data={fileSystemData.slice(0, 1)} size={size} defaultExpanded={["src", "components"]} />
          </div>
        </div>
      ))}
    </div>
  ),
};

// ── Secondary Labels ─────────────────────────

export const SecondaryLabels: Story = {
  render: (args: TreeViewProps) => {
    const data: TreeViewNode[] = [
      {
        id: "src",
        label: "src",
        secondaryLabel: "4 items",
        icon: <Folder />,
        children: [
          { id: "app.tsx", label: "app.tsx", secondaryLabel: "2.4 KB", icon: <Code /> },
          { id: "index.ts", label: "index.ts", secondaryLabel: "0.8 KB", icon: <Code /> },
          { id: "styles.css", label: "styles.css", secondaryLabel: "1.2 KB", icon: <FileText /> },
          { id: "utils.ts", label: "utils.ts", secondaryLabel: "0.3 KB", icon: <Code /> },
        ],
      },
      {
        id: "public",
        label: "public",
        secondaryLabel: "2 items",
        icon: <Folder />,
        children: [
          { id: "logo.svg", label: "logo.svg", secondaryLabel: "4.1 KB", icon: <Image /> },
          { id: "favicon.ico", label: "favicon.ico", secondaryLabel: "1.0 KB", icon: <Image /> },
        ],
      },
      { id: "package.json", label: "package.json", secondaryLabel: "1.5 KB", icon: <Settings /> },
    ];

    return (
      <div className="w-80 border border-zinc-200 rounded-lg">
        <TreeView {...args} data={data} expandAll />
      </div>
    );
  },
};

// Helper for controlled story
function collectAllExpandable(nodes: TreeViewNode[]): string[] {
  const ids: string[] = [];
  const walk = (items: TreeViewNode[]) => {
    items.forEach((node) => {
      if (node.children && node.children.length > 0) {
        ids.push(node.id);
        walk(node.children);
      }
    });
  };
  walk(nodes);
  return ids;
}
