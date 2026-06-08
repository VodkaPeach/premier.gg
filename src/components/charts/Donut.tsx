import { dashArray } from "./geometry";

/** Single-ratio donut (value 0..1). Center shows the percentage; `label` sits below. */
export default function Donut({ value, label }: { value: number; label: string }) {
  const r = 40;
  const [filled, gap] = dashArray(value, r);
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="rgb(var(--surface-2))"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="rgb(var(--accent))"
            strokeWidth="10"
            strokeDasharray={`${filled} ${gap}`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-xl tabular-nums tracking-tight">
          {pct}
          <span className="ml-0.5 text-sm text-muted">%</span>
        </span>
      </div>
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
