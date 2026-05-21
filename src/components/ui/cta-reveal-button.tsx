"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

import { isContactHref, useContactCtaHandler } from "@/components/ui/contact-modal-context";
import { cn } from "@/lib/utils";

type CtaRevealButtonProps = {
  href?: string;
  children: ReactNode;
  className?: string;
  size?: "hero" | "compact";
};

/**
 * CTA с заливкой чёрным кругом при hover — как основная кнопка на главном экране.
 */
export function CtaRevealButton({
  href = "#contact",
  children,
  className,
  size = "compact",
}: CtaRevealButtonProps) {
  const openContact = useContactCtaHandler(href);
  const [hovered, setHovered] = useState(false);
  const [collapseToRight, setCollapseToRight] = useState(false);

  useEffect(() => {
    if (!collapseToRight) return;
    const timer = window.setTimeout(() => setCollapseToRight(false), 500);
    return () => window.clearTimeout(timer);
  }, [collapseToRight]);

  const sizeClasses =
    size === "hero"
      ? "px-10 py-5 text-lg sm:px-12 sm:py-5 sm:text-xl"
      : "px-7 py-3.5 text-[0.96rem]";

  const hoverHandlers = {
    onMouseEnter: () => {
      setCollapseToRight(false);
      setHovered(false);
      window.requestAnimationFrame(() => setHovered(true));
    },
    onMouseLeave: () => {
      setCollapseToRight(true);
      setHovered(false);
    },
  };

  const sharedClassName = cn(
    "relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/85 bg-white font-semibold text-[#050b16] shadow-[0_24px_70px_rgba(255,255,255,0.22)]",
    sizeClasses,
    className,
  );

  const content = (
    <>
      <span
        className="pointer-events-none absolute inset-0 bg-black transition-[clip-path] duration-500 ease-out"
        style={{
          clipPath: hovered
            ? "circle(160% at 2% 50%)"
            : collapseToRight
              ? "circle(0% at 100% 50%)"
              : "circle(0% at 2% 50%)",
        }}
        aria-hidden
      />
      <span
        className={cn(
          "relative z-10 inline-flex items-center transition-colors duration-300",
          hovered ? "text-white" : "text-[#050b16]",
        )}
      >
        {children}
      </span>
    </>
  );

  if (isContactHref(href)) {
    return (
      <button type="button" onClick={openContact} {...hoverHandlers} className={sharedClassName}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} {...hoverHandlers} className={sharedClassName}>
      {content}
    </Link>
  );
}
