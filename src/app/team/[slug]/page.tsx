import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getMatchSource } from "@/lib/match-source";
import { readManifest } from "@/lib/manifest";
import { parseMatch } from "@/domain/parse-match";
import { teamSummary, mapPool } from "@/analytics/team";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import BarRow from "@/components/charts/BarRow";

const PUBLIC_SLUG = "mock-esports";

interface OpponentRecord {
  name: string;
  tag: string;
  count: number;
  wins: number;
  losses: number;
}

/** Group the manifest's played matches by opponent — the co-played ("B-scout") framing. */
function opponentsFaced(
  matches: { result: "win" | "loss"; opponent: { name: string; tag: string } }[],
): OpponentRecord[] {
  const acc = new Map<string, OpponentRecord>();
  for (const m of matches) {
    const key = `${m.opponent.name}__${m.opponent.tag}`;
    const rec =
      acc.get(key) ??
      ({ name: m.opponent.name, tag: m.opponent.tag, count: 0, wins: 0, losses: 0 } as OpponentRecord);
    rec.count += 1;
    if (m.result === "win") rec.wins += 1;
    else rec.losses += 1;
    acc.set(key, rec);
  }
  return [...acc.values()].sort((a, b) => b.count - a.count);
}

export default async function TeamProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== PUBLIC_SLUG) notFound();

  const t = await getTranslations("team");

  const manifest = readManifest();
  const source = getMatchSource();
  const entries = (await source.getMatchlist(manifest.captainPuuid)).filter(
    (e) => e.queueId === "premier",
  );
  const matches = await Promise.all(
    entries.map((e) => source.getMatch(e.matchId).then(parseMatch)),
  );
  const cap = manifest.captainPuuid;

  const summary = teamSummary(matches, cap);
  const pool = mapPool(matches, cap);
  const winRatePct = Math.round(summary.winRate * 100);
  const opponents = opponentsFaced(manifest.matches);

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        {/* Team header band */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(48rem 26rem at 82% -30%, rgba(124,92,255,0.18), transparent 62%)",
            }}
          />
          <div className="mx-auto max-w-5xl px-6 py-9">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
              {t("eyebrow")}
            </p>
            <h1 className="mt-2 flex flex-wrap items-baseline gap-x-3 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              {manifest.team.name}
              <span className="font-mono text-base font-medium text-muted sm:text-lg">
                {manifest.team.tag}
              </span>
            </h1>
          </div>
        </section>

        <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
          {/* Headline stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCard
              label={t("winRate")}
              value={`${winRatePct}%`}
              sub={`${summary.wins}W · ${summary.losses}L`}
              tone={winRatePct >= 50 ? "win" : "loss"}
            />
            <StatCard
              label={t("record")}
              value={`${summary.wins}–${summary.losses}`}
            />
            <StatCard
              label={t("matches")}
              value={String(summary.matches)}
              sub="Premier"
            />
          </div>

          {/* Map pool */}
          <Card title={t("mapPool")}>
            {pool.length > 0 ? (
              <div className="space-y-4">
                {pool.map((m) => (
                  <BarRow
                    key={m.map}
                    label={m.map}
                    value={m.wins}
                    max={m.played}
                    sub={`${m.wins}-${m.losses}`}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">{t("noMaps")}</p>
            )}
          </Card>

          {/* Opponents faced — co-played framing only */}
          <Card title={t("opponents")}>
            <ul className="divide-y divide-border/60">
              {opponents.map((o) => (
                <li
                  key={`${o.name}__${o.tag}`}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-fg">
                      {t("opponentLine", { name: o.name, count: o.count })}
                    </p>
                    {o.tag ? (
                      <p className="mt-0.5 font-mono text-xs text-muted">{o.tag}</p>
                    ) : null}
                  </div>
                  <span className="shrink-0 font-display text-sm tabular-nums text-muted">
                    {t("opponentRecord", { wins: o.wins, losses: o.losses })}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-sm leading-relaxed text-muted">
              <span aria-hidden className="mt-0.5 text-accent">
                ◆
              </span>
              {t("framing")}
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
