"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ALL_COOKIE_PREFERENCES,
  COOKIE_SETTINGS_OPEN_EVENT,
  NECESSARY_ONLY_COOKIE_PREFERENCES,
  readCookiePreferences,
  saveCookiePreferences,
  type CookiePreferences,
} from "@/lib/cookie-consent";
import { cn } from "@/lib/utils";

type CookieConsentView = "banner" | "settings";

type CookieToggleProps = {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

function CookieToggle({ checked, disabled = false, label, onChange }: CookieToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      className={cn(
        "relative h-8 w-[3.25rem] shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B3FF]/35",
        disabled ? "cursor-not-allowed opacity-95" : "cursor-pointer",
        checked ? (disabled ? "bg-[#07111f]" : "bg-[#66B3FF]") : "bg-[#07111f]/15",
      )}
    >
      <span
        className={cn(
          "absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out",
          checked && "translate-x-[1.35rem]",
        )}
        aria-hidden
      />
    </button>
  );
}

function primaryButtonClassName(className?: string) {
  return cn(
    "inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#66B3FF] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-[0_12px_32px_rgba(102,179,255,0.28)] transition-[transform,background-color] duration-200 ease-out hover:bg-[#7abefa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B3FF]/45 focus-visible:ring-offset-2 active:scale-[0.99] motion-reduce:active:scale-100 sm:min-h-12",
    className,
  );
}

function secondaryButtonClassName(className?: string) {
  return cn(
    "inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#07111f]/12 bg-white px-5 py-2.5 text-center text-sm font-semibold text-[#07111f] transition-[transform,background-color,border-color] duration-200 ease-out hover:border-[#07111f]/20 hover:bg-[#f8fbff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B3FF]/25 focus-visible:ring-offset-2 active:scale-[0.99] motion-reduce:active:scale-100 sm:min-h-12",
    className,
  );
}

function CookieConsentDescription() {
  return (
    <>
      Наш сайт использует cookie-файлы для аналитики и персонализации. Продолжая использовать сайт после
      ознакомления с этим сообщением и предоставления своего выбора, вы соглашаетесь с нашей{" "}
      <Link
        href="/privacy"
        className="font-medium text-[#66B3FF] underline underline-offset-[3px] decoration-[#66B3FF]/35 transition-colors hover:text-[#7abefa] hover:decoration-[#7abefa]/50"
      >
        Политикой обработки персональных данных
      </Link>
      .
    </>
  );
}

type CookieConsentPanelProps = {
  view: CookieConsentView;
  analyticsEnabled: boolean;
  functionalEnabled: boolean;
  onAnalyticsChange: (value: boolean) => void;
  onFunctionalChange: (value: boolean) => void;
  onAcceptAll: () => void;
  onAcceptNecessary: () => void;
  onOpenSettings: () => void;
  onSaveSelected: () => void;
  embedded?: boolean;
};

export function CookieConsentPanel({
  view,
  analyticsEnabled,
  functionalEnabled,
  onAnalyticsChange,
  onFunctionalChange,
  onAcceptAll,
  onAcceptNecessary,
  onOpenSettings,
  onSaveSelected,
  embedded = false,
}: CookieConsentPanelProps) {
  return (
    <section
      className={cn(
        "text-left",
        embedded
          ? "rounded-[1.75rem] border border-[#07111f]/8 bg-white p-6 shadow-[0_20px_56px_rgba(7,17,31,0.08)] sm:p-8"
          : "w-full max-w-[40rem] overflow-hidden rounded-t-[1.75rem] border border-[#07111f]/8 bg-white px-5 py-6 shadow-[0_-12px_48px_-16px_rgba(7,17,31,0.14)] sm:max-w-[44rem] sm:rounded-[1.75rem] sm:px-8 sm:py-8",
      )}
      aria-labelledby={embedded ? "cookie-settings-title" : "cookie-banner-title"}
    >
      <h2
        id={embedded ? "cookie-settings-title" : "cookie-banner-title"}
        className="font-heading text-xl leading-tight text-[#07111f] sm:text-2xl"
      >
        Мы используем cookie-файлы
      </h2>

      {view === "banner" ? (
        <>
          <p className="mt-4 max-w-none text-[15px] leading-relaxed text-[#07111f]/82 sm:text-base">
            <CookieConsentDescription />
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-3">
            <button type="button" className={primaryButtonClassName("sm:flex-1")} onClick={onAcceptAll}>
              Разрешить все
            </button>
            <button type="button" className={secondaryButtonClassName("sm:flex-1")} onClick={onAcceptNecessary}>
              Разрешить обязательные
            </button>
            <button type="button" className={secondaryButtonClassName("sm:flex-1")} onClick={onOpenSettings}>
              Настроить
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-4 max-w-none text-[15px] leading-relaxed text-[#07111f]/82 sm:text-base">
            <CookieConsentDescription />
          </p>
          <ul className="mt-6 flex list-none flex-col gap-3 p-0">
            <li className="rounded-[1.25rem] border border-[#07111f]/8 bg-[#f8fbff] px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-heading text-[15px] font-semibold text-[#07111f] sm:text-base">
                    Технические cookie (обязательные)
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#07111f]/72 sm:text-[14px]">
                    Эти файлы cookie необходимы для корректной работы сайта и его основных функций. Без них сайт не
                    может функционировать должным образом. Они не собирают информацию для маркетинга или отслеживания.
                  </p>
                </div>
                <CookieToggle checked disabled label="Технические cookie включены" onChange={() => {}} />
              </div>
            </li>
            <li className="rounded-[1.25rem] border border-[#07111f]/8 bg-[#f8fbff] px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-heading text-[15px] font-semibold text-[#07111f] sm:text-base">
                    Аналитические и рекламные cookie
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#07111f]/72 sm:text-[14px]">
                    Эти файлы cookie позволяют собирать информацию о том, как посетители используют сайт, включая
                    сервис Яндекс.Метрика. Данные обрабатываются согласно нашей политике конфиденциальности.
                  </p>
                </div>
                <CookieToggle
                  checked={analyticsEnabled}
                  label="Аналитические и рекламные cookie"
                  onChange={onAnalyticsChange}
                />
              </div>
            </li>
            <li className="rounded-[1.25rem] border border-[#07111f]/8 bg-[#f8fbff] px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-heading text-[15px] font-semibold text-[#07111f] sm:text-base">
                    Функциональные cookie
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#07111f]/72 sm:text-[14px]">
                    Эти файлы cookie позволяют сайту запоминать ваш выбор и предоставлять улучшенные функции для
                    большего удобства, например сохранение настроек интерфейса.
                  </p>
                </div>
                <CookieToggle
                  checked={functionalEnabled}
                  label="Функциональные cookie"
                  onChange={onFunctionalChange}
                />
              </div>
            </li>
          </ul>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-3">
            <button type="button" className={primaryButtonClassName("sm:flex-1")} onClick={onSaveSelected}>
              Разрешить выбранные
            </button>
            <button type="button" className={secondaryButtonClassName("sm:flex-1")} onClick={onAcceptNecessary}>
              Разрешить обязательные
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function applyPreferences(preferences: CookiePreferences, onClose?: () => void) {
  saveCookiePreferences(preferences);
  onClose?.();
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<CookieConsentView>("banner");
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [functionalEnabled, setFunctionalEnabled] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        if (!window.localStorage.getItem("devori-cookie-preferences")) {
          setVisible(true);
        }
      } catch {
        setVisible(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const openSettings = () => {
      const saved = readCookiePreferences();
      setAnalyticsEnabled(!!(saved?.analytics || saved?.marketing));
      setFunctionalEnabled(!!saved?.preferences);
      setView("settings");
      setVisible(true);
    };

    window.addEventListener(COOKIE_SETTINGS_OPEN_EVENT, openSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_OPEN_EVENT, openSettings);
  }, []);

  if (!visible) return null;

  const close = () => setVisible(false);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[120] box-border flex justify-center p-3 sm:p-5"
      aria-live="polite"
    >
      <div className="pointer-events-auto w-full max-w-[44rem]">
        <CookieConsentPanel
          view={view}
          analyticsEnabled={analyticsEnabled}
          functionalEnabled={functionalEnabled}
          onAnalyticsChange={setAnalyticsEnabled}
          onFunctionalChange={setFunctionalEnabled}
          onAcceptAll={() => applyPreferences(ALL_COOKIE_PREFERENCES, close)}
          onAcceptNecessary={() => applyPreferences(NECESSARY_ONLY_COOKIE_PREFERENCES, close)}
          onOpenSettings={() => {
            setAnalyticsEnabled(false);
            setFunctionalEnabled(false);
            setView("settings");
          }}
          onSaveSelected={() =>
            applyPreferences(
              {
                necessary: true,
                analytics: analyticsEnabled,
                marketing: analyticsEnabled,
                preferences: functionalEnabled,
              },
              close,
            )
          }
        />
      </div>
    </div>
  );
}

export function CookieSettingsForm() {
  const [saved, setSaved] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [functionalEnabled, setFunctionalEnabled] = useState(false);

  useEffect(() => {
    const savedPreferences = readCookiePreferences();
    setAnalyticsEnabled(!!(savedPreferences?.analytics || savedPreferences?.marketing));
    setFunctionalEnabled(!!savedPreferences?.preferences);
  }, []);

  const handleSave = (preferences: CookiePreferences) => {
    saveCookiePreferences(preferences);
    setSaved(true);
  };

  return (
    <div className="space-y-4">
      <CookieConsentPanel
        embedded
        view="settings"
        analyticsEnabled={analyticsEnabled}
        functionalEnabled={functionalEnabled}
        onAnalyticsChange={setAnalyticsEnabled}
        onFunctionalChange={setFunctionalEnabled}
        onAcceptAll={() => handleSave(ALL_COOKIE_PREFERENCES)}
        onAcceptNecessary={() => handleSave(NECESSARY_ONLY_COOKIE_PREFERENCES)}
        onOpenSettings={() => {}}
        onSaveSelected={() =>
          handleSave({
            necessary: true,
            analytics: analyticsEnabled,
            marketing: analyticsEnabled,
            preferences: functionalEnabled,
          })
        }
      />
      {saved ? (
        <p className="text-sm text-[#07111f]/70" role="status">
          Настройки cookie сохранены.
        </p>
      ) : null}
    </div>
  );
}
