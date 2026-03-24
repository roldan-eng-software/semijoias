import * as React from "react"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-rose-gold text-white hover:bg-rose-gold-dark active:scale-[0.98]":
              variant === "primary",
            "bg-dark-plum text-white hover:bg-dark-plum-light active:scale-[0.98]":
              variant === "secondary",
            "border-2 border-rose-gold bg-transparent text-rose-gold hover:bg-rose-gold hover:text-white active:scale-[0.98]":
              variant === "outline",
            "bg-transparent text-dark-plum hover:bg-champagne active:scale-[0.98]":
              variant === "ghost",
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, cn }
