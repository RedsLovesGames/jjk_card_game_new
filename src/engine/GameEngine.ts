import { GameModel } from './models/Game';
import { EffectEngine } from './effects/EffectEngine';
import { BattleResolver } from './BattleResolver';
import { DataImporter } from '../data/importer';
import { GameState, Effect } from '@/types/game';

export class GameEngine {
  private game: GameModel;
  private effectEngine: EffectEngine;
  private battleResolver: BattleResolver;
  private dataImporter: DataImporter;

  constructor(gameState: GameState) {
    this.game = new GameModel(gameState);
    this.effectEngine = new EffectEngine(this.game);
    this.battleResolver = new BattleResolver(this.game);
    this.dataImporter = new DataImporter();
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

    return new GameEngine(gameState);
  }

  static generateGameId(): string {
    return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static generatePlayerId(): string {
    return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Game flow methods
  startGame(): void {
    this.game.startGame();
  }

  nextPhase(): void {
    switch (this.game.getPhase()) {
      case 'start':
        this.game.startPhase();
        break;
      case 'draw':
        this.game.drawPhase();
        break;
      case 'energy':
        this.game.energyPhase();
        break;
      case 'main1':
        this.game.mainPhase1();
        break;
      case 'battle':
        this.game.battlePhase();
        break;
      case 'main2':
        this.game.mainPhase2();
        break;
      case 'end':
        this.game.endPhase();
        break;
    }
  }

  // Card play methods
  playCard(playerId: string, cardId: string): boolean {
    return this.game.playCard(playerId, cardId);
  }

  useUltimate(playerId: string, cardId: string): boolean {
    return this.game.useUltimate(playerId, cardId);
  }

  // Position methods
  switchPosition(playerId: string, cardId: string): boolean {
    return this.game.switchPosition(playerId, cardId);
  }

  // Battle methods
  resolveCombat(attackerInstanceId: string, defenderInstanceId?: string): any {
    return this.battleResolver.resolveCombat(attackerInstanceId, defenderInstanceId);
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

  // Effect methods
  resolveEffect(effect: Effect): boolean {
    return this.effectEngine.resolveEffect(effect);
  }

  addToStack(effect: Effect): void {
    this.game.addToStack(effect);
  }

  // Data import methods
  importCardsFromCSV(): void {
    const cards = this.dataImporter.importFromCSV();
    // Store cards for deck building
    this.importedCards = cards;
  }

  getImportedCards(): any[] {
    return this.importedCards || [];
  }

  // Utility methods
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

  isGameOver(): boolean {
    return !!this.game.getWinner();
  }

  getWinner(): string | undefined {
    return this.game.getWinner();
  }

  // Private properties
  private importedCards: any[] = [];
}