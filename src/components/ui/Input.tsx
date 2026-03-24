import * as React from "react"
import { cn } from "./Button"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-dark-plum">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border border-champagne bg-white px-4 py-2 text-sm text-dark-plum ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-mauve focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
