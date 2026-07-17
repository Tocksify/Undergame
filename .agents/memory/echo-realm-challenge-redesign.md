---
name: Echo Realm challenge system redesign
description: Full architecture of the new NPC-driven, tier-based challenge system replacing the old auto-chain gauntlet.
---

## Core design

Challenge is now:
1. Triggered from CHALLENGE_SELECT board (herald NPC in VH, type 'CHALLENGE')
2. On confirm: snapshot saved, player reset to level 1 blank slate, teleported to CHALLENGE_ARENA
3. NPC (challenge_keeper, type 'TALK') drives each wave via dialogue options
4. Between waves: player can use M (stats) and K (skill tree) to spend earned points
5. After all waves: CHALLENGE_RESULT modal with Rerun / Return buttons

## Wave sequences (TIER_WAVE_SEQUENCES in constants.ts)
- Bronze: 3 waves (challenge_w1-w3)
- Silver: 4 waves (challenge_w1-w4)
- Gold: 5 waves (challenge_w1-w4 + challenge_final)
- Platinum: 6 waves (w2-w4, challenge_final, echo_warden, ring_boss)
- Diamond: 7 waves (w3-w4, challenge_final, archivist, echo_warden, ring_boss, echo_warden)
- Color: 8 waves (w3-w4, challenge_final, archivist, echo_warden, ring_boss, child_void_kid, echo_warden)

## State fields added
- `challengeSnapshot`: deep copy of player + mapId taken at challenge start; restored on Return/death/abandon
- `challengeResultMenuIndex`: 0=Rerun, 1=Return

## Key invariants
- CHALLENGE_ARENA is never added to `discovered_*` flags → never appears in Memory Transit
- 'N' key is blocked in CHALLENGE_ARENA with a message
- '<' exit tile in CHALLENGE_ARENA is blocked while challengeAttempt is active
- Death in challenge: restores snapshot instead of VH respawn
- Duplicate reward item → echoes (item.price) added to snapshot.player.echoes (received on Return)
- Item added to snapshot.player.inventory so it's present when player returns

**Why:**
The old system auto-chained battles immediately after board selection, with no NPC involvement, no inter-wave rest points, and no tier scaling. The user wanted a fresh-start arena experience with per-tier difficulty progression.

**How to apply:**
- engine.ts: resetPlayerForChallenge(), restoreFromChallengeSnapshot() helpers
- dialogue.ts: challenge_keeper reads ca.wave and TIER_WAVE_SEQUENCES to present the right trial
- waveLaunched flag: set by keeper dialogue action; cleared by engine after battle ends
