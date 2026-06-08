import Link from "next/link";
import { requireLinked } from "@/lib/auth";
import { getMatchSource } from "@/lib/match-source";
import { readManifest, matchSummary } from "@/lib/manifest";
import { parseMatch } from "@/domain/parse-match";
import { teamSummary, mapPool, sideSplit, recentForm } from "@/analytics/team";
import { rosterStats } from "@/analytics/player";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import BarRow from "@/components/charts/BarRow";
import SplitBar from "@/components/charts/SplitBar";
import FormDots from "@/components/charts/FormDots";

export default async function DashboardPage() {
  await requireLinked();

  const manifest = readManifest();
  const source = getMatchSource();
  const entries = (await source.getMatchlist(manifest.captainPuuid)).filter(
    (e) => e.queueId === "premier",
  );
  const matches = await Promise.all(
    entries.map((e) => source.getMatch(e.matchId).then(parseMatch)),
  );

  const cap = manifest.captainPuuid;
  const roster = manifest.team.roster.map((r) => r.puuid);

  const summary = teamSummary(matches, cap);
  const pool = mapPool(matches, cap);
  const split = sideSplit(matches, cap);
  const form = recentForm(matches, cap, 5);
  const players = rosterStats(matches, roster);

  const winRatePct = Math.round(summary.winRate * 100);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1">
        {/* Header band — team identity, record, recent form. Violet glow for depth. */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(48rem 26rem at 82% -30%, rgba(124,92,255,0.18), transparent 62%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage:
                "radial-gradient(46rem 22rem at 80% 0%, black, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(46rem 22rem at 80% 0%, black, transparent 80%)",
            }}
          />

          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
                Team dashboard
              </p>
              <h1 className="mt-2 flex flex-wrap items-baseline gap-x-3 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                {manifest.team.name}
                <span className="text-lg font-medium text-muted sm:text-xl">
                  · Premier
                </span>
              </h1>
              <p className="mt-1.5 text-sm text-muted">
                <span className="font-display text-base tabular-nums text-fg">
                  {summary.wins}
                </span>
                <span className="mx-1">–</span>
                <span className="font-display text-base tabular-nums text-fg">
                  {summary.losses}
                </span>{" "}
                record across {summary.matches} matches
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted">
                Recent form
              </span>
              <FormDots form={form} />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Win rate"
              value={`${winRatePct}%`}
              sub={`${summary.wins}W · ${summary.losses}L`}
              tone={winRatePct >= 50 ? "win" : "loss"}
            />
            <StatCard
              label="Matches"
              value={String(summary.matches)}
              sub="Premier queue"
            />
            <StatCard
              label="Atk round WR"
              value={`${Math.round(split.atkWinRate * 100)}%`}
              sub={`${split.atkRoundsWon}/${split.atkRoundsPlayed} rounds`}
              tone={split.atkWinRate >= 0.5 ? "win" : "loss"}
            />
            <StatCard
              label="Def round WR"
              value={`${Math.round(split.defWinRate * 100)}%`}
              sub={`${split.defRoundsWon}/${split.defRoundsPlayed} rounds`}
              tone={split.defWinRate >= 0.5 ? "win" : "loss"}
            />
          </div>

          {/* Map pool + side split */}
          <div className="grid gap-4 lg:grid-cols-5">
            <Card title="Map pool" className="lg:col-span-3">
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
                <p className="text-sm text-muted">No maps played yet.</p>
              )}
            </Card>

            <Card title="Attack vs defense" className="lg:col-span-2">
              <div className="flex h-full flex-col justify-between gap-5">
                <SplitBar
                  leftLabel="Attack"
                  leftValue={split.atkWinRate}
                  rightLabel="Defense"
                  rightValue={split.defWinRate}
                />
                <dl className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
                  <div>
                    <dt className="text-[0.7rem] uppercase tracking-[0.12em] text-muted">
                      Atk rounds
                    </dt>
                    <dd className="mt-1 font-display tabular-nums text-fg">
                      {split.atkRoundsWon}
                      <span className="text-muted">/{split.atkRoundsPlayed}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] uppercase tracking-[0.12em] text-muted">
                      Def rounds
                    </dt>
                    <dd className="mt-1 font-display tabular-nums text-fg">
                      {split.defRoundsWon}
                      <span className="text-muted">/{split.defRoundsPlayed}</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </Card>
          </div>

          {/* Roster */}
          <Card title="Roster">
            <div className="-mx-1 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[0.7rem] uppercase tracking-[0.12em] text-muted">
                    <th className="px-1 pb-2 font-medium">Player</th>
                    <th className="px-1 pb-2 font-medium">Agent</th>
                    <th className="px-1 pb-2 text-right font-medium">K / D / A</th>
                    <th className="px-1 pb-2 text-right font-medium">KD</th>
                    <th className="px-1 pb-2 text-right font-medium">Matches</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((p) => (
                    <tr
                      key={p.puuid}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="px-1 py-2.5 font-medium text-fg">
                        {p.riotId}
                      </td>
                      <td className="px-1 py-2.5 text-muted">{p.agent}</td>
                      <td className="px-1 py-2.5 text-right font-display tabular-nums text-fg">
                        {p.kills}/{p.deaths}/{p.assists}
                      </td>
                      <td
                        className={`px-1 py-2.5 text-right font-display tabular-nums ${
                          p.kd >= 1 ? "text-win" : "text-loss"
                        }`}
                      >
                        {p.kd.toFixed(2)}
                      </td>
                      <td className="px-1 py-2.5 text-right tabular-nums text-muted">
                        {p.matches}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recent matches */}
          <Card title="Recent matches">
            <ul className="divide-y divide-border/60">
              {entries.map((e) => {
                const s = matchSummary(manifest, e.matchId);
                const isWin = s?.result === "win";
                return (
                  <li key={e.matchId}>
                    <Link
                      href={`/matches/${e.matchId}`}
                      className="group -mx-2 flex items-center gap-4 rounded-md px-2 py-3 transition-colors hover:bg-surface-2"
                    >
                      <span
                        aria-hidden
                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-display text-sm font-semibold ${
                          isWin
                            ? "bg-win/10 text-win"
                            : "bg-loss/10 text-loss"
                        }`}
                      >
                        {isWin ? "W" : "L"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-fg">
                          {s?.map ?? "—"}
                          <span className="ml-2 font-normal text-muted">
                            vs {s?.opponent.name ?? "—"}
                            {s?.opponent.tag ? (
                              <span className="text-muted/70">
                                {" "}
                                · {s.opponent.tag}
                              </span>
                            ) : null}
                          </span>
                        </p>
                      </div>
                      <span className="font-display tabular-nums text-sm text-fg">
                        {s?.score ?? "—"}
                      </span>
                      <span
                        aria-hidden
                        className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
