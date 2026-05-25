export type SiteDirection = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
};

/** Смежные направления группы (внешние URL — через NEXT_PUBLIC_* при необходимости). */
export const SITE_DIRECTIONS: SiteDirection[] = [
  {
    id: "uk",
    label: "УК Орион",
    href: process.env.NEXT_PUBLIC_ORION_UK_URL ?? "https://orion-rostov.ru",
    external: true,
  },
  {
    id: "interiors",
    label: "Дизайн интерьеров",
    href: "/dizayn-intererov",
  },
  {
    id: "training",
    label: "Учебный центр Орион",
    href: process.env.NEXT_PUBLIC_ORION_TRAINING_URL ?? "https://uc-orion.ru",
    external: true,
  },
  {
    id: "shop",
    label: "Интернет-магазин Орион",
    href: "/",
  },
];
