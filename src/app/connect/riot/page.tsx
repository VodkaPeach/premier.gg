import Link from "next/link";
import { useTranslations } from "next-intl";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import { linkDemoAccount } from "@/app/connect/actions";

export default function RiotSignOnPage() {
  const t = useTranslations("riot");
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(46rem 28rem at 50% -10%, rgba(124,92,255,0.18), transparent 60%)",
          }}
        />

        <Card className="w-full max-w-md p-6">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-semibold tracking-wide text-fg">
              {t("title")}
            </h3>
            <span className="rounded border border-accent/40 bg-accent-soft px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-accent">
              {t("mockBadge")}
            </span>
          </div>

          {/* Unmistakable simulated-login banner. */}
          <div className="mt-4 flex items-start gap-2.5 rounded-md border border-accent/40 bg-accent-soft/60 p-3">
            <span aria-hidden className="mt-0.5 text-accent">
              ⚠
            </span>
            <p className="text-sm leading-relaxed text-fg">{t("banner")}</p>
          </div>

          {/* Faux credential fields — purely visual, disabled. */}
          <div className="mt-5 space-y-3" aria-hidden>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                {t("riotId")}
              </span>
              <input
                type="text"
                disabled
                defaultValue="demo-player"
                tabIndex={-1}
                className="mt-1.5 w-full cursor-not-allowed rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-muted"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                {t("password")}
              </span>
              <input
                type="password"
                disabled
                defaultValue="••••••••"
                tabIndex={-1}
                className="mt-1.5 w-full cursor-not-allowed rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-muted"
              />
            </label>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-muted/80">
            {t("fieldsNote")}
          </p>

          {/* The only real control: runs the server action, sets cookie, redirects. */}
          <form action={linkDemoAccount} className="mt-5">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(124,92,255,0.4),0_12px_36px_-16px_rgba(124,92,255,0.9)] transition-colors hover:bg-accent/90"
            >
              {t("authorize")}
            </button>
          </form>

          <Link
            href="/"
            className="mt-4 block text-center text-sm text-muted transition-colors hover:text-fg"
          >
            {t("cancel")}
          </Link>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
