export type PortfolioCase = {
  id: string;
  title: string;
  description: string;
  meta: string;
  beforeImage: string;
  afterImage: string;
  shortResult: string;
  imageClassName?: string;
};

export const portfolioCases: PortfolioCase[] = [
  {
    id: "case-requests",
    title: "Редизайн CRM отдела продаж",
    description:
      "Убрали разрозненные Excel-таблицы и ручные напоминания, собрали единый рабочий стол отдела продаж.",
    meta: "CRM / UX / Frontend",
    beforeImage: "/doposle/crm_before.png",
    afterImage: "/doposle/crm_after.png",
    shortResult: "+прозрачность продаж",
  },
  {
    id: "case-crm",
    title: "Платформа бизнес-автоматизации",
    description:
      "Перевели перегруженную админ-панель в понятную платформу с визуальными сценариями и живой аналитикой.",
    meta: "B2B / Dashboard / Автоматизация",
    beforeImage: "/doposle/avtomat_before.png",
    afterImage: "/doposle/avtomat_after.png",
    shortResult: "-рутина в операциях",
    imageClassName: "brightness-[1.22] contrast-[1.08] saturate-[1.04]",
  },
  {
    id: "case-support",
    title: "Сайт студии интерьеров",
    description:
      "Из типового каталожного сайта сделали атмосферный premium-лендинг с фокусом на проектах и материалах.",
    meta: "Маркетинг / Web / Premium",
    beforeImage: "/doposle/interier_before.png",
    afterImage: "/doposle/interier_after.png",
    shortResult: "+визуальная ценность",
  },
  {
    id: "case-analytics",
    title: "Сайт фото-студии",
    description:
      "Ушли от перегруженного прайс-агрегатора к чистому и эмоциональному визуалу, где портфолио продаёт услугу.",
    meta: "Бренд / Web / Портфолио",
    beforeImage: "/doposle/photo-before.png",
    afterImage: "/doposle/photo-after.png",
    shortResult: "+целостность бренда",
  },
];

export type FluidGridCaseItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  meta: string;
  result: string;
  imageClassName?: string;
};

export function toFluidGridCases(cases: PortfolioCase[]): FluidGridCaseItem[] {
  return cases.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.afterImage,
    meta: item.meta,
    result: item.shortResult,
    imageClassName: item.imageClassName,
  }));
}

/** Верхний ряд: 3 кейса. */
export const portfolioCasesTop = portfolioCases.slice(0, 3);

/** Нижний ряд: 2 кейса (фото-студия + B2B CRM). */
export const portfolioCasesBottom: FluidGridCaseItem[] = [
  ...toFluidGridCases(portfolioCases.slice(3, 4)),
  {
    id: "case-b2b-crm",
    title: "B2B CRM для отдела продаж",
    description:
      "Пересобрали воронку, карточки сделок и аналитику так, чтобы менеджеры работали быстрее, а руководители видели узкие места.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    meta: "CRM / UX / Frontend",
    result: "+37% к скорости обработки лидов",
  },
];
