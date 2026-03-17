import { Effect, Action, TargetSelector, TargetCondition, CardInstance } from '@/types/game';
import { GameModel } from '../models/Game';
import { PlayerModel } from '../models/Player';
import { CardModel } from '../models/Card';


export type TriggerEventType = 'on_destroy' | 'on_hit';

export interface TriggerEventPayload {
  sourceCard: CardInstance;
  targetCard: CardInstance;
  owner: string;
  damageDealt: number;
  overflow: number;
}

export class EffectEngine {
  private game: GameModel;

  constructor(game: GameModel) {
    this.game = game;
  }

  resolveEffect(effect: Effect): boolean {
    try {
      // Check cost
      if (effect.cost && effect.cost > 0) {
        const currentPlayer = this.game.getCurrentPlayer();
        if (currentPlayer.getEnergy() < effect.cost) {
          return false;
        }
        currentPlayer.setEnergy(currentPlayer.getEnergy() - effect.cost);
      }

      // Resolve actions
      for (const action of effect.actions) {
        this.resolveAction(action);
      }

      return true;
    } catch (error) {
      console.error('Error resolving effect:', error);
      return false;
    }
  }

  private resolveAction(action: Action): void {
    const targets = this.selectTargets(action.target);
    
    for (const target of targets) {
      switch (action.type) {
        case 'deal_damage':
          this.dealDamage(target, action.value as number);
          break;
        case 'heal':
          this.heal(target, action.value as number);
          break;
        case 'buff_atk':
          this.buffAttack(target, action.value as number);
          break;
        case 'buff_def':
          this.buffDefense(target, action.value as number);
          break;
        case 'grant_status':
          this.grantStatus(target, action.value as string);
          break;
        case 'remove_status':
          this.removeStatus(target, action.value as string);
          break;
        case 'summon_token':
          this.summonToken(target, action.value as string);
          break;
        case 'draw_cards':
          this.drawCards(action.value as number);
          break;
        case 'gain_energy':
          this.gainEnergy(action.value as number);
          break;
        case 'lose_energy':
          this.loseEnergy(action.value as number);
          break;
        case 'switch_position':
          this.switchPosition(target);
          break;
        case 'move_card':
          this.moveCard(target, action.value as string);
          break;
        case 'destroy':
          this.destroyCard(target);
          break;
        case 'exile':
          this.exileCard(target);
          break;
        case 'return_to_hand':
          this.returnToHand(target);
          break;
        case 'copy_ability':
          this.copyAbility(target, action.value as string);
          break;
        case 'ignore_defense':
          this.ignoreDefense(target);
          break;
        case 'attack_again':
          this.attackAgain(target);
          break;
        case 'redirect_attack':
          this.redirectAttack(target, action.value as string);
          break;
        case 'mark_target':
          this.markTarget(target, action.value as string);
          break;
        case 'modify_targeting':
          this.modifyTargeting(target, action.value as string);
          break;
        case 'apply_aura':
          this.applyAura(target, action.value as string);
          break;
        case 'trigger_delayed_effect':
          this.triggerDelayedEffect(target, action.value as string);
          break;
        case 'set_duration':
          this.setDuration(target, action.value as number);
          break;
        case 'cleanse_negative_effects':
          this.cleanseNegativeEffects(target);
          break;
        case 'inspect_top_deck':
          this.inspectTopDeck(target);
          break;
        case 'rearrange_top_deck':
          this.rearrangeTopDeck(target, action.value as number);
          break;
        case 'lock_zone':
          this.lockZone(target, action.value as string);
          break;
        case 'link_damage':
          this.linkDamage(target, action.value as string);
          break;
        case 'split_damage':
          this.splitDamage(target, action.value as number);
          break;
        case 'transform_state':
          this.transformState(target, action.value as string);
          break;
        case 'adapt_on_hit':
          this.adaptOnHit(target, action.value as string);
          break;
      }
    }
  }

  private selectTargets(selector: TargetSelector): any[] {
    const targets: any[] = [];
    const currentPlayer = this.game.getCurrentPlayer();
    const opponent = this.game.getOpponent();

    switch (selector.zone) {
      case 'hand':
        targets.push(...currentPlayer.getHand());
        break;
      case 'field':
        targets.push(...currentPlayer.getField(), ...opponent.getField());
        break;
      case 'graveyard':
        targets.push(...currentPlayer.getGraveyard(), ...opponent.getGraveyard());
        break;
      case 'deck':
        targets.push(...currentPlayer.getDeck());
        break;
      case 'exile':
        targets.push(...currentPlayer.getExile(), ...opponent.getExile());
        break;
      case 'any':
        targets.push(
          ...currentPlayer.getHand(),
          ...currentPlayer.getField(),
          ...currentPlayer.getGraveyard(),
          ...currentPlayer.getExile(),
          ...opponent.getHand(),
          ...opponent.getField(),
          ...opponent.getGraveyard(),
          ...opponent.getExile()
        );
        break;
    }

    // Apply conditions
    return targets.filter(target => this.meetsConditions(target, selector.conditions))
      .slice(0, selector.count);
  }

  private meetsConditions(target: any, conditions: TargetCondition[]): boolean {
    for (const condition of conditions) {
      const targetValue = this.getFieldValue(target, condition.field);
      switch (condition.operator) {
        case 'equals':
          if (targetValue !== condition.value) return false;
          break;
        case 'greater_than':
          if (targetValue <= condition.value) return false;
          break;
        case 'less_than':
          if (targetValue >= condition.value) return false;
          break;
        case 'contains':
          if (!targetValue.includes(condition.value)) return false;
          break;
        case 'not_equals':
          if (targetValue === condition.value) return false;
          break;
      }
    }
    return true;
  }

  private getFieldValue(target: any, field: string): any {
    return target[field];
  }

  private dealDamage(target: any, damage: number): void {
    if (target.type === 'creature') {
      const currentHealth = target.currentHealth || target.defense;
      const newHealth = Math.max(0, currentHealth - damage);
      target.currentHealth = newHealth;
      
      this.game.addToBattleLog(`${target.name} took ${damage} damage, health: ${newHealth}`);
      
      if (newHealth <= 0) {
        this.destroyCard(target);
      }
    } else if (target.type === 'player') {
      target.setLife(target.getLife() - damage);
      this.game.addToBattleLog(`${target.getName()} took ${damage} damage`);
    }
  }

  private heal(target: any, amount: number): void {
    if (target.type === 'creature') {
      const maxHealth = target.health || target.defense;
      const currentHealth = target.currentHealth || target.defense;
      const newHealth = Math.min(maxHealth, currentHealth + amount);
      target.currentHealth = newHealth;
      this.game.addToBattleLog(`${target.name} healed for ${amount}, health: ${newHealth}`);
    } else if (target.type === 'player') {
      target.setLife(target.getLife() + amount);
      this.game.addToBattleLog(`${target.getName()} healed for ${amount}`);
    }
  }

  private buffAttack(target: any, amount: number): void {
    if (target.type === 'creature') {
      target.currentAttack = (target.currentAttack || 0) + amount;
      this.game.addToBattleLog(`${target.name} gained ${amount} attack`);
    }
  }

  private buffDefense(target: any, amount: number): void {
    if (target.type === 'creature') {
      target.currentDefense = (target.currentDefense || 0) + amount;
      target.currentHealth = (target.currentHealth || 0) + amount;
      this.game.addToBattleLog(`${target.name} gained ${amount} defense`);
    }
  }

  private grantStatus(target: any, status: string): void {
    if (!target.status) target.status = [];
    if (!target.status.includes(status)) {
      target.status.push(status);
      this.game.addToBattleLog(`${target.name} gained status: ${status}`);
    }
  }

  private removeStatus(target: any, status: string): void {
    if (target.status) {
      target.status = target.status.filter(s => s !== status);
      this.game.addToBattleLog(`${target.name} lost status: ${status}`);
    }
  }

  private summonToken(target: any, tokenType: string): void {
    // Implementation for token summoning
    this.game.addToBattleLog(`Token summoned: ${tokenType}`);
  }

  private drawCards(count: number): void {
    const currentPlayer = this.game.getCurrentPlayer();
    const drawn = currentPlayer.drawCards(count);
    this.game.addToBattleLog(`${currentPlayer.getName()} drew ${count} card(s)`);
  }

  private gainEnergy(amount: number): void {
    const currentPlayer = this.game.getCurrentPlayer();
    currentPlayer.setEnergy(currentPlayer.getEnergy() + amount);
    this.game.addToBattleLog(`${currentPlayer.getName()} gained ${amount} energy`);
  }

  private loseEnergy(amount: number): void {
    const currentPlayer = this.game.getCurrentPlayer();
    currentPlayer.setEnergy(currentPlayer.getEnergy() - amount);
    this.game.addToBattleLog(`${currentPlayer.getName()} lost ${amount} energy`);
  }

  private switchPosition(target: any): void {
    if (target.type === 'creature' && target.position) {
      target.position = target.position === 'front' ? 'back' : 'front';
      this.game.addToBattleLog(`${target.name} moved to ${target.position} row`);
    }
  }

  private moveCard(target: any, destination: string): void {
    // Implementation for card movement
    this.game.addToBattleLog(`${target.name} moved to ${destination}`);
  }

  private destroyCard(target: any): void {
    if (target.type === 'creature') {
      const player = this.game.getPlayers().find(p => 
        p.getCardByInstanceId(target.instanceId)
      );
      if (player) {
        player.moveToGraveyard(target.id);
        this.game.addToBattleLog(`${target.name} was destroyed`);
      }
    }
  }

  private exileCard(target: any): void {
    if (target.type === 'creature') {
      const player = this.game.getPlayers().find(p => 
        p.getCardByInstanceId(target.instanceId)
      );
      if (player) {
        player.moveToExile(target.id);
        this.game.addToBattleLog(`${target.name} was exiled`);
      }
    }
  }

  private returnToHand(target: any): void {
    if (target.type === 'creature') {
      const player = this.game.getPlayers().find(p => 
        p.getCardByInstanceId(target.instanceId)
      );
      if (player) {
        player.returnToHand(target.id);
        this.game.addToBattleLog(`${target.name} returned to hand`);
      }
    }
  }

  private copyAbility(target: any, ability: string): void {
    // Implementation for ability copying
    this.game.addToBattleLog(`${target.name} copied ability: ${ability}`);
  }

  private ignoreDefense(target: any): void {
    // Implementation for defense ignoring
    this.game.addToBattleLog(`${target.name} can ignore defense`);
  }

  private attackAgain(target: any): void {
    // Implementation for extra attacks
    this.game.addToBattleLog(`${target.name} can attack again`);
  }

  private redirectAttack(target: any, newTarget: string): void {
    // Implementation for attack redirection
    this.game.addToBattleLog(`Attack redirected to ${newTarget}`);
  }

  private markTarget(target: any, mark: string): void {
    // Implementation for target marking
    this.game.addToBattleLog(`${target.name} marked with: ${mark}`);
  }

  private modifyTargeting(target: any, modification: string): void {
    // Implementation for targeting modification
    this.game.addToBattleLog(`Targeting modified: ${modification}`);
  }

  private applyAura(target: any, aura: string): void {
    // Implementation for aura application
    this.game.addToBattleLog(`Aura applied: ${aura}`);
  }

  private triggerDelayedEffect(target: any, effect: string): void {
    // Implementation for delayed effects
    this.game.addToBattleLog(`Delayed effect triggered: ${effect}`);
  }

  private setDuration(target: any, turns: number): void {
    if (target.type === 'creature') {
      target.expiresAt = this.game.getTurn() + turns;
      this.game.addToBattleLog(`${target.name} effect duration set to ${turns} turns`);
    }
  }

  private cleanseNegativeEffects(target: any): void {
    if (target.type === 'creature') {
      const negativeStatuses = ['stun', 'silence', 'cannot_attack', 'cannot_move'];
      target.status = target.status.filter(status => 
        !negativeStatuses.includes(status)
      );
      this.game.addToBattleLog(`${target.name} cleansed of negative effects`);
    }
  }

  private inspectTopDeck(target: any): void {
    // Implementation for deck inspection
    this.game.addToBattleLog(`Top deck inspected`);
  }

  private rearrangeTopDeck(target: any, count: number): void {
    // Implementation for deck rearrangement
    this.game.addToBattleLog(`Top ${count} cards rearranged`);
  }

  private lockZone(target: any, zone: string): void {
    // Implementation for zone locking
    this.game.addToBattleLog(`Zone locked: ${zone}`);
  }

  private linkDamage(target: any, linkType: string): void {
    // Implementation for linked damage
    this.game.addToBattleLog(`Damage linked: ${linkType}`);
  }

  private splitDamage(target: any, splitCount: number): void {
    // Implementation for damage splitting
    this.game.addToBattleLog(`Damage split into ${splitCount} parts`);
  }

  private transformState(target: any, newState: string): void {
    // Implementation for state transformation
    this.game.addToBattleLog(`Transformed to state: ${newState}`);
  }

  private adaptOnHit(target: any, adaptation: string): void {
    // Implementation for on-hit adaptation
    this.game.addToBattleLog(`Adaptation on hit: ${adaptation}`);
  }

  resolveTriggerEvent(eventType: TriggerEventType, payload: TriggerEventPayload): void {
    const owners = this.game.getPlayers();

    owners.forEach(player => {
      player.getField().forEach(card => {
        const triggerEffects = card.triggerEffects || [];

        triggerEffects
          .filter(effect => effect.type === 'triggered' && effect.trigger === eventType)
          .forEach(effect => {
            this.game.addToBattleLog(
              `Trigger ${eventType} from ${card.name} (source: ${payload.sourceCard.name}, target: ${payload.targetCard.name}, damage: ${payload.damageDealt}, overflow: ${payload.overflow})`
            );
            this.resolveEffect(effect);
          });
      });
    });
  }
}
