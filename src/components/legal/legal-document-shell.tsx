"use client";

import type { ReactNode } from "react";

import { ContactModalProvider } from "@/components/ui/contact-modal-context";

export function LegalDocumentShell({ children }: { children: ReactNode }) {
  return <ContactModalProvider>{children}</ContactModalProvider>;
}
