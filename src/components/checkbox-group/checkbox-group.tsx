import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type CheckboxGroupVariant = "bordered" | "segmented";

export interface CheckboxGroupProps {
  variant?: CheckboxGroupVariant;
  className?: string;
  children: React.ReactNode;
}

// ── Component ────────────────────────────────

export function CheckboxGroup({
  variant = "bordered",
  className,
  children,
}: CheckboxGroupProps) {
  const items = React.Children.toArray(children).filter(React.isValidElement);

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg",
        variant === "bordered"
          ? "bg-white border border-zinc-200"
          : "bg-zinc-100 p-1 gap-px",
        className,
      )}
    >
      {items.map((child, index) => {
        const childProps = child.props as { className?: string; checked?: boolean };
        const isChecked = !!childProps.checked;

        return (
          <React.Fragment key={index}>
            {React.cloneElement(child as React.ReactElement<{ className?: string }>, {
              className: cn(
                childProps.className,
                "border-0",
                variant === "segmented" && !isChecked && "bg-transparent hover:bg-white/80",
                variant === "segmented" && isChecked && "bg-white text-zinc-900",
              ),
            })}

            {variant === "bordered" && index < items.length - 1 && (
              <div className="w-px self-stretch my-2 bg-zinc-200 shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

CheckboxGroup.displayName = "CheckboxGroup";
