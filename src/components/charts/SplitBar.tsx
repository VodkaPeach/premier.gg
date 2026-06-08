/**
 * Two-segment horizontal bar for an attack/defense split.
 * `leftValue`/`rightValue` are ratios 0..1, rendered as two labeled segments.
 */
export default function SplitBar({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: {
  leftLabel: string;
  leftValue: number;
  rightLabel: string;
  rightValue: number;
}) {
  const left = Math.max(0, Math.min(1, leftValue));
  const right = Math.max(0, Math.min(1, rightValue));
  // Normalize the two ratios into bar widths so the segments always span the track.
  const total = left + right;
  const leftW = total > 0 ? (left / total) * 100 : 50;
  const rightW = total > 0 ? (right / total) * 100 : 50;
  const fmt = (v: number) => `${Math.round(v * 100)}%`;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span className="flex items-center gap-1.5 text-fg">
          <span className="inline-block h-2 w-2 rounded-full bg-accent" />
          {leftLabel}
          <span className="font-display tabular-nums text-muted">{fmt(left)}</span>
        </span>
        <span className="flex items-center gap-1.5 text-fg">
          <span className="font-display tabular-nums text-muted">{fmt(right)}</span>
          {rightLabel}
          <span className="inline-block h-2 w-2 rounded-full bg-win" />
        </span>
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div className="h-full bg-accent" style={{ width: `${leftW}%` }} />
        <div className="h-full bg-win" style={{ width: `${rightW}%` }} />
      </div>
    </div>
  );
}
