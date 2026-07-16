---
name: Echo Realm combat-depth features
description: New status effects, dual wielding/shields, and enemy resistances — architecture decisions for future work.
---

## Status Effects (enemy-side)
Four new procs applied via weapon enchant on PERFECT/GOOD hits:
- **Poison** (`poisonDmg`, `poisonTurns` on `BattleState`): X dmg/turn for 3 turns. Ticks in ACTION phase before the confused/frozen skip checks.
- **Burn** (`burnDmg`): starts at 2 (or 4 if weak), doubles each round; clears when it exceeds 32. Also ticks in ACTION phase.
- **Freeze** (`flags.frozen`): skip the DODGE phase entirely — no projectiles, no damage, no enemy turn.
- **Silence** (`flags.silenced`): blocks magic-flagged acts in ACT_MENU. Selecting a silenced act clears the flag (1 turn).

### Proc application
All procs flow through `applyWeaponProcs()` in `battle.ts`. Main hand AND offhand (dual-wield only) both fire procs on PERFECT/GOOD hits.

Resistance check: `getResistance(b, effectType)` returns `b.enemy.resistances?.[type] ?? 1`. If `0` → immune (proc blocked), `2` → weak (numeric values doubled for poison; burn starts at 4; for boolean procs nothing extra beyond applying).

## Dual Wielding / Shields (offhand slot)
`player.equipment.offhand: string | null` — new field in both `GameStateData` and `SavedGameState`.

### Equip UX (engine.ts)
- **Weapon** + empty main hand → main hand. Same weapon again → unequip main hand.
- **Weapon** + occupied main hand + empty offhand → **dual wield** (offhand). Same weapon in offhand → unequip offhand.
- **Shield** → always offhand. Replaces offhand weapon if occupied.
- `getWeaponAtkBonus` multiplies each hand by 0.75 when dual-wielding; offhand contribution added separately.
- `getShieldBlockBonus` reads `ITEMS[oh].block` (flat dmg reduction per projectile hit).

### Display
- Inventory row shows `[E]` for main hand / `[OH]` for offhand.
- Item hover panel shows `BLK X/hit` stat line for shields.
- Action label adapts to show "equip offhand (dual)" when applicable.

## Enemy Resistances
`resistances?: Record<string, number>` on `EnemyData`. Revealed in Bestiary after 3 encounters.

Key pairings:
- `frost_walker`: burn ×2, freeze immune (0)
- `rime_hound`: burn ×2, freeze ×0.5
- `ash_hound`: freeze ×2, burn immune (0)
- `cinder_wraith`: freeze ×2, burn immune (0)
- `archivist`: silence ×2 (blocks Plead resonance act)
- `void_sentinel`: silence immune (0)
- `boss`: all procs ×0.5
- `echo_warden`: silence ×2, freeze ×0.5
- `ring_boss`: freeze ×2, silence ×0.5
- `child_void_kid`: poison immune (0), burn immune (0)
- `street_wraith`: poison ×2

## Bestiary Screen
- Access: `[B]` in overworld or Pause Menu option 6.
- Mode: `GameMode.BESTIARY` (value 16). Scroll state: `state.bestiaryScroll`.
- Shows all enemies in `ENEMIES` order; names hidden until first encounter; resistances hidden until 3+ encounters.
- `endBattle` increments `state.player.bestiary[enemy.id]` on DEFEATED or REMEMBERED (not FLED).

## Magic Acts
`EnemyAct.magic?: boolean` — silenced enemy can't use these:
- wisp: Listen (confuse)
- ink_wraith: Blot (confuse)
- rime_hound: Call (confuse)
- void_sentinel: Override (confuse) — but sentinel is silence-immune anyway
- street_wraith: Linger (confuse)
- ring_boss: Bind (confuse), Entreat (resonance)
- archivist: Plead (resonance) — silence forces a harder fight path
- echo_warden: Reckon (resonance)

## New Items
- Shields: `buckler` (2 blk, 60e), `iron_shield` (4 blk, 180e), `void_bulwark` (6 blk, drop), `memory_aegis` (8 blk, drop)
- Enchants: `ench_venom_brand` (poison), `ench_pyro_brand` (burn), `ench_frost_brand` (freeze), `ench_silence_mark` (silence), `ench_cursed_brand` (poison+burn+silence combo legendary)
- Buckler/iron_shield added to Zara's and Old Thom's shops respectively.

**Why:** These were planned in the session summary before this work. The resistance approach (proc-only, not base ATK) keeps base combat fair while making status builds matter.
