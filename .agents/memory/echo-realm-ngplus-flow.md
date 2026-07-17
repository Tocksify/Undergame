---
name: Echo Realm NG+ flow
description: New Game+ option on the true-ending screen — difficulty picker, NG+ state, boss drops.
---

## Screen flow
1. TRUE_ENDING screen now has 3 options (↑↓ to cycle): Sandbox / End Legacy / **New Game+**.
2. Selecting New Game+ sets `state.ngPlusRequested = true` in engine.ts.
3. `Game.tsx` detects this flag and calls `onNewGamePlus()`.
4. `App.tsx` sets screen to `'ng_plus_setup'`, renders `DifficultyPicker.tsx`.
5. DifficultyPicker collects: difficulty (normal/challenger/void) + slot name.
6. On confirm: App.tsx stores `pendingNgPlus`, goes to `'customization'` screen.
7. On customization confirm: `confirmCustomization` writes `state.ngPlus = { difficulty, generation: 2 }` into the new GameStateData; slot name = user's input.

## Difficulty multipliers (applied in startBattle every encounter)
- normal:     HP ×1.2, ATK ×1.15
- challenger: HP ×1.5, ATK ×1.3
- void:       HP ×2.0, ATK ×1.5

**Why:** Applied per-encounter in `startBattle()` after deep-copying enemy — keeps INITIAL_STATE clean, no need to re-scale enemy constants.

## NG+ exclusive items
`ngp_void_crown` (legendary helmet), `ngp_echo_fragment` (mythic trinket), `ngp_keepers_seal` (legendary necklace). These are defined in ITEMS but not placed anywhere in the world by default — intended to be dropped from the Memory Wraith boss in NG+ mode (not yet wired to drop tables as of initial implementation).

## No retained skills
NG+ starts from a clean INITIAL_STATE (buildInitialState(null, false)) with only ngPlus metadata and the player's chosen appearance. Skills reset, inventory empty.
