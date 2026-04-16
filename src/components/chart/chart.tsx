"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import {
  LineChart as RLineChart,
  Line,
  BarChart as RBarChart,
  Bar,
  AreaChart as RAreaChart,
  Area,
  PieChart as RPieChart,
  Pie,
  RadarChart as RRadarChart,
  Radar,
  RadialBarChart as RRadialBarChart,
  RadialBar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// ── Color palette ──────────────────────────────

export const CHART_SEMANTIC_COLORS = {
  primary: "#3b82f6",   // blue-500
  danger: "#ef4444",    // red-500
  success: "#10b981",   // emerald-500
  warning: "#f59e0b",   // amber-500
  info: "#6366f1",      // indigo-500
} as const;

export const CHART_COLORS = [
  "#93c5fd", // blue-300
  "#3b82f6", // blue-500
  "#2563eb", // blue-600
  "#1d4ed8", // blue-800
  "#1e40af", // blue-900
];

// ── Chart config ──────────────────────────────

// Matches project's theme system: [data-theme="dark"] on root element
const THEMES = { light: "", dark: "[data-theme=dark]" } as const;

/**
 * Per-series configuration for labels, icons, and light/dark colors.
 * Keys must match the `dataKey` values used in series props.
 *
 * @example
 * const config: ChartConfig = {
 *   revenue: { label: "Revenue", color: "#3b82f6" },
 *   expenses: { label: "Expenses", theme: { light: "#ef4444", dark: "#f87171" } },
 * }
 */
export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>;

// ── Context ───────────────────────────────────────────────────────────────────

type ChartContextValue = { config: ChartConfig };
const ChartContext = React.createContext<ChartContextValue | null>(null);

export function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within a <ChartContainer />");
  return ctx;
}

// ── Public ChartContainer — low-level wrapper for composing recharts charts ───

const INITIAL_DIMENSION = { width: 320, height: 200 } as const;

export function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof ResponsiveContainer>["children"];
  initialDimension?: { width: number; height: number };
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs",
          // recharts SVG class overrides for consistent styling
          "[&_.recharts-cartesian-axis-tick_text]:fill-[var(--color-zinc-400)]",
          "[&_.recharts-cartesian-grid_line]:stroke-[var(--color-zinc-100)]",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-[var(--color-zinc-200)]",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-[var(--color-zinc-200)]",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-[var(--color-zinc-100)]",
          "[&_.recharts-layer]:outline-hidden",
          "[&_.recharts-sector]:outline-hidden",
          "[&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ResponsiveContainer initialDimension={initialDimension}>
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// ── Chart tooltip ──────────────────────────────

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: readonly any[];
  label?: string | number;
  className?: string;
  indicator?: "line" | "dot" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  labelFormatter?: (value: any, payload: readonly any[]) => React.ReactNode;
  labelClassName?: string;
  formatter?: (value: any, name: any, item: any, index: number, payload: any) => React.ReactNode;
  color?: string;
  nameKey?: string;
  labelKey?: string;
}

export const ChartTooltip = Tooltip;

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<"div"> & ChartTooltipContentProps) {
  const ctx = React.useContext(ChartContext);
  const config = ctx?.config ?? {};

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null;
    const [item] = payload;
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value ?? label, payload)}
        </div>
      );
    }
    if (!value && value !== 0) return null;
    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) return null;

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg px-2.5 py-1.5 text-xs shadow-xl",
        "border",
        className
      )}
      style={{
        background: "var(--color-white)",
        borderColor: "var(--color-zinc-200)",
      }}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color ?? item.payload?.fill ?? item.color;

            return (
              <div
                key={index}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn("shrink-0 rounded-[2px]", {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1 self-stretch": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent self-stretch":
                              indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          })}
                          style={{ backgroundColor: indicatorColor, borderColor: indicatorColor }}
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none gap-2",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span style={{ color: "var(--color-zinc-500)" }}>
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value != null && (
                        <span
                          className="font-mono font-medium tabular-nums"
                          style={{ color: "var(--color-zinc-800)" }}
                        >
                          {typeof item.value === "number"
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

// ── Chart legend ──────────────────────────────

export const ChartLegend = Legend;

export function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean;
  nameKey?: string;
  payload?: readonly any[];
  verticalAlign?: "top" | "bottom";
}) {
  const ctx = React.useContext(ChartContext);
  const config = ctx?.config ?? {};

  if (!payload?.length) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 text-xs",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          return (
            <div
              key={index}
              className="flex items-center gap-1.5"
              style={{ color: "var(--color-zinc-500)" }}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
              {itemConfig?.label ?? item.value}
            </div>
          );
        })}
    </div>
  );
}

// ── Helper: resolve config entry from a recharts payload item ─────────────────

export function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
): ChartConfig[string] | undefined {
  if (typeof payload !== "object" || payload === null) return undefined;

  const p = payload as Record<string, any>;
  const nested = p.payload && typeof p.payload === "object" ? p.payload : undefined;

  const resolvedKey =
    typeof p[key] === "string" ? p[key] :
      typeof nested?.[key] === "string" ? nested[key] :
        key;

  return config[resolvedKey] ?? config[key];
}

// ── High-level chart types ──────────────────────────────

export type ChartSeries = {
  dataKey: string;
  name?: string;
  color?: string;
  dashed?: boolean;
  gradientFill?: boolean;
  interpolation?: "linear" | "monotone" | "step" | "stepBefore" | "stepAfter";
  stackId?: string;
  yAxisId?: "left" | "right";
};

export type ChartAxisConfig = {
  dataKey?: string;
  label?: string;
  tickFormatter?: (value: any, index: number) => string;
  domain?: [number | string, number | string];
  hide?: boolean;
  tickCount?: number;
  unit?: string;
  type?: "number" | "category";
};

export type ChartTooltipConfig = {
  formatter?: (value: any, name: string) => [string, string] | string;
  labelFormatter?: (label: any) => string;
  content?: React.ComponentType<any>;
  show?: boolean;
};

export type ChartLegendConfig = {
  show?: boolean;
  position?: "top" | "bottom";
  align?: "left" | "center" | "right";
};

export type ChartGridConfig = {
  show?: boolean;
  horizontal?: boolean;
  vertical?: boolean;
};

export type BaseChartProps = {
  data: Record<string, any>[];
  series: ChartSeries[];
  xAxis?: ChartAxisConfig;
  yAxis?: ChartAxisConfig;
  secondYAxis?: ChartAxisConfig;
  tooltip?: ChartTooltipConfig | boolean;
  legend?: ChartLegendConfig | boolean;
  grid?: ChartGridConfig | boolean;
  height?: number;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  animated?: boolean;
  ariaLabel?: string;
};

// ── Gradient SVG Defs ─────────────────────────────────────────────────────────

function GradientDefs({ series }: { series: ChartSeries[] }) {
  const gradients = series.filter((s) => s.gradientFill !== false);
  if (!gradients.length) return null;
  return (
    <defs>
      {gradients.map((s, i) => {
        const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
        return (
          <linearGradient
            key={s.dataKey}
            id={`chart-gradient-${s.dataKey}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        );
      })}
    </defs>
  );
}

// ── Simple tooltip for high-level chart components ────────────────────────────

interface SimpleTooltipProps {
  active?: boolean;
  payload?: readonly any[];
  label?: string | number;
  formatter?: ChartTooltipConfig["formatter"];
  labelFormatter?: ChartTooltipConfig["labelFormatter"];
}

function SimpleTooltip({ active, payload, label, formatter, labelFormatter }: SimpleTooltipProps) {
  if (!active || !payload?.length) return null;
  const displayLabel = labelFormatter ? labelFormatter(label) : label;
  return (
    <div
      className="grid min-w-[8rem] gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl"
      style={{
        background: "var(--color-white)",
        borderColor: "var(--color-zinc-200)",
      }}
    >
      {displayLabel !== undefined && displayLabel !== "" && (
        <p
          className="mb-0.5 font-semibold uppercase tracking-wide"
          style={{ color: "var(--color-zinc-400)", fontSize: 10 }}
        >
          {String(displayLabel)}
        </p>
      )}
      {payload.map((entry: any, i: number) => {
        const result = formatter ? formatter(entry.value, entry.name) : null;
        const displayValue = Array.isArray(result)
          ? result[0]
          : result != null
            ? result
            : entry.value;
        const displayName = Array.isArray(result) ? result[1] : entry.name;
        return (
          <div key={i} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span style={{ color: "var(--color-zinc-500)" }}>{displayName}</span>
            <span
              className="ml-auto pl-3 font-mono font-semibold tabular-nums"
              style={{ color: "var(--color-zinc-800)" }}
            >
              {String(displayValue)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Builder helpers for high-level charts ─────────────────────────────────────

const TICK_STYLE = { fill: "var(--color-zinc-400)", fontSize: 11 };
const AXIS_LINE_STYLE = { stroke: "var(--color-zinc-200)" };

function buildXAxis(cfg: ChartAxisConfig | undefined): React.ReactElement | null {
  if (cfg?.hide) return null;
  return (
    <XAxis
      dataKey={cfg?.dataKey ?? "name"}
      tickFormatter={cfg?.tickFormatter}
      domain={cfg?.domain}
      tickCount={cfg?.tickCount}
      unit={cfg?.unit}
      type={cfg?.type}
      tick={TICK_STYLE}
      axisLine={AXIS_LINE_STYLE}
      tickLine={false}
      label={
        cfg?.label
          ? {
            value: cfg.label,
            position: "insideBottom",
            offset: -4,
            fill: "var(--color-zinc-400)",
            fontSize: 11,
          }
          : undefined
      }
    />
  );
}

function buildYAxis(
  cfg: ChartAxisConfig | undefined,
  yAxisId?: string,
  orientation: "left" | "right" = "left"
): React.ReactElement | null {
  if (cfg?.hide) return null;
  return (
    <YAxis
      tickFormatter={cfg?.tickFormatter}
      domain={cfg?.domain}
      tickCount={cfg?.tickCount ?? 5}
      unit={cfg?.unit}
      tick={TICK_STYLE}
      axisLine={false}
      tickLine={false}
      width={48}
      orientation={orientation}
      yAxisId={yAxisId}
      label={
        cfg?.label
          ? {
            value: cfg.label,
            angle: -90,
            position: orientation === "left" ? "insideLeft" : "insideRight",
            fill: "var(--color-zinc-400)",
            fontSize: 11,
          }
          : undefined
      }
    />
  );
}

function buildYAxes(yAxis?: ChartAxisConfig, secondYAxis?: ChartAxisConfig) {
  if (secondYAxis) {
    return (
      <>
        {buildYAxis(yAxis, "left", "left")}
        {buildYAxis(secondYAxis, "right", "right")}
      </>
    );
  }
  return buildYAxis(yAxis);
}

function buildGrid(cfg: ChartGridConfig | boolean | undefined): React.ReactElement | null {
  if (cfg === false || (typeof cfg === "object" && cfg.show === false)) return null;
  const c = typeof cfg === "object" ? cfg : {};
  return (
    <CartesianGrid
      horizontal={c.horizontal !== false}
      vertical={c.vertical === true}
      stroke="var(--color-zinc-100)"
      strokeDasharray="4 4"
    />
  );
}

function buildTooltip(cfg: ChartTooltipConfig | boolean | undefined): React.ReactElement | null {
  if (cfg === false || (typeof cfg === "object" && cfg.show === false)) return null;
  const c = typeof cfg === "object" ? cfg : {};
  const cursorStyle = { stroke: "var(--color-zinc-200)", strokeWidth: 1 };

  if (c.content) {
    const Custom = c.content;
    return <Tooltip cursor={cursorStyle} content={<Custom />} />;
  }

  return (
    <Tooltip
      cursor={cursorStyle}
      content={({ active, payload, label }) => (
        <SimpleTooltip
          active={active}
          payload={payload}
          label={label}
          formatter={c.formatter}
          labelFormatter={c.labelFormatter}
        />
      )}
    />
  );
}

function buildLegend(
  cfg: ChartLegendConfig | boolean | undefined,
  hiddenKeys?: Set<string>,
  onToggle?: (dataKey: string) => void
): React.ReactElement | null {
  if (cfg === false || (typeof cfg === "object" && cfg.show === false)) return null;
  const c = typeof cfg === "object" ? cfg : {};
  return (
    <Legend
      verticalAlign={c.position ?? "bottom"}
      align={c.align ?? "center"}
      wrapperStyle={{ fontSize: 12, color: "var(--color-zinc-500)", paddingTop: 12 }}
      iconSize={8}
      iconType="circle"
      onClick={(entry: any) => {
        const key = entry.dataKey ?? entry.value;
        if (key && onToggle) onToggle(key);
      }}
      formatter={(value: string, entry: any) => {
        const key = entry.dataKey ?? entry.value;
        const isHidden = hiddenKeys?.has(key);
        return (
          <span
            style={{
              color: isHidden ? "var(--color-zinc-300)" : "var(--color-zinc-500)",
              textDecoration: isHidden ? "line-through" : "none",
              cursor: "pointer",
            }}
          >
            {value}
          </span>
        );
      }}
    />
  );
}

function useHiddenSeries() {
  const [hidden, setHidden] = React.useState<Set<string>>(new Set());
  const toggle = React.useCallback((dataKey: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(dataKey)) next.delete(dataKey);
      else next.add(dataKey);
      return next;
    });
  }, []);
  return { hidden, toggle };
}

// ── Loading / Empty ───────────────────────────────────────────────────────────

function ChartSkeleton({ height }: { height: number }) {
  return (
    <div
      className="w-full animate-pulse rounded-xl"
      style={{ height, background: "var(--color-zinc-100)" }}
    />
  );
}

function ChartEmpty({ message, height }: { message: string; height: number }) {
  return (
    <div
      className="flex w-full items-center justify-center rounded-xl border border-dashed text-xs"
      style={{ height, borderColor: "var(--color-zinc-200)", color: "var(--color-zinc-400)" }}
    >
      {message}
    </div>
  );
}

// ── Internal responsive wrapper ───────────────────────────────────────────────

interface ChartWrapperProps {
  height: number;
  className?: string;
  loading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  ariaLabel?: string;
  children: React.ReactElement;
}

function ChartWrapper({
  height,
  className,
  loading,
  isEmpty,
  emptyMessage = "No data available",
  ariaLabel,
  children,
}: ChartWrapperProps) {
  if (loading) return <ChartSkeleton height={height} />;
  if (isEmpty) return <ChartEmpty message={emptyMessage} height={height} />;
  return (
    <div
      className={cn("w-full", className)}
      role="img"
      aria-label={ariaLabel}
    >
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

// ── LineChart ──────────────────────────────

export type LineChartProps = BaseChartProps & {
  dot?: boolean;
  activeDot?: boolean;
};

export function LineChart({
  data,
  series,
  xAxis,
  yAxis,
  secondYAxis,
  tooltip = true,
  legend,
  grid = true,
  height = 300,
  className,
  loading,
  emptyMessage,
  animated = true,
  ariaLabel,
  dot = false,
  activeDot = true,
}: LineChartProps) {
  const hasDual = !!secondYAxis;
  const { hidden, toggle } = useHiddenSeries();
  return (
    <ChartWrapper height={height} className={className} loading={loading} isEmpty={!data?.length} emptyMessage={emptyMessage} ariaLabel={ariaLabel}>
      <RLineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
        {buildGrid(grid)}
        {buildXAxis(xAxis)}
        {buildYAxes(yAxis, secondYAxis)}
        {buildTooltip(tooltip)}
        {buildLegend(legend, hidden, toggle)}
        {series.map((s, i) => {
          const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
          return (
            <Line
              key={s.dataKey}
              type={s.interpolation ?? "monotone"}
              dataKey={s.dataKey}
              name={s.name ?? s.dataKey}
              stroke={color}
              strokeWidth={2}
              strokeDasharray={s.dashed ? "6 4" : undefined}
              dot={dot ? { r: 3, fill: color } : false}
              activeDot={
                activeDot
                  ? { r: 5, stroke: color, strokeWidth: 2, fill: "var(--color-white)" }
                  : false
              }
              isAnimationActive={animated}
              hide={hidden.has(s.dataKey)}
              {...(hasDual ? { yAxisId: s.yAxisId ?? "left" } : {})}
            />
          );
        })}
      </RLineChart>
    </ChartWrapper>
  );
}

// ── BarChart ──────────────────────────────

export type BarChartProps = BaseChartProps & {
  layout?: "horizontal" | "vertical";
  rounded?: boolean;
  barSize?: number;
  barGap?: number | string;
};

export function BarChart({
  data,
  series,
  xAxis,
  yAxis,
  secondYAxis,
  tooltip = true,
  legend,
  grid = true,
  height = 300,
  className,
  loading,
  emptyMessage,
  animated = true,
  ariaLabel,
  layout = "horizontal",
  rounded = false,
  barSize,
  barGap,
}: BarChartProps) {
  const hasDual = !!secondYAxis;
  const topRadius: [number, number, number, number] = rounded ? [4, 4, 0, 0] : [0, 0, 0, 0];
  const rightRadius: [number, number, number, number] = rounded ? [0, 4, 4, 0] : [0, 0, 0, 0];
  const isVertical = layout === "vertical";
  const { hidden, toggle } = useHiddenSeries();

  return (
    <ChartWrapper height={height} className={className} loading={loading} isEmpty={!data?.length} emptyMessage={emptyMessage} ariaLabel={ariaLabel}>
      <RBarChart
        data={data}
        layout={layout}
        barSize={barSize}
        barGap={barGap}
        margin={{ top: 4, right: 4, left: 0, bottom: 4 }}
      >
        {buildGrid(grid)}
        {isVertical ? (
          <>
            <XAxis
              type="number"
              tick={TICK_STYLE}
              axisLine={AXIS_LINE_STYLE}
              tickLine={false}
              tickFormatter={yAxis?.tickFormatter}
              domain={yAxis?.domain}
              unit={yAxis?.unit}
            />
            <YAxis
              type="category"
              dataKey={xAxis?.dataKey ?? "name"}
              tick={TICK_STYLE}
              axisLine={false}
              tickLine={false}
              width={72}
            />
          </>
        ) : (
          <>
            {buildXAxis(xAxis)}
            {buildYAxes(yAxis, secondYAxis)}
          </>
        )}
        {buildTooltip(tooltip)}
        {buildLegend(legend, hidden, toggle)}
        {series.map((s, i) => {
          const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
          return (
            <Bar
              key={s.dataKey}
              dataKey={s.dataKey}
              name={s.name ?? s.dataKey}
              fill={color}
              stackId={s.stackId}
              radius={isVertical ? rightRadius : topRadius}
              isAnimationActive={animated}
              hide={hidden.has(s.dataKey)}
              {...(hasDual ? { yAxisId: s.yAxisId ?? "left" } : {})}
            />
          );
        })}
      </RBarChart>
    </ChartWrapper>
  );
}

// ── AreaChart ──────────────────────────────

export type AreaChartProps = BaseChartProps & {
  dot?: boolean;
};

export function AreaChart({
  data,
  series,
  xAxis,
  yAxis,
  secondYAxis,
  tooltip = true,
  legend,
  grid = true,
  height = 300,
  className,
  loading,
  emptyMessage,
  animated = true,
  ariaLabel,
  dot = false,
}: AreaChartProps) {
  const hasDual = !!secondYAxis;
  const { hidden, toggle } = useHiddenSeries();
  const processedSeries = series.map((s) => ({
    ...s,
    gradientFill: s.gradientFill !== false,
  }));

  return (
    <ChartWrapper height={height} className={className} loading={loading} isEmpty={!data?.length} emptyMessage={emptyMessage} ariaLabel={ariaLabel}>
      <RAreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
        <GradientDefs series={processedSeries} />
        {buildGrid(grid)}
        {buildXAxis(xAxis)}
        {buildYAxes(yAxis, secondYAxis)}
        {buildTooltip(tooltip)}
        {buildLegend(legend, hidden, toggle)}
        {processedSeries.map((s, i) => {
          const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
          return (
            <Area
              key={s.dataKey}
              type={s.interpolation ?? "monotone"}
              dataKey={s.dataKey}
              name={s.name ?? s.dataKey}
              stroke={color}
              strokeWidth={2}
              strokeDasharray={s.dashed ? "6 4" : undefined}
              fill={`url(#chart-gradient-${s.dataKey})`}
              stackId={s.stackId}
              dot={dot ? { r: 3, fill: color } : false}
              activeDot={{ r: 5, stroke: color, strokeWidth: 2, fill: "var(--color-white)" }}
              isAnimationActive={animated}
              hide={hidden.has(s.dataKey)}
              {...(hasDual ? { yAxisId: s.yAxisId ?? "left" } : {})}
            />
          );
        })}
      </RAreaChart>
    </ChartWrapper>
  );
}

// ── PieChart ──────────────────────────────

export type PieSeries = {
  dataKey: string;
  nameKey?: string;
  colors?: string[];
  innerRadius?: number | string;
  outerRadius?: number | string;
  label?: boolean;
};

export type PieChartProps = {
  data: Record<string, any>[];
  series: PieSeries;
  legend?: ChartLegendConfig | boolean;
  tooltip?: ChartTooltipConfig | boolean;
  height?: number;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  animated?: boolean;
  ariaLabel?: string;
};

function renderPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function PieChart({
  data,
  series,
  legend,
  tooltip = true,
  height = 300,
  className,
  loading,
  emptyMessage,
  animated = true,
  ariaLabel,
}: PieChartProps) {
  const colors = series.colors ?? CHART_COLORS;
  const nameKey = series.nameKey ?? "name";
  const { hidden, toggle } = useHiddenSeries();
  const coloredData = data.map((item, i) => {
    const isHidden = hidden.has((item as Record<string, any>)[nameKey]);
    return {
      ...item,
      fill: isHidden ? "transparent" : colors[i % colors.length],
      [series.dataKey]: isHidden ? 0 : item[series.dataKey],
    };
  });

  return (
    <ChartWrapper height={height} className={className} loading={loading} isEmpty={!data?.length} emptyMessage={emptyMessage} ariaLabel={ariaLabel}>
      <RPieChart margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
        {buildTooltip(tooltip)}
        {buildLegend(legend, hidden, toggle)}
        <Pie
          data={coloredData}
          dataKey={series.dataKey}
          nameKey={nameKey}
          innerRadius={series.innerRadius ?? 0}
          outerRadius={series.outerRadius ?? "70%"}
          label={series.label ? renderPieLabel : false}
          labelLine={false}
          strokeWidth={0}
          stroke="none"
          isAnimationActive={animated}
        />
      </RPieChart>
    </ChartWrapper>
  );
}

// ── DonutChart ──────────────────────────────

export type DonutChartProps = Omit<PieChartProps, "series"> & {
  series: Omit<PieSeries, "innerRadius"> & { innerRadius?: number | string };
  centerLabel?: React.ReactNode;
};

export function DonutChart({ series, centerLabel, ...rest }: DonutChartProps) {
  return (
    <div className={cn("relative", rest.className)}>
      <PieChart
        {...rest}
        className={undefined}
        series={{
          ...series,
          innerRadius: series.innerRadius ?? "55%",
          outerRadius: series.outerRadius ?? "75%",
        }}
      />
      {centerLabel && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-[2%]">
          {centerLabel}
        </div>
      )}
    </div>
  );
}

// ── RadarChart ──────────────────────────────

export type RadarSeries = {
  dataKey: string;
  name?: string;
  color?: string;
  fill?: boolean;
  fillOpacity?: number;
};

export type RadarChartProps = {
  data: Record<string, any>[];
  series: RadarSeries[];
  angleKey?: string;
  tooltip?: ChartTooltipConfig | boolean;
  legend?: ChartLegendConfig | boolean;
  height?: number;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  outerRadius?: number | string;
  animated?: boolean;
  ariaLabel?: string;
};

export function RadarChart({
  data,
  series,
  angleKey = "subject",
  tooltip = true,
  legend,
  height = 300,
  className,
  loading,
  emptyMessage,
  outerRadius = "70%",
  animated = true,
  ariaLabel,
}: RadarChartProps) {
  const { hidden, toggle } = useHiddenSeries();
  return (
    <ChartWrapper height={height} className={className} loading={loading} isEmpty={!data?.length} emptyMessage={emptyMessage} ariaLabel={ariaLabel}>
      <RRadarChart data={data} outerRadius={outerRadius} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
        <PolarGrid stroke="var(--color-zinc-200)" />
        <PolarAngleAxis dataKey={angleKey} tick={{ fill: "var(--color-zinc-500)", fontSize: 11 }} tickLine={false} />
        <PolarRadiusAxis tick={{ fill: "var(--color-zinc-400)", fontSize: 10 }} axisLine={false} tickLine={false} />
        {buildTooltip(tooltip)}
        {buildLegend(legend, hidden, toggle)}
        {series.map((s, i) => {
          const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
          return (
            <Radar
              key={s.dataKey}
              name={s.name ?? s.dataKey}
              dataKey={s.dataKey}
              stroke={color}
              fill={s.fill !== false ? color : "none"}
              fillOpacity={s.fillOpacity ?? 0.15}
              isAnimationActive={animated}
              hide={hidden.has(s.dataKey)}
            />
          );
        })}
      </RRadarChart>
    </ChartWrapper>
  );
}

// ── RadialChart ──────────────────────────────

export type RadialSeries = {
  dataKey: string;
  nameKey?: string;
  colors?: string[];
  innerRadius?: number | string;
  outerRadius?: number | string;
  label?: boolean;
};

export type RadialChartProps = {
  data: Record<string, any>[];
  series: RadialSeries;
  legend?: ChartLegendConfig | boolean;
  tooltip?: ChartTooltipConfig | boolean;
  height?: number;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  startAngle?: number;
  endAngle?: number;
  centerLabel?: React.ReactNode;
  animated?: boolean;
  ariaLabel?: string;
};

export function RadialChart({
  data,
  series,
  legend,
  tooltip = true,
  height = 300,
  className,
  loading,
  emptyMessage,
  startAngle = 90,
  endAngle = -270,
  centerLabel,
  animated = true,
  ariaLabel,
}: RadialChartProps) {
  const colors = series.colors ?? CHART_COLORS;
  const nameKey = series.nameKey ?? "name";
  const { hidden, toggle } = useHiddenSeries();
  const coloredData = data.map((item, i) => {
    const isHidden = hidden.has((item as Record<string, any>)[nameKey]);
    return {
      ...item,
      fill: isHidden ? "transparent" : colors[i % colors.length],
      [series.dataKey]: isHidden ? 0 : item[series.dataKey],
    };
  });

  return (
    <div className={cn("relative", className)}>
      <ChartWrapper height={height} loading={loading} isEmpty={!data?.length} emptyMessage={emptyMessage} ariaLabel={ariaLabel}>
        <RRadialBarChart
          data={coloredData}
          innerRadius={series.innerRadius ?? "30%"}
          outerRadius={series.outerRadius ?? "90%"}
          startAngle={startAngle}
          endAngle={endAngle}
          margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
        >
          {buildTooltip(tooltip)}
          {buildLegend(legend, hidden, toggle)}
          <RadialBar
            dataKey={series.dataKey}
            cornerRadius={4}
            background={{ fill: "var(--color-zinc-100)" }}
            isAnimationActive={animated}
          >
            {series.label && (
              <LabelList
                dataKey={series.nameKey ?? "name"}
                position="insideStart"
                fill="white"
                fontSize={11}
                fontWeight={600}
              />
            )}
          </RadialBar>
        </RRadialBarChart>
      </ChartWrapper>
      {centerLabel && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {centerLabel}
        </div>
      )}
    </div>
  );
}
