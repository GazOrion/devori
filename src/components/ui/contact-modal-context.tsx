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

import { CallbackModal } from "@/components/ui/callback-modal";
import { ContactModal } from "@/components/ui/contact-modal";

export const CONTACT_HREF = "#contact";

export function isContactHref(href?: string) {
  return href === CONTACT_HREF || href === undefined || href === "";
}

type ModalControl = {
  open: () => void;
  close: () => void;
};

type ContactModalApi = {
  openContactModal: () => void;
  closeContactModal: () => void;
  openCallbackModal: () => void;
  closeCallbackModal: () => void;
};

const ContactModalContext = createContext<ContactModalApi | null>(null);

function ContactModalGate({
  controlRef,
}: {
  controlRef: React.RefObject<ModalControl | null>;
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

function CallbackModalGate({
  controlRef,
}: {
  controlRef: React.RefObject<ModalControl | null>;
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

  return <CallbackModal open={open} onClose={() => setOpen(false)} />;
}

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const contactRef = useRef<ModalControl | null>(null);
  const callbackRef = useRef<ModalControl | null>(null);

  const api = useMemo<ContactModalApi>(
    () => ({
      openContactModal: () => contactRef.current?.open(),
      closeContactModal: () => contactRef.current?.close(),
      openCallbackModal: () => callbackRef.current?.open(),
      closeCallbackModal: () => callbackRef.current?.close(),
    }),
    [],
  );

  return (
    <ContactModalContext.Provider value={api}>
      {children}
      <ContactModalGate controlRef={contactRef} />
      <CallbackModalGate controlRef={callbackRef} />
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
