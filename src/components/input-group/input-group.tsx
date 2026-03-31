import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type InputGroupVariant = "bordered" | "stacked";

export interface InputGroupProps {
  variant?: InputGroupVariant;
  className?: string;
  children: React.ReactNode;
}

export interface InputGroupTextProps {
  className?: string;
  children: React.ReactNode;
}

export interface InputGroupAddonProps {
  className?: string;
  children: React.ReactNode;
}

// ── InputGroup Text ──────────────────────────

function InputGroupText({ className, children }: InputGroupTextProps) {
  return (
    <span
      className={cn(
        "flex items-center justify-center px-3 text-sm text-zinc-500 bg-zinc-50 border-zinc-200 whitespace-nowrap select-none",
        className,
      )}
    >
      {children}
    </span>
  );
}
InputGroupText.displayName = "InputGroupText";

// ── InputGroup Addon ─────────────────────────

function InputGroupAddon({ className, children }: InputGroupAddonProps) {
  return (
    <div className={cn("flex items-center shrink-0", className)}>
      {children}
    </div>
  );
}
InputGroupAddon.displayName = "InputGroupAddon";

// ── Component ────────────────────────────────

function InputGroupRoot({
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
        {items.map((child, index) => {
          const el = child as React.ReactElement;

          // InputGroup.Text and InputGroup.Addon pass through
          if (el.type === InputGroupText || el.type === InputGroupAddon) {
            return <React.Fragment key={index}>{child}</React.Fragment>;
          }

          return (
            <React.Fragment key={index}>
              {React.cloneElement(el as React.ReactElement<{ className?: string; wrapperClassName?: string }>, {
                className: cn(
                  (el.props as { className?: string }).className,
                  "rounded-none border-0 focus:ring-0 focus:border-0 focus:outline-none focus:ring-offset-0",
                  "focus:relative focus:z-10 focus:ring-2 focus:ring-black/5",
                ),
                wrapperClassName: "",
              })}

              {index < items.length - 1 && (
                <div className="h-px bg-zinc-200 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // bordered (horizontal)
  return (
    <div
      className={cn(
        "inline-flex items-stretch rounded-lg border border-zinc-200 overflow-hidden",
        className,
      )}
    >
      {items.map((child, index) => {
        const el = child as React.ReactElement;

        // InputGroup.Text passes through with divider
        if (el.type === InputGroupText) {
          return (
            <React.Fragment key={index}>
              {index > 0 && <div className="w-px self-stretch bg-zinc-200 shrink-0" />}
              {child}
            </React.Fragment>
          );
        }

        // InputGroup.Addon passes through (buttons etc.)
        if (el.type === InputGroupAddon) {
          return <React.Fragment key={index}>{child}</React.Fragment>;
        }

        return (
          <React.Fragment key={index}>
            {React.cloneElement(el as React.ReactElement<{ className?: string; wrapperClassName?: string }>, {
              className: cn(
                (el.props as { className?: string }).className,
                "rounded-none border-0 focus:ring-0 focus:border-0 focus:outline-none focus:ring-offset-0",
                "focus:relative focus:z-10 focus:ring-2 focus:ring-black/5",
              ),
              wrapperClassName: "",
            })}

            {index < items.length - 1 && !(items[index + 1] as React.ReactElement).type?.toString().includes("InputGroupText") && (
              <div className="w-px self-stretch bg-zinc-200 shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Export ────────────────────────────────────

export const InputGroup = Object.assign(InputGroupRoot, {
  Text: InputGroupText,
  Addon: InputGroupAddon,
});
