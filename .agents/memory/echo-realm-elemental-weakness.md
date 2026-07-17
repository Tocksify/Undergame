---
name: Echo Realm elemental weakness system
description: Void/Chromatic/Echo/Ember per-enemy damage multipliers on FORGET attacks, revealed via Bestiary.
---

## Rule
Every enemy now has `elementalWeakness?: Record<'void'|'chromatic'|'echo'|'ember', number>` in EnemyData.
0 = immune, 0.5 = resistant, 1 = normal, 2 = weak (same scale as status `resistances`).

## Player element determination (getElementalBonus in battle.ts)
1. Count skills per path: `void_*`, `chroma_*`, `echo_*`, `ember_*`.
2. If maxCount === 0 → no element, mult = 1.
3. If multiple paths tied for most → no bonus, mult = 1.
4. Bestiary entry must be ≥ 3 to reveal weakness; below 3 → mult = 1 (hidden).
5. Returns `enemy.elementalWeakness[element] ?? 1`.

**Why:** Elemental info is hidden until the player has encountered the enemy enough times (matches Bestiary reveal threshold), keeping discovery meaningful.

## How to apply
The bonus is applied to FORGET damage in battle.ts after all other skill/weapon bonuses. Message appended to `actionMsg`: `[Elemental ×2!]`, `[Elemental ×N!]`, `[Resisted]`, or `[Immune!]`.

## Bestiary display
Elemental weakness badges rendered on the second line of revealed entries in `renderBestiary`. Format: `Void:WEAK`, `Chroma:RES`, `Echo:—`, `Ember:IMM` with color coding.

## Call site
`drawEnemySprite` now accepts a 6th optional `b?: BattleState | null` param; the call site passes `state.battle`.
