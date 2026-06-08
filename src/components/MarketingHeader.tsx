import Link from "next/link";
import { useTranslations } from "next-intl";

/** Top chrome for the pre-auth marketing screens (landing, connect, success, legal). */
export default function MarketingHeader() {
  const t = useTranslations();
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3.5">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-fg"
        >
          <span className="text-accent">◆</span> {t("app.name")}
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <span
            title="Chinese coming soon"
            className="hidden select-none text-xs text-muted sm:inline"
          >
            <span className="text-fg">EN</span> · 中文
          </span>

          <Link
            href="/connect"
            className="group inline-flex items-center gap-2 rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(124,92,255,0.4),0_8px_24px_-12px_rgba(124,92,255,0.8)] transition-colors hover:bg-accent/90"
          >
            {t("nav.signIn")}
            <span className="rounded bg-white/15 px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-white/90">
              {t("nav.demo")}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
