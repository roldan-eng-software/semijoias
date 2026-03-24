import * as React from "react"
import { cn } from "./Button"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "gold" | "blush"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide",
        {
          "bg-champagne text-dark-plum": variant === "default",
          "bg-green-100 text-green-800": variant === "success",
          "bg-amber-100 text-amber-800": variant === "warning",
          "bg-red-100 text-red-800": variant === "error",
          "bg-gold-light text-dark-plum": variant === "gold",
          "bg-blush text-dark-plum": variant === "blush",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
