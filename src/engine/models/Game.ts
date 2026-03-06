import { GameState, Player, CardInstance, Effect } from '@/types/game';
import { PlayerModel } from './Player';
import { CardModel } from './Card';

export class GameModel {
  private gameState: GameState;
  private players: PlayerModel[];

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.players = gameState.players.map(player => new PlayerModel(player));
  }

  getId(): string {
    return this.gameState.id;
  }

  getPlayers(): PlayerModel[] {
    return this.players;
  }

  getCurrentPlayer(): PlayerModel {
    return this.players[this.gameState.currentPlayer];
  }

  getOpponent(): PlayerModel {
    const opponentIndex = this.gameState.currentPlayer === 0 ? 1 : 0;
    return this.players[opponentIndex];
  }

  getTurn(): number {
    return this.gameState.turn;
  }

  getPhase(): string {
    return this.gameState.phase;
  }

  getStack(): Effect[] {
    return this.gameState.stack;
  }

  getBattleLog(): string[] {
    return this.gameState.battleLog;
  }

  getWinner(): string | undefined {
    return this.gameState.winner;
  }

  setPhase(phase: string): void {
    this.gameState.phase = phase;
  }

  nextTurn(): void {
    this.gameState.currentPlayer = this.gameState.currentPlayer === 0 ? 1 : 0;
    if (this.gameState.currentPlayer === 0) {
      this.gameState.turn++;
    }
    this.gameState.phase = 'start';
  }

  addToStack(effect: Effect): void {
    this.gameState.stack.push(effect);
  }

  popFromStack(): Effect | undefined {
    return this.gameState.stack.pop();
  }

  addToBattleLog(message: string): void {
    this.gameState.battleLog.push(message);
  }

  setWinner(winnerId: string): void {
    this.gameState.winner = winnerId;
  }

  checkWinConditions(): boolean {
    for (const player of this.players) {
      if (player.getLife() <= 0) {
        const winnerId = player.getId() === this.players[0].getId() ? 
          this.players[1].getId() : this.players[0].getId();
        this.setWinner(winnerId);
        return true;
      }
    }
    return false;
  }

  startGame(): void {
    // Initialize decks
    for (const player of this.players) {
      player.initializeDeck();
    }

    // Draw opening hands
    for (const player of this.players) {
      player.drawCards(5);
    }

    this.gameState.phase = 'start';
    this.addToBattleLog('Game started!');
  }

  startPhase(): void {
    this.addToBattleLog(`Turn ${this.gameState.turn} - Start Phase`);
    
    // Apply start of turn effects
    for (const player of this.players) {
      // Remove temporary effects
      player.getField().forEach(card => {
        // Remove expired effects
        if (card.expiresAt && card.expiresAt <= this.gameState.turn) {
          card.status = card.status.filter(status => !status.includes('temp'));
        }
      });
    }

    this.setPhase('draw');
  }

  drawPhase(): void {
    this.addToBattleLog(`Turn ${this.gameState.turn} - Draw Phase`);
    
    const currentPlayer = this.getCurrentPlayer();
    currentPlayer.drawCards(1);
    
    this.setPhase('energy');
  }

  energyPhase(): void {
    this.addToBattleLog(`Turn ${this.gameState.turn} - Energy Phase`);
    
    const currentPlayer = this.getCurrentPlayer();
    currentPlayer.setEnergy(currentPlayer.getEnergy() + 1);
    
    this.setPhase('main1');
  }

  mainPhase1(): void {
    this.addToBattleLog(`Turn ${this.gameState.turn} - Main Phase 1`);
    // Main phase actions will be handled by the effect system
    this.setPhase('battle');
  }

  battlePhase(): void {
    this.addToBattleLog(`Turn ${this.gameState.turn} - Battle Phase`);
    // Battle phase logic will be handled by the battle resolver
    this.setPhase('main2');
  }

  mainPhase2(): void {
    this.addToBattleLog(`Turn ${this.gameState.turn} - Main Phase 2`);
    // Main phase actions will be handled by the effect system
    this.setPhase('end');
  }

  endPhase(): void {
    this.addToBattleLog(`Turn ${this.gameState.turn} - End Phase`);
    
    // Apply end of turn effects
    for (const player of this.players) {
      // Reset once per turn abilities
      player.getField().forEach(card => {
        card.oncePerTurnUsed = false;
      });
    }

    // Check win conditions
    if (this.checkWinConditions()) {
      return;
    }

    this.nextTurn();
  }

  playCard(playerId: string, cardId: string): boolean {
    const player = this.players.find(p => p.getId() === playerId);
    if (!player) return false;

    // Use instanceId since UI passes the unique card instance ID
    const card = player.getCardByInstanceId(cardId);
    if (!card) return false;

    const cardModel = new CardModel(card);
    const cost = cardModel.getCost();

    if (player.getEnergy() < cost) {
      return false;
    }

    player.setEnergy(player.getEnergy() - cost);
    const playedCard = player.playCard(cardId);
    
    if (playedCard) {
      this.addToBattleLog(`${player.getName()} played ${playedCard.name}`);
      return true;
    }

    return false;
  }

  useUltimate(playerId: string, cardId: string): boolean {
    const player = this.players.find(p => p.getId() === playerId);
    if (!player) return false;

    const card = player.getCardById(cardId);
    if (!card) return false;

    const cardModel = new CardModel(card);
    const ultimateCost = cardModel.getUltimateCost();

    if (player.getUltimateEnergy() < ultimateCost) {
      return false;
    }

    if (card.oncePerGameUsed && cardModel.hasOncePerGame()) {
      return false;
    }

    player.setUltimateEnergy(player.getUltimateEnergy() - ultimateCost);
    card.oncePerGameUsed = true;
    
    this.addToBattleLog(`${player.getName()} used ultimate ability: ${card.name}`);
    return true;
  }

  switchPosition(playerId: string, cardId: string): boolean {
    const player = this.players.find(p => p.getId() === playerId);
    if (!player) return false;

    const card = player.getCardByInstanceId(cardId);
    if (!card || card.type !== 'creature') return false;

    if (card.position === 'front') {
      card.position = 'back';
    } else {
      card.position = 'front';
    }

    this.addToBattleLog(`${player.getName()} moved ${card.name} to ${card.position} row`);
    return true;
  }

  toJSON(): GameState {
    return {
      ...this.gameState,
      players: this.players.map(player => player.toJSON())
    };
  }
}