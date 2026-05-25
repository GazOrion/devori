import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ECOSYSTEM_DIRECTION_CARDS } from "@/data/ecosystem-directions";
import sectionHeading from "@/components/ui/section-heading.module.css";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function EcosystemSection() {
  return (
    <ScrollReveal
      className={`mx-auto w-full max-w-[1680px] px-[5vw] pb-40 md:px-[6vw] lg:px-[7vw] ${sectionHeading.lightOverlapTop}`}
    >
      <div className="max-w-[52rem]">
        <h2 className={`font-heading ${sectionHeading.heading} ${sectionHeading.light}`}>
          Наша экосистема
        </h2>
        <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-[#4a5a75] sm:text-[1.05rem]">
          проекты и сервисы, которые развивает наша компания
        </p>
      </div>

      <ul className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
        {ECOSYSTEM_DIRECTION_CARDS.map(({ id, label, description, href, external, icon: Icon }) => {
          const cardInner = (
            <>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#66B3FF]/20 bg-[#66B3FF]/10 text-[#2e78ff] sm:h-12 sm:w-12">
                <Icon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" strokeWidth={1.75} aria-hidden />
              </span>

              <span className="flex min-h-0 min-w-0 flex-1 flex-col justify-center">
                <span className="block font-heading text-[1.05rem] leading-snug text-[#07111f] sm:text-lg">
                  {label}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-[#4a5a75] sm:text-[0.98rem]">
                  {description}
                </span>
              </span>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full border border-[#dbe5f4] bg-[#f4f7ff] text-[#2e78ff] transition group-hover:border-[#66B3FF]/35 group-hover:bg-[#66B3FF]/10">
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
            </>
          );

          const cardClassName =
            "group flex h-full w-full min-h-[7.5rem] items-center gap-4 rounded-2xl border border-[#dbe5f4] bg-white p-4 shadow-[0_8px_28px_-18px_rgba(7,17,31,0.18)] transition hover:border-[#66B3FF]/30 hover:shadow-[0_12px_36px_-16px_rgba(46,120,255,0.22)] sm:min-h-[8.25rem] sm:gap-5 sm:p-5";

          return (
            <li key={id} className="min-h-0 w-full">
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClassName}
                >
                  {cardInner}
                </a>
              ) : (
                <Link href={href} className={cardClassName} prefetch={false}>
                  {cardInner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </ScrollReveal>
  );
}
