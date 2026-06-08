import { useTranslations } from "next-intl";
import { requireLinked } from "@/lib/auth";
import { unlinkDemoAccount } from "@/app/connect/actions";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import DeleteData from "./DeleteData";

export default async function SettingsPage() {
  await requireLinked();
  return <SettingsView />;
}

/** Split out so we can use the client `useTranslations` hook in a sync render. */
function SettingsView() {
  const t = useTranslations("settings");

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1">
        {/* Header band — violet glow for depth, matching the dashboard. */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(48rem 26rem at 82% -30%, rgba(124,92,255,0.18), transparent 62%)",
            }}
          />
          <div className="mx-auto max-w-3xl px-6 py-9">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">
              {t("eyebrow")}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-1.5 text-sm text-muted">{t("subtitle")}</p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
          {/* 1 — Account */}
          <Card title={t("account.title")}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid h-11 w-11 place-items-center rounded-full bg-accent-soft font-display text-sm font-semibold text-accent"
                >
                  ME
                </span>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted">
                    {t("account.linked")}
                  </p>
                  <p className="mt-0.5 font-display text-base font-medium text-fg">
                    {t("account.identity")}
                  </p>
                </div>
              </div>

              <form action={unlinkDemoAccount}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:border-loss/60 hover:text-loss"
                >
                  {t("account.unlink")}
                </button>
              </form>
            </div>
            <p className="mt-4 border-t border-border pt-4 text-base leading-relaxed text-muted">
              {t("account.note")}
            </p>
          </Card>

          {/* 2 — Your data (delete flow) */}
          <Card title={t("data.title")}>
            <p className="text-sm text-muted">{t("data.intro")}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {t("data.explainer")}
            </p>
            <div className="mt-4">
              <DeleteData />
            </div>
          </Card>

          {/* 3 — Language (disabled stub) */}
          <Card title={t("language.title")}>
            <p className="text-sm text-muted">{t("language.intro")}</p>
            <fieldset className="mt-4 space-y-2.5" aria-label={t("language.title")}>
              <label className="flex cursor-default items-center gap-3 rounded-md border border-accent/40 bg-accent-soft/40 px-3.5 py-2.5">
                <input
                  type="radio"
                  name="language"
                  value="en"
                  defaultChecked
                  disabled
                  className="h-4 w-4 accent-accent"
                />
                <span className="text-sm font-medium text-fg">
                  {t("language.english")}
                </span>
              </label>
              <label
                title={t("language.chineseTitle")}
                className="flex cursor-not-allowed items-center gap-3 rounded-md border border-border px-3.5 py-2.5 opacity-60"
              >
                <input
                  type="radio"
                  name="language"
                  value="zh"
                  disabled
                  className="h-4 w-4 accent-accent"
                />
                <span className="text-sm text-muted">{t("language.chinese")}</span>
              </label>
            </fieldset>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
