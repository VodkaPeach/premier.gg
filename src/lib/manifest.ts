import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface ManifestMatchSummary {
  matchId: string;
  map: string;
  result: "win" | "loss";
  score: string;
  opponent: { name: string; tag: string };
}

export interface ManifestRosterEntry {
  puuid: string;
  gameName: string;
  tagLine: string;
  agent: string;
}

export interface Manifest {
  captainPuuid: string;
  team: { name: string; tag: string; roster: ManifestRosterEntry[] };
  matches: ManifestMatchSummary[];
}

const MANIFEST_PATH = join(process.cwd(), "src", "fixtures", "manifest.json");

export function readManifest(): Manifest {
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
}

export function matchSummary(
  manifest: Manifest,
  matchId: string,
): ManifestMatchSummary | undefined {
  return manifest.matches.find((m) => m.matchId === matchId);
}
