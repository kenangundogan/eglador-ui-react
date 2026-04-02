import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronRightIcon, EllipsisIcon } from "../../lib/icons";

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
  asChild?: boolean;
}

export interface BreadcrumbSeparatorProps {
  children?: React.ReactNode;
  className?: string;
}

export interface BreadcrumbEllipsisProps {
  className?: string;
  children?: React.ReactNode;
}

// ── Breadcrumb Root ──────────────────────────

function BreadcrumbRoot({ children, className, separator, "aria-label": ariaLabel }: BreadcrumbProps) {
  const items = React.Children.toArray(children);
  const defaultSeparator = <ChevronRightIcon className="size-3.5 text-zinc-400" />;

  // Check if children contain manual Separator components
  const hasManualSeparators = items.some(
    (child) => React.isValidElement(child) && (child.type === BreadcrumbSeparator),
  );

  if (hasManualSeparators) {
    return (
      <nav aria-label={ariaLabel || "Breadcrumb"} className={cn("flex", className)}>
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
          {items.map((child, index) => {
            if (React.isValidElement(child) && child.type === BreadcrumbSeparator) {
              return <li key={index} aria-hidden="true" className="flex items-center justify-center">{child}</li>;
            }
            return <li key={index} className="flex items-center">{child}</li>;
          })}
        </ol>
      </nav>
    );
  }

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
BreadcrumbRoot.displayName = "Breadcrumb";

// ── Breadcrumb Item ──────────────────────────

function BreadcrumbItem({ children, href, className, isActive, asChild }: BreadcrumbItemProps) {
  const baseClass = "inline-flex items-center gap-1.5 font-medium transition-colors";

  if (asChild && React.isValidElement(children)) {
    const ChildType = children.type as React.ElementType;
    const childProps = children.props as Record<string, unknown>;
    return (
      <ChildType
        {...childProps}
        className={cn(
          baseClass,
          isActive ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900",
          childProps.className as string | undefined,
          className,
        )}
      />
    );
  }

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
BreadcrumbItem.displayName = "BreadcrumbItem";

// ── Breadcrumb Separator ─────────────────────

function BreadcrumbSeparator({ children, className }: BreadcrumbSeparatorProps) {
  return (
    <span aria-hidden="true" className={cn("flex items-center justify-center text-zinc-400", className)}>
      {children || <ChevronRightIcon className="size-3.5" />}
    </span>
  );
}
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

// ── Breadcrumb Ellipsis ──────────────────────

function BreadcrumbEllipsis({ className, children }: BreadcrumbEllipsisProps) {
  if (children) {
    return <>{children}</>;
  }

  return (
    <button type="button" aria-label="More pages" className={cn("flex items-center justify-center size-6 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer", className)}>
      <EllipsisIcon className="size-4" />
    </button>
  );
}
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

// ── Export ────────────────────────────────────

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Item: BreadcrumbItem,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis,
});
