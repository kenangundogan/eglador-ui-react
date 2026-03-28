import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export interface SelectOption {
  label: string;
  value: string;
  [key: string]: unknown;
}

export interface SelectProps {
  value?: string;
  onChange?: (value: string, option?: SelectOption) => void;
  options?: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoFlip?: boolean;
  maxHeight?: number;
}

// ── Icons ────────────────────────────────────

function ChevronDownIcon({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className, strokeWidth = 2.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// ── Component ────────────────────────────────

export function Select({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  className,
  disabled = false,
  autoFlip = true,
  maxHeight = 240,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [openDirection, setOpenDirection] = React.useState<"bottom" | "top">("bottom");

  const containerRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen || !autoFlip || !buttonRef.current || !dropdownRef.current) return;

    const measure = () => {
      if (!buttonRef.current || !dropdownRef.current) return;
      const triggerRect = buttonRef.current.getBoundingClientRect();
      const contentRect = dropdownRef.current.getBoundingClientRect();
      const { innerHeight } = window;

      if (triggerRect.bottom + contentRect.height > innerHeight && triggerRect.top > contentRect.height) {
        setOpenDirection("top");
      } else {
        setOpenDirection("bottom");
      }
    };

    const timer = requestAnimationFrame(measure);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(timer);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [isOpen, autoFlip]);

  const handleSelect = (option: SelectOption) => {
    onChange?.(option.value, option);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-[13px] font-medium transition-all duration-200 outline-none",
          disabled ? "opacity-50 cursor-not-allowed border-zinc-200 text-zinc-400" : "cursor-pointer",
          isOpen ? "border-zinc-400 ring-2 ring-zinc-50 text-zinc-900" : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50",
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : <span className="text-zinc-400">{placeholder}</span>}
        </span>
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
            "absolute left-0 z-50 w-full rounded-xl border border-zinc-200 bg-white p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
            openDirection === "bottom" ? "top-[calc(100%+4px)]" : "bottom-[calc(100%+4px)]",
          )}
        >
          <div
            className="overflow-y-auto"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            {options.length === 0 ? (
              <div className="py-2.5 px-3 text-[13px] text-zinc-500 text-center font-medium">No options</div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {options.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-9 pr-3 text-[13px] outline-none transition-colors",
                        isSelected ? "bg-zinc-50 text-zinc-900 font-semibold" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
                      )}
                    >
                      {isSelected && (
                        <span className="absolute left-3 flex h-full items-center justify-center">
                          <CheckIcon className="size-4 text-zinc-900" />
                        </span>
                      )}
                      <span className="truncate">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
