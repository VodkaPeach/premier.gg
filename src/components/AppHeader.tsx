import Link from "next/link";
import { useTranslations } from "next-intl";
import { unlinkDemoAccount } from "@/app/connect/actions";

/** Top chrome for the authenticated app screens (dashboard, profile, settings, match). */
export default function AppHeader() {
  const t = useTranslations();
  const links = [
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/team/mock-esports", label: t("nav.publicProfile") },
    { href: "/settings", label: t("nav.settings") },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3.5">
        <Link
          href="/dashboard"
          className="font-display text-lg font-semibold tracking-tight text-fg"
        >
          <span className="text-accent">◆</span> {t("app.name")}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-fg"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5">
            <span
              aria-hidden
              className="grid h-6 w-6 place-items-center rounded-full bg-accent-soft font-display text-xs font-semibold text-accent"
            >
              ME
            </span>
            <span className="text-sm leading-tight">
              <span className="text-muted">{t("account.captain")} · </span>
              <span className="text-fg">{t("account.team")}</span>
            </span>
          </div>
          <form action={unlinkDemoAccount}>
            <button
              type="submit"
              className="rounded-md border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-loss/60 hover:text-loss"
            >
              {t("account.unlink")}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
