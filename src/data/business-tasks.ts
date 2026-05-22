export type BusinessTaskItem = {
  label: string;
  compact?: boolean;
};

/** 4 ряда (4·6·5·4) под кирпичную сетку */
export const businessTaskRows: readonly BusinessTaskItem[][] = [
  [
    { label: "Управление проектами" },
    { label: "CRM", compact: true },
    { label: "СЭД", compact: true },
    { label: "Корпоративный портал" },
  ],
  [
    { label: "HRM", compact: true },
    { label: "ТОиР", compact: true },
    { label: "Риск-система" },
    { label: "Wiki-система" },
    { label: "Личный кабинет клиента" },
  ],
  [
    { label: "GRC-система" },
    { label: "Бюджетирование" },
    { label: "ITSM и IT-менеджмент" },
    { label: "Управление качеством" },
    { label: "Каталог данных" },
  ],
  [
    { label: "Управление заявками" },
    { label: "BPMS", compact: true },
    { label: "ЭДО", compact: true },
    { label: "Финансовый мониторинг" },
    { label: "Управление арендой" },
  ],
];
