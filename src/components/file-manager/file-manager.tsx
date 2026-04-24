"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import {
  SearchIcon, ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon,
  FolderIcon, FolderOpenIcon, FolderPlusIcon,
  FileIcon, FileTextIcon, FileImageIcon,
  UploadIcon, DownloadIcon, TrashIcon, PencilIcon, CopyIcon,
  GridIcon, ListIcon,
} from "../../lib/icons";
import { Breadcrumb } from "../breadcrumb";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { ContextMenu } from "../context-menu";
import { Empty } from "../empty";
import { Input } from "../input";
import { ScrollArea } from "../scroll-area";

// ── Types ────────────────────────────────────

export type FileManagerView = "grid" | "list";
export type FileManagerSize = "sm" | "md";
export type FileManagerSortField = "name" | "size" | "modifiedAt" | "type";
export type FileManagerSortDirection = "asc" | "desc";

export interface FileManagerItem {
  id: string;
  name: string;
  type: "file" | "folder";
  mimeType?: string;
  size?: number;
  modifiedAt?: string | Date;
  thumbnailUrl?: string;
  icon?: React.ReactNode;
  parentId?: string | null;
  meta?: Record<string, unknown>;
}

export interface FileManagerProps {
  items: FileManagerItem[];
  currentFolderId?: string | null;
  defaultFolderId?: string | null;
  onNavigate?: (folderId: string | null) => void;
  view?: FileManagerView;
  defaultView?: FileManagerView;
  onViewChange?: (view: FileManagerView) => void;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  selectable?: boolean;
  multiSelect?: boolean;
  sortField?: FileManagerSortField;
  sortDirection?: FileManagerSortDirection;
  onSortChange?: (field: FileManagerSortField, direction: FileManagerSortDirection) => void;
  showSidebar?: boolean;
  showPreview?: boolean;
  showToolbar?: boolean;
  showStatusBar?: boolean;
  searchable?: boolean;
  dropZone?: boolean;
  size?: FileManagerSize;
  emptyMessage?: string;
  onRename?: (item: FileManagerItem) => void;
  onDelete?: (items: FileManagerItem[]) => void;
  onDownload?: (items: FileManagerItem[]) => void;
  onCopy?: (items: FileManagerItem[]) => void;
  onMove?: (items: FileManagerItem[]) => void;
  onDetails?: (item: FileManagerItem) => void;
  onCreateFolder?: (parentId: string | null) => void;
  onUpload?: (files: File[], parentId: string | null) => void;
  onFileOpen?: (item: FileManagerItem) => void;
  renderItem?: (item: FileManagerItem, view: FileManagerView) => React.ReactNode;
  renderPreview?: (item: FileManagerItem) => React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

// ── Helpers ──────────────────────────────────

function formatFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null) return "—";
  const n = Number(bytes);
  if (isNaN(n) || n < 0) return "—";
  if (n === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1);
  return `${(n / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(date?: string | Date): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function getFileIcon(item: FileManagerItem, size: string): React.ReactNode {
  if (item.icon) return item.icon;
  if (item.type === "folder") return <FolderIcon className={size} />;
  const mime = item.mimeType || "";
  if (mime.startsWith("image/")) return <FileImageIcon className={size} />;
  if (mime.startsWith("text/") || mime.includes("pdf") || mime.includes("document")) return <FileTextIcon className={size} />;
  return <FileIcon className={size} />;
}

function buildBreadcrumbPath(items: FileManagerItem[], folderId: string | null): FileManagerItem[] {
  const path: FileManagerItem[] = [];
  let current = folderId;
  const map = new Map(items.filter((i) => i.type === "folder").map((i) => [i.id, i]));
  while (current) {
    const folder = map.get(current);
    if (!folder) break;
    path.unshift(folder);
    current = folder.parentId || null;
  }
  return path;
}

function buildFolderTree(items: FileManagerItem[], parentId: string | null = null): FolderTreeNode[] {
  return items
    .filter((i) => i.type === "folder" && (i.parentId || null) === parentId)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((folder) => ({
      ...folder,
      children: buildFolderTree(items, folder.id),
    }));
}

interface FolderTreeNode extends FileManagerItem {
  children: FolderTreeNode[];
}

// ── Context ──────────────────────────────────

interface FileManagerContextValue {
  items: FileManagerItem[];
  currentItems: FileManagerItem[];
  currentFolderId: string | null;
  navigateTo: (folderId: string | null) => void;
  breadcrumbPath: FileManagerItem[];
  folderTree: FolderTreeNode[];
  view: FileManagerView;
  setView: (view: FileManagerView) => void;
  size: FileManagerSize;
  selectedIds: Set<string>;
  selectedItems: FileManagerItem[];
  toggleSelect: (id: string, e?: React.MouseEvent) => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectable: boolean;
  multiSelect: boolean;
  search: string;
  setSearch: (q: string) => void;
  sortField: FileManagerSortField;
  sortDirection: FileManagerSortDirection;
  toggleSort: (field: FileManagerSortField) => void;
  searchable: boolean;
  showSidebar: boolean;
  showPreview: boolean;
  dropZone: boolean;
  isDraggingOver: boolean;
  setIsDraggingOver: (v: boolean) => void;
  onRename?: (item: FileManagerItem) => void;
  onDelete?: (items: FileManagerItem[]) => void;
  onDownload?: (items: FileManagerItem[]) => void;
  onCopy?: (items: FileManagerItem[]) => void;
  onMove?: (items: FileManagerItem[]) => void;
  onDetails?: (item: FileManagerItem) => void;
  onCreateFolder?: (parentId: string | null) => void;
  onUpload?: (files: File[], parentId: string | null) => void;
  onFileOpen?: (item: FileManagerItem) => void;
  emptyMessage: string;
  renderItem?: (item: FileManagerItem, view: FileManagerView) => React.ReactNode;
  renderPreview?: (item: FileManagerItem) => React.ReactNode;
}

const FileManagerContext = React.createContext<FileManagerContextValue | null>(null);

function useFileManager(): FileManagerContextValue {
  const ctx = React.useContext(FileManagerContext);
  if (!ctx) throw new Error("FileManager sub-components must be used within <FileManager>");
  return ctx;
}

// ── Size definitions ─────────────────────────

const SIZES = {
  sm: { gridCols: "grid-cols-[repeat(auto-fill,minmax(110px,1fr))]", gridPad: "p-2.5", gridIcon: "size-8", gridFont: "text-xs", listPad: "px-3 py-1.5", listIcon: "size-4", listFont: "text-xs", toolbarPad: "px-3 py-1.5" },
  md: { gridCols: "grid-cols-[repeat(auto-fill,minmax(130px,1fr))]", gridPad: "p-3", gridIcon: "size-10", gridFont: "text-sm", listPad: "px-4 py-2", listIcon: "size-5", listFont: "text-sm", toolbarPad: "px-4 py-2" },
};

// ── FileManager Root ─────────────────────────

function FileManagerRoot({
  items,
  currentFolderId: controlledFolderId,
  defaultFolderId = null,
  onNavigate,
  view: controlledView,
  defaultView = "grid",
  onViewChange,
  selectedIds: controlledSelectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
  selectable = true,
  multiSelect = true,
  sortField: controlledSortField,
  sortDirection: controlledSortDirection,
  onSortChange,
  showSidebar = false,
  showPreview = false,
  showToolbar = true,
  showStatusBar = true,
  searchable = true,
  dropZone = false,
  size = "md",
  emptyMessage = "This folder is empty",
  onRename,
  onDelete,
  onDownload,
  onCopy,
  onMove,
  onDetails,
  onCreateFolder,
  onUpload,
  onFileOpen,
  renderItem,
  renderPreview,
  className,
  children,
}: FileManagerProps) {
  // Controlled/uncontrolled state
  const [internalFolderId, setInternalFolderId] = React.useState<string | null>(defaultFolderId);
  const [internalView, setInternalView] = React.useState<FileManagerView>(defaultView);
  const [internalSelectedIds, setInternalSelectedIds] = React.useState<Set<string>>(new Set(defaultSelectedIds));
  const [internalSortField, setInternalSortField] = React.useState<FileManagerSortField>("name");
  const [internalSortDirection, setInternalSortDirection] = React.useState<FileManagerSortDirection>("asc");
  const [search, setSearch] = React.useState("");
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);

  const currentFolderId = controlledFolderId !== undefined ? controlledFolderId : internalFolderId;
  const view = controlledView ?? internalView;
  const selectedIds = controlledSelectedIds ? new Set(controlledSelectedIds) : internalSelectedIds;
  const sortField = controlledSortField ?? internalSortField;
  const sortDirection = controlledSortDirection ?? internalSortDirection;

  const navigateTo = React.useCallback((folderId: string | null) => {
    if (controlledFolderId === undefined) setInternalFolderId(folderId);
    onNavigate?.(folderId);
    setSearch("");
    if (!controlledSelectedIds) setInternalSelectedIds(new Set());
    onSelectionChange?.([]);
  }, [controlledFolderId, controlledSelectedIds, onNavigate, onSelectionChange]);

  const setView = React.useCallback((v: FileManagerView) => {
    if (!controlledView) setInternalView(v);
    onViewChange?.(v);
  }, [controlledView, onViewChange]);

  const updateSelection = React.useCallback((next: Set<string>) => {
    if (!controlledSelectedIds) setInternalSelectedIds(next);
    onSelectionChange?.(Array.from(next));
  }, [controlledSelectedIds, onSelectionChange]);

  const lastSelectedIndexRef = React.useRef<number>(-1);

  // Computed
  const folderTree = React.useMemo(() => buildFolderTree(items), [items]);
  const breadcrumbPath = React.useMemo(() => buildBreadcrumbPath(items, currentFolderId), [items, currentFolderId]);

  const currentItems = React.useMemo(() => {
    let result = items.filter((i) => (i.parentId || null) === currentFolderId);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q));
    }

    // Sort: folders first, then by field
    result.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      const mul = sortDirection === "asc" ? 1 : -1;
      switch (sortField) {
        case "name": return a.name.localeCompare(b.name) * mul;
        case "size": return ((a.size || 0) - (b.size || 0)) * mul;
        case "modifiedAt": {
          const da = a.modifiedAt ? new Date(a.modifiedAt).getTime() : 0;
          const db = b.modifiedAt ? new Date(b.modifiedAt).getTime() : 0;
          return (da - db) * mul;
        }
        case "type": return (a.mimeType || "").localeCompare(b.mimeType || "") * mul;
        default: return 0;
      }
    });

    return result;
  }, [items, currentFolderId, search, sortField, sortDirection]);

  const selectedItems = React.useMemo(() =>
    items.filter((i) => selectedIds.has(i.id)),
  [items, selectedIds]);

  const toggleSelect = React.useCallback((id: string, e?: React.MouseEvent) => {
    if (!selectable) return;
    const index = currentItems.findIndex((i) => i.id === id);

    if (multiSelect && e?.shiftKey && lastSelectedIndexRef.current >= 0) {
      const start = Math.min(lastSelectedIndexRef.current, index);
      const end = Math.max(lastSelectedIndexRef.current, index);
      const next = new Set(selectedIds);
      for (let i = start; i <= end; i++) next.add(currentItems[i].id);
      updateSelection(next);
    } else if (multiSelect && (e?.ctrlKey || e?.metaKey)) {
      const next = new Set(selectedIds);
      if (next.has(id)) next.delete(id); else next.add(id);
      updateSelection(next);
    } else {
      updateSelection(new Set([id]));
    }
    lastSelectedIndexRef.current = index;
  }, [selectable, multiSelect, currentItems, selectedIds, updateSelection]);

  const selectAll = React.useCallback(() => {
    updateSelection(new Set(currentItems.map((i) => i.id)));
  }, [currentItems, updateSelection]);

  const clearSelection = React.useCallback(() => {
    updateSelection(new Set());
  }, [updateSelection]);

  const toggleSort = React.useCallback((field: FileManagerSortField) => {
    const nextDir = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    if (!controlledSortField) { setInternalSortField(field); setInternalSortDirection(nextDir); }
    onSortChange?.(field, nextDir);
  }, [sortField, sortDirection, controlledSortField, onSortChange]);

  const ctx: FileManagerContextValue = {
    items, currentItems, currentFolderId, navigateTo, breadcrumbPath, folderTree,
    view, setView, size,
    selectedIds, selectedItems, toggleSelect, selectAll, clearSelection, selectable, multiSelect,
    search, setSearch, sortField, sortDirection, toggleSort,
    searchable, showSidebar, showPreview, dropZone, isDraggingOver, setIsDraggingOver,
    onRename, onDelete, onDownload, onCopy, onMove, onDetails, onCreateFolder, onUpload, onFileOpen,
    emptyMessage, renderItem, renderPreview,
  };

  const hasChildren = React.Children.count(children) > 0;

  return (
    <FileManagerContext.Provider value={ctx}>
      {hasChildren ? children : (
        <div className={cn("flex flex-col h-full border border-zinc-200 rounded-lg overflow-hidden", className)}>
          {showToolbar && <FileManagerToolbar />}
          <div className="flex flex-1 min-h-0">
            {showSidebar && <FileManagerSidebar />}
            <FileManagerContent />
            {showPreview && selectedItems.length === 1 && <FileManagerPreview />}
          </div>
          {showStatusBar && <FileManagerStatusBar />}
          {dropZone && <FileManagerDropZone />}
        </div>
      )}
    </FileManagerContext.Provider>
  );
}
FileManagerRoot.displayName = "FileManager";

// ── Toolbar ──────────────────────────────────

function FileManagerToolbar({ className }: { className?: string }) {
  const { breadcrumbPath, navigateTo, searchable, search, setSearch, view, setView, size, onCreateFolder, onUpload, currentFolderId } = useFileManager();
  const s = SIZES[size];

  return (
    <div className={cn("flex flex-wrap items-center gap-2 border-b border-zinc-200", s.toolbarPad, className)}>
      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <Breadcrumb>
          <Breadcrumb.Item href="#" asChild>
            <button type="button" onClick={() => navigateTo(null)} className="inline-flex items-center gap-1.5 font-medium text-zinc-500 hover:text-zinc-900 transition-colors text-sm">
              Root
            </button>
          </Breadcrumb.Item>
          {breadcrumbPath.map((folder) => (
            <Breadcrumb.Item key={folder.id} href="#" asChild>
              <button type="button" onClick={() => navigateTo(folder.id)} className="inline-flex items-center gap-1.5 font-medium text-zinc-500 hover:text-zinc-900 transition-colors text-sm">
                {folder.name}
              </button>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>

      {/* Search */}
      {searchable && (
        <div className="w-48">
          <Input size="xs" placeholder="Search..." icon={<SearchIcon />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      )}

      {/* View toggle */}
      <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden">
        <button type="button" aria-label="Grid view" onClick={() => setView("grid")} className={cn("p-1.5 transition-colors", view === "grid" ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:text-zinc-600")}>
          <GridIcon className="size-4" />
        </button>
        <button type="button" aria-label="List view" onClick={() => setView("list")} className={cn("p-1.5 transition-colors", view === "list" ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:text-zinc-600")}>
          <ListIcon className="size-4" />
        </button>
      </div>

      {/* Actions */}
      {onCreateFolder && (
        <Button variant="outline" size="xs" icon={<FolderPlusIcon />} aria-label="New folder" onClick={() => onCreateFolder(currentFolderId)}>
          <span className="hidden sm:inline">New Folder</span>
        </Button>
      )}
      {onUpload && (
        <Button variant="outline" size="xs" icon={<UploadIcon />} aria-label="Upload" onClick={() => { const input = document.createElement("input"); input.type = "file"; input.multiple = true; input.onchange = () => { if (input.files) onUpload(Array.from(input.files), currentFolderId); }; input.click(); }}>
          <span className="hidden sm:inline">Upload</span>
        </Button>
      )}
    </div>
  );
}
FileManagerToolbar.displayName = "FileManagerToolbar";

// ── Sidebar ──────────────────────────────────

function FileManagerSidebar({ className, width = "w-52" }: { className?: string; width?: string }) {
  const { folderTree, currentFolderId, navigateTo } = useFileManager();

  const renderNode = (nodes: FolderTreeNode[], depth: number = 0): React.ReactNode => {
    return nodes.map((node) => {
      const isActive = node.id === currentFolderId;
      const hasChildren = node.children.length > 0;
      return (
        <div key={node.id}>
          <button
            type="button"
            onClick={() => navigateTo(node.id)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors cursor-pointer",
              isActive ? "bg-zinc-100 text-zinc-900 font-medium" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
            )}
            style={{ paddingLeft: `${8 + depth * 16}px` }}
          >
            {hasChildren ? <FolderOpenIcon className="size-4 shrink-0 text-zinc-400" /> : <FolderIcon className="size-4 shrink-0 text-zinc-400" />}
            <span className="truncate">{node.name}</span>
          </button>
          {hasChildren && renderNode(node.children, depth + 1)}
        </div>
      );
    });
  };

  return (
    <div className={cn("border-r border-zinc-200 shrink-0", width, className)}>
      <ScrollArea orientation="vertical" scrollbarVisibility="hover" className="h-full">
        <div className="p-2">
          <button
            type="button"
            onClick={() => navigateTo(null)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors cursor-pointer",
              currentFolderId === null ? "bg-zinc-100 text-zinc-900 font-medium" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
            )}
          >
            <FolderIcon className="size-4 shrink-0 text-zinc-400" />
            <span className="truncate">Root</span>
          </button>
          {renderNode(folderTree)}
        </div>
      </ScrollArea>
    </div>
  );
}
FileManagerSidebar.displayName = "FileManagerSidebar";

// ── Grid Item ────────────────────────────────

function FileManagerGridItem({ item }: { item: FileManagerItem }) {
  const { selectedIds, toggleSelect, navigateTo, size, onFileOpen } = useFileManager();
  const s = SIZES[size];
  const isSelected = selectedIds.has(item.id);

  const handleDoubleClick = () => {
    if (item.type === "folder") navigateTo(item.id);
    else onFileOpen?.(item);
  };

  return (
    <div
      onClick={(e) => toggleSelect(item.id, e)}
      onDoubleClick={handleDoubleClick}
      className={cn(
        "group relative flex flex-col items-center gap-2 rounded-lg border cursor-pointer transition-colors select-none",
        s.gridPad,
        isSelected ? "bg-zinc-100 border-zinc-300" : "border-transparent hover:bg-zinc-50",
      )}
    >
      {item.thumbnailUrl ? (
        <div className={cn("rounded-md overflow-hidden bg-zinc-100 flex items-center justify-center", s.gridIcon === "size-8" ? "size-16" : "size-20")}>
          <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={cn("flex items-center justify-center text-zinc-400", s.gridIcon === "size-8" ? "size-16" : "size-20")}>
          {getFileIcon(item, s.gridIcon)}
        </div>
      )}
      <span className={cn("w-full text-center truncate text-zinc-700", s.gridFont)}>{item.name}</span>
      <span className="text-[10px] text-zinc-400">{item.type === "folder" ? "Folder" : formatFileSize(item.size)}</span>
    </div>
  );
}
FileManagerGridItem.displayName = "FileManagerGridItem";

// ── List Item ────────────────────────────────

function FileManagerListItem({ item }: { item: FileManagerItem }) {
  const { selectedIds, toggleSelect, navigateTo, size, multiSelect, selectable, onFileOpen } = useFileManager();
  const s = SIZES[size];
  const isSelected = selectedIds.has(item.id);

  const handleDoubleClick = () => {
    if (item.type === "folder") navigateTo(item.id);
    else onFileOpen?.(item);
  };

  return (
    <div
      onClick={(e) => toggleSelect(item.id, e)}
      onDoubleClick={handleDoubleClick}
      className={cn(
        "flex items-center gap-3 border-b border-zinc-100 last:border-0 cursor-pointer transition-colors select-none",
        s.listPad,
        isSelected ? "bg-zinc-100" : "hover:bg-zinc-50",
      )}
    >
      {selectable && multiSelect && (
        <Checkbox size="xs" checked={isSelected} onChange={() => toggleSelect(item.id)} />
      )}
      <span className="shrink-0 text-zinc-400">{getFileIcon(item, s.listIcon)}</span>
      <span className={cn("flex-1 truncate text-zinc-700 font-medium", s.listFont)}>{item.name}</span>
      <span className={cn("shrink-0 w-20 text-right text-zinc-400", s.listFont)}>{item.type === "folder" ? "—" : formatFileSize(item.size)}</span>
      <span className={cn("shrink-0 w-32 text-right text-zinc-400", s.listFont)}>{formatDate(item.modifiedAt)}</span>
    </div>
  );
}
FileManagerListItem.displayName = "FileManagerListItem";

// ── Content ──────────────────────────────────

function FileManagerContent({ className }: { className?: string }) {
  const ctx = useFileManager();
  const { currentItems, view, size, emptyMessage, selectedIds, selectAll, clearSelection, multiSelect, selectable, sortField, sortDirection, toggleSort, renderItem } = ctx;
  const s = SIZES[size];
  const hasContextMenu = !!(ctx.onRename || ctx.onDelete || ctx.onDownload || ctx.onCopy || ctx.onMove || ctx.onDetails);

  const allSelected = currentItems.length > 0 && currentItems.every((i) => selectedIds.has(i.id));
  const someSelected = !allSelected && currentItems.some((i) => selectedIds.has(i.id));

  const renderItemWithContext = (item: FileManagerItem) => {
    const content = renderItem
      ? renderItem(item, view)
      : view === "grid"
        ? <FileManagerGridItem item={item} />
        : <FileManagerListItem item={item} />;

    if (!hasContextMenu) return <React.Fragment key={item.id}>{content}</React.Fragment>;

    return (
      <ContextMenu key={item.id}>
        <ContextMenu.Trigger>{content}</ContextMenu.Trigger>
        <ContextMenu.Content>
          {ctx.onRename && <ContextMenu.Item icon={<PencilIcon />} onClick={() => ctx.onRename!(item)}>Rename</ContextMenu.Item>}
          {ctx.onDownload && item.type === "file" && <ContextMenu.Item icon={<DownloadIcon />} onClick={() => ctx.onDownload!([item])}>Download</ContextMenu.Item>}
          {ctx.onCopy && <ContextMenu.Item icon={<CopyIcon />} onClick={() => ctx.onCopy!([item])}>Copy</ContextMenu.Item>}
          {(ctx.onRename || ctx.onDownload || ctx.onCopy) && (ctx.onDelete) && <ContextMenu.Separator />}
          {ctx.onDelete && <ContextMenu.Item icon={<TrashIcon />} danger onClick={() => ctx.onDelete!([item])}>Delete</ContextMenu.Item>}
          {ctx.onDetails && <><ContextMenu.Separator /><ContextMenu.Item onClick={() => ctx.onDetails!(item)}>Details</ContextMenu.Item></>}
        </ContextMenu.Content>
      </ContextMenu>
    );
  };

  const SortHeader = ({ field, children }: { field: FileManagerSortField; children: React.ReactNode }) => (
    <button type="button" onClick={() => toggleSort(field)} className="inline-flex items-center gap-1 cursor-pointer hover:text-zinc-700 transition-colors">
      {children}
      {sortField === field ? (
        sortDirection === "asc" ? <ChevronUpIcon className="size-3" /> : <ChevronDownIcon className="size-3" />
      ) : (
        <ChevronsUpDownIcon className="size-3 opacity-30" />
      )}
    </button>
  );

  return (
    <div className={cn("flex-1 min-w-0", className)}>
      <ScrollArea orientation="vertical" scrollbarVisibility="hover" className="h-full">
        {currentItems.length === 0 ? (
          <Empty size="sm" icon={<FolderOpenIcon />} description={emptyMessage} />
        ) : view === "grid" ? (
          <div className={cn("grid gap-1 p-3", s.gridCols)}>
            {currentItems.map(renderItemWithContext)}
          </div>
        ) : (
          <div>
            {/* List header */}
            <div className={cn("flex items-center gap-3 border-b border-zinc-200 bg-zinc-50 text-zinc-500 font-medium uppercase tracking-wider", s.listPad, s.listFont)}>
              {selectable && multiSelect && (
                <Checkbox size="xs" checked={allSelected} indeterminate={someSelected} onChange={() => allSelected ? clearSelection() : selectAll()} />
              )}
              <span className="shrink-0 w-5" />
              <span className="flex-1"><SortHeader field="name">Name</SortHeader></span>
              <span className="shrink-0 w-20 text-right"><SortHeader field="size">Size</SortHeader></span>
              <span className="shrink-0 w-32 text-right"><SortHeader field="modifiedAt">Modified</SortHeader></span>
            </div>
            {currentItems.map(renderItemWithContext)}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
FileManagerContent.displayName = "FileManagerContent";

// ── Preview ──────────────────────────────────

function FileManagerPreview({ className }: { className?: string }) {
  const { selectedItems, renderPreview } = useFileManager();
  const item = selectedItems[0];
  if (!item) return null;

  if (renderPreview) return <div className={cn("w-64 border-l border-zinc-200 p-4 shrink-0", className)}>{renderPreview(item)}</div>;

  return (
    <div className={cn("w-64 border-l border-zinc-200 p-4 shrink-0 flex flex-col items-center gap-3", className)}>
      {item.thumbnailUrl ? (
        <div className="w-full aspect-square rounded-lg overflow-hidden bg-zinc-100">
          <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full aspect-square rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-300">
          {getFileIcon(item, "size-16")}
        </div>
      )}
      <div className="w-full flex flex-col gap-1.5">
        <p className="text-sm font-medium text-zinc-900 truncate">{item.name}</p>
        <div className="flex flex-col gap-1 text-xs text-zinc-400">
          <div className="flex justify-between"><span>Type</span><span className="text-zinc-600">{item.type === "folder" ? "Folder" : (item.mimeType || "File")}</span></div>
          {item.size !== undefined && <div className="flex justify-between"><span>Size</span><span className="text-zinc-600">{formatFileSize(item.size)}</span></div>}
          {item.modifiedAt && <div className="flex justify-between"><span>Modified</span><span className="text-zinc-600">{formatDate(item.modifiedAt)}</span></div>}
        </div>
      </div>
    </div>
  );
}
FileManagerPreview.displayName = "FileManagerPreview";

// ── Status Bar ───────────────────────────────

function FileManagerStatusBar({ className }: { className?: string }) {
  const { currentItems, selectedIds } = useFileManager();

  return (
    <div className={cn("flex items-center justify-between px-3 py-1.5 border-t border-zinc-200 text-xs text-zinc-400", className)}>
      <span>{selectedIds.size > 0 ? `${selectedIds.size} selected` : ""}</span>
      <span>{currentItems.length} item{currentItems.length !== 1 ? "s" : ""}</span>
    </div>
  );
}
FileManagerStatusBar.displayName = "FileManagerStatusBar";

// ── Drop Zone ────────────────────────────────

function FileManagerDropZone() {
  const { isDraggingOver, setIsDraggingOver, onUpload, currentFolderId } = useFileManager();

  const handleDragOver = React.useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDraggingOver(true); }, [setIsDraggingOver]);
  const handleDragLeave = React.useCallback(() => setIsDraggingOver(false), [setIsDraggingOver]);
  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files.length > 0 && onUpload) {
      onUpload(Array.from(e.dataTransfer.files), currentFolderId);
    }
  }, [setIsDraggingOver, onUpload, currentFolderId]);

  if (!isDraggingOver) return <div className="absolute inset-0 pointer-events-auto" onDragOver={handleDragOver} style={{ zIndex: -1 }} />;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-50/80 border-2 border-dashed border-zinc-300 rounded-lg"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-2 text-zinc-400">
        <UploadIcon className="size-8" />
        <span className="text-sm font-medium">Drop files here to upload</span>
      </div>
    </div>
  );
}
FileManagerDropZone.displayName = "FileManagerDropZone";

// ── Export ────────────────────────────────────

export const FileManager = Object.assign(FileManagerRoot, {
  Toolbar: FileManagerToolbar,
  Sidebar: FileManagerSidebar,
  Content: FileManagerContent,
  Preview: FileManagerPreview,
  StatusBar: FileManagerStatusBar,
  GridItem: FileManagerGridItem,
  ListItem: FileManagerListItem,
  DropZone: FileManagerDropZone,
});
