import { GameModel } from './models/Game';
import { PlayerModel } from './models/Player';
import { CardModel } from './models/Card';
import { BattleResult } from '@/types/game';
import { EffectEngine, TriggerEventPayload } from './effects/EffectEngine';

export class BattleResolver {
  private game: GameModel;
  private effectEngine: EffectEngine;

  constructor(game: GameModel, effectEngine: EffectEngine) {
    this.game = game;
    this.effectEngine = effectEngine;
  }

  resolveCombat(attackerInstanceId: string, defenderInstanceId?: string): BattleResult | null {
    const currentPlayer = this.game.getCurrentPlayer();
    const opponent = this.game.getOpponent();

    // Validate that we're in battle phase
    if (this.game.getPhase() !== 'battle') {
      this.game.addToBattleLog('Attacks can only be made during the battle phase');
      return null;
    }

    const attacker = currentPlayer.getCardByInstanceId(attackerInstanceId);
    if (!attacker || attacker.type !== 'creature') return null;

    // Check if attacker is in front row
    if (attacker.position !== 'front') {
      this.game.addToBattleLog(`${attacker.name} can only attack from the front row`);
      return null;
    }

    // Check if attacker can attack
    if (attacker.status?.includes('cannot_attack')) {
      this.game.addToBattleLog(`${attacker.name} cannot attack`);
      return null;
    }

    // Check if attacker has already attacked this turn
    if (attacker.oncePerTurnUsed) {
      this.game.addToBattleLog(`${attacker.name} has already attacked this turn`);
      return null;
    }

    let defender: any = null;
    if (defenderInstanceId) {
      defender = opponent.getCardByInstanceId(defenderInstanceId);
      if (!defender) {
        this.game.addToBattleLog('Attack target is invalid: defender was not found');
        return null;
      }

      if (defender.ownerId !== opponent.getId()) {
        this.game.addToBattleLog(`Attack target is invalid: ${defender.name} does not belong to the opponent`);
        return null;
      }

      if (defender.location !== 'field') {
        this.game.addToBattleLog(`Attack target is invalid: ${defender.name} is not on the field`);
        return null;
      }

      if (defender.type !== 'creature') {
        this.game.addToBattleLog(`Attack target is invalid: ${defender.name} is not a creature`);
        return null;
      }

      const opponentFrontRow = opponent.getFrontRowCreatures();
      const hasFrontRowBlocker = opponentFrontRow.some(creature => creature.instanceId !== defender.instanceId);
      if (defender.position === 'back' && hasFrontRowBlocker) {
        this.game.addToBattleLog(`Attack target is invalid: ${defender.name} cannot be targeted while a front-row creature is present`);
        return null;
      }
    } else {
      // Direct attack - check if opponent has any front-row creatures
      const opponentFrontRow = opponent.getFrontRowCreatures();
      if (opponentFrontRow.length > 0) {
        this.game.addToBattleLog(`Cannot attack directly - opponent has ${opponentFrontRow.length} front-row creature(s)`);
        return null;
      }
    }

    // Mark attacker as having attacked
    attacker.oncePerTurnUsed = true;

    if (defender) {
      // Creature vs creature combat
      return this.resolveCreatureCombat(attacker, defender);
    } else {
      // Direct attack
      return this.resolveDirectAttack(attacker);
    }
  }

  private resolveCreatureCombat(attacker: any, defender: any): BattleResult {
    const attackerModel = new CardModel(attacker);
    const defenderModel = new CardModel(defender);

    const attackPower = attacker.currentAttack ?? attackerModel.getAttack();
    const baseDefense = defender.currentDefense ?? defenderModel.getDefense();
    const effectiveHealth = defender.currentHealth ?? defenderModel.getHealth();

    // Check for ignore defense
    const hasIgnoreDefense = attacker.status?.includes('ignore_defense') || 
                            defender.status?.includes('ignore_defense');
    const effectiveDefense = hasIgnoreDefense ? 0 : baseDefense;

    // Check for linked damage
    const hasLinkedDamage = attacker.status?.includes('linked_damage');
    if (hasLinkedDamage) {
      // Apply linked damage logic
      this.game.addToBattleLog(`${attacker.name} deals linked damage`);
    }

    // DEF + HP model: DEF mitigates first, then remaining damage is applied to HP.
    const penetratingDamage = Math.max(0, attackPower - effectiveDefense);
    const damageDealt = Math.min(penetratingDamage, effectiveHealth);
    const remainingHealth = Math.max(0, effectiveHealth - penetratingDamage);
    const defenderDestroyed = remainingHealth <= 0;
    const overflowDamage = defenderDestroyed ? Math.max(0, penetratingDamage - effectiveHealth) : 0;

    defender.currentHealth = remainingHealth;

    if (penetratingDamage <= 0) {
      this.game.addToBattleLog(
        `${defender.name} blocks ${attacker.name} (ATK ${attackPower} vs DEF ${effectiveDefense}) - no break or overflow`
      );
    } else if (!defenderDestroyed) {
      this.game.addToBattleLog(
        `${defender.name} blocks ${attacker.name} and survives: ${damageDealt} damage, ${remainingHealth} HP left`
      );
    } else {
      const opponent = this.game.getOpponent();
      opponent.moveToGraveyard(defender.instanceId);
      this.game.addToBattleLog(`${defender.name} is destroyed by ${attacker.name}`);
      this.checkDeathTriggers({
        sourceCard: attacker,
        targetCard: defender,
        owner: opponent.getId(),
        damageDealt,
        overflow: overflowDamage,
      });
    }

    if (overflowDamage > 0) {
      const opponent = this.game.getOpponent();
      opponent.setLife(opponent.getLife() - overflowDamage);
      this.game.addToBattleLog(`Overflow damage to ${opponent.getName()}: ${overflowDamage}`);
    }

    // Check for on-hit triggers
    this.checkHitTriggers({
      sourceCard: attacker,
      targetCard: defender,
      owner: attacker.ownerId,
      damageDealt,
      overflow: overflowDamage,
    });

    return {
      attacker,
      defender,
      damageDealt,
      defenderDestroyed,
      overflowDamage
    };
  }

  private resolveDirectAttack(attacker: any): BattleResult {
    const attackerModel = new CardModel(attacker);
    const opponent = this.game.getOpponent();

    const damage = attacker.currentAttack ?? attackerModel.getAttack();
    opponent.setLife(opponent.getLife() - damage);

    this.game.addToBattleLog(`${attacker.name} attacks directly for ${damage} damage`);

    return {
      attacker,
      defender: null as any,
      damageDealt: damage,
      defenderDestroyed: false,
      overflowDamage: 0
    };
  }

  private checkDeathTriggers(payload: TriggerEventPayload): void {
    this.effectEngine.resolveTriggerEvent('on_destroy', payload);
  }

  private checkHitTriggers(payload: TriggerEventPayload): void {
    this.effectEngine.resolveTriggerEvent('on_hit', payload);
  }

  canAttack(attackerInstanceId: string): boolean {
    const currentPlayer = this.game.getCurrentPlayer();
    const opponent = this.game.getOpponent();
    
    // Must be in battle phase
    if (this.game.getPhase() !== 'battle') return false;
    
    const attacker = currentPlayer.getCardByInstanceId(attackerInstanceId);
    
    // Must be a creature
    if (!attacker || attacker.type !== 'creature') return false;
    // Must be in front row
    if (attacker.position !== 'front') return false;
    // Must not have cannot_attack status
    if (attacker.status?.includes('cannot_attack')) return false;
    // Must not have already attacked this turn
    if (attacker.oncePerTurnUsed) return false;
    
    return true;
  }

  canBlock(defenderInstanceId: string): boolean {
    const opponent = this.game.getOpponent();
    const defender = opponent.getCardByInstanceId(defenderInstanceId);
    
    if (!defender || defender.type !== 'creature') return false;
    if (defender.status?.includes('cannot_attack')) return false;
    if (defender.oncePerTurnUsed && defender.attack && defender.attack > 0) return false;
    
    return true;
  }

  getValidAttackers(): any[] {
    // Must be in battle phase
    if (this.game.getPhase() !== 'battle') return [];
    
    const currentPlayer = this.game.getCurrentPlayer();
    return currentPlayer.getCreatures().filter(creature => this.canAttack(creature.instanceId));
  }

  getValidBlockers(): any[] {
    const opponent = this.game.getOpponent();
    return opponent.getCreatures().filter(creature => this.canBlock(creature.instanceId));
  }
}
