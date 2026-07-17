# Echo Realm — Challenge Board Items

> **Global store key:** `er-challenge-items-v1`  
> Challenge items are tracked in a global `localStorage` entry that persists across all save slots and even after a Legacy is erased. Once an item has been earned at least once, it is permanently recorded here.

---

## Overview

The Challenge Board (accessible in-game via the Challenge Keeper NPC) presents six escalating tiers: **Bronze → Silver → Gold → Platinum → Diamond → Color**. Completing all waves of a tier earns the player a **random item** drawn from that tier's loot pool. The same random draw fires on every **Rerun**, so a single run of the board may award multiple items if Rerun is selected multiple times.

All six tiers are permanently unlocked — the `getUnlockedTierIndex()` function always returns `5`.

Items obtained through the challenge are also added to the player's real inventory (via the snapshot restoration path on "Return"), and non-duplicate items are logged to the global challenge store so the codex can track discovery.

---

## Tiers and Item Pools

### 🥉 Bronze
**Waves:** 3  
| Item ID | Display Name | Slot | Stats | Notes |
|---|---|---|---|---|
| `ch_wisp_lantern` | Wisp Lantern | Trinket | +1 ATK, +5 HP | Challenge-exclusive |
| `ch_hollow_draught` | Hollow Draught | Consumable | Heal 15 HP, clear confusion | Challenge-exclusive |
| `carved_stake` | Carved Stake | Weapon | +2 ATK | Standard item also available in overworld |

**Chance weights:** Wisp Lantern 50 / Hollow Draught 30 / Carved Stake 20

---

### 🥈 Silver
**Waves:** 5  
| Item ID | Display Name | Slot | Stats | Notes |
|---|---|---|---|---|
| `ch_resonance_fork` | Resonance Fork | Weapon | +5 ATK | Challenge-exclusive |
| `ch_echo_tonic` | Echo Tonic | Consumable | Heal 22 HP | Challenge-exclusive |
| `void_needle` | Void Needle | Weapon | +3 ATK | Standard item also available in overworld |

**Chance weights:** Resonance Fork 40 / Echo Tonic 35 / Void Needle 25

---

### 🥇 Gold
**Waves:** 6  
| Item ID | Display Name | Slot | Stats | Notes |
|---|---|---|---|---|
| `ch_keeper_sigil` | Keeper's Sigil | Trinket | +2 ATK, +2 DEF, +5 HP | Challenge-exclusive |
| `ch_archive_blade` | Archive Blade | Weapon | +9 ATK | Challenge-exclusive |
| `ench_hollow_edge` | Hollow Edge Tome | Enchant Book | Weaken enemy ATK | Standard enchant |

**Chance weights:** Keeper's Sigil 45 / Archive Blade 35 / Hollow Edge Tome 20

---

### 💎 Platinum
**Waves:** 7  
| Item ID | Display Name | Slot | Stats | Notes |
|---|---|---|---|---|
| `ch_void_shard_edge` | Void Shard Edge | Weapon | +12 ATK | Challenge-exclusive |
| `ch_echo_bulwark` | Echo Bulwark | Offhand (Shield) | Blocks 10 flat damage | Challenge-exclusive |
| `phoenix_ash` | Phoenix Ash | Consumable | Full heal, clear all effects | Standard item |

**Chance weights:** Void Shard Edge 40 / Echo Bulwark 35 / Phoenix Ash 25

---

### ✦ Diamond
**Waves:** 8  
| Item ID | Display Name | Slot | Stats | Notes |
|---|---|---|---|---|
| `ch_nexus_crown` | Nexus Crown | Helmet | +5 DEF, +15 HP | Challenge-exclusive |
| `ch_oblivion_fang` | Oblivion Fang | Weapon | +16 ATK | Challenge-exclusive |
| `ench_cursed_brand` | Cursed Brand | Enchant Book | Poison + burn + silence on hit | Standard enchant |

**Chance weights:** Nexus Crown 40 / Oblivion Fang 35 / Cursed Brand 25

---

### 🌈 Color
**Waves:** 10 — all major bosses  
| Item ID | Display Name | Slot | Stats | Notes |
|---|---|---|---|---|
| `ch_creed_emblem` | Creed Emblem | Trinket | +4 ATK, +3 DEF, +10 HP, scales with Chromatic skills | Chromatic tier — challenge-exclusive; rarest item in game |
| `ch_ench_chromatic_tide` | Chromatic Tide | Enchant Book | +8 ATK, confuse + freeze + weaken on hit | Chromatic tier — challenge-exclusive |
| `ch_ench_mortus_verdict` | Mortus' Verdict | Enchant Book | +15 ATK, drain 8 HP + silence on hit | Mortus tier — challenge-exclusive |

**Chance weights:** Creed Emblem 45 / Chromatic Tide 35 / Mortus' Verdict 20

---

## Color Tier Wave Sequence

The Color trial runs every major boss encounter in sequence:

| Wave | Enemy | Notes |
|---|---|---|
| 1 | Trial Shade (challenge_w3) | Opening challenge wave |
| 2 | Trial Horror (challenge_w4) | Intensified challenge wave |
| 3 | Trial Void (challenge_final) | Apex challenge wave |
| 4 | The Archivist | Boss from Sunken Archive |
| 5 | Void Sentinel | Boss from Void Nexus |
| 6 | The Echo Warden | Boss from Whisper Woods |
| 7 | The Ringkeeper | Boss from Ashfall Ring |
| 8 | Memory Wraith | Main story final boss |
| 9 | The Kid | Boss from Color |
| 10 | The Echo Warden | Encore — hardest finale |

---

## Global Store API

```typescript
import { addEarnedChallengeItem, getEarnedChallengeItemIds } from '../challengeStore';

// Record an item as earned (idempotent — safe to call multiple times)
addEarnedChallengeItem('ch_creed_emblem');

// Retrieve all earned item IDs (for codex, achievement checks, etc.)
const earned = getEarnedChallengeItemIds();
```

The store key is `er-challenge-items-v1`. It stores a JSON array of item ID strings. Duplicate entries are deduplicated on read.

---

## Achievement Connections

| Achievement ID | Trigger |
|---|---|
| `ach_tier_bronze` | Complete the Bronze tier challenge |
| `ach_tier_silver` | Complete the Silver tier challenge |
| `ach_tier_gold` | Complete the Gold tier challenge |
| `ach_tier_platinum` | Complete the Platinum tier challenge |
| `ach_tier_diamond` | Complete the Diamond tier challenge |
| `ach_tier_color` | Complete the Color tier challenge |
| `ach_creed_emblem` | Obtain the Creed Emblem (via completion or rerun) |
| `ach_challenge_slot` | Equip any `ch_*` item in a gear slot |
