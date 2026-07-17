---
name: Echo Realm GameData stores
description: Three new global stores (achievement, codex, challenge tiers) that persist across save-slot deletions.
---

## Global stores added (July 2026)

### achievementStore.ts (`er-achievements` localStorage key)
- `ACHIEVEMENTS`: 17 achievement definitions with id, name, desc, icon
- `getEarnedAchievementIds()`, `awardAchievement(id)`, `hasAchievement(id)`
- In engine.ts: `awardAchievement('ach_craft_item')` called after successful crafting

### codexStore.ts (`er-codex` localStorage key)
- Global bestiary: high-water mark per enemy, never decreases
- `getGlobalCodex()`, `syncCodexEntry(id, count)`, `syncBestiary(bestiary)`, `mergeCodexIntoPlayer(playerBestiary)`
- Renderer reads `getGlobalCodex()` at render time and merges with player bestiary for display
- TODO: call `syncBestiary` after each battle via battle.ts or save.ts

### challengeStore.ts (`er-challenge-tier` localStorage key)
- 6 tiers: Bronze/Silver/Gold/Platinum/Diamond/Void each with a 3-item pool of actual gear
- `getUnlockedTierIndex()`, `unlockChallengeTier(n)`, `getUnlockedTier()`, `getAccessibleTiers()`
- Legacy shim exports kept: `getEarnedEmblemIds()`, `addEarnedEmblemId()`, `pickNextEmblem()` → dialogue.ts uses these
- TODO: unlock higher tiers when player achieves boss kills / true ending

**Why:** Player data that should outlive any single character needs global persistence, independent of the per-slot ersav.ts system.

**How to apply:** Any data that should survive "New Game" or slot deletion → create/extend a global store file, use localStorage directly with a unique key prefix `er-`.
