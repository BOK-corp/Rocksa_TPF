import * as SelectPrimitive from "@radix-ui/react-select";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "./cn.ts";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex h-10 w-full items-center justify-between rounded-md border border-ink-700/10 bg-white px-3 text-sm",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon>
      <svg
        viewBox="0 0 16 16"
        className="h-4 w-4 text-ink-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

export const SelectContent = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position="popper"
      sideOffset={4}
      className={cn(
        "z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-ink-700/10 bg-white shadow-card",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

export const SelectItem = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-brand-50 data-[state=checked]:text-brand-600",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";
