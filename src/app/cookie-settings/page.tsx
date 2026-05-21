import Link from "next/link";

import { CookieSettingsForm } from "@/components/ui/cookie-consent";

export default function CookieSettingsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-[#07111f]">
      <p className="text-sm text-[#07111f]/60">
        <Link href="/" className="text-[#66B3FF] underline-offset-4 hover:underline">
          На главную
        </Link>
      </p>
      <h1 className="mt-6 font-heading text-3xl">Настройки cookie</h1>
      <p className="mt-4 text-sm leading-7 text-[#07111f]/80">
        Выберите категории cookie, которые разрешены на этом сайте.
      </p>
      <div className="mt-8">
        <CookieSettingsForm />
      </div>
    </main>
  );
}
