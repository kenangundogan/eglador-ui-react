"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type TableSize = "xs" | "sm" | "md";
export type TableVariant = "default" | "bordered" | "striped";
export type TableShape = "square" | "rounded";

export interface TableProps {
  size?: TableSize;
  variant?: TableVariant;
  shape?: TableShape;
  fullWidth?: boolean;
  scrollX?: boolean;
  scrollY?: boolean;
  maxHeight?: string;
  className?: string;
  children: React.ReactNode;
}

export interface TableHeadProps {
  className?: string;
  children: React.ReactNode;
}

export interface TableBodyProps {
  className?: string;
  children: React.ReactNode;
}

export interface TableRowProps {
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface TableHeaderProps {
  align?: "left" | "center" | "right";
  width?: string;
  className?: string;
  children?: React.ReactNode;
}

export interface TableCellProps {
  align?: "left" | "center" | "right";
  truncate?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// ── Size definitions ─────────────────────────

const SIZES: Record<TableSize, { cell: string; header: string; text: string }> = {
  xs: { cell: "px-3 py-1.5", header: "px-3 py-1.5", text: "text-xs" },
  sm: { cell: "px-4 py-2.5", header: "px-4 py-2.5", text: "text-sm" },
  md: { cell: "px-5 py-3.5", header: "px-5 py-3.5", text: "text-base" },
};

// ── Shape definitions ────────────────────────

const SHAPES: Record<TableShape, string> = {
  square: "",
  rounded: "rounded-lg overflow-hidden",
};

// ── Variant styles ───────────────────────────

const TABLE_VARIANTS: Record<TableVariant, string> = {
  default: "",
  bordered: "border border-zinc-200",
  striped: "",
};

const ROW_VARIANTS: Record<TableVariant, { base: string; active: string }> = {
  default: {
    base: "border-b border-zinc-100 last:border-0",
    active: "bg-zinc-50",
  },
  bordered: {
    base: "border-b border-zinc-100 last:border-0",
    active: "bg-zinc-50",
  },
  striped: {
    base: "border-b border-zinc-100 last:border-0 even:bg-zinc-50/50",
    active: "bg-zinc-100",
  },
};

// ── Context ──────────────────────────────────

interface TableContextValue {
  size: TableSize;
  variant: TableVariant;
}

const TableContext = React.createContext<TableContextValue>({ size: "sm", variant: "default" });

function useTable() {
  return React.useContext(TableContext);
}

// ── Align map ────────────────────────────────

const ALIGN_MAP = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// ── Table Root ───────────────────────────────

function TableRoot({
  size = "sm",
  variant = "default",
  shape = "rounded",
  fullWidth = true,
  scrollX = false,
  scrollY = false,
  maxHeight,
  className,
  children,
}: TableProps) {
  return (
    <TableContext.Provider value={{ size, variant }}>
      <div
        className={cn(
          TABLE_VARIANTS[variant],
          SHAPES[shape],
          scrollX && "overflow-x-auto",
          scrollY && "overflow-y-auto",
          className,
        )}
        style={scrollY && maxHeight ? { maxHeight } : undefined}
      >
        <table className={cn("border-collapse", fullWidth && "w-full")}>
          {children}
        </table>
      </div>
    </TableContext.Provider>
  );
}

// ── Table Head ───────────────────────────────

function TableHead({ className, children }: TableHeadProps) {
  return (
    <thead className={cn("bg-zinc-50 border-b border-zinc-200 sticky top-0 z-10", className)}>
      {children}
    </thead>
  );
}

// ── Table Body ───────────────────────────────

function TableBody({ className, children }: TableBodyProps) {
  return (
    <tbody className={cn("bg-white", className)}>
      {children}
    </tbody>
  );
}

// ── Table Row ────────────────────────────────

function TableRow({ onClick, isActive, className, children }: TableRowProps) {
  const { variant } = useTable();
  const v = ROW_VARIANTS[variant];

  return (
    <tr
      onClick={onClick}
      className={cn(
        v.base,
        isActive && v.active,
        onClick && "cursor-pointer hover:bg-zinc-50 transition-colors",
        className,
      )}
    >
      {children}
    </tr>
  );
}

// ── Table Header Cell ────────────────────────

function TableHeader({ align = "left", width, className, children }: TableHeaderProps) {
  const { size } = useTable();
  const s = SIZES[size];

  return (
    <th
      style={width ? { width } : undefined}
      className={cn(
        "font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap",
        s.header,
        s.text,
        ALIGN_MAP[align],
        className,
      )}
    >
      {children}
    </th>
  );
}

// ── Table Cell ───────────────────────────────

function TableCell({ align = "left", truncate, className, children }: TableCellProps) {
  const { size } = useTable();
  const s = SIZES[size];

  return (
    <td
      className={cn(
        "text-zinc-700",
        s.cell,
        s.text,
        ALIGN_MAP[align],
        truncate && "max-w-0 truncate",
        className,
      )}
    >
      {children}
    </td>
  );
}

// ── Export ────────────────────────────────────

export const Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Header: TableHeader,
  Cell: TableCell,
});
