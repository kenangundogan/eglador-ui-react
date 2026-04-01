"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { CheckIcon } from "../../lib/icons";

// ── Types ────────────────────────────────────

export type StepperVariant = "default" | "bordered";
export type StepperSize = "xs" | "sm" | "md";
export type StepperColor = "default" | "primary" | "success" | "danger" | "warning" | "info";
export type StepperOrientation = "horizontal" | "vertical";
export type StepStatus = "completed" | "active" | "upcoming";

export interface StepperProps {
  activeStep?: number;
  variant?: StepperVariant;
  size?: StepperSize;
  color?: StepperColor;
  orientation?: StepperOrientation;
  clickable?: boolean;
  onStepClick?: (step: number) => void;
  className?: string;
  children: React.ReactNode;
}

export interface StepProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

// ── Context ──────────────────────────────────

interface StepperContextValue {
  activeStep: number;
  totalSteps: number;
  variant: StepperVariant;
  size: StepperSize;
  color: StepperColor;
  orientation: StepperOrientation;
  clickable: boolean;
  onStepClick?: (step: number) => void;
}

const StepperContext = React.createContext<StepperContextValue | null>(null);

function useStepper(): StepperContextValue {
  const ctx = React.useContext(StepperContext);
  if (!ctx) throw new Error("Step must be used within <Stepper>");
  return ctx;
}

// ── Size definitions ─────────────────────────

const SIZES: Record<StepperSize, {
  indicator: string;
  indicatorPx: number;
  indicatorFont: string;
  iconSize: string;
  checkSize: string;
  titleFont: string;
  descFont: string;
  contentFont: string;
  gap: string;
}> = {
  xs: {
    indicator: "size-6",
    indicatorPx: 24,
    indicatorFont: "text-[10px]",
    iconSize: "size-3",
    checkSize: "size-3",
    titleFont: "text-xs",
    descFont: "text-[10px]",
    contentFont: "text-xs",
    gap: "gap-1",
  },
  sm: {
    indicator: "size-8",
    indicatorPx: 32,
    indicatorFont: "text-xs",
    iconSize: "size-3.5",
    checkSize: "size-3.5",
    titleFont: "text-sm",
    descFont: "text-xs",
    contentFont: "text-sm",
    gap: "gap-1.5",
  },
  md: {
    indicator: "size-10",
    indicatorPx: 40,
    indicatorFont: "text-sm",
    iconSize: "size-4",
    checkSize: "size-4",
    titleFont: "text-base",
    descFont: "text-sm",
    contentFont: "text-sm",
    gap: "gap-2",
  },
};

// ── Color definitions ────────────────────────

interface StepperColorDef {
  completed: string;
  completedText: string;
  active: string;
  activeText: string;
  upcoming: string;
  upcomingText: string;
  connectorCompleted: string;
  connectorUpcoming: string;
}

const COLORS: Record<StepperColor, StepperColorDef> = {
  default: {
    completed: "bg-zinc-900 border-zinc-900",
    completedText: "text-white",
    active: "bg-white border-zinc-900 border-2",
    activeText: "text-zinc-900",
    upcoming: "bg-zinc-100 border-zinc-200",
    upcomingText: "text-zinc-400",
    connectorCompleted: "bg-zinc-900",
    connectorUpcoming: "bg-zinc-200",
  },
  primary: {
    completed: "bg-blue-600 border-blue-600",
    completedText: "text-white",
    active: "bg-white border-blue-600 border-2",
    activeText: "text-blue-600",
    upcoming: "bg-zinc-100 border-zinc-200",
    upcomingText: "text-zinc-400",
    connectorCompleted: "bg-blue-600",
    connectorUpcoming: "bg-zinc-200",
  },
  success: {
    completed: "bg-green-500 border-green-500",
    completedText: "text-white",
    active: "bg-white border-green-500 border-2",
    activeText: "text-green-600",
    upcoming: "bg-zinc-100 border-zinc-200",
    upcomingText: "text-zinc-400",
    connectorCompleted: "bg-green-500",
    connectorUpcoming: "bg-zinc-200",
  },
  danger: {
    completed: "bg-red-500 border-red-500",
    completedText: "text-white",
    active: "bg-white border-red-500 border-2",
    activeText: "text-red-500",
    upcoming: "bg-zinc-100 border-zinc-200",
    upcomingText: "text-zinc-400",
    connectorCompleted: "bg-red-500",
    connectorUpcoming: "bg-zinc-200",
  },
  warning: {
    completed: "bg-yellow-500 border-yellow-500",
    completedText: "text-white",
    active: "bg-white border-yellow-500 border-2",
    activeText: "text-yellow-600",
    upcoming: "bg-zinc-100 border-zinc-200",
    upcomingText: "text-zinc-400",
    connectorCompleted: "bg-yellow-500",
    connectorUpcoming: "bg-zinc-200",
  },
  info: {
    completed: "bg-indigo-500 border-indigo-500",
    completedText: "text-white",
    active: "bg-white border-indigo-500 border-2",
    activeText: "text-indigo-600",
    upcoming: "bg-zinc-100 border-zinc-200",
    upcomingText: "text-zinc-400",
    connectorCompleted: "bg-indigo-500",
    connectorUpcoming: "bg-zinc-200",
  },
};

// ── Step Indicator ───────────────────────────

function StepIndicator({ index, status, icon }: { index: number; status: StepStatus; icon?: React.ReactNode }) {
  const { size, color } = useStepper();
  const s = SIZES[size];
  const c = COLORS[color];

  const statusStyles = {
    completed: cn(c.completed, c.completedText),
    active: cn(c.active, c.activeText),
    upcoming: cn(c.upcoming, c.upcomingText),
  };

  return (
    <div
      className={cn(
        "shrink-0 flex items-center justify-center rounded-full border font-semibold transition-all",
        s.indicator,
        s.indicatorFont,
        statusStyles[status],
      )}
    >
      {status === "completed" ? (
        <CheckIcon className={s.checkSize} strokeWidth={3} />
      ) : icon ? (
        <span className={cn("flex items-center justify-center [&>svg]:w-full [&>svg]:h-full", s.iconSize)}>
          {icon}
        </span>
      ) : (
        index + 1
      )}
    </div>
  );
}

// ── Stepper Root ─────────────────────────────

function StepperRoot({
  activeStep = 0,
  variant = "default",
  size = "sm",
  color = "primary",
  orientation = "horizontal",
  clickable = false,
  onStepClick,
  className,
  children,
}: StepperProps) {
  const steps = React.Children.toArray(children).filter(React.isValidElement);
  const totalSteps = steps.length;
  const s = SIZES[size];
  const c = COLORS[color];

  const isClickable = clickable && onStepClick;

  if (orientation === "vertical") {
    return (
      <StepperContext.Provider value={{ activeStep, totalSteps, variant, size, color, orientation, clickable, onStepClick }}>
        <div
          className={cn(
            "flex flex-col",
            variant === "bordered" && "border border-zinc-200 rounded-lg p-4",
            className,
          )}
        >
          {steps.map((step, index) => {
            const status: StepStatus = index < activeStep ? "completed" : index === activeStep ? "active" : "upcoming";
            const isLast = index === totalSteps - 1;
            const stepProps = step.props as StepProps;
            const titleColor = status === "upcoming" ? "text-zinc-400" : "text-zinc-900";

            return (
              <div key={index} className="flex flex-row">
                {/* Left column: indicator + connector */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={cn(isClickable && "cursor-pointer")}
                    onClick={isClickable ? () => onStepClick(index) : undefined}
                  >
                    <StepIndicator index={index} status={status} icon={stepProps.icon} />
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        "w-px flex-1 min-h-6 my-1 transition-colors",
                        index < activeStep ? c.connectorCompleted : c.connectorUpcoming,
                      )}
                    />
                  )}
                </div>

                {/* Right column: content */}
                <div className={cn("flex flex-col min-w-0 ml-3 pb-6", isLast && "pb-0")}>
                  {stepProps.title && (
                    <span
                      className={cn(
                        "font-semibold leading-snug",
                        s.titleFont,
                        titleColor,
                        isClickable && "cursor-pointer",
                      )}
                      style={{ minHeight: s.indicatorPx, display: "flex", alignItems: "center" }}
                      onClick={isClickable ? () => onStepClick(index) : undefined}
                    >
                      {stepProps.title}
                    </span>
                  )}
                  {stepProps.description && (
                    <span className={cn("leading-relaxed text-zinc-400 mt-0.5", s.descFont)}>
                      {stepProps.description}
                    </span>
                  )}
                  {stepProps.children && (
                    <div className={cn("mt-2 text-zinc-600", s.contentFont)}>
                      {stepProps.children}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </StepperContext.Provider>
    );
  }

  // Horizontal
  return (
    <StepperContext.Provider value={{ activeStep, totalSteps, variant, size, color, orientation, clickable, onStepClick }}>
      <div
        className={cn(
          "flex flex-row items-start",
          variant === "bordered" && "border border-zinc-200 rounded-lg p-4",
          className,
        )}
      >
        {steps.map((step, index) => {
          const status: StepStatus = index < activeStep ? "completed" : index === activeStep ? "active" : "upcoming";
          const isLast = index === totalSteps - 1;
          const stepProps = step.props as StepProps;
          const titleColor = status === "upcoming" ? "text-zinc-400" : "text-zinc-900";

          return (
            <React.Fragment key={index}>
              <div
                className={cn(
                  "flex flex-col items-center text-center",
                  s.gap,
                  isClickable && "cursor-pointer",
                )}
                onClick={isClickable ? () => onStepClick(index) : undefined}
              >
                <StepIndicator index={index} status={status} icon={stepProps.icon} />
                {(stepProps.title || stepProps.description) && (
                  <div className={cn("flex flex-col min-w-0", s.gap)}>
                    {stepProps.title && (
                      <span className={cn("font-semibold leading-snug", s.titleFont, titleColor)}>
                        {stepProps.title}
                      </span>
                    )}
                    {stepProps.description && (
                      <span className={cn("leading-relaxed text-zinc-400", s.descFont)}>
                        {stepProps.description}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!isLast && (
                <div className="flex-1 flex items-center px-2" style={{ paddingTop: s.indicatorPx / 2 }}>
                  <div
                    className={cn(
                      "flex-1 h-px transition-colors",
                      index < activeStep ? c.connectorCompleted : c.connectorUpcoming,
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </StepperContext.Provider>
  );
}

// ── Step (public) ────────────────────────────

function Step(_props: StepProps) {
  return null;
}

// ── Export ────────────────────────────────────

export const Stepper = Object.assign(StepperRoot, {
  Step,
});
