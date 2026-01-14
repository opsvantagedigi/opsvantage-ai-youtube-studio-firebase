import * as React from "react"
import { cn } from "@/lib/utils"

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)} {...props} />
}

export function SelectTrigger({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center border rounded-md px-3 py-2", className)} {...props} />
}

export function SelectContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("absolute z-10 mt-1 w-full rounded-md bg-background shadow-lg", className)} {...props} />
}

export function SelectItem({ className, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) {
  return <option className={cn("py-2 px-3 hover:bg-accent", className)} {...props} />
}

export function SelectValue({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("flex-1 text-left", className)} {...props} />
}
