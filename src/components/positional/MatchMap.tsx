"use client";

import { useMemo, useState } from "react";
import type { EventPoint } from "@/analytics/match";
import { Backdrop } from "./backdrops";

/* ──────────────────────────────────────────────────────────────────────────
 * Filterable positional event map.
 *
 * Every event is a discrete, distinct marker — never a blurred density field —
 * so kills, plants and defuses stay individually legible by both colour and
 * shape: red dots (kills), violet diamonds (plants), green rings (defuses).
 * Three filter axes — event type, team (by point.side), and match phase
 * (derived from round) — narrow the rendered set. Pure client component; same
 * export + props as before.
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
  { kind: "kill", label: "Kills", dot: "rgb(var(--loss))" },
  { kind: "plant", label: "Plants", dot: "rgb(var(--accent))" },
  { kind: "defuse", label: "Defuses", dot: "rgb(var(--win))" },
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
          aria-label={`Event-point map for ${map}`}
        >
          <Backdrop map={map} />

          {/* Draw kills first (underneath) so the sparse, important plant and
              defuse markers always sit on top and are never occluded. */}
          {/* Kills — small solid red dots; discrete even where they overlap. */}
          {kills.map((p, i) => (
            <circle
              key={`kl-${i}`}
              cx={p.nx * 100}
              cy={p.ny * 100}
              r={1.3}
              fill="rgb(var(--loss))"
              fillOpacity={0.85}
            />
          ))}

          {/* Plants — accent (violet) diamond with a lighter halo. */}
          {plants.map((p, i) => (
            <PlantMarker key={`pl-${i}`} x={p.nx * 100} y={p.ny * 100} />
          ))}

          {/* Defuses — win-green ring with a halo. */}
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
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: "rgb(var(--loss))" }}
          />
          Kill
        </span>
        <span className="flex items-center gap-1.5 text-fg">
          <span
            className="inline-block h-2.5 w-2.5 rotate-45 rounded-[1px] ring-1 ring-white/40"
            style={{ backgroundColor: "rgb(var(--accent))" }}
          />
          Plant
        </span>
        <span className="flex items-center gap-1.5 text-fg">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full border-2"
            style={{ borderColor: "rgb(var(--win))" }}
          />
          Defuse
        </span>
      </div>

      <figcaption className="text-sm text-muted">
        Event points (kills/plants/defuses), not continuous movement.
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
                  ? "bg-accent/20 text-fg shadow-[inset_0_0_0_1px_rgb(var(--accent))]"
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

/** Plant — violet diamond (rotated square) with a thin lighter halo. */
function PlantMarker({ x, y }: { x: number; y: number }) {
  const r = 2.2;
  const diamond = `M ${x} ${y - r} L ${x + r} ${y} L ${x} ${y + r} L ${x - r} ${y} Z`;
  return (
    <g>
      {/* Lighter outer halo so the diamond pops off the backdrop. */}
      <path
        d={`M ${x} ${y - (r + 1)} L ${x + (r + 1)} ${y} L ${x} ${y + (r + 1)} L ${x - (r + 1)} ${y} Z`}
        fill="none"
        stroke="#c4b5ff"
        strokeWidth={0.5}
        opacity={0.7}
      />
      <path d={diamond} fill="rgb(var(--accent))" stroke="rgb(var(--bg))" strokeWidth={0.4} />
    </g>
  );
}

/** Defuse — hollow win-green ring with a halo; distinct from kill dot + plant. */
function DefuseMarker({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={3} fill="none" stroke="#a7f3c8" strokeWidth={0.5} opacity={0.6} />
      <circle
        cx={x}
        cy={y}
        r={2.2}
        fill="rgb(var(--bg))"
        fillOpacity={0.35}
        stroke="rgb(var(--win))"
        strokeWidth={0.9}
      />
    </g>
  );
}
