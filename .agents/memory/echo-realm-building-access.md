---
name: Echo Realm building access
description: How CT city building NPC/chest placement works and why doorY-1 is always wrong.
---

In Crestfall City (CT), buildings are drawn as solid 'H' tiles (impassable). The door tile at `(doorX, doorY)` is the bottom row of the building and is also 'H'. Players approach from `(doorX, doorY+1)` (street) to trigger the door at Manhattan distance 1.

**Why doorY-1 is wrong:** `doorY-1` is inside the building (H tile). Players can never be adjacent to anything at `doorY-1` because the only passable adjacent tile is `doorY+1` (dist 2 from doorY-1).

**The fix applied:** Moved all CT overworld NPCs (city_warden, relic_broker, city_survivor, all CITY_SIDE_QUESTS NPCs) into their respective interior maps (CT_H4, CT_H3, CT_H5, CT_SQ* already had them). The CT overworld npcs array is now empty. Trail note chests moved from `doorY-1` to `doorY+1` (accessible from `doorY+2`, player then walks to `doorY+1` to enter door).

**CITY_SIDE_QUESTS NPCs** were already correctly placed in CT_SQ* interior maps at (6,3) — the overworld placements were duplicates at wrong coords.

**How to add future NPCs in CT:** Place them in the building interior map, NOT in the CT overworld map. Interior maps are 14×9 with passable P tiles in a rect.
