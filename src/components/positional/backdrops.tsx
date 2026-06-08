/**
 * Neutral, ORIGINAL backdrop shapes for the positional map — not a Riot asset.
 * A few muted rectangles suggest sites + a mid lane, with text site labels.
 * Everything lives in a 0..100 coordinate space.
 */

const rect = {
  fill: "var(--surface-2)",
  stroke: "var(--border)",
  strokeWidth: 0.4,
  rx: 2,
} as const;

const labelProps = {
  fill: "var(--muted)",
  fontSize: 6,
  fontWeight: 600,
  textAnchor: "middle" as const,
  dominantBaseline: "central" as const,
};

type Site = { x: number; y: number; w: number; h: number; label: string };

/** Generic two-site + mid layout used as the fallback and the basis for named maps. */
function Layout({ sites, lanes }: { sites: Site[]; lanes: Site[] }) {
  return (
    <g>
      {/* mid + connecting lanes (drawn first, behind the sites) */}
      {lanes.map((l, i) => (
        <rect key={`lane-${i}`} x={l.x} y={l.y} width={l.w} height={l.h} {...rect} opacity={0.6} />
      ))}
      {/* sites */}
      {sites.map((s, i) => (
        <g key={`site-${i}`}>
          <rect x={s.x} y={s.y} width={s.w} height={s.h} {...rect} />
          <text x={s.x + s.w / 2} y={s.y + s.h / 2} {...labelProps}>
            {s.label}
          </text>
        </g>
      ))}
    </g>
  );
}

export function Backdrop({ map }: { map: string }) {
  switch (map) {
    case "Ascent":
      return (
        <Layout
          sites={[
            { x: 18, y: 14, w: 26, h: 22, label: "A" },
            { x: 56, y: 60, w: 26, h: 22, label: "B" },
          ]}
          lanes={[
            { x: 42, y: 40, w: 16, h: 20, label: "mid" },
            { x: 46, y: 14, w: 8, h: 72, label: "mid-line" },
          ]}
        />
      );
    case "Bind":
      return (
        <Layout
          sites={[
            { x: 14, y: 20, w: 28, h: 24, label: "A" },
            { x: 58, y: 56, w: 28, h: 24, label: "B" },
          ]}
          lanes={[
            { x: 16, y: 56, w: 24, h: 22, label: "A-lobby" },
            { x: 60, y: 18, w: 24, h: 22, label: "B-lobby" },
          ]}
        />
      );
    case "Haven":
      return (
        <Layout
          sites={[
            { x: 14, y: 10, w: 24, h: 20, label: "A" },
            { x: 38, y: 42, w: 24, h: 20, label: "B" },
            { x: 62, y: 70, w: 24, h: 20, label: "C" },
          ]}
          lanes={[{ x: 42, y: 14, w: 8, h: 72, label: "mid" }]}
        />
      );
    default:
      return (
        <Layout
          sites={[
            { x: 18, y: 18, w: 26, h: 22, label: "A" },
            { x: 56, y: 58, w: 26, h: 22, label: "B" },
          ]}
          lanes={[{ x: 40, y: 38, w: 20, h: 22, label: "mid" }]}
        />
      );
  }
}
