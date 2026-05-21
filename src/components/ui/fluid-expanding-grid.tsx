"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { LatinText } from "@/components/ui/latin-text";

type GridItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  meta: string;
  result: string;
  imageClassName?: string;
};

type FluidExpandingGridProps = {
  items: GridItem[];
};

export function FluidExpandingGrid({ items }: FluidExpandingGridProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {items.map((item) => {
        const active = item.id === activeId;

        return (
          <button
            key={item.id}
            type="button"
            onMouseEnter={() => setActiveId(item.id)}
            onFocus={() => setActiveId(item.id)}
            className={`relative min-h-[24rem] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 text-left transition-[flex-grow,transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${active ? "lg:flex-[1.9]" : "lg:flex-1"}`}
          >
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10">
              <Image
                src={item.image}
                alt={item.title}
                fill
                unoptimized={item.image.startsWith("/doposle/")}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className={cn(
                  "object-cover transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  active ? "scale-100 opacity-100" : "scale-105 opacity-90",
                  item.imageClassName,
                )}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,15,0.12)_0%,rgba(4,7,15,0.78)_100%)]" />
            </div>
            <div className="relative z-10 flex h-full flex-col justify-end p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
                <LatinText latinClassName="tracking-[0.28em]">{item.meta}</LatinText>
              </p>
              <h3 className="mt-3 max-w-[18rem] text-2xl font-semibold tracking-[0.04em] text-white">
                {item.title}
              </h3>
              <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${active ? "mt-3 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="max-w-[24rem] text-sm leading-7 text-white/72">
                    {item.description}
                  </p>
                  <p className="mt-4 text-sm font-medium text-primary">
                    {item.result}
                  </p>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
