/** A single stat tile: large display value (tone-colored), uppercase label, optional sub. */
export default function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "win" | "loss" | "default";
}) {
  const valueTone =
    tone === "win"
      ? "text-win"
      : tone === "loss"
        ? "text-loss"
        : "text-accent";

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <p
        className={`mt-1 font-display text-3xl font-semibold leading-none tabular-nums ${valueTone}`}
      >
        {value}
      </p>
      {sub ? <p className="mt-1.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}
