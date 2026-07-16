---
name: Echo Realm Equipment System
description: 14-slot paperdoll architecture — slot definitions, stat helpers, two-page inventory, engine logic, renderer.
---

## Slot definitions
`EQUIP_SLOTS` in `constants.ts` is the single source of truth (array of `{ id, label, categories }`):
helmet, necklace, shoulder, armor (chest), cloak, gloves, belt, pants, boots, weapon, offhand, ring1, ring2, trinket.
`armor` ID kept as-is for backward compat with existing saves.

## Stat helpers
`sumEquipStat(state, stat, skipWeapons)` in constants.ts sums a numeric field across all equipped non-weapon slots (including enchant bonuses).
`recomputeMaxHp` / `getArmorDefBonus` / `getWeaponAtkBonus` all delegate to `sumEquipStat` — adding a new slot automatically flows into all three.

## GameStateData additions (types.ts)
`inventoryPage: number` (0=paperdoll, 1=items), `equipPanelCursor: number`, `equipSlotMenu: { slotId, menuIndex, mode:'actions'|'pick' } | null`.

## Engine (engine.ts)
INVENTORY mode: Tab/Q switches pages. Page 0 handles cursor, slot actions (unequip/sell/back), item picker with ring1/ring2 duplicate guard. Page 1 keeps all existing behavior + new category handlers (helmet, gloves, pants, boots, cloak, necklace, ring, belt, shoulder, trinket). Ring category auto-routes to ring1 then ring2.

## Renderer (renderer.ts)
`renderInventory` dispatches to `renderEquipmentPanel` (page 0) or `renderItemsList` (page 1).
`renderEquipmentPanel`: left panel = 14 slot rows (30px each); right panel = pixel-art silhouette (cx=564, top=76) + connector dotted line from selected row to body-part centre. Body part centres in `SLOT_CENTERS`, highlight rects in `SLOT_RECTS`. When `equipSlotMenu` is set, right panel shows action menu or item picker instead of silhouette info.

## Save compat (save.ts)
All 11 new equipment fields use `?? null` fallback when loading old saves.

**Why:** Required to support 50+ items across all body-slot categories without breaking existing weapon/armor save data.
