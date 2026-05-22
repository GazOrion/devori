"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import sectionHeading from "@/components/ui/section-heading.module.css";
import { cn } from "@/lib/utils";

type ProcessItem = {
  step: string;
  title: string;
  description: string;
  bullets: string[];
};

type ProcessScrollCardsProps = {
  items: ProcessItem[];
};

/** Скролл на участок линии между соседними пунктами после центрирования (больше = медленнее линия). */
const SCROLL_PX_BETWEEN_NODES = 460;

function subscribeMq(callback: () => void) {
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribeMq,
    () => window.matchMedia("(min-width: 768px)").matches,
    () => false,
  );
}

/** Mobile: vertical line through alternating sides. */
function buildVerticalZigzagPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  const sameX = points.every((p) => Math.abs(p.x - points[0].x) < 0.5);
  if (sameX) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const cur = points[i]!;
    const midY = (prev.y + cur.y) / 2;
    d += ` L ${prev.x} ${midY} L ${cur.x} ${midY} L ${cur.x} ${cur.y}`;
  }
  return d;
}

/**
 * Desktop snake: orthogonal path left↔right with smooth Q corners (like the reference).
 */
/** Arc length along `path` closest to (x, y) — used to sync step reveal with drawn stroke. */
function arcLengthClosestToPoint(path: SVGPathElement, x: number, y: number): number {
  const L = path.getTotalLength();
  if (L <= 0) return 0;

  let bestS = 0;
  let bestD = Infinity;
  const coarse = Math.max(3, Math.floor(L / 320));

  for (let s = 0; s <= L; s += coarse) {
    const p = path.getPointAtLength(s);
    const d2 = (p.x - x) ** 2 + (p.y - y) ** 2;
    if (d2 < bestD) {
      bestD = d2;
      bestS = s;
    }
  }

  const span = coarse * 2;
  for (let s = Math.max(0, bestS - span); s <= Math.min(L, bestS + span); s += 0.5) {
    const p = path.getPointAtLength(s);
    const d2 = (p.x - x) ** 2 + (p.y - y) ** 2;
    if (d2 < bestD) {
      bestD = d2;
      bestS = s;
    }
  }

  return bestS;
}

function smoothstep01(t: number, a: number, b: number): number {
  if (t <= a) return 0;
  if (t >= b) return 1;
  const x = (t - a) / (b - a);
  return x * x * (3 - 2 * x);
}

function buildSnakePathQuadratic(
  points: { x: number; y: number }[],
  rBase: number,
): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const cur = points[i]!;
    const px = prev.x;
    const py = prev.y;
    const cx = cur.x;
    const cy = cur.y;
    const midY = (py + cy) / 2;

    const hDir = cx >= px ? 1 : -1;
    if (Math.abs(midY - py) < 0.5) {
      d += ` L ${cx} ${cy}`;
      continue;
    }

    const vToMid = midY > py ? 1 : -1;
    const vToEnd = cy > midY ? 1 : cy < midY ? -1 : 0;

    const r = Math.max(
      4,
      Math.min(
        rBase,
        Math.abs(midY - py) * 0.4,
        Math.abs(cy - midY) * 0.4,
        Math.abs(cx - px) * 0.22,
      ),
    );

    d += ` L ${px} ${midY - vToMid * r}`;
    d += ` Q ${px} ${midY} ${px + hDir * r} ${midY}`;
    d += ` L ${cx - hDir * r} ${midY}`;
    if (vToEnd !== 0) {
      d += ` Q ${cx} ${midY} ${cx} ${midY + vToEnd * r}`;
      d += ` L ${cx} ${cy}`;
    } else {
      d += ` L ${cx} ${cy}`;
    }
  }
  return d;
}

function StepCopy({
  item,
  contentRef,
  align,
}: {
  item: ProcessItem;
  contentRef: (node: HTMLDivElement | null) => void;
  align: "left" | "right";
}) {
  return (
    <div
      ref={contentRef}
      className={cn(
        "min-w-0 max-w-xl lg:max-w-2xl",
        align === "left" ? "text-left" : "text-right",
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#9ecfff]">
        {item.step}
      </p>
      <h3 className="mt-3 text-[1.45rem] font-semibold leading-[1.02] tracking-[-0.05em] text-white md:text-[1.55rem] lg:text-[1.65rem]">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-white/70">{item.description}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/42">
        {item.bullets.join(" • ")}
      </p>
    </div>
  );
}

export function ProcessScrollCards({ items }: ProcessScrollCardsProps) {
  const nodeCount = items.length;
  const isDesktop = useIsDesktop();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const circleRefs = useRef<Array<HTMLDivElement | null>>([]);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const trackPathRef = useRef<SVGPathElement | null>(null);
  const fillPathRef = useRef<SVGPathElement | null>(null);
  const linePhaseTriggersRef = useRef<ScrollTrigger[]>([]);
  /** Distance from path start to each node (aligned with circleRefs order). */
  const nodeDistancesRef = useRef<number[]>([]);
  const pathLengthRef = useRef(0);
  const pSplitRef = useRef(0.42);
  const pinScrollPxRef = useRef(460);

  const applyStepRevealFromProgress = useCallback((progress: number) => {
    const len = pathLengthRef.current;
    if (len <= 0) return;

    if (progress >= 1 - 1e-6) {
      contentRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 1, y: 0 });
      });
      circleRefs.current.forEach((el) => {
        if (el) {
          gsap.set(el, {
            opacity: 1,
            scale: 1,
            transformOrigin: "50% 50%",
          });
        }
      });
      return;
    }

    const head = len * progress;
    const distances = nodeDistancesRef.current;
    const lead = Math.min(140, len * 0.14);
    const trail = Math.min(56, len * 0.05);

    for (let i = 0; i < distances.length; i++) {
      const d = distances[i]!;
      /** Конец fade не дальше конца пути — иначе последний узел никогда не доходит до opacity 1. */
      const hi = Math.min(d + trail, len);
      const lo = Math.min(d - lead, hi - 1e-3);
      const a =
        hi <= lo + 1e-6
          ? head >= d
            ? 1
            : 0
          : smoothstep01(head, lo, hi);
      const el = contentRefs.current[i];
      const circ = circleRefs.current[i];
      if (el) {
        gsap.set(el, { opacity: a, y: 20 * (1 - a) });
      }
      if (circ) {
        gsap.set(circ, {
          opacity: a,
          scale: 0.9 + 0.1 * a,
          transformOrigin: "50% 50%",
        });
      }
    }
  }, []);

  const setLineVisualProgress = useCallback(
    (p: number) => {
      const fillPath = fillPathRef.current;
      const len = pathLengthRef.current;
      if (!fillPath || len <= 0) return;
      const clamped = Math.min(1, Math.max(0, p));
      gsap.set(fillPath, { strokeDashoffset: len * (1 - clamped) });
      applyStepRevealFromProgress(clamped);
    },
    [applyStepRevealFromProgress],
  );

  const killLineScrollTriggers = useCallback(() => {
    linePhaseTriggersRef.current.forEach((st) => st.kill());
    linePhaseTriggersRef.current = [];
  }, []);

  /** Path geometry only; keep ScrollTriggers alive so pin is not reset on resize. */
  const updatePathDrawing = useCallback(() => {
    const track = trackRef.current;
    const trackPath = trackPathRef.current;
    const fillPath = fillPathRef.current;
    if (!track || !trackPath || !fillPath) return;

    const t = track.getBoundingClientRect();
    if (t.width < 1 || t.height < 1) return;

    const points: { x: number; y: number }[] = [];
    for (const el of circleRefs.current) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      points.push({
        x: r.left + r.width / 2 - t.left,
        y: r.top + r.height / 2 - t.top,
      });
    }

    if (points.length === 0) return;

    const isMd =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches;

    const d = isMd
      ? buildSnakePathQuadratic(points, 18)
      : buildVerticalZigzagPath(points);
    trackPath.setAttribute("d", d);
    fillPath.setAttribute("d", d);

    const len = trackPath.getTotalLength();
    pathLengthRef.current = len;

    nodeDistancesRef.current = points.map((pt) => arcLengthClosestToPoint(trackPath, pt.x, pt.y));

    trackPath.style.strokeDasharray = `${len}`;
    trackPath.style.strokeDashoffset = "0";
    fillPath.style.strokeDasharray = `${len}`;

    const dists = nodeDistancesRef.current;
    const trailReveal = Math.min(56, len * 0.05);
    let pSplit = 0.42;
    if (dists.length > 1) {
      pSplit = Math.min(0.9, Math.max(0.1, (dists[1]! + trailReveal) / len));
    } else {
      pSplit = 1;
    }
    pSplitRef.current = pSplit;

    const gapsAfterSplit = Math.max(1, nodeCount - 2);
    pinScrollPxRef.current = Math.round(SCROLL_PX_BETWEEN_NODES * gapsAfterSplit);
  }, [nodeCount]);

  const buildLineScrollTriggers = useCallback(() => {
    const track = trackRef.current;
    const fillPath = fillPathRef.current;
    const section = sectionRef.current;
    if (!track || !fillPath || !section) return;

    const len = pathLengthRef.current;

    killLineScrollTriggers();

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (len <= 0 || reduced) {
      gsap.set(fillPath, { strokeDashoffset: 0 });
      contentRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 1, y: 0 });
      });
      circleRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 1, scale: 1, transformOrigin: "50% 50%" });
      });
      ScrollTrigger.refresh();
      return;
    }

    contentRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, y: 20 });
    });
    circleRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, scale: 0.9, transformOrigin: "50% 50%" });
    });

    gsap.set(fillPath, { strokeDashoffset: len });

    const pSplit = pSplitRef.current;
    const pinScrollPx = pinScrollPxRef.current;

    if (pSplit >= 0.995) {
      const st = ScrollTrigger.create({
        id: "process-line-single",
        trigger: track,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.45,
        invalidateOnRefresh: true,
        onUpdate: (self) => setLineVisualProgress(self.progress),
        onRefresh: (self) => setLineVisualProgress(self.progress),
      });
      linePhaseTriggersRef.current.push(st);
    } else {
      const centerSynced = "center center";
      const phase1LineEase = 0.88;
      const phaseScrub = 0.65;

      const st1 = ScrollTrigger.create({
        id: "process-line-phase1",
        trigger: track,
        start: "top bottom",
        end: centerSynced,
        scrub: phaseScrub,
        invalidateOnRefresh: true,
        onUpdate(gst) {
          const t = Math.min(1, Math.max(0, gst.progress));
          const ps = pSplitRef.current;
          setLineVisualProgress(Math.pow(t, phase1LineEase) * ps);
        },
        onRefresh(gst) {
          const t = Math.min(1, Math.max(0, gst.progress));
          const ps = pSplitRef.current;
          setLineVisualProgress(Math.pow(t, phase1LineEase) * ps);
        },
      });

      const st2 = ScrollTrigger.create({
        id: "process-line-phase2",
        trigger: track,
        start: centerSynced,
        end: `+=${pinScrollPx}`,
        pin: section,
        pinSpacing: true,
        pinReparent: false,
        scrub: phaseScrub,
        invalidateOnRefresh: true,
        onUpdate(gst) {
          const t = Math.min(1, Math.max(0, gst.progress));
          const ps = pSplitRef.current;
          setLineVisualProgress(ps + t * (1 - ps));
        },
        onRefresh(gst) {
          const t = Math.min(1, Math.max(0, gst.progress));
          const ps = pSplitRef.current;
          setLineVisualProgress(ps + t * (1 - ps));
        },
      });

      linePhaseTriggersRef.current.push(st1, st2);
    }

    ScrollTrigger.refresh();
  }, [killLineScrollTriggers, setLineVisualProgress]);

  useLayoutEffect(() => {
    circleRefs.current = circleRefs.current.slice(0, items.length);
    contentRefs.current = contentRefs.current.slice(0, items.length);
  }, [items.length]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const track = trackRef.current;
    if (!track) return;

    updatePathDrawing();
    buildLineScrollTriggers();

    let roDebounce: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver(() => {
      if (roDebounce) clearTimeout(roDebounce);
      roDebounce = setTimeout(() => {
        roDebounce = null;
        updatePathDrawing();
        ScrollTrigger.refresh();
      }, 120);
    });
    ro.observe(track);

    return () => {
      if (roDebounce) clearTimeout(roDebounce);
      ro.disconnect();
      killLineScrollTriggers();
    };
  }, [items.length, updatePathDrawing, buildLineScrollTriggers, isDesktop, killLineScrollTriggers]);

  return (
    <div ref={sectionRef} className="relative flex w-full min-w-0 flex-col">
      <h2
        className={`mb-10 w-full font-heading sm:mb-12 ${sectionHeading.heading} ${sectionHeading.dark}`}
      >
        Как мы работаем
      </h2>

      <div
        ref={trackRef}
        className="relative min-h-[28rem] w-full min-w-0 md:min-h-[min(72vh,760px)] lg:min-h-[min(78vh,820px)]"
      >
        <svg
          className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
          aria-hidden
        >
          <path
            ref={trackPathRef}
            fill="none"
            stroke="rgba(173,207,255,0.28)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={fillPathRef}
            fill="none"
            stroke="#62B2FE"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {isDesktop ? (
          <div className="relative z-20 flex min-h-[inherit] w-full flex-col justify-between gap-4 py-4 md:py-6">
            {items.map((item, index) => {
              const isLeft = index % 2 === 0;
              const stepNum = String(index + 1).padStart(2, "0");

              return (
                <div
                  key={item.step}
                  className={cn(
                    "flex w-full flex-1 items-center gap-5 md:gap-8 lg:gap-12",
                    isLeft ? "justify-start pl-[1%] md:pl-[3%]" : "justify-end pr-[1%] md:pr-[3%]",
                  )}
                >
                  {isLeft ? (
                    <>
                      <div
                        ref={(node) => {
                          circleRefs.current[index] = node;
                        }}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#62B2FE] text-sm font-semibold tracking-[-0.02em] text-[#0a1628] shadow-[0_10px_28px_rgba(98,178,254,0.28)] md:h-14 md:w-14 md:text-base"
                      >
                        {stepNum}
                      </div>
                      <StepCopy
                        item={item}
                        align="left"
                        contentRef={(node) => {
                          contentRefs.current[index] = node;
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <StepCopy
                        item={item}
                        align="right"
                        contentRef={(node) => {
                          contentRefs.current[index] = node;
                        }}
                      />
                      <div
                        ref={(node) => {
                          circleRefs.current[index] = node;
                        }}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#62B2FE] text-sm font-semibold tracking-[-0.02em] text-[#0a1628] shadow-[0_10px_28px_rgba(98,178,254,0.28)] md:h-14 md:w-14 md:text-base"
                      >
                        {stepNum}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="relative z-20 flex w-full min-w-0 flex-col gap-10 py-2">
            {items.map((item, index) => {
              const isLeft = index % 2 === 0;
              const stepNum = String(index + 1).padStart(2, "0");
              return (
                <div
                  key={item.step}
                  className={cn(
                    "flex min-w-0 flex-1 flex-row items-center gap-5",
                    !isLeft && "flex-row-reverse",
                  )}
                >
                  <div className="flex shrink-0 justify-center">
                    <div
                      ref={(node) => {
                        circleRefs.current[index] = node;
                      }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#62B2FE] text-sm font-semibold tracking-[-0.02em] text-[#0a1628] shadow-[0_10px_28px_rgba(98,178,254,0.28)]"
                    >
                      {stepNum}
                    </div>
                  </div>
                  <StepCopy
                    item={item}
                    align={isLeft ? "left" : "right"}
                    contentRef={(node) => {
                      contentRefs.current[index] = node;
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
