import { GameStateData, GameMode, DialogueNode } from './types';
import { ENEMIES, CITY_SIDE_QUESTS, pickWeightedReward, pushMessages, ITEMS, MAPS, TIER_WAVE_SEQUENCES, recomputeMaxHp } from './constants';
import { pickNextEmblem, addEarnedEmblemId } from '../challengeStore';

export function getDialogueStartNode(state: GameStateData, npcId: string): DialogueNode {
  const qMain   = state.player.quests['quest_main']   || 0;
  const qName   = state.player.quests['quest_name']   || 0;
  const qHollow = state.player.quests['quest_hollow'] || 0;
  const qCity   = state.player.quests['quest_city']   || 0;

  // ── GENERIC CITY SIDE-QUEST NPCS (scattered "misc" buildings) ──────
  // Data-driven from CITY_SIDE_QUESTS — one handler covers all 10 quest-givers
  // instead of 10 near-duplicate hand-written blocks. Stage 0 = not offered,
  // 1 = in progress, 2 = complete (reward already granted).
  const sideQuest = CITY_SIDE_QUESTS.find((sq) => sq.npcId === npcId);
  if (sideQuest) {
    const qId = `quest_${sideQuest.id}`;
    const stage = state.player.quests[qId] || 0;
    const kills = state.player.questProgress[`sqkills_${sideQuest.id}`] || 0;
    if (stage >= 2) {
      return { text: sideQuest.afterText, speaker: sideQuest.npcName, color: '#c9a9dd' };
    }
    if (stage === 1) {
      if (kills >= sideQuest.requiredKills) {
        return {
          text: sideQuest.completeText,
          speaker: sideQuest.npcName, color: '#c9a9dd',
          action: (s) => {
            s.player.quests[qId] = 2;
            const rewardId = pickWeightedReward(sideQuest.rewardPool);
            s.player.inventory.push(rewardId); s.player.enchantedSlots.push(null);
            s.player.echoes += sideQuest.echoes;
            const rewardName = ITEMS[rewardId]?.name ?? rewardId;
            pushMessages(s, [
              `Quest Complete: ${sideQuest.title}!`,
              `+${sideQuest.echoes} Echoes`,
              `+${rewardName}`,
            ], ITEMS[rewardId]?.tier);
          }
        };
      }
      return { text: sideQuest.progressText, speaker: sideQuest.npcName, color: '#c9a9dd' };
    }
    return {
      text: sideQuest.giverIntro,
      speaker: sideQuest.npcName, color: '#c9a9dd',
      options: [
        { label: "I'll help.", action: (s) => { s.player.quests[qId] = 1; s.uiMessage = `Quest Added: ${sideQuest.title}`; s.uiMessageTimer = 160; } },
        { label: "Not right now." }
      ]
    };
  }

  // ── ECHO WARDEN (secret dungeon mini-boss) ─────────────────────────
  if (npcId === 'echo_warden') {
    return {
      text: "YOU FOUND THE QUIET HOUSE. FEW DO. FEWER LEAVE WITH WHAT IT GUARDS. TURN BACK, OR TAKE IT FROM ME.",
      speaker: 'Echo Warden', color: '#7a6fb0',
      action: (s) => { s.pendingEncounter = JSON.parse(JSON.stringify(ENEMIES['echo_warden'])); }
    };
  }

  // ── THE RINGKEEPER (Ashfall Ring boss) ─────────────────────────────
  if (npcId === 'ring_boss') {
    return {
      text: "ANOTHER SEEKER OF THE BLESSING. THE ASH REMEMBERS EVERY ONE OF YOU. NONE HAVE TAKEN IT FROM ME YET.",
      speaker: 'The Ringkeeper', color: '#8a5a3a',
      action: (s) => { s.pendingEncounter = JSON.parse(JSON.stringify(ENEMIES['ring_boss'])); }
    };
  }

  // ── GREGOR (innkeeper / healer) ──────────────────────────────────
  if (npcId === 'gregor') {
    return {
      text: "Rest here, Keeper. The Void cannot reach inside the inn. I've kept the lanterns burning — the light keeps the Hollow away.",
      speaker: 'Gregor', color: '#888888',
      action: (s) => { s.player.hp = s.player.maxHp; s.uiMessage = "HP fully restored!"; s.uiMessageTimer = 120; }
    };
  }

  // ── ELDER MAREN ─────────────────────────────────────────────────
  if (npcId === 'maren') {
    if (qMain === 2) {
      return { text: "Thank you, child. The memories are returning. I remember my garden... the smell of it. I almost lost that.", speaker: 'Elder Maren', color: '#999999' };
    }
    if (qMain === 1) {
      if ((state.player.questProgress['shards'] || 0) >= 3) {
        return {
          text: "You found them. All three. You are a true Keeper. Take this — and know that the village owes you its memory.",
          speaker: 'Elder Maren', color: '#999999',
          action: (s) => {
            s.player.quests['quest_main'] = 2;
            s.player.echoes += 100;
            if (true) {
              s.player.inventory.push('tonic'); s.player.enchantedSlots.push(null);
              s.player.inventory.push('tonic'); s.player.enchantedSlots.push(null);
            }
            s.uiMessage = "Quest: The Lost Memories  COMPLETE! +100 Echoes +2 Tonics"; s.uiMessageTimer = 180;
          }
        };
      }
      return { text: "We need 3 Memory Shards from the Whispering Wastes. The enemies there carry them. Please... hurry. I can feel myself fading.", speaker: 'Elder Maren', color: '#999999' };
    }
    return {
      text: "Ah... you've come. I've watched this village dim day by day. The memories are fading, child. Even my own. Do you remember your mother's face? I... I almost cannot. Please.",
      speaker: 'Elder Maren', color: '#999999',
      options: [
        { label: "How can I help?", nextId: 'maren_quest' },
        { label: "Who are you?",    nextId: 'maren_who'   },
      ]
    };
  }

  // ── PIP ──────────────────────────────────────────────────────────
  if (npcId === 'pip') {
    if (qName === 2) {
      return { text: "Wow, you named him! You did it! He looked so... relieved. Like he'd been holding his breath for years. Thank you.", speaker: 'Pip', color: '#bbbbbb' };
    }
    if (qName === 1) {
      return { text: "The Void Crawler is somewhere out in the Wastes. You need the Naming Stone — buy one from Zara! Then use ACT in battle and choose 'Name It'.", speaker: 'Pip', color: '#bbbbbb' };
    }
    return {
      text: "The Void Crawler under the old stone? I named him Gerald! Well, I tried to. He just looked at me funny. Maybe you could try? You seem good at remembering things.",
      speaker: 'Pip', color: '#bbbbbb',
      options: [
        { label: "I'll try.", action: (s) => { s.player.quests['quest_name'] = 1; s.uiMessage = "Quest Added: A Name for the Nameless"; s.uiMessageTimer = 120; } },
        { label: "Tell me about the Wastes.", nextId: 'pip_wastes' },
      ]
    };
  }

  // ── ZARA (shop) ──────────────────────────────────────────────────
  if (npcId === 'zara') {
    return {
      text: "Welcome! I trade in Memory Shards, curiosities, and things people wished they'd kept. You lose something? I might have it.",
      speaker: 'Zara', color: '#dddddd',
      options: [
        { label: "Show me your wares.", action: (s) => { s.mode = GameMode.SHOP; s.shopIndex = 0; } },
        { label: "Just looking." }
      ]
    };
  }

  // ── THE HOLLOW ───────────────────────────────────────────────────
  if (npcId === 'hollow') {
    if (qHollow === 2) {
      if (!state.player.flags['hollow_reward']) {
        return {
          text: "...I remember... the wind in the fields. The smell of bread. My mother's laugh. Thank you. Here — take this. It is all I have left to give.",
          speaker: 'A Hollow', color: '#eeeeee',
          action: (s) => {
            s.player.flags['hollow_reward'] = true;
            s.player.inventory.push('ward'); s.player.enchantedSlots.push(null);
            s.uiMessage = "Quest: The Hollow Heart  COMPLETE! Received Void Ward."; s.uiMessageTimer = 180;
          }
        };
      }
      return { text: "The world feels warmer now. Thank you.", speaker: 'A Villager', color: '#eeeeee' };
    }
    if (qHollow === 1) {
      return { text: "...echoes... please... silence them... find them...", speaker: 'A Hollow', color: '#eeeeee' };
    }
    return {
      text: "...hollow... cold... where is the warmth... I cannot remember the warmth...",
      speaker: 'A Hollow', color: '#eeeeee',
      options: [
        { label: "I will find your memories.", action: (s) => { s.player.quests['quest_hollow'] = 1; s.uiMessage = "Quest Added: The Hollow Heart (Defeat 2 Specters)"; s.uiMessageTimer = 180; } },
        { label: "I am sorry." }
      ]
    };
  }

  // ── CITY GATE GUARD / MESSENGER ───────────────────────────────────
  if (npcId === 'city_gate_guard') {
    return {
      text: "Keeper — a word. Crestfall City to the east is overrun with shades and hollow guards. The city gates are open, but no one dares go in. We need someone who can remember them back to peace.",
      speaker: 'City Messenger', color: '#aaaaff',
      options: [
        { label: "I'll go to Crestfall.", nextId: 'city_gate_how' },
        { label: "Tell me more about the city.", nextId: 'city_gate_lore' },
      ]
    };
  }

  // ── THE ECHO WARDEN (secret dungeon beneath Crestfall) ──────────
  if (npcId === 'echo_warden') {
    return {
      text: "YOU FOUND THE PASSAGE. FEW DO. WHAT IS BURIED BENEATH THIS CITY WAS HIDDEN HERE LONG BEFORE IT HAD A NAME. GIVE IT BACK, OR EARN IT.",
      speaker: 'The Echo Warden', color: '#6d28d9',
      action: (s) => { s.pendingEncounter = JSON.parse(JSON.stringify(ENEMIES['echo_warden'])); }
    };
  }

  // ── THE RINGKEEPER (Ashfall Ring arena boss) ─────────────────────
  if (npcId === 'ring_boss') {
    return {
      text: "YOU STAND IN THE RING. THE BLESSING CANNOT BE GIVEN — ONLY WON. PROVE YOURSELF WORTHY OF WHAT THIS CITY REMEMBERS.",
      speaker: 'The Ringkeeper', color: '#0ea5e9',
      action: (s) => { s.pendingEncounter = JSON.parse(JSON.stringify(ENEMIES['ring_boss'])); }
    };
  }

  // ── THE ARCHIVIST (Memory Sanctum mid-boss) ───────────────────────
  if (npcId === 'archivist') {
    return {
      text: "YOU WHO STILL REMEMBER — TURN BACK. THE ARCHIVE BELONGS TO THE FORGOTTEN NOW.",
      speaker: 'The Archivist', color: '#bbbbbb',
      action: (s) => { s.pendingEncounter = JSON.parse(JSON.stringify(ENEMIES['archivist'])); }
    };
  }

  // ── OLD VESS (Sunken Archive) ─────────────────────────────────────
  if (npcId === 'vess') {
    const qArchive = state.player.quests['quest_archive'] || 0;
    if (qArchive === 1 && (state.player.questProgress['archive_kills'] || 0) >= 3) {
      return {
        text: "Three wraiths silenced... you've done what I could not. Take my ward — may it guard your memory as it guarded mine.",
        speaker: 'Old Vess', color: '#aaaaaa',
        action: (s) => {
          s.player.quests['quest_archive'] = 2;
          s.player.echoes += 80;
          s.player.inventory.push('archivist_ward'); s.player.enchantedSlots.push(null);
          s.uiMessage = "Quest Complete: The Waterlogged Ledger! +80 Echoes +Archivist's Ward"; s.uiMessageTimer = 180;
        }
      };
    }
    if (qArchive === 1) {
      return { text: `The Ink Wraiths guard the deep stacks. Silence ${Math.max(0, 3 - (state.player.questProgress['archive_kills'] || 0))} more and I'll reward you.`, speaker: 'Old Vess', color: '#aaaaaa' };
    }
    if (qMain >= 4) {
      return { text: "The northern gate is open. Safe travels, Keeper.", speaker: 'Old Vess', color: '#aaaaaa' };
    }
    if (state.player.flags['defeated_ink_wraith']) {
      return {
        text: "You've proven yourself against the Wraiths. The path north is yours.",
        speaker: 'Old Vess', color: '#aaaaaa',
        options: [
          { label: "Open the way north.", action: (s) => { s.player.quests['quest_main'] = 4; s.uiMessage = "The path to the Frostbound Reach is open."; s.uiMessageTimer = 180; } },
          { label: "Tell me about the Ledger.", nextId: 'vess_ledger' }
        ]
      };
    }
    return {
      text: "The stacks below are guarded by Ink Wraiths — creatures of spilled memory. Prove yourself against one, then we'll talk about what lies north.",
      speaker: 'Old Vess', color: '#aaaaaa',
      options: [
        { label: "I'll clear the archive of wraiths.", action: (s) => { s.player.quests['quest_archive'] = 1; s.uiMessage = "Quest Added: The Waterlogged Ledger"; s.uiMessageTimer = 140; } },
        { label: "Just tell me about the way north.", nextId: 'vess_ledger' }
      ]
    };
  }

  // ── WARDEN KESS (Frostbound Reach) ────────────────────────────────
  if (npcId === 'warden_kess') {
    if (qMain >= 5) return { text: "Stay warm out there, Keeper.", speaker: 'Warden Kess', color: '#cfe8ff' };
    if (state.player.flags['defeated_frost_walker']) {
      return {
        text: "You've felled one of the Walkers. You have my respect — and the road ahead.",
        speaker: 'Warden Kess', color: '#cfe8ff',
        options: [{ label: "Open the road to the Descent.", action: (s) => { s.player.quests['quest_main'] = 5; s.uiMessage = "The path to the Ashen Descent is open."; s.uiMessageTimer = 180; } }]
      };
    }
    return { text: "The Reach is frozen in a moment none of us can remember. Face one of the Frost Walkers and prove the cold hasn't claimed you.", speaker: 'Warden Kess', color: '#cfe8ff' };
  }

  // ── A SHIVERING VILLAGER (Frostbound Reach) ───────────────────────
  if (npcId === 'shivering_villager') {
    const q = state.player.quests['quest_frost'] || 0;
    if (q === 1 && (state.player.questProgress['frost_kills'] || 0) >= 2) {
      return {
        text: "The warmth... it's returning to my hands. Here, take my father's blade — I've no use for it, frozen as I've been.",
        speaker: 'A Shivering Villager', color: '#cfe8ff',
        action: (s) => {
          s.player.quests['quest_frost'] = 2;
          s.player.echoes += 60;
          s.player.inventory.push('frost_fang'); s.player.enchantedSlots.push(null);
          s.uiMessage = "Quest Complete: Thaw the Watcher! +60 Echoes +Frost Fang"; s.uiMessageTimer = 180;
        }
      };
    }
    if (q === 1) return { text: `${Math.max(0, 2 - (state.player.questProgress['frost_kills'] || 0))} more Frost Walkers, please... the cold is in my bones.`, speaker: 'A Shivering Villager', color: '#cfe8ff' };
    return {
      text: "I've been frozen here so long I've forgotten my own name. The Frost Walkers took my warmth. If you defeat two, maybe... maybe I'll thaw.",
      speaker: 'A Shivering Villager', color: '#cfe8ff',
      options: [
        { label: "I'll thaw your memory.", action: (s) => { s.player.quests['quest_frost'] = 1; s.uiMessage = "Quest Added: Thaw the Watcher"; s.uiMessageTimer = 140; } },
        { label: "I'm sorry." }
      ]
    };
  }

  // ── EMBER SENTINEL (Ashen Descent) ────────────────────────────────
  if (npcId === 'ember_sentinel') {
    if (qMain >= 6) return { text: "The Nexus awaits. Go — and remember us, whatever happens.", speaker: 'Ember Sentinel', color: '#ff9966' };
    if (state.player.flags['defeated_ash_hound']) {
      return {
        text: "The Hounds respect strength. So do I. The Nexus is beyond — go, before the ash swallows the way.",
        speaker: 'Ember Sentinel', color: '#ff9966',
        options: [{ label: "Open the way to the Nexus.", action: (s) => { s.player.quests['quest_main'] = 6; s.uiMessage = "The path to the Void Nexus is open."; s.uiMessageTimer = 180; } }]
      };
    }
    return { text: "The Descent burns with memories that refuse to die. An Ash Hound guards these embers. Defeat one, and I'll let you pass.", speaker: 'Ember Sentinel', color: '#ff9966' };
  }

  // ── A BURNED SCHOLAR (Ashen Descent) ─────────────────────────────
  if (npcId === 'burned_scholar') {
    const q = state.player.quests['quest_ash'] || 0;
    if (q === 1 && (state.player.questProgress['ash_kills'] || 0) >= 2) {
      return {
        text: "You did it. The embers... I can almost see her face again. Take this blade — forged in the last true fire.",
        speaker: 'A Burned Scholar', color: '#ff9966',
        action: (s) => {
          s.player.quests['quest_ash'] = 2;
          s.player.echoes += 100;
          s.player.inventory.push('cinder_blade'); s.player.enchantedSlots.push(null);
          s.uiMessage = "Quest Complete: Embers of the Forgotten! +100 Echoes +Cinder Blade"; s.uiMessageTimer = 180;
        }
      };
    }
    if (q === 1) return { text: `${Math.max(0, 2 - (state.player.questProgress['ash_kills'] || 0))} more Cinder Wraiths. Please. I need to remember her.`, speaker: 'A Burned Scholar', color: '#ff9966' };
    return {
      text: "I was a Keeper once, before the ash took my notes — and her name. If you silence two Cinder Wraiths, perhaps some of it returns.",
      speaker: 'A Burned Scholar', color: '#ff9966',
      options: [
        { label: "I'll bring back her memory.", action: (s) => { s.player.quests['quest_ash'] = 1; s.uiMessage = "Quest Added: Embers of the Forgotten"; s.uiMessageTimer = 140; } },
        { label: "I can't promise that." }
      ]
    };
  }

  // ── MEMORY WRAITH (Void Nexus final boss) ─────────────────────────
  if (npcId === 'boss') {
    if (state.player.flags['boss_defeated']) {
      return { text: "...", speaker: 'Memory Wraith', color: '#ffffff' };
    }
    return {
      text: "I CANNOT FORGET THE PAIN. AND SO I WILL ERASE IT ALL. EVERY MEMORY. EVERY SOUL. UNTIL NOTHING REMAINS TO HURT.",
      speaker: 'Memory Wraith', color: '#ffffff',
      action: (s) => { s.pendingEncounter = JSON.parse(JSON.stringify(ENEMIES['boss'])); }
    };
  }

  // ── CITY WARDEN (Crestfall City) ───────────────────────────────────
  if (npcId === 'city_warden') {
    if (qCity === 2) {
      if (!state.player.flags['city_reward']) {
        return {
          text: "You've done it. The streets are quieter. I can hear... footsteps again. Real ones. Here — the city's emergency reserves. They're yours.",
          speaker: 'City Warden', color: '#aaaaff',
          action: (s) => {
            s.player.flags['city_reward'] = true;
            s.player.echoes += 150;
            s.player.inventory.push('phoenix_ash'); s.player.enchantedSlots.push(null);
            s.uiMessage = "Quest: Reclaim Crestfall COMPLETE! +150 Echoes +Phoenix Ash"; s.uiMessageTimer = 200;
          }
        };
      }
      return { text: "The city breathes again. Thank you, Keeper.", speaker: 'City Warden', color: '#aaaaff' };
    }
    if (qCity === 1) {
      return { text: `${Math.max(0, 5 - (state.player.questProgress['city_clears'] || 0))} more shades to silence. The east quarter is worst — be careful.`, speaker: 'City Warden', color: '#aaaaff' };
    }
    return {
      text: "Keeper — you came. The city is overrun. City Shades, Street Wraiths, Hollow Guards — they walk the old routes like they still live here. Silence five of them. Please.",
      speaker: 'City Warden', color: '#aaaaff',
      options: [
        { label: "I'll clear the city.", action: (s) => { s.player.quests['quest_city'] = 1; s.uiMessage = "Quest Added: Reclaim Crestfall (Silence 5 shades)"; s.uiMessageTimer = 160; } },
        { label: "Tell me about Crestfall.", nextId: 'warden_lore' }
      ]
    };
  }

  // ── RELIC BROKER (Crestfall City shop) ────────────────────────────
  if (npcId === 'relic_broker') {
    return {
      text: "I salvage what the shades leave behind. Enchanted tomes, crystals, wards. You want power? I have it — at a price.",
      speaker: 'Relic Broker', color: '#ffcc88',
      options: [
        { label: "Show me your wares.", action: (s) => { s.mode = GameMode.SHOP; s.shopIndex = 0; s.shopNpcId = 'relic_broker'; } },
        { label: "Those tomes — what do they do?", nextId: 'broker_tomes' }
      ]
    };
  }

  // ── COLOR — ambient villagers (no quests; this village exists to be at peace) ──
  if (npcId === 'co_child') {
    return { text: "We play in the grass all day. It's green here — not gray, like the stories say the rest of the world is. Have you seen a hollow? I haven't. I don't think they're real.", speaker: 'A Child', color: '#bde8c2' };
  }
  if (npcId === 'co_gardener') {
    return { text: "Everything grows here. I don't remember planting half of it. I don't remember much of anything before Color, if I'm honest — and I've stopped minding.", speaker: 'A Gardener', color: '#a6d9ac' };
  }
  if (npcId === 'co_elder') {
    return { text: "No one ages here, not really. No one's in a hurry to leave, either. Some places you find. Others find you, when you're finally ready to stop looking.", speaker: 'An Elder', color: '#cfeed3' };
  }
  if (npcId === 'co_weaver') {
    return { text: "I weave the green into cloth, just to hold a piece of it. Silly, maybe. But after so much gray, who could blame me?", speaker: 'A Weaver', color: '#9fd6a6' };
  }

  // ── VERDANT HOLLOW FAMILIAR FACES, now resting in Color ──
  if (npcId === 'co_maren') {
    return {
      text: "I never thought I'd live to see it. Green — so much green. After all those gray days in the Hollow, this is what I was trying to protect the whole time. Take a moment, Keeper. You've more than earned it.",
      speaker: 'Elder Maren', color: '#c8d8c8',
    };
  }
  if (npcId === 'co_pip') {
    return {
      text: "I kept every one of those memory-grass stones in my pocket for luck. Guess I don't need luck anymore. Honestly I'm not sure what to do with myself — I'm happy. Took me a second to remember what that even felt like.",
      speaker: 'Pip', color: '#c0ccc0',
    };
  }
  if (npcId === 'co_zara') {
    return {
      text: "No inventory. No prices. No ledger to balance at the end of the day. I just... sit, mostly. Sometimes I braid grass into little figures and leave them on window ledges. Never had time for things like that, before.",
      speaker: 'Zara', color: '#e0e8e0',
    };
  }
  if (npcId === 'co_gregor') {
    return {
      text: "My hands don't shake here. First time in longer than I can remember. I might open a little practice, if anyone in a place like this ever needs patching up. I don't expect many takers, and that suits me just fine.",
      speaker: 'Gregor', color: '#a0a8a0',
    };
  }
  if (npcId === 'co_hollow') {
    return {
      text: "The fog is gone. I can hear my own voice now — not the echo of something that used to be me. I think I am me, again, whatever that means. It feels warm. I didn't know I'd missed warm.",
      speaker: 'A Hollow', color: '#d8e8d8',
    };
  }

  // ── MORTHUS (Color) — speaking with him triggers the true ending cutscene ──
  if (npcId === 'morthus') {
    if (state.player.flags['morthus_ending_seen']) {
      const postEndingLines = [
        "The Void was never the world's enemy. It was its grief. You gave it somewhere to go.",
        "Some Keepers come back here just to stand in the light for a while. I don't blame them.",
        "You don't have to carry it anymore. Whatever you were running from — it's done.",
        "Color was always here. The world just forgot how to see it.",
        "Rest a while, Keeper. The echoes aren't going anywhere.",
        "You gave the world its memory back. That's not a small thing.",
      ];
      const idx = (state.player.flags['morthus_post_line'] as number | undefined) ?? 0;
      state.player.flags['morthus_post_line'] = (idx + 1) % postEndingLines.length;
      return { text: postEndingLines[idx], speaker: 'Morthus', color: '#7fd68a' };
    }
    return {
      text: "You made it, Keeper. Rest your feet — you won't need them to run from anything, not here. Everyone in Color is safe. The hollows, the Void reaching for us... all of that was only ever a dream.",
      speaker: 'Morthus', color: '#7fd68a',
      nextId: 'co_cutscene_1',
    };
  }

  // ── FILLER TENANTS (generated flavor NPCs scattered through Crestfall/Ashfall
  // filler houses) — a small pool of short lines, picked deterministically per
  // npc id so each one is stable but the pool is shared instead of hand-written
  // per house. ──
  if (npcId.startsWith('filler_')) {
    const lines = [
      "Don't mind the mess. I've stopped noticing it myself.",
      "This house used to be full. Now it's just full of quiet.",
      "I keep the door unlocked. Habit, mostly. No one's come by in a while.",
      "You're the first new face I've seen this week. Maybe this month.",
      "I remember when this street had a name everyone used. Now it's just 'the street.'",
      "Sit if you like. The chair's sturdier than it looks.",
      "I don't ask travelers where they're headed anymore. Feels rude, somehow.",
      "The Void took the house next door. Mine's still standing. I try not to think about why.",
      "I talk to myself less than I used to. Or maybe just quieter.",
      "Whatever you're looking for, I hope it's still where you left it.",
      "Some days I forget what I came into this room for. Today it was you, apparently.",
      "I keep the lamp lit past dark. Costs more oil than it's worth. I don't care.",
    ];
    let h = 0; for (let i = 0; i < npcId.length; i++) h = (h * 31 + npcId.charCodeAt(i)) >>> 0;
    const mapNpc = MAPS[state.mapId]?.npcs?.find((n: any) => n.id === npcId);
    return { text: lines[h % lines.length], speaker: mapNpc?.name || 'A Tenant', color: mapNpc?.color || '#c9c9c9' };
  }

  // ── A SURVIVOR (Crestfall City) ────────────────────────────────────
  if (npcId === 'city_survivor') {
    return {
      text: "I've been hiding in this corner for three days. The shades don't notice me — I think they only chase people who still have a lot to remember. That's... a terrible thought, isn't it.",
      speaker: 'A Survivor', color: '#cccccc',
      options: [
        { label: "Are you all right?", nextId: 'survivor_ok' },
        { label: "Stay hidden. It'll be over soon." }
      ]
    };
  }

  // ── TF WAYSTONE (center of Thornwood Forest — guides lost explorers) ────────
  if (npcId === 'tf_waystone') {
    return {
      text: "A moss-covered waystone, warm against the cold. An etched arrow points east — back toward the hollow. The roots around it pulse faintly, as if the forest remembers the way out.",
      speaker: 'Waystone', color: '#88bb88',
      options: [
        {
          label: 'Return to Verdant Hollow',
          action: (s) => {
            s.mapId = 'VH'; s.player.x = 1 * 24; s.player.y = 8 * 24;
            s.player.targetX = s.player.x; s.player.targetY = s.player.y;
            s.mode = GameMode.OVERWORLD;
            s.uiMessage = 'Returned to Verdant Hollow.'; s.uiMessageTimer = 120;
          },
        },
        { label: 'Stay in the forest.' },
      ],
    };
  }

  // ── TF HERMIT (deep in Thornwood Forest, near the grove) ─────────────────
  if (npcId === 'tf_hermit') {
    return {
      text: "You startled me. I've lived in this forest long enough to forget the city — and it's done me good, I think. The trees don't forget anything. They just... hold it quietly.",
      speaker: 'Thornwood Hermit', color: '#998866',
      options: [
        { label: "What can you tell me about this forest?",
          nextId: 'hermit_forest' },
        { label: "Is there a way out?",
          nextId: 'hermit_exit' },
        { label: "Farewell, hermit." },
      ],
    };
  }

  // ── CHALLENGE KEEPER (Challenge Arena — NPC-driven wave orchestrator) ────────
  if (npcId === 'challenge_keeper') {
    const ca = state.challengeAttempt;

    // No active challenge — player wandered in without starting one
    if (!ca) {
      return {
        text: "You stand in the Arena without a challenge. The trials are not open to wanderers. Leave through the southern gate and speak to the Challenge Herald in Verdant Hollow to begin.",
        speaker: 'Challenge Keeper', color: '#aabbff',
      };
    }

    const waves = TIER_WAVE_SEQUENCES[ca.tierName] ?? ['challenge_w1', 'challenge_w2', 'challenge_w3', 'challenge_w4', 'challenge_final'];
    const totalWaves = waves.length;
    const currentWave = ca.wave;

    // A battle is already queued or in progress
    if (ca.waveLaunched) {
      return {
        text: "A trial is already underway. Face your opponent.",
        speaker: 'Challenge Keeper', color: '#aabbff',
      };
    }

    // Abandon helper — restores snapshot state inline (no circular engine import)
    const abandonAction = (s: typeof state) => {
      if (s.challengeSnapshot) {
        s.player = JSON.parse(JSON.stringify(s.challengeSnapshot.player));
        s.player.targetX = s.player.x;
        s.player.targetY = s.player.y;
        s.mapId = s.challengeSnapshot.mapId;
        s.challengeSnapshot = null;
        s.challengeAttempt = null;
        recomputeMaxHp(s);
        s.uiMessage = "Challenge abandoned. Your previous progress has been restored.";
        s.uiMessageTimer = 180;
      }
    };

    // First wave — intro dialogue
    if (currentWave === 0) {
      const enemyName = ENEMIES[waves[0]]?.name ?? 'a Trial';
      const tier = ca.tierName.charAt(0).toUpperCase() + ca.tierName.slice(1);
      return {
        text: `Challenger. You have been stripped of everything you carried — rank, relics, and skill. What you earn here, you earn with nothing but will. ${tier} tier: ${totalWaves} trials stand before you. Your first opponent: ${enemyName}. When you are ready, step forward.`,
        speaker: 'Challenge Keeper', color: '#aabbff',
        options: [
          {
            label: 'I am ready. Begin the trial.',
            action: (s) => {
              if (!s.challengeAttempt) return;
              s.pendingEncounter = JSON.parse(JSON.stringify(ENEMIES[waves[0]]));
              s.challengeAttempt.waveLaunched = true;
            },
          },
          {
            label: 'I need to prepare first.',
            // Closes dialogue — player can spend stat/skill points
          },
          {
            label: 'Abandon the challenge.',
            action: abandonAction,
          },
        ],
      };
    }

    // Between waves — encourage and offer the next fight
    if (currentWave < totalWaves) {
      const enemyName = ENEMIES[waves[currentWave]]?.name ?? 'the next trial';
      const remaining = totalWaves - currentWave;
      const waveWord = currentWave === 1 ? 'trial' : 'trials';
      return {
        text: `${currentWave} ${waveWord} cleared. You are still standing — that alone is more than most. ${remaining} remain. Use the points you have earned: open your stats with [M] and your skills with [K]. When you are ready, face: ${enemyName}.`,
        speaker: 'Challenge Keeper', color: '#aabbff',
        options: [
          {
            label: `Continue — face ${enemyName}.`,
            action: (s) => {
              if (!s.challengeAttempt) return;
              s.pendingEncounter = JSON.parse(JSON.stringify(ENEMIES[waves[currentWave]]));
              s.challengeAttempt.waveLaunched = true;
            },
          },
          {
            label: 'I need more time.',
            // Closes dialogue — player allocates stats/skills
          },
          {
            label: 'Abandon the challenge.',
            action: abandonAction,
          },
        ],
      };
    }

    // All waves done (shouldn't normally reach here; engine shows result modal)
    return {
      text: "The trials are complete. Your verdict awaits.",
      speaker: 'Challenge Keeper', color: '#aabbff',
    };
  }

  // ── CHALLENGE MENDER (healer in the Challenge Arena) ─────────────────────
  if (npcId === 'challenge_mender') {
    if (state.player.hp >= state.player.maxHp) {
      return { text: "You are at full strength. Face your trials.", speaker: 'The Mender', color: '#88ccaa' };
    }
    return {
      text: "Rest between trials. The Arena is not about suffering — it is about growth.",
      speaker: 'The Mender', color: '#88ccaa',
      options: [
        { label: 'Rest up.', action: (s) => { s.player.hp = s.player.maxHp; s.uiMessage = 'Rested. HP restored.'; s.uiMessageTimer = 120; } },
        { label: 'Press on.' },
      ],
    };
  }

  return { text: '...', speaker: 'Unknown' };
}

export function getDialogueNode(state: GameStateData, nextId: string): DialogueNode {
  if (nextId === 'maren_quest') {
    return {
      text: "The Whispering Wastes. North of here. The void-creatures carry Memory Shards — fragments of what they consumed. Bring me three. Before we become like the Hollow.",
      speaker: 'Elder Maren', color: '#999999',
      action: (s) => { s.player.quests['quest_main'] = 1; s.uiMessage = "Quest Added: The Lost Memories"; s.uiMessageTimer = 120; }
    };
  }
  if (nextId === 'maren_who') {
    return {
      text: "I am Maren. I have tended this village for seventy years. But yesterday feels like a dream I cannot quite catch. That is what the Void does. It does not kill — it erases.",
      speaker: 'Elder Maren', color: '#999999',
      options: [{ label: "How can I help?", nextId: 'maren_quest' }]
    };
  }
  if (nextId === 'pip_wastes') {
    return {
      text: "Stay on the memory-grass — the pale patches — if you need a breather. The void tiles are dark and dangerous. The creatures there aren't evil, just... lost. Like us.",
      speaker: 'Pip', color: '#bbbbbb'
    };
  }
  if (nextId === 'vess_ledger') {
    return {
      text: "The Ledger records every memory the Archive ever swallowed. Somewhere in these stacks is a page with your name on it, Keeper. Best not to go looking.",
      speaker: 'Old Vess', color: '#aaaaaa'
    };
  }
  if (nextId === 'city_gate_how') {
    return {
      text: "Head east from the village — the city gate is open but the streets are dangerous. The Warden is holding up near the gate entrance. She can guide you. The old south road is sealed for now, but I hear it opens when the Void is finally put to rest.",
      speaker: 'City Messenger', color: '#aaaaff',
      action: (s) => { s.uiMessage = "Crestfall City added to your known locations."; s.uiMessageTimer = 150; }
    };
  }
  if (nextId === 'city_gate_lore') {
    return {
      text: "Crestfall was the largest city in the Realm before the Void spread. Thousands lived there. Now... the shades walk the old streets. They aren't violent by nature — but the forgetting has made them dangerous.",
      speaker: 'City Messenger', color: '#aaaaff',
      options: [{ label: "I'll go help.", nextId: 'city_gate_how' }]
    };
  }
  if (nextId === 'warden_lore') {
    return {
      text: "Crestfall was built on memory. Every stone was laid with a name carved into it — a practice the founders believed would keep the city standing. The Void doesn't like names. It's been trying to eat them ever since.",
      speaker: 'City Warden', color: '#aaaaff'
    };
  }
  if (nextId === 'broker_tomes') {
    return {
      text: "Enchanted tomes bind a spell to whatever you choose — a weapon, armor. The book is consumed. The item gains the enchantment, marked with a Z in your records. Not every tome works on every item — read the description carefully.",
      speaker: 'Relic Broker', color: '#ffcc88',
      options: [
        { label: "Show me your wares.", action: (s) => { s.mode = GameMode.SHOP; s.shopIndex = 0; s.shopNpcId = 'relic_broker'; } },
        { label: "Good to know." }
      ]
    };
  }
  if (nextId === 'hermit_forest') {
    return {
      text: "Thornwood is old. Older than any of the cities. The creatures here — the wisps, the shadow-stalkers — they aren't void-corrupted, not exactly. They are things the forest has always held. The Void just... agitated them.",
      speaker: 'Thornwood Hermit', color: '#998866',
      options: [
        { label: "Is there anything worth finding out there?",
          nextId: 'hermit_treasure' },
        { label: "Farewell." },
      ],
    };
  }
  if (nextId === 'hermit_treasure') {
    return {
      text: "The clearings hold memory — old chests from before the Void. And there is a waystone near the center of the main path, if you ever need to find your way home quickly.",
      speaker: 'Thornwood Hermit', color: '#998866',
    };
  }
  if (nextId === 'hermit_exit') {
    return {
      text: "The path runs east. Follow it to where the trees thin and you'll see light from the hollow. Takes about ten minutes at a walk. Or — there is a waystone at the heart of the main trail. It knows the way, if you ask it.",
      speaker: 'Thornwood Hermit', color: '#998866',
    };
  }
  if (nextId === 'survivor_ok') {
    return {
      text: "I'm... fine. I found a letter in that house over there, from a child to her father. I read it three times. I don't know why I kept reading it. I think I needed to remember that people like that existed.",
      speaker: 'A Survivor', color: '#cccccc'
    };
  }

  // ── THE TRUE ENDING — triggered after speaking with Morthus in Color ──
  if (nextId === 'co_cutscene_1') {
    return {
      text: "The village goes quiet. Even the wind seems to hold still. The green grass hums warm beneath your feet — warmer than any memory you can name.",
      speaker: '', nextId: 'co_cutscene_2',
    };
  }
  if (nextId === 'co_cutscene_2') {
    return {
      text: "Two figures wait at the edge of the clearing, where the path fades into the grass. You know their shapes before you can see their faces.",
      speaker: '', nextId: 'co_cutscene_3',
    };
  }
  if (nextId === 'co_cutscene_3') {
    return {
      text: "Mother. Father. You have not seen them since long before the Void took the color out of the world — and yet here they are, exactly as you remember them.",
      speaker: '', nextId: 'co_cutscene_4',
    };
  }
  if (nextId === 'co_cutscene_4') {
    return {
      text: "\"You did it,\" they say. \"The Void is gone. You brought everyone home. You can rest now.\" And for the first time in longer than you can remember, Keeper, you finally do.",
      speaker: '',
      action: (s) => {
        s.player.flags['morthus_ending_seen'] = true;
        s.mode = GameMode.TRUE_ENDING;
      },
    };
  }
  return { text: '...', speaker: 'System' };
}
