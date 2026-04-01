"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { useEscapeClose } from "../../lib/use-escape-close";
import { useBodyScrollLock } from "../../lib/use-body-scroll-lock";
import { XIcon } from "../../lib/icons";

// ── Types ────────────────────────────────────

export type DrawerSide = "left" | "right" | "top" | "bottom";
export type DrawerSize = "sm" | "md" | "lg" | "full";

export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: DrawerSide;
  size?: DrawerSize;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
}

export interface DrawerTriggerProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface DrawerContentProps {
  className?: string;
  children: React.ReactNode;
}

export interface DrawerHeaderProps {
  hideClose?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface DrawerBodyProps {
  className?: string;
  children: React.ReactNode;
}

export interface DrawerFooterProps {
  className?: string;
  children: React.ReactNode;
}

// ── Context ──────────────────────────────────

interface DrawerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  side: DrawerSide;
  size: DrawerSize;
  closeOnBackdrop: boolean;
  titleId: string;
  descriptionId: string;
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawer(): DrawerContextValue {
  const ctx = React.useContext(DrawerContext);
  if (!ctx) throw new Error("Drawer sub-components must be used within <Drawer>");
  return ctx;
}

// ── Sizes ────────────────────────────────────

const HORIZONTAL_SIZES: Record<DrawerSize, string> = {
  sm: "max-w-xs",
  md: "max-w-md",
  lg: "max-w-lg",
  full: "max-w-full",
};

const VERTICAL_SIZES: Record<DrawerSize, string> = {
  sm: "max-h-48",
  md: "max-h-80",
  lg: "max-h-128",
  full: "max-h-full",
};

// ── Slide animations ─────────────────────────

const SLIDE_IN: Record<DrawerSide, string> = {
  left: "animate-[slide-in-left_200ms_ease-out]",
  right: "animate-[slide-in-right_200ms_ease-out]",
  top: "animate-[slide-in-top_200ms_ease-out]",
  bottom: "animate-[slide-in-bottom_200ms_ease-out]",
};

const PANEL_POSITION: Record<DrawerSide, string> = {
  left: "inset-y-0 left-0",
  right: "inset-y-0 right-0",
  top: "inset-x-0 top-0",
  bottom: "inset-x-0 bottom-0",
};

// ── Drawer (root) ────────────────────────────

function DrawerRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  side = "right",
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
}: DrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const autoId = React.useId();
  const titleId = `drawer-title-${autoId}`;
  const descriptionId = `drawer-desc-${autoId}`;

  const setOpen = React.useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const openDrawer = React.useCallback(() => setOpen(true), [setOpen]);
  const closeDrawer = React.useCallback(() => setOpen(false), [setOpen]);

  useEscapeClose(closeDrawer, isOpen && closeOnEscape);
  useBodyScrollLock(isOpen);

  return (
    <DrawerContext.Provider value={{ isOpen, open: openDrawer, close: closeDrawer, side, size, closeOnBackdrop, titleId, descriptionId }}>
      {children}
    </DrawerContext.Provider>
  );
}
DrawerRoot.displayName = "Drawer";

// ── Trigger ──────────────────────────────────

function DrawerTrigger({ asChild = false, className, children }: DrawerTriggerProps) {
  const { isOpen, open: openDrawer, titleId } = useDrawer();

  const handleClick = React.useCallback((e: React.MouseEvent) => {
    if (asChild && React.isValidElement(children)) {
      const originalOnClick = (children.props as Record<string, unknown>).onClick as ((e: React.MouseEvent) => void) | undefined;
      originalOnClick?.(e);
    }
    openDrawer();
  }, [asChild, children, openDrawer]);

  const triggerProps = {
    "aria-haspopup": "dialog" as const,
    "aria-expanded": isOpen,
    "aria-controls": isOpen ? titleId : undefined,
    onClick: handleClick,
  };

  if (asChild && React.isValidElement(children)) {
    const ChildType = children.type as React.ElementType;
    const childProps = children.props as Record<string, unknown>;
    return (
      <ChildType
        {...childProps}
        {...triggerProps}
        className={cn(childProps.className as string | undefined, className)}
      />
    );
  }

  return (
    <button type="button" {...triggerProps} className={cn("cursor-pointer", className)}>
      {children}
    </button>
  );
}
DrawerTrigger.displayName = "DrawerTrigger";

// ── Content ──────────────────────────────────

function DrawerContent({ className, children }: DrawerContentProps) {
  const { isOpen, close, side, size, closeOnBackdrop, titleId, descriptionId } = useDrawer();

  if (!isOpen) return null;

  const handleBackdropClick = closeOnBackdrop ? close : undefined;
  const isHorizontal = side === "left" || side === "right";
  const sizeClass = isHorizontal ? HORIZONTAL_SIZES[size] : VERTICAL_SIZES[size];

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-9999 flex bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "fixed bg-white flex flex-col",
          PANEL_POSITION[side],
          isHorizontal ? "w-full h-full" : "w-full",
          sizeClass,
          SLIDE_IN[side],
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
DrawerContent.displayName = "DrawerContent";

// ── Header ───────────────────────────────────

function DrawerHeader({ hideClose = false, className, children }: DrawerHeaderProps) {
  const { titleId, close } = useDrawer();

  return (
    <div className={cn("flex items-center justify-between px-6 pt-6 pb-0", className)}>
      <h2 id={titleId} className="text-base font-bold text-zinc-900 leading-snug">
        {children}
      </h2>
      {!hideClose && (
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="size-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
}
DrawerHeader.displayName = "DrawerHeader";

// ── Body ─────────────────────────────────────

function DrawerBody({ className, children }: DrawerBodyProps) {
  const { descriptionId } = useDrawer();

  return (
    <div id={descriptionId} className={cn("px-6 py-4 text-sm text-zinc-600 leading-relaxed", className)}>
      {children}
    </div>
  );
}
DrawerBody.displayName = "DrawerBody";

// ── Footer ───────────────────────────────────

function DrawerFooter({ className, children }: DrawerFooterProps) {
  return (
    <div className={cn("flex flex-wrap gap-3 px-6 pb-6 pt-2", className)}>
      {children}
    </div>
  );
}
DrawerFooter.displayName = "DrawerFooter";

// ── Export ────────────────────────────────────

export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
});
