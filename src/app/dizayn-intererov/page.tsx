import type { Metadata } from "next";

import { InteriorDesignComingSoon } from "@/components/interior-design/interior-design-coming-soon";
import { LegalDocumentShell } from "@/components/legal/legal-document-shell";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Дизайн интерьеров — devori",
  description:
    "Новое направление devori: дизайн жилых и коммерческих интерьеров. Раздел в разработке — скоро презентация услуг и кейсы.",
  alternates: {
    canonical: absoluteUrl("/dizayn-intererov"),
  },
  openGraph: {
    title: "Дизайн интерьеров — devori",
    description:
      "devori открывает направление дизайна интерьеров. Презентация и портфолио — в разработке.",
    url: absoluteUrl("/dizayn-intererov"),
    type: "website",
  },
};

export default function InteriorDesignPage() {
  return (
    <LegalDocumentShell>
      <InteriorDesignComingSoon />
    </LegalDocumentShell>
  );
}
