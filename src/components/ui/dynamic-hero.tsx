"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import dynamic from "next/dynamic";

const AnimatedGradient = dynamic(() => import("@/components/ui/animated-gradient"), {
  ssr: false,
});
import TypingEffect, { type TypingOrchestrationStep } from "@/components/ui/typing-effect";
import { shineHoverClassName } from "@/components/ui/shine-hover";
import { cn } from "@/lib/utils";
import { TextScramble } from "@/components/ui/text-scramble";
import { isContactHref, useContactModal } from "@/components/ui/contact-modal-context";
import { handleInPageAnchorClick } from "@/lib/smooth-scroll";
import { zFloating, zSection } from "@/lib/layer-z-index";

type NavItem = {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  target?: string;
  /** Плашка рядом с пунктом, например «new». */
  badge?: string;
  /** Отдельно от основной капсулы меню — тихая вторичная ссылка. */
  separate?: boolean;
};
type Metric = { value: string; label: string };

gsap.registerPlugin(ScrollTrigger);

const parseMetricValue = (value: string): { target: number; suffix: string } => {
  const match = value.match(/^(\d+(?:[.,]\d+)?)([\s\S]*)$/);
  if (!match) return { target: 0, suffix: value };
  const n = Number.parseFloat(match[1].replace(",", "."));
  return { target: Number.isFinite(n) ? n : 0, suffix: match[2] ?? "" };
};

type HeroSectionProps = {
  heading?: string;
  tagline?: string;
  buttonText?: string;
  secondaryButtonText?: string;
  navItems?: NavItem[];
  companyName?: string;
  metrics?: Metric[];
  typingTexts?: string[];
  typingOrchestrations?: Record<number, TypingOrchestrationStep[]>;
};

const renderHeading = (heading: string) => {
  const parts = heading.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <span
        key={`${part}-${index}`}
        className="font-display text-[0.95em] italic text-primary"
      >
        {part.slice(2, -2)}
      </span>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
};

const defaultNavItems: NavItem[] = [
  { id: "services", label: "Услуги", href: "#services" },
  { id: "formats", label: "Форматы", href: "#formats" },
  { id: "cases", label: "Кейсы", href: "#cases" },
  { id: "testimonials", label: "Отзывы", href: "#testimonials" },
];

const defaultMetrics: Metric[] = [
  { value: "42", label: "цифровых продуктов запущено" },
  { value: "8 нед", label: "до первого релиза" },
  { value: "24/7", label: "партнерство на каждом этапе" },
];

const HERO_GRADIENT_CONFIG = { preset: "Prism" as const, speed: 14 };
const HERO_GRADIENT_NOISE = { opacity: 0.16, scale: 1.1 };
const HERO_BOTTOM_RADIUS = "3.25rem";
const HERO_MIN_HEIGHT = "min-h-[calc(100dvh+3rem)] md:min-h-[calc(100dvh+8rem)]";
const HERO_MAIN_MIN_HEIGHT = "md:min-h-[calc(100dvh+8rem-88px)]";

export function HeroSection({
  heading = "Создаем **цифровой импульс** для IT-команд, которым нужен результат, а не шум.",
  tagline,
  buttonText = "Обсудить проект",
  secondaryButtonText = "Смотреть кейсы",
  navItems = defaultNavItems,
  companyName = "devori",
  metrics = defaultMetrics,
  typingTexts = ["сайты", "интерфейсы", "бренд-системы"],
  typingOrchestrations,
}: HeroSectionProps) {
  const { openContactModal } = useContactModal();
  const mainNavItems = navItems.filter((item) => !item.separate);
  const separateNavItems = navItems.filter((item) => item.separate);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const handleNavClick = (item: NavItem) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    item.onClick?.();
    if (isContactHref(item.href)) {
      event.preventDefault();
      openContactModal();
      return;
    }
    handleInPageAnchorClick(event, item.href);
  };

  const renderSeparateNavLink = (item: NavItem, className?: string) => (
    <a
      key={item.id}
      href={item.href}
      target={item.target}
      rel={item.target === "_blank" ? "noreferrer noopener" : undefined}
      onClick={handleNavClick(item)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full py-1 text-[0.8125rem] font-medium text-white/85 outline-none transition-colors duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50 sm:text-[0.875rem]",
        className,
      )}
    >
      <span>{item.label}</span>
      {item.badge ? (
        <span className="rounded border border-white/35 px-1 py-px text-[0.58rem] font-medium uppercase leading-none tracking-[0.08em] text-white/70">
          {item.badge}
        </span>
      ) : null}
    </a>
  );
  const copyRef = useRef<HTMLDivElement | null>(null);
  const metricsRef = useRef<HTMLDivElement | null>(null);
  const metricValueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const crmLineRef = useRef<HTMLDivElement | null>(null);
  const [scrambleTrigger, setScrambleTrigger] = useState(false);
  const [primaryCtaHovered, setPrimaryCtaHovered] = useState(false);
  const [primaryCtaCollapseToRight, setPrimaryCtaCollapseToRight] = useState(false);
  const brandPrefix = companyName.slice(0, 3);
  const brandSuffix = companyName.slice(3);

  useEffect(() => {
    if (!primaryCtaCollapseToRight) return;
    const timer = window.setTimeout(() => {
      setPrimaryCtaCollapseToRight(false);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [primaryCtaCollapseToRight]);

  useEffect(() => {
    if (!rootRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const context = gsap.context(() => {
      gsap.fromTo(navRef.current, { opacity: 0 }, { opacity: 1, duration: 0.65, ease: "power2.out" });
      gsap.fromTo(copyRef.current?.children ?? [], { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.15 });
      gsap.fromTo(metricsRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", delay: 0.42 });

      if (!reduced) {
        const letters = crmLineRef.current?.querySelectorAll<HTMLElement>(".crm-char");
        if (letters?.length) {
          gsap.fromTo(letters, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.028, delay: 0.35 });
        }

        metrics.forEach((metric, index) => {
          const el = metricValueRefs.current[index];
          if (!el) return;
          const { target, suffix } = parseMetricValue(metric.value);
          el.textContent = `0${suffix}`;
          const proxy = { n: 0 };
          gsap.to(proxy, {
            n: target,
            duration: 1.05,
            ease: "power2.out",
            delay: 0.48 + index * 0.07,
            onUpdate: () => {
              const v = proxy.n;
              const shown = Number.isInteger(target) ? Math.round(v) : Math.round(v * 10) / 10;
              el.textContent = `${shown}${suffix}`;
            },
          });
        });
      } else {
        metrics.forEach((metric, index) => {
          const el = metricValueRefs.current[index];
          if (el) el.textContent = metric.value;
        });
      }
    }, rootRef);

    return () => context.revert();
  }, [metrics]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [metrics]);

  const handleBrandHover = () => {
    setScrambleTrigger(false);
    window.requestAnimationFrame(() => {
      setScrambleTrigger(true);
    });
  };

  return (
    <div
      id="top"
      ref={rootRef}
      className={`relative isolate ${zSection.hero} flex flex-col ${HERO_MIN_HEIGHT} overflow-hidden rounded-b-[3.25rem] bg-background pb-2 text-foreground shadow-[0_28px_90px_rgba(0,0,0,0.38)]`}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-b-[3.25rem]"
        style={{
          borderBottomLeftRadius: HERO_BOTTOM_RADIUS,
          borderBottomRightRadius: HERO_BOTTOM_RADIUS,
        }}
        aria-hidden
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderBottomLeftRadius: HERO_BOTTOM_RADIUS,
            borderBottomRightRadius: HERO_BOTTOM_RADIUS,
          }}
        >
          <div
            className="absolute -inset-[18px] overflow-hidden"
            style={{
              filter: "blur(14px)",
              transform: "translateZ(0)",
              borderBottomLeftRadius: HERO_BOTTOM_RADIUS,
              borderBottomRightRadius: HERO_BOTTOM_RADIUS,
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <AnimatedGradient
              config={HERO_GRADIENT_CONFIG}
              noise={HERO_GRADIENT_NOISE}
              radius={`0 0 ${HERO_BOTTOM_RADIUS} ${HERO_BOTTOM_RADIUS}`}
            />
          </div>
        </div>
      </div>

      <nav
        ref={navRef}
        className={cn(
          "sticky top-0 mx-auto flex w-full max-w-[1840px] items-center justify-between gap-4 border-b border-white/15 px-[3.2vw] py-4 md:gap-6 md:px-[4vw] md:py-5 lg:px-[4.6vw] relative",
          zFloating.header,
        )}
      >
        <div className="flex min-w-0 shrink items-center gap-3">
          <a
            href="#top"
            aria-label="Наверх страницы"
            className="group flex h-14 w-14 shrink-0 items-center justify-center"
          >
            <Image
              src="/logo.svg"
              alt=""
              width={843}
              height={817}
              className="h-10 w-10 object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              priority
            />
          </a>

          <a
            href="#top"
            aria-label="Наверх страницы"
            className="inline-flex min-w-[6.5ch] shrink-0 items-baseline text-[2.2rem] font-semibold leading-none tracking-[0.04em] md:min-w-[7ch] md:text-[3.2rem]"
            onMouseEnter={handleBrandHover}
          >
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
          </a>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-3 md:flex">
          <div className="pointer-events-auto flex min-h-12 min-w-0 items-center justify-center gap-0.5 rounded-full border border-white/20 bg-white/10 p-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
            {mainNavItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target={item.target}
                rel={item.target === "_blank" ? "noreferrer noopener" : undefined}
                onClick={handleNavClick(item)}
                className="relative rounded-full px-5 py-2.5 text-[0.9375rem] font-medium text-white/90 outline-none transition-colors duration-200 ease-out after:pointer-events-none after:absolute after:bottom-1.5 after:left-5 after:h-px after:w-0 after:bg-white/75 after:transition-[width] after:duration-300 after:ease-out hover:text-white hover:after:w-[calc(100%-2.5rem)] focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0 focus-visible:after:w-[calc(100%-2.5rem)] motion-reduce:after:transition-none sm:text-base"
              >
                {item.label}
              </a>
            ))}
          </div>
          {separateNavItems.length > 0 ? (
            <div className="pointer-events-auto flex items-center gap-3 pl-0.5">
              <span className="h-4 w-px shrink-0 bg-white/28" aria-hidden />
              {separateNavItems.map((item) => renderSeparateNavLink(item))}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {separateNavItems.length > 0 ? (
            <div className="flex md:hidden">{separateNavItems.map((item) => renderSeparateNavLink(item))}</div>
          ) : null}
          <button
            type="button"
            onClick={() => openContactModal()}
            className={cn(
              shineHoverClassName,
              "inline-flex h-14 min-w-[10.5rem] shrink-0 items-center justify-center rounded-full border-0 bg-[#66B3FF] px-8 text-lg font-semibold text-white shadow-none transition-colors duration-200 ease-out outline-none hover:bg-[#7abefa] focus-visible:ring-2 focus-visible:ring-[#66B3FF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:min-w-[11.5rem] sm:px-10 sm:text-xl",
            )}
          >
            Связаться
          </button>
        </div>
      </nav>

      <main
        className={`relative z-20 mx-auto flex min-h-0 w-full max-w-[1840px] flex-1 flex-col px-[3.2vw] pb-6 pt-4 ${HERO_MAIN_MIN_HEIGHT} md:px-[4vw] md:flex-none md:pb-6 lg:px-[4.6vw] lg:pb-8`}
      >
        <div
          ref={copyRef}
          className="flex min-h-0 flex-1 flex-col justify-start gap-6 py-8 md:flex-none md:justify-center md:gap-6 md:py-8 lg:justify-start lg:py-14"
        >
          <div className="space-y-6">
            <h1 className="max-w-[44rem] font-heading text-[2.85rem] leading-[1.08] text-white sm:text-[4rem] sm:leading-[0.92] lg:text-[5.1rem]">
              {renderHeading(heading)}
            </h1>

            {typingTexts.length > 0 ? (
              <div
                ref={crmLineRef}
                className="flex min-h-[3.5rem] max-w-[46rem] flex-wrap items-center gap-3 overflow-x-clip pt-1 text-xl font-medium leading-snug text-white/90 sm:min-h-[3.5rem] sm:pt-0 sm:text-2xl"
              >
                <span className="inline-flex flex-wrap" aria-label="Разрабатываем">
                  {"Разрабатываем".split("").map((char, i) => (
                    <span key={`crm-${i}`} className="crm-char inline-block">
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
                <span
                  className="inline-flex min-h-[1.35em] min-w-[12ch] max-w-[min(100%,26rem)] justify-start text-left font-heading text-[1em] text-primary [text-shadow:0_0_18px_rgba(102,179,255,0.28)]"
                >
                  <TypingEffect
                    texts={typingTexts}
                    orchestrations={typingOrchestrations}
                    className="min-w-[12ch] max-w-[min(100%,26rem)] justify-start text-left font-heading text-[1em] text-primary"
                    rotationInterval={2800}
                    typingSpeed={88}
                    deleteSpeed={48}
                  />
                </span>
              </div>
            ) : null}

            {tagline ? (
              <p className="max-w-[34rem] text-[0.98rem] leading-7 text-white/70 sm:text-base">{tagline}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <button
              type="button"
              onClick={() => openContactModal()}
              onMouseEnter={() => {
                setPrimaryCtaCollapseToRight(false);
                setPrimaryCtaHovered(false);
                window.requestAnimationFrame(() => {
                  setPrimaryCtaHovered(true);
                });
              }}
              onMouseLeave={() => {
                setPrimaryCtaCollapseToRight(true);
                setPrimaryCtaHovered(false);
              }}
              className="relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/85 bg-white px-10 py-5 text-lg font-semibold text-[#050b16] shadow-[0_24px_70px_rgba(255,255,255,0.22)] sm:px-12 sm:py-5 sm:text-xl"
            >
              <span
                className="absolute inset-0 bg-black transition-[clip-path] duration-500 ease-out"
                style={{
                  clipPath: primaryCtaHovered
                    ? "circle(160% at 2% 50%)"
                    : primaryCtaCollapseToRight
                      ? "circle(0% at 100% 50%)"
                      : "circle(0% at 2% 50%)",
                }}
                aria-hidden
              />
              <span
                className={`relative z-10 transition-colors duration-300 ${
                  primaryCtaHovered ? "text-white" : "text-[#050b16]"
                }`}
              >
                {buttonText}
              </span>
            </button>

            <a
              href="#cases"
              onClick={(event) => handleInPageAnchorClick(event, "#cases")}
              className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-10 py-5 text-center text-lg font-medium text-white/90 backdrop-blur transition hover:border-white/25 hover:bg-white/10 sm:w-auto sm:px-12 sm:py-5 sm:text-xl"
            >
              {secondaryButtonText}
            </a>
          </div>

          <div
            ref={metricsRef}
            className="mt-12 flex max-w-[52rem] flex-row flex-wrap items-start gap-x-10 gap-y-6 pt-2 sm:mt-14 sm:gap-x-12 lg:mt-16 lg:gap-x-16"
          >
            {metrics.map((metric, index) => {
              const { suffix } = parseMetricValue(metric.value);
              return (
              <div key={metric.label} className="flex min-w-[5.5rem] flex-1 flex-col items-start sm:min-w-0">
                <span
                  ref={(el) => {
                    metricValueRefs.current[index] = el;
                  }}
                  className="font-heading text-[2.35rem] leading-none text-white tabular-nums sm:text-[2.75rem] lg:text-[3.1rem]"
                >
                  {`0${suffix}`}
                </span>
                <p className="mt-2 max-w-[14rem] text-[0.75rem] leading-snug opacity-60 sm:text-sm">{metric.label}</p>
              </div>
            );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
