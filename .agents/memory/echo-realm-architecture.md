---
name: Echo Realm architecture
description: Key patterns, decisions, and gotchas for the Echo Realm RPG codebase.
---

## Engine patterns
- `enchantedSlots: (string|null)[]` is a parallel array to `inventory[]`. Use `removeInventoryItem(state, i)` and `addInventoryItem(state, id)` helpers (in engine.ts) whenever mutating inventory — they splice both arrays in sync.
- `map.doors[]` array for enterable buildings. Player detects adjacency (Manhattan distance === 1) same as NPCs/chests. Interior maps exit via `<` tile.
- `map.books[]` field exists on all maps (can be empty) — books are chest items, not a separate pickup type.
- `pendingEncounter` is set on grass step, then consumed after movement resolves (to avoid starting battle mid-move).
- `hideFlag` on NPCs: NPC hidden when `state.player.flags[npc.hideFlag]` is truthy.

## Item categories
- `category`: `weapon | armor | key | consumable | book | enchanted_book`
- `subcategory`: `medical | def | utility` (consumables only)
- Enchanted items show `[Z]` suffix in inventory; `enchantedSlots[i]` holds the enchanted_book id.
- `getWeaponAtkBonus(state)` and `getArmorDefBonus(state)` in constants.ts account for enchantments — always use these, never read enchantData directly in battle/engine.

## Game modes
- `BOOK_READ = 10`: arrow keys page through book, ESC/X closes, last page auto-close on SPACE
- `ENCHANT_SELECT = 11`: cursor through compatible unenchanted items; SPACE applies enchant and removes book from inventory

## City quest (quest_city)
- Triggered via `city_gate_guard` NPC in VH → dialogue → `city_warden` NPC in CT starts formal quest
- Progress tracked in `state.player.questProgress['city_clears']`; counted in `endBattle` for city_shade / street_wraith / hollow_guard
- Reward from `city_warden` after quest_city === 2, guarded by `city_reward` flag

## Books system
- 5 books in `BOOKS` registry (constants.ts): keepers_codex, childs_letter, forgotten_verse, cipher_note, merchants_ledger
- Books are inventory items (category: 'book'); reading from INVENTORY opens BOOK_READ mode
- Enchanted books (category: 'enchanted_book') open ENCHANT_SELECT from INVENTORY

## Pre-existing TS errors (not game files)
- `src/App.tsx` has 3 pre-existing errors (api-client-react build, implicit any) — these are not regressions
