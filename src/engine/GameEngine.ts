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
    alert('[GameEngine.createNewGame] START');
    console.log('[GameEngine.createNewGame] Creating new game...');
    
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
    console.log('[GameEngine.initializeDecks] START');
    alert('[GameEngine.initializeDecks] START');
    
    const players = this.game.getPlayers();
    const allCards = cardData as Card[];
    console.log('[GameEngine.initializeDecks] Card count:', allCards.length);
    alert('[GameEngine.initializeDecks] Card count: ' + allCards.length);

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
      
      console.log('[GameEngine.initializeDecks] Player', index, 'deck size before set:', deck.length);
      alert('[GameEngine.initializeDecks] Player ' + index + ' deck size before set: ' + deck.length);
      
      // Set the deck using the player's setDeck method
      player.setDeck(deck);
      player.shuffleDeck();
      // Draw opening hand of 5 cards
      player.drawCards(5);
      
      console.log('[GameEngine.initializeDecks] Player', index, 'deck size after draw:', player.getDeck().length);
      console.log('[GameEngine.initializeDecks] Player', index, 'hand size:', player.getHand().length);
      alert('[GameEngine.initializeDecks] Player ' + index + ' deck after draw: ' + player.getDeck().length + ', hand: ' + player.getHand().length);
    });
    
    console.log('[GameEngine.initializeDecks] END');
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
    const msg = `nextPhase: ${currentPhase} -> ${this.getNextPhaseName(currentPhase)}`;
    
    console.log('===== nextPhase() START =====');
    console.log('  Current phase:', currentPhase);
    
    // Determine next phase based on current phase and execute phase logic
    let nextPhase = currentPhase;
    
    // FIRST, call the phase method
    switch (currentPhase) {
      case 'start':
        console.log('  >> Calling startPhase()...');
        this.game.startPhase();
        nextPhase = 'draw';
        break;
      case 'draw':
        console.log('  >> Calling drawPhase()...');
        this.game.drawPhase();
        console.log('  >> drawPhase complete');
        nextPhase = 'energy';
        break;
      case 'energy':
        console.log('  >> Calling energyPhase()...');
        this.game.energyPhase();
        console.log('  >> energyPhase complete');
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
        console.log('End Phase complete! Turn:', this.game.getGameState().turn, 'Phase:', this.game.getPhase());
        return;
    }
    
    // Get FRESH player reference after phase logic
    const playerAfter = this.game.getCurrentPlayer();
    console.log('  Player energy AFTER phase logic:', playerAfter.getEnergy());
    console.log('  Player hand AFTER phase logic:', playerAfter.getHand().length);
    
    // THEN set the phase
    this.game.setPhase(nextPhase);
    
    // Update title with current state
    if (typeof document !== 'undefined') {
      const p = this.game.getCurrentPlayer();
      document.title = `Phase: ${nextPhase} | Energy: ${p.getEnergy()} | Hand: ${p.getHand().length}`;
    }
    
    console.log('  Phase set to:', nextPhase);
    console.log('===== nextPhase() END =====');
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