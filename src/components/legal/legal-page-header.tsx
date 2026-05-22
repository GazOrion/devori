"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useContactModal } from "@/components/ui/contact-modal-context";
import { shineHoverClassName } from "@/components/ui/shine-hover";
import { cn } from "@/lib/utils";

export type LegalBreadcrumb = {
  label: string;
  href?: string;
};

type LegalPageHeaderProps = {
  breadcrumbs: LegalBreadcrumb[];
};

export function LegalPageHeader({ breadcrumbs }: LegalPageHeaderProps) {
  const { openContactModal } = useContactModal();
  const barRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const homeLinkRef = useRef<HTMLAnchorElement>(null);
  const [stackHomeLink, setStackHomeLink] = useState(false);

  useEffect(() => {
    const bar = barRef.current;
    const logo = logoRef.current;
    const actions = actionsRef.current;
    const homeLink = homeLinkRef.current;
    if (!bar || !logo || !actions || !homeLink) return;

    const updateLayout = () => {
      const gap = 10;
      const logoRight = logo.getBoundingClientRect().right;
      const actionsLeft = actions.getBoundingClientRect().left;
      const homeLeft = homeLink.getBoundingClientRect().left;
      const contactButton = actions.querySelector("button");
      const rowNeeds =
        homeLink.offsetWidth + (contactButton?.offsetWidth ?? 0) + gap;

      setStackHomeLink((current) => {
        if (current) {
          return actionsLeft - logoRight < rowNeeds;
        }

        return logoRight + gap >= homeLeft;
      });
    };

    updateLayout();

    const observer = new ResizeObserver(updateLayout);
    observer.observe(bar);
    observer.observe(logo);
    observer.observe(actions);
    observer.observe(homeLink);

    window.addEventListener("resize", updateLayout);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#07111f]/8 bg-[#f4f7ff]/95 backdrop-blur-md">
      <div
        ref={barRef}
        className="flex w-full items-center justify-between gap-2 px-[5vw] py-4 sm:gap-4 md:px-[6vw] lg:px-[7vw] lg:py-5"
      >
        <Link
          ref={logoRef}
          href="/"
          className="group flex min-w-0 shrink-0 items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#66B3FF]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f7ff] sm:gap-3"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center sm:h-14 sm:w-14">
            <Image
              src="/logo.svg"
              alt=""
              width={843}
              height={817}
              className="h-8 w-8 object-contain transition-transform duration-500 ease-out group-hover:scale-105 sm:h-10 sm:w-10"
              priority
            />
          </span>
          <span className="inline-flex min-w-[6.5ch] shrink-0 items-baseline text-[1.65rem] font-semibold leading-none tracking-[0.04em] sm:text-[2.2rem] md:min-w-[7ch] md:text-[3.2rem]">
            <span className="text-[#66B3FF]">dev</span>
            <span className="text-[#07111f]">ori</span>
          </span>
        </Link>

        <div
          ref={actionsRef}
          className={cn(
            "ml-auto flex shrink-0 items-center gap-2 sm:gap-6",
            stackHomeLink ? "flex-col items-end gap-1" : "flex-row",
          )}
        >
          <Link
            ref={homeLinkRef}
            href="/"
            className={cn(
              "relative min-w-0 shrink rounded-full px-2.5 py-1.5 text-xs font-medium text-[#07111f] outline-none transition-colors duration-200 ease-out hover:text-[#07111f] focus-visible:ring-2 focus-visible:ring-[#66B3FF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f7ff] after:pointer-events-none after:absolute after:bottom-1 after:left-2.5 after:h-px after:w-0 after:bg-[#07111f]/75 after:transition-[width] after:duration-300 after:ease-out hover:after:w-[calc(100%-1.25rem)] focus-visible:after:w-[calc(100%-1.25rem)] motion-reduce:after:transition-none sm:px-4 sm:py-2 sm:text-base sm:after:bottom-1.5 sm:after:left-4 sm:hover:after:w-[calc(100%-2rem)] sm:focus-visible:after:w-[calc(100%-2rem)]",
              stackHomeLink && "order-2",
            )}
          >
            На главную
          </Link>

          <button
            type="button"
            onClick={() => openContactModal()}
            className={cn(
              shineHoverClassName,
              "inline-flex h-10 min-w-[7.25rem] shrink-0 items-center justify-center rounded-full border-0 bg-[#66B3FF] px-5 text-sm font-semibold text-white shadow-none transition-colors duration-200 ease-out outline-none hover:bg-[#7abefa] focus-visible:ring-2 focus-visible:ring-[#66B3FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f7ff] sm:h-14 sm:min-w-[10.5rem] sm:px-8 sm:text-lg md:min-w-[11.5rem] md:px-10 md:text-xl",
              stackHomeLink && "order-1",
            )}
          >
            Связаться
          </button>
        </div>
      </div>

      {breadcrumbs.length > 0 ? (
        <nav
          aria-label="Хлебные крошки"
          className="w-full px-[5vw] pb-4 md:px-[6vw] lg:px-[7vw]"
        >
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.82rem] text-[#4a5a75] sm:text-[0.86rem]">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <li key={`${item.label}-${index}`} className="inline-flex min-w-0 items-center gap-1.5">
                  {index > 0 ? (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#07111f]/35" aria-hidden />
                  ) : null}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="truncate font-medium text-[#2e78ff] underline-offset-4 transition hover:text-[#66B3FF] hover:underline"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={cn("truncate", isLast ? "font-medium text-[#07111f]" : "text-[#4a5a75]")}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}
    </header>
  );
}
