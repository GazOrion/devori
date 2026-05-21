const DEFAULT_SITE_URL = "https://dev-ori.ru";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, "");
}

export function absoluteUrl(pathname: string): string {
  const base = getSiteUrl();
  if (pathname === "/") return `${base}/`;
  return `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
