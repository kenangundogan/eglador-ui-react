"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { XIcon } from "../../lib/icons";

// ── Types ────────────────────────────────────

export type NotificationColor = "default" | "primary" | "danger" | "success" | "warning" | "info";
export type NotificationPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
export type NotificationShape = "square" | "rounded";

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "primary";
}

export interface NotificationItem {
  id: string;
  title?: React.ReactNode;
  message?: React.ReactNode;
  icon?: React.ReactNode;
  color?: NotificationColor;
  /** Auto-dismiss duration in ms (0 = persistent, default: 5000) */
  duration?: number;
  /** Show close button (default: true) */
  dismissible?: boolean;
  /** Show progress bar for auto-dismiss countdown */
  showProgress?: boolean;
  /** Action buttons */
  actions?: NotificationAction[];
  /** Pause auto-dismiss on hover (default: true) */
  pauseOnHover?: boolean;
  /** Callback when notification is dismissed */
  onDismiss?: () => void;
  /** Timestamp for "time ago" display */
  timestamp?: Date;
  /** Shape of the notification container */
  shape?: NotificationShape;
}

export interface NotificationProps {
  item: NotificationItem;
  onDismiss: (id: string) => void;
}

export interface NotificationContainerProps {
  position?: NotificationPosition;
  /** Max visible notifications (older ones hidden, default: 5) */
  maxVisible?: number;
  className?: string;
  children: React.ReactNode;
}

// ── Color definitions ────────────────────────

interface NotificationColorDef {
  border: string;
  icon: string;
  dismissHover: string;
  progressBar: string;
  actionPrimary: string;
}

const COLORS: Record<NotificationColor, NotificationColorDef> = {
  default: {
    border: "border-l-zinc-400",
    icon: "text-zinc-500",
    dismissHover: "hover:bg-zinc-100 hover:text-zinc-900",
    progressBar: "bg-zinc-400",
    actionPrimary: "text-zinc-700 hover:text-zinc-900",
  },
  primary: {
    border: "border-l-blue-500",
    icon: "text-blue-500",
    dismissHover: "hover:bg-blue-50 hover:text-blue-900",
    progressBar: "bg-blue-500",
    actionPrimary: "text-blue-600 hover:text-blue-800",
  },
  danger: {
    border: "border-l-red-500",
    icon: "text-red-500",
    dismissHover: "hover:bg-red-50 hover:text-red-900",
    progressBar: "bg-red-500",
    actionPrimary: "text-red-600 hover:text-red-800",
  },
  success: {
    border: "border-l-green-500",
    icon: "text-green-500",
    dismissHover: "hover:bg-green-50 hover:text-green-900",
    progressBar: "bg-green-500",
    actionPrimary: "text-green-600 hover:text-green-800",
  },
  warning: {
    border: "border-l-yellow-500",
    icon: "text-yellow-500",
    dismissHover: "hover:bg-yellow-50 hover:text-yellow-900",
    progressBar: "bg-yellow-500",
    actionPrimary: "text-yellow-600 hover:text-yellow-800",
  },
  info: {
    border: "border-l-indigo-500",
    icon: "text-indigo-500",
    dismissHover: "hover:bg-indigo-50 hover:text-indigo-900",
    progressBar: "bg-indigo-500",
    actionPrimary: "text-indigo-600 hover:text-indigo-800",
  },
};

// ── Shape definitions ───────────────────────

const SHAPES: Record<NotificationShape, string> = {
  square: "",
  rounded: "rounded-lg",
};

// ── Position definitions ─────────────────────

const POSITIONS: Record<NotificationPosition, string> = {
  "top-right": "top-4 right-4 items-end",
  "top-left": "top-4 left-4 items-start",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

// ── Time ago helper ──────────────────────────

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ── Notification Item ────────────────────────

export function Notification({ item, onDismiss }: NotificationProps) {
  const {
    id,
    title,
    message,
    icon,
    color = "default",
    duration = 5000,
    dismissible = true,
    showProgress = false,
    actions,
    pauseOnHover = true,
    onDismiss: onItemDismiss,
    timestamp,
    shape = "rounded",
  } = item;

  const c = COLORS[color];
  const [paused, setPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(100);
  const [timeLabel, setTimeLabel] = React.useState(timestamp ? timeAgo(timestamp) : "");
  const startTimeRef = React.useRef(Date.now());
  const remainingRef = React.useRef(duration);

  // Auto-dismiss with pause support
  React.useEffect(() => {
    if (duration <= 0) return;

    if (paused) return;

    const start = Date.now();
    const remaining = remainingRef.current;

    const timer = setTimeout(() => {
      onItemDismiss?.();
      onDismiss(id);
    }, remaining);

    const progressInterval = showProgress
      ? setInterval(() => {
        const elapsed = Date.now() - start;
        const newProgress = Math.max(0, ((remaining - elapsed) / duration) * 100);
        setProgress(newProgress);
      }, 50)
      : undefined;

    return () => {
      clearTimeout(timer);
      if (progressInterval) clearInterval(progressInterval);
      remainingRef.current = Math.max(0, remaining - (Date.now() - start));
    };
  }, [id, duration, paused, onDismiss, onItemDismiss, showProgress]);

  // Update time ago label
  React.useEffect(() => {
    if (!timestamp) return;
    const interval = setInterval(() => setTimeLabel(timeAgo(timestamp)), 10000);
    return () => clearInterval(interval);
  }, [timestamp]);

  const handleMouseEnter = () => {
    if (pauseOnHover && duration > 0) setPaused(true);
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && duration > 0) setPaused(false);
  };

  const handleDismiss = () => {
    onItemDismiss?.();
    onDismiss(id);
  };

  return (
    <div
      role="status"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex flex-col w-80 bg-white border border-zinc-200 border-l-4 overflow-hidden",
        SHAPES[shape],
        c.border,
      )}
    >
      <div className="flex gap-3 p-4">
        {icon && (
          <span className={cn("shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full size-5 mt-0.5", c.icon)}>
            {icon}
          </span>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {title && (
                <div className="text-sm font-semibold text-zinc-900 leading-snug">
                  {title}
                </div>
              )}
              {message && (
                <div className={cn("text-xs text-zinc-500 leading-relaxed", title && "mt-1")}>
                  {message}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {timestamp && (
                <span className="text-[10px] text-zinc-400">{timeLabel}</span>
              )}
              {dismissible && (
                <button
                  type="button"
                  aria-label="Dismiss"
                  onClick={handleDismiss}
                  className={cn(
                    "flex items-center justify-center size-5 rounded text-zinc-400 transition-colors cursor-pointer",
                    c.dismissHover,
                  )}
                >
                  <XIcon className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {actions && actions.length > 0 && (
            <div className="flex gap-3 mt-2.5">
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  className={cn(
                    "text-xs font-semibold transition-colors cursor-pointer",
                    action.variant === "primary" ? c.actionPrimary : "text-zinc-500 hover:text-zinc-700",
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {showProgress && duration > 0 && (
        <div className="h-0.5 w-full bg-zinc-100">
          <div
            className={cn("h-full transition-all duration-100 ease-linear", c.progressBar)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

Notification.displayName = "Notification";

// ── Notification Container ───────────────────

export function NotificationContainer({
  position = "top-right",
  maxVisible = 5,
  className,
  children,
}: NotificationContainerProps) {
  const childArray = React.Children.toArray(children);
  const visibleChildren = childArray.slice(-maxVisible);
  const hiddenCount = childArray.length - visibleChildren.length;

  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      className={cn(
        "fixed z-9999 flex flex-col gap-3 pointer-events-none",
        POSITIONS[position],
        className,
      )}
    >
      <div className="flex flex-col gap-3 pointer-events-auto">
        {hiddenCount > 0 && (
          <div className="text-[10px] text-zinc-400 text-center font-medium">
            +{hiddenCount} more
          </div>
        )}
        {visibleChildren}
      </div>
    </div>,
    document.body,
  );
}

NotificationContainer.displayName = "NotificationContainer";

// ── useNotification Hook ─────────────────────

let notificationCounter = 0;

export function useNotification() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);

  const push = React.useCallback((item: Omit<NotificationItem, "id"> & { id?: string }) => {
    const id = item.id || `notification-${++notificationCounter}`;
    setNotifications((prev) => [...prev, { ...item, id }]);
    return id;
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  const update = React.useCallback((id: string, updates: Partial<Omit<NotificationItem, "id">>) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, ...updates } : n));
  }, []);

  return { notifications, push, dismiss, dismissAll, update };
}
