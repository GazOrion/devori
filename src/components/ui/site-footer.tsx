"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { TextScramble } from "@/components/ui/text-scramble";
import { SITE_DIRECTIONS } from "@/lib/site-directions";
import { SITE_CONTACTS } from "@/lib/site-contacts";
import { openCookieSettings } from "@/lib/cookie-consent";
import { scrollToTop } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

type SiteFooterProps = {
  companyName?: string;
  className?: string;
};

const footerSectionLabelClassName =
  "text-[0.8rem] font-medium uppercase tracking-[0.1em] text-white/50 sm:text-sm";

/** Одинаковый шаг между строками внутри колонки */
const footerStackGapClassName = "gap-2";

/** Высота блока логотипа / подзаголовков — для выравнивания по центру */
const footerHeadBlockClassName =
  "flex min-h-[2.75rem] shrink-0 items-center md:min-h-[3rem]";

const footerNavLinkClassName =
  "relative inline-block text-base leading-snug outline-none transition-colors duration-200 ease-out after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white/75 after:transition-[width] after:duration-300 after:ease-out hover:text-white hover:after:w-full focus-visible:ring-2 focus-visible:ring-[#66B3FF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-devori-dark focus-visible:after:w-full motion-reduce:after:transition-none";

export function SiteFooter({
  companyName = "devori",
  className,
}: SiteFooterProps) {
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
      className={cn(
        "border-t border-white/[0.07] bg-devori-dark shadow-[inset_0_1px_0_0_rgba(102,179,255,0.22),0_-6px_24px_-8px_rgba(167,139,250,0.12)]",
        className,
      )}
      aria-label="Нижний колонтитул"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#66B3FF]/55 to-transparent" />
      <div className="mx-auto max-w-[1680px] px-[5vw] py-8 sm:py-10 md:px-[6vw] lg:px-[7vw]">
        <div
          className={cn(
            "grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-x-10 lg:gap-y-0",
          )}
        >
          <div className={cn("flex min-w-0 flex-col", footerStackGapClassName)}>
            <a
              href="#top"
              aria-label={`${companyName} — наверх страницы`}
              className={cn(
                footerHeadBlockClassName,
                "inline-flex gap-2.5 font-semibold leading-none tracking-[0.04em] text-[1.35rem] select-none sm:gap-3 sm:text-2xl md:text-[1.85rem]",
              )}
              onMouseEnter={handleBrandHover}
              onClick={(event) => {
                if (window.location.pathname === "/") {
                  event.preventDefault();
                  scrollToTop();
                  window.history.pushState(null, "", "#top");
                }
              }}
            >
              <Image
                src="/logo.svg"
                alt=""
                width={843}
                height={817}
                className="h-9 w-9 shrink-0 object-contain sm:h-9 sm:w-9"
              />
              <span className="inline-flex min-w-0 items-baseline text-white/90">
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

            <div className="min-w-0">
              <p className={footerSectionLabelClassName}>Экосистема проектов</p>
              <p className="mt-1 text-[0.68rem] leading-snug text-white/42 sm:text-[0.72rem]">
                прикладные и цифровые направления компании
              </p>
            </div>

            <nav aria-label="Экосистема проектов" className="min-w-0">
              <ol
                className={cn(
                  "flex list-decimal flex-col pl-[1.35rem] text-sm leading-snug marker:text-[#66B3FF]/75 sm:text-[0.98rem]",
                  footerStackGapClassName,
                )}
              >
                {SITE_DIRECTIONS.map((direction) => (
                  <li key={direction.id} className="pl-0.5 marker:font-medium">
                    {direction.external ? (
                      <a
                        href={direction.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={footerNavLinkClassName}
                      >
                        {direction.label}
                      </a>
                    ) : (
                      <Link href={direction.href} className={footerNavLinkClassName} prefetch={false}>
                        {direction.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div
            className={cn(
              "flex min-w-0 flex-col text-sm leading-snug text-white/72 sm:text-base",
              footerStackGapClassName,
            )}
          >
            <p className={cn(footerSectionLabelClassName, footerHeadBlockClassName)}>Контакты</p>
            <ul className={cn("flex flex-col", footerStackGapClassName)}>
              <li>
                <a
                  href={`tel:${SITE_CONTACTS.phone.href}`}
                  className="inline-flex items-start gap-2.5 transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#66B3FF]/90" aria-hidden />
                  <span>{SITE_CONTACTS.phone.display}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONTACTS.email.href}`}
                  className="inline-flex items-start gap-2.5 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#66B3FF]/90" aria-hidden />
                  <span>{SITE_CONTACTS.email.display}</span>
                </a>
              </li>
              <li>
                <p className="inline-flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#66B3FF]/90" aria-hidden />
                  <span>{SITE_CONTACTS.address}</span>
                </p>
              </li>
            </ul>
          </div>

          <div
            className={cn(
              "flex min-w-0 flex-col sm:items-end",
              footerStackGapClassName,
            )}
          >
            <p
              className={cn(
                footerSectionLabelClassName,
                footerHeadBlockClassName,
                "w-full sm:justify-end",
              )}
            >
              Правовой раздел
            </p>
            <div className={cn("flex w-full flex-col sm:items-end", footerStackGapClassName)}>
              <Link
                href="/privacy"
                title="Политика обработки персональных данных"
                className={footerNavLinkClassName}
                prefetch={false}
              >
                Политика обработки персональных данных
              </Link>
              <Link
                href="/cookie-settings"
                className={footerNavLinkClassName}
                prefetch={false}
                onClick={(event) => {
                  event.preventDefault();
                  openCookieSettings();
                }}
              >
                Настройки cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
