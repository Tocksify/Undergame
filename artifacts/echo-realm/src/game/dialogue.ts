import { GameStateData, GameMode, DialogueNode } from './types';
import { ENEMIES } from './constants';

export function getDialogueStartNode(state: GameStateData, npcId: string): DialogueNode {
  const qMain   = state.player.quests['quest_main']   || 0;
  const qName   = state.player.quests['quest_name']   || 0;
  const qHollow = state.player.quests['quest_hollow'] || 0;

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
            if (s.player.inventory.length <= 6) { s.player.inventory.push('tonic'); s.player.inventory.push('tonic'); }
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

  // ── ZARA (shop — prompt only, actual shop opens via SHOP mode) ───
  if (npcId === 'zara') {
    // Engine opens shop directly for SHOP-type NPCs, so this is a fallback
    return {
      text: "Welcome! I trade in Memory Shards, curiosities, and things people wished they'd kept. You lose something? I might have it.",
      speaker: 'Zara', color: '#dddddd',
      options: [
        { label: "Show me your wares.", action: (s) => { s.mode = GameMode.SHOP; s.shopIndex = 0; } },
        { label: "Just looking."       }
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
            if (s.player.inventory.length < 8) s.player.inventory.push('ward');
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
        { label: "I am sorry."               }
      ]
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

  // ── OLD VESS (Sunken Archive gate + side quest) ───────────────────
  if (npcId === 'vess') {
    const qArchive = state.player.quests['quest_archive'] || 0;
    const qMain = state.player.quests['quest_main'] || 0;
    if (qArchive === 1 && (state.player.questProgress['archive_kills'] || 0) >= 3) {
      return {
        text: "Three wraiths silenced... you've done what I could not. Take my ward — may it guard your memory as it guarded mine.",
        speaker: 'Old Vess', color: '#aaaaaa',
        action: (s) => {
          s.player.quests['quest_archive'] = 2;
          s.player.echoes += 80;
          if (s.player.inventory.length < 8) s.player.inventory.push('archivist_ward');
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

  // ── WARDEN KESS (Frostbound Reach gate) ───────────────────────────
  if (npcId === 'warden_kess') {
    const qMain = state.player.quests['quest_main'] || 0;
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

  // ── A SHIVERING VILLAGER (Frostbound Reach side quest) ────────────
  if (npcId === 'shivering_villager') {
    const q = state.player.quests['quest_frost'] || 0;
    if (q === 1 && (state.player.questProgress['frost_kills'] || 0) >= 2) {
      return {
        text: "The warmth... it's returning to my hands. Here, take my father's blade — I've no use for it, frozen as I've been.",
        speaker: 'A Shivering Villager', color: '#cfe8ff',
        action: (s) => {
          s.player.quests['quest_frost'] = 2;
          s.player.echoes += 60;
          if (s.player.inventory.length < 8) s.player.inventory.push('frost_fang');
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

  // ── EMBER SENTINEL (Ashen Descent gate) ───────────────────────────
  if (npcId === 'ember_sentinel') {
    const qMain = state.player.quests['quest_main'] || 0;
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

  // ── A BURNED SCHOLAR (Ashen Descent side quest) ───────────────────
  if (npcId === 'burned_scholar') {
    const q = state.player.quests['quest_ash'] || 0;
    if (q === 1 && (state.player.questProgress['ash_kills'] || 0) >= 2) {
      return {
        text: "You did it. The embers... I can almost see her face again. Take this blade — forged in the last true fire.",
        speaker: 'A Burned Scholar', color: '#ff9966',
        action: (s) => {
          s.player.quests['quest_ash'] = 2;
          s.player.echoes += 100;
          if (s.player.inventory.length < 8) s.player.inventory.push('cinder_blade');
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
    return {
      text: "I CANNOT FORGET THE PAIN. AND SO I WILL ERASE IT ALL. EVERY MEMORY. EVERY SOUL. UNTIL NOTHING REMAINS TO HURT.",
      speaker: 'Memory Wraith', color: '#ffffff',
      action: (s) => { s.pendingEncounter = JSON.parse(JSON.stringify(ENEMIES['boss'])); }
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
      text: "Stay on the memory-grass — the pale green patches — if you need a breather. The void tiles are dark and dangerous. The creatures there aren't evil, just... lost. Like us.",
      speaker: 'Pip', color: '#bbbbbb'
    };
  }
  if (nextId === 'vess_ledger') {
    return {
      text: "The Ledger records every memory the Archive ever swallowed. Somewhere in these stacks is a page with your name on it, Keeper. Best not to go looking.",
      speaker: 'Old Vess', color: '#aaaaaa'
    };
  }
  return { text: '...', speaker: 'System' };
}
