"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Старт анимации относительно вьюпорта (как у героя — мягкий вход снизу). */
  start?: string;
  stagger?: number;
};

export function ScrollReveal({
  children,
  className,
  start = "top 86%",
  stagger = 0.12,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const targets = gsap.utils.toArray<HTMLElement>(el.children);
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: 28 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [start, stagger]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
