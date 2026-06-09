import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "./cn.ts";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "boxed" | "underline";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "boxed", ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full bg-transparent text-ink-900 placeholder:text-ink-400 focus-visible:outline-none",
        variant === "boxed" &&
          "h-11 rounded-md border border-ink-700/10 bg-white px-3 focus-visible:border-brand-500",
        variant === "underline" && "h-10 border-b border-ink-700/15 focus-visible:border-brand-600",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
