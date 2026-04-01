"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { useClickOutside } from "../../lib/use-click-outside";
import { useEscapeClose } from "../../lib/use-escape-close";
import { ChevronRightIcon, CheckIcon, DotIcon } from "../../lib/icons";

// ── Types ────────────────────────────────────

export interface MenubarProps {
  className?: string;
  children: React.ReactNode;
}

export interface MenubarMenuProps {
  className?: string;
  children: React.ReactNode;
}

export interface MenubarTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export interface MenubarContentProps {
  align?: "start" | "center" | "end";
  className?: string;
  children: React.ReactNode;
}

export interface MenubarItemProps {
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export interface MenubarCheckboxItemProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface MenubarRadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export interface MenubarRadioItemProps {
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface MenubarSeparatorProps {
  className?: string;
}

export interface MenubarLabelProps {
  className?: string;
  children: React.ReactNode;
}

export interface MenubarSubProps {
  label: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

// ── Context ──────────────────────────────────

interface MenubarContextValue {
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  hoverMode: boolean;
  setHoverMode: (mode: boolean) => void;
}

const MenubarContext = React.createContext<MenubarContextValue | null>(null);

function useMenubar(): MenubarContextValue {
  const ctx = React.useContext(MenubarContext);
  if (!ctx) throw new Error("Menubar sub-components must be used within <Menubar>");
  return ctx;
}

interface MenubarMenuContextValue {
  menuId: string;
  isOpen: boolean;
}

const MenubarMenuContext = React.createContext<MenubarMenuContextValue | null>(null);

function useMenubarMenu(): MenubarMenuContextValue {
  const ctx = React.useContext(MenubarMenuContext);
  if (!ctx) throw new Error("Menubar.Trigger/Content must be used within <Menubar.Menu>");
  return ctx;
}

// Radio group context
interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

// ── Menubar Root ─────────────────────────────

function MenubarRoot({ className, children }: MenubarProps) {
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [hoverMode, setHoverMode] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => {
    setActiveMenu(null);
    setHoverMode(false);
  }, []);

  useClickOutside(containerRef, close, !!activeMenu);
  useEscapeClose(close, !!activeMenu);

  return (
    <MenubarContext.Provider value={{ activeMenu, setActiveMenu, hoverMode, setHoverMode }}>
      <div
        ref={containerRef}
        role="menubar"
        className={cn(
          "inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1",
          className,
        )}
      >
        {children}
      </div>
    </MenubarContext.Provider>
  );
}
MenubarRoot.displayName = "Menubar";

// ── Menu ─────────────────────────────────────

function MenubarMenu({ className, children }: MenubarMenuProps) {
  const menuId = React.useId();
  const { activeMenu } = useMenubar();
  const isOpen = activeMenu === menuId;

  return (
    <MenubarMenuContext.Provider value={{ menuId, isOpen }}>
      <div className={cn("relative", className)}>
        {children}
      </div>
    </MenubarMenuContext.Provider>
  );
}
MenubarMenu.displayName = "MenubarMenu";

// ── Trigger ──────────────────────────────────

function MenubarTrigger({ className, children }: MenubarTriggerProps) {
  const { activeMenu, setActiveMenu, hoverMode, setHoverMode } = useMenubar();
  const { menuId, isOpen } = useMenubarMenu();

  const handleClick = () => {
    if (isOpen) {
      setActiveMenu(null);
      setHoverMode(false);
    } else {
      setActiveMenu(menuId);
      setHoverMode(true);
    }
  };

  const handleMouseEnter = () => {
    if (hoverMode && activeMenu && activeMenu !== menuId) {
      setActiveMenu(menuId);
    }
  };

  return (
    <button
      type="button"
      role="menuitem"
      aria-expanded={isOpen}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={cn(
        "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer outline-none",
        isOpen
          ? "bg-zinc-100 text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
        className,
      )}
    >
      {children}
    </button>
  );
}
MenubarTrigger.displayName = "MenubarTrigger";

// ── Content ──────────────────────────────────

function MenubarContent({ align = "start", className, children }: MenubarContentProps) {
  const { isOpen } = useMenubarMenu();
  const { setActiveMenu, setHoverMode } = useMenubar();

  if (!isOpen) return null;

  const alignClass = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }[align];

  return (
    <div
      role="menu"
      className={cn(
        "absolute z-50 top-full mt-1.5 min-w-48 bg-white border border-zinc-200 rounded-lg p-1.5",
        alignClass,
        className,
      )}
    >
      {children}
    </div>
  );
}
MenubarContent.displayName = "MenubarContent";

// ── Item base ────────────────────────────────

const ITEM_BASE = "flex w-full items-center gap-2 px-2.5 py-1.5 text-sm rounded-md transition-colors text-left outline-none";

// ── Item ─────────────────────────────────────

function MenubarItem({ icon, shortcut, danger = false, disabled = false, onClick, className, children }: MenubarItemProps) {
  const { setActiveMenu, setHoverMode } = useMenubar();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    setActiveMenu(null);
    setHoverMode(false);
  };

  return (
    <button
      type="button"
      role="menuitem"
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
MenubarItem.displayName = "MenubarItem";

// ── Checkbox Item ────────────────────────────

function MenubarCheckboxItem({ checked = false, onCheckedChange, icon, disabled = false, className, children }: MenubarCheckboxItemProps) {
  const handleClick = () => {
    if (disabled) return;
    onCheckedChange?.(!checked);
  };

  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
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
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

// ── Radio Group ──────────────────────────────

function MenubarRadioGroup({ value, onValueChange, children }: MenubarRadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div role="group">{children}</div>
    </RadioGroupContext.Provider>
  );
}
MenubarRadioGroup.displayName = "MenubarRadioGroup";

// ── Radio Item ───────────────────────────────

function MenubarRadioItem({ value, icon, disabled = false, className, children }: MenubarRadioItemProps) {
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
MenubarRadioItem.displayName = "MenubarRadioItem";

// ── Separator ────────────────────────────────

function MenubarSeparator({ className }: MenubarSeparatorProps) {
  return <div role="separator" className={cn("my-1 h-px bg-zinc-200", className)} />;
}
MenubarSeparator.displayName = "MenubarSeparator";

// ── Label ────────────────────────────────────

function MenubarLabel({ className, children }: MenubarLabelProps) {
  return (
    <div className={cn("px-2.5 py-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider", className)}>
      {children}
    </div>
  );
}
MenubarLabel.displayName = "MenubarLabel";

// ── Sub Menu ─────────────────────────────────

function MenubarSub({ label, icon, className, children }: MenubarSubProps) {
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
MenubarSub.displayName = "MenubarSub";

// ── Export ────────────────────────────────────

export const Menubar = Object.assign(MenubarRoot, {
  Menu: MenubarMenu,
  Trigger: MenubarTrigger,
  Content: MenubarContent,
  Item: MenubarItem,
  CheckboxItem: MenubarCheckboxItem,
  RadioGroup: MenubarRadioGroup,
  RadioItem: MenubarRadioItem,
  Separator: MenubarSeparator,
  Label: MenubarLabel,
  Sub: MenubarSub,
});
