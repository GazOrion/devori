"use client";

import Image from "next/image";

import { DraggableMarquee } from "@/components/ui/marquee";
import { LatinText } from "@/components/ui/latin-text";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export type TeamMarqueeMember = {
  name: string;
  role: string;
  image: string;
};

type TeamMarqueeSectionProps = {
  members: TeamMarqueeMember[];
};

export function TeamMarqueeSection({ members }: TeamMarqueeSectionProps) {
  const extended = members.length >= 4 ? members : [...members, ...members];

  return (
    <ScrollReveal className="relative flex w-full flex-col gap-12 md:gap-14">
      <div className="mx-auto flex w-full max-w-[54rem] flex-col items-center px-1 text-center">
        <h2 className="font-heading text-[2.4rem] leading-[0.95] text-[#07111f] sm:text-[3.1rem]">
          Кто будет трудиться над вашим проектом
        </h2>
      </div>

      <div className="relative w-full">
        <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-24 bg-linear-to-r from-[#f8fbff] to-transparent md:w-32" />
        <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-24 bg-linear-to-l from-[#f8fbff] to-transparent md:w-32" />

        <DraggableMarquee className="[--gap:1.25rem]" pauseOnHover={false}>
          {extended.map((member, index) => (
              <div
                className="group/card flex w-[17.5rem] shrink-0 flex-col select-none sm:w-64"
                key={`${member.image}-${index}`}
                onContextMenu={(event) => event.preventDefault()}
              >
                <div className="relative h-[22rem] w-full overflow-hidden rounded-[1.75rem] border border-[#07111f]/8 bg-white transition-[box-shadow,ring-color] duration-300 sm:h-[23rem] group-hover/card:shadow-[0_28px_64px_rgba(102,179,255,0.22)] group-hover/card:ring-2 group-hover/card:ring-[#66B3FF]/45">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    unoptimized
                    draggable={false}
                    sizes="(max-width: 640px) 280px, 512px"
                    className="pointer-events-none object-cover object-top grayscale select-none group-hover/card:grayscale-0 group-hover/card:scale-[1.02] transition-transform duration-500 ease-out [-webkit-user-drag:none] [backface-visibility:hidden] [transform:translateZ(0)]"
                  />
                  <div
                    className="absolute inset-0 z-[1]"
                    aria-hidden
                    onContextMenu={(event) => event.preventDefault()}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-linear-to-t from-[#07111f]/88 via-[#07111f]/35 to-transparent p-4 pt-16 transition-opacity duration-300 select-none group-hover/card:from-[#07111f]/95">
                    <p className="font-heading text-lg text-white">{member.name}</p>
                    <p className="mt-1 text-sm text-white/80">
                      <LatinText latinClassName="tracking-[0.1em]">{member.role}</LatinText>
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </DraggableMarquee>
      </div>
    </ScrollReveal>
  );
}
