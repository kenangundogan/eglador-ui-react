import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type InputGroupVariant = "bordered" | "stacked";

export interface InputGroupProps {
  variant?: InputGroupVariant;
  className?: string;
  children: React.ReactNode;
}

// ── Component ────────────────────────────────

export function InputGroup({
  variant = "bordered",
  className,
  children,
}: InputGroupProps) {
  const items = React.Children.toArray(children).filter(React.isValidElement);

  if (variant === "stacked") {
    return (
      <div
        className={cn(
          "flex flex-col rounded-lg border border-zinc-200 overflow-hidden",
          className,
        )}
      >
        {items.map((child, index) => (
          <React.Fragment key={index}>
            {React.cloneElement(child as React.ReactElement<{ className?: string; wrapperClassName?: string }>, {
              className: cn(
                (child.props as { className?: string }).className,
                "rounded-none border-0 focus:ring-0 focus:border-0 focus:outline-none focus:ring-offset-0",
                "focus:relative focus:z-10 focus:ring-2 focus:ring-black/5",
              ),
              wrapperClassName: "",
            })}

            {index < items.length - 1 && (
              <div className="h-px bg-zinc-200 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-zinc-200 overflow-hidden",
        className,
      )}
    >
      {items.map((child, index) => (
        <React.Fragment key={index}>
          {React.cloneElement(child as React.ReactElement<{ className?: string; wrapperClassName?: string }>, {
            className: cn(
              (child.props as { className?: string }).className,
              "rounded-none border-0 focus:ring-0 focus:border-0 focus:outline-none focus:ring-offset-0",
              "focus:relative focus:z-10 focus:ring-2 focus:ring-black/5",
            ),
            wrapperClassName: "",
          })}

          {index < items.length - 1 && (
            <div className="w-px self-stretch bg-zinc-200 shrink-0" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
