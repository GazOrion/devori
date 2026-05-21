"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { HeroSection } from "@/components/ui/dynamic-hero";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import {
  portfolioCasesBottom,
  portfolioCasesTop,
  toFluidGridCases,
} from "@/data/portfolio-cases";
import { FluidExpandingGrid } from "@/components/ui/fluid-expanding-grid";
import { FaqAccordionBlock } from "@/components/ui/faq-accordion-block";
import { ProcessScrollCards } from "@/components/ui/process-scroll-cards";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TeamMarqueeSection } from "@/components/ui/team-marquee-section";
import { teamMembers } from "@/data/team-members";
import { TestimonialsSection } from "@/components/ui/testimonials-section";
import { SiteFooter } from "@/components/ui/site-footer";
import { ProductValueSection } from "@/components/ui/product-value-section";
import { CtaRevealButton } from "@/components/ui/cta-reveal-button";
import { ShineHover } from "@/components/ui/shine-hover";
import { ContactModalProvider, useContactCtaHandler } from "@/components/ui/contact-modal-context";
import {
  WorkFormatsPricing,
  type WorkFormatPlan,
} from "@/components/ui/work-formats-pricing";

export function DemoOne() {
  return (
    <ContactModalProvider>
      <DemoOneContent />
    </ContactModalProvider>
  );
}

function DemoOneContent() {
  const openFooterContact = useContactCtaHandler("#contact");

  const workFormats = [
    {
      key: "team",
      eyebrow: "КОМАНДА ПОД ПРОДУКТ",
      title: "Команда под продукт",
      description: "Когда есть продуктовая цель, roadmap и нужна гибкость в решениях.",
      items: [
        "Выделенная команда: product, дизайн, frontend, backend, QA",
        "Участие в продуктовых решениях",
        "Итеративная разработка и приоритизация",
        "Гибкое планирование и адаптация",
      ],
      icon: Users,
      featured: false,
    },
    {
      key: "scope",
      eyebrow: "РЕКОМЕНДУЕМ",
      title: "Проект под задачу",
      description: "Когда требования чёткие и объём можно зафиксировать заранее.",
      items: [
        "Фиксированные требования и объём работ",
        "Чёткие этапы и контрольные точки",
        "Предсказуемый бюджет и сроки",
        "Прозрачная отчётность и приёмка",
      ],
      icon: Target,
      featured: true,
    },
    {
      key: "support",
      eyebrow: "ПОДДЕРЖКА И РАЗВИТИЕ",
      title: "Поддержка и рост продукта",
      description: "Когда продукт запущен и нужно обеспечивать стабильность и развитие.",
      items: [
        "Поддержка и исправление ошибок",
        "SLA и мониторинг 24/7",
        "Аналитика и отслеживание метрик",
        "Рост бэклога и новые улучшения",
      ],
      icon: TrendingUp,
      featured: false,
    },
  ] as const;
  const comparisonByKey = {
    scope: {
      launchSpeed: "Быстрый старт после фиксации ТЗ",
      flexibility: "Низкая гибкость",
      bestFor: "Проекты с чёткими требованиями",
      pricing: "Фиксированная цена за проект",
    },
    team: {
      launchSpeed: "Средний старт, далее — быстро",
      flexibility: "Высокая гибкость",
      bestFor: "Продукты с roadmap и гипотезами",
      pricing: "Фикс за спринт / помесячно",
    },
    support: {
      launchSpeed: "Быстрый старт",
      flexibility: "Очень высокая гибкость",
      bestFor: "Запущенные продукты и сервисы",
      pricing: "Помесячная подписка / SLA",
    },
  } as const;
  const [activeFormatKey, setActiveFormatKey] = useState<(typeof workFormats)[number]["key"]>("scope");
  const activeFormat = workFormats.find((format) => format.key === activeFormatKey) ?? workFormats[1];
  const activeComparison = comparisonByKey[activeFormatKey];

  const workFormatPlans: WorkFormatPlan[] = workFormats.map((format) => ({
    planKey: format.key,
    name: format.title,
    description: format.description,
    price: comparisonByKey[format.key].pricing,
    features: [...format.items],
    buttonText: "Подходит для моего проекта",
    href: "#contact",
    isPopular: format.featured,
    popularBadge: format.eyebrow,
  }));

  const serviceCardImages = [
    "/services/2pack/1.png",
    "/services/2pack/2.png",
    "/services/2pack/3.png",
    "/services/2pack/4.png",
  ] as const;

  const services = [
    {
      title: "Разработка с нуля",
      description:
        "Проектируем и запускаем сайты, приложения и внутренние платформы под цели бизнеса и реальную нагрузку.",
      footer: "От идеи до production",
      imageSrc: serviceCardImages[0],
    },
    {
      title: "Техническая поддержка",
      description:
        "Берем продукт на сопровождение, закрываем баги, дорабатываем функциональность и держим стабильность релизов.",
      footer: "SLA и приоритеты",
      imageSrc: serviceCardImages[1],
    },
    {
      title: "Аутсорсинг",
      description:
        "Подключаем специалистов в команду клиента: frontend, backend, QA, PM и дизайн в удобном для вас формате.",
      footer: "Гибкое масштабирование",
      imageSrc: serviceCardImages[2],
    },
    {
      title: "Мониторинг и SLA",
      description:
        "Отслеживаем доступность, быстро диагностируем причины сбоев и восстанавливаем работоспособность сервиса.",
      footer: "Контроль 24/7",
      imageSrc: serviceCardImages[3],
    },
  ];

  const casesRow1 = toFluidGridCases(portfolioCasesTop);
  const casesRow2 = portfolioCasesBottom;

  const processItems = [
    {
      step: "01 / Discovery",
      title: "Погружение в задачу",
      description:
        "Уточняем контекст, составляем ТЗ и договор, чтобы с первого спринта двигаться по приоритетам, а не по догадкам.",
      bullets: ["Контекст и приоритеты", "ТЗ", "Договор"],
    },
    {
      step: "02 / Product",
      title: "Разработка продукта",
      description:
        "Делаем дизайн, код и интеграции короткими итерациями, чтобы показывать результат быстро и без разрыва между идеей и реализацией.",
      bullets: ["Дизайн", "Код и интеграции", "Быстрые итерации"],
    },
    {
      step: "03 / QA",
      title: "Тестирование",
      description:
        "Проверяем функциональность, производительность и устойчивость на реальных задачах. Устраняем баги и успешно запускаем продукт.",
      bullets: ["Функциональность и перформанс", "Реальные сценарии", "Без багов к релизу"],
    },
    {
      step: "04 / Launch",
      title: "Запуск и развитие",
      description:
        "Выводим в production, настраиваем мониторинг и продолжаем улучшать продукт после старта, а не бросаем его после релиза.",
      bullets: ["Production", "Мониторинг", "Развитие после старта"],
    },
  ];

  const testimonials = [
    {
      quote:
        "Команда закрыла и дизайн, и фронт под ключ: сроки держали, на встречах говорили по делу, без лишнего «агентского» шума",
      author: "Дмитрий Колесов",
      role: "Руководитель продукта",
      company: "B2B-сервис",
    },
    {
      quote:
        "После релиза лендинга заметили рост заявок и меньше вопросов от отдела продаж — интерфейс наконец-то объясняет продукт без созвона",
      author: "Елена Викторова",
      role: "CMO",
      company: "AI-стартап",
    },
    {
      quote:
        "Взяли CRM в поддержку: баги чинят быстро, доработки оценивают честно, релизы перестали ломать то, что уже работает",
      author: "Артём Савин",
      role: "CTO",
      company: "EdTech",
    },
  ];

  const faqItems = [
    {
      question: "С какими проектами вы обычно работаете?",
      answer:
        "Чаще всего это CRM-системы, личные кабинеты, корпоративные сайты, продуктовые лендинги, AI-инструменты, боты и внутренние сервисы.",
    },
    {
      question: "Вы делаете только дизайн или можете реализовать проект целиком?",
      answer:
        "Можем зайти на этапе дизайна и закрыть весь frontend-цикл: UX, UI, дизайн-систему, разработку, анимацию и запуск.",
    },
    {
      question: "Можно ли прийти только с идеей без готового ТЗ?",
      answer:
        "Да. Поможем структурировать задачу, определить приоритеты и сформировать понятный план запуска.",
    },
    {
      question: "Как организована работа по срокам?",
      answer:
        "Работаем спринтами: анализ, проектирование, разработка, тестирование, запуск и дальнейшее развитие.",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="Разрабатываем IT-продукты, необходимые бизнесу"
        buttonText="Обсудить проект"
        secondaryButtonText="Открыть кейсы"
        companyName="devori"
        typingTexts={["CRM-системы", "сложные IT-решения", "лендинги", "сайты", "ботов", "приложения"]}
        typingOrchestrations={{
          1: [
            { type: "type", text: "сложные ит-реш" },
            { type: "delete", until: "сложные" },
            { type: "type", text: " it" },
            { type: "delete", until: "сложные" },
            { type: "type", text: " IT-решения" },
          ],
        }}
        metrics={[
          { value: "15+", label: "старших специалистов в дизайне и разработке" },
          { value: "3x", label: "быстрее путь от идеи до релиза" },
          { value: "98%", label: "решений собираем на компонентной системе" },
        ]}
        navItems={[
          { id: "services", label: "Услуги", href: "#services" },
          { id: "formats", label: "Форматы", href: "#formats" },
          { id: "cases", label: "Кейсы", href: "#cases" },
          { id: "testimonials", label: "Отзывы", href: "#testimonials" },
        ]}
      />

      <div className="relative z-30 -mt-24 overflow-x-hidden overflow-y-visible rounded-t-[3.25rem] bg-[#d8dde5] pt-0 pb-0">
        <section id="services" className="relative z-10 w-full rounded-[3.25rem] bg-[#f4f7ff]">
          <ScrollReveal className="mx-auto w-full max-w-[1680px] px-[5vw] pt-28 pb-40 md:px-[6vw] lg:px-[7vw]">
            <h2 className="max-w-[46rem] text-[2.5rem] font-heading leading-[0.95] text-[#07111f] sm:text-[3.4rem]">
              Услуги и направления
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:items-stretch lg:gap-5">
              {services.map((service) => (
                <SpotlightCard key={service.title} {...service} />
              ))}
            </div>
          </ScrollReveal>
        </section>

        <ProductValueSection />

        <section id="formats" className="relative z-30 -mt-24 w-full rounded-[3.25rem] bg-[#f4f7fb]">
          <ScrollReveal className="mx-auto w-full max-w-[1680px] px-[5vw] pt-28 pb-40 md:px-[6vw] lg:px-[7vw]">
              <h2 className="max-w-[56rem] text-[2.5rem] font-heading leading-[0.94] text-[#081123] sm:text-[3.15rem]">
                Подбираем формат работы под срок, бюджет и степень неопределённости
              </h2>
              <p className="mt-5 max-w-[50rem] text-[1.04rem] leading-relaxed text-[#3e4d66]">
                Входим в проект как продуктовая команда, партнёр по разработке или партнёр по поддержке и росту — в
                зависимости от ваших целей.
              </p>

              <WorkFormatsPricing
                className="mt-10"
                plans={workFormatPlans}
                selectedKey={activeFormatKey}
                onSelect={(key) => setActiveFormatKey(key as (typeof workFormats)[number]["key"])}
              />

              <div
                className="mt-8 rounded-[1.4rem] border border-[#dbe5f4] bg-white px-6 py-5 transition-opacity duration-300 sm:px-7 sm:py-6"
                aria-live="polite"
              >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(16rem,22rem)_1fr] lg:items-start lg:gap-x-10">
                  <div>
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.13em] text-[#6d7f9f]">
                      Выбранный формат
                    </p>
                    <p className="mt-2 text-[1.6rem] leading-[1.04] text-[#0b1324]">{activeFormat.title}</p>
                    <p className="mt-3 text-[1rem] leading-relaxed text-[#4f607d]">{activeFormat.description}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 text-[0.98rem] text-[#41516e]">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#66B3FF]" />
                      <div>
                        <p className="font-semibold text-[#0d1a31]">Скорость запуска</p>
                        <p className="mt-0.5">{activeComparison.launchSpeed}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#66B3FF]" />
                      <div>
                        <p className="font-semibold text-[#0d1a31]">Гибкость</p>
                        <p className="mt-0.5">{activeComparison.flexibility}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Target className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#66B3FF]" />
                      <div>
                        <p className="font-semibold text-[#0d1a31]">Подходит для</p>
                        <p className="mt-0.5">{activeComparison.bestFor}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#66B3FF]" />
                      <div>
                        <p className="font-semibold text-[#0d1a31]">Как считаем стоимость</p>
                        <p className="mt-0.5">{activeComparison.pricing}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden">
                <div className="grid grid-cols-4 gap-6 text-[0.96rem] text-[#41516e]">
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2 font-semibold text-[#0d1a31]">
                      <Calendar className="h-4 w-4 text-[#4a84ff]" />
                      Скорость запуска
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-[#0d1a31]">
                      <CheckCircle2 className="h-4 w-4 text-[#4a84ff]" />
                      Гибкость
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-[#0d1a31]">
                      <Target className="h-4 w-4 text-[#4a84ff]" />
                      Подходит для
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-[#0d1a31]">
                      <ShieldCheck className="h-4 w-4 text-[#4a84ff]" />
                      Как считаем стоимость
                    </div>
                  </div>
                  <div className="space-y-3.5">
                    <p>Быстрый старт после фиксации ТЗ</p>
                    <p>Низкая гибкость</p>
                    <p>Проекты с чёткими требованиями</p>
                    <p>Фиксированная цена за проект</p>
                  </div>
                  <div className="space-y-3.5">
                    <p>Средний старт, далее — быстро</p>
                    <p>Высокая гибкость</p>
                    <p>Продукты с roadmap и гипотезами</p>
                    <p>Фикс за спринт / помесячно</p>
                  </div>
                  <div className="space-y-3.5">
                    <p>Быстрый старт</p>
                    <p>Очень высокая гибкость</p>
                    <p>Запущенные продукты и сервисы</p>
                    <p>Помесячная подписка / SLA</p>
                  </div>
                </div>
              </div>

              <div className="hidden">
                <div className="rounded-2xl border border-[#dbe5f4] bg-white p-4">
                  <p className="text-sm font-semibold text-[#0d1a31]">Фиксированный scope</p>
                  <p className="mt-2 text-sm text-[#4a5a75]">Быстрый старт после фиксации ТЗ • Низкая гибкость</p>
                  <p className="mt-1 text-sm text-[#4a5a75]">Проекты с чёткими требованиями • Фиксированная цена</p>
                </div>
                <div className="rounded-2xl border border-[#dbe5f4] bg-white p-4">
                  <p className="text-sm font-semibold text-[#0d1a31]">Команда под продукт</p>
                  <p className="mt-2 text-sm text-[#4a5a75]">Средний старт, далее — быстро • Высокая гибкость</p>
                  <p className="mt-1 text-sm text-[#4a5a75]">Roadmap и гипотезы • Фикс за спринт / помесячно</p>
                </div>
                <div className="rounded-2xl border border-[#dbe5f4] bg-white p-4">
                  <p className="text-sm font-semibold text-[#0d1a31]">Поддержка и развитие</p>
                  <p className="mt-2 text-sm text-[#4a5a75]">Быстрый старт • Очень высокая гибкость</p>
                  <p className="mt-1 text-sm text-[#4a5a75]">Запущенные продукты • Подписка / SLA</p>
                </div>
              </div>


              <div className="relative mt-9 overflow-hidden rounded-[1.5rem] border border-[#17396f] bg-devori-dark p-5 sm:p-7">
                <div className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(67,132,255,0.38)_0%,rgba(67,132,255,0)_70%)]" />
                <div className="pointer-events-none absolute -right-24 -bottom-20 h-56 w-[62%] rounded-full bg-[radial-gradient(82%_120%_at_82%_58%,rgba(82,148,255,0.42)_0%,rgba(82,148,255,0.2)_34%,rgba(82,148,255,0.06)_58%,rgba(82,148,255,0)_82%)] blur-[2px]" />
                <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[1.95rem] leading-[0.98] text-white sm:text-[2.25rem]">
                      Не уверены, какой формат подойдёт?
                    </p>
                    <p className="mt-3 text-[1.05rem] text-[#b9c8e7]">Поможем выбрать на созвоне за 20 минут.</p>
                  </div>
                  <div className="lg:text-right">
                    <CtaRevealButton href="#contact" size="compact">
                      Подобрать формат работы <ArrowUpRight className="ml-2 h-4 w-4" />
                    </CtaRevealButton>
                  </div>
                </div>
              </div>
          </ScrollReveal>
        </section>

        <section id="cases" className="relative z-40 -mt-24 w-full rounded-[3.25rem] bg-devori-dark">
          <ScrollReveal className="mx-auto w-full max-w-[1680px] px-[5vw] pt-28 pb-40 md:px-[6vw] lg:px-[7vw]">
            <h2 className="max-w-[46rem] text-[2.5rem] font-heading leading-[0.95] text-white sm:text-[3.4rem]">
              Показываем не просто красивый интерфейс, а то, как он работает на результат
            </h2>
            <div className="mt-10 flex flex-col gap-4">
              <FluidExpandingGrid items={casesRow1} />
              <FluidExpandingGrid items={casesRow2} />
            </div>
          </ScrollReveal>
        </section>

        <section
          aria-labelledby="cases-cta-heading"
          className="relative z-[42] -mt-24 w-full rounded-[3.25rem] bg-[#f8fbff]"
        >
          <ScrollReveal className="mx-auto w-full max-w-[1680px] px-[5vw] pt-28 pb-40 md:px-[6vw] lg:px-[7vw]">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="max-w-[46rem]">
                <h2
                  id="cases-cta-heading"
                  className="text-[2.5rem] font-heading leading-[0.95] text-[#07111f] sm:text-[3.4rem]"
                >
                  Хотите улучшить свой продукт или создать новый?
                </h2>
                <p className="mt-5 max-w-[42rem] text-[1.04rem] leading-relaxed text-[#3e4d66]">
                  После кейсов обычно остаётся главный вопрос — «а у нас получится?». На коротком созвоне
                  разберём задачу, сроки и формат работы без обязательств.
                </p>
              </div>
              <div className="shrink-0 lg:text-right">
                <ShineHover
                  href="#contact"
                  onClick={openFooterContact}
                  className="inline-flex min-w-[17rem] items-center justify-center rounded-full border-0 bg-[#66B3FF] px-12 py-4 text-lg font-semibold text-white shadow-[0_20px_50px_rgba(102,179,255,0.22)] transition-colors duration-200 ease-out outline-none hover:bg-[#7abefa] focus-visible:ring-2 focus-visible:ring-[#66B3FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8fbff] sm:min-w-[20rem] sm:px-14 sm:py-5 sm:text-xl"
                >
                  <span className="inline-flex items-center gap-3">
                    Обсудить проект
                    <ArrowUpRight className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
                  </span>
                </ShineHover>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <section
          id="approach"
          className="relative z-50 -mt-24 w-full rounded-[3.25rem] bg-devori-dark"
        >
          <div className="mx-auto min-w-0 w-full max-w-[1680px] px-[5vw] pt-24 pb-36 md:px-[6vw] lg:px-[7vw]">
            <ProcessScrollCards items={processItems} />
          </div>
        </section>

        <section id="team" className="relative z-[60] -mt-24 w-full rounded-[3.25rem] bg-[#f8fbff]">
          <div className="mx-auto w-full max-w-[1680px] px-[5vw] pt-28 pb-40 md:px-[6vw] lg:px-[7vw]">
            <TeamMarqueeSection members={teamMembers} />
          </div>
        </section>

        <section id="testimonials" className="relative z-[65] -mt-24 w-full rounded-[3.25rem] bg-devori-dark">
          <ScrollReveal className="mx-auto w-full max-w-[1680px] px-[5vw] pt-28 pb-40 md:px-[6vw] lg:px-[7vw]">
            <TestimonialsSection items={testimonials} variant="dark" />
          </ScrollReveal>
        </section>

        <section className="relative z-[70] -mt-24 w-full rounded-[3.25rem] bg-[#f8fbff]">
          <ScrollReveal className="mx-auto w-full max-w-[1200px] px-[5vw] pt-28 pb-40 md:px-[6vw] lg:px-[7vw]">
            <h2 className="max-w-[48rem] text-[2.5rem] font-heading leading-[0.95] text-[#07111f] sm:text-[3.2rem]">
              Ответы на вопросы, которые чаще всего возникают до старта проекта
            </h2>
            <div className="mt-10">
              <FaqAccordionBlock items={faqItems} />
            </div>
          </ScrollReveal>
        </section>
      </div>

      <section
        id="contact"
        className="relative z-[90] -mt-24 w-full overflow-hidden rounded-t-[3.25rem] bg-devori-dark"
      >
          <div
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            aria-hidden
          >
            <div
              className="absolute top-0 right-0 h-[148%] w-[min(100%,100vw,1320px)] -translate-x-[11vw] sm:h-[152%] sm:w-[min(100%,98vw,1650px)] sm:-translate-x-[13vw] lg:w-[min(100%,96vw,1920px)] lg:-translate-x-[15vw]"
            >
              <div className="absolute inset-y-0 right-0 left-0">
                <div className="relative h-full w-full">
                  <Image
                    src="/footerimg.png"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 1920px"
                    className="object-contain object-right object-bottom origin-bottom-right scale-[0.76] -translate-y-28 sm:scale-[0.74] sm:-translate-y-40 lg:-translate-y-48"
                    quality={95}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[92%] bg-gradient-to-r from-devori-dark from-45% via-devori-dark/75 to-transparent sm:w-[78%] sm:from-40% md:w-[68%]"
            aria-hidden
          />

          <ScrollReveal className="relative z-10 mx-auto w-full max-w-[1680px] px-[5vw] pt-28 pb-12 md:px-[6vw] lg:px-[7vw]">
            <div className="max-w-[38rem]">
              <h2 className="text-[2.4rem] font-heading leading-[0.95] text-white sm:text-[3.2rem]">
                Расскажите нам о вашей задаче — мы придумаем решение, которое вам понравится
              </h2>

              <div className="mt-9">
                <ShineHover
                  href="#contact"
                  onClick={openFooterContact}
                  className="inline-flex min-w-[15rem] shrink-0 items-center justify-center rounded-full border-0 bg-[#66B3FF] px-10 py-3.5 text-base font-semibold text-white shadow-none transition-colors duration-200 ease-out outline-none hover:bg-[#7abefa] focus-visible:ring-2 focus-visible:ring-[#66B3FF] focus-visible:ring-offset-2 focus-visible:ring-offset-devori-dark sm:min-w-[17rem] sm:px-12 sm:py-4 sm:text-lg"
                >
                  <span className="inline-flex items-center gap-3">
                    Связаться
                    <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
                  </span>
                </ShineHover>
              </div>
            </div>
          </ScrollReveal>
      </section>

      <SiteFooter />
    </div>
  );
}
