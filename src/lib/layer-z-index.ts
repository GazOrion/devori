/**
 * Единая шкала z-index лендинга.
 *
 * Секции (10–24): тёмный блок всегда выше следующей светлой при -mt-24.
 * Плавающий UI (30+): выше всех секций, чтобы виджет звонка не прятался под #contact.
 */

export const zSection = {
  stackRoot: "z-[10]",
  services: "z-[10]",
  business: "z-[12]",
  gradientDivider: "z-[13]",
  productValue: "z-[14]",
  formats: "z-[13]",
  cases: "z-[16]",
  casesCta: "z-[15]",
  approach: "z-[18]",
  team: "z-[17]",
  testimonials: "z-[20]",
  faq: "z-[19]",
  contact: "z-[22]",
  ecosystem: "z-[21]",
  footer: "z-[24]",
} as const;

export const zFloating = {
  header: "z-[30]",
  callbackWidget: "z-[50]",
  cookieConsent: "z-[120]",
  modal: "z-[300]",
} as const;
