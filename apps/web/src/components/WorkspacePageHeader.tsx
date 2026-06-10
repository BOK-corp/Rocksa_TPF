import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const WorkspacePageHeader = ({ title, subtitle, action }: Props) => (
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div className="min-w-0">
      <h1 className="font-display text-5xl">{title}</h1>
      {subtitle && <p className="mt-1 text-ink-500">{subtitle}</p>}
    </div>
    {action}
  </div>
);
