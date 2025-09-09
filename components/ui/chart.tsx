// This is a placeholder for shadcn/ui chart components.
// In a real project, you would install these via `npx shadcn@latest add chart`.
// For this example, we assume they are available.
// You might need to add the actual content if you encounter issues.

import * as React from "react"
import { cn } from "@/lib/utils"
import { TooltipProps } from "recharts"
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

const ChartContext = React.createContext<
  | {
      config: Record<string, { label?: string; color?: string }>
    }
  | undefined
>(undefined)

function ChartContainer({
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: Record<string, { label?: string; color?: string }>
}) {
  const id = React.useId()
  const containerRef = React.useRef<HTMLDivElement>(null)

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={id}
        ref={containerRef}
        className={cn(
          "flex h-[400px] w-full flex-col [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-dot]:fill-primary [&_.recharts-active-dot]:stroke-background [&_.recharts-tooltip-content]:rounded-md [&_.recharts-tooltip-content]:border-border [&_.recharts-tooltip-content]:bg-background [&_.recharts-tooltip-content]:font-sans [&_.recharts-tooltip-content]:text-foreground [&_[data-orientation=bottom]]:translate-y-1 [&_[data-orientation=left]]:-translate-x-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
}

function ChartTooltip(props: TooltipProps<ValueType, NameType>) {
  return <ChartTooltipContent {...props} />
}

type TooltipItem = {
  name?: string | number
  value?: string | number
  color?: string
  dataKey?: string | number
}

type ChartTooltipContentProps = {
  active?: boolean
  payload?: TooltipItem[]
  label?: string | number
  hideLabel?: boolean
  hideIndicator?: boolean
  className?: string
}

function ChartTooltipContent(props: ChartTooltipContentProps) {
  const { active, payload, label, hideLabel = false, hideIndicator = false, className } = props
  const chartConfig = React.useContext(ChartContext)

  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "rounded-md border bg-popover p-2 text-popover-foreground shadow-md",
        className
      )}
    >
      {!hideLabel && label ? (
        <div className="mb-1 text-sm font-medium">{label}</div>
      ) : null}
      <div className="grid gap-1.5">
        {payload.map((item: TooltipItem, i: number) => {
          const { name, value, color } = item
          if (!chartConfig?.config[name as string]) {
            return null
          }

          return (
            <div
              key={item.dataKey || i}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                {!hideIndicator && (
                  <span
                    className="size-3 rounded-full"
                    style={{
                      backgroundColor:
                        color || chartConfig?.config[name as string]?.color,
                    }}
                  />
                )}
                <span className="text-muted-foreground">
                  {chartConfig?.config[name as string]?.label || name}
                </span>
              </div>
              <span className="font-medium text-foreground">{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }
