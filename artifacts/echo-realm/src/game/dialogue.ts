import { GameStateData, DialogueNode } from './types';

export function getDialogueStartNode(state: GameStateData, npcId: string): DialogueNode {
  const qMain = state.player.quests['quest_main'] || 0;
  const qName = state.player.quests['quest_name'] || 0;
  const qHollow = state.player.quests['quest_hollow'] || 0;

  if (npcId === 'maren') {
    if (qMain === 2) {
      return { text: "Thank you, child. The memories are returning. I remember my garden...", speaker: "Elder Maren", color: '#3b82f6' };
    }
    if (qMain === 1) {
      if ((state.player.questProgress['shards'] || 0) >= 3) {
        return {
          text: "You found the shards! You are a true Keeper.",
          speaker: "Elder Maren",
          color: '#3b82f6',
          action: (s) => {
            s.player.quests['quest_main'] = 2;
            s.player.echoes += 100;
            if (s.player.inventory.length < 7) s.player.inventory.push('tonic', 'tonic');
            s.uiMessage = "Quest Complete: The Lost Memories! Received 100ε + 2 Tonics.";
            s.uiMessageTimer = 180;
          }
        };
      }
      return { text: "We need 3 Memory Shards from the Whispering Wastes. Please hurry.", speaker: "Elder Maren", color: '#3b82f6' };
    }
    return {
      text: "Ah... you've come. I've watched this village dim day by day. The memories are fading, child.",
      speaker: "Elder Maren",
      color: '#3b82f6',
      options: [
        { label: "How can I help?", nextId: "maren_2" },
        { label: "Who are you?", nextId: "maren_who" }
      ]
    };
  }

  if (npcId === 'pip') {
    if (qName === 2) {
      return { text: "Wow, you named him! He looks much happier now. Thank you!", speaker: "Pip", color: '#eab308' };
    }
    if (qName === 1) {
      return { text: "Use the Naming Stone to REMEMBER him!", speaker: "Pip", color: '#eab308' };
    }
    return {
      text: "The Void Crawler under the old stone? I named him Gerald! Well, I tried to. He just looked at me funny.",
      speaker: "Pip",
      color: '#eab308',
      options: [
        { label: "I can try.", action: (s) => { s.player.quests['quest_name'] = 1; s.uiMessage = "Quest Added: Name for the Nameless"; s.uiMessageTimer = 120; } }
      ]
    };
  }

  if (npcId === 'zara') {
    return {
      text: "Welcome! I trade in Memory Shards, curiosities, and things people wished they'd kept.",
      speaker: "Zara",
      color: '#d946ef',
      options: [
        { label: "Show me your wares.", action: (s) => { s.mode = 4; /* SHOP */ } },
        { label: "Nevermind." }
      ]
    };
  }

  if (npcId === 'gregor') {
    return {
      text: "Rest here, Keeper. The Void cannot reach inside the inn.",
      speaker: "Gregor",
      color: '#9ca3af',
      action: (s) => { s.player.hp = s.player.maxHp; s.uiMessage = "HP fully restored!"; s.uiMessageTimer = 120; }
    };
  }

  if (npcId === 'hollow') {
    if (qHollow === 2) {
      if (!state.player.flags['hollow_reward']) {
        return {
          text: "...I remember... the wind. Thank you. Take this.",
          speaker: "A Hollow",
          color: '#f3f4f6',
          action: (s) => {
            s.player.flags['hollow_reward'] = true;
            if (s.player.inventory.length < 8) s.player.inventory.push('ward');
            s.uiMessage = "Quest Complete: The Hollow Heart! Received Void Ward.";
            s.uiMessageTimer = 120;
          }
        };
      }
      return { text: "The world feels warmer now.", speaker: "A Villager", color: '#fcd34d' };
    }
    if (qHollow === 1) {
      return { text: "...echoes... please... silence them...", speaker: "A Hollow", color: '#f3f4f6' };
    }
    return {
      text: "...hollow... cold... where is the warmth...?",
      speaker: "A Hollow",
      color: '#f3f4f6',
      options: [
        { label: "I will find your memories.", action: (s) => { s.player.quests['quest_hollow'] = 1; s.uiMessage = "Quest Added: The Hollow Heart (Defeat 2 Specters)"; s.uiMessageTimer = 180; } }
      ]
    };
  }

  if (npcId === 'boss') {
    return {
      text: "I CANNOT FORGET THE PAIN. I WILL ERASE IT ALL.",
      speaker: "Memory Wraith",
      color: '#000000',
      action: (s) => { s.pendingEncounter = require('./constants').ENEMIES['boss']; }
    };
  }

  return { text: "...", speaker: "Unknown" };
}

export function getDialogueNode(state: GameStateData, nextId: string): DialogueNode {
  if (nextId === 'maren_2') {
    return {
      text: "Please... find the 3 Memory Shards scattered in the Whispering Wastes. Before we all become Hollow.",
      speaker: "Elder Maren",
      color: '#3b82f6',
      action: (s) => { s.player.quests['quest_main'] = 1; s.uiMessage = "Quest Added: The Lost Memories"; s.uiMessageTimer = 120; }
    };
  }
  if (nextId === 'maren_who') {
    return {
      text: "I am Maren. I have watched this village for seventy years... but yesterday feels like a dream I can't quite catch.",
      speaker: "Elder Maren",
      color: '#3b82f6',
      options: [{ label: "How can I help?", nextId: 'maren_2' }]
    };
  }
  return { text: "...", speaker: "System" };
}