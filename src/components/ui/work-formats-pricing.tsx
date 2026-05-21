"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useContactCtaHandler } from "@/components/ui/contact-modal-context";
import { cn } from "@/lib/utils";

function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const result = matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setValue(event.matches);
    result.addEventListener("change", onChange);
    setValue(result.matches);
    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}

export type WorkFormatPlan = {
  planKey: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  buttonText: string;
  href: string;
  isPopular?: boolean;
  popularBadge?: string;
};

type WorkFormatsPricingProps = {
  plans: WorkFormatPlan[];
  selectedKey: string;
  onSelect: (key: string) => void;
  className?: string;
};

function WorkFormatCard({
  plan,
  index,
  isSelected,
  onSelect,
}: {
  plan: WorkFormatPlan;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isCenter = index === 1;
  const isSide = index === 0 || index === 2;
  const openContact = useContactCtaHandler(plan.href);

  return (
    <motion.article
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.15,
      }}
      className={cn(
        "relative box-border flex h-full w-full flex-col rounded-2xl border-2 p-8 text-left backdrop-blur-sm",
        "bg-white/70 shadow-lg transition-[border-color,box-shadow,ring-color] duration-300",
        isSide && "lg:min-h-0",
        isCenter && isDesktop && "z-[2] lg:-translate-y-5",
        isSelected
          ? "border-[#2e78ff] shadow-[0_20px_48px_rgba(46,120,255,0.18)] ring-2 ring-[#2e78ff]/20"
          : "border-[#dbe5f4] ring-2 ring-transparent",
        "cursor-pointer",
      )}
    >
      {plan.isPopular ? (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-1.5 rounded-full bg-[#2e78ff] px-4 py-1.5">
            <Star className="h-4 w-4 fill-white text-white" aria-hidden />
            <span className="text-sm font-semibold text-white">
              {plan.popularBadge ?? "Рекомендуем"}
            </span>
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col">
        <h3 className="font-display text-[1.75rem] font-extralight leading-tight tracking-[-0.03em] text-[#0b1324] sm:text-[2rem]">
          {plan.name}
        </h3>
        <p className="mt-2 text-[16px] text-[#51617b]">{plan.description}</p>

        <p className="mt-6 text-[1.15rem] font-semibold leading-snug text-[#0d1a31] sm:text-[1.25rem]">
          {plan.price}
        </p>

        <ul className="mt-8 flex flex-col gap-3 text-left text-[14px] text-[#4a5a75]">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-x-3">
              <Check className="h-5 w-5 shrink-0 text-[#2e78ff]" aria-hidden />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <Link
            href={plan.href}
            onClick={(event) => {
              event.stopPropagation();
              openContact(event);
            }}
            className={cn(
              "inline-flex w-full items-center justify-center rounded-xl py-2.5 text-[14px] font-semibold transition-colors",
              isSelected
                ? "bg-[#2e78ff] text-white hover:bg-[#2569e6]"
                : "bg-[#66B3FF] text-white hover:bg-[#7abefa]",
            )}
          >
            {plan.buttonText}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function WorkFormatsPricing({
  plans,
  selectedKey,
  onSelect,
  className,
}: WorkFormatsPricingProps) {
  return (
    <div className={cn("relative w-full pt-4", className)}>
      <div className="mx-auto grid max-w-[88rem] grid-cols-1 items-stretch gap-8 px-2 sm:px-4 lg:grid-cols-3 lg:gap-10 lg:pt-5">
        {plans.map((plan, index) => (
          <WorkFormatCard
            key={plan.planKey}
            plan={plan}
            index={index}
            isSelected={plan.planKey === selectedKey}
            onSelect={() => onSelect(plan.planKey)}
          />
        ))}
      </div>
    </div>
  );
}
