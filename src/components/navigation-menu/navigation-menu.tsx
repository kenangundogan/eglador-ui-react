"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronDownIcon } from "../../lib/icons";

// ── Types ────────────────────────────────────

export type NavigationMenuOrientation = "horizontal" | "vertical";

export interface NavigationMenuProps {
  orientation?: NavigationMenuOrientation;
  className?: string;
  children: React.ReactNode;
}

export interface NavigationMenuListProps {
  className?: string;
  children: React.ReactNode;
}

export interface NavigationMenuItemProps {
  className?: string;
  children: React.ReactNode;
}

export interface NavigationMenuTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export interface NavigationMenuContentProps {
  className?: string;
  children: React.ReactNode;
}

export interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface NavigationMenuViewportProps {
  className?: string;
}

export interface NavigationMenuIndicatorProps {
  className?: string;
}

// ── Context ──────────────────────────────────

interface NavigationMenuContextValue {
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
  scheduleClose: () => void;
  cancelClose: () => void;
  orientation: NavigationMenuOrientation;
}

const NavigationMenuContext = React.createContext<NavigationMenuContextValue | null>(null);

function useNavigationMenu(): NavigationMenuContextValue {
  const ctx = React.useContext(NavigationMenuContext);
  if (!ctx) throw new Error("NavigationMenu sub-components must be used within <NavigationMenu>");
  return ctx;
}

// Item context
interface NavigationMenuItemContextValue {
  itemId: string;
  isOpen: boolean;
}

const NavigationMenuItemContext = React.createContext<NavigationMenuItemContextValue | null>(null);

function useNavigationMenuItem(): NavigationMenuItemContextValue {
  const ctx = React.useContext(NavigationMenuItemContext);
  if (!ctx) throw new Error("NavigationMenu.Trigger/Content must be used within <NavigationMenu.Item>");
  return ctx;
}

// ── NavigationMenu Root ──────────────────────

function NavigationMenuRoot({
  orientation = "horizontal",
  className,
  children,
}: NavigationMenuProps) {
  const [activeItem, setActiveItem] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLElement>(null);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = React.useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const handleSetActiveItem = React.useCallback((id: string | null) => {
    cancelClose();
    setActiveItem(id);
  }, [cancelClose]);

  const scheduleClose = React.useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setActiveItem(null);
    }, 200);
  }, [cancelClose]);

  // Close on click outside
  React.useEffect(() => {
    if (!activeItem) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        cancelClose();
        setActiveItem(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelClose();
        setActiveItem(null);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeItem, cancelClose]);

  return (
    <NavigationMenuContext.Provider value={{ activeItem, setActiveItem: handleSetActiveItem, scheduleClose, cancelClose, orientation }}>
      <nav
        ref={containerRef}
        className={cn(
          "relative",
          className,
        )}
      >
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
}
NavigationMenuRoot.displayName = "NavigationMenu";

// ── List ─────────────────────────────────────

function NavigationMenuList({ className, children }: NavigationMenuListProps) {
  const { orientation } = useNavigationMenu();

  return (
    <ul
      className={cn(
        "flex list-none m-0 p-0",
        orientation === "horizontal" ? "flex-row items-center gap-1" : "flex-col gap-1",
        className,
      )}
    >
      {children}
    </ul>
  );
}
NavigationMenuList.displayName = "NavigationMenu.List";

// ── Item ─────────────────────────────────────

function NavigationMenuItem({ className, children }: NavigationMenuItemProps) {
  const itemId = React.useId();
  const { activeItem, setActiveItem, scheduleClose, cancelClose } = useNavigationMenu();
  const isOpen = activeItem === itemId;

  const handleMouseEnter = () => {
    cancelClose();
    setActiveItem(itemId);
  };

  const handleMouseLeave = () => {
    scheduleClose();
  };

  return (
    <NavigationMenuItemContext.Provider value={{ itemId, isOpen }}>
      <li
        className={cn("relative", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
}
NavigationMenuItem.displayName = "NavigationMenu.Item";

// ── Trigger ──────────────────────────────────

function NavigationMenuTrigger({ className, children }: NavigationMenuTriggerProps) {
  const { setActiveItem } = useNavigationMenu();
  const { itemId, isOpen } = useNavigationMenuItem();

  const handleClick = () => {
    setActiveItem(isOpen ? null : itemId);
  };

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={handleClick}
      className={cn(
        "group inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer outline-none",
        isOpen
          ? "bg-zinc-100 text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
        className,
      )}
    >
      {children}
      <ChevronDownIcon
        className={cn(
          "size-3.5 transition-transform duration-200",
          isOpen && "rotate-180",
        )}
      />
    </button>
  );
}
NavigationMenuTrigger.displayName = "NavigationMenu.Trigger";

// ── Content ──────────────────────────────────

function NavigationMenuContent({ className, children }: NavigationMenuContentProps) {
  const { orientation } = useNavigationMenu();
  const { isOpen } = useNavigationMenuItem();

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute z-50 bg-white border border-zinc-200 rounded-lg p-4",
        orientation === "horizontal" ? "top-full left-0 mt-1.5" : "left-full top-0 ml-1.5",
        className,
      )}
    >
      {children}
    </div>
  );
}
NavigationMenuContent.displayName = "NavigationMenu.Content";

// ── Link ─────────────────────────────────────

function NavigationMenuLink({ active = false, className, children, ...rest }: NavigationMenuLinkProps) {
  return (
    <a
      aria-current={active ? "page" : undefined}
      className={cn(
        "block px-3 py-2 text-sm font-medium rounded-lg transition-colors outline-none",
        active
          ? "bg-zinc-100 text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
NavigationMenuLink.displayName = "NavigationMenu.Link";

// ── Viewport (optional wrapper for content) ──

function NavigationMenuViewport({ className }: NavigationMenuViewportProps) {
  const { activeItem } = useNavigationMenu();

  if (!activeItem) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 mt-1.5 w-full",
        className,
      )}
    />
  );
}
NavigationMenuViewport.displayName = "NavigationMenu.Viewport";

// ── Indicator ────────────────────────────────

function NavigationMenuIndicator({ className }: NavigationMenuIndicatorProps) {
  const { activeItem } = useNavigationMenu();

  if (!activeItem) return null;

  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 h-0.5 bg-zinc-900 transition-all duration-200",
        className,
      )}
    />
  );
}
NavigationMenuIndicator.displayName = "NavigationMenu.Indicator";

// ── ListItem ──────────────────────────────────

export interface NavigationMenuListItemProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
}

function NavigationMenuListItem({ title, description, icon, href = "#", className }: NavigationMenuListItemProps) {
  return (
    <a href={href} className={cn("flex gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors group", className)}>
      {icon && (
        <div className="shrink-0 size-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-200 transition-colors">
          <span className="[&>svg]:w-full [&>svg]:h-full size-4">{icon}</span>
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-zinc-900">{title}</span>
        {description && <span className="text-xs text-zinc-400 leading-relaxed mt-0.5">{description}</span>}
      </div>
    </a>
  );
}
NavigationMenuListItem.displayName = "NavigationMenu.ListItem";

// ── Export ────────────────────────────────────

export const NavigationMenu = Object.assign(NavigationMenuRoot, {
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Content: NavigationMenuContent,
  Link: NavigationMenuLink,
  Viewport: NavigationMenuViewport,
  Indicator: NavigationMenuIndicator,
  ListItem: NavigationMenuListItem,
});
