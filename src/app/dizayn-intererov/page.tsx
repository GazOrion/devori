import type { Metadata } from "next";

import { InteriorDesignComingSoon } from "@/components/interior-design/interior-design-coming-soon";
import { LegalDocumentShell } from "@/components/legal/legal-document-shell";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Дизайн интерьеров — devori",
  description: "Раздел дизайна интерьеров devori — в разработке.",
  alternates: {
    canonical: absoluteUrl("/dizayn-intererov"),
  },
  openGraph: {
    title: "Дизайн интерьеров — devori",
    description: "Раздел дизайна интерьеров devori — в разработке.",
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
