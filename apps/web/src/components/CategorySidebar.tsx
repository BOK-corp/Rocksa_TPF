import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@rocksa/ui";
import {
  ChartIcon,
  DiamondIcon,
  DocIcon,
  TriangleIcon,
  VolcanoIcon,
} from "./Icons.tsx";

const ICONS: Record<string, typeof DiamondIcon> = {
  igneous: VolcanoIcon,
  metamorphic: DiamondIcon,
  sedimentary: TriangleIcon,
  crystals: DiamondIcon,
};

const ITEMS = [
  { slug: "igneous", label: "Igneous" },
  { slug: "metamorphic", label: "Metamorphic" },
  { slug: "sedimentary", label: "Sedimentary" },
  { slug: "crystals", label: "Crystals" },
] as const;

interface ExtraLink {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  to: any;
  icon?: typeof DiamondIcon;
}

interface Props {
  heading?: string;
  subheading?: string;
  extra?: ExtraLink[];
  open?: boolean;
  onClose?: () => void;
}

const navClass = (active: boolean) =>
  cn(
    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
    active
      ? "bg-brand-600 text-white"
      : "text-ink-700 hover:bg-brand-50",
  );

const isPathActive = (pathname: string, target: string): boolean => {
  if (target.startsWith("/c/")) {
    return pathname === target || pathname.startsWith(`${target}/`);
  }
  return pathname === target || pathname.startsWith(`${target}/`);
};

export const CategorySidebar = ({
  heading = "The Collection",
  subheading = "Curator's Workspace",
  extra,
  open = false,
  onClose,
}: Props) => {
  const { pathname } = useLocation();

  return (
    <aside
      className={cn(
        "fixed top-16 bottom-0 z-50 w-60 shrink-0 overflow-y-auto border-r border-ink-700/5 bg-surface-muted p-6 transition-transform duration-200 md:static md:top-auto md:z-auto md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="mb-8">
        <p className="font-display text-xl text-ink-900">{heading}</p>
        <p className="mt-1 text-xs uppercase tracking-wider text-ink-500">
          {subheading}
        </p>
      </div>
      <nav className="space-y-1">
        {ITEMS.map((it) => {
          const Icon = ICONS[it.slug] ?? DiamondIcon;
          const to = `/c/${it.slug}`;
          const active = isPathActive(pathname, to);
          return (
            <Link
              key={it.slug}
              to="/c/$category"
              params={{ category: it.slug }}
              className={navClass(active)}
              onClick={onClose}
            >
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
        {extra?.map((it) => {
          const Icon = it.icon ?? DocIcon;
          const active = isPathActive(pathname, it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={navClass(active)}
              onClick={onClose}
            >
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export const WorkspaceSidebar = (props: Pick<Props, "open" | "onClose">) => (
  <CategorySidebar
    {...props}
    extra={[
      { label: "Reports", to: "/workspace/reports", icon: DocIcon },
      { label: "Analytics", to: "/workspace/analytics", icon: ChartIcon },
    ]}
  />
);
