"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type PaginationSize = "xs" | "sm" | "md";
export type PaginationVariant = "default" | "outline" | "ghost";

export interface PaginationProps {
  totalPages: number;
  currentPage?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  size?: PaginationSize;
  variant?: PaginationVariant;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  disabled?: boolean;
  className?: string;
}

// ── Icons ────────────────────────────────────

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ChevronsLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11 17-5-5 5-5" />
      <path d="m18 17-5-5 5-5" />
    </svg>
  );
}

function ChevronsRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 17 5-5-5-5" />
      <path d="m13 17 5-5-5-5" />
    </svg>
  );
}

// ── Size definitions ─────────────────────────

const SIZES: Record<PaginationSize, { button: string; icon: string; font: string; gap: string }> = {
  xs: { button: "size-7", icon: "size-3", font: "text-xs", gap: "gap-0.5" },
  sm: { button: "size-8", icon: "size-3.5", font: "text-sm", gap: "gap-1" },
  md: { button: "size-10", icon: "size-4", font: "text-sm", gap: "gap-1.5" },
};

// ── Variant styles ───────────────────────────

const VARIANTS: Record<PaginationVariant, { active: string; inactive: string }> = {
  default: {
    active: "bg-zinc-900 text-white",
    inactive: "text-zinc-700 hover:bg-zinc-100",
  },
  outline: {
    active: "border border-zinc-900 text-zinc-900",
    inactive: "border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50",
  },
  ghost: {
    active: "bg-zinc-100 text-zinc-900 font-semibold",
    inactive: "text-zinc-700 hover:bg-zinc-50",
  },
};

// ── Page range calculator ────────────────────

function getPageRange(totalPages: number, currentPage: number, siblingCount: number, boundaryCount: number): (number | "ellipsis")[] {
  const range: (number | "ellipsis")[] = [];

  const leftBoundary = Math.min(boundaryCount, totalPages);
  const rightBoundary = Math.max(totalPages - boundaryCount + 1, leftBoundary + 1);

  const leftSibling = Math.max(currentPage - siblingCount, leftBoundary + 1);
  const rightSibling = Math.min(currentPage + siblingCount, rightBoundary - 1);

  // Left boundary pages
  for (let i = 1; i <= leftBoundary; i++) {
    range.push(i);
  }

  // Left ellipsis
  if (leftSibling > leftBoundary + 1) {
    range.push("ellipsis");
  }

  // Sibling pages (and current page)
  for (let i = leftSibling; i <= rightSibling; i++) {
    if (!range.includes(i)) {
      range.push(i);
    }
  }

  // Right ellipsis
  if (rightSibling < rightBoundary - 1) {
    range.push("ellipsis");
  }

  // Right boundary pages
  for (let i = rightBoundary; i <= totalPages; i++) {
    if (!range.includes(i)) {
      range.push(i);
    }
  }

  return range;
}

// ── Component ────────────────────────────────

export function Pagination({
  totalPages,
  currentPage: controlledPage,
  defaultPage = 1,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  size = "sm",
  variant = "default",
  showFirstLast = false,
  showPrevNext = true,
  disabled = false,
  className,
}: PaginationProps) {
  const [internalPage, setInternalPage] = React.useState(defaultPage);
  const isControlled = controlledPage !== undefined;
  const page = isControlled ? controlledPage : internalPage;

  const s = SIZES[size];
  const v = VARIANTS[variant];

  const setPage = React.useCallback((newPage: number) => {
    const clamped = Math.max(1, Math.min(newPage, totalPages));
    if (!isControlled) setInternalPage(clamped);
    onPageChange?.(clamped);
  }, [isControlled, totalPages, onPageChange]);

  const pages = React.useMemo(
    () => getPageRange(totalPages, page, siblingCount, boundaryCount),
    [totalPages, page, siblingCount, boundaryCount],
  );

  const buttonBase = cn(
    "inline-flex items-center justify-center rounded-lg transition-colors outline-none",
    s.button,
    s.font,
    disabled && "opacity-40 cursor-not-allowed",
    !disabled && "cursor-pointer",
  );

  return (
    <nav role="navigation" aria-label="Pagination" className={cn("flex items-center", s.gap, className)}>
      {/* First page */}
      {showFirstLast && (
        <button
          type="button"
          disabled={disabled || page === 1}
          onClick={() => setPage(1)}
          aria-label="First page"
          className={cn(buttonBase, v.inactive, (disabled || page === 1) && "opacity-40 cursor-not-allowed")}
        >
          <ChevronsLeftIcon className={s.icon} />
        </button>
      )}

      {/* Previous */}
      {showPrevNext && (
        <button
          type="button"
          disabled={disabled || page === 1}
          onClick={() => setPage(page - 1)}
          aria-label="Previous page"
          className={cn(buttonBase, v.inactive, (disabled || page === 1) && "opacity-40 cursor-not-allowed")}
        >
          <ChevronLeftIcon className={s.icon} />
        </button>
      )}

      {/* Page buttons */}
      {pages.map((item, i) => {
        if (item === "ellipsis") {
          return (
            <span key={`ellipsis-${i}`} className={cn("inline-flex items-center justify-center text-zinc-400", s.button, s.font)}>
              ...
            </span>
          );
        }

        const isActive = item === page;

        return (
          <button
            key={item}
            type="button"
            disabled={disabled}
            onClick={() => setPage(item)}
            aria-current={isActive ? "page" : undefined}
            aria-label={`Page ${item}`}
            className={cn(buttonBase, isActive ? v.active : v.inactive)}
          >
            {item}
          </button>
        );
      })}

      {/* Next */}
      {showPrevNext && (
        <button
          type="button"
          disabled={disabled || page === totalPages}
          onClick={() => setPage(page + 1)}
          aria-label="Next page"
          className={cn(buttonBase, v.inactive, (disabled || page === totalPages) && "opacity-40 cursor-not-allowed")}
        >
          <ChevronRightIcon className={s.icon} />
        </button>
      )}

      {/* Last page */}
      {showFirstLast && (
        <button
          type="button"
          disabled={disabled || page === totalPages}
          onClick={() => setPage(totalPages)}
          aria-label="Last page"
          className={cn(buttonBase, v.inactive, (disabled || page === totalPages) && "opacity-40 cursor-not-allowed")}
        >
          <ChevronsRightIcon className={s.icon} />
        </button>
      )}
    </nav>
  );
}

Pagination.displayName = "Pagination";
