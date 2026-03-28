import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
}

export interface ModalTriggerProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface ModalContentProps {
  className?: string;
  children: React.ReactNode;
}

export interface ModalHeaderProps {
  icon?: React.ReactNode;
  hideClose?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface ModalBodyProps {
  className?: string;
  children: React.ReactNode;
}

export interface ModalFooterProps {
  className?: string;
  children: React.ReactNode;
}

// ── X Icon ───────────────────────────────────

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

// ── Context ──────────────────────────────────

interface ModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  size: ModalSize;
  closeOnBackdrop: boolean;
  titleId: string;
  descriptionId: string;
}

const ModalContext = React.createContext<ModalContextValue | null>(null);

function useModal(): ModalContextValue {
  const ctx = React.useContext(ModalContext);
  if (!ctx) throw new Error("Modal sub-components must be used within <Modal>");
  return ctx;
}

// ── Sizes ────────────────────────────────────

const SIZES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

// ── Modal (root) ─────────────────────────────

function ModalRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
}: ModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const autoId = React.useId();
  const titleId = `modal-title-${autoId}`;
  const descriptionId = `modal-desc-${autoId}`;

  const setOpen = React.useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const openModal = React.useCallback(() => setOpen(true), [setOpen]);
  const closeModal = React.useCallback(() => setOpen(false), [setOpen]);

  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, closeModal]);

  React.useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  return (
    <ModalContext.Provider value={{ isOpen, open: openModal, close: closeModal, size, closeOnBackdrop, titleId, descriptionId }}>
      {children}
    </ModalContext.Provider>
  );
}
ModalRoot.displayName = "Modal";

// ── Trigger ──────────────────────────────────

function ModalTrigger({ asChild = false, className, children }: ModalTriggerProps) {
  const { isOpen, open: openModal, titleId } = useModal();

  const handleClick = React.useCallback((e: React.MouseEvent) => {
    if (asChild && React.isValidElement(children)) {
      const originalOnClick = (children.props as Record<string, unknown>).onClick as ((e: React.MouseEvent) => void) | undefined;
      originalOnClick?.(e);
    }
    openModal();
  }, [asChild, children, openModal]);

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
ModalTrigger.displayName = "ModalTrigger";

// ── Content ──────────────────────────────────

function ModalContent({ className, children }: ModalContentProps) {
  const { isOpen, close, size, closeOnBackdrop, titleId, descriptionId } = useModal();

  if (!isOpen) return null;

  const handleBackdropClick = closeOnBackdrop ? close : undefined;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
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
          "relative bg-white rounded-2xl shadow-2xl",
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
ModalContent.displayName = "ModalContent";

// ── Header ───────────────────────────────────

function ModalHeader({ icon, hideClose = false, className, children }: ModalHeaderProps) {
  const { titleId, close } = useModal();

  return (
    <div className={cn("flex flex-col gap-3 px-6 pt-6 pb-0", className)}>
      {icon && (
        <div className="shrink-0 size-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
          {icon}
        </div>
      )}
      <div className="flex-1 flex flex-col gap-0.5">
        <h2 id={titleId} className="text-base font-bold text-zinc-900 leading-snug">
          {children}
        </h2>
      </div>
      {!hideClose && (
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute top-4 right-4 size-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
}
ModalHeader.displayName = "ModalHeader";

// ── Body ─────────────────────────────────────

function ModalBody({ className, children }: ModalBodyProps) {
  const { descriptionId } = useModal();

  return (
    <div id={descriptionId} className={cn("px-6 py-4 text-sm text-zinc-600 leading-relaxed", className)}>
      {children}
    </div>
  );
}
ModalBody.displayName = "ModalBody";

// ── Footer ───────────────────────────────────

function ModalFooter({ className, children }: ModalFooterProps) {
  return (
    <div className={cn("flex flex-wrap gap-3 px-6 pb-6 pt-2", className)}>
      {children}
    </div>
  );
}
ModalFooter.displayName = "ModalFooter";

// ── Export ────────────────────────────────────

export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
