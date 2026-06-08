"use client";

import { useId, useMemo, useState } from "react";
import type { EventPoint } from "@/analytics/match";
import { Backdrop } from "./backdrops";

/* ──────────────────────────────────────────────────────────────────────────
 * Filterable positional heatmap.
 *
 * Kills are rendered as an additive SVG-blur density field (red hot-zones);
 * plants and defuses are crisp markers layered on top. Three filter axes —
 * event type, team (by point.side), and match phase (derived from round) —
 * narrow the rendered set. Pure client component; same export + props as before.
 * ────────────────────────────────────────────────────────────────────────── */

type Kind = EventPoint["kind"];
type TeamFilter = "all" | "Blue" | "Red";
type PhaseFilter = "all" | "h1" | "h2" | "ot";

const KILL_DEFAULTS: Record<Kind, boolean> = { kill: true, plant: true, defuse: true };

/** round < 12 → 1st half, < 24 → 2nd half, else OT. */
function phaseOf(round: number): Exclude<PhaseFilter, "all"> {
  if (round < 12) return "h1";
  if (round < 24) return "h2";
  return "ot";
}

const TEAM_SEGMENTS: { value: TeamFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Blue", label: "Blue" },
  { value: "Red", label: "Red" },
];

const PHASE_SEGMENTS: { value: PhaseFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "h1", label: "1st half" },
  { value: "h2", label: "2nd half" },
  { value: "ot", label: "OT" },
];

const KIND_CHIPS: { kind: Kind; label: string; dot: string }[] = [
  { kind: "kill", label: "Kills", dot: "var(--loss)" },
  { kind: "plant", label: "Plants", dot: "var(--accent)" },
  { kind: "defuse", label: "Defuses", dot: "var(--win)" },
];

export default function MatchMap({
  points,
  map,
}: {
  points: EventPoint[];
  map: string;
}) {
  const [enabled, setEnabled] = useState<Record<Kind, boolean>>(KILL_DEFAULTS);
  const [team, setTeam] = useState<TeamFilter>("all");
  const [phase, setPhase] = useState<PhaseFilter>("all");

  // Stable, unique filter ids so multiple maps on a page never collide.
  const uid = useId().replace(/[:]/g, "");
  const heatId = `heat-${uid}`;
  const glowId = `glow-${uid}`;

  const matchesTeamPhase = useMemo(() => {
    return (p: EventPoint) => {
      if (team !== "all" && p.side !== team) return false;
      if (phase !== "all" && phaseOf(p.round) !== phase) return false;
      return true;
    };
  }, [team, phase]);

  const shown = useMemo(
    () => points.filter((p) => enabled[p.kind] && matchesTeamPhase(p)),
    [points, enabled, matchesTeamPhase],
  );

  const kills = useMemo(() => shown.filter((p) => p.kind === "kill"), [shown]);
  const plants = useMemo(() => shown.filter((p) => p.kind === "plant"), [shown]);
  const defuses = useMemo(() => shown.filter((p) => p.kind === "defuse"), [shown]);

  const toggleKind = (k: Kind) =>
    setEnabled((prev) => ({ ...prev, [k]: !prev[k] }));

  return (
    <figure className="flex flex-col gap-4">
      {/* ── Filter controls ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {KIND_CHIPS.map((c) => (
            <Chip
              key={c.kind}
              active={enabled[c.kind]}
              dot={c.dot}
              onClick={() => toggleKind(c.kind)}
            >
              {c.label}
            </Chip>
          ))}
          <span className="ml-auto text-sm tabular-nums text-muted">
            {shown.length} event{shown.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Segmented
            label="Team"
            segments={TEAM_SEGMENTS}
            value={team}
            onChange={setTeam}
          />
          <Segmented
            label="Phase"
            segments={PHASE_SEGMENTS}
            value={phase}
            onChange={setPhase}
          />
        </div>
      </div>

      {/* ── Map ─────────────────────────────────────────────────────────── */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          role="img"
          aria-label={`Event-point heatmap for ${map}`}
        >
          <defs>
            {/* Wide blur builds soft density from overlapping kill blobs. */}
            <filter id={heatId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" />
            </filter>
            {/* Tighter blur adds intensity to the hottest cores. */}
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.6" />
            </filter>
          </defs>

          <Backdrop map={map} />

          {/* Kill heat — additive translucent circles under two blur passes. */}
          {kills.length > 0 && (
            <>
              <g filter={`url(#${heatId})`}>
                {kills.map((p, i) => (
                  <circle
                    key={`hk-${i}`}
                    cx={p.nx * 100}
                    cy={p.ny * 100}
                    r={4}
                    fill="var(--loss)"
                    opacity={0.22}
                  />
                ))}
              </g>
              <g filter={`url(#${glowId})`}>
                {kills.map((p, i) => (
                  <circle
                    key={`gk-${i}`}
                    cx={p.nx * 100}
                    cy={p.ny * 100}
                    r={2}
                    fill="var(--loss)"
                    opacity={0.3}
                  />
                ))}
              </g>
            </>
          )}

          {/* Plants — accent diamond with a thin halo. */}
          {plants.map((p, i) => (
            <PlantMarker key={`pl-${i}`} x={p.nx * 100} y={p.ny * 100} />
          ))}

          {/* Defuses — win-green dot with a halo. */}
          {defuses.map((p, i) => (
            <DefuseMarker key={`df-${i}`} x={p.nx * 100} y={p.ny * 100} />
          ))}
        </svg>

        {/* Empty state overlays the map area. */}
        {shown.length === 0 && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <p className="rounded-lg border border-border bg-surface-2/80 px-3 py-1.5 text-sm text-muted backdrop-blur-sm">
              No events match these filters.
            </p>
          </div>
        )}
      </div>

      {/* ── Legend ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
        <span className="flex items-center gap-1.5 text-fg">
          <span
            className="inline-block h-2.5 w-4 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(248,113,113,0.15), var(--loss))",
            }}
          />
          Kill heat
        </span>
        <span className="flex items-center gap-1.5 text-fg">
          <span
            className="inline-block h-2.5 w-2.5 rotate-45 rounded-[1px]"
            style={{ backgroundColor: "var(--accent)" }}
          />
          Plant
        </span>
        <span className="flex items-center gap-1.5 text-fg">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "var(--win)" }}
          />
          Defuse
        </span>
      </div>

      <figcaption className="text-sm text-muted">
        Event points (kills/plants), not continuous movement.
      </figcaption>
    </figure>
  );
}

/* ── UI primitives ───────────────────────────────────────────────────────── */

function Chip({
  active,
  dot,
  onClick,
  children,
}: {
  active: boolean;
  dot: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
        active
          ? "border-accent/60 bg-accent/15 text-fg"
          : "border-border bg-surface-2 text-muted hover:text-fg"
      }`}
    >
      <span
        aria-hidden
        className="inline-block h-2 w-2 rounded-full transition-opacity"
        style={{ backgroundColor: dot, opacity: active ? 1 : 0.4 }}
      />
      {children}
    </button>
  );
}

function Segmented<T extends string>({
  label,
  segments,
  value,
  onChange,
}: {
  label: string;
  segments: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      <div
        role="group"
        aria-label={label}
        className="inline-flex rounded-lg border border-border bg-surface-2 p-0.5"
      >
        {segments.map((s) => {
          const active = s.value === value;
          return (
            <button
              key={s.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(s.value)}
              className={`rounded-md px-2.5 py-1 text-sm font-medium transition-colors ${
                active
                  ? "bg-accent/20 text-fg shadow-[inset_0_0_0_1px_var(--accent)]"
                  : "text-muted hover:text-fg"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PlantMarker({ x, y }: { x: number; y: number }) {
  const r = 1.9;
  return (
    <g>
      <circle cx={x} cy={y} r={r + 1.1} fill="none" stroke="var(--accent)" strokeWidth={0.4} opacity={0.55} />
      <path
        d={`M ${x} ${y - r} L ${x + r} ${y} L ${x} ${y + r} L ${x - r} ${y} Z`}
        fill="var(--accent)"
        stroke="var(--bg)"
        strokeWidth={0.3}
      />
    </g>
  );
}

function DefuseMarker({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={2.9} fill="none" stroke="var(--win)" strokeWidth={0.4} opacity={0.55} />
      <circle cx={x} cy={y} r={1.7} fill="var(--win)" stroke="var(--bg)" strokeWidth={0.3} />
    </g>
  );
}
