import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* THEME */
/* ------------------------------------------------------------------ */

const THEMES = { light: "", dark: ".dark" } as const

/* ------------------------------------------------------------------ */
/* CONFIG TYPE */
/* ------------------------------------------------------------------ */

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

/* ------------------------------------------------------------------ */
/* CONTEXT */
/* ------------------------------------------------------------------ */

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within <ChartContainer />")
  }
  return context
}

/* ------------------------------------------------------------------ */
/* CONTAINER */
/* ------------------------------------------------------------------ */

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ReactNode
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-layer]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

/* ------------------------------------------------------------------ */
/* STYLE */
/* ------------------------------------------------------------------ */

const ChartStyle = ({
  id,
  config,
}: {
  id: string
  config: ChartConfig
}) => {
  const colorConfig = Object.entries(config).filter(
    ([, c]) => c.theme || c.color
  )

  if (!colorConfig.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => {
            return `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color =
      item.theme?.[theme as keyof typeof item.theme] || item.color
    return color ? `  --color-${key}: ${color};` : ""
  })
  .join("\n")}
}
`
          })
          .join("\n"),
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/* TOOLTIP (FULL FIXED) */
/* ------------------------------------------------------------------ */

const ChartTooltip = RechartsPrimitive.Tooltip

type TooltipItem = {
  name?: string
  value?: any
  dataKey?: string
  color?: string
  payload?: any
}

type ChartTooltipContentProps = {
  active?: boolean
  payload?: TooltipItem[]
  label?: any
  labelFormatter?: (value: any, payload?: TooltipItem[]) => React.ReactNode
  indicator?: "dot" | "line" | "dashed"
  hideLabel?: boolean
  hideIndicator?: boolean
  className?: string
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
}: ChartTooltipContentProps) {
  const { config } = useChart()

  if (!active || !payload?.length) return null

  const renderedLabel =
    !hideLabel && label ? (
      <div className="font-medium">
        {labelFormatter ? labelFormatter(label, payload) : String(label)}
      </div>
    ) : null

  return (
    <div
      className={cn(
        "rounded-lg border bg-background px-3 py-2 text-xs shadow-xl",
        className
      )}
    >
      {renderedLabel}

      <div className="grid gap-1.5">
        {payload.map((item, i) => {
          const color =
            item.color || item.payload?.fill || "#888"

          return (
            <div
              key={i}
              className="flex items-center justify-between gap-2"
            >
              {!hideIndicator && (
                <div
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: color }}
                />
              )}

              <span className="text-muted-foreground">
                {item.name}
              </span>

              <span className="font-mono">
                {String(item.value)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* LEGEND (FULL FIXED - NO RECHARTS TYPES) */
/* ------------------------------------------------------------------ */

const ChartLegend = RechartsPrimitive.Legend

type LegendItem = {
  value?: string
  dataKey?: string
  color?: string
}

function ChartLegendContent({
  payload,
  className,
}: {
  payload?: LegendItem[]
  className?: string
}) {
  if (!payload?.length) return null

  return (
    <div className={cn("flex gap-4", className)}>
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* EXPORTS */
/* ------------------------------------------------------------------ */

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (!payload || typeof payload !== "object") return undefined
  return config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}