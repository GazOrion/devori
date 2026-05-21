import type { ReactNode } from "react";

import { LegalDocumentShell } from "@/components/legal/legal-document-shell";
import { LegalPageHeader, type LegalBreadcrumb } from "@/components/legal/legal-page-header";

type LegalDocumentLayoutProps = {
  title: string;
  subtitle?: string;
  breadcrumbs: LegalBreadcrumb[];
  children: ReactNode;
};

export function LegalDocumentLayout({ title, subtitle, breadcrumbs, children }: LegalDocumentLayoutProps) {
  return (
    <LegalDocumentShell>
      <div className="min-h-screen bg-[#f4f7ff] text-left text-[#07111f]">
        <LegalPageHeader breadcrumbs={breadcrumbs} />

        <main className="w-full max-w-5xl px-[5vw] py-10 sm:py-14 md:px-[6vw] lg:max-w-[68rem] lg:px-[7vw]">
          <h1 className="font-heading text-[2.15rem] leading-[1.05] sm:text-[2.75rem]">{title}</h1>
          {subtitle ? (
            <p className="mt-3 text-base leading-relaxed text-[#4a5a75] sm:text-[1.05rem]">{subtitle}</p>
          ) : null}
          <article className="mt-10 space-y-8 text-left text-[1rem] leading-8 text-[#243044] sm:text-[1.05rem]">
            {children}
          </article>
        </main>
      </div>
    </LegalDocumentShell>
  );
}

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="font-heading text-[1.35rem] leading-snug text-[#07111f] sm:text-[1.45rem]">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function LegalParagraph({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
