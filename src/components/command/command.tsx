"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { useEscapeClose } from "../../lib/use-escape-close";
import { useBodyScrollLock } from "../../lib/use-body-scroll-lock";
import { SearchIcon } from "../../lib/icons";

// ── Types ────────────────────────────────────

export interface CommandProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  children: React.ReactNode;
}

export interface CommandInputProps {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export interface CommandListProps {
  className?: string;
  children: React.ReactNode;
}

export interface CommandGroupProps {
  heading?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export interface CommandItemProps {
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
  keywords?: string[];
  value?: string;
  className?: string;
  children: React.ReactNode;
}

export interface CommandSeparatorProps {
  className?: string;
}

export interface CommandEmptyProps {
  className?: string;
  children?: React.ReactNode;
}

// ── Context ──────────────────────────────────

interface CommandContextValue {
  search: string;
  setSearch: (value: string) => void;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  close: () => void;
  registerItem: (id: string, searchText: string, keywords: string[], groupId?: string) => void;
  unregisterItem: (id: string) => void;
  visibleItems: Set<string>;
  allItemIds: string[];
  visibleGroups: Set<string>;
}

const CommandContext = React.createContext<CommandContextValue | null>(null);

function useCommand(): CommandContextValue {
  const ctx = React.useContext(CommandContext);
  if (!ctx) throw new Error("Command sub-components must be used within <Command>");
  return ctx;
}

// ── Command Root ─────────────────────────────

function CommandRoot({
  open: controlledOpen,
  onOpenChange,
  className,
  children,
}: CommandProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const [search, setSearch] = React.useState("");
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const itemsRef = React.useRef<Map<string, { searchText: string; keywords: string[]; groupId?: string }>>(new Map());
  const [visibleItems, setVisibleItems] = React.useState<Set<string>>(new Set());
  const [allItemIds, setAllItemIds] = React.useState<string[]>([]);
  const [visibleGroups, setVisibleGroups] = React.useState<Set<string>>(new Set());

  const setOpen = React.useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) {
      setSearch("");
      setFocusedIndex(0);
    }
  }, [isControlled, onOpenChange]);

  const close = React.useCallback(() => setOpen(false), [setOpen]);

  useEscapeClose(close, isOpen);
  useBodyScrollLock(isOpen);

  const [itemVersion, setItemVersion] = React.useState(0);

  const registerItem = React.useCallback((id: string, searchText: string, keywords: string[], groupId?: string) => {
    itemsRef.current.set(id, { searchText, keywords, groupId });
    setItemVersion((v) => v + 1);
  }, []);

  const unregisterItem = React.useCallback((id: string) => {
    itemsRef.current.delete(id);
    setItemVersion((v) => v + 1);
  }, []);

  // Filter items based on search
  React.useEffect(() => {
    const query = search.toLowerCase().trim();
    const visible = new Set<string>();
    const groups = new Set<string>();
    const ids: string[] = [];

    itemsRef.current.forEach(({ searchText, keywords, groupId }, id) => {
      const matches = !query ||
        searchText.toLowerCase().includes(query) ||
        keywords.some((k) => k.toLowerCase().includes(query));
      if (matches) {
        visible.add(id);
        ids.push(id);
        if (groupId) groups.add(groupId);
      }
    });

    setVisibleItems(visible);
    setVisibleGroups(groups);
    setAllItemIds(ids);
    setFocusedIndex(0);
  }, [search, itemVersion]);

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!isOpen);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <CommandContext.Provider value={{ search, setSearch, focusedIndex, setFocusedIndex, close, registerItem, unregisterItem, visibleItems, allItemIds, visibleGroups }}>
      <div
        className="fixed inset-0 z-9999 flex items-start justify-center pt-[20vh] bg-black/40 backdrop-blur-sm"
        onClick={close}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "w-full max-w-lg bg-white border border-zinc-200 rounded-xl overflow-hidden",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </CommandContext.Provider>,
    document.body,
  );
}
CommandRoot.displayName = "Command";

// ── Input ────────────────────────────────────

function CommandInput({ placeholder = "Type a command or search...", value, onValueChange, className }: CommandInputProps) {
  const { search, setSearch, focusedIndex, setFocusedIndex, allItemIds, close } = useCommand();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const displayValue = value !== undefined ? value : search;

  React.useEffect(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (onValueChange) onValueChange(val);
    else setSearch(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const visibleCount = allItemIds.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex(focusedIndex < visibleCount - 1 ? focusedIndex + 1 : 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(focusedIndex > 0 ? focusedIndex - 1 : visibleCount - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const items = document.querySelectorAll("[data-command-item]");
      const focused = items[focusedIndex] as HTMLElement;
      focused?.click();
    }
  };

  return (
    <div className={cn("flex items-center gap-2 px-4 border-b border-zinc-200", className)}>
      <SearchIcon className="size-4 text-zinc-400 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 py-3 text-sm bg-transparent outline-none placeholder:text-zinc-400 text-zinc-900"
      />
      <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-400 bg-zinc-100 border border-zinc-200 rounded">
        Esc
      </kbd>
    </div>
  );
}
CommandInput.displayName = "Command.Input";

// ── List ─────────────────────────────────────

function CommandList({ className, children }: CommandListProps) {
  return (
    <div className={cn("max-h-72 overflow-y-auto p-1.5", className)}>
      {children}
    </div>
  );
}
CommandList.displayName = "Command.List";

// ── Group ────────────────────────────────────

// Group context to pass groupId to children items
const CommandGroupContext = React.createContext<string | null>(null);

function CommandGroup({ heading, className, children }: CommandGroupProps) {
  const groupId = React.useId();
  const { search, visibleGroups } = useCommand();

  // When no search, show all groups. When searching, only show groups with visible items.
  const isVisible = !search.trim() || visibleGroups.has(groupId);

  return (
    <CommandGroupContext.Provider value={groupId}>
      <div className={cn("py-1", !isVisible && "hidden", className)}>
        {heading && (
          <div className="px-2.5 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
            {heading}
          </div>
        )}
        {children}
      </div>
    </CommandGroupContext.Provider>
  );
}
CommandGroup.displayName = "Command.Group";

// ── Item ─────────────────────────────────────

const EMPTY_KEYWORDS: string[] = [];

function CommandItem({ icon, shortcut, disabled = false, onSelect, keywords = EMPTY_KEYWORDS, value, className, children }: CommandItemProps) {
  const { search, close, visibleItems, allItemIds, focusedIndex, registerItem, unregisterItem } = useCommand();
  const groupId = React.useContext(CommandGroupContext);
  const itemId = React.useId();
  const searchText = value || (typeof children === "string" ? children : "");

  React.useEffect(() => {
    registerItem(itemId, searchText, keywords, groupId || undefined);
    return () => unregisterItem(itemId);
  }, [itemId, searchText, keywords, groupId, registerItem, unregisterItem]);

  // Show all items when no search, or only visible ones when searching
  const isVisible = search.trim() === "" || visibleItems.has(itemId);
  if (!isVisible) return null;

  const itemIndex = allItemIds.indexOf(itemId);
  const isFocused = itemIndex === focusedIndex;

  const handleClick = () => {
    if (disabled) return;
    onSelect?.();
    close();
  };

  return (
    <button
      type="button"
      data-command-item
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-2 px-2.5 py-2 text-sm rounded-lg transition-colors outline-none text-left",
        disabled && "opacity-40 cursor-not-allowed",
        !disabled && "cursor-pointer",
        isFocused ? "bg-zinc-100 text-zinc-900" : "text-zinc-700 hover:bg-zinc-50",
        className,
      )}
    >
      {icon && (
        <span className="shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full size-4 text-zinc-400">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <span className="text-xs text-zinc-400 font-mono ml-auto pl-4">{shortcut}</span>
      )}
    </button>
  );
}
CommandItem.displayName = "Command.Item";

// ── Separator ────────────────────────────────

function CommandSeparator({ className }: CommandSeparatorProps) {
  const { search, visibleGroups } = useCommand();

  // Hide separator when searching and fewer than 2 groups are visible
  if (search.trim() && visibleGroups.size < 2) return null;

  return <div className={cn("my-1 h-px bg-zinc-200 mx-1.5", className)} />;
}
CommandSeparator.displayName = "Command.Separator";

// ── Empty ────────────────────────────────────

function CommandEmpty({ className, children }: CommandEmptyProps) {
  const { search, allItemIds } = useCommand();

  // Don't show empty state when not searching, or when there are visible results
  if (!search.trim() || allItemIds.length > 0) return null;

  return (
    <div className={cn("py-6 text-center text-sm text-zinc-400", className)}>
      {children || "No results found."}
    </div>
  );
}
CommandEmpty.displayName = "Command.Empty";

// ── Export ────────────────────────────────────

export const Command = Object.assign(CommandRoot, {
  Input: CommandInput,
  List: CommandList,
  Group: CommandGroup,
  Item: CommandItem,
  Separator: CommandSeparator,
  Empty: CommandEmpty,
});
