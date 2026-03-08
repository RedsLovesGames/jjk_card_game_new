import { GameModel } from './models/Game';
import { EffectEngine } from './effects/EffectEngine';
import { BattleResolver } from './BattleResolver';
import { GameState, Effect, Card } from '@/types/game';
import cardData from '../data/cards.json';

export class GameEngine {
  private game: GameModel;
  private effectEngine: EffectEngine;
  private battleResolver: BattleResolver;

  constructor(gameState: GameState) {
    this.game = new GameModel(gameState);
    this.effectEngine = new EffectEngine(this.game);
    this.battleResolver = new BattleResolver(this.game);
  }

  static createNewGame(player1Name: string, player2Name: string): GameEngine {
    const gameState: GameState = {
      id: this.generateGameId(),
      players: [
        {
          id: this.generatePlayerId(),
          name: player1Name,
          life: 2000,
          energy: 0,
          ultimateEnergy: 0,
          deck: [],
          hand: [],
          field: [],
          graveyard: [],
          exile: [],
          mulliganUsed: false
        },
        {
          id: this.generatePlayerId(),
          name: player2Name,
          life: 2000,
          energy: 0,
          ultimateEnergy: 0,
          deck: [],
          hand: [],
          field: [],
          graveyard: [],
          exile: [],
          mulliganUsed: false
        }
      ],
      currentPlayer: 0,
      turn: 1,
      phase: 'start',
      stack: [],
      battleLog: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const engine = new GameEngine(gameState);
    engine.initializeDecks();
    // Note: startGame() is NOT called here because initializeDecks() 
    // already sets up the decks and draws initial hands
    engine.getGameState().phase = 'start';
    engine.addToBattleLog('Game started! Players ready with 5 card hands.');
    return engine;
  }

  private initializeDecks(): void {
    const players = this.game.getPlayers();
    const allCards = cardData as Card[];

    players.forEach((player, index) => {
      // Create a basic deck of 40 cards by repeating the available cards
      const deck: any[] = [];
      for (let i = 0; i < 40; i++) {
        const cardTemplate = allCards[i % allCards.length];
        const instanceId = `card_${player.getId()}_${i}_${Math.random().toString(36).substr(2, 5)}`;
        
        deck.push({
          ...cardTemplate,
          id: cardTemplate.id,
          instanceId,
          ownerId: player.getId(),
          location: 'deck',
          currentAttack: cardTemplate.attack,
          currentDefense: cardTemplate.defense,
          currentHealth: cardTemplate.health || cardTemplate.defense,
          status: [],
          oncePerTurnUsed: false,
          oncePerGameUsed: false,
          position: 'front'
        });
      }
      
      // Set the deck using the player's setDeck method
      player.setDeck(deck);
      player.shuffleDeck();
      // Draw opening hand of 5 cards
      player.drawCards(5);
    });
  }

  static generateGameId(): string {
    return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static generatePlayerId(): string {
    return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  startGame(): void {
    this.game.startGame();
  }

  nextPhase(): void {
    const currentPhase = this.game.getPhase();
    const currentPlayer = this.game.getCurrentPlayer();
    console.log('=== GameEngine.nextPhase called ===');
    console.log('  currentPhase:', currentPhase);
    console.log('  currentPlayer:', currentPlayer?.getName(), '(id:', currentPlayer?.getId(), ')');
    console.log('  player energy before:', currentPlayer?.getEnergy());
    console.log('  player hand count before:', currentPlayer?.getHand().length);
    
    // Determine next phase based on current phase and execute phase logic
    let nextPhase = currentPhase;
    
    switch (currentPhase) {
      case 'start':
        // Execute start phase logic
        this.game.startPhase();
        nextPhase = 'draw';
        break;
      case 'draw':
        // Execute draw phase logic - draws a card
        this.game.drawPhase();
        nextPhase = 'energy';
        break;
      case 'energy':
        // Execute energy phase logic - grants energy
        this.game.energyPhase();
        nextPhase = 'main1';
        break;
      case 'main1':
        // Execute main phase 1 logic
        this.game.mainPhase1();
        nextPhase = 'battle';
        break;
      case 'battle':
        // Execute battle phase logic
        this.game.battlePhase();
        nextPhase = 'main2';
        break;
      case 'main2':
        // Execute main phase 2 logic
        this.game.mainPhase2();
        nextPhase = 'end';
        break;
      case 'end':
        // Execute end phase logic - resets oncePerTurnUsed and calls nextTurn()
        // Note: endPhase() already calls nextTurn() internally, which sets phase to 'start'
        this.game.endPhase();
        // The phase is already set to 'start' by endPhase() -> nextTurn(), so don't override it
        console.log('  After endPhase - turn:', this.game.getGameState().turn, 'phase:', this.game.getPhase(), 'player:', this.game.getCurrentPlayer()?.getName());
        return;
    }
    
    console.log('  Setting phase to:', nextPhase);
    this.game.setPhase(nextPhase);
    console.log('  After setPhase - phase:', this.game.getPhase(), 'energy:', this.game.getCurrentPlayer()?.getEnergy(), 'hand:', this.game.getCurrentPlayer()?.getHand().length);
  }

  playCard(playerId: string, cardId: string): boolean {
    return this.game.playCard(playerId, cardId);
  }

  useUltimate(playerId: string, cardId: string): boolean {
    return this.game.useUltimate(playerId, cardId);
  }

  switchPosition(playerId: string, cardId: string): boolean {
    return this.game.switchPosition(playerId, cardId);
  }

  resolveCombat(attackerInstanceId: string, defenderInstanceId?: string): any {
    const result = this.battleResolver.resolveCombat(attackerInstanceId, defenderInstanceId);
    this.game.checkWinConditions();
    return result;
  }

  canAttack(attackerInstanceId: string): boolean {
    return this.battleResolver.canAttack(attackerInstanceId);
  }

  canBlock(defenderInstanceId: string): boolean {
    return this.battleResolver.canBlock(defenderInstanceId);
  }

  getValidAttackers(): any[] {
    return this.battleResolver.getValidAttackers();
  }

  getValidBlockers(): any[] {
    return this.battleResolver.getValidBlockers();
  }

  resolveEffect(effect: Effect): boolean {
    return this.effectEngine.resolveEffect(effect);
  }

  getGameState(): GameState {
    return this.game.toJSON();
  }

  getCurrentPlayer(): any {
    return this.game.getCurrentPlayer();
  }

  getOpponent(): any {
    return this.game.getOpponent();
  }

  getBattleLog(): string[] {
    return this.game.getBattleLog();
  }

  addToBattleLog(message: string): void {
    this.game.addToBattleLog(message);
  }

  isGameOver(): boolean {
    return !!this.game.getWinner();
  }

  getWinner(): string | undefined {
    return this.game.getWinner();
  }
}