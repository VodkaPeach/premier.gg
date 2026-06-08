// Deterministic fixture generator for premier.gg Phase 0.
// Emits val-match-v1-shaped MatchDto fixtures + matchlist + manifest.
// Run: node docs/fixtures/generate.mjs   (seeded -> identical output every run)
//
// Variety (per project decision): 5 Premier matches, Ascent x2 + Bind x2 + Haven x1
// (so map trends show), W/L/W/W/L from the captain team's perspective, Rival Squad faced
// twice (co-played opponent scouting demo), and m-0001 contains a 1vX clutch + multiple plants.

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const MATCH_DIR = join(HERE, "matches");
mkdirSync(MATCH_DIR, { recursive: true });

// ---------- seeded RNG (mulberry32) ----------
let _s = 1337 >>> 0;
const rnd = () => {
  _s |= 0; _s = (_s + 0x6d2b79f5) | 0;
  let t = Math.imul(_s ^ (_s >>> 15), 1 | _s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const chance = (p) => rnd() < p;
const shuffle = (arr) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };

// ---------- content ids (must match docs/content/content-map.ts) ----------
const A = {
  Astra: "41fb69c1-4189-7b37-f117-bcaf1e96f1bf", Breach: "5f8d3a7f-467b-97f3-062c-13acf203c006",
  Brimstone: "9f0d8ba9-4140-b941-57d3-a7ad57c6b417", Chamber: "22697a3d-45bf-8dd7-4fec-84a9e28c69d7",
  Cypher: "117ed9e3-49f3-6512-3ccf-0cada7e3823b", Fade: "dade69b4-4f5a-8528-247b-219e5a1facd6",
  Jett: "add6443a-41bd-e414-f6ad-e58d267f4e95", KAYO: "601dbbe7-43ce-be57-2a40-4abd24953621",
  Killjoy: "1e58de9c-4950-5125-93e9-a0aee9f98746", Neon: "bb2a4828-46eb-8cd1-e765-15848195d751",
  Omen: "8e253930-3b4d-c4c6-3e9d-43f8d2c5b8b0", Phoenix: "eb93336a-449b-9c1b-0a54-a891f7921d69",
  Raze: "f94c3b30-42be-e959-889c-5aa313dba261", Reyna: "a3bfb853-43b2-7238-a4f1-ad90e9e46bcc",
  Sage: "569fdd95-4d10-43ab-ca70-79becc718b46", Skye: "6f2a04ca-43e0-be17-7f36-b3908627744d",
  Sova: "320b2a48-4d9b-a075-30f1-1f93a9b638fa", Viper: "707eab51-4836-f488-046a-cda6bf494859",
  Yoru: "7f94d92c-4234-0a36-9646-3a87eb8b5c89",
};
const W = {
  Classic: "29a0cfab-485b-f5d5-779a-b59f85e204a8", Ghost: "1baa85b4-4c70-1284-64bb-6481dfc3bb4e",
  Sheriff: "e336c6b8-418d-9340-d77f-7a9e4cfe0702", Spectre: "462080d1-4035-2937-7c09-27aa2a5c27a7",
  Guardian: "4ade7faa-4cf1-8376-95ef-39884480959b", Phantom: "ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a",
  Vandal: "9c82e19d-4575-0200-1a81-3eacf00cf872", Marshal: "c4883e50-4494-202c-3ec3-6b8a9284f00b",
  Operator: "a03b24d3-4319-996d-0f8c-94bbfba1dfc7", Odin: "63e6c2b6-4a8e-869c-3d4c-e38355226584",
};
const ARMOR_LIGHT = "4dec83d5-4902-9ab3-bed6-a7a390761157";
const ARMOR_HEAVY = "822bcab2-40a2-324e-c137-e09195ad7692";

const MAP_PATH = {
  Ascent: "/Game/Maps/Ascent/Ascent", Bind: "/Game/Maps/Duality/Duality", Haven: "/Game/Maps/Triad/Triad",
};
const CALIB = {
  Ascent: { xMul: 7.0e-5, yMul: -7.0e-5, xAdd: 0.813895, yAdd: 0.573242 },
  Bind:   { xMul: 5.9e-5, yMul: -5.9e-5, xAdd: 0.576941, yAdd: 0.967566 },
  Haven:  { xMul: 7.5e-5, yMul: -7.5e-5, xAdd: 1.093450, yAdd: 0.642728 },
};
const ANCHORS = {
  Ascent: { A: [0.62, 0.30], B: [0.36, 0.62], mid: [0.50, 0.48] },
  Bind:   { A: [0.66, 0.34], B: [0.30, 0.42], mid: [0.50, 0.50] },
  Haven:  { A: [0.68, 0.30], B: [0.50, 0.52], C: [0.30, 0.40], mid: [0.50, 0.45] },
};
const SITES = { Ascent: ["A", "B"], Bind: ["A", "B"], Haven: ["A", "B", "C"] };

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const jit = (n, amt = 0.12) => clamp(n + (rnd() - 0.5) * amt, 0.08, 0.92);
function worldFromNorm(nx, ny, c) {
  return { x: Math.round((ny - c.yAdd) / c.yMul), y: Math.round((nx - c.xAdd) / c.xMul) };
}
function locAt(map, key, amt = 0.12) {
  const [nx, ny] = ANCHORS[map][key] ?? ANCHORS[map].mid;
  return worldFromNorm(jit(nx, amt), jit(ny, amt), CALIB[map]);
}

// ---------- rosters ----------
const BLUE = {
  name: "Mock Esports", tag: "MOCK",
  players: [
    { puuid: "mock-captain-0001", gameName: "Captain", tagLine: "NA1", agent: A.Jett },
    { puuid: "mock-p2", gameName: "Anchor", tagLine: "NA1", agent: A.Killjoy },
    { puuid: "mock-p3", gameName: "Flex", tagLine: "NA1", agent: A.Sova },
    { puuid: "mock-p4", gameName: "Support", tagLine: "NA1", agent: A.Omen },
    { puuid: "mock-p5", gameName: "Entry", tagLine: "NA1", agent: A.Raze },
  ],
};
const mkRival = (name, tag, slug, agents, names) => ({
  name, tag,
  players: agents.map((agent, i) => ({ puuid: `${slug}-${i + 1}`, gameName: names[i], tagLine: tag, agent })),
});
const RIVAL1 = mkRival("Rival Squad", "RVL", "rvl", [A.Reyna, A.Viper, A.Fade, A.Cypher, A.Neon],
  ["Hydra", "Smoke", "Recon", "Watch", "Dash"]);
const RIVAL2 = mkRival("Team Two", "TWO", "two", [A.Phoenix, A.Astra, A.Breach, A.Sage, A.Chamber],
  ["Blaze", "Cosmo", "Quake", "Wall", "Trap"]);
const RIVAL3 = mkRival("Squad Three", "THR", "thr", [A.Yoru, A.Brimstone, A.Skye, A.Killjoy, A.Jett],
  ["Clone", "Sky", "Guide", "Turret", "Air"]);
const RIVAL4 = mkRival("Four Gaming", "FOR", "for", [A.Raze, A.Omen, A.KAYO, A.Sova, A.Chamber],
  ["Boom", "Dark", "Knife", "Arrow", "Anchor"]);

const PLAN = [
  { id: "m-0001", map: "Ascent", blueWon: 13, redWon: 8, opp: RIVAL1, clutch: true },
  { id: "m-0002", map: "Bind", blueWon: 9, redWon: 13, opp: RIVAL2 },
  { id: "m-0003", map: "Ascent", blueWon: 13, redWon: 10, opp: RIVAL1 },
  { id: "m-0004", map: "Bind", blueWon: 13, redWon: 6, opp: RIVAL3 },
  { id: "m-0005", map: "Haven", blueWon: 11, redWon: 13, opp: RIVAL4 },
];

const BASE_START = 1717200000000; // fixed epoch; do not use Date.now (reproducibility)
const other = (s) => (s === "Blue" ? "Red" : "Blue");

// economy buy profiles -> weapon uuid + loadout + armor
function buyFor(roundNum) {
  if (roundNum === 0 || roundNum === 12) return { kind: "pistol", w: pick([W.Classic, W.Ghost, W.Sheriff]), val: ri(400, 1000), armor: chance(0.5) ? ARMOR_LIGHT : "" };
  const r = rnd();
  if (r < 0.6) return { kind: "full", w: pick([W.Vandal, W.Phantom, W.Operator, W.Odin]), val: ri(3400, 4700), armor: ARMOR_HEAVY };
  if (r < 0.8) return { kind: "force", w: pick([W.Spectre, W.Marshal, W.Guardian]), val: ri(1500, 2900), armor: chance(0.6) ? ARMOR_LIGHT : ARMOR_HEAVY };
  return { kind: "eco", w: pick([W.Classic, W.Ghost]), val: ri(0, 1500), armor: chance(0.4) ? ARMOR_LIGHT : "" };
}

function buildMatch(plan, index) {
  const { id, map, blueWon, redWon, opp } = plan;
  const total = blueWon + redWon;
  const blue = BLUE.players;
  const red = opp.players;
  const sideOfTeam = { Blue: blue, Red: red };
  const puuidSide = {};
  blue.forEach((p) => (puuidSide[p.puuid] = "Blue"));
  red.forEach((p) => (puuidSide[p.puuid] = "Red"));

  // winners array satisfying the final score
  const winners = shuffle([...Array(blueWon).fill("Blue"), ...Array(redWon).fill("Red")]);
  const clutchHost = plan.clutch ? winners.findIndex((w, i) => w === "Blue" && i >= 4) : -1;

  // aggregate stats
  const agg = {};
  for (const p of [...blue, ...red]) agg[p.puuid] = { kills: 0, deaths: 0, assists: 0, score: 0 };

  const roundResults = [];
  for (let rn = 0; rn < total; rn++) {
    const winner = winners[rn];
    // Blue attacks first half by convention (parse-match mirrors this)
    const blueAttacks = rn < 12 ? true : rn < 24 ? false : (rn - 24) % 2 === 0;
    const attackingSide = blueAttacks ? "Blue" : "Red";
    const defendingSide = other(attackingSide);

    // economy for all 10
    const econ = {};
    for (const p of [...blue, ...red]) {
      const b = buyFor(rn);
      econ[p.puuid] = { loadoutValue: b.val, weapon: b.w, armor: b.armor, spent: b.val, remaining: ri(0, 5200) };
    }

    const alive = { Blue: blue.map((p) => p.puuid), Red: red.map((p) => p.puuid) };
    const killsBy = {}, dmgBy = {};
    for (const p of [...blue, ...red]) { killsBy[p.puuid] = []; dmgBy[p.puuid] = []; }

    let t = ri(6000, 15000);
    const recordKill = (killer, victim) => {
      t += ri(1500, 7000);
      const vSide = puuidSide[victim];
      // positions
      const vKey = pick(SITES[map].concat(["mid", "mid"]));
      const vLoc = locAt(map, vKey);
      const kLoc = locAt(map, "mid", 0.2);
      const playerLocations = [
        { puuid: killer, viewRadians: +(rnd() * 6.283).toFixed(3), location: kLoc },
        { puuid: victim, viewRadians: +(rnd() * 6.283).toFixed(3), location: vLoc },
      ];
      // a couple of bystanders
      const bystanders = [...alive.Blue, ...alive.Red].filter((x) => x !== killer && x !== victim);
      shuffle(bystanders).slice(0, ri(0, 2)).forEach((b) =>
        playerLocations.push({ puuid: b, viewRadians: +(rnd() * 6.283).toFixed(3), location: locAt(map, "mid", 0.3) }));

      const assistants = chance(0.3)
        ? [pick(alive[other(vSide)].filter((x) => x !== killer))].filter(Boolean)
        : [];
      const weapon = econ[killer].weapon;
      killsBy[killer].push({
        gameTime: 80000 + t, roundTime: t, killer, victim, assistants,
        victimLocation: vLoc, playerLocations,
        finishingDamage: { damageType: "Weapon", damageItem: weapon, isSecondaryFireMode: false },
      });
      const hs = chance(0.3) ? 1 : 0;
      dmgBy[killer].push({ receiver: victim, damage: ri(130, 160), legshots: ri(0, 1), bodyshots: ri(1, 3), headshots: hs });
      // remove victim from alive
      alive[vSide] = alive[vSide].filter((x) => x !== victim);
      agg[killer].kills++; agg[victim].deaths++;
      assistants.forEach((a) => agg[a].assists++);
    };

    if (rn === clutchHost) {
      // 1vX clutch: Red kills the 4 non-captain Blue, then Captain kills 3 Red. Blue wins.
      const cap = "mock-captain-0001";
      const blueOthers = shuffle(blue.map((p) => p.puuid).filter((x) => x !== cap));
      for (const v of blueOthers) recordKill(pick(alive.Red), v);
      const redTargets = shuffle(red.map((p) => p.puuid)).slice(0, 3);
      for (const v of redTargets) recordKill(cap, v);
    } else {
      let k = ri(5, 9);
      while (k-- > 0 && alive.Blue.length > 0 && alive.Red.length > 0) {
        let vSide = chance(0.68) ? other(winner) : winner; // round loser dies more
        if (alive[vSide].length === 0) vSide = other(vSide);
        const kSide = other(vSide);
        if (alive[kSide].length === 0) break;
        recordKill(pick(alive[kSide]), pick(alive[vSide]));
      }
    }

    // plant / defuse
    let plantSite = "", bombPlanter = null, plantRoundTime = 0, plantLocation = { x: 0, y: 0 }, plantPlayerLocations = null;
    let bombDefuser = null, defuseRoundTime = 0, defuseLocation = { x: 0, y: 0 }, defusePlayerLocations = null;
    const didPlant = chance(0.72) && alive[attackingSide].length > 0;
    if (didPlant) {
      plantSite = pick(SITES[map]);
      bombPlanter = pick(sideOfTeam[attackingSide].map((p) => p.puuid));
      plantRoundTime = ri(25000, 55000);
      plantLocation = locAt(map, plantSite, 0.05);
      plantPlayerLocations = shuffle([...alive.Blue, ...alive.Red]).slice(0, ri(2, 4))
        .map((p) => ({ puuid: p, viewRadians: +(rnd() * 6.283).toFixed(3), location: locAt(map, plantSite, 0.18) }));
      if (winner === defendingSide && chance(0.9) && alive[defendingSide].length > 0) {
        bombDefuser = pick(sideOfTeam[defendingSide].map((p) => p.puuid));
        defuseRoundTime = plantRoundTime + ri(3000, 25000);
        defuseLocation = locAt(map, plantSite, 0.05);
        defusePlayerLocations = plantPlayerLocations;
      }
    }
    const roundResult = bombDefuser ? "Bomb defused"
      : didPlant && winner === attackingSide ? "Bomb detonated"
      : "Eliminated";

    // playerStats for all 10
    const playerStats = [...blue, ...red].map((p) => {
      const myKills = killsBy[p.puuid];
      agg[p.puuid].score += myKills.length * 200 + (myKills.length ? 50 : 0);
      return {
        puuid: p.puuid, score: agg[p.puuid].score,
        kills: myKills, damage: dmgBy[p.puuid], economy: econ[p.puuid],
      };
    });

    roundResults.push({
      roundNum: rn, roundResult, winningTeam: winner, plantSite,
      bombPlanter, bombDefuser, plantRoundTime, defuseRoundTime,
      plantLocation, defuseLocation, plantPlayerLocations, defusePlayerLocations,
      playerStats,
    });
  }

  const gameLengthMillis = total * ri(95000, 130000);
  const gameStartMillis = BASE_START - index * 2 * 86400000;

  const mkPlayer = (p, teamId) => ({
    puuid: p.puuid, gameName: p.gameName, tagLine: p.tagLine, teamId,
    partyId: teamId === "Blue" ? "party-blue" : "party-red",
    characterId: p.agent, competitiveTier: ri(18, 24),
    stats: {
      score: agg[p.puuid].score, roundsPlayed: total,
      kills: agg[p.puuid].kills, deaths: agg[p.puuid].deaths, assists: agg[p.puuid].assists,
      playtimeMillis: gameLengthMillis,
      abilityCasts: { grenadeCasts: ri(2, 8), ability1Casts: ri(2, 10), ability2Casts: ri(2, 10), ultimateCasts: ri(0, 3) },
    },
  });

  const dto = {
    matchInfo: {
      matchId: id, mapId: MAP_PATH[map], gameVersion: "08.11.00",
      gameLengthMillis, gameStartMillis, queueId: "premier",
      gameMode: "/Game/GameModes/Bomb/BombGameMode.BombGameMode_C",
      isRanked: false, isCompleted: true, seasonId: "",
    },
    players: [...blue.map((p) => mkPlayer(p, "Blue")), ...red.map((p) => mkPlayer(p, "Red"))],
    teams: [
      { teamId: "Blue", won: blueWon > redWon, roundsPlayed: total, roundsWon: blueWon, numPoints: blueWon },
      { teamId: "Red", won: redWon > blueWon, roundsPlayed: total, roundsWon: redWon, numPoints: redWon },
    ],
    roundResults,
  };
  return { dto, gameStartMillis };
}

// ---------- emit ----------
const matchlist = [];
const manifestMatches = [];
PLAN.forEach((plan, i) => {
  const { dto, gameStartMillis } = buildMatch(plan, i);
  writeFileSync(join(MATCH_DIR, `${plan.id}.json`), JSON.stringify(dto, null, 2));
  matchlist.push({ matchId: plan.id, gameStartTimeMillis: gameStartMillis, queueId: "premier" });
  manifestMatches.push({
    matchId: plan.id, map: plan.map,
    result: plan.blueWon > plan.redWon ? "win" : "loss",
    score: `${plan.blueWon}-${plan.redWon}`,
    opponent: { name: plan.opp.name, tag: plan.opp.tag },
  });
});
matchlist.sort((a, b) => b.gameStartTimeMillis - a.gameStartTimeMillis);

writeFileSync(join(HERE, `matchlist.${BLUE.players[0].puuid}.json`), JSON.stringify(matchlist, null, 2));
writeFileSync(join(HERE, "manifest.json"), JSON.stringify({
  captainPuuid: BLUE.players[0].puuid,
  team: { name: BLUE.name, tag: BLUE.tag, roster: BLUE.players.map((p) => ({ puuid: p.puuid, gameName: p.gameName, tagLine: p.tagLine, agent: p.agent })) },
  matches: manifestMatches,
}, null, 2));

console.log(`Wrote ${PLAN.length} matches + matchlist + manifest to ${HERE}`);
