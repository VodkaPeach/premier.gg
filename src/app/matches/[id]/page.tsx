import Link from "next/link";
import { notFound } from "next/navigation";
import { requireLinked } from "@/lib/auth";
import { getMatchSource } from "@/lib/match-source";
import { parseMatch } from "@/domain/parse-match";
import { roundTimeline, eventPoints } from "@/analytics/match";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import MatchMap from "@/components/positional/MatchMap";
import type { Side } from "@/domain/types";

const SIDES: Side[] = ["Blue", "Red"];

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireLinked();

  const { id } = await params;
  const source = getMatchSource();

  const dto = await source.getMatch(id).catch(() => null);
  if (!dto) notFound();
  const match = parseMatch(dto);

  const blueScore = match.teams.Blue.roundsWon;
  const redScore = match.teams.Red.roundsWon;
  const timeline = roundTimeline(match);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1">
        {/* Header band — map, score, meta. Violet glow + faint grid for depth. */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(48rem 26rem at 18% -30%, rgba(124,92,255,0.18), transparent 62%)",
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
                "radial-gradient(46rem 22rem at 20% 0%, black, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(46rem 22rem at 20% 0%, black, transparent 80%)",
            }}
          />

          <div className="mx-auto max-w-6xl px-6 py-9">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
            >
              <span
                aria-hidden
                className="transition-transform group-hover:-translate-x-0.5"
              >
                ←
              </span>
              Dashboard
            </Link>

            <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">
                  Match detail
                </p>
                <h1 className="mt-2 flex flex-wrap items-baseline gap-x-3 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                  {match.map}
                  <span className="text-lg font-medium capitalize text-muted sm:text-xl">
                    · {match.queue}
                  </span>
                </h1>
                <p className="mt-2 text-sm text-muted">
                  {match.rounds.length} rounds · patch {match.patch}
                </p>
              </div>

              {/* Scoreline — Blue vs Red */}
              <div className="flex items-center gap-4">
                <ScorePill score={blueScore} won={match.teams.Blue.won} side="Blue" />
                <span className="font-display text-xl text-muted">–</span>
                <ScorePill score={redScore} won={match.teams.Red.won} side="Red" />
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
          {/* Scoreboards */}
          <div className="grid gap-4 lg:grid-cols-2">
            {SIDES.map((side) => (
              <Scoreboard key={side} side={side} match={match} />
            ))}
          </div>

          {/* Round timeline */}
          <Card title="Round timeline">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {timeline.map((r) => {
                  const blueWon = r.winner === "Blue";
                  return (
                    <div
                      key={r.num}
                      title={`Round ${r.num} · ${r.winner} won · ${r.outcome}`}
                      className={`relative grid h-11 w-9 place-items-center rounded-md border text-sm font-medium tabular-nums transition-colors ${
                        blueWon
                          ? "border-accent/60 bg-accent/30 text-fg"
                          : "border-loss/60 bg-loss/25 text-fg"
                      }`}
                    >
                      <span className="font-display">{r.num}</span>
                      {(r.hasPlant || r.hasDefuse) && (
                        <span className="absolute bottom-1 flex items-center gap-0.5">
                          {r.hasPlant && (
                            <span
                              aria-hidden
                              title="Spike planted"
                              className="block h-1.5 w-1.5 rounded-full bg-accent"
                            />
                          )}
                          {r.hasDefuse && (
                            <span
                              aria-hidden
                              title="Spike defused"
                              className="block h-1.5 w-1.5 rounded-full bg-win"
                            />
                          )}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="block h-2.5 w-2.5 rounded-sm border border-accent/60 bg-accent/30" />
                  Blue round
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="block h-2.5 w-2.5 rounded-sm border border-loss/60 bg-loss/25" />
                  Red round
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-accent" />
                  Plant
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-win" />
                  Defuse
                </span>
              </div>
            </div>
          </Card>

          {/* Positional map */}
          <Card title="Positions — kills & plants">
            <MatchMap points={eventPoints(match)} map={String(match.map)} />
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/** Compact score badge tinted by side, ringed when that side won. */
function ScorePill({
  score,
  won,
  side,
}: {
  score: number;
  won: boolean;
  side: Side;
}) {
  const tint =
    side === "Blue"
      ? "bg-accent/15 text-accent"
      : "bg-loss/10 text-loss";
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={`grid h-16 w-16 place-items-center rounded-xl font-display text-3xl font-semibold tabular-nums ${tint} ${
          won ? "ring-2 ring-inset ring-current" : ""
        }`}
      >
        {score}
      </span>
      <span className="text-sm font-medium uppercase tracking-[0.12em] text-muted">
        {side}
        {won ? " · W" : ""}
      </span>
    </div>
  );
}

/** Per-side scoreboard card with the side's five players. */
function Scoreboard({
  side,
  match,
}: {
  side: Side;
  match: ReturnType<typeof parseMatch>;
}) {
  const won = match.teams[side].won;
  const accent = side === "Blue" ? "text-accent" : "text-loss";
  const players = match.players.filter((p) => p.side === side);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-sm font-medium tracking-wide text-fg">
          <span className={`text-base leading-none ${accent}`} aria-hidden>
            ●
          </span>
          {side}
          {won ? (
            <span className="rounded border border-win/40 bg-win/10 px-1.5 py-0.5 text-sm font-semibold uppercase tracking-wide text-win">
              Won
            </span>
          ) : null}
        </h3>
        <span className="font-display text-sm tabular-nums text-muted">
          {match.teams[side].roundsWon}
          <span className="text-muted/60">/{match.teams[side].roundsPlayed}</span>
        </span>
      </div>

      <div className="-mx-1 overflow-x-auto">
        <table className="w-full min-w-[30rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-sm uppercase tracking-[0.12em] text-muted">
              <th className="px-1 pb-2 font-medium">Player</th>
              <th className="px-1 pb-2 font-medium">Agent</th>
              <th className="px-1 pb-2 text-right font-medium">K</th>
              <th className="px-1 pb-2 text-right font-medium">D</th>
              <th className="px-1 pb-2 text-right font-medium">A</th>
              <th className="px-1 pb-2 text-right font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr
                key={p.puuid}
                className="border-b border-border/60 last:border-0"
              >
                <td className="px-1 py-2.5 font-medium text-fg">{p.riotId}</td>
                <td className="px-1 py-2.5 text-muted">{p.agent}</td>
                <td className="px-1 py-2.5 text-right font-display tabular-nums text-fg">
                  {p.kills}
                </td>
                <td className="px-1 py-2.5 text-right font-display tabular-nums text-muted">
                  {p.deaths}
                </td>
                <td className="px-1 py-2.5 text-right font-display tabular-nums text-fg">
                  {p.assists}
                </td>
                <td className="px-1 py-2.5 text-right font-display tabular-nums text-fg">
                  {p.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
