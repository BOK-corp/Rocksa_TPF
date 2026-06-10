import { afterEach, describe, expect, it, vi } from "vitest";
import { restoreListingScroll, saveListingScroll } from "./listing-scroll.ts";

describe("listing scroll preservation", () => {
  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("saves and restores scroll position", () => {
    Object.defineProperty(window, "scrollY", { value: 420, writable: true });
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });

    saveListingScroll();
    restoreListingScroll();

    expect(scrollTo).toHaveBeenCalledWith({ top: 420, behavior: "instant" });
    expect(sessionStorage.getItem("rocksa.listing-scroll")).toBeNull();
  });
});
