"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type AlertDialogColor = "default" | "danger" | "warning";

export interface AlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  color?: AlertDialogColor;
  children: React.ReactNode;
}

export interface AlertDialogTriggerProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface AlertDialogContentProps {
  className?: string;
  children: React.ReactNode;
}

export interface AlertDialogHeaderProps {
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export interface AlertDialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export interface AlertDialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

export interface AlertDialogCancelProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface AlertDialogActionProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

// ── Color definitions ────────────────────────

interface AlertDialogColorDef {
  iconBg: string;
  iconColor: string;
}

const COLORS: Record<AlertDialogColor, AlertDialogColorDef> = {
  default: {
    iconBg: "bg-zinc-100",
    iconColor: "text-zinc-600",
  },
  danger: {
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
  warning: {
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
};

// ── Context ──────────────────────────────────

interface AlertDialogContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  color: AlertDialogColor;
  titleId: string;
  descriptionId: string;
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null);

function useAlertDialog(): AlertDialogContextValue {
  const ctx = React.useContext(AlertDialogContext);
  if (!ctx) throw new Error("AlertDialog sub-components must be used within <AlertDialog>");
  return ctx;
}

// ── AlertDialog Root ─────────────────────────

function AlertDialogRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  color = "default",
  children,
}: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const autoId = React.useId();
  const titleId = `alert-dialog-title-${autoId}`;
  const descriptionId = `alert-dialog-desc-${autoId}`;

  const setOpen = React.useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const openDialog = React.useCallback(() => setOpen(true), [setOpen]);
  const closeDialog = React.useCallback(() => setOpen(false), [setOpen]);

  // Escape closes dialog
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDialog();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeDialog]);

  // Body scroll lock
  React.useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  return (
    <AlertDialogContext.Provider value={{ isOpen, open: openDialog, close: closeDialog, color, titleId, descriptionId }}>
      {children}
    </AlertDialogContext.Provider>
  );
}
AlertDialogRoot.displayName = "AlertDialog";

// ── Trigger ──────────────────────────────────

function AlertDialogTrigger({ asChild = false, className, children }: AlertDialogTriggerProps) {
  const { open: openDialog } = useAlertDialog();

  const handleClick = React.useCallback((e: React.MouseEvent) => {
    if (asChild && React.isValidElement(children)) {
      const originalOnClick = (children.props as Record<string, unknown>).onClick as ((e: React.MouseEvent) => void) | undefined;
      originalOnClick?.(e);
    }
    openDialog();
  }, [asChild, children, openDialog]);

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

  return (
    <button type="button" onClick={handleClick} className={cn("cursor-pointer", className)}>
      {children}
    </button>
  );
}
AlertDialogTrigger.displayName = "AlertDialogTrigger";

// ── Content ──────────────────────────────────

function AlertDialogContent({ className, children }: AlertDialogContentProps) {
  const { isOpen, titleId, descriptionId } = useAlertDialog();

  if (!isOpen) return null;

  // No backdrop click close — intentional for alert dialogs
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      aria-hidden="true"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl",
          "w-full max-w-sm mx-4 overflow-hidden",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
AlertDialogContent.displayName = "AlertDialogContent";

// ── Header ───────────────────────────────────

function AlertDialogHeader({ icon, className, children }: AlertDialogHeaderProps) {
  const { titleId, color } = useAlertDialog();
  const c = COLORS[color];

  return (
    <div className={cn("flex flex-col items-center gap-3 px-6 pt-6 pb-0 text-center", className)}>
      {icon && (
        <div className={cn("size-12 rounded-full flex items-center justify-center", c.iconBg)}>
          <span className={cn("flex items-center justify-center [&>svg]:w-full [&>svg]:h-full size-6", c.iconColor)}>
            {icon}
          </span>
        </div>
      )}
      <h2 id={titleId} className="text-base font-bold text-zinc-900 leading-snug">
        {children}
      </h2>
    </div>
  );
}
AlertDialogHeader.displayName = "AlertDialogHeader";

// ── Description ──────────────────────────────

function AlertDialogDescription({ className, children }: AlertDialogDescriptionProps) {
  const { descriptionId } = useAlertDialog();

  return (
    <p id={descriptionId} className={cn("px-6 py-3 text-sm text-zinc-500 text-center leading-relaxed", className)}>
      {children}
    </p>
  );
}
AlertDialogDescription.displayName = "AlertDialogDescription";

// ── Footer ───────────────────────────────────

function AlertDialogFooter({ className, children }: AlertDialogFooterProps) {
  return (
    <div className={cn("flex gap-3 px-6 pb-6 pt-2", className)}>
      {children}
    </div>
  );
}
AlertDialogFooter.displayName = "AlertDialogFooter";

// ── Cancel ───────────────────────────────────

function AlertDialogCancel({ asChild = false, className, children }: AlertDialogCancelProps) {
  const { close } = useAlertDialog();

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
        className={cn(childProps.className as string | undefined, "flex-1", className)}
      />
    );
  }

  return (
    <button type="button" onClick={handleClick} className={cn("flex-1 cursor-pointer", className)}>
      {children}
    </button>
  );
}
AlertDialogCancel.displayName = "AlertDialogCancel";

// ── Action ───────────────────────────────────

function AlertDialogAction({ asChild = false, className, children }: AlertDialogActionProps) {
  const { close } = useAlertDialog();

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
        className={cn(childProps.className as string | undefined, "flex-1", className)}
      />
    );
  }

  return (
    <button type="button" onClick={handleClick} className={cn("flex-1 cursor-pointer", className)}>
      {children}
    </button>
  );
}
AlertDialogAction.displayName = "AlertDialogAction";

// ── Export ────────────────────────────────────

export const AlertDialog = Object.assign(AlertDialogRoot, {
  Trigger: AlertDialogTrigger,
  Content: AlertDialogContent,
  Header: AlertDialogHeader,
  Description: AlertDialogDescription,
  Footer: AlertDialogFooter,
  Cancel: AlertDialogCancel,
  Action: AlertDialogAction,
});
