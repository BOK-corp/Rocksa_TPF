import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from "react";
import { cn } from "./cn.ts";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export const SheetContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    title?: string;
    description?: string;
  }
>(({ className, children, title, description, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-ink-700/10 bg-white shadow-card focus:outline-none",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between border-b border-ink-700/5 px-6 py-5">
        <div>
          {title && (
            <DialogPrimitive.Title className="font-display text-2xl">
              {title}
            </DialogPrimitive.Title>
          )}
          {description && (
            <DialogPrimitive.Description className="mt-1 text-sm text-ink-500">
              {description}
            </DialogPrimitive.Description>
          )}
        </div>
        <DialogPrimitive.Close className="rounded-full p-1 text-ink-500 hover:bg-brand-50 hover:text-brand-600">
          <span aria-hidden>✕</span>
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";

export const SheetFooter = ({ children }: { children: ReactNode }) => (
  <div className="mt-6 flex justify-end gap-2 border-t border-ink-700/5 pt-4">
    {children}
  </div>
);
