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
    const msg = `nextPhase: ${currentPhase} -> ${this.getNextPhaseName(currentPhase)}`;
    
    // Update page title to show phase
    document.title = msg;
    alert(msg);
    console.log(msg);
    
    // Determine next phase based on current phase and execute phase logic
    let nextPhase = currentPhase;
    
    switch (currentPhase) {
      case 'start':
        this.game.startPhase();
        nextPhase = 'draw';
        break;
      case 'draw':
        this.game.drawPhase();
        nextPhase = 'energy';
        break;
      case 'energy':
        this.game.energyPhase();
        nextPhase = 'main1';
        break;
      case 'main1':
        this.game.mainPhase1();
        nextPhase = 'battle';
        break;
      case 'battle':
        this.game.battlePhase();
        nextPhase = 'main2';
        break;
      case 'main2':
        this.game.mainPhase2();
        nextPhase = 'end';
        break;
      case 'end':
        this.game.endPhase();
        alert(`End Phase complete! Turn: ${this.game.getGameState().turn}, Phase: ${this.game.getPhase()}, Player: ${this.game.getCurrentPlayer()?.getName()}`);
        return;
    }
    
    this.game.setPhase(nextPhase);
    document.title = `Phase: ${nextPhase} | Energy: ${this.game.getCurrentPlayer()?.getEnergy()} | Hand: ${this.game.getCurrentPlayer()?.getHand().length}`;
    alert(`Phase set to: ${nextPhase}\nEnergy: ${this.game.getCurrentPlayer()?.getEnergy()}\nHand: ${this.game.getCurrentPlayer()?.getHand().length}`);
  }

  private getNextPhaseName(currentPhase: string): string {
    switch (currentPhase) {
      case 'start': return 'draw';
      case 'draw': return 'energy';
      case 'energy': return 'main1';
      case 'main1': return 'battle';
      case 'battle': return 'main2';
      case 'main2': return 'end';
      case 'end': return 'start (new turn)';
      default: return 'unknown';
    }
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