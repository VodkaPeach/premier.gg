import Link from "next/link";
import { useTranslations } from "next-intl";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import Card from "@/components/Card";

export default function ConnectSuccessPage() {
  const t = useTranslations("success");
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(46rem 28rem at 50% -10%, rgba(124,92,255,0.20), transparent 60%)",
          }}
        />

        <Card className="w-full max-w-md p-7 text-center">
          {/* Checkmark visual with a soft violet halo. */}
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-soft text-2xl text-accent shadow-[0_0_0_1px_rgba(124,92,255,0.4),0_0_40px_-8px_rgba(124,92,255,0.7)]">
            <span aria-hidden>✓</span>
          </div>

          <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft/60 px-2.5 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t("badge")}
          </span>

          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-fg">
            {t("title")}
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-fg">{t("summary")}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {t("subtext")}
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(124,92,255,0.4),0_12px_36px_-16px_rgba(124,92,255,0.9)] transition-colors hover:bg-accent/90"
          >
            {t("cta")}
            <span aria-hidden>→</span>
          </Link>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
