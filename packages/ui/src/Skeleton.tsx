import type { HTMLAttributes } from "react";
import { cn } from "./cn.ts";

export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("animate-pulse rounded-md bg-ink-700/5", className)}
    {...props}
  />
);
