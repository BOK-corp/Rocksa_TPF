import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "./cn.ts";

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-xs font-medium uppercase tracking-wider text-ink-500",
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = "Label";
