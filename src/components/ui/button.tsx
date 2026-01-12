import * as React from "react"

// Local `cn` utility to avoid dependency on aliased import during build/type-check
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "sm", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
          variant === "outline" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          variant === "ghost" && "bg-transparent hover:bg-accent hover:text-accent-foreground",
          size === "sm" && "h-9 px-4 py-2",
          size === "lg" && "h-11 px-8 py-3 text-base",
          size === "icon" && "h-9 w-9 p-0",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
export { Button }
