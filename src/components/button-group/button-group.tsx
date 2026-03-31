import * as React from "react";
import { cn } from "../../lib/utils";

export type ButtonGroupVariant = "bordered" | "segmented";

export interface ButtonGroupProps {
  variant?: ButtonGroupVariant;
  className?: string;
  children: React.ReactNode;
}

export function ButtonGroup({
  variant = "bordered",
  className,
  children,
}: ButtonGroupProps) {
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
        const childProps = child.props as { className?: string; active?: boolean };
        const isActive = !!childProps.active;

        return (
          <React.Fragment key={index}>
            {React.cloneElement(child as React.ReactElement<{ className?: string }>, {
              className: cn(
                childProps.className,
                "border-0",
                variant === "segmented" && !isActive && "bg-transparent hover:bg-white/80",
                variant === "segmented" && isActive && "bg-white text-zinc-900",
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
