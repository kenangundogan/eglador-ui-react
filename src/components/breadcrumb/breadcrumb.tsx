import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronRightIcon } from "../../lib/icons";

// ── Types ────────────────────────────────────

export interface BreadcrumbProps {
  children: React.ReactNode;
  className?: string;
  separator?: React.ReactNode;
  "aria-label"?: string;
}

export interface BreadcrumbItemProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  isActive?: boolean;
}

// ── Breadcrumb Root ──────────────────────────

function BreadcrumbRoot({ children, className, separator, "aria-label": ariaLabel }: BreadcrumbProps) {
  const items = React.Children.toArray(children);
  const defaultSeparator = <ChevronRightIcon className="size-3.5 text-zinc-400" />;

  return (
    <nav aria-label={ariaLabel || "Breadcrumb"} className={cn("flex", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
        {items.map((child, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {child}
              {!isLast && (
                <span aria-hidden="true" className="flex items-center justify-center">
                  {separator || defaultSeparator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ── Breadcrumb Item ──────────────────────────

function BreadcrumbItem({ children, href, className, isActive }: BreadcrumbItemProps) {
  const baseClass = "inline-flex items-center gap-1.5 font-medium transition-colors";

  if (href && !isActive) {
    return (
      <a
        href={href}
        className={cn(baseClass, "text-zinc-500 hover:text-zinc-900", className)}
      >
        {children}
      </a>
    );
  }

  return (
    <span
      aria-current={isActive ? "page" : undefined}
      className={cn(baseClass, "text-zinc-900", className)}
    >
      {children}
    </span>
  );
}

// ── Export ────────────────────────────────────

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Item: BreadcrumbItem,
});
