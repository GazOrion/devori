import { Quote } from "lucide-react";

import { cn } from "@/lib/utils";

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

type TestimonialsSectionProps = {
  items: Testimonial[];
  /** Тёмный фон секции — для чередования с светлыми блоками. */
  variant?: "light" | "dark";
};

export function TestimonialsSection({ items, variant = "light" }: TestimonialsSectionProps) {
  const isDark = variant === "dark";

  return (
    <>
      <h2
        className={cn(
          "max-w-[48rem] text-[2.5rem] font-heading leading-[0.95] sm:text-[3.2rem]",
          isDark ? "text-white" : "text-[#07111f]",
        )}
      >
        Что говорят партнёры после запуска и сопровождения продуктов
      </h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
        {items.map((t) => (
          <figure
            key={`${t.author}-${t.company}`}
            className={cn(
              "group relative flex h-full flex-col rounded-[1.75rem] border p-6 transition-[border-color,box-shadow] duration-300 md:p-7",
              isDark
                ? "border-white/12 bg-white/[0.08] shadow-[0_20px_56px_rgba(0,0,0,0.35)] backdrop-blur md:hover:border-[#66B3FF]/35 md:hover:shadow-[0_24px_64px_rgba(102,179,255,0.15)]"
                : "border-[#07111f]/8 bg-white shadow-[0_20px_56px_rgba(7,17,31,0.07)] md:hover:border-[#66B3FF]/25 md:hover:shadow-[0_24px_64px_rgba(102,179,255,0.12)]",
            )}
          >
            <Quote
              className={cn(
                "h-9 w-9 md:h-10 md:w-10",
                isDark ? "text-[#9ecfff]" : "text-[#66B3FF]/75",
              )}
              aria-hidden
              strokeWidth={1.25}
            />
            <blockquote
              className={cn(
                "mt-5 flex-1 text-[0.98rem] leading-7 md:text-base md:leading-7",
                isDark ? "text-white/88" : "text-[#07111f]/88",
              )}
            >
              <p className="font-medium">{t.quote}</p>
            </blockquote>
            <figcaption
              className={cn(
                "mt-6 border-t pt-5",
                isDark ? "border-white/12" : "border-[#07111f]/8",
              )}
            >
              <p
                className={cn(
                  "font-heading text-base",
                  isDark ? "text-white" : "text-[#07111f]",
                )}
              >
                {t.author}
              </p>
              <p className={cn("mt-1 text-sm", isDark ? "text-white/55" : "text-[#07111f]/55")}>
                {[t.role, t.company].filter(Boolean).join(" · ")}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
