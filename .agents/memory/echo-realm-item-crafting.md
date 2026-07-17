---
name: Echo Realm item crafting system
description: ITEM_CRAFT mode — tab-based crafting table for physical items/gear using ingredients; separate from TOME_CRAFT enchantment system.
---

## Architecture (July 2026)

### Mode: `GameMode.ITEM_CRAFT` (18)
- Opened when player interacts with a CRAFT NPC (crafting table) — NOT the enchantment book
- `state.itemCraft: { categoryIdx: number; cursorIndex: number }`
- Keys: LEFT/RIGHT switch categories, UP/DOWN scroll recipes, SPACE craft, X close

### Enchantment crafting (TOME_CRAFT) vs Item crafting (ITEM_CRAFT)
- TOME_CRAFT: opened by using Tomes Blessing from inventory. Consumes Tomes Blessing + Empty Book.
- ITEM_CRAFT: opened by interacting with the crafting table NPC (CRAFT type). Uses ingredients.

### RECIPES array (exported from constants.ts)
- Type: `CraftRecipe` (defined in types.ts): `id, name, outputId, outputCount, ingredients[], category`
- 5 categories: `material | weapon | armor | trinket | consumable`
- 14 recipes as of initial implementation; add more by appending to the `RECIPES` array in constants.ts

### Ingredient items (`category: 'ingredient'`)
- `iron_dust`, `silver_ingot`, `wood_plank`, `cloth_scrap`, `leather_hide`, `void_dust`, `herb_bundle`
- These are in ITEMS but have no use effect (using gives "Can't use that here")
- Sources: TF forest chests, shops, future enemy drops

### Crafted gear
- `iron_band` (ring, def 1) — crafted only
- `void_token` already existed as a trinket in ITEMS; recipe outputs it

**Why:** User wanted a separate item crafting system from enchantments, with category tabs and real ingredient requirements.
