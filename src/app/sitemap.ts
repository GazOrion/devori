import type { MetadataRoute } from "next";

import { discoverAppRoutes } from "@/lib/discover-app-routes";
import { absoluteUrl } from "@/lib/site-url";

function getChangeFrequency(pathname: string): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (pathname === "/") return "weekly";
  return "monthly";
}

function getPriority(pathname: string): number {
  if (pathname === "/") return 1;
  if (pathname === "/dizayn-intererov") return 0.85;
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return discoverAppRoutes().map(({ pathname, lastModified }) => ({
    url: absoluteUrl(pathname),
    lastModified,
    changeFrequency: getChangeFrequency(pathname),
    priority: getPriority(pathname),
  }));
}
