import type { MouseEvent } from "react";

const DEFAULT_HEADER_OFFSET_PX = 88;

export function getScrollHeaderOffset() {
  if (typeof document === "undefined") return DEFAULT_HEADER_OFFSET_PX;

  const nav = document.querySelector<HTMLElement>("nav.sticky, header.sticky");
  return nav ? Math.ceil(nav.getBoundingClientRect().height) + 8 : DEFAULT_HEADER_OFFSET_PX;
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersSmoothScroll() ? "smooth" : "auto" });
}

export function scrollToHash(hash: string, offsetPx = getScrollHeaderOffset()) {
  if (!hash.startsWith("#")) return false;

  const id = decodeURIComponent(hash.slice(1));
  if (!id) {
    scrollToTop();
    return true;
  }

  const target = document.getElementById(id);
  if (!target) return false;

  const top = target.getBoundingClientRect().top + window.scrollY - offsetPx;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersSmoothScroll() ? "smooth" : "auto",
  });

  return true;
}

function prefersSmoothScroll() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function handleInPageAnchorClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string | undefined,
) {
  if (!href?.startsWith("#")) return false;
  if (window.location.pathname !== "/") return false;

  event.preventDefault();
  const ok = scrollToHash(href);
  if (ok) {
    window.history.pushState(null, "", href);
  }
  return ok;
}
