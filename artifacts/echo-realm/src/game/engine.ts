import { GameStateData, GameMode, EnemyData } from './types';
import { MAPS, ENEMIES, ITEMS, SHOPS, BOOKS, TILE_SIZE, recomputeMaxHp, CRAFTABLE_ENCHANTS, TELEPORT_POINTS, EQUIP_SLOTS, RECIPES } from './constants';
import { awardAchievement } from '../achievementStore';
import { syncBestiary } from '../codexStore';
import { PATH_ORDER, PATH_DEFS, SKILL_DEFS, canLearnSkill } from './skillTree';
import { QUESTS } from './quests';
import { getDialogueStartNode, getDialogueNode } from './dialogue';
import { updateBattlePhase, handleBattleInput } from './battle';

export function justPressed(state: GameStateData, key: string) {
  const k = key; const K = key.toUpperCase();
  return (state.keys[k] || state.keys[K]) && !(state.prevKeys[k] || state.prevKeys[K]);
}

function isExitTile(t: string) { return t === '>' || t === '<' || t === '!' || t === '@'; }

// Remove item at slot i from inventory, keeping enchantedSlots in sync
export function removeInventoryItem(state: GameStateData, index: number) {
  state.player.inventory.splice(index, 1);
  state.player.enchantedSlots.splice(index, 1);
}

// Add item to inventory, keeping enchantedSlots in sync
export function addInventoryItem(state: GameStateData, itemId: string) {
  state.player.inventory.push(itemId);
  state.player.enchantedSlots.push(null);
}

// Clear the header's inventory notification badge — call whenever the player
// opens the Inventory screen, so the badge only counts items obtained since
// the last time they actually looked.
export function markInventorySeen(state: GameStateData) {
  state.notifications.itemsBaseline = state.player.inventory.length;
}

// Clear the header's quest notification badge — call whenever the player
// opens the Quest Log, so the badge only counts quests accepted/progressed/
// completed since the last time they actually looked.
export function markQuestsSeen(state: GameStateData) {
  state.notifications.questsBaseline = { ...state.player.quests };
}

export function updateGame(state: GameStateData) {
  state.frameCount++;
  if (state.player.invincibility > 0) state.player.invincibility--;
  if (state.uiMessageTimer > 0) {
    state.uiMessageTimer--;
    if (state.uiMessageTimer <= 0) state.uiMessage = null;
  }
  if (state.messageStack.length > 0) {
    for (const m of state.messageStack) m.timer--;
    state.messageStack = state.messageStack.filter((m) => m.timer > 0);
  }

  if (state.mode === GameMode.TITLE || state.mode === GameMode.GAME_OVER) {
    if (justPressed(state, ' ') || justPressed(state, 'Enter')) {
      if (state.mode === GameMode.GAME_OVER) {
        state.player.hp = state.player.maxHp;
        state.player.x = 12 * TILE_SIZE; state.player.y = 8 * TILE_SIZE;
        state.player.targetX = state.player.x; state.player.targetY = state.player.y;
        state.mapId = 'VH';
      }
      state.mode = state.battle ? GameMode.BATTLE : GameMode.OVERWORLD;
    }
    return;
  }

  if (state.mode === GameMode.VICTORY) return;
  if (state.mode === GameMode.TRUE_ENDING) {
    if (justPressed(state, 'ArrowUp') || justPressed(state, 'w') || justPressed(state, 'ArrowDown') || justPressed(state, 's')) {
      state.trueEndingMenuIndex = state.trueEndingMenuIndex === 0 ? 1 : 0;
    }
    if (justPressed(state, ' ') || justPressed(state, 'Enter') || justPressed(state, 'z')) {
      if (state.trueEndingMenuIndex === 0) {
        // Enter Sandbox Mode — respawn near Morthus's grove and keep playing.
        state.mode = GameMode.OVERWORLD;
        state.mapId = 'CO';
        state.player.hp = state.player.maxHp;
        state.player.x = 22 * TILE_SIZE; state.player.y = 32 * TILE_SIZE;
        state.player.targetX = state.player.x; state.player.targetY = state.player.y;
        state.player.flags['sandbox_mode'] = true;
        state.uiMessage = "Sandbox Mode: your legacy endures. Fight on, at your own pace.";
        state.uiMessageTimer = 240;
      } else {
        state.endLegacyRequested = true;
      }
    }
    return;
  }

  if (state.mode === GameMode.BATTLE) {
    handleBattleInput(state);
    if (state.mode === GameMode.BATTLE && state.battle) {
      updateBattlePhase(state);
    }
    return;
  }

  // ── BOOK READ ──────────────────────────────────────────────────────
  if (state.mode === GameMode.BOOK_READ) {
    const book = state.bookRead.bookId ? BOOKS[state.bookRead.bookId] : null;
    if (!book) { state.mode = GameMode.INVENTORY; return; }

    const totalPages = book.pages.length;

    if (justPressed(state, 'ArrowRight') || justPressed(state, 'd') || justPressed(state, ' ') || justPressed(state, 'z')) {
      if (state.bookRead.page < totalPages - 1) {
        state.bookRead.page++;
      } else {
        // Last page — close book, return to inventory
        if (state.bookRead.bookId === 'book_childs_letter') state.player.flags['read_childs_letter'] = true;
        state.mode = GameMode.INVENTORY;
        state.inventoryIndex = state.bookRead.fromInventoryIndex;
        state.bookRead.bookId = null;
      }
    }
    if (justPressed(state, 'ArrowLeft') || justPressed(state, 'a')) {
      if (state.bookRead.page > 0) state.bookRead.page--;
    }
    if (justPressed(state, 'Escape') || justPressed(state, 'x')) {
      if (state.bookRead.bookId === 'book_childs_letter') state.player.flags['read_childs_letter'] = true;
      state.mode = GameMode.INVENTORY;
      state.inventoryIndex = state.bookRead.fromInventoryIndex;
      state.bookRead.bookId = null;
    }
    return;
  }

  // ── ENCHANT SELECT ─────────────────────────────────────────────────
  if (state.mode === GameMode.ENCHANT_SELECT) {
    const enchSlot = state.enchantSelect.enchantBookSlot;
    const enchBookId = state.player.inventory[enchSlot];
    const enchItem = enchBookId ? ITEMS[enchBookId] : null;
    if (!enchItem || !enchItem.enchantData) { state.mode = GameMode.INVENTORY; return; }

    const compatible = state.player.inventory
      .map((id, i) => ({ id, i }))
      .filter(({ id, i }) => {
        const it = ITEMS[id];
        return it && enchItem.enchantData!.compatibleCategories.includes(it.category as any)
          && i !== enchSlot
          && !state.player.enchantedSlots[i]; // not already enchanted
      });

    if (compatible.length === 0) {
      state.uiMessage = "No compatible items to enchant.";
      state.uiMessageTimer = 120;
      state.mode = GameMode.INVENTORY;
      return;
    }

    const maxIdx = compatible.length - 1;
    if (justPressed(state, 'ArrowUp') || justPressed(state, 'w'))
      state.enchantSelect.cursorIndex = Math.max(0, state.enchantSelect.cursorIndex - 1);
    if (justPressed(state, 'ArrowDown') || justPressed(state, 's'))
      state.enchantSelect.cursorIndex = Math.min(maxIdx, state.enchantSelect.cursorIndex + 1);

    if (justPressed(state, 'Escape') || justPressed(state, 'x')) {
      state.mode = GameMode.INVENTORY;
      return;
    }

    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      const target = compatible[state.enchantSelect.cursorIndex];
      // Apply enchantment: mark target slot, remove enchanted book
      state.player.enchantedSlots[target.i] = enchBookId;
      removeInventoryItem(state, enchSlot < target.i ? enchSlot : enchSlot); // remove book
      // Re-index after splice: if enchSlot < target.i, target shifted down by 1
      // Actually enchantedSlots[target.i] was set before removal.
      // After removal we need to clean up properly.
      // Let's redo: set enchant on target, then remove book.
      // If enchSlot < target.i: after splice(enchSlot,1), target is now at target.i-1
      // We already set enchantedSlots[target.i] = enchBookId before splice — the splice
      // shifts it correctly since we're using the array itself.
      // So the flow: set [target.i] = enchBookId, splice enchSlot → enchantedSlots shifts.
      // If enchSlot < target.i: [target.i] becomes [target.i-1] after splice — correct!
      // If enchSlot > target.i: [target.i] stays — correct!
      recomputeMaxHp(state);
      const itemName = ITEMS[target.id]?.name ?? target.id;
      state.uiMessage = `${itemName} is now enchanted [Z]!`;
      state.uiMessageTimer = 150;
      state.mode = GameMode.INVENTORY;
      state.inventoryIndex = Math.max(0, state.inventoryIndex - (enchSlot < state.inventoryIndex ? 1 : 0));
    }
    return;
  }

  // ── TOME CRAFT (Tomes Blessing: craft any enchantment from scratch) ──
  if (state.mode === GameMode.TOME_CRAFT) {
    const maxIdx = CRAFTABLE_ENCHANTS.length - 1;
    if (justPressed(state, 'ArrowUp') || justPressed(state, 'w'))
      state.tomeCraft.cursorIndex = Math.max(0, state.tomeCraft.cursorIndex - 1);
    if (justPressed(state, 'ArrowDown') || justPressed(state, 's'))
      state.tomeCraft.cursorIndex = Math.min(maxIdx, state.tomeCraft.cursorIndex + 1);

    if (justPressed(state, 'Escape') || justPressed(state, 'x')) {
      // Cancel: nothing consumed, player-friendly.
      state.mode = GameMode.INVENTORY;
      return;
    }

    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      const chosenId = CRAFTABLE_ENCHANTS[state.tomeCraft.cursorIndex];
      const blessingIdx = state.player.inventory.indexOf('tomes_blessing');
      const bookIdx = state.player.inventory.indexOf('empty_book');
      if (blessingIdx === -1 || bookIdx === -1) {
        state.uiMessage = "You need both a Tomes Blessing and an Empty Book."; state.uiMessageTimer = 120;
        state.mode = GameMode.INVENTORY;
        return;
      }
      // Consume both (remove higher index first to keep the other index valid)
      const first = Math.max(blessingIdx, bookIdx);
      const second = Math.min(blessingIdx, bookIdx);
      removeInventoryItem(state, first);
      removeInventoryItem(state, second);
      addInventoryItem(state, chosenId);
      state.player.flags['tomes_blessing_used'] = true;
      const newSlot = state.player.inventory.length - 1;
      const itemName = ITEMS[chosenId]?.name ?? chosenId;
      state.uiMessage = `Forged: ${itemName}! Choose an item to enchant.`; state.uiMessageTimer = 150;
      state.enchantSelect = { enchantBookSlot: newSlot, cursorIndex: 0 };
      state.mode = GameMode.ENCHANT_SELECT;
    }
    return;
  }

  if (state.mode === GameMode.MENU) {
    if (justPressed(state, 'ArrowUp') || justPressed(state, 'w'))   state.menuIndex = Math.max(0, state.menuIndex - 1);
    if (justPressed(state, 'ArrowDown') || justPressed(state, 's')) state.menuIndex = Math.min(6, state.menuIndex + 1);
    if (justPressed(state, 'Escape') || justPressed(state, 'x')) state.mode = GameMode.OVERWORLD;
    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      if (state.menuIndex === 0) state.mode = GameMode.OVERWORLD;
      if (state.menuIndex === 1) { state.mode = GameMode.INVENTORY; state.inventoryIndex = 0; markInventorySeen(state); }
      if (state.menuIndex === 2) { state.mode = GameMode.QUEST_LOG; markQuestsSeen(state); }
      if (state.menuIndex === 3) {
        if (state.meta.isGuest) { state.uiMessage = "Log in from the title screen to save your progress."; state.uiMessageTimer = 150; }
        else { state.saveRequested = true; }
      }
      if (state.menuIndex === 4) {
        if (state.meta.isGuest) { state.exitRequested = true; }
        else { state.saveRequested = true; state.quitAfterSave = true; }
      }
      if (state.menuIndex === 5) state.exitRequested = true;
      if (state.menuIndex === 6) { state.mode = GameMode.BESTIARY; state.bestiaryScroll = 0; }
    }
    return;
  }

  if (state.mode === GameMode.INVENTORY) {
    const inv = state.player.inventory;

    // ── Tab / Q: switch between equipment panel and items list ────────
    if (justPressed(state, 'Tab') || justPressed(state, 'q')) {
      state.inventoryPage = state.inventoryPage === 0 ? 1 : 0;
      state.equipSlotMenu = null;
      return;
    }

    if (justPressed(state, 'Escape') || justPressed(state, 'x') || justPressed(state, 'i')) {
      if (state.equipSlotMenu !== null) { state.equipSlotMenu = null; return; }
      state.mode = state.battle ? GameMode.BATTLE : GameMode.OVERWORLD;
      return;
    }

    // ══════════════════════════════════════════════════════════════════
    // PAGE 0 — Equipment Panel
    // ══════════════════════════════════════════════════════════════════
    if (state.inventoryPage === 0) {
      if (state.equipSlotMenu !== null) {
        const menu = state.equipSlotMenu;
        const slot = EQUIP_SLOTS.find(s => s.id === menu.slotId);
        if (!slot) { state.equipSlotMenu = null; return; }
        const eq = state.player.equipment as Record<string, string | null>;
        const equippedId = eq[slot.id];

        if (menu.mode === 'actions') {
          // 0 = Unequip   1 = Sell   2 = Back
          if (justPressed(state, 'ArrowUp') || justPressed(state, 'w'))   menu.menuIndex = Math.max(0, menu.menuIndex - 1);
          if (justPressed(state, 'ArrowDown') || justPressed(state, 's')) menu.menuIndex = Math.min(2, menu.menuIndex + 1);
          if (justPressed(state, ' ') || justPressed(state, 'z')) {
            if (menu.menuIndex === 0) {
              eq[slot.id] = null;
              recomputeMaxHp(state);
              state.uiMessage = `Unequipped ${ITEMS[equippedId!]?.name ?? equippedId}`; state.uiMessageTimer = 90;
              state.equipSlotMenu = null;
            } else if (menu.menuIndex === 1) {
              const sellItem = ITEMS[equippedId!];
              if (!sellItem || sellItem.price === 0) {
                state.uiMessage = 'This item is too precious to sell.'; state.uiMessageTimer = 90;
              } else {
                const gain = Math.max(1, Math.floor(sellItem.price / 2));
                eq[slot.id] = null;
                const si = inv.indexOf(equippedId!);
                if (si >= 0) removeInventoryItem(state, si);
                state.player.echoes += gain;
                recomputeMaxHp(state);
                state.uiMessage = `Sold ${sellItem.name} for ${gain} ◈.`; state.uiMessageTimer = 90;
                state.equipSlotMenu = null;
              }
            } else {
              state.equipSlotMenu = null;
            }
          }
        } else {
          // mode === 'pick' — list compatible inventory items
          const compatible = inv.filter(iid => {
            const it = ITEMS[iid];
            return it && slot.categories.includes(it.category as any);
          });
          const hasEquipped = !!equippedId;
          const totalOpts = compatible.length + (hasEquipped ? 1 : 0);
          if (justPressed(state, 'ArrowUp') || justPressed(state, 'w'))   menu.menuIndex = Math.max(0, menu.menuIndex - 1);
          if (justPressed(state, 'ArrowDown') || justPressed(state, 's')) menu.menuIndex = Math.min(totalOpts - 1, menu.menuIndex + 1);
          if (justPressed(state, ' ') || justPressed(state, 'z')) {
            if (hasEquipped && menu.menuIndex === 0) {
              eq[slot.id] = null;
              recomputeMaxHp(state);
              state.uiMessage = `Unequipped ${ITEMS[equippedId]?.name ?? equippedId}`; state.uiMessageTimer = 90;
              state.equipSlotMenu = null;
            } else {
              const pickIdx = hasEquipped ? menu.menuIndex - 1 : menu.menuIndex;
              const chosen = compatible[pickIdx];
              if (chosen) {
                if (slot.id === 'ring1' && state.player.equipment.ring2 === chosen) {
                  state.uiMessage = 'Already wearing that on the other finger.'; state.uiMessageTimer = 90;
                } else if (slot.id === 'ring2' && state.player.equipment.ring1 === chosen) {
                  state.uiMessage = 'Already wearing that on the other finger.'; state.uiMessageTimer = 90;
                } else {
                  eq[slot.id] = chosen;
                  recomputeMaxHp(state);
                  state.uiMessage = `Equipped ${ITEMS[chosen]?.name ?? chosen}`; state.uiMessageTimer = 90;
                }
                state.equipSlotMenu = null;
              }
            }
          }
        }
        return;
      }

      // Browsing equipment slots
      if (justPressed(state, 'ArrowUp') || justPressed(state, 'w'))
        state.equipPanelCursor = Math.max(0, state.equipPanelCursor - 1);
      if (justPressed(state, 'ArrowDown') || justPressed(state, 's'))
        state.equipPanelCursor = Math.min(EQUIP_SLOTS.length - 1, state.equipPanelCursor + 1);
      if (justPressed(state, ' ') || justPressed(state, 'z')) {
        const slot = EQUIP_SLOTS[state.equipPanelCursor];
        const equippedId = (state.player.equipment as Record<string, string | null>)[slot.id];
        if (equippedId) {
          state.equipSlotMenu = { slotId: slot.id, menuIndex: 0, mode: 'actions' };
        } else {
          const compatible = inv.filter(iid => {
            const it = ITEMS[iid];
            return it && slot.categories.includes(it.category as any);
          });
          if (compatible.length === 0) {
            state.uiMessage = `No ${slot.label.toLowerCase()} in inventory.`; state.uiMessageTimer = 90;
          } else {
            state.equipSlotMenu = { slotId: slot.id, menuIndex: 0, mode: 'pick' };
          }
        }
      }
      return;
    }

    // ══════════════════════════════════════════════════════════════════
    // PAGE 1 — All Items list
    // ══════════════════════════════════════════════════════════════════
    if (justPressed(state, 'ArrowUp') || justPressed(state, 'w'))
      state.inventoryIndex = Math.max(0, state.inventoryIndex - 1);
    if (justPressed(state, 'ArrowDown') || justPressed(state, 's'))
      state.inventoryIndex = Math.min(Math.max(0, inv.length - 1), state.inventoryIndex + 1);

    if ((justPressed(state, ' ') || justPressed(state, 'z')) && inv.length > 0) {
      const idx = state.inventoryIndex;
      const id = inv[idx];
      const item = ITEMS[id];
      if (!item) return;

      if (item.category === 'book') {
        if (item.bookId && BOOKS[item.bookId]) {
          state.bookRead = { bookId: item.bookId, page: 0, fromInventoryIndex: idx };
          state.mode = GameMode.BOOK_READ;
        } else {
          state.uiMessage = "The pages are unreadable."; state.uiMessageTimer = 90;
        }
        return;
      }

      if (item.category === 'enchanted_book') {
        if (state.battle) { state.uiMessage = "Can't enchant in battle."; state.uiMessageTimer = 90; return; }
        const compat = inv.filter((iid, i) => {
          const it = ITEMS[iid];
          return it && item.enchantData!.compatibleCategories.includes(it.category as any) && i !== idx && !state.player.enchantedSlots[i];
        });
        if (compat.length === 0) { state.uiMessage = "No compatible unenchanted items to enchant."; state.uiMessageTimer = 120; return; }
        state.enchantSelect = { enchantBookSlot: idx, cursorIndex: 0 };
        state.mode = GameMode.ENCHANT_SELECT;
        return;
      }

      if (item.category === 'relic' && id === 'tomes_blessing') {
        if (state.battle) { state.uiMessage = "Can't use that in battle."; state.uiMessageTimer = 90; return; }
        if (!inv.includes('empty_book')) { state.uiMessage = "The Tomes Blessing needs an Empty Book to draw from."; state.uiMessageTimer = 140; return; }
        state.tomeCraft = { cursorIndex: 0, chosenEnchantId: null };
        state.mode = GameMode.TOME_CRAFT;
        return;
      }

      let consumed = false;
      let handled = false;
      const eq = state.player.equipment;

      if (item.category === 'weapon') {
        if (eq.weapon === id) { eq.weapon = null; state.uiMessage = `Unequipped ${item.name}`; state.uiMessageTimer = 90; }
        else if (eq.offhand === id) { eq.offhand = null; state.uiMessage = `Unequipped ${item.name} (offhand)`; state.uiMessageTimer = 90; }
        else if (eq.weapon !== null && eq.offhand === null) { eq.offhand = id; state.uiMessage = `Dual-wielding ${item.name}! (75% ATK each)`; state.uiMessageTimer = 120; }
        else { eq.weapon = id; state.uiMessage = `Equipped ${item.name}`; state.uiMessageTimer = 90; }
        handled = true;
      } else if (item.category === 'shield') {
        if (eq.offhand === id) { eq.offhand = null; state.uiMessage = `Unequipped ${item.name}`; state.uiMessageTimer = 90; }
        else {
          state.uiMessage = eq.offhand && ITEMS[eq.offhand]?.category === 'weapon'
            ? `Dropped offhand weapon. Equipped ${item.name} (blocks ${item.block ?? 0} dmg/hit)`
            : `Equipped ${item.name} — blocks ${item.block ?? 0} flat dmg/hit`;
          eq.offhand = id; state.uiMessageTimer = 120;
        }
        handled = true;
      } else if (item.category === 'armor') {
        eq.armor = eq.armor === id ? null : id; recomputeMaxHp(state);
        state.uiMessage = eq.armor === id ? `Equipped ${item.name}` : `Unequipped ${item.name}`; state.uiMessageTimer = 90; handled = true;
      } else if (item.category === 'helmet') {
        eq.helmet = eq.helmet === id ? null : id; recomputeMaxHp(state);
        state.uiMessage = eq.helmet === id ? `Equipped ${item.name}` : `Unequipped ${item.name}`; state.uiMessageTimer = 90; handled = true;
      } else if (item.category === 'gloves') {
        eq.gloves = eq.gloves === id ? null : id; recomputeMaxHp(state);
        state.uiMessage = eq.gloves === id ? `Equipped ${item.name}` : `Unequipped ${item.name}`; state.uiMessageTimer = 90; handled = true;
      } else if (item.category === 'pants') {
        eq.pants = eq.pants === id ? null : id; recomputeMaxHp(state);
        state.uiMessage = eq.pants === id ? `Equipped ${item.name}` : `Unequipped ${item.name}`; state.uiMessageTimer = 90; handled = true;
      } else if (item.category === 'boots') {
        eq.boots = eq.boots === id ? null : id; recomputeMaxHp(state);
        state.uiMessage = eq.boots === id ? `Equipped ${item.name}` : `Unequipped ${item.name}`; state.uiMessageTimer = 90; handled = true;
      } else if (item.category === 'cloak') {
        eq.cloak = eq.cloak === id ? null : id; recomputeMaxHp(state);
        state.uiMessage = eq.cloak === id ? `Equipped ${item.name}` : `Unequipped ${item.name}`; state.uiMessageTimer = 90; handled = true;
      } else if (item.category === 'necklace') {
        eq.necklace = eq.necklace === id ? null : id; recomputeMaxHp(state);
        state.uiMessage = eq.necklace === id ? `Equipped ${item.name}` : `Unequipped ${item.name}`; state.uiMessageTimer = 90; handled = true;
      } else if (item.category === 'belt') {
        eq.belt = eq.belt === id ? null : id; recomputeMaxHp(state);
        state.uiMessage = eq.belt === id ? `Equipped ${item.name}` : `Unequipped ${item.name}`; state.uiMessageTimer = 90; handled = true;
      } else if (item.category === 'trinket') {
        eq.trinket = eq.trinket === id ? null : id; recomputeMaxHp(state);
        state.uiMessage = eq.trinket === id ? `Equipped ${item.name}` : `Unequipped ${item.name}`; state.uiMessageTimer = 90; handled = true;
      } else if (item.category === 'ring') {
        if (eq.ring1 === id)       { eq.ring1 = null; recomputeMaxHp(state); state.uiMessage = `Unequipped ${item.name} (Ring I)`;  state.uiMessageTimer = 90; }
        else if (eq.ring2 === id)  { eq.ring2 = null; recomputeMaxHp(state); state.uiMessage = `Unequipped ${item.name} (Ring II)`; state.uiMessageTimer = 90; }
        else if (!eq.ring1)        { eq.ring1 = id;   recomputeMaxHp(state); state.uiMessage = `Equipped ${item.name} (Ring I)`;    state.uiMessageTimer = 90; }
        else if (!eq.ring2)        { eq.ring2 = id;   recomputeMaxHp(state); state.uiMessage = `Equipped ${item.name} (Ring II)`;   state.uiMessageTimer = 90; }
        else { state.uiMessage = 'Both ring slots occupied. Unequip one first.'; state.uiMessageTimer = 90; }
        handled = true;
      } else if (item.category === 'key') {
        state.uiMessage = "A keepsake. Best not discarded."; state.uiMessageTimer = 90; handled = true;
      } else if (id === 'crystal')         { state.player.hp = Math.min(state.player.maxHp, state.player.hp + 10); consumed = true; }
        else if (id === 'tonic')           { state.player.hp = Math.min(state.player.maxHp, state.player.hp + 5);  consumed = true; }
        else if (id === 'greater_crystal') { state.player.hp = Math.min(state.player.maxHp, state.player.hp + 25); consumed = true; }
        else if (id === 'elixir')          { state.player.hp = Math.min(state.player.maxHp, state.player.hp + 18); consumed = true; }
        else if (id === 'memory_salve')    { state.player.hp = Math.min(state.player.maxHp, state.player.hp + 30); if (state.battle) state.battle.flags.confused = false; consumed = true; }
        else if (id === 'phoenix_ash') {
          state.player.hp = state.player.maxHp;
          if (state.battle) state.battle.flags.confused = false;
          consumed = true;
        } else if (state.battle) {
          if (id === 'ward' || id === 'iron_ward') { state.battle.voidWard = true; consumed = true; }
          if (id === 'spark') { state.battle.flags.spark = true; consumed = true; }
          if (id === 'dust')  { state.battle.flags.confused = true; consumed = true; }
          if (id === 'blink_shard') { state.battle.flags.spark = true; state.battle.flags.confused = true; consumed = true; }
        }

      if (consumed) { removeInventoryItem(state, idx); handled = true; }
      state.inventoryIndex = Math.max(0, Math.min(state.inventoryIndex, inv.length - 1));
      if (state.battle && (consumed || handled)) {
        state.mode = GameMode.BATTLE; state.battle!.phase = 'ACTION'; state.battle!.actionMsg = "Used item!"; state.battle!.timer = 0;
      } else if (!state.battle && consumed) {
        state.uiMessage = "Used item."; state.uiMessageTimer = 60;
      } else if (!handled) {
        state.uiMessage = "Can't use that here."; state.uiMessageTimer = 60;
      }
    }
    return;
  }

  if (state.mode === GameMode.QUEST_LOG) {
    const activeCount = QUESTS.filter(q => q.isActive(state)).length;
    const maxVisible = 11; // must match renderQuests' listTop/listBottom/rowH math in renderer.ts
    const maxScroll = Math.max(0, activeCount - maxVisible);
    if (justPressed(state, 'ArrowUp') || justPressed(state, 'w'))   state.questLogScroll = Math.max(0, state.questLogScroll - 1);
    if (justPressed(state, 'ArrowDown') || justPressed(state, 's')) state.questLogScroll = Math.min(maxScroll, state.questLogScroll + 1);
    if (justPressed(state, 'Escape') || justPressed(state, 'q') || justPressed(state, 'x')) { state.mode = GameMode.OVERWORLD; state.questLogScroll = 0; markQuestsSeen(state); }
    return;
  }

  if (state.mode === GameMode.SHOP) {
    const shop = SHOPS[state.shopNpcId || 'zara'] ?? SHOPS['zara'];
    const shopItems = shop.items;
    if (justPressed(state, 'ArrowUp') || justPressed(state, 'w'))   state.shopIndex = Math.max(0, state.shopIndex - 1);
    if (justPressed(state, 'ArrowDown') || justPressed(state, 's')) state.shopIndex = Math.min(shopItems.length - 1, state.shopIndex + 1);
    if (justPressed(state, 'Escape') || justPressed(state, 'x')) state.mode = GameMode.OVERWORLD;
    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      const item = ITEMS[shopItems[state.shopIndex]];
      if (false) { state.uiMessage = "Inventory full!"; state.uiMessageTimer = 60; }
      else if (state.player.echoes >= item.price) {
        state.player.echoes -= item.price;
        addInventoryItem(state, shopItems[state.shopIndex]);
        state.uiMessage = "Bought: " + item.name; state.uiMessageTimer = 60;
      } else { state.uiMessage = "Not enough Echoes!"; state.uiMessageTimer = 60; }
    }
    return;
  }

  if (state.mode === GameMode.DIALOGUE) {
    const node = state.dialogue.currentNode!;
    if (state.dialogue.charIndex < node.text.length) {
      state.dialogue.timer++;
      if (state.dialogue.timer > 1) { state.dialogue.charIndex++; state.dialogue.timer = 0; }
      if (justPressed(state, ' ') || justPressed(state, 'z')) state.dialogue.charIndex = node.text.length;
    } else {
      if (node.options && node.options.length > 0) {
        if ((justPressed(state, 'ArrowUp') || justPressed(state, 'w')) && state.dialogue.selectedOption > 0) state.dialogue.selectedOption--;
        if ((justPressed(state, 'ArrowDown') || justPressed(state, 's')) && state.dialogue.selectedOption < node.options.length - 1) state.dialogue.selectedOption++;
        if (justPressed(state, ' ') || justPressed(state, 'z')) {
          const opt = node.options[state.dialogue.selectedOption];
          if (opt.action) opt.action(state);
          if (opt.nextId) {
            state.dialogue.currentNode = getDialogueNode(state, opt.nextId);
            state.dialogue.charIndex = 0; state.dialogue.selectedOption = 0;
          } else if (state.mode === GameMode.DIALOGUE) {
            // Only fall back to OVERWORLD if the action didn't already move
            // the game to a different mode (e.g. the true ending cutscene).
            state.mode = GameMode.OVERWORLD;
            if (state.pendingEncounter) { startBattle(state, state.pendingEncounter); state.pendingEncounter = null; }
          }
        }
      } else {
        if (justPressed(state, ' ') || justPressed(state, 'z')) {
          if (node.action) node.action(state);
          if (node.nextId) {
            state.dialogue.currentNode = getDialogueNode(state, node.nextId);
            state.dialogue.charIndex = 0;
          } else if (state.mode === GameMode.DIALOGUE) {
            state.mode = GameMode.OVERWORLD;
            if (state.pendingEncounter) { startBattle(state, state.pendingEncounter); state.pendingEncounter = null; }
          }
        }
      }
    }
    return;
  }

  // ── TELEPORT (N key) ───────────────────────────────────────────────
  if (state.mode === GameMode.TELEPORT) {
    const available = TELEPORT_POINTS.filter(p => state.player.flags['discovered_' + p.id]);
    if (justPressed(state, 'Escape') || justPressed(state, 'x')) { state.mode = GameMode.OVERWORLD; return; }
    if (justPressed(state, 'ArrowUp')   || justPressed(state, 'w')) { state.teleportIndex = Math.max(0, state.teleportIndex - 1); return; }
    if (justPressed(state, 'ArrowDown') || justPressed(state, 's')) { state.teleportIndex = Math.min(available.length - 1, state.teleportIndex + 1); return; }
    if (justPressed(state, ' ') || justPressed(state, 'z') || justPressed(state, 'Enter')) {
      const dest = available[state.teleportIndex];
      if (dest) {
        state.mapId = dest.mapId;
        state.player.x = dest.x * TILE_SIZE; state.player.y = dest.y * TILE_SIZE;
        state.player.targetX = state.player.x; state.player.targetY = state.player.y;
        state.mode = GameMode.OVERWORLD;
      }
      return;
    }
    return;
  }

  // ── BESTIARY (B key) ──────────────────────────────────────────────
  if (state.mode === GameMode.BESTIARY) {
    if (justPressed(state, 'Escape') || justPressed(state, 'x') || justPressed(state, 'b')) { state.mode = GameMode.OVERWORLD; return; }
    if (justPressed(state, 'ArrowUp')   || justPressed(state, 'w')) state.bestiaryScroll = Math.max(0, state.bestiaryScroll - 1);
    if (justPressed(state, 'ArrowDown') || justPressed(state, 's')) state.bestiaryScroll++;
    return;
  }

  // ── STAT ALLOCATION (M key) ────────────────────────────────────────
  if (state.mode === GameMode.STAT_ALLOCATION) {
    const rows: ('str' | 'vit' | 'def')[] = ['str', 'vit', 'def'];
    if (justPressed(state, 'Escape') || justPressed(state, 'm') || justPressed(state, 'x')) { state.mode = GameMode.OVERWORLD; return; }
    if (justPressed(state, 'ArrowUp') || justPressed(state, 'w'))   state.statAllocIndex = Math.max(0, state.statAllocIndex - 1);
    if (justPressed(state, 'ArrowDown') || justPressed(state, 's')) state.statAllocIndex = Math.min(rows.length - 1, state.statAllocIndex + 1);
    if ((justPressed(state, ' ') || justPressed(state, 'z') || justPressed(state, 'Enter') || justPressed(state, 'ArrowRight')) && state.player.statPoints > 0) {
      const stat = rows[state.statAllocIndex];
      state.player.baseStats[stat] += 1;
      state.player.statPoints -= 1;
      recomputeMaxHp(state);
    }
    return;
  }

  // ── SKILL TREE (K key) ─────────────────────────────────────────────
  if (state.mode === GameMode.SKILL_TREE) {
    if (justPressed(state, 'Escape') || justPressed(state, 'k') || justPressed(state, 'x')) {
      state.mode = GameMode.OVERWORLD; return;
    }
    const _paths = PATH_ORDER;
    const _curPathId = _paths[state.skillTreeCursor.pathIdx];
    const _pathSkills = PATH_DEFS[_curPathId].skills;
    if (justPressed(state, 'ArrowLeft') || justPressed(state, 'a')) {
      state.skillTreeCursor.pathIdx = Math.max(0, state.skillTreeCursor.pathIdx - 1);
      const _newPathSkills = PATH_DEFS[_paths[state.skillTreeCursor.pathIdx]].skills;
      state.skillTreeCursor.skillIdx = Math.min(state.skillTreeCursor.skillIdx, _newPathSkills.length - 1);
      return;
    }
    if (justPressed(state, 'ArrowRight') || justPressed(state, 'd')) {
      state.skillTreeCursor.pathIdx = Math.min(_paths.length - 1, state.skillTreeCursor.pathIdx + 1);
      const _newPathSkills2 = PATH_DEFS[_paths[state.skillTreeCursor.pathIdx]].skills;
      state.skillTreeCursor.skillIdx = Math.min(state.skillTreeCursor.skillIdx, _newPathSkills2.length - 1);
      return;
    }
    if (justPressed(state, 'ArrowUp') || justPressed(state, 'w')) {
      state.skillTreeCursor.skillIdx = Math.max(0, state.skillTreeCursor.skillIdx - 1); return;
    }
    if (justPressed(state, 'ArrowDown') || justPressed(state, 's')) {
      state.skillTreeCursor.skillIdx = Math.min(_pathSkills.length - 1, state.skillTreeCursor.skillIdx + 1); return;
    }
    if (justPressed(state, ' ') || justPressed(state, 'z') || justPressed(state, 'Enter')) {
      const _skillId = _pathSkills[state.skillTreeCursor.skillIdx];
      const _learned = state.player.learnedSkills ?? [];
      const _sp = state.player.skillPoints ?? 0;
      if (canLearnSkill(_skillId, _learned, _sp)) {
        state.player.learnedSkills = [..._learned, _skillId];
        state.player.skillPoints = _sp - 1;
        state.skillLearnedFlash = _skillId;
        recomputeMaxHp(state);
        state.uiMessage = `Learned: ${SKILL_DEFS[_skillId].name}!`;
        state.uiMessageTimer = 140;
      }
      return;
    }
    return;
  }

  // ── ITEM CRAFT (Crafting Table) ────────────────────────────────────
  if (state.mode === GameMode.ITEM_CRAFT) {
    const CRAFT_CATS: Array<'material' | 'weapon' | 'armor' | 'trinket' | 'consumable'> =
      ['material', 'weapon', 'armor', 'trinket', 'consumable'];
    const catRecipes = RECIPES.filter(r => r.category === CRAFT_CATS[state.itemCraft.categoryIdx]);
    if (justPressed(state, 'Escape') || justPressed(state, 'x')) { state.mode = GameMode.OVERWORLD; return; }
    if (justPressed(state, 'ArrowLeft') || justPressed(state, 'a')) {
      state.itemCraft.categoryIdx = Math.max(0, state.itemCraft.categoryIdx - 1);
      state.itemCraft.cursorIndex = 0; return;
    }
    if (justPressed(state, 'ArrowRight') || justPressed(state, 'd')) {
      state.itemCraft.categoryIdx = Math.min(CRAFT_CATS.length - 1, state.itemCraft.categoryIdx + 1);
      state.itemCraft.cursorIndex = 0; return;
    }
    if (justPressed(state, 'ArrowUp') || justPressed(state, 'w')) {
      state.itemCraft.cursorIndex = Math.max(0, state.itemCraft.cursorIndex - 1); return;
    }
    if (justPressed(state, 'ArrowDown') || justPressed(state, 's')) {
      state.itemCraft.cursorIndex = Math.min(catRecipes.length - 1, state.itemCraft.cursorIndex + 1); return;
    }
    if (justPressed(state, ' ') || justPressed(state, 'z') || justPressed(state, 'Enter')) {
      const recipe = catRecipes[state.itemCraft.cursorIndex];
      if (!recipe) return;
      const canCraft = recipe.ingredients.every(ing => {
        const have = state.player.inventory.filter(id => id === ing.itemId).length;
        return have >= ing.count;
      });
      if (canCraft) {
        // Remove ingredients (iterate backwards to preserve indices)
        for (const ing of recipe.ingredients) {
          let rem = ing.count;
          for (let i = state.player.inventory.length - 1; i >= 0 && rem > 0; i--) {
            if (state.player.inventory[i] === ing.itemId) {
              removeInventoryItem(state, i);
              rem--;
            }
          }
        }
        // Add output items
        for (let i = 0; i < recipe.outputCount; i++) addInventoryItem(state, recipe.outputId);
        const outName = ITEMS[recipe.outputId]?.name ?? recipe.outputId;
        state.uiMessage = `Crafted: ${outName}!`;
        state.uiMessageTimer = 120;
        state.itemCraft.cursorIndex = Math.max(0, Math.min(state.itemCraft.cursorIndex, catRecipes.length - 2));
        // Achievement
        if (awardAchievement('ach_craft_item')) {
          state.messageStack.push({ text: '🏆 Achievement: Artisan', timer: 180 });
        }
      } else {
        state.uiMessage = 'Missing ingredients!';
        state.uiMessageTimer = 80;
      }
    }
    return;
  }

  // ── ACHIEVEMENTS (A key) ───────────────────────────────────────────
  if (state.mode === GameMode.ACHIEVEMENTS) {
    if (justPressed(state, 'Escape') || justPressed(state, 'x') || justPressed(state, 'a')) {
      state.mode = GameMode.OVERWORLD; return;
    }
    if (justPressed(state, 'ArrowUp')   || justPressed(state, 'w')) state.achievementsScroll = Math.max(0, state.achievementsScroll - 1);
    if (justPressed(state, 'ArrowDown') || justPressed(state, 's')) state.achievementsScroll++;
    return;
  }

  // ── OVERWORLD ─────────────────────────────────────────────────────
  if (justPressed(state, 'Escape')) { state.mode = GameMode.MENU; state.menuIndex = 0; return; }
  if (justPressed(state, 'i'))      { state.mode = GameMode.INVENTORY; state.inventoryIndex = 0; markInventorySeen(state); return; }
  if (justPressed(state, 'q'))      { state.mode = GameMode.QUEST_LOG; markQuestsSeen(state); return; }
  if (justPressed(state, 'n'))      { state.mode = GameMode.TELEPORT; state.teleportIndex = 0; return; }
  if (justPressed(state, 'm'))      { state.mode = GameMode.STAT_ALLOCATION; state.statAllocIndex = 0; return; }
  if (justPressed(state, 'b'))      { state.mode = GameMode.BESTIARY; state.bestiaryScroll = 0; return; }
  if (justPressed(state, 'k'))      { state.mode = GameMode.SKILL_TREE; return; }
  if (justPressed(state, 'a'))      { state.mode = GameMode.ACHIEVEMENTS; state.achievementsScroll = 0; return; }

  const map = MAPS[state.mapId];

  // smooth movement
  if (state.player.x !== state.player.targetX || state.player.y !== state.player.targetY) {
    const spd = 6;
    if (state.player.x < state.player.targetX) state.player.x = Math.min(state.player.targetX, state.player.x + spd);
    else if (state.player.x > state.player.targetX) state.player.x = Math.max(state.player.targetX, state.player.x - spd);
    if (state.player.y < state.player.targetY) state.player.y = Math.min(state.player.targetY, state.player.y + spd);
    else if (state.player.y > state.player.targetY) state.player.y = Math.max(state.player.targetY, state.player.y - spd);
    return;
  }

  if (state.pendingEncounter) {
    startBattle(state, state.pendingEncounter);
    state.pendingEncounter = null;
    return;
  }

  const tx = Math.floor(state.player.x / TILE_SIZE);
  const ty = Math.floor(state.player.y / TILE_SIZE);

  // detect adjacent interactables
  const visibleNpcs = map.npcs.filter((n: any) => !n.hideFlag || !state.player.flags[n.hideFlag]);
  let intFound: any = null;

  for (const npc of visibleNpcs) {
    if (Math.abs(npc.x - tx) + Math.abs(npc.y - ty) === 1) { intFound = { type: 'NPC', npc, x: npc.x, y: npc.y }; break; }
  }
  if (!intFound) {
    for (const chest of map.chests) {
      if (!state.player.flags[chest.flag] && Math.abs(chest.x - tx) + Math.abs(chest.y - ty) === 1) {
        intFound = { type: 'CHEST', chest, x: chest.x, y: chest.y }; break;
      }
    }
  }
  if (!intFound) {
    for (const door of (map.doors || [])) {
      if (Math.abs(door.x - tx) + Math.abs(door.y - ty) === 1) {
        intFound = { type: 'DOOR', door, x: door.x, y: door.y }; break;
      }
    }
  }

  // standing on exit tile?
  const curTile = map.layout[ty]?.[tx] ?? '';
  if (isExitTile(curTile)) {
    intFound = { type: 'EXIT', tile: curTile, x: tx, y: ty };
  }
  state.adjacentInteractable = intFound;

  // handle SPACE interactions
  if (intFound && (justPressed(state, ' ') || justPressed(state, 'z'))) {
    if (intFound.type === 'EXIT') {
      const exit = map.exits[intFound.tile];
      if (exit) {
        const missingItem = exit.reqItem && !state.player.inventory.includes(exit.reqItem);
        if (exit.locked || missingItem || (exit.reqQuest && state.player.quests[exit.reqQuest] < exit.reqState)) {
          state.uiMessage = exit.lockMsg; state.uiMessageTimer = 120;
        } else {
          state.mapId = exit.mapId;
          state.player.x = exit.x * TILE_SIZE; state.player.y = exit.y * TILE_SIZE;
          state.player.targetX = state.player.x; state.player.targetY = state.player.y;
          state.player.flags['discovered_' + exit.mapId] = true;
          state.adjacentInteractable = null;
        }
      }
    } else if (intFound.type === 'DOOR') {
      const door = intFound.door;
      const missingItem = door.reqItem && !state.player.inventory.includes(door.reqItem);
      if (door.locked || missingItem) {
        state.uiMessage = door.lockMsg ?? "The door is locked."; state.uiMessageTimer = 120;
      } else {
        state.mapId = door.targetMapId;
        state.player.x = door.targetX * TILE_SIZE; state.player.y = door.targetY * TILE_SIZE;
        state.player.targetX = state.player.x; state.player.targetY = state.player.y;
        state.player.flags['discovered_' + door.targetMapId] = true;
        state.adjacentInteractable = null;
      }
    } else if (intFound.type === 'NPC') {
      if (intFound.npc.type === 'SHOP') {
        state.mode = GameMode.SHOP; state.shopIndex = 0; state.shopNpcId = intFound.npc.id;
      } else if (intFound.npc.type === 'CRAFT') {
        // Open the Item Crafting Table UI
        state.itemCraft = { categoryIdx: 0, cursorIndex: 0 };
        state.mode = GameMode.ITEM_CRAFT;
      } else {
        state.dialogue.currentNode = getDialogueStartNode(state, intFound.npc.id);
        state.dialogue.charIndex = 0; state.dialogue.selectedOption = 0;
        state.mode = GameMode.DIALOGUE;
      }
    } else if (intFound.type === 'CHEST') {
      state.player.flags[intFound.chest.flag] = true;
      if (intFound.chest.item.startsWith('echoes_')) {
        const amt = parseInt(intFound.chest.item.split('_')[1]);
        state.player.echoes += amt;
        state.uiMessage = `Found ${amt} Echoes!`; state.uiMessageTimer = 120;
      } else {
        addInventoryItem(state, intFound.chest.item);
        state.uiMessage = `Found: ${ITEMS[intFound.chest.item]?.name ?? intFound.chest.item}!`; state.uiMessageTimer = 120;
      }
    }
  }

  // movement input
  if (!(intFound && (justPressed(state, ' ') || justPressed(state, 'z')))) {
    let dx = 0; let dy = 0;
    if (state.keys['ArrowUp']    || state.keys['w']) dy = -1;
    else if (state.keys['ArrowDown']  || state.keys['s']) dy = 1;
    else if (state.keys['ArrowLeft']  || state.keys['a']) dx = -1;
    else if (state.keys['ArrowRight'] || state.keys['d']) dx = 1;

    if (dx !== 0 || dy !== 0) {
      const ntx = tx + dx; const nty = ty + dy;
      if (ntx >= 0 && ntx < map.width && nty >= 0 && nty < map.height) {
        const tile = map.layout[nty][ntx];
        const npcBlocking = visibleNpcs.find((n: any) => n.x === ntx && n.y === nty);
        const impassable = tile === 'W' || tile === 'T' || tile === 'H' || tile === 'CW' || tile === 'CH' || npcBlocking;
        if (!impassable) {
          state.player.targetX = ntx * TILE_SIZE;
          state.player.targetY = nty * TILE_SIZE;
          if (tile === 'V') {
            // If the player has read the child's letter and the kid hasn't appeared yet,
            // force 100% encounter with The Kid on the very next Crestfall void tile.
            const kidPending = state.mapId === 'CT'
              && state.player.flags['read_childs_letter']
              && !state.player.flags['child_void_appeared'];
            if (kidPending) {
              state.player.flags['child_void_appeared'] = true;
              state.pendingEncounter = JSON.parse(JSON.stringify(ENEMIES['child_void_kid']));
            } else if (Math.random() < 0.15) {
              const pool = (map.encounterPool && map.encounterPool.length) ? map.encounterPool : ['wisp'];
              state.pendingEncounter = JSON.parse(JSON.stringify(ENEMIES[pool[Math.floor(Math.random() * pool.length)]]));
            }
          }
        }
      }
    }
  }
}

function startBattle(state: GameStateData, enemy: EnemyData) {
  const _sk = state.player.learnedSkills ?? [];
  state.mode = GameMode.BATTLE;
  state.battle = {
    enemy: JSON.parse(JSON.stringify(enemy)),
    phase: 'MENU', menuIndex: 0,
    soulX: 384, soulY: 420,
    projectiles: [], timer: 0,
    // chroma_morthus: start each battle with 1 Resonance
    resonance: _sk.includes('chroma_morthus') ? 1 : 0,
    actionMsg: null, minigame: null,
    // echo_legacy: start each battle with Void Ward active
    voidWard: _sk.includes('echo_legacy'),
    flags: {},
    poisonDmg: 0, poisonTurns: 0, burnDmg: 0,
  };
}
