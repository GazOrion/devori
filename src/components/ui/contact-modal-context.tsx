"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

import { ContactModal } from "@/components/ui/contact-modal";

export const CONTACT_HREF = "#contact";

export function isContactHref(href?: string) {
  return href === CONTACT_HREF || href === undefined || href === "";
}

type ContactModalControl = {
  open: () => void;
  close: () => void;
};

type ContactModalApi = {
  openContactModal: () => void;
  closeContactModal: () => void;
};

const ContactModalContext = createContext<ContactModalApi | null>(null);

function ContactModalGate({
  controlRef,
}: {
  controlRef: React.RefObject<ContactModalControl | null>;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    controlRef.current = {
      open: () => setOpen(true),
      close: () => setOpen(false),
    };

    return () => {
      controlRef.current = null;
    };
  }, [controlRef]);

  return <ContactModal open={open} onClose={() => setOpen(false)} />;
}

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const controlRef = useRef<ContactModalControl | null>(null);

  const api = useMemo<ContactModalApi>(
    () => ({
      openContactModal: () => controlRef.current?.open(),
      closeContactModal: () => controlRef.current?.close(),
    }),
    [],
  );

  return (
    <ContactModalContext.Provider value={api}>
      {children}
      <ContactModalGate controlRef={controlRef} />
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return ctx;
}

export function useContactCtaHandler(href?: string) {
  const { openContactModal } = useContactModal();

  return (event: MouseEvent<HTMLElement>) => {
    if (!isContactHref(href)) return;
    event.preventDefault();
    event.stopPropagation();
    openContactModal();
  };
}
