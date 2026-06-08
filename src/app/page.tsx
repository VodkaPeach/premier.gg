import Link from "next/link";
import { useTranslations } from "next-intl";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import Card from "@/components/Card";

const FEATURES = ["analytics", "positional", "opponent"] as const;

const FEATURE_GLYPH: Record<(typeof FEATURES)[number], string> = {
  analytics: "▤",
  positional: "◎",
  opponent: "⚔",
};

export default function HomePage() {
  const t = useTranslations("landing");
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          {/* Atmosphere: violet glow + faint grid behind the hero content. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60rem 32rem at 70% -10%, rgba(124,92,255,0.22), transparent 60%), radial-gradient(40rem 24rem at 0% 100%, rgba(124,92,255,0.10), transparent 60%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage:
                "radial-gradient(60rem 40rem at 60% 0%, black, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(60rem 40rem at 60% 0%, black, transparent 75%)",
            }}
          />

          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft/60 px-3 py-1 text-sm font-medium text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t("pill")}
            </span>

            <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-6xl">
              {t("headline")}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              {t("subhead")}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(124,92,255,0.4),0_14px_40px_-16px_rgba(124,92,255,0.9)] transition-colors hover:bg-accent/90"
              >
                {t("ctaPrimary")}
              </Link>
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-fg"
              >
                {t("ctaSecondary")}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-display text-sm font-medium uppercase tracking-[0.16em] text-muted">
            {t("features.heading")}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {FEATURES.map((key) => (
              <Card key={key} className="transition-colors hover:border-accent/40">
                <span
                  aria-hidden
                  className="grid h-10 w-10 place-items-center rounded-md bg-accent-soft text-lg text-accent"
                >
                  {FEATURE_GLYPH[key]}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-fg">
                  {t(`features.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t(`features.${key}.body`)}
                </p>
              </Card>
            ))}
          </div>

          {/* Trust line — the not-a-scouting framing. */}
          <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-muted">
            <span aria-hidden className="text-accent">
              ◆
            </span>
            {t("trust")}
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
