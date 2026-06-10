const SCROLL_KEY = "rocksa.listing-scroll";

export const saveListingScroll = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
};

export const restoreListingScroll = (): void => {
  if (typeof window === "undefined") return;
  const raw = sessionStorage.getItem(SCROLL_KEY);
  if (!raw) return;
  sessionStorage.removeItem(SCROLL_KEY);
  const y = Number(raw);
  if (!Number.isFinite(y)) return;
  requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" }));
};
