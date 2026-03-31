import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy, Scissors, Clipboard, RotateCcw, RotateCw, Trash2, Edit, Share, Download, FolderPlus, FileText, Image, Grid, List, Eye, EyeOff, Sun, Moon, Monitor } from "lucide-react";
import { ContextMenu } from "./context-menu";

const meta: Meta<typeof ContextMenu> = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A right-click context menu with compound API. Supports items with icons and shortcuts, checkbox/radio items, separators, labels, sub-menus with viewport boundary detection, and keyboard navigation (Arrow keys + Enter).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenu.Trigger>
        <div className="flex items-center justify-center h-48 w-full max-w-md border-2 border-dashed border-zinc-300 rounded-xl text-sm text-zinc-400 cursor-context-menu">
          Right-click here
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item icon={<Scissors />} shortcut="⌘X">Cut</ContextMenu.Item>
        <ContextMenu.Item icon={<Copy />} shortcut="⌘C">Copy</ContextMenu.Item>
        <ContextMenu.Item icon={<Clipboard />} shortcut="⌘V">Paste</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item icon={<RotateCcw />} shortcut="⌘Z">Undo</ContextMenu.Item>
        <ContextMenu.Item icon={<RotateCw />} shortcut="⌘⇧Z">Redo</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item icon={<Trash2 />} danger>Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  ),
};

// ── With Checkbox Items ──────────────────────

export const WithCheckboxItems: Story = {
  render: () => {
    const [showGrid, setShowGrid] = useState(true);
    const [showRulers, setShowRulers] = useState(false);
    const [snapToGrid, setSnapToGrid] = useState(true);
    return (
      <ContextMenu>
        <ContextMenu.Trigger>
          <div className="flex items-center justify-center h-48 w-full max-w-md border-2 border-dashed border-zinc-300 rounded-xl text-sm text-zinc-400 cursor-context-menu">
            Right-click for view options
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Label>View</ContextMenu.Label>
          <ContextMenu.CheckboxItem checked={showGrid} onCheckedChange={setShowGrid} icon={<Grid />}>
            Show Grid
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem checked={showRulers} onCheckedChange={setShowRulers}>
            Show Rulers
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem checked={snapToGrid} onCheckedChange={setSnapToGrid}>
            Snap to Grid
          </ContextMenu.CheckboxItem>
          <ContextMenu.Separator />
          <ContextMenu.Item icon={<Eye />}>Zoom In</ContextMenu.Item>
          <ContextMenu.Item icon={<EyeOff />}>Zoom Out</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
  },
};

// ── With Radio Items ─────────────────────────

export const WithRadioItems: Story = {
  render: () => {
    const [theme, setTheme] = useState("system");
    const [view, setView] = useState("grid");
    return (
      <ContextMenu>
        <ContextMenu.Trigger>
          <div className="flex items-center justify-center h-48 w-full max-w-md border-2 border-dashed border-zinc-300 rounded-xl text-sm text-zinc-400 cursor-context-menu">
            Right-click for preferences
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Label>Theme</ContextMenu.Label>
          <ContextMenu.RadioGroup value={theme} onValueChange={setTheme}>
            <ContextMenu.RadioItem value="light" icon={<Sun />}>Light</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="dark" icon={<Moon />}>Dark</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="system" icon={<Monitor />}>System</ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
          <ContextMenu.Separator />
          <ContextMenu.Label>Layout</ContextMenu.Label>
          <ContextMenu.RadioGroup value={view} onValueChange={setView}>
            <ContextMenu.RadioItem value="grid" icon={<Grid />}>Grid</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="list" icon={<List />}>List</ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Content>
      </ContextMenu>
    );
  },
};

// ── With Labels & Sub Menu ───────────────────

export const WithSubMenu: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenu.Trigger>
        <div className="flex items-center justify-center h-48 w-full max-w-md border-2 border-dashed border-zinc-300 rounded-xl text-sm text-zinc-400 cursor-context-menu">
          Right-click here
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item icon={<Edit />}>Edit</ContextMenu.Item>
        <ContextMenu.Item icon={<Copy />}>Duplicate</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Sub label="New" icon={<FolderPlus />}>
          <ContextMenu.Item icon={<FileText />}>Document</ContextMenu.Item>
          <ContextMenu.Item icon={<Image />}>Image</ContextMenu.Item>
          <ContextMenu.Item icon={<FolderPlus />}>Folder</ContextMenu.Item>
        </ContextMenu.Sub>
        <ContextMenu.Separator />
        <ContextMenu.Item icon={<Share />}>Share</ContextMenu.Item>
        <ContextMenu.Item icon={<Download />} shortcut="⌘D">Download</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item icon={<Trash2 />} danger>Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  ),
};

// ── Disabled Items ───────────────────────────

export const DisabledItems: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenu.Trigger>
        <div className="flex items-center justify-center h-48 w-full max-w-md border-2 border-dashed border-zinc-300 rounded-xl text-sm text-zinc-400 cursor-context-menu">
          Right-click here
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item icon={<Copy />} shortcut="⌘C">Copy</ContextMenu.Item>
        <ContextMenu.Item icon={<Clipboard />} shortcut="⌘V" disabled>Paste (disabled)</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item icon={<RotateCcw />} shortcut="⌘Z" disabled>Undo (nothing to undo)</ContextMenu.Item>
        <ContextMenu.Item icon={<RotateCw />} shortcut="⌘⇧Z" disabled>Redo (nothing to redo)</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  ),
};

// ── File Manager ─────────────────────────────

export const FileManager: Story = {
  render: () => {
    const [sortBy, setSortBy] = useState("name");
    const [viewMode, setViewMode] = useState("grid");
    const [showHidden, setShowHidden] = useState(false);
    return (
      <ContextMenu>
        <ContextMenu.Trigger>
          <div className="grid grid-cols-3 gap-3 p-4 max-w-md border border-zinc-200 rounded-xl cursor-context-menu">
            {["Documents", "Photos", "Downloads", "Music", "Videos", "Desktop"].map((name) => (
              <div key={name} className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-zinc-50">
                <div className="size-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                  <FolderPlus className="size-5 text-zinc-400" />
                </div>
                <span className="text-xs text-zinc-600">{name}</span>
              </div>
            ))}
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Label>Folder</ContextMenu.Label>
          <ContextMenu.Item icon={<FolderPlus />}>New folder</ContextMenu.Item>
          <ContextMenu.Item icon={<FileText />}>New file</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item icon={<Clipboard />} shortcut="⌘V">Paste</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Sub label="Sort by">
            <ContextMenu.RadioGroup value={sortBy} onValueChange={setSortBy}>
              <ContextMenu.RadioItem value="name">Name</ContextMenu.RadioItem>
              <ContextMenu.RadioItem value="date">Date modified</ContextMenu.RadioItem>
              <ContextMenu.RadioItem value="size">Size</ContextMenu.RadioItem>
              <ContextMenu.RadioItem value="type">Type</ContextMenu.RadioItem>
            </ContextMenu.RadioGroup>
          </ContextMenu.Sub>
          <ContextMenu.Sub label="View">
            <ContextMenu.RadioGroup value={viewMode} onValueChange={setViewMode}>
              <ContextMenu.RadioItem value="grid" icon={<Grid />}>Grid</ContextMenu.RadioItem>
              <ContextMenu.RadioItem value="list" icon={<List />}>List</ContextMenu.RadioItem>
            </ContextMenu.RadioGroup>
          </ContextMenu.Sub>
          <ContextMenu.Separator />
          <ContextMenu.CheckboxItem checked={showHidden} onCheckedChange={setShowHidden}>
            Show hidden files
          </ContextMenu.CheckboxItem>
        </ContextMenu.Content>
      </ContextMenu>
    );
  },
};
