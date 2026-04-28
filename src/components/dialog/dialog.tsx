"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { useEscapeClose } from "../../lib/use-escape-close";
import { useBodyScrollLock } from "../../lib/use-body-scroll-lock";
import { XIcon } from "../../lib/icons";

// ── Types ────────────────────────────────────

export type DialogSize = "sm" | "md" | "lg";

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: DialogSize;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
}

export interface DialogTriggerProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

export interface DialogHeaderProps {
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

export interface DialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export interface DialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

export interface DialogCloseProps {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// ── Context ──────────────────────────────────

interface DialogContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  size: DialogSize;
  closeOnBackdrop: boolean;
  titleId: string;
  descriptionId: string;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialog(): DialogContextValue {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error("Dialog sub-components must be used within <Dialog>");
  return ctx;
}

// ── Sizes ────────────────────────────────────

const SIZES: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

// ── Dialog (root) ────────────────────────────

function DialogRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
}: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const autoId = React.useId();
  const titleId = `dialog-title-${autoId}`;
  const descriptionId = `dialog-desc-${autoId}`;

  const setOpen = React.useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const openDialog = React.useCallback(() => setOpen(true), [setOpen]);
  const closeDialog = React.useCallback(() => setOpen(false), [setOpen]);

  useEscapeClose(closeDialog, isOpen && closeOnEscape);
  useBodyScrollLock(isOpen);

  return (
    <DialogContext.Provider value={{ isOpen, open: openDialog, close: closeDialog, size, closeOnBackdrop, titleId, descriptionId }}>
      {children}
    </DialogContext.Provider>
  );
}
DialogRoot.displayName = "Dialog";

// ── Trigger ──────────────────────────────────

function DialogTrigger({ asChild = false, className, children }: DialogTriggerProps) {
  const { isOpen, open: openDialog, titleId } = useDialog();

  const handleClick = React.useCallback((e: React.MouseEvent) => {
    if (asChild && React.isValidElement(children)) {
      const originalOnClick = (children.props as Record<string, unknown>).onClick as ((e: React.MouseEvent) => void) | undefined;
      originalOnClick?.(e);
    }
    openDialog();
  }, [asChild, children, openDialog]);

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
DialogTrigger.displayName = "DialogTrigger";

// ── Content ──────────────────────────────────

function DialogContent({ className, children }: DialogContentProps) {
  const { isOpen, close, size, closeOnBackdrop, titleId, descriptionId } = useDialog();

  if (!isOpen || typeof document === "undefined") return null;

  const handleBackdropClick = closeOnBackdrop ? close : undefined;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm"
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
          "relative bg-white rounded-2xl",
          "w-full mx-4 overflow-hidden",
          SIZES[size],
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
DialogContent.displayName = "DialogContent";

// ── Header ───────────────────────────────────

function DialogHeader({ icon, className, children }: DialogHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 px-6 pt-6 pb-0", className)}>
      {icon && (
        <div className="shrink-0 size-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        {children}
      </div>
    </div>
  );
}
DialogHeader.displayName = "DialogHeader";

// ── Title ────────────────────────────────────

function DialogTitle({ className, children }: DialogTitleProps) {
  const { titleId } = useDialog();

  return (
    <h2 id={titleId} className={cn("text-base font-bold text-zinc-900 leading-snug", className)}>
      {children}
    </h2>
  );
}
DialogTitle.displayName = "DialogTitle";

// ── Description ──────────────────────────────

function DialogDescription({ className, children }: DialogDescriptionProps) {
  const { descriptionId } = useDialog();

  return (
    <p id={descriptionId} className={cn("text-sm text-zinc-500 leading-relaxed", className)}>
      {children}
    </p>
  );
}
DialogDescription.displayName = "DialogDescription";

// ── Close ────────────────────────────────────

function DialogClose({ asChild = false, className, children }: DialogCloseProps) {
  const { close } = useDialog();

  const handleClick = React.useCallback((e: React.MouseEvent) => {
    if (asChild && React.isValidElement(children)) {
      const originalOnClick = (children.props as Record<string, unknown>).onClick as ((e: React.MouseEvent) => void) | undefined;
      originalOnClick?.(e);
    }
    close();
  }, [asChild, children, close]);

  if (asChild && React.isValidElement(children)) {
    const ChildType = children.type as React.ElementType;
    const childProps = children.props as Record<string, unknown>;
    return (
      <ChildType
        {...childProps}
        onClick={handleClick}
        className={cn(childProps.className as string | undefined, className)}
      />
    );
  }

  if (!children) {
    return (
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className={cn("absolute top-4 right-4 size-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer", className)}
      >
        <XIcon className="size-4" />
      </button>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={cn("cursor-pointer", className)}>
      {children}
    </button>
  );
}
DialogClose.displayName = "DialogClose";

// ── Footer ───────────────────────────────────

function DialogFooter({ className, children }: DialogFooterProps) {
  return (
    <div className={cn("flex flex-wrap gap-3 px-6 pb-6 pt-2", className)}>
      {children}
    </div>
  );
}
DialogFooter.displayName = "DialogFooter";

// ── Body (convenience wrapper) ───────────────

export interface DialogBodyProps {
  className?: string;
  children: React.ReactNode;
}

function DialogBody({ className, children }: DialogBodyProps) {
  return (
    <div className={cn("px-6 py-4", className)}>
      {children}
    </div>
  );
}
DialogBody.displayName = "DialogBody";

// ── Export ────────────────────────────────────

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
  Footer: DialogFooter,
  Body: DialogBody,
});
