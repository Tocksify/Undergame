---
name: Echo Realm Skill Tree
description: Full skill tree system added — 4 paths, 16 skills, 6 hybrids, integration details.
---

## Architecture

- **`skillTree.ts`** — all definitions + pure helpers (no side effects). Imported by engine, renderer, save.
- **GameMode.SKILL_TREE = 17** — opened via `K` key, closed via `K/ESC/X`.
- **State fields**: `player.learnedSkills: string[]`, `player.skillPoints: number`, `state.skillTreeCursor: { pathIdx, skillIdx }`, `state.skillLearnedFlash: string | null`.
- **Economy**: 1 skill point every 2 levels (in `grantXp`), separate from the 2 stat points per level.

## Paths (4 skills T1→T2→T3→Capstone each)

| Path | IDs | Color | Theme |
|------|-----|-------|-------|
| Void | void_strike → void_drain → void_rift → void_herald | #a855f7 | Annihilation, lifesteal, silencing |
| Chromatic | chroma_touch → chroma_strike → chroma_veil → chroma_morthus | #f472b6 | Resonance, random procs, Morthus |
| Echo | echo_surge → echo_nova → echo_armor → echo_legacy | #22d3ee | XP, resonance bonus dmg, memory block |
| Ember | ember_forge → ember_shell → ember_will → ember_phoenix | #f97316 | Burn/poison scaling, HP tank, revive |

## Hybrid Bonds (auto-active at ≥2 skills in each of 2 paths)

- hybrid_void_chroma: Prismatic Void — Spectrum Strike also Weakens
- hybrid_void_echo: Null Memory — PERFECT FORGET always silences
- hybrid_void_ember: Ashen Void — defeat while burning/poisoned heals 5 HP
- hybrid_chroma_echo: Resonant Prism — cursor 50% slower, PERFECT REMEMBER heals 3 HP
- hybrid_chroma_ember: Sunfire Spectrum — Spectrum Strike can trigger Burn, Burn = +1 resonance
- hybrid_echo_ember: Forge of Echoes — ember_shell gives +40 HP, echo_nova bonus doubled

## Integration Points

- **`constants.ts` `grantXp`**: multiplies XP by 1.2 (echo_surge) × 1.3 (echo_legacy), grants 1 skill point every even level.
- **`constants.ts` `recomputeMaxHp`**: +20 HP for ember_shell, +40 if Forge of Echoes hybrid active.
- **`constants.ts` `getArmorDefBonus`**: +2 for ember_forge, +4 for ember_will when HP ≤25%.
- **`engine.ts` `startBattle`**: chroma_morthus starts with resonance=1, echo_legacy starts with voidWard=true.
- **`battle.ts` flee**: echo_surge always succeeds.
- **`battle.ts` MINIGAME**: cursor speed slowed by chroma_touch (75%) + Resonant Prism hybrid (50%); GOOD REMEMBER builds resonance with chroma_touch; tryCompleteRemember threshold=2 with chroma_veil.
- **`battle.ts` FORGET procs**: void_strike+3/silence, void_rift×1.5/+8<30%, echo_nova+res×3, chroma_strike random status.
- **`battle.ts` DODGE**: chroma_veil 15% auto-dodge, echo_armor 25% full block, void_herald 100% ward, echo_nova -1dmg, ember_phoenix revive once.
- **`battle.ts` burn tick**: ember_forge raises cap from 32→64.
- **`battle.ts` poison tick**: ember_shell doubles tick damage.
- **`battle.ts` endBattle**: echoes mults (void_herald ×1.2, echo_legacy 1.75 vs 1.5 for Remembered), void_drain +6 HP on defeat, chroma_morthus +15 HP on Remember, Ashen Void +5 HP.
- **`renderer.ts`**: HUD shows SKILLS [K] badge pulsing when skill points > 0; full renderSkillTree canvas UI.

**Why**: player requested 4 thematic paths tied to game worlds + hybrid cross-path synergies.
