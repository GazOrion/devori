import { LegalPageHeader } from "@/components/legal/legal-page-header";

export function InteriorDesignComingSoon() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#eef3fc] text-[#07111f]">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,#f4f7ff_0%,#e8f1ff_42%,#f0f5ff_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-[12%] top-[18%] h-[min(32rem,55vw)] w-[min(32rem,55vw)] rounded-full bg-[radial-gradient(circle,rgba(102,179,255,0.42)_0%,rgba(102,179,255,0)_68%)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[8%] bottom-[12%] h-[min(26rem,48vw)] w-[min(26rem,48vw)] rounded-full bg-[radial-gradient(circle,rgba(46,120,255,0.28)_0%,rgba(46,120,255,0)_70%)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[42%] h-[min(36rem,70vw)] w-[min(44rem,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(102,179,255,0.14)_0%,transparent_62%)]"
        aria-hidden
      />

      <div className="relative z-10">
        <LegalPageHeader
          breadcrumbs={[
            { label: "Главная", href: "/" },
            { label: "Дизайн интерьеров" },
          ]}
        />
      </div>

      <main className="relative z-10 flex flex-1 items-center justify-center px-[5vw] py-16 md:px-[6vw] lg:px-[7vw]">
        <div className="relative w-full max-w-[44rem]">
          <div
            className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-[#66B3FF]/25 via-transparent to-[#2e78ff]/20 blur-2xl sm:-inset-10"
            aria-hidden
          />

          <div className="relative overflow-hidden rounded-[2rem] border border-[#66B3FF]/25 bg-white/55 px-8 py-14 text-center shadow-[0_28px_90px_-36px_rgba(46,120,255,0.45)] backdrop-blur-md sm:rounded-[2.25rem] sm:px-14 sm:py-16">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#66B3FF]/70 to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#66B3FF]/35 to-transparent"
              aria-hidden
            />

            <p className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#2e6eb8]/90">
              Дизайн интерьеров
            </p>

            <h1 className="mt-5 font-heading text-[2.5rem] font-light leading-[1.02] tracking-[0.04em] sm:text-[3.5rem] lg:text-[4rem]">
              <span className="text-[#07111f]">Раздел </span>
              <span className="bg-gradient-to-r from-[#2e78ff] via-[#66B3FF] to-[#7ec8ff] bg-clip-text text-transparent">
                в разработке
              </span>
            </h1>

            <div
              className="mx-auto mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-[#66B3FF] to-transparent"
              aria-hidden
            />
          </div>
        </div>
      </main>
    </div>
  );
}
