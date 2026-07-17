# Echo Realm — Achievements

> **Global store key:** `er-achievements`  
> Achievements are stored in a global `localStorage` entry that persists across all save slots and Legacy erasures. Earning an achievement on any character permanently unlocks it on the account.

---

## Overview

Achievements are tracked via `achievementStore.ts`. The store exposes two primary functions:

```typescript
import { awardAchievement, hasAchievement, getEarnedAchievementIds } from '../achievementStore';

// Award (idempotent — returns true only the first time the achievement fires)
if (awardAchievement('ach_first_blood')) {
  // Show notification
}

// Check without awarding
if (hasAchievement('ach_rich')) { ... }

// Get all earned IDs
const earned = getEarnedAchievementIds();
```

Achievements are also viewable in-game through **Extras → Achievements** (K key from the overworld opens the Skill Tree; the achievements screen is through the Menu → Extras path).

---

## Full Achievement List

### 🗡 Combat

| ID | Name | Description | Trigger |
|---|---|---|---|
| `ach_first_blood` | First Blood | Win your first battle. | After any battle victory (`DEFEATED` endType) |
| `ach_10_battles` | Tested in Battle | Win 10 battles. | Cumulative battle wins, tracked via bestiary codex |
| `ach_no_damage` | Untouched | Win a battle without taking any damage. | End of battle when `state.player.hp === startHp` |
| `ach_perfect` | Resonance | Land a PERFECT hit in the minigame. | Minigame result `hitType === 'PERFECT'` |

---

### ⚔ Exploration

| ID | Name | Description | Trigger |
|---|---|---|---|
| `ach_leave_hollow` | First Step | Leave Verdant Hollow for the first time. | Exit tile leading out of VH map |
| `ach_archive` | Into the Archive | Reach the Sunken Archive. | `discovered_SA` flag set |
| `ach_frost` | Frozen Path | Reach the Frost Road. | `discovered_FR` flag set |
| `ach_color` | Chromatic Reach | Discover the Color region. | `discovered_CO` flag set |
| `ach_secret_room` | Off the Map | Discover the South Road — a hidden path few Keepers ever find. | Player enters map `SR` (exit tile to `SR` triggers `discovered_SR` + this achievement) |

---

### 📦 Collection

| ID | Name | Description | Trigger |
|---|---|---|---|
| `ach_first_item` | Keeper's Load | Pick up your first item. | First item added to inventory |
| `ach_enchant` | Inscribed | Enchant an item for the first time. | Enchant applied successfully |
| `ach_rich` | Echo Hoarder | Accumulate 500 Echoes at once. | Overworld passive check when `echoes >= 500` |
| `ach_creed_emblem` | Chromatic Keeper | Obtain the Creed Emblem — the rarest challenge reward. | `ch_creed_emblem` added to snapshot inventory (completion or rerun) |
| `ach_challenge_slot` | Trial Bearer | Equip a Challenge Board item in a gear slot for the first time. | Overworld passive check: any `ch_*` item in equipment slots |

---

### 🏆 Challenge Board

| ID | Name | Description | Trigger |
|---|---|---|---|
| `ach_tier_bronze` | Bronze Trial | Complete the Bronze tier challenge. | All Bronze waves cleared (`ch_claimed_bronze` flag + result modal) |
| `ach_tier_silver` | Silver Trial | Complete the Silver tier challenge. | All Silver waves cleared |
| `ach_tier_gold` | Gold Trial | Complete the Gold tier challenge. | All Gold waves cleared |
| `ach_tier_platinum` | Platinum Trial | Complete the Platinum tier challenge. | All Platinum waves cleared |
| `ach_tier_diamond` | Diamond Trial | Complete the Diamond tier challenge. | All Diamond waves cleared |
| `ach_tier_color` | The Color Rite | Complete the Color trial — the ultimate challenge. | All 10 Color waves cleared |

---

### 🔮 Special Actions

| ID | Name | Description | Trigger |
|---|---|---|---|
| `ach_tomes_blessing` | Tome's Grace | Use the Tome's Blessing to craft a custom enchantment. | `tomes_blessing_used` flag set during TOME_CRAFT crafting |

---

### 🥚 Secrets & Easter Eggs

| ID | Name | Description | Trigger |
|---|---|---|---|
| `ach_crestfall_egg` | City Secret | Uncover the hidden easter egg buried in Crestfall City. | `crestfall_egg_done` flag set (via specific CT dialogue sequence) |
| `ach_ashfall_egg` | Ring of Secrets | Complete the hidden sequence in Ashfall Ring. | `morthus_ending_seen` or `ashfall_egg_done` flag set |

---

## Achievement Display Format

In the in-game Achievements screen, each entry renders as:

```
[icon]  Name
        Description
        ✓ EARNED  /  (locked)
```

Earned achievements show their icon in full color; locked achievements are dimmed.

---

## Store Structure

The `er-achievements` key stores a plain JSON array of achievement ID strings:

```json
["ach_first_blood", "ach_10_battles", "ach_perfect", "ach_leave_hollow"]
```

The `ACHIEVEMENTS` export in `achievementStore.ts` is the source-of-truth for display metadata (name, desc, icon). The store only records which IDs have been earned — the display data is always read from the code.

---

## Adding a New Achievement

1. Add an entry to the `ACHIEVEMENTS` array in `achievementStore.ts`:
   ```typescript
   { id: 'ach_my_new_one', name: 'My Achievement', desc: 'What the player did.', icon: '🎯' }
   ```
2. Add a call to `awardAchievement('ach_my_new_one')` at the appropriate trigger point in `engine.ts`, `battle.ts`, or `dialogue.ts`.
3. (Optional) Push a message to `state.messageStack` so the player sees a notification.

The store is append-only and idempotent — `awardAchievement` is safe to call every frame for passive checks.
