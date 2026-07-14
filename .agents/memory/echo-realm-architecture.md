---
name: Echo Realm engine architecture
description: Durable patterns used in the Echo Realm terminal-RPG artifact (canvas-based JS game) for gating, enemies, shops, and quests — read before extending its content.
---

Echo Realm (artifacts/echo-realm) is a canvas-rendered RPG with a shared `MAPS` object (one entry per area) holding tiles, NPCs, exits, and an `encounterPool`. Several non-obvious conventions keep content additions cheap:

- **One-time NPCs use a generic `hideFlag` on the NPC def**, checked as `!npc.hideFlag || !player.flags[npc.hideFlag]` everywhere NPCs are read (movement blocking, interaction, rendering). Never mutate `MAPS[...].npcs` directly to remove a defeated NPC — the map object is shared/reused across game sessions, so mutating it corrupts subsequent playthroughs. `battle.ts` auto-sets a `defeated_<enemyId>` flag on every battle win, which doubles as both the hideFlag trigger and a lightweight "prove yourself" gate for area gate-keeper NPCs.
- **Acts (battle abilities) are generic over an `effect` field** (`resonance`/`weaken`/`confuse`/`damage`/`flavor`) rather than hardcoded per-enemy-id logic, so new enemies/bosses need zero bespoke battle scripting unless they require a quest item (handled via `requiresItem` + a small special-case list in `handleAct`).
- **Shops and quests are data-driven registries** (`SHOPS` in constants.ts, `QUESTS` in quests.ts) rather than hardcoded UI lists — new shops/quests are additive, and the renderer/engine just loop over the registry.
- **Enemy sprites have a generic fallback branch** in `drawEnemySprite` so new enemies render immediately without bespoke pixel art; bespoke sprites are opt-in polish, not required for correctness.
