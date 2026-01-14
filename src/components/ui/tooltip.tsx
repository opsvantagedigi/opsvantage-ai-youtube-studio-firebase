import * as React from "react"
import { cn } from "@/lib/utils"

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>
}

export function TooltipTrigger({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>
}

export function TooltipContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("absolute z-20 rounded bg-black text-white p-2 text-xs", className)} {...props} />
}
