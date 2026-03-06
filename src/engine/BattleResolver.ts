import { GameModel } from './models/Game';
import { PlayerModel } from './models/Player';
import { CardModel } from './models/Card';
import { BattleResult } from '@/types/game';

export class BattleResolver {
  private game: GameModel;

  constructor(game: GameModel) {
    this.game = game;
  }

  resolveCombat(attackerInstanceId: string, defenderInstanceId?: string): BattleResult | null {
    const currentPlayer = this.game.getCurrentPlayer();
    const opponent = this.game.getOpponent();

    const attacker = currentPlayer.getCardByInstanceId(attackerInstanceId);
    if (!attacker || attacker.type !== 'creature') return null;

    // Check if attacker can attack
    if (attacker.status?.includes('cannot_attack')) {
      this.game.addToBattleLog(`${attacker.name} cannot attack`);
      return null;
    }

    // Check if attacker has already attacked this turn
    if (attacker.oncePerTurnUsed && attacker.attack && attacker.attack > 0) {
      this.game.addToBattleLog(`${attacker.name} has already attacked this turn`);
      return null;
    }

    let defender: any = null;
    if (defenderInstanceId) {
      defender = opponent.getCardByInstanceId(defenderInstanceId);
      if (!defender || defender.type !== 'creature') return null;
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

    let attackerAttack = attacker.currentAttack || attackerModel.getAttack();
    let defenderDefense = defender.currentDefense || defenderModel.getDefense();

    // Check for ignore defense
    const hasIgnoreDefense = attacker.status?.includes('ignore_defense') || 
                            defender.status?.includes('ignore_defense');
    
    if (hasIgnoreDefense) {
      defenderDefense = 0;
    }

    // Check for linked damage
    const hasLinkedDamage = attacker.status?.includes('linked_damage');
    if (hasLinkedDamage) {
      // Apply linked damage logic
      this.game.addToBattleLog(`${attacker.name} deals linked damage`);
    }

    // Calculate damage
    const damageDealt = Math.max(0, attackerAttack - defenderDefense);
    let overflowDamage = 0;

    // Apply damage to defender
    if (defender.currentHealth !== undefined) {
      const newHealth = Math.max(0, defender.currentHealth - damageDealt);
      defender.currentHealth = newHealth;
      
      if (newHealth <= 0) {
        // Defender is destroyed
        this.game.addToBattleLog(`${defender.name} was destroyed in battle`);
        const opponent = this.game.getOpponent();
        opponent.moveToGraveyard(defender.id);
        
        // Check for on-death triggers
        this.checkDeathTriggers(defender);
      } else {
        this.game.addToBattleLog(`${defender.name} took ${damageDealt} damage, health: ${newHealth}`);
      }
    } else {
      // Defender destroyed
      this.game.addToBattleLog(`${defender.name} was destroyed in battle`);
      const opponent = this.game.getOpponent();
      opponent.moveToGraveyard(defender.id);
      
      // Check for on-death triggers
      this.checkDeathTriggers(defender);
    }

    // Check for damage overflow
    if (damageDealt > defenderDefense && defenderDefense > 0) {
      overflowDamage = damageDealt - defenderDefense;
      const opponent = this.game.getOpponent();
      opponent.setLife(opponent.getLife() - overflowDamage);
      this.game.addToBattleLog(`Overflow damage: ${overflowDamage} to ${opponent.getName()}`);
    }

    // Check for on-hit triggers
    this.checkHitTriggers(attacker, defender);

    return {
      attacker,
      defender,
      damageDealt,
      defenderDestroyed: defender.currentHealth === 0 || defender.currentHealth === undefined,
      overflowDamage
    };
  }

  private resolveDirectAttack(attacker: any): BattleResult {
    const attackerModel = new CardModel(attacker);
    const opponent = this.game.getOpponent();

    const damage = attacker.currentAttack || attackerModel.getAttack();
    opponent.setLife(opponent.getLife() - damage);

    this.game.addToBattleLog(`${attacker.name} attacks directly for ${damage} damage`);

    return {
      attacker,
      defender: opponent,
      damageDealt: damage,
      defenderDestroyed: false,
      overflowDamage: 0
    };
  }

  private checkDeathTriggers(defender: any): void {
    // Check for on-death effects and triggers
    // This would be implemented as part of the effect system
    this.game.addToBattleLog(`Checking death triggers for ${defender.name}`);
  }

  private checkHitTriggers(attacker: any, defender: any): void {
    // Check for on-hit effects and triggers
    // This would be implemented as part of the effect system
    this.game.addToBattleLog(`Checking hit triggers for ${attacker.name}`);
  }

  canAttack(attackerInstanceId: string): boolean {
    const currentPlayer = this.game.getCurrentPlayer();
    const attacker = currentPlayer.getCardByInstanceId(attackerInstanceId);
    
    if (!attacker || attacker.type !== 'creature') return false;
    if (attacker.status?.includes('cannot_attack')) return false;
    if (attacker.oncePerTurnUsed && attacker.attack && attacker.attack > 0) return false;
    
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
    const currentPlayer = this.game.getCurrentPlayer();
    return currentPlayer.getCreatures().filter(creature => this.canAttack(creature.instanceId));
  }

  getValidBlockers(): any[] {
    const opponent = this.game.getOpponent();
    return opponent.getCreatures().filter(creature => this.canBlock(creature.instanceId));
  }
}