import * as React from "react"
import { cn } from "@/lib/utils"

export function Sheet({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function SheetTrigger({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>
}

export function SheetContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("fixed right-0 top-0 h-full w-80 bg-background shadow-lg z-50", className)} {...props} />
}
