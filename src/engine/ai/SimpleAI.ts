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
    
    // 1. Try to play cards from hand
    const playableCards = currentPlayer.hand.filter((card: CardInstance) => 
      card.cost <= currentPlayer.energy
    );

    if (playableCards.length > 0) {
      // Play the most expensive card first
      const cardToPlay = playableCards.sort((a: CardInstance, b: CardInstance) => b.cost - a.cost)[0];
      this.engine.playCard(currentPlayer.id, cardToPlay.id);
      return;
    }

    // 2. Try to attack with creatures on field
    const attackers = this.engine.getValidAttackers();
    if (attackers.length > 0) {
      const attacker = attackers[0];
      const blockers = this.engine.getValidBlockers();
      
      if (blockers.length > 0) {
        // Attack the weakest blocker
        const target = blockers.sort((a: CardInstance, b: CardInstance) => 
          (a.currentHealth || a.defense) - (b.currentHealth || b.defense)
        )[0];
        this.engine.resolveCombat(attacker.instanceId, target.instanceId);
      } else {
        // Direct attack
        this.engine.resolveCombat(attacker.instanceId);
      }
      return;
    }

    // 3. If no moves left, end phase
    this.engine.nextPhase();
  }
}