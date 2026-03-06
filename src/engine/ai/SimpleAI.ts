import { GameEngine } from '../GameEngine';
import { CardInstance } from '@/types/game';

export class SimpleAI {
  private engine: GameEngine;

  constructor(engine: GameEngine) {
    this.engine = engine;
  }

  makeMove(): void {
    const gameState = this.engine.getGameState();
    const currentPlayer = this.engine.getCurrentPlayer();
    
    // Determine phase and make appropriate moves
    switch (gameState.phase) {
      case 'main1':
      case 'main2':
        this.playCardsAndAbilities(currentPlayer);
        break;
      case 'battle':
        this.attackWithCreatures(currentPlayer, gameState);
        break;
      case 'end':
        // End the turn
        break;
      default:
        // Move to next phase
        this.engine.nextPhase();
        break;
    }
  }

  private playCardsAndAbilities(currentPlayer: any): void {
    // Priority: Areas > Spells > Creatures
    
    let energy = currentPlayer.energy;
    
    // Keep playing while we have energy and playable cards
    while (energy > 0) {
      const playableCards = currentPlayer.hand.filter((card: CardInstance) => 
        card.cost <= energy
      );

      if (playableCards.length === 0) break;

      // Priority: Areas > Spells > Creatures
      const areas = playableCards.filter((c: CardInstance) => c.type === 'area');
      const spells = playableCards.filter((c: CardInstance) => c.type === 'spell');
      const creatures = playableCards.filter((c: CardInstance) => c.type === 'creature');

      let cardToPlay: CardInstance | undefined;

      // Try to play area if we have one
      if (areas.length > 0) {
        cardToPlay = areas.sort((a: CardInstance, b: CardInstance) => b.cost - a.cost)[0];
      }
      // Try to play spell
      else if (spells.length > 0) {
        cardToPlay = spells.sort((a: CardInstance, b: CardInstance) => b.cost - a.cost)[0];
      }
      // Otherwise play creature
      else if (creatures.length > 0) {
        cardToPlay = creatures.sort((a: CardInstance, b: CardInstance) => b.cost - a.cost)[0];
      }

      if (!cardToPlay) break;

      // Play the card
      const success = this.engine.playCard(currentPlayer.id, cardToPlay.instanceId);
      if (success) {
        energy -= cardToPlay.cost;
      } else {
        // Can't play this card, try next one
        break;
      }
    }

    // Try to activate abilities on creatures on the field
    this.activateAbilities(currentPlayer);
  }

  private activateAbilities(currentPlayer: any): void {
    const field = currentPlayer.field || [];
    
    for (const card of field) {
      // Check if card has abilities and can use them
      if (card.abilities && card.abilities.length > 0) {
        // For now, simple activation - could be enhanced
        // AI would check costs, targets, etc.
      }
    }
  }

  private attackWithCreatures(currentPlayer: any, gameState: any): void {
    // Get all attackers
    const attackers = this.engine.getValidAttackers();
    const opponent = currentPlayer.id === gameState.players[0]?.id 
      ? gameState.players[1] 
      : gameState.players[0];
    const opponentField = opponent?.field || [];

    // Keep attacking while we have creatures that can attack
    for (const attacker of attackers) {
      // Check if this creature can attack
      if (!this.engine.canAttack(attacker.instanceId)) continue;

      // Check if attacker has already attacked this turn (has attacked flag)
      if (attacker.hasAttacked) continue;

      // Get valid blockers
      const blockers = this.engine.getValidBlockers();
      
      if (blockers.length > 0 && opponentField.length > 0) {
        // Find best blocker to attack (prioritize weak ones, ones that can be killed)
        const blocker = this.findBestBlockerTarget(blockers, attacker, opponentField);
        this.engine.resolveCombat(attacker.instanceId, blocker.instanceId);
      } else {
        // Direct attack to opponent
        this.engine.resolveCombat(attacker.instanceId);
      }
    }
  }

  private findBestBlockerTarget(blockers: any[], attacker: any, opponentField: any[]): any {
    // Priority: 
    // 1. Kill a weak creature (attack >= blocker health)
    // 2. Trade favorably (higher attack vs lower health)
    // 3. Attack the weakest
    
    // First, try to kill something
    for (const blocker of blockers) {
      const blockerHealth = blocker.currentHealth || blocker.defense;
      if (attacker.attack >= blockerHealth) {
        return blocker;
      }
    }

    // Then try to trade favorably
    for (const blocker of blockers) {
      const blockerHealth = blocker.currentHealth || blocker.defense;
      if (attacker.attack > blockerHealth / 2) {
        return blocker;
      }
    }

    // Otherwise attack weakest
    return blockers.sort((a: any, b: any) => 
      (a.currentHealth || a.defense) - (b.currentHealth || b.defense)
    )[0];
  }
}