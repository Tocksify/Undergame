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

  // ── BOSS ─────────────────────────────────────────────────────────
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
  return { text: '...', speaker: 'System' };
}
