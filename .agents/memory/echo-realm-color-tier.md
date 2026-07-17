---
name: Echo Realm Color tier & challenge items
description: Architecture of the Color (hardest) challenge tier, chromatic rarity, and earned-items tracking system
---

## Color Tier (was "Void")
- `challengeStore.ts` CHALLENGE_TIERS index 5: `name: 'color'`, `displayName: 'Color'`, color `#ff77ee`
- Pool: `ch_creed_emblem` (chromatic trinket), `ch_ench_chromatic_tide` (chromatic weapon enchant), `ch_ench_mortus_verdict` (mythic weapon enchant)
- Claim flag key: `ch_claimed_color` (was `ch_claimed_void` — any old saves with the void flag won't carry over)

## Chromatic Rarity
- New tier added to `TIER_COLOR`, `TIER_LABEL`, `TIER_RANK` in `constants.ts`: `chromatic: '#ff77ee'` / `'Chromatic'` / rank 6
- `drawTierText` in `renderer.ts` renders chromatic as a shifting rainbow gradient (faster than mythic)
- `categoryTag` returns `[CH]` and `categoryTagColor` returns `#ff77ee` for any item ID starting with `ch_`

## Creed Emblem Scaling
- `ch_creed_emblem`: trinket, chromatic tier, base stats atk:4 def:3 maxHp:10
- In `battle.ts` FORGET action: if `equipment.trinket === 'ch_creed_emblem'` and hitType !== MISS, adds `chromaCount * 2` bonus damage (chromaCount = count of learned chroma_ skills)
- Without any chroma skills: still useful via base stats only

## Earned Challenge Items Store
- `challengeStore.ts`: `getEarnedChallengeItemIds()` / `addEarnedChallengeItem(itemId)` — localStorage key `er-challenge-items-v1`
- `engine.ts` calls `addEarnedChallengeItem(chosen.itemId)` when player claims a challenge board reward
- Used by `CharacterCustomization.tsx` (STARTING CHALLENGE ITEM picker) and `Extras.tsx` codex (??? masking)

## Character Customization
- `CharacterCustomization.tsx` now shows earned `ch_` items (from the earned store) as "STARTING CHALLENGE ITEM" picker
- Selected item ID passes through `onConfirm(appearance, emblemId)` prop unchanged
- `App.tsx` `confirmCustomization`: if emblemId is set and exists in ITEMS, pushes it to starting inventory (no longer applies emblem buffs)

## Pause Menu
- "Extras" removed from pause menu (was index 7): `renderer.ts` opts array has 7 items (0–6), `engine.ts` Math.min capped at 6, case 7 removed

## Ingredient Recipes
- 11 new recipes added to RECIPES array covering all 8 new ingredients: dried_mushroom, void_essence, resonance_dust, rusted_chain, beast_claw, clear_quartz, ancient_bark, ghost_salt
- void_essence can be both crafted (from void_crystal + void_dust) and used as ingredient (essence_blade recipe)

**Why:** Keeps the ingredient items from being dead inventory weight and gives the Color tier a distinct identity separate from the Mortus-labeled items in Diamond tier.
