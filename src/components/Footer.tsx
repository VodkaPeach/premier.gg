import Link from "next/link";
import { useTranslations } from "next-intl";
import Disclaimer from "./Disclaimer";

/** Bordered-top page footer: legal links, the mock-data note, and the Riot disclaimer. */
export default function Footer() {
  const t = useTranslations();
  return (
    <footer className="mt-auto border-t border-border bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
          <span className="font-display text-fg">
            <span className="text-accent">◆</span> {t("app.name")}
          </span>
          <Link href="/privacy" className="transition-colors hover:text-fg">
            {t("footer.privacy")}
          </Link>
          <Link href="/terms" className="transition-colors hover:text-fg">
            {t("footer.terms")}
          </Link>
          <span className="ml-auto rounded border border-border bg-surface px-2 py-0.5 text-xs text-muted">
            {t("footer.mockDemo")}
          </span>
        </div>
        <Disclaimer />
      </div>
    </footer>
  );
}
