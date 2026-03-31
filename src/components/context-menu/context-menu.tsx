"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export interface ContextMenuProps {
  className?: string;
  children: React.ReactNode;
}

export interface ContextMenuTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export interface ContextMenuContentProps {
  className?: string;
  children: React.ReactNode;
}

export interface ContextMenuItemProps {
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export interface ContextMenuCheckboxItemProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface ContextMenuRadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export interface ContextMenuRadioItemProps {
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface ContextMenuSeparatorProps {
  className?: string;
}

export interface ContextMenuLabelProps {
  className?: string;
  children: React.ReactNode;
}

export interface ContextMenuSubProps {
  label: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

// ── Icons ────────────────────────────────────

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
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

function DotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="5" />
    </svg>
  );
}

// ── Context ──────────────────────────────────

interface ContextMenuContextValue {
  isOpen: boolean;
  position: { x: number; y: number };
  open: (x: number, y: number) => void;
  close: () => void;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  itemCount: number;
  registerItem: () => number;
}

const ContextMenuContext = React.createContext<ContextMenuContextValue | null>(null);

function useContextMenu(): ContextMenuContextValue {
  const ctx = React.useContext(ContextMenuContext);
  if (!ctx) throw new Error("ContextMenu sub-components must be used within <ContextMenu>");
  return ctx;
}

// Radio group context
interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

// ── ContextMenu Root ─────────────────────────

function ContextMenuRoot({ className, children }: ContextMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const itemCountRef = React.useRef(0);
  const openedRef = React.useRef(false);

  const open = React.useCallback((x: number, y: number) => {
    itemCountRef.current = 0;
    setPosition({ x, y });
    setIsOpen(true);
    setFocusedIndex(-1);
    openedRef.current = true;
    requestAnimationFrame(() => { openedRef.current = false; });
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const registerItem = React.useCallback(() => {
    return itemCountRef.current++;
  }, []);

  // Close on outside click/contextmenu/escape
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = () => {
      if (openedRef.current) return;
      close();
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("contextmenu", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("contextmenu", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, close]);

  return (
    <ContextMenuContext.Provider value={{ isOpen, position, open, close, focusedIndex, setFocusedIndex, itemCount: itemCountRef.current, registerItem }}>
      <div className={className}>
        {children}
      </div>
    </ContextMenuContext.Provider>
  );
}
ContextMenuRoot.displayName = "ContextMenu";

// ── Trigger ──────────────────────────────────

function ContextMenuTrigger({ className, children }: ContextMenuTriggerProps) {
  const { open } = useContextMenu();

  const handleContextMenu = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    open(e.clientX, e.clientY);
  }, [open]);

  return (
    <div onContextMenu={handleContextMenu} className={className}>
      {children}
    </div>
  );
}
ContextMenuTrigger.displayName = "ContextMenuTrigger";

// ── Content ──────────────────────────────────

function ContextMenuContent({ className, children }: ContextMenuContentProps) {
  const { isOpen, position, close, focusedIndex, setFocusedIndex } = useContextMenu();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = React.useState(position);

  // Viewport boundary detection
  React.useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      if (!menuRef.current) return;
      const rect = menuRef.current.getBoundingClientRect();
      const { innerWidth, innerHeight } = window;

      let x = position.x;
      let y = position.y;

      if (x + rect.width > innerWidth) x = innerWidth - rect.width - 8;
      if (y + rect.height > innerHeight) y = innerHeight - rect.height - 8;
      if (x < 8) x = 8;
      if (y < 8) y = 8;

      setAdjustedPos({ x, y });
    });
  }, [isOpen, position]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const items = menuRef.current?.querySelectorAll("[data-context-item]:not([data-disabled])");
      if (!items || items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = focusedIndex < items.length - 1 ? focusedIndex + 1 : 0;
        setFocusedIndex(next);
        (items[next] as HTMLElement).focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = focusedIndex > 0 ? focusedIndex - 1 : items.length - 1;
        setFocusedIndex(prev);
        (items[prev] as HTMLElement).focus();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < items.length) {
          (items[focusedIndex] as HTMLElement).click();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, focusedIndex, setFocusedIndex]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      role="menu"
      onMouseDown={(e) => e.stopPropagation()}
      className={cn(
        "fixed z-9999 min-w-48 bg-white border border-zinc-200 rounded-lg p-1.5",
        className,
      )}
      style={{ left: adjustedPos.x, top: adjustedPos.y }}
    >
      {children}
    </div>,
    document.body,
  );
}
ContextMenuContent.displayName = "ContextMenuContent";

// ── Item base styles ─────────────────────────

const ITEM_BASE = "flex w-full items-center gap-2 px-2.5 py-1.5 text-sm rounded-lg transition-colors text-left outline-none";

// ── Item ─────────────────────────────────────

function ContextMenuItem({ icon, shortcut, danger = false, disabled = false, onClick, className, children }: ContextMenuItemProps) {
  const { close } = useContextMenu();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    close();
  };

  return (
    <button
      type="button"
      role="menuitem"
      data-context-item
      data-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        ITEM_BASE,
        disabled && "opacity-40 cursor-not-allowed",
        !disabled && "cursor-pointer",
        danger
          ? "text-red-600 hover:bg-red-50 focus:bg-red-50"
          : "text-zinc-700 hover:bg-zinc-100 focus:bg-zinc-100",
        className,
      )}
    >
      {icon && (
        <span className="shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full size-4 text-current opacity-60">
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
ContextMenuItem.displayName = "ContextMenuItem";

// ── Checkbox Item ────────────────────────────

function ContextMenuCheckboxItem({ checked = false, onCheckedChange, icon, disabled = false, className, children }: ContextMenuCheckboxItemProps) {
  const handleClick = () => {
    if (disabled) return;
    onCheckedChange?.(!checked);
  };

  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      data-context-item
      data-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        ITEM_BASE,
        disabled && "opacity-40 cursor-not-allowed",
        !disabled && "cursor-pointer text-zinc-700 hover:bg-zinc-100 focus:bg-zinc-100",
        className,
      )}
    >
      <span className="shrink-0 flex items-center justify-center size-4">
        {checked && <CheckIcon className="size-3.5 text-zinc-900" />}
      </span>
      {icon && (
        <span className="shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full size-4 text-current opacity-60">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
    </button>
  );
}
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

// ── Radio Group ──────────────────────────────

function ContextMenuRadioGroup({ value, onValueChange, children }: ContextMenuRadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div role="group">{children}</div>
    </RadioGroupContext.Provider>
  );
}
ContextMenuRadioGroup.displayName = "ContextMenuRadioGroup";

// ── Radio Item ───────────────────────────────

function ContextMenuRadioItem({ value, icon, disabled = false, className, children }: ContextMenuRadioItemProps) {
  const radioCtx = React.useContext(RadioGroupContext);
  const isSelected = radioCtx?.value === value;

  const handleClick = () => {
    if (disabled) return;
    radioCtx?.onValueChange?.(value);
  };

  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={isSelected}
      data-context-item
      data-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        ITEM_BASE,
        disabled && "opacity-40 cursor-not-allowed",
        !disabled && "cursor-pointer text-zinc-700 hover:bg-zinc-100 focus:bg-zinc-100",
        className,
      )}
    >
      <span className="shrink-0 flex items-center justify-center size-4">
        {isSelected && <DotIcon className="size-2.5 text-zinc-900" />}
      </span>
      {icon && (
        <span className="shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full size-4 text-current opacity-60">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
    </button>
  );
}
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

// ── Separator ────────────────────────────────

function ContextMenuSeparator({ className }: ContextMenuSeparatorProps) {
  return <div role="separator" className={cn("my-1 h-px bg-zinc-200", className)} />;
}
ContextMenuSeparator.displayName = "ContextMenuSeparator";

// ── Label ────────────────────────────────────

function ContextMenuLabel({ className, children }: ContextMenuLabelProps) {
  return (
    <div className={cn("px-2.5 py-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider", className)}>
      {children}
    </div>
  );
}
ContextMenuLabel.displayName = "ContextMenuLabel";

// ── Sub Menu ─────────────────────────────────

function ContextMenuSub({ label, icon, className, children }: ContextMenuSubProps) {
  const [open, setOpen] = React.useState(false);
  const [openSide, setOpenSide] = React.useState<"right" | "left">("right");
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const subRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 150);
  };

  // Viewport boundary detection for sub-menu
  React.useEffect(() => {
    if (!open || !subRef.current || !containerRef.current) return;
    requestAnimationFrame(() => {
      if (!subRef.current || !containerRef.current) return;
      const parentRect = containerRef.current.getBoundingClientRect();
      const subRect = subRef.current.getBoundingClientRect();
      const { innerWidth } = window;

      if (parentRect.right + subRect.width > innerWidth && parentRect.left > subRect.width) {
        setOpenSide("left");
      } else {
        setOpenSide("right");
      }
    });
  }, [open]);

  return (
    <div ref={containerRef} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <div
        data-context-item
        className={cn(
          ITEM_BASE,
          "cursor-pointer text-zinc-700 hover:bg-zinc-100 focus:bg-zinc-100",
          className,
        )}
      >
        {icon && (
          <span className="shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full size-4 text-current opacity-60">
            {icon}
          </span>
        )}
        <span className="flex-1">{label}</span>
        <ChevronRightIcon className="size-3.5 text-zinc-400" />
      </div>
      {open && (
        <div
          ref={subRef}
          className={cn(
            "absolute top-0 min-w-40 bg-white border border-zinc-200 rounded-lg p-1.5 z-10",
            openSide === "right" ? "left-full ml-1" : "right-full mr-1",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
ContextMenuSub.displayName = "ContextMenuSub";

// ── Export ────────────────────────────────────

export const ContextMenu = Object.assign(ContextMenuRoot, {
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  Separator: ContextMenuSeparator,
  Label: ContextMenuLabel,
  Sub: ContextMenuSub,
});
