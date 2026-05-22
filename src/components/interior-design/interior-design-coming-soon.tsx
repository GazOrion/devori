"use client";

import Link from "next/link";
import { ArrowUpRight, LayoutGrid, Layers, Sparkles } from "lucide-react";

import { LegalPageHeader } from "@/components/legal/legal-page-header";
import { useContactModal } from "@/components/ui/contact-modal-context";
import sectionHeading from "@/components/ui/section-heading.module.css";
import { shineHoverClassName } from "@/components/ui/shine-hover";
import { cn } from "@/lib/utils";

import styles from "./interior-design-coming-soon.module.css";

const DIRECTION_BLOCKS = [
  {
    icon: LayoutGrid,
    title: "Планировки и зонирование",
    note: "Схемы, планы, расстановка мебели",
  },
  {
    icon: Layers,
    title: "Материалы и свет",
    note: "Палитры, текстуры, сценарии освещения",
  },
  {
    icon: Sparkles,
    title: "Визуализации",
    note: "3D-рендеры и презентации для согласования",
  },
] as const;

const ROADMAP = [
  "Презентация направления и форматов работы",
  "Портфолио интерьерных проектов",
  "Калькулятор и типовые пакеты услуг",
  "Онлайн-заявка с брифом объекта",
] as const;

export function InteriorDesignComingSoon() {
  const { openContactModal } = useContactModal();

  return (
    <div className="min-h-screen bg-[#f4f7ff] text-[#07111f]">
      <LegalPageHeader
        breadcrumbs={[
          { label: "Главная", href: "/" },
          { label: "Дизайн интерьеров" },
        ]}
      />

      <main className="mx-auto w-full max-w-[68rem] px-[5vw] pb-20 pt-6 sm:pb-28 sm:pt-8 md:px-[6vw] lg:px-[7vw]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-[#66B3FF]/35 bg-[#66B3FF]/10 px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.1em] text-[#2e6eb8]">
            Раздел в разработке
          </span>
          <span className="rounded-full border border-[#07111f]/12 px-2.5 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.08em] text-[#4a5a75]">
            new
          </span>
        </div>

        <h1 className={`mt-6 max-w-[44rem] font-heading ${sectionHeading.heading} ${sectionHeading.light}`}>
          Дизайн интерьеров
        </h1>
        <p className="mt-5 max-w-[40rem] text-[1.05rem] leading-relaxed text-[#4a5a75] sm:text-lg">
          devori открывает дополнительное направление — проектируем жилые и коммерческие интерьеры в той же
          продуктовой логике: от задачи бизнеса до визуального результата. Сейчас готовим презентацию
          направления и первые кейсы.
        </p>

        <div className={cn(styles.presentation, "mt-10 sm:mt-12")} aria-hidden>
          <div className={styles.presentationChrome}>
            <span className={styles.presentationDot} />
            <span className={styles.presentationDot} />
            <span className={styles.presentationDot} />
            <span className={styles.presentationLabel}>Презентация направления · черновик</span>
          </div>
          <div className={styles.presentationBody}>
            <div className={styles.presentationAside}>
              <div className={styles.sketchLine} data-wide />
              <div className={styles.sketchLine} />
              <div className={styles.sketchLine} />
              <div className={styles.sketchThumb} />
              <div className={styles.sketchThumb} />
            </div>
            <div className={styles.presentationMain}>
              <div className={styles.sketchHero} />
              <div className={styles.sketchRow}>
                <div className={styles.sketchCard} />
                <div className={styles.sketchCard} />
                <div className={styles.sketchCard} />
              </div>
            </div>
          </div>
        </div>

        <section className="mt-14 sm:mt-16" aria-labelledby="direction-blocks-title">
          <h2
            id="direction-blocks-title"
            className="font-heading text-[1.35rem] font-light tracking-[0.04em] text-[#07111f] sm:text-[1.55rem]"
          >
            Что появится в разделе
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {DIRECTION_BLOCKS.map(({ icon: Icon, title, note }) => (
              <li
                key={title}
                className="flex flex-col rounded-2xl border border-dashed border-[#07111f]/14 bg-white/70 p-5"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#66B3FF]/12 text-[#2e6eb8]">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="mt-4 font-heading text-[1.1rem] text-[#07111f]">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#4a5a75]">{note}</p>
                <span className="mt-4 text-[0.72rem] font-medium uppercase tracking-[0.08em] text-[#07111f]/40">
                  Скоро
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="mt-12 rounded-[1.75rem] border border-[#07111f]/8 bg-[#07111f] p-6 text-white sm:mt-14 sm:p-8"
          aria-labelledby="roadmap-title"
        >
          <h2 id="roadmap-title" className="font-heading text-[1.25rem] font-light tracking-[0.04em] sm:text-[1.45rem]">
            Дорожная карта публикации
          </h2>
          <ol className="mt-5 space-y-3">
            {ROADMAP.map((step, index) => (
              <li key={step} className="flex gap-3 text-[0.95rem] leading-relaxed text-white/78 sm:text-base">
                <span className="mt-0.5 shrink-0 font-mono text-sm text-[#66B3FF]/90">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-[#dbe5f4] bg-white p-6 sm:mt-14 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="font-heading text-[1.15rem] text-[#07111f] sm:text-[1.25rem]">
              Хотите обсудить интерьер уже сейчас?
            </p>
            <p className="mt-2 max-w-[28rem] text-sm leading-relaxed text-[#4a5a75] sm:text-[0.98rem]">
              Оставьте заявку — расскажем о сроках запуска направления и предварительно зафиксируем задачу.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openContactModal()}
              className={cn(
                shineHoverClassName,
                "inline-flex items-center justify-center rounded-full bg-[#66B3FF] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#7abefa] sm:text-base",
              )}
            >
              Оставить заявку
              <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[#07111f]/12 px-6 py-3.5 text-sm font-medium text-[#07111f] transition hover:border-[#66B3FF]/40 hover:text-[#2e6eb8] sm:text-base"
            >
              На главную
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
