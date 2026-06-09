import type { SVGProps, ReactNode } from "react";
import { cn } from "@rocksa/ui";

type Props = SVGProps<SVGSVGElement>;

const Svg = ({ className, children, ...rest }: Props & { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    {...rest}
    className={cn("h-5 w-5", className)}
  >
    {children}
  </svg>
);

export const SearchIcon = (p: Props) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" strokeLinecap="round" />
  </Svg>
);

export const CartIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M3 4h2l2 12h12l2-8H7" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
  </Svg>
);

export const BellIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16Z" strokeLinejoin="round" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </Svg>
);

export const HelpIcon = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7" strokeLinecap="round" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" />
  </Svg>
);

export const DiamondIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M6 9 12 4l6 5-6 11Z" strokeLinejoin="round" />
    <path d="M6 9h12" />
  </Svg>
);

export const ChevronIcon = (p: Props) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ArrowRightIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const PlusIcon = (p: Props) => (
  <Svg {...p} strokeWidth={2}>
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </Svg>
);

export const CloseIcon = (p: Props) => (
  <Svg {...p}>
    <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
  </Svg>
);

export const StarIcon = (p: Props) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="m12 2 2.6 6.5 7 .6-5.3 4.6 1.7 6.8L12 16.9 5.9 20.5l1.7-6.8L2.3 9.1l7-.6Z" />
  </Svg>
);

export const ShareIcon = (p: Props) => (
  <Svg {...p}>
    <circle cx="6" cy="12" r="2.4" />
    <circle cx="18" cy="6" r="2.4" />
    <circle cx="18" cy="18" r="2.4" />
    <path d="m8 11 8-4M8 13l8 4" />
  </Svg>
);

export const ShieldIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M12 3 5 6v6c0 4.5 3 8 7 9 4-1 7-4.5 7-9V6l-7-3Z" strokeLinejoin="round" />
    <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const TruckIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </Svg>
);

export const VaultIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M3 21V9l9-5 9 5v12M3 21h18M9 21v-7h6v7" strokeLinejoin="round" />
  </Svg>
);

export const ChartIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M4 19V5m0 14h16M8 16v-3m4 3V9m4 7v-5" strokeLinecap="round" />
  </Svg>
);

export const VolcanoIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M3 20 9 9h6l6 11Z" strokeLinejoin="round" />
    <path d="M11 9V5m2 1.5L15 4" strokeLinecap="round" />
  </Svg>
);

export const TriangleIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M12 4 22 20H2Z" strokeLinejoin="round" />
  </Svg>
);

export const DocIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M6 3h9l4 4v14H6Z" strokeLinejoin="round" />
    <path d="M14 3v5h5M9 13h7M9 17h7" strokeLinecap="round" />
  </Svg>
);

export const LockIcon = (p: Props) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 1 1 8 0v3" />
  </Svg>
);

export const MailIcon = (p: Props) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Svg>
);
