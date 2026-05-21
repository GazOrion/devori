"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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

  return (
    <header className="sticky top-0 z-50 border-b border-[#07111f]/8 bg-[#f4f7ff]/95 backdrop-blur-md">
      <div className="flex w-full items-center justify-between gap-4 px-[5vw] py-4 md:px-[6vw] lg:px-[7vw] lg:py-5">
        <Link
          href="/"
          className="group mr-auto flex min-w-0 shrink items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-[#66B3FF]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f7ff]"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center">
            <Image
              src="/logo.svg"
              alt=""
              width={843}
              height={817}
              className="h-10 w-10 object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              priority
            />
          </span>
          <span className="inline-flex min-w-[6.5ch] shrink-0 items-baseline text-[2.2rem] font-semibold leading-none tracking-[0.04em] md:min-w-[7ch] md:text-[3.2rem]">
            <span className="text-[#66B3FF]">dev</span>
            <span className="text-[#07111f]">ori</span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-5 sm:gap-6">
          <Link
            href="/"
            className="relative shrink-0 rounded-full px-4 py-2 text-sm font-medium text-[#07111f] outline-none transition-colors duration-200 ease-out hover:text-[#07111f] focus-visible:ring-2 focus-visible:ring-[#66B3FF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f7ff] after:pointer-events-none after:absolute after:bottom-1.5 after:left-4 after:h-px after:w-0 after:bg-[#07111f]/75 after:transition-[width] after:duration-300 after:ease-out hover:after:w-[calc(100%-2rem)] focus-visible:after:w-[calc(100%-2rem)] motion-reduce:after:transition-none sm:text-base"
          >
            На главную
          </Link>

          <button
            type="button"
            onClick={() => openContactModal()}
            className={cn(
              shineHoverClassName,
              "inline-flex h-14 min-w-[10.5rem] shrink-0 items-center justify-center rounded-full border-0 bg-[#66B3FF] px-8 text-lg font-semibold text-white shadow-none transition-colors duration-200 ease-out outline-none hover:bg-[#7abefa] focus-visible:ring-2 focus-visible:ring-[#66B3FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f7ff] sm:min-w-[11.5rem] sm:px-10 sm:text-xl",
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
