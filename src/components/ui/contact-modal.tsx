"use client";

import { startTransition, useEffect, useId, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, X } from "lucide-react";

import {
  ContactModalProjectType,
  type ProjectTypeId,
} from "@/components/ui/contact-modal-project-type";
import { submitContactRequest } from "@/lib/contact-request";
import { cn } from "@/lib/utils";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

const inputClassName =
  "w-full rounded-xl border bg-white/[0.05] px-3.5 py-2.5 text-[1rem] text-white outline-none transition placeholder:text-[#6d82a8] focus:ring-2";

const NAME_PATTERN = /^[\p{L}\s'-]+$/u;
const MIN_NAME_LENGTH = 2;
const PHONE_MASK_PREFIX = "+7 (";
const NATIONAL_PHONE_LENGTH = 10;

function sanitizeName(value: string) {
  return value.replace(/\d/g, "");
}

function getNationalPhoneDigits(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }

  if (digits.startsWith("7")) {
    digits = digits.slice(1);
  }

  return digits.slice(0, NATIONAL_PHONE_LENGTH);
}

function formatRuPhoneMask(nationalDigits: string) {
  if (!nationalDigits.length) return "";

  let formatted = PHONE_MASK_PREFIX + nationalDigits.slice(0, 3);

  if (nationalDigits.length < 3) return formatted;

  formatted += ")";

  if (nationalDigits.length > 3) {
    formatted += ` ${nationalDigits.slice(3, 6)}`;
  }

  if (nationalDigits.length > 6) {
    formatted += `-${nationalDigits.slice(6, 8)}`;
  }

  if (nationalDigits.length > 8) {
    formatted += `-${nationalDigits.slice(8, 10)}`;
  }

  return formatted;
}

function applyPhoneMask(prevPhone: string, nextRaw: string) {
  const prevDigits = getNationalPhoneDigits(prevPhone);
  const nextDigits = getNationalPhoneDigits(nextRaw);

  if (
    nextRaw.length < prevPhone.length &&
    nextDigits.length === prevDigits.length &&
    prevDigits.length > 0
  ) {
    return formatRuPhoneMask(prevDigits.slice(0, -1));
  }

  return formatRuPhoneMask(nextDigits);
}

function validateName(value: string) {
  const trimmed = value.trim();
  if (trimmed.length < MIN_NAME_LENGTH) {
    return "Введите имя (минимум 2 символа)";
  }
  if (!NAME_PATTERN.test(trimmed)) {
    return "Имя может содержать только буквы, пробелы и дефис";
  }
  return null;
}

function validatePhone(value: string) {
  const nationalDigits = getNationalPhoneDigits(value);
  if (nationalDigits.length < NATIONAL_PHONE_LENGTH) {
    return "Введите номер полностью";
  }
  return null;
}

function isPhoneMaskEmpty(value: string) {
  return getNationalPhoneDigits(value).length === 0;
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  const titleId = useId();
  const nameErrorId = useId();
  const phoneErrorId = useId();
  const policyErrorId = useId();
  const projectTypeErrorId = useId();
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [projectTypes, setProjectTypes] = useState<ProjectTypeId[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [policyError, setPolicyError] = useState<string | null>(null);
  const [projectTypeError, setProjectTypeError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setIsSubmitting(false);
      setSubmitError(null);
      setProjectTypes([]);
      setName("");
      setPhone("");
      setPolicyAccepted(false);
      setNameError(null);
      setPhoneError(null);
      setPolicyError(null);
      setProjectTypeError(null);
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const nextNameError = validateName(name);
    const nextPhoneError = validatePhone(phone);
    const nextPolicyError = policyAccepted
      ? null
      : "Необходимо согласие на обработку персональных данных";
    const nextProjectTypeError =
      projectTypes.length > 0 ? null : "Выберите хотя бы один тип проекта";

    setNameError(nextNameError);
    setPhoneError(nextPhoneError);
    setPolicyError(nextPolicyError);
    setProjectTypeError(nextProjectTypeError);

    if (nextNameError || nextPhoneError || nextPolicyError || nextProjectTypeError) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitContactRequest({
        full_name: name.trim(),
        phone,
        project_types: projectTypes,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Не удалось отправить заявку. Попробуйте позже.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[300] flex items-end justify-center p-4 sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Закрыть"
            className="absolute inset-0 bg-[#050b16]/72 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            layout
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{
              layout: { type: "spring", stiffness: 420, damping: 34 },
              type: "spring",
              stiffness: 380,
              damping: 32,
            }}
            className={cn(
              "relative z-10 w-full overflow-hidden rounded-[1.75rem]",
              submitted ? "max-w-[22rem]" : "max-w-[32rem]",
              "border border-white/12 bg-[linear-gradient(165deg,#0c1424_0%,#070d18_48%,#050a12_100%)]",
              "shadow-[0_32px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(102,179,255,0.08)]",
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(102,179,255,0.22)_0%,transparent_70%)]"
              animate={{ opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative px-6 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
              <AnimatePresence mode="wait" initial={false}>
                {submitted ? (
                  <motion.div
                    key="success"
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span className="h-10 w-10 shrink-0" aria-hidden />
                      <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-white/80 transition hover:border-white/22 hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-4 w-4" aria-hidden />
                      </button>
                    </div>

                    <div className="flex flex-col items-center px-2 pb-1 text-center">
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 420, damping: 24, delay: 0.05 }}
                      className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#66B3FF]/30 bg-[#66B3FF]/12 text-[#7abefa]"
                    >
                      <CheckCircle2 className="h-7 w-7" aria-hidden />
                    </motion.div>
                    <h2
                      id={titleId}
                      className="font-heading text-[1.95rem] leading-[1.05] text-white sm:text-[2.1rem]"
                    >
                      Спасибо
                    </h2>
                    <p className="mt-3 max-w-[16rem] text-[0.98rem] leading-relaxed text-[#9cb0d4]">
                      Заявка отправлена. Мы свяжемся с вами в ближайшее время.
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[#66B3FF] px-5 py-3.5 text-[1.02rem] font-semibold text-white transition hover:bg-[#7abefa]"
                    >
                      Закрыть
                    </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <div className="mb-7 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h2
                          id={titleId}
                          className="font-heading text-[1.75rem] leading-[1.05] text-white sm:text-[1.95rem]"
                        >
                          Заполните форму
                        </h2>
                        <p className="mt-2 max-w-[26rem] text-[1rem] leading-relaxed text-[#9cb0d4]">
                          Выберите тип проекта и оставьте контакты — перезвоним и обсудим задачу.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-white/80 transition hover:border-white/22 hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-4 w-4" aria-hidden />
                      </button>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                  <ContactModalProjectType
                    value={projectTypes}
                    onToggle={(id) => {
                      setProjectTypes((current) =>
                        current.includes(id)
                          ? current.filter((item) => item !== id)
                          : [...current, id],
                      );
                      if (projectTypeError) {
                        startTransition(() => setProjectTypeError(null));
                      }
                    }}
                    error={projectTypeError}
                    errorId={projectTypeErrorId}
                  />

                  <label className="block space-y-1.5">
                    <span className="text-[0.86rem] font-medium text-[#b8cceb]">Имя</span>
                    <input
                      required
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => {
                        const next = sanitizeName(event.target.value);
                        setName(next);
                        if (nameError) setNameError(validateName(next));
                      }}
                      onBlur={() => setNameError(validateName(name))}
                      aria-invalid={nameError ? true : undefined}
                      aria-describedby={nameError ? nameErrorId : undefined}
                      className={cn(
                        inputClassName,
                        nameError
                          ? "border-red-400/60 focus:border-red-400/60 focus:ring-red-400/25"
                          : "border-white/10 focus:border-[#66B3FF]/55 focus:ring-[#66B3FF]/25",
                      )}
                      placeholder="Иван"
                    />
                    {nameError ? (
                      <p id={nameErrorId} className="text-[0.84rem] text-red-300">
                        {nameError}
                      </p>
                    ) : null}
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-[0.86rem] font-medium text-[#b8cceb]">Телефон</span>
                    <input
                      required
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      value={phone}
                      onFocus={() => {
                        if (!phone) setPhone(PHONE_MASK_PREFIX);
                      }}
                      onChange={(event) => {
                        const next = applyPhoneMask(phone, event.target.value);
                        setPhone(next);
                        if (phoneError) setPhoneError(validatePhone(next));
                      }}
                      onKeyDown={(event) => {
                        if (event.key !== "Backspace") return;

                        const digits = getNationalPhoneDigits(phone);
                        if (digits.length === 0) {
                          if (phone) {
                            event.preventDefault();
                            setPhone("");
                          }
                          return;
                        }

                        const pos = event.currentTarget.selectionStart ?? 0;
                        const charBefore = phone[pos - 1];
                        if (charBefore && !/\d/.test(charBefore)) {
                          event.preventDefault();
                          setPhone(
                            digits.length === 1
                              ? ""
                              : formatRuPhoneMask(digits.slice(0, -1)),
                          );
                        }
                      }}
                      onBlur={() => {
                        if (isPhoneMaskEmpty(phone)) {
                          setPhone("");
                        }
                        setPhoneError(validatePhone(phone));
                      }}
                      aria-invalid={phoneError ? true : undefined}
                      aria-describedby={phoneError ? phoneErrorId : undefined}
                      className={cn(
                        inputClassName,
                        phoneError
                          ? "border-red-400/60 focus:border-red-400/60 focus:ring-red-400/25"
                          : "border-white/10 focus:border-[#66B3FF]/55 focus:ring-[#66B3FF]/25",
                      )}
                      placeholder="+7 (999) 123-45-67"
                    />
                    {phoneError ? (
                      <p id={phoneErrorId} className="text-[0.84rem] text-red-300">
                        {phoneError}
                      </p>
                    ) : null}
                  </label>

                  <div className="space-y-1.5">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        name="policy"
                        checked={policyAccepted}
                        onChange={(event) => {
                          setPolicyAccepted(event.target.checked);
                          if (policyError && event.target.checked) setPolicyError(null);
                        }}
                        aria-invalid={policyError ? true : undefined}
                        aria-describedby={policyError ? policyErrorId : undefined}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-white/25 bg-white/[0.06] text-[#2e78ff] focus:ring-2 focus:ring-[#66B3FF]/35 focus:ring-offset-0 focus:ring-offset-transparent"
                      />
                      <span className="text-[0.88rem] leading-relaxed text-[#9cb0d4]">
                        Я согласен с{" "}
                        <Link
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-[#7ab3ff] underline decoration-[#7ab3ff]/40 underline-offset-2 transition hover:text-[#9ec8ff] hover:decoration-[#9ec8ff]/60"
                          onClick={(event) => event.stopPropagation()}
                        >
                          политикой обработки персональных данных
                        </Link>
                      </span>
                    </label>
                    {policyError ? (
                      <p id={policyErrorId} className="text-[0.84rem] text-red-300">
                        {policyError}
                      </p>
                    ) : null}
                  </div>

                  {submitError ? (
                    <p className="text-center text-[0.84rem] text-red-300" role="alert">
                      {submitError}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2e78ff] px-5 py-3.5 text-[1.02rem] font-semibold text-white shadow-[0_12px_32px_rgba(46,120,255,0.35)] transition hover:bg-[#2a6ee8] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Отправляем…" : "Отправить заявку"}
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
                  </button>
                </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
