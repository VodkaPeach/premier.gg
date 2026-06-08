import type { Match, Side } from "@/domain/types";
import { MAP_CALIB, toMinimap, type MapKey } from "@/geo/calibration";

export interface TimelineRound {
  num: number; winner: Side; attacker: Side; outcome: string;
  hasPlant: boolean; hasDefuse: boolean;
}

export function roundTimeline(match: Match): TimelineRound[] {
  return match.rounds.map((r) => ({
    num: r.num, winner: r.winner, attacker: r.attackingSide, outcome: r.outcome,
    hasPlant: !!r.plant, hasDefuse: !!r.defuse,
  }));
}

export type EventKind = "kill" | "plant" | "defuse";
export interface EventPoint { kind: EventKind; nx: number; ny: number; side?: Side; round: number; }

const calibFor = (map: Match["map"]) => MAP_CALIB[map as MapKey] ?? MAP_CALIB.Ascent;

export function eventPoints(match: Match): EventPoint[] {
  const c = calibFor(match.map);
  const pts: EventPoint[] = [];
  for (const r of match.rounds) {
    for (const k of r.kills) {
      const n = toMinimap(k.victimLoc, c);
      pts.push({ kind: "kill", nx: clamp01(n.x), ny: clamp01(n.y), round: r.num });
    }
    if (r.plant) { const n = toMinimap(r.plant.loc, c); pts.push({ kind: "plant", nx: clamp01(n.x), ny: clamp01(n.y), round: r.num }); }
    if (r.defuse) { const n = toMinimap(r.defuse.loc, c); pts.push({ kind: "defuse", nx: clamp01(n.x), ny: clamp01(n.y), round: r.num }); }
  }
  return pts;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
