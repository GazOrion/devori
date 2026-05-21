import fs from "node:fs";
import path from "node:path";

export type DiscoveredRoute = {
  pathname: string;
  lastModified: Date;
};

const APP_DIR = path.join(process.cwd(), "src/app");
const PAGE_FILES = new Set(["page.tsx", "page.ts", "page.jsx", "page.js"]);

function isRoutableSegment(segment: string): boolean {
  return (
    segment.length > 0 &&
    !segment.startsWith("_") &&
    !segment.startsWith("(") &&
    !segment.startsWith("[")
  );
}

function pathnameFromSegments(segments: string[]): string {
  if (segments.length === 0) return "/";
  return `/${segments.join("/")}`;
}

function discoverRoutesInDirectory(
  directory: string,
  segments: string[] = [],
): DiscoveredRoute[] {
  if (!fs.existsSync(directory)) return [];

  const routes: DiscoveredRoute[] = [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !PAGE_FILES.has(entry.name)) continue;

    const pagePath = path.join(directory, entry.name);
    routes.push({
      pathname: pathnameFromSegments(segments),
      lastModified: fs.statSync(pagePath).mtime,
    });
    break;
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || !isRoutableSegment(entry.name)) continue;

    routes.push(
      ...discoverRoutesInDirectory(path.join(directory, entry.name), [...segments, entry.name]),
    );
  }

  return routes.sort((a, b) => a.pathname.localeCompare(b.pathname));
}

export function discoverAppRoutes(): DiscoveredRoute[] {
  return discoverRoutesInDirectory(APP_DIR);
}
