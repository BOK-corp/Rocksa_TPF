import { Link } from "@tanstack/react-router";
import { Avatar } from "@rocksa/ui";
import { useAuth } from "@rocksa/auth";
import { useCartCount } from "@rocksa/cart";
import { CartIcon } from "./Icons.tsx";

const NAV_LINKS = [
  { label: "Collections", to: "/" as const },
  { label: "Custom Design", href: "#" },
  { label: "Investment", href: "#" },
  { label: "Journal", href: "#" },
] as const;

const initials = (name: string | null | undefined): string => {
  if (!name) return "JC";
  return (
    name
      .split(/\s+/)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "JC"
  );
};

export const StorefrontNav = () => {
  const count = useCartCount();
  const { user, status } = useAuth();
  const authed = status === "authed";
  const label = user?.displayName ?? user?.email ?? null;

  return (
    <header className="border-b border-ink-700/5 bg-surface-muted">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        <Link to="/" className="font-display text-2xl text-brand-600">
          Rocksa
        </Link>
        <nav className="hidden items-center gap-8 font-display text-lg md:flex">
          {NAV_LINKS.map((link) =>
            "to" in link ? (
              <Link key={link.label} to={link.to} className="text-ink-900">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className="text-ink-500">
                {link.label}
              </a>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-brand-600 hover:bg-brand-50"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] text-white">
                {count}
              </span>
            )}
          </Link>
          {authed ? (
            <Avatar fallback={initials(label)} title={label ?? undefined} />
          ) : (
            <Link
              to="/auth/login"
              className="text-sm font-medium text-brand-600 hover:underline"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
