/**
 * Neutral, ORIGINAL backdrop shapes for the positional map — not a Riot asset.
 * Muted abstract geometry suggests sites, connecting lanes, chokes and a faint
 * center marker, with text site labels. Everything lives in a 0..100 space and
 * stays low-contrast so the kill heat reads clearly on top.
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

type Box = { x: number; y: number; w: number; h: number };
type Site = Box & { label: string };
/** A connector lane drawn as a thin rounded path between two points. */
type Lane = { from: [number, number]; to: [number, number] };

function Sites({ sites }: { sites: Site[] }) {
  return (
    <>
      {sites.map((s, i) => (
        <g key={`site-${i}`}>
          <rect x={s.x} y={s.y} width={s.w} height={s.h} {...rect} />
          <text x={s.x + s.w / 2} y={s.y + s.h / 2} {...labelProps}>
            {s.label}
          </text>
        </g>
      ))}
    </>
  );
}

function Chokes({ boxes }: { boxes: Box[] }) {
  return (
    <>
      {boxes.map((b, i) => (
        <rect
          key={`choke-${i}`}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          {...rect}
          opacity={0.45}
        />
      ))}
    </>
  );
}

function Lanes({ lanes }: { lanes: Lane[] }) {
  return (
    <>
      {lanes.map((l, i) => (
        <line
          key={`lane-${i}`}
          x1={l.from[0]}
          y1={l.from[1]}
          x2={l.to[0]}
          y2={l.to[1]}
          stroke="var(--border)"
          strokeWidth={2.6}
          strokeLinecap="round"
          opacity={0.5}
        />
      ))}
    </>
  );
}

/** Faint diamond marker at map center to anchor the composition. */
function CenterMark({ x = 50, y = 50 }: { x?: number; y?: number }) {
  return (
    <g opacity={0.55}>
      <path
        d={`M ${x} ${y - 2.4} L ${x + 2.4} ${y} L ${x} ${y + 2.4} L ${x - 2.4} ${y} Z`}
        fill="none"
        stroke="var(--border)"
        strokeWidth={0.5}
      />
      <circle cx={x} cy={y} r={0.5} fill="var(--border)" />
    </g>
  );
}

/**
 * Generic layout: connectors drawn behind chokes, behind sites; faint center mark.
 */
function Layout({
  sites,
  chokes = [],
  lanes = [],
  center,
}: {
  sites: Site[];
  chokes?: Box[];
  lanes?: Lane[];
  center?: { x: number; y: number };
}) {
  return (
    <g>
      <Lanes lanes={lanes} />
      <Chokes boxes={chokes} />
      {center ? <CenterMark x={center.x} y={center.y} /> : <CenterMark />}
      <Sites sites={sites} />
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
          chokes={[
            { x: 42, y: 40, w: 16, h: 20 }, // mid courtyard
            { x: 12, y: 40, w: 9, h: 10 }, // A-link
            { x: 80, y: 50, w: 9, h: 10 }, // B-link
          ]}
          lanes={[
            { from: [31, 36], to: [31, 70] }, // A → defenders spawn lane
            { from: [50, 36], to: [50, 60] }, // mid spine
            { from: [44, 25], to: [56, 71] }, // A → B diagonal
            { from: [21, 45], to: [42, 50] }, // A-link → mid
            { from: [58, 55], to: [80, 55] }, // mid → B-link
          ]}
          center={{ x: 50, y: 48 }}
        />
      );
    case "Bind":
      return (
        <Layout
          sites={[
            { x: 14, y: 20, w: 28, h: 24, label: "A" },
            { x: 58, y: 56, w: 28, h: 24, label: "B" },
          ]}
          chokes={[
            { x: 16, y: 56, w: 24, h: 22 }, // A-lobby
            { x: 60, y: 18, w: 24, h: 22 }, // B-lobby
            { x: 46, y: 46, w: 8, h: 8 }, // hookah/teleport hub
          ]}
          lanes={[
            { from: [28, 44], to: [28, 67] }, // A → A-lobby
            { from: [72, 42], to: [72, 56] }, // B-lobby → B
            { from: [42, 32], to: [58, 68] }, // A → B short
            { from: [50, 30], to: [50, 56] }, // mid spine
          ]}
          center={{ x: 50, y: 50 }}
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
          chokes={[
            { x: 44, y: 22, w: 8, h: 18 }, // mid window
            { x: 24, y: 64, w: 10, h: 9 }, // garage
            { x: 70, y: 50, w: 9, h: 10 }, // C-long
          ]}
          lanes={[
            { from: [26, 30], to: [38, 52] }, // A → B
            { from: [50, 30], to: [50, 70] }, // mid spine
            { from: [50, 52], to: [74, 80] }, // B → C
            { from: [38, 20], to: [74, 80] }, // A → C long diagonal
          ]}
          center={{ x: 50, y: 50 }}
        />
      );
    default:
      return (
        <Layout
          sites={[
            { x: 18, y: 18, w: 26, h: 22, label: "A" },
            { x: 56, y: 58, w: 26, h: 22, label: "B" },
          ]}
          chokes={[
            { x: 40, y: 38, w: 20, h: 22 }, // mid
            { x: 14, y: 44, w: 9, h: 10 }, // A-link
            { x: 78, y: 48, w: 9, h: 10 }, // B-link
          ]}
          lanes={[
            { from: [31, 40], to: [31, 68] },
            { from: [50, 40], to: [50, 58] },
            { from: [44, 29], to: [56, 69] },
          ]}
          center={{ x: 50, y: 50 }}
        />
      );
  }
}
