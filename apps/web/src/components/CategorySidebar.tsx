import { Link, useLocation } from "@tanstack/react-router";
import { DiamondIcon, TriangleIcon, VolcanoIcon, DocIcon, ChartIcon } from "./Icons.tsx";

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
}

export const CategorySidebar = ({
  heading = "The Collection",
  subheading = "Curator's Workspace",
  extra,
}: Props) => {
  const { pathname } = useLocation();

  return (
    <aside className="w-60 shrink-0 border-r border-ink-700/5 bg-surface-muted p-6">
      <div className="mb-8">
        <p className="font-display text-xl text-ink-900">{heading}</p>
        <p className="text-xs uppercase tracking-wider text-ink-500 mt-1">{subheading}</p>
      </div>
      <nav className="space-y-1">
        {ITEMS.map((it) => {
          const Icon = ICONS[it.slug] ?? DiamondIcon;
          const to = `/c/${it.slug}`;
          const active = pathname.startsWith(to);
          return (
            <Link
              key={it.slug}
              to="/c/$category"
              params={{ category: it.slug }}
              className={
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors " +
                (active ? "bg-brand-600 text-white" : "text-ink-700 hover:bg-brand-50")
              }
            >
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
        {extra?.map((it) => {
          const Icon = it.icon ?? DocIcon;
          const active = pathname === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors " +
                (active ? "bg-brand-600 text-white" : "text-ink-700 hover:bg-brand-50")
              }
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

export const WorkspaceSidebar = () => (
  <CategorySidebar
    extra={[
      { label: "Orders", to: "/orders", icon: DocIcon },
      { label: "Reports", to: "/workspace/reports", icon: DocIcon },
      { label: "Analytics", to: "/workspace/analytics", icon: ChartIcon },
    ]}
  />
);
