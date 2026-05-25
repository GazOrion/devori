import type { LucideIcon } from "lucide-react";
import { Armchair, Building2, GraduationCap, Gauge } from "lucide-react";

import { SITE_DIRECTIONS } from "@/lib/site-directions";

export type EcosystemDirectionCard = {
  id: string;
  label: string;
  description: string;
  href: string;
  external?: boolean;
  icon: LucideIcon;
};

const CARD_META: Record<
  string,
  Pick<EcosystemDirectionCard, "description" | "icon">
> = {
  uk: {
    description: "Инженерные и эксплуатационные услуги для объектов недвижимости",
    icon: Building2,
  },
  interiors: {
    description: "Пространства и визуальные решения для жизни и бизнеса",
    icon: Armchair,
  },
  training: {
    description: "Дополнительное образование для детей 7-11 классов",
    icon: GraduationCap,
  },
  shop: {
    description: "Газово-промышленное оборудование и производственные услуги",
    icon: Gauge,
  },
};

export const ECOSYSTEM_DIRECTION_CARDS: EcosystemDirectionCard[] = SITE_DIRECTIONS.map(
  (direction) => {
    const meta = CARD_META[direction.id];
    return {
      id: direction.id,
      label: direction.label,
      description: meta.description,
      href: direction.href,
      external: direction.external,
      icon: meta.icon,
    };
  },
);
