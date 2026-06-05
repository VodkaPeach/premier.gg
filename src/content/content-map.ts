// UUID -> display name resolution. Values are real published Valorant IDs but should be
// re-synced from val-content-v1 (with locale) in Phase 1. Agent/weapon names here are the
// canonical English keys; localized names come from val-content-v1 at render time.

import type { MapKey } from "../geo/calibration";

export const AGENTS: Record<string, string> = {
  "41fb69c1-4189-7b37-f117-bcaf1e96f1bf": "Astra",
  "5f8d3a7f-467b-97f3-062c-13acf203c006": "Breach",
  "9f0d8ba9-4140-b941-57d3-a7ad57c6b417": "Brimstone",
  "22697a3d-45bf-8dd7-4fec-84a9e28c69d7": "Chamber",
  "117ed9e3-49f3-6512-3ccf-0cada7e3823b": "Cypher",
  "dade69b4-4f5a-8528-247b-219e5a1facd6": "Fade",
  "add6443a-41bd-e414-f6ad-e58d267f4e95": "Jett",
  "601dbbe7-43ce-be57-2a40-4abd24953621": "KAY/O",
  "1e58de9c-4950-5125-93e9-a0aee9f98746": "Killjoy",
  "bb2a4828-46eb-8cd1-e765-15848195d751": "Neon",
  "8e253930-3b4d-c4c6-3e9d-43f8d2c5b8b0": "Omen",
  "eb93336a-449b-9c1b-0a54-a891f7921d69": "Phoenix",
  "f94c3b30-42be-e959-889c-5aa313dba261": "Raze",
  "a3bfb853-43b2-7238-a4f1-ad90e9e46bcc": "Reyna",
  "569fdd95-4d10-43ab-ca70-79becc718b46": "Sage",
  "6f2a04ca-43e0-be17-7f36-b3908627744d": "Skye",
  "320b2a48-4d9b-a075-30f1-1f93a9b638fa": "Sova",
  "707eab51-4836-f488-046a-cda6bf494859": "Viper",
  "7f94d92c-4234-0a36-9646-3a87eb8b5c89": "Yoru",
};

export const WEAPONS: Record<string, string> = {
  "29a0cfab-485b-f5d5-779a-b59f85e204a8": "Classic",
  "1baa85b4-4c70-1284-64bb-6481dfc3bb4e": "Ghost",
  "e336c6b8-418d-9340-d77f-7a9e4cfe0702": "Sheriff",
  "462080d1-4035-2937-7c09-27aa2a5c27a7": "Spectre",
  "4ade7faa-4cf1-8376-95ef-39884480959b": "Guardian",
  "ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a": "Phantom",
  "9c82e19d-4575-0200-1a81-3eacf00cf872": "Vandal",
  "c4883e50-4494-202c-3ec3-6b8a9284f00b": "Marshal",
  "a03b24d3-4319-996d-0f8c-94bbfba1dfc7": "Operator",
  "63e6c2b6-4a8e-869c-3d4c-e38355226584": "Odin",
};

export const ARMORS: Record<string, string> = {
  "": "None",
  "4dec83d5-4902-9ab3-bed6-a7a390761157": "Light Shields",
  "822bcab2-40a2-324e-c137-e09195ad7692": "Heavy Shields",
};

const MAP_PATHS: Record<string, MapKey> = {
  "/Game/Maps/Ascent/Ascent": "Ascent",
  "/Game/Maps/Duality/Duality": "Bind",
  "/Game/Maps/Triad/Triad": "Haven",
  "/Game/Maps/Bonsai/Bonsai": "Split",
  "/Game/Maps/Port/Port": "Icebox",
  "/Game/Maps/Foxtrot/Foxtrot": "Breeze",
  "/Game/Maps/Canyon/Canyon": "Fracture",
  "/Game/Maps/Pitt/Pitt": "Pearl",
  "/Game/Maps/Jam/Jam": "Lotus",
  "/Game/Maps/Juliett/Juliett": "Sunset",
  "/Game/Maps/Infinity/Infinity": "Abyss",
};

export const resolveAgent = (uuid: string): string => AGENTS[uuid] ?? uuid;
export const resolveWeapon = (uuid: string): string => WEAPONS[uuid] ?? uuid;
export const resolveArmor = (uuid: string): string => ARMORS[uuid] ?? "None";
export const resolveMap = (path: string): MapKey | string => MAP_PATHS[path] ?? path;
