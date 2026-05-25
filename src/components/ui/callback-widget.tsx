"use client";

import { Phone } from "lucide-react";

import { useContactModal } from "@/components/ui/contact-modal-context";
import { shineHoverClassName } from "@/components/ui/shine-hover";
import { zFloating } from "@/lib/layer-z-index";
import { cn } from "@/lib/utils";

export function CallbackWidget() {
  const { openCallbackModal } = useContactModal();

  return (
    <button
      type="button"
      onClick={() => openCallbackModal()}
      className={cn(
        shineHoverClassName,
        "fixed bottom-5 right-5 inline-flex items-center gap-2.5 rounded-full border-0 bg-[#66B3FF] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_-8px_rgba(102,179,255,0.65)] transition-colors hover:bg-[#7abefa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B3FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07030f] sm:bottom-6 sm:right-6 sm:px-5 sm:py-4 sm:text-[0.9375rem]",
        zFloating.callbackWidget,
      )}
      aria-label="Заказать обратный звонок"
    >
      <Phone className="h-4 w-4 shrink-0 sm:h-[1.125rem] sm:w-[1.125rem]" aria-hidden />
      <span>Обратный звонок</span>
    </button>
  );
}
