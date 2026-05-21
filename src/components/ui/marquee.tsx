"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  pauseOnHover?: boolean;
};

type DraggableMarqueeProps = MarqueeProps & {
  /** Seconds for one full loop (half the duplicated track width). */
  duration?: number;
};

function normalizeOffset(offset: number, loopWidth: number) {
  if (loopWidth <= 0) return 0;

  let next = offset % loopWidth;
  if (next < 0) next += loopWidth;
  return next;
}

export function DraggableMarquee({
  children,
  className,
  pauseOnHover = true,
  duration = 42,
}: DraggableMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const dragRef = useRef({ active: false, startX: 0, startOffset: 0 });
  const pauseRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      loopWidthRef.current = track.scrollWidth / 2;
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);

    let raf = 0;
    let last = performance.now();

    const applyTransform = () => {
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    };

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      const loopWidth = loopWidthRef.current;

      if (loopWidth > 0 && !dragRef.current.active && !pauseRef.current) {
        const speed = loopWidth / duration;
        offsetRef.current = normalizeOffset(
          offsetRef.current + (speed * dt) / 1000,
          loopWidth,
        );
        applyTransform();
      }

      raf = requestAnimationFrame(tick);
    };

    applyTransform();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, [duration]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    const container = containerRef.current;
    if (!container) return;

    dragRef.current = {
      active: true,
      startX: event.clientX,
      startOffset: offsetRef.current,
    };
    setIsDragging(true);
    container.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!dragRef.current.active || !track) return;

    const delta = event.clientX - dragRef.current.startX;
    const loopWidth = loopWidthRef.current;
    offsetRef.current = normalizeOffset(
      dragRef.current.startOffset - delta,
      loopWidth,
    );
    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!dragRef.current.active || !container) return;

    dragRef.current.active = false;
    setIsDragging(false);

    if (container.hasPointerCapture(event.pointerId)) {
      container.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full max-w-full overflow-hidden [--gap:1.25rem]",
        "cursor-grab select-none touch-none [-webkit-user-drag:none] [-webkit-touch-callout:none]",
        isDragging && "cursor-grabbing",
        className,
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onContextMenu={(event) => event.preventDefault()}
      onMouseEnter={() => {
        if (pauseOnHover) pauseRef.current = true;
      }}
      onMouseLeave={() => {
        if (pauseOnHover) pauseRef.current = false;
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max shrink-0 flex-row items-stretch will-change-transform [gap:var(--gap)]"
      >
        {children}
        {children}
      </div>
    </div>
  );
}

export function Marquee({ children, className, pauseOnHover }: MarqueeProps) {
  return (
    <div
      className={cn(
        "group/marquee flex w-full max-w-full overflow-hidden [--duration:42s] [--gap:1.25rem]",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max shrink-0 flex-row items-stretch [gap:var(--gap)]",
          pauseOnHover &&
            "group-hover/marquee:[animation-play-state:paused]",
        )}
        style={{
          animation:
            "devori-marquee-scroll var(--duration, 42s) linear infinite",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
