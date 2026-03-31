"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "rounded" | "square";
export type AvatarColor = "default" | "primary" | "danger" | "success" | "warning" | "info";
export type AvatarStatus = "online" | "offline" | "away" | "busy";

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  color?: AvatarColor;
  status?: AvatarStatus;
  icon?: React.ReactNode;
  className?: string;
}

export interface AvatarGroupProps {
  max?: number;
  size?: AvatarSize;
  className?: string;
  children: React.ReactNode;
}

// ── Size definitions ─────────────────────────

const SIZES: Record<AvatarSize, { container: string; font: string; iconSize: string; statusSize: string; statusOffset: string }> = {
  xs: { container: "size-6", font: "text-[10px]", iconSize: "size-3", statusSize: "size-2", statusOffset: "-right-px -bottom-px" },
  sm: { container: "size-8", font: "text-xs", iconSize: "size-3.5", statusSize: "size-2.5", statusOffset: "-right-0.5 -bottom-0.5" },
  md: { container: "size-10", font: "text-sm", iconSize: "size-4", statusSize: "size-3", statusOffset: "-right-0.5 -bottom-0.5" },
  lg: { container: "size-12", font: "text-base", iconSize: "size-5", statusSize: "size-3.5", statusOffset: "-right-0.5 -bottom-0.5" },
  xl: { container: "size-16", font: "text-lg", iconSize: "size-6", statusSize: "size-4", statusOffset: "-right-0.5 -bottom-0.5" },
};

// ── Shape definitions ────────────────────────

const SHAPES: Record<AvatarShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-lg",
  square: "",
};

// ── Color definitions ────────────────────────

const FALLBACK_COLORS: Record<AvatarColor, string> = {
  default: "bg-zinc-200 text-zinc-600",
  primary: "bg-blue-100 text-blue-700",
  danger: "bg-red-100 text-red-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  info: "bg-indigo-100 text-indigo-700",
};

// ── Status definitions ───────────────────────

const STATUS_COLORS: Record<AvatarStatus, string> = {
  online: "bg-green-500",
  offline: "bg-zinc-400",
  away: "bg-yellow-500",
  busy: "bg-red-500",
};

// ── Initials helper ──────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// ── UserIcon ─────────────────────────────────

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}

// ── Avatar ───────────────────────────────────

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  shape = "circle",
  color = "default",
  status,
  icon,
  className,
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);
  const s = SIZES[size];

  const showImage = src && !hasError;
  const initials = name ? getInitials(name) : null;

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden font-semibold",
          s.container,
          SHAPES[shape],
          !showImage && FALLBACK_COLORS[color],
        )}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : icon ? (
          <span className={cn("flex items-center justify-center [&>svg]:w-full [&>svg]:h-full", s.iconSize)}>
            {icon}
          </span>
        ) : initials ? (
          <span className={s.font}>{initials}</span>
        ) : (
          <UserIcon className={s.iconSize} />
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute block rounded-full border-2 border-white",
            s.statusSize,
            s.statusOffset,
            STATUS_COLORS[status],
          )}
        />
      )}
    </div>
  );
}

Avatar.displayName = "Avatar";

// ── AvatarGroup ──────────────────────────────

export function AvatarGroup({
  max,
  size = "md",
  className,
  children,
}: AvatarGroupProps) {
  const items = React.Children.toArray(children).filter(React.isValidElement);
  const visible = max ? items.slice(0, max) : items;
  const overflow = max ? items.length - max : 0;
  const s = SIZES[size];

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visible.map((child, index) => (
        <div key={index} className="ring-2 ring-white rounded-full">
          {React.cloneElement(child as React.ReactElement<AvatarProps>, { size })}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full ring-2 ring-white bg-zinc-200 text-zinc-600 font-semibold",
            s.container,
            s.font,
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

AvatarGroup.displayName = "AvatarGroup";
