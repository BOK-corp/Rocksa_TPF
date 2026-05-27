import { type HTMLAttributes } from "react";
import { cn } from "./cn.ts";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const Avatar = ({ src, alt, fallback, className, ...props }: AvatarProps) => (
  <div
    className={cn(
      "inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-xs font-medium text-brand-700",
      className,
    )}
    {...props}
  >
    {src ? <img src={src} alt={alt ?? ""} className="h-full w-full object-cover" /> : fallback}
  </div>
);
