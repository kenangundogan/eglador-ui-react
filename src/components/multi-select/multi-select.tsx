"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { useClickOutside } from "../../lib/use-click-outside";
import { useEscapeClose } from "../../lib/use-escape-close";
import { useAutoFlip } from "../../lib/use-auto-flip";

// ── Types ────────────────────────────────────

export interface MultiSelectOption {
  label: string;
  value: string;
  [key: string]: unknown;
}

export interface MultiSelectProps {
  value?: string[];
  onChange?: (values: string[], options?: MultiSelectOption[]) => void;
  options?: MultiSelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoFlip?: boolean;
  maxHeight?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  maxSelected?: number;
  maxVisibleChips?: number;
  clearLabel?: string;
  selectedLabel?: string;
  noResultsLabel?: string;
  noOptionsLabel?: string;
}

// ── Icons ────────────────────────────────────

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
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

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

// ── Component ────────────────────────────────

export function MultiSelect({
  value = [],
  onChange,
  options = [],
  placeholder = "Select...",
  className,
  disabled = false,
  autoFlip = true,
  maxHeight = 240,
  searchable = false,
  searchPlaceholder = "Search...",
  maxSelected,
  maxVisibleChips = 3,
  clearLabel = "Clear",
  selectedLabel = "selected",
  noResultsLabel = "No results found",
  noOptionsLabel = "No options",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const selectedOptions = React.useMemo(
    () => options.filter((opt) => value.includes(opt.value)),
    [options, value],
  );

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, search]);

  const closeMultiSelect = React.useCallback(() => {
    setIsOpen(false);
    setSearch("");
  }, []);
  useClickOutside(containerRef, closeMultiSelect, isOpen);
  useEscapeClose(closeMultiSelect, isOpen);
  const openDirection = useAutoFlip(triggerRef, dropdownRef, "bottom", isOpen && autoFlip) as "bottom" | "top";

  React.useEffect(() => {
    if (isOpen && searchable) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [isOpen, searchable]);

  const toggleOption = (option: MultiSelectOption) => {
    const isSelected = value.includes(option.value);

    let nextValues: string[];
    if (isSelected) {
      nextValues = value.filter((v) => v !== option.value);
    } else {
      if (maxSelected && value.length >= maxSelected) return;
      nextValues = [...value, option.value];
    }

    const nextOptions = options.filter((opt) => nextValues.includes(opt.value));
    onChange?.(nextValues, nextOptions);
  };

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextValues = value.filter((v) => v !== optionValue);
    const nextOptions = options.filter((opt) => nextValues.includes(opt.value));
    onChange?.(nextValues, nextOptions);
  };

  const hasSelection = selectedOptions.length > 0;
  const visibleChips = selectedOptions.slice(0, maxVisibleChips);
  const overflowCount = selectedOptions.length - maxVisibleChips;
  const isAtMax = maxSelected !== undefined && value.length >= maxSelected;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm font-medium transition-all duration-200 outline-none min-h-9.5",
          disabled ? "opacity-50 cursor-not-allowed border-zinc-200 text-zinc-400" : "cursor-pointer",
          isOpen ? "border-zinc-300 ring-2 ring-zinc-900/5 text-zinc-900" : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50",
        )}
      >
        <div className="flex-1 flex items-center gap-1 flex-wrap min-w-0 mr-1">
          {hasSelection ? (
            <>
              {visibleChips.map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-700 rounded-md px-1.5 py-0.5 text-xs font-medium max-w-30"
                >
                  <span className="truncate">{opt.label}</span>
                  {!disabled && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => removeOption(opt.value, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") removeOption(opt.value, e as unknown as React.MouseEvent);
                      }}
                      className="shrink-0 hover:text-zinc-900 transition-colors cursor-pointer"
                    >
                      <XIcon className="size-3" />
                    </span>
                  )}
                </span>
              ))}
              {overflowCount > 0 && (
                <span className="text-xs text-zinc-400 font-medium px-1">
                  +{overflowCount}
                </span>
              )}
            </>
          ) : (
            <span className="text-zinc-400 truncate">{placeholder}</span>
          )}
        </div>
        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 transition-transform duration-200",
            isOpen && openDirection === "bottom" ? "rotate-180 text-zinc-900" : isOpen && openDirection === "top" ? "text-zinc-900" : "text-zinc-400",
          )}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute left-0 z-50 w-full rounded-lg border border-zinc-200 bg-white",
            openDirection === "bottom" ? "top-[calc(100%+4px)]" : "bottom-[calc(100%+4px)]",
          )}
        >
          {searchable && (
            <div className="p-1.5 pb-0">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 transition-colors bg-zinc-50"
                />
              </div>
            </div>
          )}

          <div
            className="overflow-y-auto p-1.5"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            {filteredOptions.length === 0 ? (
              <div className="py-2.5 px-3 text-sm text-zinc-500 text-center font-medium">
                {search ? noResultsLabel : noOptionsLabel}
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  const isDisabledOption = !isSelected && isAtMax;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={isDisabledOption}
                      onClick={() => toggleOption(option)}
                      className={cn(
                        "relative flex w-full select-none items-center rounded-md py-2 pl-9 pr-3 text-sm outline-none transition-colors",
                        isDisabledOption ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
                        isSelected ? "bg-zinc-50 text-zinc-900 font-semibold" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
                      )}
                    >
                      <span className="absolute left-3 flex h-full items-center justify-center">
                        {isSelected ? (
                          <CheckIcon className="size-4 text-zinc-900" />
                        ) : (
                          <div className="size-4 rounded border border-zinc-300" />
                        )}
                      </span>
                      <span className="truncate">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {hasSelection && (
            <div className="border-t border-zinc-100 px-3 py-2 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">
                {selectedOptions.length} {selectedLabel}
                {maxSelected && <span> / {maxSelected}</span>}
              </span>
              <button
                type="button"
                onClick={() => onChange?.([], [])}
                className="text-xs text-zinc-400 hover:text-zinc-700 font-medium transition-colors cursor-pointer"
              >
                {clearLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
