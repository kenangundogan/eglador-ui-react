"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Tooltip } from "../tooltip";

// ── Types ────────────────────────────────────

export type SidebarSide = "left" | "right";
export type SidebarVariant = "default" | "inset";
export type SidebarCollapsible = "icon" | "none";

export interface SidebarProviderProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: React.ReactNode;
}

export interface SidebarProps {
  side?: SidebarSide;
  variant?: SidebarVariant;
  collapsible?: SidebarCollapsible;
  width?: string;
  collapsedWidth?: string;
  className?: string;
  children: React.ReactNode;
}

export interface SidebarHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export interface SidebarContentProps {
  className?: string;
  children: React.ReactNode;
}

export interface SidebarFooterProps {
  className?: string;
  children: React.ReactNode;
}

export interface SidebarGroupProps {
  className?: string;
  children: React.ReactNode;
}

export interface SidebarGroupLabelProps {
  className?: string;
  children: React.ReactNode;
}

export interface SidebarGroupContentProps {
  className?: string;
  children: React.ReactNode;
}

export interface SidebarMenuProps {
  className?: string;
  children: React.ReactNode;
}

export interface SidebarMenuItemProps {
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface SidebarMenuButtonProps {
  active?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  tooltip?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export interface SidebarMenuSubProps {
  open?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface SidebarMenuSubItemProps {
  className?: string;
  children: React.ReactNode;
}

export interface SidebarMenuSubButtonProps {
  active?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export interface SidebarSeparatorProps {
  className?: string;
}

export interface SidebarTriggerProps {
  className?: string;
}

export interface SidebarRailProps {
  className?: string;
}

// ── Icons ────────────────────────────────────

function PanelLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// ── Context ──────────────────────────────────

interface SidebarContextValue {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>");
  return ctx;
}

// ── SidebarProvider ──────────────────────────

function SidebarProviderRoot({
  defaultOpen = true,
  open,
  onOpenChange,
  className,
  children,
}: SidebarProviderProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = React.useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const toggle = React.useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);

  return (
    <SidebarContext.Provider value={{ isOpen, setOpen, toggle }}>
      <div className={cn("flex min-h-screen w-full", className)}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}
SidebarProviderRoot.displayName = "SidebarProvider";

// ── Sidebar ──────────────────────────────────

function SidebarRoot({
  side = "left",
  variant = "default",
  collapsible = "icon",
  width = "16rem",
  collapsedWidth = "3.5rem",
  className,
  children,
}: SidebarProps) {
  const { isOpen } = useSidebar();
  const isCollapsed = !isOpen && collapsible === "icon";

  return (
    <aside
      data-state={isOpen ? "expanded" : "collapsed"}
      data-side={side}
      className={cn(
        "flex flex-col shrink-0 bg-white border-zinc-200 transition-all duration-200 overflow-hidden",
        side === "left" ? "border-r" : "border-l order-last",
        variant === "inset" && "bg-zinc-50",
        collapsible === "none" && "w-64",
        className,
      )}
      style={{
        width: collapsible !== "none" ? (isCollapsed ? collapsedWidth : width) : undefined,
      }}
    >
      {children}
    </aside>
  );
}
SidebarRoot.displayName = "Sidebar";

// ── SidebarHeader ────────────────────────────

function SidebarHeader({ className, children }: SidebarHeaderProps) {
  const { isOpen } = useSidebar();
  return (
    <div className={cn("flex flex-col gap-2 py-3 border-b border-zinc-100", isOpen ? "px-3" : "px-2", className)}>
      {children}
    </div>
  );
}
SidebarHeader.displayName = "SidebarHeader";

// ── SidebarContent ───────────────────────────

function SidebarContent({ className, children }: SidebarContentProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-3 py-2", className)}>
      {children}
    </div>
  );
}
SidebarContent.displayName = "SidebarContent";

// ── SidebarFooter ────────────────────────────

function SidebarFooter({ className, children }: SidebarFooterProps) {
  const { isOpen } = useSidebar();
  return (
    <div className={cn("flex flex-col gap-2 py-3 border-t border-zinc-100 mt-auto", isOpen ? "px-3" : "px-2", className)}>
      {children}
    </div>
  );
}
SidebarFooter.displayName = "SidebarFooter";

// ── SidebarGroup ─────────────────────────────

function SidebarGroup({ className, children }: SidebarGroupProps) {
  return (
    <div className={cn("flex flex-col gap-1 py-2", className)}>
      {children}
    </div>
  );
}
SidebarGroup.displayName = "SidebarGroup";

// ── SidebarGroupLabel ────────────────────────

function SidebarGroupLabel({ className, children }: SidebarGroupLabelProps) {
  const { isOpen } = useSidebar();

  if (!isOpen) return null;

  return (
    <div className={cn("px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider", className)}>
      {children}
    </div>
  );
}
SidebarGroupLabel.displayName = "SidebarGroupLabel";

// ── SidebarGroupContent ──────────────────────

function SidebarGroupContent({ className, children }: SidebarGroupContentProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {children}
    </div>
  );
}
SidebarGroupContent.displayName = "SidebarGroupContent";

// ── SidebarMenu ──────────────────────────────

function SidebarMenu({ className, children }: SidebarMenuProps) {
  return (
    <ul className={cn("flex flex-col gap-0.5 list-none m-0 p-0", className)}>
      {children}
    </ul>
  );
}
SidebarMenu.displayName = "SidebarMenu";

// ── SidebarMenuItem Context ──────────────────

interface SidebarMenuItemContextValue {
  isSubOpen: boolean;
  toggleSub: () => void;
  hasSub: boolean;
}

const SidebarMenuItemContext = React.createContext<SidebarMenuItemContextValue>({
  isSubOpen: false,
  toggleSub: () => {},
  hasSub: false,
});

// ── SidebarMenuItem ──────────────────────────

function SidebarMenuItem({ defaultOpen = false, className, children }: SidebarMenuItemProps) {
  const [isSubOpen, setIsSubOpen] = React.useState(defaultOpen);
  const childArray = React.Children.toArray(children);
  const hasSub = childArray.some(
    (child) => React.isValidElement(child) && (child.type as { displayName?: string }).displayName === "SidebarMenuSub",
  );

  const toggleSub = React.useCallback(() => setIsSubOpen((prev) => !prev), []);

  return (
    <SidebarMenuItemContext.Provider value={{ isSubOpen, toggleSub, hasSub }}>
      <li className={cn("relative", className)}>
        {children}
      </li>
    </SidebarMenuItemContext.Provider>
  );
}
SidebarMenuItem.displayName = "SidebarMenuItem";

// ── SidebarMenuButton ────────────────────────

function SidebarMenuButton({
  active = false,
  icon,
  badge,
  tooltip,
  disabled = false,
  onClick,
  className,
  children,
}: SidebarMenuButtonProps) {
  const { isOpen } = useSidebar();
  const { isSubOpen, toggleSub, hasSub } = React.useContext(SidebarMenuItemContext);
  const isCollapsed = !isOpen;

  const handleClick = () => {
    if (hasSub) {
      toggleSub();
    }
    onClick?.();
  };

  const button = (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg text-sm font-medium transition-colors cursor-pointer outline-none",
        isCollapsed ? "justify-center px-2 py-2" : "px-2.5 py-1.5",
        disabled && "opacity-40 cursor-not-allowed",
        active
          ? "bg-zinc-100 text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
        className,
      )}
    >
      {icon && (
        <span className="shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full size-4">
          {icon}
        </span>
      )}
      {!isCollapsed && children && <span className="flex-1 truncate text-left">{children}</span>}
      {!isCollapsed && badge && <span className="shrink-0">{badge}</span>}
      {!isCollapsed && hasSub && (
        <ChevronDownIcon className={cn("size-3.5 text-zinc-400 transition-transform duration-200 shrink-0", isSubOpen && "rotate-180")} />
      )}
    </button>
  );

  if (isCollapsed && tooltip) {
    return (
      <Tooltip content={tooltip} position="right" delay={0}>
        {button}
      </Tooltip>
    );
  }

  return button;
}
SidebarMenuButton.displayName = "SidebarMenuButton";

// ── SidebarMenuSub ───────────────────────────

function SidebarMenuSub({ open, className, children }: SidebarMenuSubProps) {
  const { isOpen: sidebarOpen } = useSidebar();
  const { isSubOpen } = React.useContext(SidebarMenuItemContext);

  if (!sidebarOpen) return null;

  const isVisible = open !== undefined ? open : isSubOpen;

  if (!isVisible) return null;

  return (
    <ul className={cn("flex flex-col gap-0.5 ml-4 pl-2.5 border-l border-zinc-200 list-none m-0 mt-0.5", className)}>
      {children}
    </ul>
  );
}
SidebarMenuSub.displayName = "SidebarMenuSub";

// ── SidebarMenuSubItem ───────────────────────

function SidebarMenuSubItem({ className, children }: SidebarMenuSubItemProps) {
  return (
    <li className={className}>
      {children}
    </li>
  );
}
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

// ── SidebarMenuSubButton ─────────────────────

function SidebarMenuSubButton({ active = false, onClick, className, children }: SidebarMenuSubButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center px-2.5 py-1.5 text-sm rounded-lg transition-colors cursor-pointer outline-none",
        active
          ? "text-zinc-900 font-medium"
          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50",
        className,
      )}
    >
      {children}
    </button>
  );
}
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

// ── SidebarSeparator ─────────────────────────

function SidebarSeparator({ className }: SidebarSeparatorProps) {
  return <div className={cn("mx-2 my-1 h-px bg-zinc-200", className)} />;
}
SidebarSeparator.displayName = "SidebarSeparator";

// ── SidebarTrigger ───────────────────────────

function SidebarTrigger({ className }: SidebarTriggerProps) {
  const { toggle } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex items-center justify-center size-8 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer",
        className,
      )}
    >
      <PanelLeftIcon className="size-4" />
    </button>
  );
}
SidebarTrigger.displayName = "SidebarTrigger";

// ── SidebarRail ──────────────────────────────

function SidebarRail({ className }: SidebarRailProps) {
  const { toggle } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "absolute inset-y-0 right-0 w-1 hover:w-1.5 bg-transparent hover:bg-zinc-300 transition-all cursor-col-resize",
        className,
      )}
    />
  );
}
SidebarRail.displayName = "SidebarRail";

// ── SidebarInset ─────────────────────────────

export function SidebarInset({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <main className={cn("flex-1 overflow-auto", className)}>
      {children}
    </main>
  );
}
SidebarInset.displayName = "SidebarInset";

// ── Export ────────────────────────────────────

export const SidebarProvider = SidebarProviderRoot;

export const Sidebar = Object.assign(SidebarRoot, {
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  GroupContent: SidebarGroupContent,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  MenuButton: SidebarMenuButton,
  MenuSub: SidebarMenuSub,
  MenuSubItem: SidebarMenuSubItem,
  MenuSubButton: SidebarMenuSubButton,
  Separator: SidebarSeparator,
  Trigger: SidebarTrigger,
  Rail: SidebarRail,
});
