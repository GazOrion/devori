"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { TextScramble } from "@/components/ui/text-scramble";
import { openCookieSettings } from "@/lib/cookie-consent";

type SiteFooterProps = {
  companyName?: string;
};

export function SiteFooter({
  companyName = "devori",
}: SiteFooterProps) {
  const year = new Date().getFullYear();
  const brandPrefix = companyName.slice(0, 3);
  const brandSuffix = companyName.slice(3);
  const [scrambleTrigger, setScrambleTrigger] = useState(false);

  const handleBrandHover = () => {
    setScrambleTrigger(false);
    window.requestAnimationFrame(() => {
      setScrambleTrigger(true);
    });
  };

  return (
    <footer
      className="relative z-[70] border-t border-white/[0.07] bg-devori-dark shadow-[inset_0_1px_0_0_rgba(102,179,255,0.22),0_-6px_24px_-8px_rgba(167,139,250,0.12)]"
      aria-label="Нижний колонтитул"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#66B3FF]/55 to-transparent" />
      <div className="mx-auto flex max-w-[1680px] flex-col gap-5 px-[5vw] py-8 text-sm leading-snug text-white/72 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8 sm:gap-y-4 sm:py-10 sm:text-base md:px-[6vw] lg:px-[7vw]">
        <a
          href="#top"
          aria-label={`${companyName} — наверх страницы`}
          className="inline-flex shrink-0 items-center gap-2.5 font-semibold leading-none tracking-[0.04em] text-xl select-none sm:gap-3 sm:text-2xl md:text-[1.85rem]"
          onMouseEnter={handleBrandHover}
        >
          <Image
            src="/logo.svg"
            alt=""
            width={843}
            height={817}
            className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
          />
          <span className="inline-flex min-w-0 items-baseline">
            <TextScramble
              as="span"
              className="text-[#66B3FF]"
              duration={1.2}
              speed={0.03}
              trigger={scrambleTrigger}
            >
              {brandPrefix}
            </TextScramble>
            <TextScramble
              as="span"
              className="text-white"
              duration={1.2}
              speed={0.03}
              trigger={scrambleTrigger}
              onScrambleComplete={() => setScrambleTrigger(false)}
            >
              {brandSuffix}
            </TextScramble>
          </span>
        </a>

        <div className="flex max-w-full flex-wrap items-center gap-x-3 gap-y-2 sm:max-w-none sm:justify-end sm:gap-x-4 sm:ml-auto">
          <Link
            href="/cookie-settings"
            className="transition-colors hover:text-white"
            prefetch={false}
            onClick={(event) => {
              event.preventDefault();
              openCookieSettings();
            }}
          >
            Настройки cookie
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-white" prefetch={false}>
            Политика обработки персональных данных
          </Link>
          <span className="tabular-nums text-white/50">{year}</span>
        </div>
      </div>
    </footer>
  );
}
