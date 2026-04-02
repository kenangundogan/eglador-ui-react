import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileManager, type FileManagerItem } from "./file-manager";

// ── Sample Data ──────────────────────────────

const sampleItems: FileManagerItem[] = [
  // Root folders
  { id: "f1", name: "Documents", type: "folder", modifiedAt: "2026-03-15" },
  { id: "f2", name: "Images", type: "folder", modifiedAt: "2026-03-20" },
  { id: "f3", name: "Projects", type: "folder", modifiedAt: "2026-03-28" },
  { id: "f4", name: "Downloads", type: "folder", modifiedAt: "2026-03-10" },

  // Root files
  { id: "r1", name: "README.md", type: "file", mimeType: "text/markdown", size: 2400, modifiedAt: "2026-03-30" },
  { id: "r2", name: "package.json", type: "file", mimeType: "application/json", size: 1200, modifiedAt: "2026-03-30" },
  { id: "r3", name: "notes.txt", type: "file", mimeType: "text/plain", size: 540, modifiedAt: "2026-03-25" },

  // Documents
  { id: "d1", name: "Report Q1.pdf", type: "file", parentId: "f1", mimeType: "application/pdf", size: 1540000, modifiedAt: "2026-03-15" },
  { id: "d2", name: "Invoice.pdf", type: "file", parentId: "f1", mimeType: "application/pdf", size: 320000, modifiedAt: "2026-03-12" },
  { id: "d3", name: "Proposal.docx", type: "file", parentId: "f1", mimeType: "application/vnd.openxmlformats", size: 890000, modifiedAt: "2026-03-18" },
  { id: "d4", name: "Contracts", type: "folder", parentId: "f1", modifiedAt: "2026-03-10" },
  { id: "d5", name: "NDA.pdf", type: "file", parentId: "d4", mimeType: "application/pdf", size: 220000, modifiedAt: "2026-02-28" },

  // Images
  { id: "i1", name: "hero-banner.png", type: "file", parentId: "f2", mimeType: "image/png", size: 2800000, modifiedAt: "2026-03-20", thumbnailUrl: "https://picsum.photos/seed/hero/200/200" },
  { id: "i2", name: "logo.svg", type: "file", parentId: "f2", mimeType: "image/svg+xml", size: 4800, modifiedAt: "2026-03-18" },
  { id: "i3", name: "photo-001.jpg", type: "file", parentId: "f2", mimeType: "image/jpeg", size: 3400000, modifiedAt: "2026-03-22", thumbnailUrl: "https://picsum.photos/seed/photo1/200/200" },
  { id: "i4", name: "photo-002.jpg", type: "file", parentId: "f2", mimeType: "image/jpeg", size: 2900000, modifiedAt: "2026-03-22", thumbnailUrl: "https://picsum.photos/seed/photo2/200/200" },
  { id: "i5", name: "screenshot.png", type: "file", parentId: "f2", mimeType: "image/png", size: 1200000, modifiedAt: "2026-03-25", thumbnailUrl: "https://picsum.photos/seed/screen/200/200" },

  // Projects
  { id: "p1", name: "eglador-ui", type: "folder", parentId: "f3", modifiedAt: "2026-03-28" },
  { id: "p2", name: "website", type: "folder", parentId: "f3", modifiedAt: "2026-03-25" },
  { id: "p3", name: "app.tsx", type: "file", parentId: "p1", mimeType: "text/typescript", size: 8400, modifiedAt: "2026-03-28" },
  { id: "p4", name: "index.html", type: "file", parentId: "p2", mimeType: "text/html", size: 2100, modifiedAt: "2026-03-25" },

  // Downloads
  { id: "dl1", name: "archive.zip", type: "file", parentId: "f4", mimeType: "application/zip", size: 15000000, modifiedAt: "2026-03-10" },
  { id: "dl2", name: "setup.exe", type: "file", parentId: "f4", mimeType: "application/x-msdownload", size: 45000000, modifiedAt: "2026-03-08" },
];

// ── Meta ─────────────────────────────────────

const meta: Meta<typeof FileManager> = {
  title: "Components/FileManager",
  component: FileManager,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A file manager component with grid/list views, folder navigation, breadcrumb, sidebar tree, context menu, file preview, drag-and-drop upload, search, sort, and multi-select.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
    defaultView: { control: "select", options: ["grid", "list"] },
    selectable: { control: "boolean" },
    multiSelect: { control: "boolean" },
    showSidebar: { control: "boolean" },
    showPreview: { control: "boolean" },
    showToolbar: { control: "boolean" },
    showStatusBar: { control: "boolean" },
    searchable: { control: "boolean" },
    dropZone: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof FileManager>;

// ── Default (Grid) ───────────────────────────

export const Default: Story = {
  render: () => (
    <div className="h-120">
      <FileManager items={sampleItems} />
    </div>
  ),
};

// ── List View ────────────────────────────────

export const ListView: Story = {
  render: () => (
    <div className="h-120">
      <FileManager items={sampleItems} defaultView="list" />
    </div>
  ),
};

// ── With Sidebar ─────────────────────────────

export const WithSidebar: Story = {
  render: () => (
    <div className="h-120">
      <FileManager items={sampleItems} showSidebar />
    </div>
  ),
};

// ── With Preview ─────────────────────────────

export const WithPreview: Story = {
  render: () => (
    <div className="h-120">
      <FileManager items={sampleItems} showPreview />
    </div>
  ),
};

// ── Full Featured ────────────────────────────

export const FullFeatured: Story = {
  render: () => (
    <div className="h-150">
      <FileManager
        items={sampleItems}
        showSidebar
        showPreview
        dropZone
        onRename={(item) => alert(`Rename: ${item.name}`)}
        onDelete={(items) => alert(`Delete: ${items.map((i) => i.name).join(", ")}`)}
        onDownload={(items) => alert(`Download: ${items.map((i) => i.name).join(", ")}`)}
        onCopy={(items) => alert(`Copy: ${items.map((i) => i.name).join(", ")}`)}
        onCreateFolder={(parentId) => alert(`New folder in: ${parentId || "root"}`)}
        onUpload={(files) => alert(`Upload: ${files.map((f) => f.name).join(", ")}`)}
        onDetails={(item) => alert(`Details: ${item.name}`)}
        onFileOpen={(item) => alert(`Open: ${item.name}`)}
      />
    </div>
  ),
};

// ── Empty Folder ─────────────────────────────

export const EmptyFolder: Story = {
  render: () => (
    <div className="h-80">
      <FileManager items={[]} emptyMessage="No files yet. Create a folder or upload files to get started." />
    </div>
  ),
};

// ── With Context Menu ────────────────────────

export const WithContextMenu: Story = {
  render: () => (
    <div className="h-120">
      <FileManager
        items={sampleItems}
        onRename={(item) => alert(`Rename: ${item.name}`)}
        onDelete={(items) => alert(`Delete: ${items.map((i) => i.name).join(", ")}`)}
        onDownload={(items) => alert(`Download: ${items.map((i) => i.name).join(", ")}`)}
        onCopy={(items) => alert(`Copy: ${items.map((i) => i.name).join(", ")}`)}
        onDetails={(item) => alert(`Details: ${item.name}\nType: ${item.type}\nSize: ${item.size || "—"}`)}
      />
    </div>
  ),
};

// ── Image Thumbnails ─────────────────────────

export const ImageThumbnails: Story = {
  render: () => {
    const imageItems = sampleItems.filter((i) => i.parentId === "f2" || i.id === "f2");
    return (
      <div className="h-100">
        <FileManager items={imageItems} defaultFolderId="f2" />
      </div>
    );
  },
};

// ── Controlled ───────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [folderId, setFolderId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [view, setView] = useState<"grid" | "list">("grid");

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span>Folder: {folderId || "root"}</span>
          <span>Selected: {selectedIds.length}</span>
          <span>View: {view}</span>
        </div>
        <div className="h-100">
          <FileManager
            items={sampleItems}
            currentFolderId={folderId}
            onNavigate={setFolderId}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            view={view}
            onViewChange={setView}
            showSidebar
          />
        </div>
      </div>
    );
  },
};

// ── Search and Sort ──────────────────────────

export const SearchAndSort: Story = {
  render: () => (
    <div className="h-120">
      <FileManager items={sampleItems} defaultView="list" searchable />
    </div>
  ),
};

// ── Small Size ───────────────────────────────

export const SmallSize: Story = {
  render: () => (
    <div className="h-100">
      <FileManager items={sampleItems} size="sm" showSidebar />
    </div>
  ),
};
