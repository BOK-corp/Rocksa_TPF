import { Link, useNavigate } from "@tanstack/react-router";
import { Avatar, Button, Input } from "@rocksa/ui";
import { useAuth } from "@rocksa/auth";
import { BellIcon, CartIcon, HelpIcon, MenuIcon, SearchIcon } from "./Icons.tsx";
import { useCart } from "../state/cart.tsx";

interface Props {
  variant?: "full" | "minimal";
  showMenuButton?: boolean;
  onMenuClick?: () => void;
}

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

export const TopNav = ({
  variant = "full",
  showMenuButton = false,
  onMenuClick,
}: Props) => {
  const { count } = useCart();
  const { user, status, signOut } = useAuth();
  const navigate = useNavigate();

  if (variant === "minimal") {
    return (
      <header className="border-b border-ink-700/5 bg-surface-muted">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="font-display text-2xl text-brand-600">
            Rocksa
          </Link>
          <Link to="/cart" className="flex items-center gap-2 text-sm text-ink-500">
            Cancel <span aria-hidden>✕</span>
          </Link>
        </div>
      </header>
    );
  }

  const authed = status === "authed";
  const label = user?.displayName ?? user?.email ?? null;

  return (
    <header className="border-b border-ink-700/5 bg-surface-muted">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 md:gap-6 md:px-6">
        {showMenuButton && (
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-brand-600 hover:bg-brand-50 md:hidden"
            aria-label="Open navigation menu"
            onClick={onMenuClick}
          >
            <MenuIcon />
          </button>
        )}
        <Link to="/" className="font-display text-2xl text-brand-600">
          Rocksa
        </Link>

        <div className="relative mx-auto hidden max-w-xl flex-1 md:block">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <Input placeholder="Search collection…" className="pl-10 bg-white/80 border-ink-700/5" />
        </div>

        <nav className="flex items-center gap-2 text-brand-600">
          <Link
            to="/cart"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-brand-50"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] text-white">
                {count}
              </span>
            )}
          </Link>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-brand-50">
            <BellIcon />
          </button>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-brand-50">
            <HelpIcon />
          </button>
          {authed && (
            <Avatar fallback={initials(label)} className="ml-1" title={label ?? undefined} />
          )}
        </nav>

        {authed ? (
          <Button
            size="sm"
            variant="secondary"
            className="hidden md:inline-flex"
            onClick={async () => {
              await signOut();
              navigate({ to: "/" });
            }}
          >
            Sign Out
          </Button>
        ) : (
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link to="/auth/login">Sign In</Link>
          </Button>
        )}
      </div>
    </header>
  );
};
