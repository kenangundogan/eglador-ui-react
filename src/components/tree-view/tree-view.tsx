"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type TreeViewSize = "sm" | "md" | "lg";

export interface TreeViewNode {
  id: string;
  label: React.ReactNode;
  secondaryLabel?: React.ReactNode;
  icon?: React.ReactNode;
  children?: TreeViewNode[];
  disabled?: boolean;
}

export interface TreeViewProps {
  data: TreeViewNode[];
  defaultExpanded?: string[];
  defaultSelected?: string[];
  expanded?: string[];
  selected?: string[];
  onExpand?: (expanded: string[]) => void;
  onSelect?: (selected: string[]) => void;
  multiSelect?: boolean;
  selectable?: boolean;
  checkbox?: boolean;
  expandAll?: boolean;
  showLines?: boolean;
  size?: TreeViewSize;
  autoSelectParents?: boolean;
  autoSelectDescendants?: boolean;
  className?: string;
}

export interface TreeViewItemProps {
  node: TreeViewNode;
  level: number;
  isLast: boolean;
}

// ── Icons ────────────────────────────────────

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
    </svg>
  );
}

// ── Size definitions ─────────────────────────

const SIZES: Record<TreeViewSize, { py: string; font: string; secondaryFont: string; iconSize: string; indent: number; checkboxSize: string }> = {
  sm: { py: "py-0.5", font: "text-xs", secondaryFont: "text-[10px]", iconSize: "size-3.5", indent: 12, checkboxSize: "size-3.5" },
  md: { py: "py-1", font: "text-sm", secondaryFont: "text-xs", iconSize: "size-4", indent: 16, checkboxSize: "size-4" },
  lg: { py: "py-1.5", font: "text-base", secondaryFont: "text-sm", iconSize: "size-4.5", indent: 20, checkboxSize: "size-4.5" },
};

// ── Context ──────────────────────────────────

interface TreeViewContextValue {
  expanded: Set<string>;
  selected: Set<string>;
  toggleExpand: (id: string) => void;
  toggleSelect: (id: string, node: TreeViewNode) => void;
  selectable: boolean;
  multiSelect: boolean;
  checkbox: boolean;
  showLines: boolean;
  size: TreeViewSize;
  getCheckState: (node: TreeViewNode) => "checked" | "indeterminate" | "unchecked";
}

const TreeViewContext = React.createContext<TreeViewContextValue | null>(null);

function useTreeViewCtx(): TreeViewContextValue {
  const ctx = React.useContext(TreeViewContext);
  if (!ctx) throw new Error("TreeView sub-components must be used within <TreeView>");
  return ctx;
}

// ── Helpers ──────────────────────────────────

function collectAllIds(nodes: TreeViewNode[]): string[] {
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

function collectAllLeafAndBranchIds(node: TreeViewNode): string[] {
  const ids: string[] = [node.id];
  if (node.children) {
    node.children.forEach((child) => {
      ids.push(...collectAllLeafAndBranchIds(child));
    });
  }
  return ids;
}

function findParentChain(data: TreeViewNode[], targetId: string, chain: string[] = []): string[] | null {
  for (const node of data) {
    if (node.id === targetId) return chain;
    if (node.children) {
      const result = findParentChain(node.children, targetId, [...chain, node.id]);
      if (result) return result;
    }
  }
  return null;
}

function areAllChildrenSelected(node: TreeViewNode, selected: Set<string>): boolean {
  if (!node.children || node.children.length === 0) return selected.has(node.id);
  return node.children.every((child) => areAllChildrenSelected(child, selected));
}

function areSomeChildrenSelected(node: TreeViewNode, selected: Set<string>): boolean {
  if (!node.children || node.children.length === 0) return selected.has(node.id);
  return node.children.some((child) => areSomeChildrenSelected(child, selected));
}

// ── TreeViewItem ─────────────────────────────

function TreeViewItem({ node, level, isLast }: TreeViewItemProps) {
  const { expanded, selected, toggleExpand, toggleSelect, selectable, checkbox, showLines, size, getCheckState } = useTreeViewCtx();
  const s = SIZES[size];
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded.has(node.id);
  const isSelected = selected.has(node.id);
  const checkState = checkbox ? getCheckState(node) : "unchecked";

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!node.disabled && hasChildren) toggleExpand(node.id);
  };

  const handleSelectClick = () => {
    if (node.disabled) return;
    if (hasChildren && !selectable && !checkbox) {
      toggleExpand(node.id);
      return;
    }
    if (selectable || checkbox) {
      toggleSelect(node.id, node);
    } else if (hasChildren) {
      toggleExpand(node.id);
    }
  };

  return (
    <div className="relative">
      {/* Connector lines */}
      {showLines && level > 0 && (
        <div
          className="absolute top-0 bottom-0 border-l border-zinc-200"
          style={{ left: `${(level - 1) * s.indent + 6 + s.indent / 2}px` }}
        />
      )}

      <button
        type="button"
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={selectable || checkbox ? isSelected || checkState === "checked" : undefined}
        disabled={node.disabled}
        onClick={handleSelectClick}
        className={cn(
          "flex w-full items-center gap-1.5 px-1.5 rounded-md transition-colors outline-none text-left",
          s.py,
          s.font,
          !node.disabled && "cursor-pointer hover:bg-zinc-100",
          node.disabled && "opacity-40 cursor-not-allowed",
          isSelected && selectable && !checkbox && "bg-zinc-100 text-zinc-900 font-medium",
          !isSelected && "text-zinc-700",
        )}
        style={{ paddingLeft: `${level * s.indent + 6}px` }}
      >
        {/* Expand chevron */}
        <span
          className="shrink-0 size-4 flex items-center justify-center"
          onClick={hasChildren ? handleExpandClick : undefined}
        >
          {hasChildren && (
            <ChevronRightIcon
              className={cn(
                "size-3.5 text-zinc-400 transition-transform duration-150",
                isExpanded && "rotate-90",
              )}
            />
          )}
        </span>

        {/* Checkbox */}
        {checkbox && (
          <span
            className={cn(
              "shrink-0 flex items-center justify-center rounded border transition-colors",
              s.checkboxSize,
              checkState === "checked" ? "bg-zinc-900 border-zinc-900 text-white" :
              checkState === "indeterminate" ? "bg-zinc-900 border-zinc-900 text-white" :
              "border-zinc-300 bg-white",
            )}
          >
            {checkState === "checked" && <CheckIcon className="size-3" />}
            {checkState === "indeterminate" && <MinusIcon className="size-3" />}
          </span>
        )}

        {/* Icon */}
        <span className={cn("shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full text-zinc-400", s.iconSize)}>
          {node.icon || (!hasChildren && <FileIcon />)}
        </span>

        {/* Labels */}
        <span className="flex-1 flex items-baseline gap-2 min-w-0">
          <span className="truncate">{node.label}</span>
          {node.secondaryLabel && (
            <span className={cn("truncate text-zinc-400", s.secondaryFont)}>{node.secondaryLabel}</span>
          )}
        </span>
      </button>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div role="group">
          {node.children!.map((child, i) => (
            <TreeViewItem key={child.id} node={child} level={level + 1} isLast={i === node.children!.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}
TreeViewItem.displayName = "TreeViewItem";

// ── TreeView Root ────────────────────────────

export function TreeView({
  data,
  defaultExpanded = [],
  defaultSelected = [],
  expanded: controlledExpanded,
  selected: controlledSelected,
  onExpand,
  onSelect,
  multiSelect = false,
  selectable = false,
  checkbox = false,
  expandAll = false,
  showLines = false,
  size = "md",
  autoSelectParents = false,
  autoSelectDescendants = false,
  className,
}: TreeViewProps) {
  const allExpandableIds = React.useMemo(() => collectAllIds(data), [data]);

  const [internalExpanded, setInternalExpanded] = React.useState<Set<string>>(
    () => new Set(expandAll ? allExpandableIds : defaultExpanded),
  );
  const [internalSelected, setInternalSelected] = React.useState<Set<string>>(
    () => new Set(defaultSelected),
  );

  const isExpandedControlled = controlledExpanded !== undefined;
  const isSelectedControlled = controlledSelected !== undefined;

  const expanded = isExpandedControlled ? new Set(controlledExpanded) : internalExpanded;
  const selected = isSelectedControlled ? new Set(controlledSelected) : internalSelected;

  const toggleExpand = React.useCallback((id: string) => {
    const update = (prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    };

    if (isExpandedControlled) {
      onExpand?.(Array.from(update(expanded)));
    } else {
      setInternalExpanded((prev) => {
        const next = update(prev);
        onExpand?.(Array.from(next));
        return next;
      });
    }
  }, [expanded, isExpandedControlled, onExpand]);

  const toggleSelect = React.useCallback((id: string, node: TreeViewNode) => {
    const update = (prev: Set<string>) => {
      const isMulti = multiSelect || checkbox;
      const next = new Set(isMulti ? prev : []);
      const wasSelected = prev.has(id);

      if (wasSelected) {
        next.delete(id);
        // Auto-deselect descendants
        if (autoSelectDescendants && node.children) {
          collectAllLeafAndBranchIds(node).forEach((cid) => next.delete(cid));
        }
      } else {
        next.add(id);
        // Auto-select descendants
        if (autoSelectDescendants && node.children) {
          collectAllLeafAndBranchIds(node).forEach((cid) => next.add(cid));
        }
      }

      // Auto-select/deselect parents
      if (autoSelectParents) {
        const parentChain = findParentChain(data, id);
        if (parentChain) {
          // Walk from deepest parent to root
          for (let i = parentChain.length - 1; i >= 0; i--) {
            const parentId = parentChain[i];
            // Find parent node
            const findNode = (nodes: TreeViewNode[], targetId: string): TreeViewNode | null => {
              for (const n of nodes) {
                if (n.id === targetId) return n;
                if (n.children) { const found = findNode(n.children, targetId); if (found) return found; }
              }
              return null;
            };
            const parentNode = findNode(data, parentId);
            if (parentNode && parentNode.children) {
              const allChildrenSelected = parentNode.children.every((c) => next.has(c.id));
              if (allChildrenSelected) next.add(parentId);
              else next.delete(parentId);
            }
          }
        }
      }

      return next;
    };

    if (isSelectedControlled) {
      onSelect?.(Array.from(update(selected)));
    } else {
      setInternalSelected((prev) => {
        const next = update(prev);
        onSelect?.(Array.from(next));
        return next;
      });
    }
  }, [selected, isSelectedControlled, multiSelect, checkbox, autoSelectDescendants, autoSelectParents, data, onSelect]);

  const getCheckState = React.useCallback((node: TreeViewNode): "checked" | "indeterminate" | "unchecked" => {
    if (!node.children || node.children.length === 0) {
      return selected.has(node.id) ? "checked" : "unchecked";
    }
    const allSelected = areAllChildrenSelected(node, selected);
    if (allSelected && selected.has(node.id)) return "checked";
    const someSelected = areSomeChildrenSelected(node, selected);
    if (someSelected) return "indeterminate";
    return "unchecked";
  }, [selected]);

  return (
    <TreeViewContext.Provider value={{ expanded, selected, toggleExpand, toggleSelect, selectable, multiSelect, checkbox, showLines, size, getCheckState }}>
      <div role="tree" className={cn("flex flex-col py-1", className)}>
        {data.map((node, i) => (
          <TreeViewItem key={node.id} node={node} level={0} isLast={i === data.length - 1} />
        ))}
      </div>
    </TreeViewContext.Provider>
  );
}

TreeView.displayName = "TreeView";
