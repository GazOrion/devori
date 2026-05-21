"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

type SpotlightCardProps = {
  title: string;
  description: string;
  badge?: string;
  footer?: string;
  imageSrc?: string;
  children?: ReactNode;
};

export function SpotlightCard({
  title,
  description,
  badge,
  footer,
  imageSrc,
  children,
}: SpotlightCardProps) {
  const [position, setPosition] = useState({ x: 50, y: 50, active: false });

  return (
    <article
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPosition({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
          active: true,
        });
      }}
      onMouseLeave={() => setPosition((prev) => ({ ...prev, active: false }))}
      className="group relative flex min-h-[17.5rem] flex-col overflow-hidden rounded-[2.25rem] border border-slate-200/90 p-7 shadow-none transition duration-300 hover:-translate-y-1 hover:border-[#66B3FF]/50 sm:min-h-[18.5rem] xl:min-h-[19.5rem]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-white" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(165deg,#070c16_0%,#0a1020_42%,#0e1830_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(155deg,rgba(255,255,255,0.82)_0%,rgba(248,250,255,0.45)_50%,rgba(230,240,255,0.3)_100%)] opacity-100 transition-opacity duration-300 group-hover:opacity-0"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[3] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
        style={{
          background: `linear-gradient(155deg,rgba(255,255,255,0.08)_0%,transparent_45%,rgba(70,130,200,0.1)_100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[4] transition-opacity duration-200"
        style={{
          opacity: position.active ? 1 : 0,
          background: `radial-gradient(circle at ${position.x}% ${position.y}%, rgba(46, 120, 255, 0.26) 0%, rgba(46, 120, 255, 0.11) 24%, rgba(46, 120, 255, 0.04) 44%, transparent 64%)`,
        }}
      />
      <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col gap-4">
        {badge ? (
          <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500 transition-colors duration-300 group-hover:border-white/15 group-hover:bg-white/[0.08] group-hover:text-[#9eb6d8]">
            {badge}
          </span>
        ) : null}
        {imageSrc ? (
          <div className="relative mx-auto h-28 w-28 shrink-0 [perspective:520px] sm:h-32 sm:w-32">
            <div className="service-card-image-wrap relative h-full w-full">
              <Image
                src={imageSrc}
                alt={title}
                fill
                sizes="128px"
                className="object-contain drop-shadow-[0_8px_20px_rgba(80,140,200,0.2)] transition-[filter] duration-300 group-hover:drop-shadow-[0_0_32px_rgba(100,175,255,0.5)]"
              />
            </div>
          </div>
        ) : null}
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold tracking-[0.04em] text-[#07111f] transition-colors duration-300 group-hover:text-white">
            {title}
          </h3>
          <p className="text-sm leading-7 text-slate-600 transition-colors duration-300 group-hover:text-white/65">
            {description}
          </p>
        </div>
        {children ? (
          <div className="pt-2 text-slate-700 transition-colors duration-300 group-hover:text-white/80">{children}</div>
        ) : null}
        {footer ? (
          <p className="mt-auto pt-2 text-sm font-semibold text-[#2e78ff] transition-colors duration-300 group-hover:text-[#7ab3ff]">
            {footer}
          </p>
        ) : null}
      </div>
    </article>
  );
}
