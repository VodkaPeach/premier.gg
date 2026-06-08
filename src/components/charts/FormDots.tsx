/** Horizontal row of W/L dots (most-recent-first as given): text-win for "W", text-loss for "L". */
export default function FormDots({ form }: { form: ("W" | "L")[] }) {
  return (
    <div className="flex items-center gap-1.5" aria-label="Recent form">
      {form.map((r, i) => (
        <span
          key={i}
          title={r === "W" ? "Win" : "Loss"}
          className={`text-base leading-none ${r === "W" ? "text-win" : "text-loss"}`}
        >
          ●
        </span>
      ))}
    </div>
  );
}
