import { GameStateData, GameMode, EnemyData, BattleState } from './types';
import { justPressed, addInventoryItem } from './engine';
import { ITEMS, getWeaponAtkBonus, getArmorDefBonus, getShieldBlockBonus, CITY_SIDE_QUESTS, pushMessages, grantXp } from './constants';

// Returns the enchantData of the enchanted book applied to the player's equipped weapon or armor.
function getEquippedEnchantData(state: GameStateData, slot: 'weapon' | 'armor') {
  const itemId = state.player.equipment[slot];
  if (!itemId) return null;
  const idx = state.player.inventory.indexOf(itemId);
  if (idx < 0) return null;
  const enchBookId = state.player.enchantedSlots[idx];
  if (!enchBookId) return null;
  return ITEMS[enchBookId]?.enchantData ?? null;
}

// Returns enchantData for the offhand weapon (dual-wield only; null if offhand is a shield or empty).
function getOffhandWeaponEnchantData(state: GameStateData) {
  const oh = state.player.equipment.offhand;
  if (!oh) return null;
  if (ITEMS[oh]?.category !== 'weapon') return null;
  const idx = state.player.inventory.indexOf(oh);
  if (idx < 0) return null;
  const enchBookId = state.player.enchantedSlots[idx];
  if (!enchBookId) return null;
  return ITEMS[enchBookId]?.enchantData ?? null;
}

// Checks whether resonance has reached the threshold to "remember" the enemy.
function tryCompleteRemember(state: GameStateData): boolean {
  const b = state.battle!;
  // chroma_veil: only 2 resonance needed
  const threshold = (state.player.learnedSkills ?? []).includes('chroma_veil') ? 2 : 3;
  if (b.resonance < threshold) return false;
  if (b.enemy.id === 'boss' && !state.player.flags['used_ancient_echo']) {
    b.actionMsg = "It rejects the resonance. You need a deeper memory.";
    b.resonance = 0;
    return false;
  }
  b.actionMsg = b.enemy.rememberText;
  b.phase = 'END'; b.endType = 'REMEMBERED';
  return true;
}

function getFleeFailMessage(enemy: EnemyData): string {
  const msgs: Record<string, string> = {
    wisp:           "The Shade Wisp darts around you, disorienting your senses. Flee failed.",
    crawler:        "The Void Crawler lunges at you as you turn to run! Flee failed.",
    specter:        "The Echo Specter screams — the sound roots you in place. Flee failed.",
    archivist:      "The Archivist files your escape route under 'Impossible'. Flee failed.",
    archive_wisp:   "The Archive Wisp wraps pages around your feet. Flee failed.",
    ink_wraith:     "Ink floods across the floor, slicking your escape. Flee failed.",
    frost_walker:   "The Frost Walker shoots a shard of ice at your legs. They freeze solid. Flee failed.",
    rime_hound:     "The Rime Hound bites at your heels and drags you back. Flee failed.",
    ash_hound:      "The Ash Hound cuts off your path with a wall of cinders. Flee failed.",
    cinder_wraith:  "The Cinder Wraith ignites the path behind you. Flee failed.",
    void_sentinel:  "The Void Sentinel steps into your path. There is no way around it. Flee failed.",
    city_shade:     "The City Shade slips ahead of you, blocking every turn. Flee failed.",
    street_wraith:  "The Street Wraith cuts off the alley. You can't get through. Flee failed.",
    hollow_guard:   "The Hollow Guard grabs your shoulder and hauls you back. Flee failed.",
    boss:           "The Memory Wraith tears through your thoughts. Your legs won't move. Flee failed.",
    echo_warden:    "The Echo Warden raises a wall of sound. You can't push through. Flee failed.",
    ring_boss:      "The Ringkeeper circles faster, boxing you in on all sides. Flee failed.",
    child_void_kid: "The Kid looks at you with hollow eyes — and somehow, you stay. Flee failed.",
  };
  return msgs[enemy.id] ?? `The ${enemy.name} cuts off your escape. Flee failed.`;
}

// Returns the resistance multiplier for an effect type against the current enemy.
// 0 = immune, 0.5 = resistant, 1 = normal, 2 = weak.
function getResistance(b: BattleState, effectType: string): number {
  return b.enemy.resistances?.[effectType] ?? 1;
}

// Apply all weapon enchant procs from a given enchantData to the enemy/battle state.
// Returns an array of proc message strings.
function applyWeaponProcs(
  state: GameStateData,
  enchData: NonNullable<ReturnType<typeof getEquippedEnchantData>>
): string[] {
  const b = state.battle!;
  const msgs: string[] = [];

  if (enchData.confuse) {
    const res = getResistance(b, 'confuse');
    if (res > 0) { b.flags.confused = true; msgs.push('Enemy confused!'); }
    else msgs.push('Enemy shrugged off confusion.');
  }
  if (enchData.weaken) {
    const res = getResistance(b, 'weaken');
    if (res > 0) {
      const amt = Math.max(1, Math.round(enchData.weaken * res));
      b.enemy.atk = Math.max(1, b.enemy.atk - amt);
      msgs.push(`ATK −${amt}.`);
    } else msgs.push('Enemy resisted weaken.');
  }
  if (enchData.drain) {
    const res = getResistance(b, 'drain');
    if (res > 0) {
      const rawDrain = Math.round(enchData.drain * res);
      const healed = Math.min(rawDrain, state.player.maxHp - state.player.hp);
      state.player.hp += healed;
      if (healed > 0) msgs.push(`Drained +${healed} HP.`);
    }
  }
  if (enchData.poison) {
    const res = getResistance(b, 'poison');
    if (res > 0) {
      const dmg = Math.max(1, Math.round(enchData.poison * res));
      b.poisonDmg = dmg; b.poisonTurns = 3;
      msgs.push(`Poisoned! (${dmg}/turn × 3)`);
    } else msgs.push('Enemy is immune to poison.');
  }
  if (enchData.burn) {
    const res = getResistance(b, 'burn');
    if (res > 0) {
      b.burnDmg = res >= 2 ? 4 : 2; // weakness starts burn higher
      msgs.push('Enemy ignites!');
    } else msgs.push('Enemy is immune to burn.');
  }
  if (enchData.freeze) {
    const res = getResistance(b, 'freeze');
    if (res > 0 && !b.flags.frozen) {
      b.flags.frozen = true;
      msgs.push('Enemy frozen!');
    } else if (res === 0) msgs.push('Enemy is immune to freeze.');
  }
  if (enchData.silence) {
    const res = getResistance(b, 'silence');
    if (res > 0 && !b.flags.silenced) {
      b.flags.silenced = true;
      msgs.push('Enemy silenced!');
    } else if (res === 0) msgs.push('Enemy resisted silence.');
  }

  return msgs;
}

export function handleBattleInput(state: GameStateData) {
  const b = state.battle!;
  if (b.phase === 'MENU') {
    if (justPressed(state, 'ArrowLeft') || justPressed(state, 'a')) b.menuIndex = Math.max(0, b.menuIndex - 1);
    if (justPressed(state, 'ArrowRight') || justPressed(state, 'd')) b.menuIndex = Math.min(4, b.menuIndex + 1);
    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      if (b.menuIndex === 0) {
        b.phase = 'MINIGAME'; b.minigame = { cursorX: 0, type: 'REMEMBER', mult: b.flags.spark ? 2 : 1 }; b.flags.spark = false;
      } else if (b.menuIndex === 1) {
        b.phase = 'MINIGAME'; b.minigame = { cursorX: 0, type: 'FORGET', mult: b.flags.spark ? 2 : 1 }; b.flags.spark = false;
      } else if (b.menuIndex === 2) {
        b.phase = 'ACT_MENU'; b.menuIndex = 0;
      } else if (b.menuIndex === 3) {
        state.mode = GameMode.INVENTORY;
      } else if (b.menuIndex === 4) {
        if (b.flags.fleeAttempted) return; // greyed out — only one flee attempt per battle
        // echo_surge: flee always succeeds
        const fleeSuccess = (state.player.learnedSkills ?? []).includes('echo_surge') ? true : Math.random() < 0.55;
        if (fleeSuccess) {
          b.actionMsg = "You fled the battle."; b.phase = 'END'; b.endType = 'FLED';
        } else {
          b.flags.fleeAttempted = true;
          b.actionMsg = getFleeFailMessage(b.enemy);
          b.phase = 'ACTION'; b.timer = 0;
        }
      }
    }
  } else if (b.phase === 'ACT_MENU') {
    if (justPressed(state, 'ArrowLeft') || justPressed(state, 'a')) b.menuIndex = Math.max(0, b.menuIndex - 1);
    if (justPressed(state, 'ArrowRight') || justPressed(state, 'd')) b.menuIndex = Math.min(b.enemy.acts.length - 1, b.menuIndex + 1);
    if (justPressed(state, 'x') || justPressed(state, 'Escape')) { b.phase = 'MENU'; b.menuIndex = 2; }
    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      const act = b.enemy.acts[b.menuIndex];
      if (act.magic && b.flags.silenced) {
        b.actionMsg = `The enemy is silenced — ${act.name} fails!`;
        b.flags.silenced = false;
        b.phase = 'ACTION'; b.timer = 0;
        return;
      }
      handleAct(state, act.id);
    }
  } else if (b.phase === 'MINIGAME') {
    b.timer++;
    // ── Cursor speed: chroma_touch (−25%), Resonant Prism hybrid (−50% further) ──
    const _skills = state.player.learnedSkills ?? [];
    let cursorSpeed = 0.1;
    if (b.minigame!.type === 'REMEMBER') {
      if (_skills.includes('chroma_touch')) cursorSpeed *= 0.75;
      const _cCount = _skills.filter(s => s.startsWith('chroma_')).length;
      const _eCount = _skills.filter(s => s.startsWith('echo_')).length;
      if (_cCount >= 2 && _eCount >= 2) cursorSpeed *= 0.5; // Resonant Prism
    }
    b.minigame!.cursorX = (Math.sin(b.timer * cursorSpeed) + 1) / 2;

    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      const dist = Math.abs(b.minigame!.cursorX - 0.5);
      let hitType = 'MISS';
      if (dist < 0.08) hitType = 'PERFECT';
      else if (dist < 0.2) hitType = 'GOOD';

      const mult = b.minigame!.mult;
      if (b.minigame!.type === 'REMEMBER') {
        if (hitType === 'PERFECT') {
          // chroma_morthus: PERFECT builds +2 resonance
          const resGain = _skills.includes('chroma_morthus') ? 2 : 1;
          b.resonance += resGain;
          b.actionMsg = resGain === 2 ? "Perfect Resonance! +2 (Morthus's Gift)" : "Perfect Resonance!";
          // Resonant Prism hybrid: PERFECT REMEMBER heals 3 HP
          const _cC2 = _skills.filter(s => s.startsWith('chroma_')).length;
          const _eC2 = _skills.filter(s => s.startsWith('echo_')).length;
          if (_cC2 >= 2 && _eC2 >= 2) {
            state.player.hp = Math.min(state.player.maxHp, state.player.hp + 3);
            b.actionMsg += ' +3 HP (Resonant Prism)';
          }
        } else if (hitType === 'GOOD') {
          // chroma_touch: GOOD hits also build resonance
          if (_skills.includes('chroma_touch')) {
            b.resonance += 1;
            b.actionMsg = "Good connection. +1 Resonance (Prismatic Touch)";
          } else {
            b.actionMsg = "Good connection.";
          }
        } else { b.actionMsg = "The memory slips away..."; }
        if (tryCompleteRemember(state)) return;
      } else {
        // ── FORGET: base power ───────────────────────────────────────
        let dmg = ((hitType === 'PERFECT' ? 10 : hitType === 'GOOD' ? 5 : 2) * mult) + getWeaponAtkBonus(state);
        // void_strike: +3 base power
        if (_skills.includes('void_strike')) dmg += 3;
        // void_rift: PERFECT hits ×1.5
        if (hitType === 'PERFECT' && _skills.includes('void_rift')) dmg = Math.floor(dmg * 1.5);
        // void_rift: +8 dmg vs enemies below 30% HP
        if (_skills.includes('void_rift') && b.enemy.hp < b.enemy.maxHp * 0.3) dmg += 8;
        // echo_nova: PERFECT bonus = resonance × 3 (doubled by Forge of Echoes hybrid)
        if (hitType === 'PERFECT' && _skills.includes('echo_nova')) {
          const _ecCount = _skills.filter(s => s.startsWith('echo_')).length;
          const _emCount = _skills.filter(s => s.startsWith('ember_')).length;
          const novaMult = (_ecCount >= 2 && _emCount >= 2) ? 2 : 1; // Forge of Echoes
          dmg += b.resonance * 3 * novaMult;
        }

        // ch_creed_emblem: bonus damage per chromatic skill learned (trinket must be equipped)
        if (hitType !== 'MISS') {
          const _equip = state.player.equipment as Record<string, string | null>;
          if (_equip['trinket'] === 'ch_creed_emblem') {
            const _chromaC = _skills.filter(s => s.startsWith('chroma_')).length;
            if (_chromaC > 0) dmg += _chromaC * 2;
          }
        }

        b.enemy.hp -= dmg;
        b.actionMsg = `Dealt ${dmg} damage.`;
        if (b.enemy.hp <= 0) { b.phase = 'END'; b.endType = 'DEFEATED'; return; }

        // ── Post-hit skill procs (PERFECT or GOOD only) ───────────────
        if (hitType !== 'MISS') {
          const procMsgs: string[] = [];
          // void_drain: PERFECT hits heal 4 HP (CD 3 turns)
          if (hitType === 'PERFECT' && _skills.includes('void_drain') && !b.skillCooldowns['void_drain']) {
            const healed = Math.min(4, state.player.maxHp - state.player.hp);
            if (healed > 0) { state.player.hp += healed; procMsgs.push(`Void Drain +${healed} HP.`); b.skillCooldowns['void_drain'] = 3; }
          }
          // void_strike: 20% silence on PERFECT (CD 3 turns)
          if (hitType === 'PERFECT' && _skills.includes('void_strike') && !b.flags.silenced && !b.skillCooldowns['void_strike'] && Math.random() < 0.20) {
            b.flags.silenced = true; procMsgs.push('Void silences enemy!'); b.skillCooldowns['void_strike'] = 3;
          }
          // Null Memory hybrid: PERFECT FORGET always silences (void ≥2 + echo ≥2)
          if (hitType === 'PERFECT' && !b.flags.silenced) {
            const _vC = _skills.filter(s => s.startsWith('void_')).length;
            const _eC = _skills.filter(s => s.startsWith('echo_')).length;
            if (_vC >= 2 && _eC >= 2) { b.flags.silenced = true; procMsgs.push('Null Memory silences!'); }
          }
          // void_herald: Weaken on every hit (CD 2 turns)
          if (_skills.includes('void_herald') && !b.skillCooldowns['void_herald']) {
            b.enemy.atk = Math.max(1, b.enemy.atk - 2); procMsgs.push('Void Weaken −2 ATK.'); b.skillCooldowns['void_herald'] = 2;
          }
          // chroma_strike: PERFECT hit applies random status (CD 3 turns)
          if (hitType === 'PERFECT' && _skills.includes('chroma_strike') && !b.skillCooldowns['chroma_strike']) {
            const _chromaC = _skills.filter(s => s.startsWith('chroma_')).length;
            const _emberC = _skills.filter(s => s.startsWith('ember_')).length;
            const statusPool: string[] = ['confuse', 'freeze', 'burn', 'weaken'];
            // Sunfire Spectrum: extra burn entry in pool
            if (_chromaC >= 2 && _emberC >= 2) statusPool.push('burn');
            const chosen = statusPool[Math.floor(Math.random() * statusPool.length)];
            if (chosen === 'confuse' && !b.flags.confused) {
              b.flags.confused = true; procMsgs.push('[Spectrum: Confused!]');
            } else if (chosen === 'freeze' && !b.flags.frozen) {
              b.flags.frozen = true; procMsgs.push('[Spectrum: Frozen!]');
            } else if (chosen === 'burn' && b.burnDmg === 0) {
              b.burnDmg = _skills.includes('ember_forge') ? 4 : 2;
              procMsgs.push('[Spectrum: Burning!]');
              // Sunfire Spectrum: burn grants +1 resonance
              if (_chromaC >= 2 && _emberC >= 2) { b.resonance = Math.min(3, b.resonance + 1); procMsgs.push('+1 Resonance!'); }
            } else if (chosen === 'weaken') {
              b.enemy.atk = Math.max(1, b.enemy.atk - 2); procMsgs.push('[Spectrum: −2 ATK!]');
            }
            // Prismatic Void hybrid: also apply weaken (void ≥2 + chroma ≥2)
            const _vC2 = _skills.filter(s => s.startsWith('void_')).length;
            if (_vC2 >= 2 && _chromaC >= 2) {
              b.enemy.atk = Math.max(1, b.enemy.atk - 2); procMsgs.push('[Prismatic Void: −2 ATK]');
            }
            b.skillCooldowns['chroma_strike'] = 3;
          }

          // ── Weapon enchant procs ────────────────────────────────────
          const wEnch = getEquippedEnchantData(state, 'weapon');
          if (wEnch) procMsgs.push(...applyWeaponProcs(state, wEnch));
          const ohEnch = getOffhandWeaponEnchantData(state);
          if (ohEnch) procMsgs.push(...applyWeaponProcs(state, ohEnch));
          if (procMsgs.length) b.actionMsg += ' ' + procMsgs.join(' ');
        }
      }
      b.phase = 'ACTION'; b.timer = 0;
    }
  } else if (b.phase === 'DODGE') {
    let sx = 0; let sy = 0;
    if (state.keys['ArrowUp'] || state.keys['w']) sy = -1;
    if (state.keys['ArrowDown'] || state.keys['s']) sy = 1;
    if (state.keys['ArrowLeft'] || state.keys['a']) sx = -1;
    if (state.keys['ArrowRight'] || state.keys['d']) sx = 1;
    b.soulX += sx * 4; b.soulY += sy * 4;
    b.soulX = Math.max(240, Math.min(528, b.soulX));
    b.soulY = Math.max(326, Math.min(514, b.soulY));
  } else if (b.phase === 'END') {
    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      endBattle(state);
    }
  }
}

export function updateBattlePhase(state: GameStateData) {
  const b = state.battle!;
  if (b.phase === 'ACTION') {
    b.timer++;
    if (b.timer > 60) {
      // ── Tick poison ───────────────────────────────────────────────
      if (b.poisonDmg > 0 && b.poisonTurns > 0) {
        // ember_shell: poison ticks for 2× damage per turn
        const poisonTickDmg = (state.player.learnedSkills ?? []).includes('ember_shell')
          ? b.poisonDmg * 2 : b.poisonDmg;
        b.enemy.hp = Math.max(0, b.enemy.hp - poisonTickDmg);
        b.poisonTurns--;
        const poisonNote = b.poisonTurns > 0
          ? `Poison deals ${poisonTickDmg} damage! (${b.poisonTurns} turns left)`
          : `Poison deals ${poisonTickDmg} damage! Poison fades.`;
        if (b.poisonTurns === 0) b.poisonDmg = 0;
        if (b.enemy.hp <= 0) { b.phase = 'END'; b.endType = 'DEFEATED'; b.actionMsg = poisonNote; return; }
        b.actionMsg = poisonNote;
        b.timer = -60; return;
      }
      // ── Tick burn ─────────────────────────────────────────────────
      if (b.burnDmg > 0) {
        b.enemy.hp = Math.max(0, b.enemy.hp - b.burnDmg);
        const burnNote = `Burning for ${b.burnDmg} damage!`;
        // ember_forge: cap raised from 32 to 64
        const burnCap = (state.player.learnedSkills ?? []).includes('ember_forge') ? 64 : 32;
        b.burnDmg = b.burnDmg >= burnCap ? 0 : b.burnDmg * 2; // double each turn, cap then clear
        if (b.enemy.hp <= 0) { b.phase = 'END'; b.endType = 'DEFEATED'; b.actionMsg = burnNote; return; }
        b.actionMsg = burnNote;
        b.timer = -60; return;
      }
      // ── Status-based turn skips ───────────────────────────────────
      if (b.flags.confused) {
        b.actionMsg = "The enemy is confused and skips its turn!";
        b.flags.confused = false;
        b.timer = -60;
      } else if (b.flags.frozen) {
        b.actionMsg = "The enemy is frozen solid — it can't move!";
        b.flags.frozen = false;
        b.timer = -60; // skip directly back to MENU without a DODGE phase
      } else {
        b.phase = 'DODGE'; b.timer = 300; b.projectiles = [];
        // ── Armor enchant: autoWard — once per battle ─────────────────
        if (!b.flags.autoWardUsed) {
          const aEnch = getEquippedEnchantData(state, 'armor');
          if (aEnch?.autoWard) { b.voidWard = true; b.flags.autoWardUsed = true; }
        }
      }
    }
    if (b.timer === 0 && b.phase === 'ACTION') {
      // Decrement passive cooldowns each player turn
      for (const k of Object.keys(b.skillCooldowns)) {
        if (b.skillCooldowns[k] > 0) b.skillCooldowns[k]--;
      }
      b.phase = 'MENU'; b.menuIndex = 0; b.actionMsg = null;
    }
  } else if (b.phase === 'DODGE') {
    b.timer--;
    spawnProjectiles(b);
    for (const p of b.projectiles) {
      p.x += p.vx; p.y += p.vy;
      if (p.wave) p.y = p.waveStartY! + Math.sin(p.x * 0.05) * 50;
      const dx = p.x - b.soulX; const dy = p.y - b.soulY;
      if (dx * dx + dy * dy < 100) {
        if (state.player.invincibility <= 0) {
          const _sk = state.player.learnedSkills ?? [];
          // Chromatic Veil: 15% chance to auto-dodge (CD 2 turns)
          if (_sk.includes('chroma_veil') && !b.skillCooldowns['chroma_veil'] && Math.random() < 0.15) {
            state.player.invincibility = 8; // brief grace period
            b.skillCooldowns['chroma_veil'] = 2;
          } else {
            // Echo Armor: 25% chance to fully block (CD 2 turns)
            if (_sk.includes('echo_armor') && !b.skillCooldowns['echo_armor'] && Math.random() < 0.25) {
              state.player.invincibility = 15;
              b.actionMsg = 'Memory Armor blocked the hit!'; b.skillCooldowns['echo_armor'] = 2;
            } else {
              const shieldBlock = getShieldBlockBonus(state);
              // void_herald: Void Ward blocks 100% (instead of 50%)
              const wardMult = b.voidWard ? (_sk.includes('void_herald') ? 0 : 0.5) : 1;
              let rawDmg = b.voidWard && _sk.includes('void_herald')
                ? 0
                : Math.max(1, Math.floor(b.enemy.atk * wardMult) - getArmorDefBonus(state));
              // echo_nova: take 1 less damage per hit
              if (_sk.includes('echo_nova')) rawDmg = Math.max(0, rawDmg - 1);
              const dmg = Math.max(0, rawDmg - shieldBlock);
              state.player.hp -= dmg;
              state.player.invincibility = 30;
              // ── Enemy status proc on hit ────────────────────────────
              if (p.proc === 'stun' && !b.flags.playerStunned && Math.random() < 0.40) {
                b.flags.playerStunned = true;
              }
              b.voidWard = false;
              // ── Armor enchant: thorn damage (ember_will: ×2) ────────
              const aEnch = getEquippedEnchantData(state, 'armor');
              if (aEnch?.thornDmg && dmg > 0) {
                const thornMult = _sk.includes('ember_will') ? 2 : 1;
                b.enemy.hp = Math.max(0, b.enemy.hp - aEnch.thornDmg * thornMult);
                if (b.enemy.hp <= 0) { b.phase = 'END'; b.endType = 'DEFEATED'; }
              }
            }
          }
        }
      }
    }
    // ── ember_phoenix: revive once per battle ────────────────────────
    if (state.player.hp <= 0) {
      const _sk2 = state.player.learnedSkills ?? [];
      if (_sk2.includes('ember_phoenix') && !b.flags.phoenixUsed) {
        b.flags.phoenixUsed = true;
        state.player.hp = Math.max(1, Math.floor(state.player.maxHp * 0.25));
        b.actionMsg = '🔥 Phoenix Ember! You rise from the ashes!';
      } else {
        state.battle = null; state.mode = GameMode.GAME_OVER;
      }
    }
    if (b.timer <= 0) {
      if (b.flags.playerStunned) {
        b.flags.playerStunned = false;
        b.actionMsg = "You are stunned! The enemy seizes the moment!";
        b.phase = 'ACTION'; b.timer = 0;
      } else {
        // Decrement passive cooldowns after each dodge phase (one full turn)
        for (const k of Object.keys(b.skillCooldowns)) {
          if (b.skillCooldowns[k] > 0) b.skillCooldowns[k]--;
        }
        b.phase = 'MENU'; b.menuIndex = 0; b.actionMsg = null;
      }
    }
  }
}

function handleAct(state: GameStateData, actId: string) {
  const b = state.battle!;
  const act = b.enemy.acts.find(a => a.id === actId);
  if (!act) return;

  if (act.id === 'name') {
    if (state.player.inventory.includes('stone')) { b.resonance = 3; tryCompleteRemember(state); }
    else { b.actionMsg = "You don't have a Naming Stone."; }
    if (b.phase !== 'END') { b.phase = 'ACTION'; b.timer = 0; }
    return;
  }
  if (act.id === 'present_echo') {
    if (state.player.inventory.includes('echo')) { state.player.flags['used_ancient_echo'] = true; b.actionMsg = "The Ancient Echo resonates! Its guard drops."; }
    else { b.actionMsg = "You have nothing of meaning to present."; }
    b.phase = 'ACTION'; b.timer = 0;
    return;
  }

  if (act.requiresItem && !state.player.inventory.includes(act.requiresItem)) {
    b.actionMsg = `You don't have the ${ITEMS[act.requiresItem]?.name ?? act.requiresItem}.`;
    b.phase = 'ACTION'; b.timer = 0;
    return;
  }

  switch (act.effect) {
    case 'weaken':
      b.enemy.atk = Math.max(1, b.enemy.atk - (act.power ?? 1));
      b.actionMsg = "Its attacks weaken slightly.";
      break;
    case 'confuse':
      b.flags.confused = true;
      b.actionMsg = "It pauses, confused.";
      break;
    case 'damage': {
      const dmg = (act.power ?? 5) + getWeaponAtkBonus(state);
      b.enemy.hp -= dmg;
      b.actionMsg = `Dealt ${dmg} dmg.`;
      if (b.enemy.hp <= 0) { b.phase = 'END'; b.endType = 'DEFEATED'; return; }
      break;
    }
    case 'resonance':
      b.resonance += (act.power ?? 1);
      b.actionMsg = `It feels slightly understood. Resonance +${act.power ?? 1}`;
      if (tryCompleteRemember(state)) return;
      break;
    case 'flavor':
    default:
      b.actionMsg = b.enemy.flavor;
      break;
  }
  if (b.phase !== 'END') { b.phase = 'ACTION'; b.timer = 0; }
}

function spawnProjectiles(b: BattleState) {
  const t = 300 - b.timer;
  const boxX = 384; const boxY = 420;

  if (b.enemy.id === 'wisp' && t % 25 === 0) {
    b.projectiles.push({ x: 234, y: boxY - 80 + Math.random() * 160, vx: 3, vy: 0, w: 10, h: 10, color: '#a855f7' });
  } else if (b.enemy.id === 'crawler' && t % 15 === 0) {
    const angle = t * 0.1;
    b.projectiles.push({ x: boxX, y: boxY, vx: Math.cos(angle) * 4, vy: Math.sin(angle) * 4, w: 16, h: 16, color: '#1f2937' });
  } else if (b.enemy.id === 'specter' && t % 40 === 0) {
    b.projectiles.push({ x: 234, y: boxY, vx: 4, vy: 0, w: 12, h: 12, color: '#38bdf8', wave: true, waveStartY: boxY });
  } else if (b.enemy.id === 'boss') {
    // Dense inward barrage from the arena edge — faster and more frequent
    if (t % 7 === 0) {
      const angle = Math.random() * Math.PI * 2;
      b.projectiles.push({ x: boxX + Math.cos(angle) * 150, y: boxY + Math.sin(angle) * 150, vx: -Math.cos(angle) * 5.5, vy: -Math.sin(angle) * 5.5, w: 14, h: 14, color: '#ef4444' });
    }
    // Fast soul-tracking beam — fires more often
    if (t % 38 === 0) b.projectiles.push({ x: 234, y: b.soulY, vx: 10, vy: 0, w: 22, h: 22, color: '#8b5cf6', proc: 'stun' });
    // Rotating 4-arm spiral burst
    if (t % 18 === 0) {
      for (let i = 0; i < 4; i++) {
        const a = (t * 0.18) + (i * Math.PI / 2);
        b.projectiles.push({ x: boxX, y: boxY, vx: Math.cos(a) * 4.5, vy: Math.sin(a) * 4.5, w: 11, h: 11, color: '#f97316' });
      }
    }
  } else if (b.enemy.id === 'archivist') {
    // Rapid horizontal ink spray across full arena height
    if (t % 8 === 0) {
      b.projectiles.push({ x: 234, y: boxY - 90 + Math.random() * 180, vx: 5.5, vy: 0, w: 13, h: 13, color: '#1e40af' });
    }
    // Aimed shot locked to soul position
    if (t % 28 === 0) b.projectiles.push({ x: 234, y: b.soulY, vx: 9, vy: 0, w: 20, h: 20, color: '#7c3aed', proc: 'stun' });
    // Pages falling from above
    if (t % 16 === 0) {
      b.projectiles.push({ x: boxX - 100 + Math.random() * 200, y: 310, vx: 0, vy: 5, w: 16, h: 10, color: '#93c5fd' });
    }
  } else if (b.enemy.id === 'echo_warden') {
    // Rotating tri-shot from arena centre
    if (t % 9 === 0) {
      const angle = t * 0.22;
      for (let i = 0; i < 3; i++) {
        const a = angle + (i * Math.PI * 2 / 3);
        b.projectiles.push({ x: boxX, y: boxY, vx: Math.cos(a) * 5.5, vy: Math.sin(a) * 5.5, w: 13, h: 13, color: '#10b981' });
      }
    }
    // Fast soul-tracking side shot
    if (t % 32 === 0) b.projectiles.push({ x: 234, y: b.soulY, vx: 9, vy: 0, w: 18, h: 18, color: '#34d399', proc: 'stun' });
  } else if (b.enemy.id === 'ring_boss') {
    // Fast wave volleys — lots of them
    if (t % 14 === 0) {
      const wy = boxY - 40 + Math.random() * 80;
      b.projectiles.push({ x: 234, y: wy, vx: 6.5, vy: 0, w: 14, h: 14, color: '#f59e0b', wave: true, waveStartY: wy });
    }
    // Inward ring burst
    if (t % 11 === 0) {
      const angle = t * 0.28;
      b.projectiles.push({ x: boxX + Math.cos(angle) * 130, y: boxY + Math.sin(angle) * 100, vx: -Math.cos(angle) * 5.5, vy: -Math.sin(angle) * 5.5, w: 15, h: 15, color: '#ef4444' });
    }
    // Slow massive soul-seeker
    if (t % 42 === 0) b.projectiles.push({ x: 234, y: b.soulY, vx: 8, vy: 0, w: 24, h: 24, color: '#dc2626', proc: 'stun' });
  } else if (b.enemy.id === 'hollow_guard') {
    // Faster falling columns, wider spread
    if (t % 10 === 0) {
      b.projectiles.push({ x: boxX - 80 + Math.random() * 160, y: 310, vx: 0, vy: 5.5, w: 16, h: 10, color: '#9ca3af' });
    }
    // Side shots to cut off escape lanes
    if (t % 22 === 0) {
      b.projectiles.push({ x: 234, y: boxY - 55 + Math.random() * 110, vx: 5, vy: 0, w: 13, h: 13, color: '#6b7280' });
    }
  } else if ((b.enemy.id === 'city_shade' || b.enemy.id === 'street_wraith') && t % 22 === 0) {
    b.projectiles.push({ x: 234, y: boxY - 70 + Math.random() * 140, vx: 3.5, vy: 0, w: 11, h: 11, color: b.enemy.color });
  } else if (t % 20 === 0) {
    b.projectiles.push({ x: 234, y: boxY - 60 + Math.random() * 120, vx: 3.5, vy: 0, w: 12, h: 12, color: b.enemy.color });
  }
}

function endBattle(state: GameStateData) {
  state.mode = GameMode.OVERWORLD;
  const b = state.battle!;
  if (b.endType === 'DEFEATED' || b.endType === 'REMEMBERED') {
    const _sk = state.player.learnedSkills ?? [];
    // ── Echoes multiplier: echo_legacy raises REMEMBERED bonus to 1.75, void_herald +20% all ──
    let echoesMult = 1;
    if (b.endType === 'REMEMBERED') echoesMult = _sk.includes('echo_legacy') ? 1.75 : 1.5;
    if (_sk.includes('void_herald')) echoesMult *= 1.2;
    const e = Math.floor(b.enemy.echoes * echoesMult);
    state.player.echoes += e;
    state.player.flags['defeated_' + b.enemy.id] = true;

    // ── Skill: void_drain — heal 6 HP on defeating (not Remembering) ──
    if (b.endType === 'DEFEATED' && _sk.includes('void_drain')) {
      const healed = Math.min(6, state.player.maxHp - state.player.hp);
      if (healed > 0) state.player.hp += healed;
    }
    // ── Skill: chroma_morthus — heal 15 HP on Remembering ─────────
    if (b.endType === 'REMEMBERED' && _sk.includes('chroma_morthus')) {
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 15);
    }
    // ── Hybrid: Ashen Void (void≥2 + ember≥2) — heal 5 HP if enemy was burning/poisoned ──
    const _vC = _sk.filter(s => s.startsWith('void_')).length;
    const _emC = _sk.filter(s => s.startsWith('ember_')).length;
    if (_vC >= 2 && _emC >= 2 && (b.poisonDmg > 0 || b.burnDmg > 0)) {
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 5);
    }

    // ── Bestiary: track encounter count ────────────────────────────
    state.player.bestiary[b.enemy.id] = (state.player.bestiary[b.enemy.id] ?? 0) + 1;

    // XP mirrors the Echoes reward — remembering an enemy (vs. just defeating it) pays out more of both.
    const levelsGained = grantXp(state, e);
    if (levelsGained > 0) {
      const spAvail = (state.player.skillPoints ?? 0) > 0 ? ` +1 Skill Point — press [K] for Skill Tree!` : '';
      pushMessages(state, [`Level Up! You are now level ${state.player.level}.`, `+${levelsGained * 2} stat points — press [M] to spend them.${spAvail}`]);
    }

    if (state.player.quests['quest_main'] === 1 && Math.random() < 0.35) {
      state.player.questProgress['shards'] = (state.player.questProgress['shards'] || 0) + 1;
      state.uiMessage = "Found a Memory Shard!"; state.uiMessageTimer = 120;
    }
    if (b.enemy.id === 'specter' && state.player.quests['quest_hollow'] === 1) {
      state.player.questProgress['specters'] = (state.player.questProgress['specters'] || 0) + 1;
      if (state.player.questProgress['specters'] >= 2) state.player.quests['quest_hollow'] = 2;
    }
    if (b.enemy.id === 'crawler' && b.endType === 'REMEMBERED' && state.player.quests['quest_name'] === 1) {
      state.player.quests['quest_name'] = 2; state.player.echoes += 50;
      state.uiMessage = "Quest Complete: Name for the Nameless!"; state.uiMessageTimer = 120;
    }
    if (b.enemy.id === 'ink_wraith' && state.player.quests['quest_archive'] === 1) {
      state.player.questProgress['archive_kills'] = (state.player.questProgress['archive_kills'] || 0) + 1;
    }
    if (b.enemy.id === 'frost_walker' && state.player.quests['quest_frost'] === 1) {
      state.player.questProgress['frost_kills'] = (state.player.questProgress['frost_kills'] || 0) + 1;
    }
    if (b.enemy.id === 'cinder_wraith' && state.player.quests['quest_ash'] === 1) {
      state.player.questProgress['ash_kills'] = (state.player.questProgress['ash_kills'] || 0) + 1;
    }
    if (b.enemy.id === 'archivist' && (state.player.quests['quest_main'] || 0) < 3) {
      state.player.quests['quest_main'] = 3;
      state.uiMessage = "The way north has opened."; state.uiMessageTimer = 160;
    }
    // Void Nexus boss — legendary weapon drops on defeat
    if (b.enemy.id === 'boss' && b.endType === 'DEFEATED' && !state.player.inventory.includes('voidglass_dagger')) {
      addInventoryItem(state, 'voidglass_dagger');
      addInventoryItem(state, 'voidsteel_mail');
      addInventoryItem(state, 'sovereign_edge');
      addInventoryItem(state, 'ench_iron_thorn');
      pushMessages(state, ['The Memory Wraith collapses. Its power crystallizes.', '+Voidglass Dagger', '+Voidsteel Mail', '+Sovereign Edge', '+Iron Thorn'], ITEMS['voidglass_dagger']?.tier);
    }
    // Named boss drops on defeat
    if (b.enemy.id === 'archivist' && b.endType === 'DEFEATED' && !state.player.inventory.includes('archivist_ward')) {
      addInventoryItem(state, 'archivist_ward');
      pushMessages(state, ['The Archivist dissolves into scattered pages.', "+Archivist's Ward"], ITEMS['archivist_ward']?.tier);
    }
    if (b.enemy.id === 'void_sentinel' && b.endType === 'DEFEATED' && !state.player.inventory.includes('twin_fangs')) {
      addInventoryItem(state, 'twin_fangs');
      addInventoryItem(state, 'nexus_shroud');
      pushMessages(state, ['The Void Sentinel shatters into dark glass.', '+Twin Fangs', '+Nexus Shroud'], ITEMS['twin_fangs']?.tier);
    }
    if (b.enemy.id === 'echo_warden' && b.endType === 'DEFEATED' && !state.player.inventory.includes('night_cleaver')) {
      addInventoryItem(state, 'night_cleaver');
      addInventoryItem(state, 'warden_aegis');
      pushMessages(state, ['The Echo Warden falls silent for good.', '+Night Cleaver', '+Warden Aegis'], ITEMS['night_cleaver']?.tier);
    }
    if (b.enemy.id === 'ring_boss' && b.endType === 'DEFEATED' && !state.player.inventory.includes('shadow_carapace')) {
      addInventoryItem(state, 'shadow_carapace');
      addInventoryItem(state, 'ench_void_scream');
      pushMessages(state, ['The Ringkeeper dissolves into ash rings.', '+Shadow Carapace', '+Void Scream'], ITEMS['shadow_carapace']?.tier);
    }
    if (b.enemy.id === 'child_void_kid' && b.endType === 'DEFEATED' && !state.player.inventory.includes('memory_edge')) {
      addInventoryItem(state, 'memory_edge');
      addInventoryItem(state, 'ench_lifestealer');
      pushMessages(state, ['The Kid fades like a half-remembered dream.', '+Memory Edge', '+Lifestealer'], ITEMS['memory_edge']?.tier);
    }
    if (b.enemy.id === 'boss' && b.endType === 'REMEMBERED') {
      state.player.quests['quest_main'] = 7;
      state.mode = GameMode.VICTORY;
    }
    // City clear quest
    if (['city_shade', 'street_wraith', 'hollow_guard'].includes(b.enemy.id) && state.player.quests['quest_city'] === 1) {
      state.player.questProgress['city_clears'] = (state.player.questProgress['city_clears'] || 0) + 1;
      if ((state.player.questProgress['city_clears'] || 0) >= 5) {
        state.player.quests['quest_city'] = 2;
        state.uiMessage = "The city grows quieter. Report to the Warden."; state.uiMessageTimer = 180;
      }
    }

    // Generic side-quest kill tracking — 10 quest-givers scattered through
    // Crestfall's misc buildings, all sharing this one loop (see CITY_SIDE_QUESTS).
    for (const sq of CITY_SIDE_QUESTS) {
      const qId = `quest_${sq.id}`;
      if (state.player.quests[qId] === 1 && sq.enemyPool.includes(b.enemy.id)) {
        const kKey = `sqkills_${sq.id}`;
        state.player.questProgress[kKey] = (state.player.questProgress[kKey] || 0) + 1;
        // Turn-in/reward happens back in dialogue.ts once the player reports to the NPC.
      }
    }

    // Echo Warden (secret dungeon mini-boss) — grants the empty book + mysterious note
    // that kick off the Ashfall Ring storyline. Guarded so it can't be farmed twice.
    if (b.enemy.id === 'echo_warden' && !state.player.inventory.includes('empty_book')) {
      addInventoryItem(state, 'empty_book');
      addInventoryItem(state, 'book_mysterious_note');
      pushMessages(state, ['The Echo Warden falls silent.', '+Empty Book', '+A Mysterious Note'], ITEMS['empty_book']?.tier);
    }

    // The Ringkeeper (Ashfall Ring boss) — grants the Tomes Blessing.
    if (b.enemy.id === 'ring_boss' && !state.player.inventory.includes('tomes_blessing')) {
      state.player.flags['ar_ring_boss_defeated'] = true;
      addInventoryItem(state, 'tomes_blessing');
      pushMessages(state, ['The Ringkeeper is remembered no more.', '+Tomes Blessing'], ITEMS['tomes_blessing']?.tier);
    }
  }
  state.lastBattleEndType = b.endType ?? null;
  state.battle = null;
}
