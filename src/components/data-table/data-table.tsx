"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Pagination } from "../pagination";

// ── Types ────────────────────────────────────

export type DataTableSize = "xs" | "sm" | "md";
export type SortDirection = "asc" | "desc" | null;

export type ColumnFilterType = "text" | "select" | "number" | "date";

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => unknown;
  cell?: (value: unknown, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  /** Column filter type: text (input), select (dropdown), number (min/max), date (date range) */
  filterType?: ColumnFilterType;
  /** Custom options for select filter (auto-detected from data if not provided) */
  filterOptions?: string[];
  hideable?: boolean;
  hidden?: boolean;
  width?: string;
  minWidth?: string;
  align?: "left" | "center" | "right";
  /** Fix column to left or right side (sticky) */
  fixed?: "left" | "right";
}

export interface DataTablePaginationMapping {
  currentPage?: string;
  lastPage?: string;
  perPage?: string;
  total?: string;
  from?: string;
  to?: string;
}

export interface DataTableProps<T> {
  /** Static data (local mode) */
  data?: T[];
  /** API endpoint URL (remote mode) */
  endpoint?: string;
  /** Path to data array in API response (e.g. "data", "data.items") */
  responseMapping?: { data: string };
  /** Pagination field mapping from API response */
  paginationMapping?: DataTablePaginationMapping;
  /** Additional columns appended to API columns (e.g. actions) */
  addColumns?: DataTableColumn<T>[];
  /** Column definitions */
  columns?: DataTableColumn<T>[];
  /** Only show these columns from data (whitelist). If set, only these fields are shown. */
  includeColumns?: string[];
  /** Hide these columns from data (blacklist). Applied after includeColumns. */
  excludeColumns?: string[];
  /** Extra query params sent with every request */
  queryParams?: Record<string, string | number>;
  /** Custom fetch headers */
  headers?: Record<string, string>;
  /** Callback after successful fetch */
  onDataLoad?: (data: T[], meta: Record<string, unknown>) => void;
  /** Callback on fetch error */
  onError?: (error: Error) => void;

  size?: DataTableSize;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchParamName?: string;
  sortParamName?: string;
  sortDirectionParamName?: string;
  pageParamName?: string;
  perPageParamName?: string;
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;
  rowKey?: keyof T | ((row: T) => string);
  onRowClick?: (row: T, index: number) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  pageSizes?: number[];
  showColumnToggle?: boolean;
  showColumnFilters?: boolean;
  showFooter?: boolean;
  footerContent?: (columns: DataTableColumn<T>[], data: T[]) => React.ReactNode;
  striped?: boolean;
  bordered?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string;
  className?: string;
}

// ── Icons ────────────────────────────────────

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronsUpDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
}

function ColumnsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
    </svg>
  );
}

// ── Size definitions ─────────────────────────

const SIZES: Record<DataTableSize, { cell: string; header: string; font: string; searchHeight: string }> = {
  xs: { cell: "px-3 py-1.5", header: "px-3 py-1.5", font: "text-xs", searchHeight: "h-8" },
  sm: { cell: "px-4 py-2.5", header: "px-4 py-2.5", font: "text-sm", searchHeight: "h-9" },
  md: { cell: "px-5 py-3.5", header: "px-5 py-3.5", font: "text-base", searchHeight: "h-10" },
};

const ALIGN_MAP = { left: "text-left", center: "text-center", right: "text-right" };

// ── Helpers ──────────────────────────────────

function getRowKeyValue<T>(row: T, rowKey: DataTableProps<T>["rowKey"], index: number): string {
  if (!rowKey) return String(index);
  if (typeof rowKey === "function") return rowKey(row);
  return String(row[rowKey]);
}

function getCellValue<T>(row: T, column: DataTableColumn<T>): unknown {
  if (column.accessorFn) return column.accessorFn(row);
  if (column.accessorKey) return row[column.accessorKey];
  return undefined;
}

function compareValues(a: unknown, b: unknown, direction: SortDirection): number {
  if (direction === null) return 0;
  const valA = a ?? "";
  const valB = b ?? "";
  const multiplier = direction === "asc" ? 1 : -1;
  if (typeof valA === "number" && typeof valB === "number") return (valA - valB) * multiplier;
  return String(valA).localeCompare(String(valB)) * multiplier;
}

function getNestedValue(obj: unknown, path: string): unknown {
  if (!path) return obj;
  return path.split(".").reduce((acc: unknown, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

// ── Component ────────────────────────────────

export function DataTable<T = Record<string, unknown>>({
  data: staticData,
  endpoint,
  responseMapping,
  paginationMapping,
  addColumns = [],
  columns: propColumns = [],
  includeColumns,
  excludeColumns,
  queryParams = {},
  headers: fetchHeaders = {},
  onDataLoad,
  onError,
  size = "sm",
  searchable = false,
  searchPlaceholder = "Search...",
  searchParamName = "search",
  sortParamName = "sort",
  sortDirectionParamName = "direction",
  pageParamName = "page",
  perPageParamName = "per_page",
  selectable = false,
  selectedRows: controlledSelected,
  onSelectionChange,
  rowKey,
  onRowClick,
  onPageChange,
  loading: externalLoading = false,
  emptyMessage = "No data available.",
  pageSize: initialPageSize = 10,
  pageSizes = [10, 25, 50, 100],
  showColumnToggle = false,
  showColumnFilters = false,
  showFooter = false,
  footerContent,
  striped = false,
  bordered = false,
  stickyHeader = false,
  maxHeight,
  className,
}: DataTableProps<T>) {
  const isRemote = !!endpoint;
  const s = SIZES[size];

  // State
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [hiddenColumns, setHiddenColumns] = React.useState<Set<string>>(() => {
    const hidden = new Set<string>();
    [...propColumns, ...addColumns].forEach((col) => { if (col.hidden) hidden.add(col.id); });
    return hidden;
  });
  const [columnMenuOpen, setColumnMenuOpen] = React.useState(false);
  const columnMenuRef = React.useRef<HTMLDivElement>(null);

  // Column filters state: { columnId: filterValue }
  const [columnFilters, setColumnFilters] = React.useState<Record<string, string>>({});
  const [columnFilterRanges, setColumnFilterRanges] = React.useState<Record<string, { min?: string; max?: string }>>({});

  const setColumnFilter = React.useCallback((colId: string, value: string) => {
    setColumnFilters((prev) => {
      if (!value) { const next = { ...prev }; delete next[colId]; return next; }
      return { ...prev, [colId]: value };
    });
    setCurrentPage(1);
  }, []);

  const setColumnFilterRange = React.useCallback((colId: string, min?: string, max?: string) => {
    setColumnFilterRanges((prev) => {
      if (!min && !max) { const next = { ...prev }; delete next[colId]; return next; }
      return { ...prev, [colId]: { min, max } };
    });
    setCurrentPage(1);
  }, []);

  // Remote state
  const [remoteData, setRemoteData] = React.useState<T[]>([]);
  const [remoteMeta, setRemoteMeta] = React.useState<Record<string, unknown>>({});
  const [remoteLoading, setRemoteLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<Error | null>(null);

  // Selection
  const [internalSelected, setInternalSelected] = React.useState<Set<string>>(new Set());
  const isSelectionControlled = controlledSelected !== undefined;
  const data = isRemote ? remoteData : (staticData || []);
  const loading = externalLoading || remoteLoading;

  // Debounce search for remote
  React.useEffect(() => {
    if (!isRemote) { setDebouncedSearch(search); return; }
    const timer = setTimeout(() => { setDebouncedSearch(search); setCurrentPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [search, isRemote]);

  // Stabilize object/function refs to prevent infinite fetch loops
  const queryParamsRef = React.useRef(queryParams);
  queryParamsRef.current = queryParams;
  const fetchHeadersRef = React.useRef(fetchHeaders);
  fetchHeadersRef.current = fetchHeaders;
  const responseMappingRef = React.useRef(responseMapping);
  responseMappingRef.current = responseMapping;
  const onDataLoadRef = React.useRef(onDataLoad);
  onDataLoadRef.current = onDataLoad;
  const onErrorRef = React.useRef(onError);
  onErrorRef.current = onError;

  // Remote fetch
  React.useEffect(() => {
    if (!isRemote || !endpoint) return;

    const controller = new AbortController();

    const fetchData = async () => {
      setRemoteLoading(true);
      setFetchError(null);

      try {
        const params = new URLSearchParams();

        // Pagination
        params.set(pageParamName, String(currentPage));
        params.set(perPageParamName, String(pageSize));

        // Search
        if (debouncedSearch) params.set(searchParamName, debouncedSearch);

        // Sort
        if (sortColumn && sortDirection) {
          params.set(sortParamName, sortColumn);
          params.set(sortDirectionParamName, sortDirection);
        }

        // Extra query params
        Object.entries(queryParamsRef.current).forEach(([key, val]) => {
          params.set(key, String(val));
        });

        const separator = endpoint.includes("?") ? "&" : "?";
        const url = `${endpoint}${separator}${params.toString()}`;

        const response = await fetch(url, {
          signal: controller.signal,
          headers: { "Accept": "application/json", ...fetchHeadersRef.current },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const json = await response.json();

        // Extract data using responseMapping
        const dataPath = responseMappingRef.current ? responseMappingRef.current.data : "data";
        const extractedData = getNestedValue(json, dataPath) as T[] || [];

        setRemoteData(extractedData);
        setRemoteMeta(json);
        onDataLoadRef.current?.(extractedData, json as Record<string, unknown>);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          const error = err instanceof Error ? err : new Error(String(err));
          setFetchError(error);
          onErrorRef.current?.(error);
        }
      } finally {
        setRemoteLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [endpoint, currentPage, pageSize, debouncedSearch, sortColumn, sortDirection, pageParamName, perPageParamName, searchParamName, sortParamName, sortDirectionParamName, isRemote]);

  // Remote pagination meta
  const remotePagination = React.useMemo(() => {
    if (!isRemote || !paginationMapping) return null;
    return {
      currentPage: Number(getNestedValue(remoteMeta, paginationMapping.currentPage || "meta.current_page")) || 1,
      lastPage: Number(getNestedValue(remoteMeta, paginationMapping.lastPage || "meta.last_page")) || 1,
      perPage: Number(getNestedValue(remoteMeta, paginationMapping.perPage || "meta.per_page")) || pageSize,
      total: Number(getNestedValue(remoteMeta, paginationMapping.total || "meta.total")) || 0,
      from: Number(getNestedValue(remoteMeta, paginationMapping.from || "meta.from")) || 0,
      to: Number(getNestedValue(remoteMeta, paginationMapping.to || "meta.to")) || 0,
    };
  }, [remoteMeta, paginationMapping, isRemote, pageSize]);

  // Close column menu
  React.useEffect(() => {
    if (!columnMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(e.target as Node)) setColumnMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [columnMenuOpen]);

  // Auto-generate columns from data if none provided
  const autoColumns = React.useMemo<DataTableColumn<T>[]>(() => {
    if (propColumns.length > 0) return propColumns;
    if (data.length === 0) return [];

    const firstRow = data[0];
    if (!firstRow || typeof firstRow !== "object") return [];

    let keys = Object.keys(firstRow as Record<string, unknown>);

    // Apply includeColumns whitelist
    if (includeColumns) {
      keys = includeColumns.filter((k) => keys.includes(k));
    }

    // Apply excludeColumns blacklist
    if (excludeColumns) {
      keys = keys.filter((k) => !excludeColumns.includes(k));
    }

    return keys.map((key) => ({
      id: key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1").replace(/_/g, " "),
      accessorKey: key as keyof T,
    }));
  }, [propColumns, data, includeColumns, excludeColumns]);

  // When columns are provided, apply include/exclude filters
  const filteredPropColumns = React.useMemo<DataTableColumn<T>[]>(() => {
    if (propColumns.length === 0) return autoColumns;

    let cols = propColumns;

    if (includeColumns) {
      cols = cols.filter((col) => includeColumns.includes(col.id));
    }

    if (excludeColumns) {
      cols = cols.filter((col) => !excludeColumns.includes(col.id));
    }

    return cols;
  }, [propColumns, autoColumns, includeColumns, excludeColumns]);

  // All columns (filtered prop/auto + add)
  const allColumns = React.useMemo(() => [...filteredPropColumns, ...addColumns], [filteredPropColumns, addColumns]);
  const visibleColumns = React.useMemo(() => allColumns.filter((col) => !hiddenColumns.has(col.id)), [allColumns, hiddenColumns]);

  // Server-side pagination mode: only when both remote AND paginationMapping provided
  const hasServerPagination = isRemote && !!paginationMapping;

  // Fixed (sticky) column offset calculation
  const hasFixedColumns = visibleColumns.some((col) => col.fixed);
  const fixedColumnStyles = React.useMemo(() => {
    if (!hasFixedColumns) return {};

    const styles: Record<string, React.CSSProperties> = {};

    // Calculate left offsets
    let leftOffset = selectable ? 40 : 0; // checkbox column width
    visibleColumns.forEach((col) => {
      if (col.fixed === "left") {
        styles[col.id] = { position: "sticky", left: leftOffset, zIndex: 1 };
        const w = col.width ? parseInt(col.width, 10) : col.minWidth ? parseInt(col.minWidth, 10) : 150;
        leftOffset += w;
      }
    });

    // Calculate right offsets (iterate from right)
    let rightOffset = 0;
    [...visibleColumns].reverse().forEach((col) => {
      if (col.fixed === "right") {
        styles[col.id] = { position: "sticky", right: rightOffset, zIndex: 1 };
        const w = col.width ? parseInt(col.width, 10) : col.minWidth ? parseInt(col.minWidth, 10) : 150;
        rightOffset += w;
      }
    });

    // Checkbox column if selectable and first fixed-left exists
    if (selectable) {
      styles["__checkbox"] = { position: "sticky", left: 0, zIndex: 1 };
    }

    return styles;
  }, [hasFixedColumns, visibleColumns, selectable]);

  const getFixedCellClass = (col: DataTableColumn<T>, bg?: string) => {
    if (!col.fixed) return "";
    return cn("sticky z-[1]", bg || "bg-white");
  };

  const getFixedCellStyle = (col: DataTableColumn<T>): React.CSSProperties | undefined => {
    return fixedColumnStyles[col.id];
  };

  const checkboxFixedStyle = fixedColumnStyles["__checkbox"];
  const getCheckboxFixedClass = (bg?: string) => {
    if (!selectable || !hasFixedColumns) return "";
    return cn("sticky left-0 z-[1]", bg || "bg-white");
  };

  // Unique values per column (for select filter options)
  const columnUniqueValues = React.useMemo(() => {
    if (!showColumnFilters) return {};
    const map: Record<string, string[]> = {};
    allColumns.forEach((col) => {
      if (col.filterType === "select" || (!col.filterType && col.filterable !== false)) {
        if (col.filterOptions) {
          map[col.id] = col.filterOptions;
        } else {
          const values = new Set<string>();
          data.forEach((row) => {
            const val = getCellValue(row, col);
            if (val !== null && val !== undefined && val !== "") values.add(String(val));
          });
          if (values.size <= 20) map[col.id] = Array.from(values).sort();
        }
      }
    });
    return map;
  }, [data, allColumns, showColumnFilters]);

  // Filtering (global search + column filters)
  const filteredData = React.useMemo(() => {
    if (hasServerPagination) return data;

    let result = data;

    // Global search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((row) => {
        return allColumns.some((col) => {
          if (col.filterable === false) return false;
          const value = getCellValue(row, col);
          return value !== null && value !== undefined && String(value).toLowerCase().includes(query);
        });
      });
    }

    // Column filters
    if (showColumnFilters) {
      // Text and select filters
      Object.entries(columnFilters).forEach(([colId, filterValue]) => {
        if (!filterValue) return;
        const col = allColumns.find((c) => c.id === colId);
        if (!col) return;
        const type = col.filterType || "text";

        result = result.filter((row) => {
          const value = getCellValue(row, col);
          if (value === null || value === undefined) return false;
          const strValue = String(value);

          if (type === "select") return strValue === filterValue;
          return strValue.toLowerCase().includes(filterValue.toLowerCase());
        });
      });

      // Range filters (number, date)
      Object.entries(columnFilterRanges).forEach(([colId, range]) => {
        if (!range.min && !range.max) return;
        const col = allColumns.find((c) => c.id === colId);
        if (!col) return;
        const type = col.filterType || "text";

        result = result.filter((row) => {
          const value = getCellValue(row, col);
          if (value === null || value === undefined) return false;

          if (type === "number") {
            const num = Number(value);
            if (isNaN(num)) return false;
            if (range.min && num < Number(range.min)) return false;
            if (range.max && num > Number(range.max)) return false;
            return true;
          }

          if (type === "date") {
            const dateVal = new Date(String(value)).getTime();
            if (isNaN(dateVal)) return false;
            if (range.min && dateVal < new Date(range.min).getTime()) return false;
            if (range.max && dateVal > new Date(range.max).getTime()) return false;
            return true;
          }

          return true;
        });
      });
    }

    return result;
  }, [data, search, allColumns, hasServerPagination, showColumnFilters, columnFilters, columnFilterRanges]);

  // Sorting (client-side when no server pagination, or local mode)
  const sortedData = React.useMemo(() => {
    if (hasServerPagination) return filteredData; // Server handles sorting
    if (!sortColumn || !sortDirection) return filteredData;
    const col = allColumns.find((c) => c.id === sortColumn);
    if (!col) return filteredData;
    return [...filteredData].sort((a, b) => {
      return compareValues(getCellValue(a, col), getCellValue(b, col), sortDirection);
    });
  }, [filteredData, sortColumn, sortDirection, allColumns, hasServerPagination]);

  // Pagination
  const totalPages = hasServerPagination && remotePagination
    ? remotePagination.lastPage
    : Math.max(1, Math.ceil(sortedData.length / pageSize));

  const totalItems = hasServerPagination && remotePagination
    ? remotePagination.total
    : sortedData.length;

  const paginatedData = React.useMemo(() => {
    if (hasServerPagination) return data; // Server data is already paginated
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, hasServerPagination, data]);

  const displayFrom = hasServerPagination && remotePagination
    ? remotePagination.from
    : totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const displayTo = hasServerPagination && remotePagination
    ? remotePagination.to
    : Math.min(currentPage * pageSize, totalItems);

  // Reset page on local search/sort change
  const prevSearch = React.useRef(search);
  const prevSort = React.useRef({ sortColumn, sortDirection });
  React.useEffect(() => {
    if (hasServerPagination) return;
    if (prevSearch.current !== search || prevSort.current.sortColumn !== sortColumn || prevSort.current.sortDirection !== sortDirection) {
      setCurrentPage(1);
    }
    prevSearch.current = search;
    prevSort.current = { sortColumn, sortDirection };
  }, [search, sortColumn, sortDirection, hasServerPagination]);

  // Notify page change
  const onPageChangeRef = React.useRef(onPageChange);
  onPageChangeRef.current = onPageChange;
  React.useEffect(() => {
    onPageChangeRef.current?.(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Sort handler
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") { setSortColumn(null); setSortDirection(null); }
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
    if (!hasServerPagination) setCurrentPage(1);
  };

  // Selection
  const selectedKeys = React.useMemo(() => {
    if (isSelectionControlled) return new Set(controlledSelected.map((r, i) => getRowKeyValue(r, rowKey, i)));
    return internalSelected;
  }, [controlledSelected, isSelectionControlled, internalSelected, rowKey]);

  const toggleRow = (key: string) => {
    const update = (prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    };
    if (isSelectionControlled) {
      const nextKeys = update(selectedKeys);
      const nextRows = data.filter((r, i) => nextKeys.has(getRowKeyValue(r, rowKey, i)));
      onSelectionChange?.(nextRows);
    } else {
      setInternalSelected((prev) => {
        const next = update(prev);
        onSelectionChange?.(data.filter((r, i) => next.has(getRowKeyValue(r, rowKey, i))));
        return next;
      });
    }
  };

  const toggleAll = () => {
    const pageKeys = paginatedData.map((r, i) => getRowKeyValue(r, rowKey, (hasServerPagination && remotePagination ? remotePagination.from - 1 : (currentPage - 1) * pageSize) + i));
    const allSelected = pageKeys.every((k) => selectedKeys.has(k));
    if (isSelectionControlled) {
      if (allSelected) {
        onSelectionChange?.((controlledSelected || []).filter((r, i) => !pageKeys.includes(getRowKeyValue(r, rowKey, i))));
      } else {
        const existing = new Set((controlledSelected || []).map((r, i) => getRowKeyValue(r, rowKey, i)));
        const newRows = paginatedData.filter((r, i) => !existing.has(getRowKeyValue(r, rowKey, (hasServerPagination && remotePagination ? remotePagination.from - 1 : (currentPage - 1) * pageSize) + i)));
        onSelectionChange?.([...(controlledSelected || []), ...newRows]);
      }
    } else {
      setInternalSelected((prev) => {
        const next = new Set(prev);
        if (allSelected) pageKeys.forEach((k) => next.delete(k));
        else pageKeys.forEach((k) => next.add(k));
        onSelectionChange?.(data.filter((r, i) => next.has(getRowKeyValue(r, rowKey, i))));
        return next;
      });
    }
  };

  const pageAllSelected = paginatedData.length > 0 && paginatedData.every((r, i) => selectedKeys.has(getRowKeyValue(r, rowKey, (hasServerPagination && remotePagination ? remotePagination.from - 1 : (currentPage - 1) * pageSize) + i)));
  const pageSomeSelected = !pageAllSelected && paginatedData.some((r, i) => selectedKeys.has(getRowKeyValue(r, rowKey, (hasServerPagination && remotePagination ? remotePagination.from - 1 : (currentPage - 1) * pageSize) + i)));

  const toggleColumn = (colId: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(colId)) next.delete(colId); else next.add(colId);
      return next;
    });
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Toolbar */}
      {(searchable || showColumnToggle) && (
        <div className="flex flex-wrap items-center gap-2">
          {searchable && (
            <div className="relative flex-1 min-w-0 max-w-xs sm:max-w-sm">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className={cn(
                  "w-full pl-9 pr-3 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors",
                  "focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5",
                  s.font, s.searchHeight,
                )}
              />
            </div>
          )}
          {showColumnToggle && (
            <div ref={columnMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setColumnMenuOpen(!columnMenuOpen)}
                className={cn("inline-flex items-center gap-1.5 px-3 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer", s.font, s.searchHeight)}
              >
                <ColumnsIcon className="size-4" />
                <span className="hidden sm:inline">Columns</span>
              </button>
              {columnMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-50 min-w-44 bg-white border border-zinc-200 rounded-lg p-1.5">
                  {allColumns.filter((col) => col.hideable !== false).map((col) => {
                    const isVisible = !hiddenColumns.has(col.id);
                    return (
                      <button key={col.id} type="button" onClick={() => toggleColumn(col.id)} className="flex w-full items-center gap-2 px-2.5 py-1.5 text-sm rounded-md text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer">
                        <span className={cn("shrink-0 flex items-center justify-center size-4 rounded border transition-colors", isVisible ? "bg-zinc-900 border-zinc-900 text-white" : "border-zinc-300 bg-white")}>
                          {isVisible && <CheckIcon className="size-3" />}
                        </span>
                        {col.header}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {selectable && selectedKeys.size > 0 && (
            <span className="text-xs text-zinc-400 ml-auto">{selectedKeys.size} row{selectedKeys.size !== 1 ? "s" : ""} selected</span>
          )}
        </div>
      )}

      {/* Error */}
      {fetchError && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {fetchError.message}
        </div>
      )}

      {/* Table */}
      <div
        className={cn("overflow-x-auto rounded-lg", bordered && "border border-zinc-200", stickyHeader && maxHeight && "overflow-y-auto")}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <table className="w-full border-collapse">
          <thead className={cn("bg-zinc-50 border-b border-zinc-200", stickyHeader && "sticky top-0 z-10")}>
            <tr>
              {selectable && (
                <th className={cn(s.header, "w-10", getCheckboxFixedClass("bg-zinc-50"))} style={checkboxFixedStyle}>
                  <button type="button" onClick={toggleAll} className={cn("flex items-center justify-center size-4 rounded border transition-colors cursor-pointer", pageAllSelected ? "bg-zinc-900 border-zinc-900 text-white" : pageSomeSelected ? "bg-zinc-900 border-zinc-900 text-white" : "border-zinc-300 bg-white")}>
                    {pageAllSelected && <CheckIcon className="size-3" />}
                    {pageSomeSelected && !pageAllSelected && <MinusIcon className="size-3" />}
                  </button>
                </th>
              )}
              {visibleColumns.map((col) => (
                <th key={col.id} style={{ width: col.width, minWidth: col.minWidth, ...getFixedCellStyle(col) }} className={cn("font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap bg-zinc-50", s.header, s.font, ALIGN_MAP[col.align || "left"], getFixedCellClass(col, "bg-zinc-50"))}>
                  {col.sortable !== false ? (
                    <button type="button" onClick={() => handleSort(col.id)} className="inline-flex items-center gap-1 cursor-pointer hover:text-zinc-700 transition-colors">
                      {col.header}
                      {sortColumn === col.id ? (
                        sortDirection === "asc" ? <ChevronUpIcon className="size-3.5" /> : <ChevronDownIcon className="size-3.5" />
                      ) : (
                        <ChevronsUpDownIcon className="size-3.5 opacity-30" />
                      )}
                    </button>
                  ) : col.header}
                </th>
              ))}
            </tr>
            {/* Column filter row */}
            {showColumnFilters && (
              <tr className="border-b border-zinc-200 bg-zinc-50/50">
                {selectable && <th className={cn(s.header, "w-10", getCheckboxFixedClass("bg-zinc-50/50"))} style={checkboxFixedStyle} />}
                {visibleColumns.map((col) => {
                  if (col.filterable === false) return <th key={col.id} className={cn(s.header, getFixedCellClass(col, "bg-zinc-50/50"))} style={getFixedCellStyle(col)} />;

                  const filterType = col.filterType || "text";
                  const filterInputClass = cn("w-full rounded border border-zinc-200 bg-white px-2 py-1 outline-none transition-colors focus:border-zinc-300 focus:ring-1 focus:ring-zinc-900/5", s.font, "text-zinc-700 placeholder:text-zinc-400");

                  return (
                    <th key={col.id} className={cn(s.header, "font-normal", getFixedCellClass(col, "bg-zinc-50/50"))} style={getFixedCellStyle(col)}>
                      {filterType === "select" ? (
                        <select
                          value={columnFilters[col.id] || ""}
                          onChange={(e) => setColumnFilter(col.id, e.target.value)}
                          className={cn(filterInputClass, "cursor-pointer")}
                        >
                          <option value="">All</option>
                          {(col.filterOptions || columnUniqueValues[col.id] || []).map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : filterType === "number" ? (
                        <div className="flex gap-1">
                          <input
                            type="number"
                            placeholder="Min"
                            value={columnFilterRanges[col.id]?.min || ""}
                            onChange={(e) => setColumnFilterRange(col.id, e.target.value, columnFilterRanges[col.id]?.max)}
                            className={cn(filterInputClass, "w-1/2")}
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={columnFilterRanges[col.id]?.max || ""}
                            onChange={(e) => setColumnFilterRange(col.id, columnFilterRanges[col.id]?.min, e.target.value)}
                            className={cn(filterInputClass, "w-1/2")}
                          />
                        </div>
                      ) : filterType === "date" ? (
                        <div className="flex gap-1">
                          <input
                            type="date"
                            value={columnFilterRanges[col.id]?.min || ""}
                            onChange={(e) => setColumnFilterRange(col.id, e.target.value, columnFilterRanges[col.id]?.max)}
                            className={cn(filterInputClass, "w-1/2")}
                          />
                          <input
                            type="date"
                            value={columnFilterRanges[col.id]?.max || ""}
                            onChange={(e) => setColumnFilterRange(col.id, columnFilterRanges[col.id]?.min, e.target.value)}
                            className={cn(filterInputClass, "w-1/2")}
                          />
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={columnFilters[col.id] || ""}
                          onChange={(e) => setColumnFilter(col.id, e.target.value)}
                          className={filterInputClass}
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            )}
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td colSpan={visibleColumns.length + (selectable ? 1 : 0)} className={cn(s.cell, "text-center")}>
                  <div className="flex items-center justify-center gap-2 py-8 text-zinc-400">
                    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" /></svg>
                    <span className={s.font}>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + (selectable ? 1 : 0)} className={cn(s.cell, "text-center")}>
                  <div className={cn("py-8 text-zinc-400", s.font)}>{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const globalIndex = hasServerPagination && remotePagination ? (remotePagination.from - 1 + rowIndex) : (currentPage - 1) * pageSize + rowIndex;
                const key = getRowKeyValue(row, rowKey, globalIndex);
                const isSelected = selectedKeys.has(key);
                return (
                  <tr key={key} onClick={onRowClick ? () => onRowClick(row, globalIndex) : undefined} className={cn("border-b border-zinc-100 last:border-0 transition-colors", striped && "even:bg-zinc-50/50", isSelected && "bg-zinc-50", onRowClick && "cursor-pointer hover:bg-zinc-50")}>
                    {selectable && (
                      <td className={cn(s.cell, "w-10", getCheckboxFixedClass())} style={checkboxFixedStyle} onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={() => toggleRow(key)} className={cn("flex items-center justify-center size-4 rounded border transition-colors cursor-pointer", isSelected ? "bg-zinc-900 border-zinc-900 text-white" : "border-zinc-300 bg-white")}>
                          {isSelected && <CheckIcon className="size-3" />}
                        </button>
                      </td>
                    )}
                    {visibleColumns.map((col) => {
                      const value = getCellValue(row, col);
                      return (
                        <td key={col.id} className={cn("text-zinc-700", s.cell, s.font, ALIGN_MAP[col.align || "left"], getFixedCellClass(col))} style={getFixedCellStyle(col)}>
                          {col.cell ? col.cell(value, row, globalIndex) : String(value ?? "")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
          {/* Table footer */}
          {showFooter && (
            <tfoot className="bg-zinc-50 border-t border-zinc-200">
              {footerContent ? (
                footerContent(visibleColumns, paginatedData)
              ) : (
                <tr>
                  {selectable && <td className={cn(s.header, getCheckboxFixedClass("bg-zinc-50"))} style={checkboxFixedStyle} />}
                  {visibleColumns.map((col) => (
                    <td key={col.id} className={cn("font-semibold text-zinc-500", s.header, s.font, ALIGN_MAP[col.align || "left"], getFixedCellClass(col, "bg-zinc-50"))} style={getFixedCellStyle(col)}>
                      {col.header}
                    </td>
                  ))}
                </tr>
              )}
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className={cn("appearance-none bg-transparent border border-zinc-200 rounded-md px-2 py-1 text-zinc-700 cursor-pointer outline-none", s.font)}
          >
            {pageSizes.map((ps) => <option key={ps} value={ps}>{ps}</option>)}
          </select>
          <span className={cn("text-zinc-400 whitespace-nowrap", s.font)}>
            {totalItems === 0 ? "0" : `${displayFrom}-${displayTo}`} of {totalItems}
          </span>
        </div>
        <div className="w-full sm:w-auto overflow-x-auto">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            size={size === "md" ? "sm" : "xs"}
            variant="ghost"
            showPrevNext
            siblingCount={1}
            boundaryCount={1}
          />
        </div>
      </div>
    </div>
  );
}

DataTable.displayName = "DataTable";
