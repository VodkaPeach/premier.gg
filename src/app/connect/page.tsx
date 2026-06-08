import Link from "next/link";
import { useTranslations } from "next-intl";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import ConsentGate from "./ConsentGate";

const POINTS = ["read", "show", "how"] as const;

const POINT_GLYPH: Record<(typeof POINTS)[number], string> = {
  read: "▣",
  show: "◎",
  how: "⚑",
};

export default function ConnectPage() {
  const t = useTranslations("connect");
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
        {/* Atmosphere: violet glow consistent with the landing hero. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(46rem 28rem at 50% -10%, rgba(124,92,255,0.18), transparent 60%)",
          }}
        />

        <Card title={t("title")} className="w-full max-w-lg p-6">
          <p className="text-base leading-relaxed text-muted">{t("intro")}</p>

          <dl className="mt-5 space-y-3">
            {POINTS.map((key) => (
              <div
                key={key}
                className="flex gap-3 rounded-md border border-border bg-surface-2/50 p-3.5"
              >
                <span
                  aria-hidden
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent-soft text-base text-accent"
                >
                  {POINT_GLYPH[key]}
                </span>
                <div>
                  <dt className="font-display text-sm font-semibold text-fg">
                    {t(`${key}.label`)}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">
                    {t(`${key}.body`)}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <p className="mt-4 text-sm text-muted">
            <Link
              href="/privacy"
              className="font-medium text-accent underline-offset-4 transition-colors hover:text-accent/80 hover:underline"
            >
              {t("privacyLink")}
            </Link>
          </p>

          {/* Riot-required disclaimer: account linking makes the player's data public. */}
          <p className="mt-4 flex items-start gap-2.5 rounded-md border border-accent/30 bg-accent-soft/40 p-3.5 text-sm leading-relaxed text-fg">
            <span aria-hidden className="mt-0.5 shrink-0 text-accent">
              ⚠
            </span>
            {t("publicNotice")}
          </p>

          <ConsentGate />
        </Card>
      </main>

      <Footer />
    </div>
  );
}
