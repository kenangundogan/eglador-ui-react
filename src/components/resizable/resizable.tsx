"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GripVerticalIcon, GripHorizontalIcon } from "../../lib/icons";

// ── Types ────────────────────────────────────

export type ResizableDirection = "horizontal" | "vertical";

export interface ResizableProps {
  direction?: ResizableDirection;
  defaultSizes?: number[];
  minSize?: number;
  maxSize?: number;
  className?: string;
  children: React.ReactNode;
}

export interface ResizablePanelProps {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  children: React.ReactNode;
}

export interface ResizableHandleProps {
  className?: string;
  withHandle?: boolean;
}

// ── Context ──────────────────────────────────

interface ResizableContextValue {
  direction: ResizableDirection;
  sizes: number[];
  onResize: (index: number, delta: number) => void;
  onResizeStart: () => void;
  onResizeEnd: () => void;
  panelMinSizes: number[];
  panelMaxSizes: number[];
}

const ResizableContext = React.createContext<ResizableContextValue | null>(null);

function useResizable(): ResizableContextValue {
  const ctx = React.useContext(ResizableContext);
  if (!ctx) throw new Error("Resizable sub-components must be used within <Resizable>");
  return ctx;
}

// ── Resizable Root ───────────────────────────

function ResizableRoot({
  direction = "horizontal",
  defaultSizes,
  minSize = 10,
  maxSize = 90,
  className,
  children,
}: ResizableProps) {
  const childArray = React.Children.toArray(children).filter(React.isValidElement);

  // Count panels (non-handle children)
  const panelCount = childArray.filter(
    (child) => (child as React.ReactElement).type !== ResizableHandle,
  ).length;

  const initialSizes = defaultSizes || Array(panelCount).fill(100 / panelCount);
  const [sizes, setSizes] = React.useState<number[]>(initialSizes);
  const [isResizing, setIsResizing] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Collect per-panel min/max from props
  const panelMinSizes: number[] = [];
  const panelMaxSizes: number[] = [];
  let panelIndex = 0;
  childArray.forEach((child) => {
    const el = child as React.ReactElement;
    if (el.type !== ResizableHandle) {
      const props = el.props as ResizablePanelProps;
      panelMinSizes.push(props.minSize ?? minSize);
      panelMaxSizes.push(props.maxSize ?? maxSize);
      panelIndex++;
    }
  });

  const onResize = React.useCallback(
    (handleIndex: number, delta: number) => {
      if (!containerRef.current) return;

      const containerSize =
        direction === "horizontal"
          ? containerRef.current.offsetWidth
          : containerRef.current.offsetHeight;

      const deltaPercent = (delta / containerSize) * 100;

      setSizes((prev) => {
        const next = [...prev];
        const leftIdx = handleIndex;
        const rightIdx = handleIndex + 1;

        if (leftIdx < 0 || rightIdx >= next.length) return prev;

        let newLeft = next[leftIdx] + deltaPercent;
        let newRight = next[rightIdx] - deltaPercent;

        const leftMin = panelMinSizes[leftIdx] ?? minSize;
        const leftMax = panelMaxSizes[leftIdx] ?? maxSize;
        const rightMin = panelMinSizes[rightIdx] ?? minSize;
        const rightMax = panelMaxSizes[rightIdx] ?? maxSize;

        // Clamp
        if (newLeft < leftMin) {
          newRight += newLeft - leftMin;
          newLeft = leftMin;
        }
        if (newRight < rightMin) {
          newLeft += newRight - rightMin;
          newRight = rightMin;
        }
        if (newLeft > leftMax) {
          newRight += newLeft - leftMax;
          newLeft = leftMax;
        }
        if (newRight > rightMax) {
          newLeft += newRight - rightMax;
          newRight = rightMax;
        }

        // Final safety clamp
        newLeft = Math.max(leftMin, Math.min(leftMax, newLeft));
        newRight = Math.max(rightMin, Math.min(rightMax, newRight));

        next[leftIdx] = newLeft;
        next[rightIdx] = newRight;
        return next;
      });
    },
    [direction, minSize, maxSize, panelMinSizes, panelMaxSizes],
  );

  const onResizeStart = React.useCallback(() => setIsResizing(true), []);
  const onResizeEnd = React.useCallback(() => setIsResizing(false), []);

  // Render panels with sizes injected
  let currentPanelIndex = 0;
  let currentHandleIndex = 0;

  const renderedChildren = childArray.map((child, i) => {
    const el = child as React.ReactElement;
    if (el.type === ResizableHandle) {
      const hIdx = currentHandleIndex++;
      return React.cloneElement(el, { key: `handle-${hIdx}`, _handleIndex: hIdx } as Record<string, unknown>);
    }
    const pIdx = currentPanelIndex++;
    const sizeValue = sizes[pIdx] ?? (100 / panelCount);
    const sizeStyle =
      direction === "horizontal"
        ? { width: `${sizeValue}%` }
        : { height: `${sizeValue}%` };

    return React.cloneElement(el, {
      key: `panel-${pIdx}`,
      style: { ...sizeStyle, ...(el.props as Record<string, unknown>).style as React.CSSProperties | undefined },
    } as Record<string, unknown>);
  });

  return (
    <ResizableContext.Provider value={{ direction, sizes, onResize, onResizeStart, onResizeEnd, panelMinSizes, panelMaxSizes }}>
      <div
        ref={containerRef}
        className={cn(
          "flex overflow-hidden",
          direction === "horizontal" ? "flex-row" : "flex-col",
          isResizing && "select-none",
          className,
        )}
      >
        {renderedChildren}
      </div>
    </ResizableContext.Provider>
  );
}
ResizableRoot.displayName = "Resizable";

// ── Panel ────────────────────────────────────

function ResizablePanel({ className, children, ...rest }: ResizablePanelProps & { style?: React.CSSProperties }) {
  return (
    <div className={cn("overflow-hidden", className)} style={(rest as { style?: React.CSSProperties }).style}>
      {children}
    </div>
  );
}
ResizablePanel.displayName = "ResizablePanel";

// ── Handle ───────────────────────────────────

function ResizableHandle({ className, withHandle = false, ...rest }: ResizableHandleProps & { _handleIndex?: number }) {
  const { direction, onResize, onResizeStart, onResizeEnd } = useResizable();
  const handleIndex = (rest as { _handleIndex?: number })._handleIndex ?? 0;

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onResizeStart();

      const startPos = direction === "horizontal" ? e.clientX : e.clientY;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const currentPos = direction === "horizontal" ? moveEvent.clientX : moveEvent.clientY;
        const delta = currentPos - startPos;
        onResize(handleIndex, delta);
      };

      const handleMouseUp = () => {
        onResizeEnd();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      // Use a single move for continuous delta
      let lastPos = startPos;
      const handleContinuousMove = (moveEvent: MouseEvent) => {
        const currentPos = direction === "horizontal" ? moveEvent.clientX : moveEvent.clientY;
        const delta = currentPos - lastPos;
        lastPos = currentPos;
        onResize(handleIndex, delta);
      };

      document.addEventListener("mousemove", handleContinuousMove);
      document.addEventListener("mouseup", () => {
        onResizeEnd();
        document.removeEventListener("mousemove", handleContinuousMove);
      }, { once: true });
    },
    [direction, handleIndex, onResize, onResizeStart, onResizeEnd],
  );

  return (
    <div
      onMouseDown={handleMouseDown}
      className={cn(
        "relative flex items-center justify-center shrink-0 bg-zinc-200 transition-colors hover:bg-zinc-300 active:bg-zinc-400",
        direction === "horizontal" ? "w-px cursor-col-resize" : "h-px cursor-row-resize",
        className,
      )}
    >
      {withHandle && (
        <div
          className={cn(
            "absolute z-10 flex items-center justify-center rounded-sm bg-zinc-200 border border-zinc-300 text-zinc-400 hover:bg-zinc-300 hover:text-zinc-500",
            direction === "horizontal" ? "h-6 w-3" : "w-6 h-3",
          )}
        >
          {direction === "horizontal" ? (
            <GripVerticalIcon className="size-2.5" />
          ) : (
            <GripHorizontalIcon className="size-2.5 rotate-90" />
          )}
        </div>
      )}
    </div>
  );
}
ResizableHandle.displayName = "ResizableHandle";

// ── Export ────────────────────────────────────

export const Resizable = Object.assign(ResizableRoot, {
  Panel: ResizablePanel,
  Handle: ResizableHandle,
});
