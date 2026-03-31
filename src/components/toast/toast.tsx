"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type ToastType = "default" | "success" | "error" | "warning" | "info" | "loading";
export type ToastPosition = "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";

export interface ToastData {
  id: string;
  type: ToastType;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
  duration?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
  onAutoClose?: () => void;
  promise?: {
    loading: string;
    success: string | ((data: unknown) => string);
    error: string | ((err: unknown) => string);
  };
}

export interface ToasterProps {
  position?: ToastPosition;
  maxVisible?: number;
  gap?: number;
  className?: string;
}

// ── Icons ────────────────────────────────────

function SuccessIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

// ── Type styles ──────────────────────────────

const TYPE_ICONS: Record<ToastType, React.ReactNode | null> = {
  default: null,
  success: <SuccessIcon className="size-5 text-green-500" />,
  error: <ErrorIcon className="size-5 text-red-500" />,
  warning: <WarningIcon className="size-5 text-yellow-500" />,
  info: <InfoIcon className="size-5 text-blue-500" />,
  loading: <SpinnerIcon className="size-5 text-zinc-500" />,
};

// ── Position styles ──────────────────────────

const POSITIONS: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4 items-end",
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

// ── Global State ─────────────────────────────

type ToastListener = (toasts: ToastData[]) => void;

let toasts: ToastData[] = [];
let listeners: ToastListener[] = [];
let idCounter = 0;

function notify() {
  listeners.forEach((l) => l([...toasts]));
}

function addToast(data: Partial<ToastData> & { type: ToastType }): string {
  const id = `toast-${++idCounter}`;
  const item: ToastData = {
    id,
    type: data.type,
    title: data.title,
    description: data.description,
    icon: data.icon,
    action: data.action,
    cancel: data.cancel,
    duration: data.duration ?? (data.type === "loading" ? Infinity : 4000),
    dismissible: data.dismissible ?? true,
    onDismiss: data.onDismiss,
    onAutoClose: data.onAutoClose,
  };
  toasts = [...toasts, item];
  notify();
  return id;
}

function removeToast(id: string) {
  const t = toasts.find((t) => t.id === id);
  t?.onDismiss?.();
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

function updateToast(id: string, data: Partial<ToastData>) {
  toasts = toasts.map((t) => (t.id === id ? { ...t, ...data } : t));
  notify();
}

function dismissAll() {
  toasts.forEach((t) => t.onDismiss?.());
  toasts = [];
  notify();
}

// ── toast() API ──────────────────────────────

function createToast(titleOrOpts: React.ReactNode | Partial<ToastData>, opts?: Partial<ToastData>): string {
  if (typeof titleOrOpts === "object" && titleOrOpts !== null && !React.isValidElement(titleOrOpts)) {
    return addToast({ type: "default", ...(titleOrOpts as Partial<ToastData>) });
  }
  return addToast({ type: "default", title: titleOrOpts as React.ReactNode, ...opts });
}

createToast.success = (titleOrOpts: React.ReactNode | Partial<ToastData>, opts?: Partial<ToastData>): string => {
  if (typeof titleOrOpts === "object" && titleOrOpts !== null && !React.isValidElement(titleOrOpts)) {
    return addToast({ type: "success", ...(titleOrOpts as Partial<ToastData>) });
  }
  return addToast({ type: "success", title: titleOrOpts as React.ReactNode, ...opts });
};

createToast.error = (titleOrOpts: React.ReactNode | Partial<ToastData>, opts?: Partial<ToastData>): string => {
  if (typeof titleOrOpts === "object" && titleOrOpts !== null && !React.isValidElement(titleOrOpts)) {
    return addToast({ type: "error", ...(titleOrOpts as Partial<ToastData>) });
  }
  return addToast({ type: "error", title: titleOrOpts as React.ReactNode, ...opts });
};

createToast.warning = (titleOrOpts: React.ReactNode | Partial<ToastData>, opts?: Partial<ToastData>): string => {
  if (typeof titleOrOpts === "object" && titleOrOpts !== null && !React.isValidElement(titleOrOpts)) {
    return addToast({ type: "warning", ...(titleOrOpts as Partial<ToastData>) });
  }
  return addToast({ type: "warning", title: titleOrOpts as React.ReactNode, ...opts });
};

createToast.info = (titleOrOpts: React.ReactNode | Partial<ToastData>, opts?: Partial<ToastData>): string => {
  if (typeof titleOrOpts === "object" && titleOrOpts !== null && !React.isValidElement(titleOrOpts)) {
    return addToast({ type: "info", ...(titleOrOpts as Partial<ToastData>) });
  }
  return addToast({ type: "info", title: titleOrOpts as React.ReactNode, ...opts });
};

createToast.loading = (titleOrOpts: React.ReactNode | Partial<ToastData>, opts?: Partial<ToastData>): string => {
  if (typeof titleOrOpts === "object" && titleOrOpts !== null && !React.isValidElement(titleOrOpts)) {
    return addToast({ type: "loading", ...(titleOrOpts as Partial<ToastData>) });
  }
  return addToast({ type: "loading", title: titleOrOpts as React.ReactNode, ...opts });
};

createToast.promise = <T,>(
  promise: Promise<T>,
  opts: {
    loading: React.ReactNode;
    success: React.ReactNode | ((data: T) => React.ReactNode);
    error: React.ReactNode | ((err: unknown) => React.ReactNode);
    description?: React.ReactNode;
  },
): string => {
  const id = addToast({ type: "loading", title: opts.loading, description: opts.description });
  promise
    .then((data) => {
      const title = typeof opts.success === "function" ? opts.success(data) : opts.success;
      updateToast(id, { type: "success", title, duration: 4000 });
    })
    .catch((err) => {
      const title = typeof opts.error === "function" ? opts.error(err) : opts.error;
      updateToast(id, { type: "error", title, duration: 4000 });
    });
  return id;
};

createToast.dismiss = removeToast;
createToast.dismissAll = dismissAll;
createToast.update = updateToast;

export const toast = createToast;

// ── Toast Item Component ─────────────────────

function ToastItem({ data, onDismiss }: { data: ToastData; onDismiss: (id: string) => void }) {
  const { id, type, title, description, icon, action, cancel, duration, dismissible } = data;
  const [paused, setPaused] = React.useState(false);
  const remainingRef = React.useRef(duration ?? 4000);
  const startRef = React.useRef(Date.now());

  React.useEffect(() => {
    if (!duration || duration === Infinity || paused) return;

    startRef.current = Date.now();
    const timer = setTimeout(() => {
      data.onAutoClose?.();
      onDismiss(id);
    }, remainingRef.current);

    return () => {
      remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startRef.current));
      clearTimeout(timer);
    };
  }, [id, duration, paused, onDismiss, data]);

  const displayIcon = icon || TYPE_ICONS[type];

  return (
    <div
      role="status"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="flex gap-3 w-80 bg-white border border-zinc-200 rounded-lg p-3 pointer-events-auto"
    >
      {displayIcon && (
        <span className="shrink-0 mt-0.5">{displayIcon}</span>
      )}

      <div className="flex-1 min-w-0">
        {title && (
          <div className="text-sm font-medium text-zinc-900 leading-snug">{title}</div>
        )}
        {description && (
          <div className={cn("text-xs text-zinc-500 leading-relaxed", title && "mt-0.5")}>{description}</div>
        )}
        {(action || cancel) && (
          <div className="flex gap-2 mt-2">
            {action && (
              <button
                type="button"
                onClick={() => { action.onClick(); onDismiss(id); }}
                className="text-xs font-semibold text-zinc-900 hover:text-zinc-700 cursor-pointer transition-colors"
              >
                {action.label}
              </button>
            )}
            {cancel && (
              <button
                type="button"
                onClick={() => { cancel.onClick?.(); onDismiss(id); }}
                className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 cursor-pointer transition-colors"
              >
                {cancel.label}
              </button>
            )}
          </div>
        )}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={() => onDismiss(id)}
          className="shrink-0 flex items-center justify-center size-5 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}

// ── Toaster Component ────────────────────────

export function Toaster({
  position = "bottom-right",
  maxVisible = 5,
  gap = 8,
  className,
}: ToasterProps) {
  const [items, setItems] = React.useState<ToastData[]>([]);

  React.useEffect(() => {
    const listener: ToastListener = (newToasts) => setItems(newToasts);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const visible = items.slice(-maxVisible);
  const hiddenCount = items.length - visible.length;

  if (items.length === 0) return null;

  return ReactDOM.createPortal(
    <div
      className={cn(
        "fixed z-9999 flex flex-col pointer-events-none",
        POSITIONS[position],
        className,
      )}
      style={{ gap }}
    >
      {hiddenCount > 0 && (
        <div className="text-[10px] text-zinc-400 text-center font-medium pointer-events-none">
          +{hiddenCount} more
        </div>
      )}
      {visible.map((item) => (
        <ToastItem key={item.id} data={item} onDismiss={removeToast} />
      ))}
    </div>,
    document.body,
  );
}

Toaster.displayName = "Toaster";
