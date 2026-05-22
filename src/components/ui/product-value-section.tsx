"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Eye,
  Layers,
  LineChart,
  ListChecks,
  Users,
  Workflow,
  LifeBuoy,
  Zap,
} from "lucide-react";
import { useContactCtaHandler } from "@/components/ui/contact-modal-context";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ShineBorder } from "@/components/ui/shine-border";
import sectionHeading from "@/components/ui/section-heading.module.css";

const accent = "text-[#5eb0ff]";

const benefitCards: {
  title: string;
  description: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "Один подрядчик вместо трёх",
    description:
      "Берём на себя весь цикл: дизайн, frontend, backend и интеграции. Никаких разрывов и перекладывания ответственности.",
    Icon: Layers,
  },
  {
    title: "Прозрачные этапы и сроки",
    description:
      "Чёткие этапы, фиксированные дедлайны и понятные критерии приёмки. Вы всегда знаете, на каком этапе проект.",
    Icon: ListChecks,
  },
  {
    title: "Системы под реальные процессы",
    description:
      "Проектируем логику под ваш бизнес, а не подстраиваем процессы под стандартные решения и шаблонные функции.",
    Icon: Workflow,
  },
  {
    title: "Поддержка после релиза",
    description:
      "Исправляем ошибки, помогаем расти и масштабироваться. Мониторинг, развитие и SLA в одном договоре.",
    Icon: LifeBuoy,
  },
  {
    title: "Команда под задачу",
    description:
      "Собираем сильную команду: product, дизайн, frontend, backend, QA — только под ваш продукт и цели.",
    Icon: Users,
  },
  {
    title: "Фокус на окупаемости",
    description:
      "Автоматизируем рутину, сокращаем издержки и увеличиваем выручку. Измеряем эффект и предлагаем решения, которые окупаются.",
    Icon: LineChart,
  },
];

const outcomeBlocks: {
  title: string;
  description: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "быстрее запуск",
    description: "Выходим в продакшн предсказуемо и без срывов сроков.",
    Icon: Zap,
  },
  {
    title: "меньше ручной рутины",
    description: "Автоматизируем операции и высвобождаем время команды.",
    Icon: ArrowDown,
  },
  {
    title: "прозрачность процессов",
    description: "Все данные, задачи и статусы в одной системе и у всех на виду.",
    Icon: Eye,
  },
];

export function ProductValueSection() {
  const openDiscussTask = useContactCtaHandler("#contact");

  return (
    <section
      id="product-value"
      className="relative z-20 -mt-24 w-full overflow-hidden rounded-[3.25rem] bg-devori-dark"
      aria-labelledby="product-value-heading"
    >
      <ScrollReveal className="relative mx-auto w-full max-w-[1680px] px-[5vw] pt-28 pb-40 md:px-[6vw] lg:px-[7vw]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_min(100%,380px)] lg:items-stretch lg:gap-12 xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="min-w-0 lg:min-h-0">
            <h2
              id="product-value-heading"
              className={`max-w-[56rem] font-heading ${sectionHeading.heading} ${sectionHeading.dark}`}
            >
              Берём продукт в работу так, чтобы он приносил{" "}
              <span className={accent}>результат</span>, а не создавал хаос
            </h2>
            <p className="mt-5 max-w-[50rem] text-[1.04rem] leading-relaxed text-[#8fa3c4]">
              Проектируем, разрабатываем, поддерживаем и развиваем внутренние системы, клиентские порталы, CRM и продукты
              автоматизации.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
              {benefitCards.map(({ title, description, Icon }) => (
                <article
                  key={title}
                  className="group/service relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-white/[0.07] bg-[linear-gradient(155deg,rgba(14,20,36,0.95),rgba(8,12,24,0.92))] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-[rgba(96,165,250,0.22)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.42),0_0_0_1px_rgba(59,130,246,0.08)]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-[70px] -top-[80px] h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover/service:opacity-100"
                  />
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(155deg,#0f1729,#151d32)] text-[#6fa6ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="mt-4 text-[1.05rem] font-semibold leading-snug text-white sm:text-[1.08rem]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[0.94rem] leading-relaxed text-[#8fa3c4] sm:text-[0.97rem]">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="relative flex h-full min-h-[26rem] flex-col sm:min-h-[28rem] lg:min-h-0">
            <ShineBorder
              animated
              borderWidth={2}
              duration={14}
              color={["#3d8cff", "#5aa8ff", "#8ec6ff"]}
              surfaceClassName="bg-[linear-gradient(165deg,#010408_0%,#030812_38%,#060d18_100%)]"
              className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.5rem] border border-[#0a1428]/90 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:rounded-[1.75rem]"
            >
              <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
                <div className="absolute -right-10 top-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(50,100,200,0.22)_0%,transparent_72%)] blur-md" />
                <div className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(60,110,200,0.08)_0%,transparent_75%)] blur-xl" />
                <div
                  className="absolute inset-x-0 bottom-0 h-[42%] opacity-[0.38]"
                  style={{
                    background:
                      "repeating-linear-gradient(115deg, transparent, transparent 10px, rgba(40,80,150,0.06) 10px, rgba(40,80,150,0.06) 11px), linear-gradient(to top, rgba(15,40,90,0.28), transparent 58%)",
                  }}
                />
                <div className="absolute -bottom-6 left-[-20%] right-[-20%] h-24 bg-[radial-gradient(ellipse_at_center,rgba(40,90,180,0.18)_0%,transparent_74%)] blur-2xl" />
              </div>

              <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col rounded-[inherit] bg-[linear-gradient(165deg,#010408_0%,#030812_42%,#070f1a_100%)] p-6 sm:p-7 md:p-8">
                <span className="inline-flex max-w-full shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b8cceb] backdrop-blur-sm">
                  В итоге вы получаете
                </span>

                <ul className="mt-8 flex min-h-0 flex-1 flex-col gap-0">
                  {outcomeBlocks.map(({ title, description, Icon }, index) => (
                    <li
                      key={title}
                      className={[
                        "group/service flex gap-4 py-5 first:pt-0",
                        index > 0 ? "border-t border-white/[0.08]" : "",
                      ].join(" ")}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#7ab3ff] shadow-[0_0_24px_rgba(90,150,255,0.22)]">
                        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[1.02rem] font-semibold text-white">{title}</p>
                        <p className="mt-1.5 text-[0.94rem] leading-relaxed text-[#9cb0d4]">{description}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="relative z-10 mt-auto flex shrink-0 flex-col gap-3 pt-8 sm:pt-10">
                  <a
                    href="#contact"
                    onClick={openDiscussTask}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2e78ff] px-5 py-3.5 text-[0.98rem] font-semibold text-white shadow-[0_12px_32px_rgba(46,120,255,0.35)] transition hover:bg-[#2a6ee8]"
                  >
                    Обсудить задачу
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
                  </a>
                  <a
                    href="#cases"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-5 py-3.5 text-[0.98rem] font-semibold text-white backdrop-blur-sm transition hover:border-white/28 hover:bg-white/[0.08]"
                  >
                    Посмотреть кейсы
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                  </a>
                </div>
              </div>
            </ShineBorder>
          </aside>
        </div>
      </ScrollReveal>
    </section>
  );
}
