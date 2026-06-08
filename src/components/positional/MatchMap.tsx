import type { EventPoint } from "@/analytics/match";
import { Backdrop } from "./backdrops";

const KIND_COLOR: Record<EventPoint["kind"], string> = {
  kill: "var(--loss)",
  plant: "var(--accent)",
  defuse: "var(--win)",
};

const LEGEND: { kind: EventPoint["kind"]; label: string }[] = [
  { kind: "kill", label: "Kill" },
  { kind: "plant", label: "Plant" },
  { kind: "defuse", label: "Defuse" },
];

/**
 * Positional map: a neutral backdrop with one dot per event point.
 * Renders discrete event locations (kills/plants/defuses), not continuous movement.
 * Pure server component.
 */
export default function MatchMap({
  points,
  map,
}: {
  points: EventPoint[];
  map: string;
}) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          role="img"
          aria-label={`Event-point map for ${map}`}
        >
          <Backdrop map={map} />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.nx * 100}
              cy={p.ny * 100}
              r="1.4"
              fill={KIND_COLOR[p.kind]}
              fillOpacity={0.9}
            />
          ))}
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
        {LEGEND.map((l) => (
          <span key={l.kind} className="flex items-center gap-1.5 text-fg">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: KIND_COLOR[l.kind] }}
            />
            {l.label}
          </span>
        ))}
      </div>

      <figcaption className="text-xs text-muted">
        Event points (kills/plants), not continuous movement.
      </figcaption>
    </figure>
  );
}
