import { Player, CardInstance } from '@/types/game';
import { CardModel } from './Card';

export class PlayerModel {
  private player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  getId(): string {
    return this.player.id;
  }

  getName(): string {
    return this.player.name;
  }

  getLife(): number {
    return this.player.life;
  }

  setLife(life: number): void {
    this.player.life = Math.max(0, life);
  }

  getEnergy(): number {
    return this.player.energy;
  }

  setEnergy(energy: number): void {
    console.log('        [PlayerModel.setEnergy] Setting energy to:', energy, '(was:', this.player.energy, ')');
    this.player.energy = Math.max(0, Math.min(10, energy));
    console.log('        [PlayerModel.setEnergy] Energy is now:', this.player.energy);
  }

  getUltimateEnergy(): number {
    return this.player.ultimateEnergy;
  }

  setUltimateEnergy(energy: number): void {
    this.player.ultimateEnergy = Math.max(0, energy);
  }

  getDeck(): CardInstance[] {
    console.log('        [PlayerModel.getDeck] Deck length:', this.player.deck.length);
    console.log('        [PlayerModel.getDeck] Deck:', JSON.stringify(this.player.deck.map(c => c.name)));
    return this.player.deck;
  }

  getHand(): CardInstance[] {
    return this.player.hand;
  }

  getField(): CardInstance[] {
    return this.player.field;
  }

  getGraveyard(): CardInstance[] {
    return this.player.graveyard;
  }

  getExile(): CardInstance[] {
    return this.player.exile;
  }

  getArea(): CardInstance | undefined {
    return this.player.area;
  }

  hasMulligan(): boolean {
    return !this.player.mulliganUsed;
  }

  useMulligan(): void {
    this.player.mulliganUsed = true;
  }

  setDeck(deck: CardInstance[]): void {
    this.player.deck = deck;
  }

  drawCards(count: number): CardInstance[] {
    console.log('      [PlayerModel.drawCards] START, count:', count);
    console.log('      [PlayerModel.drawCards] Deck length:', this.player.deck.length);
    
    const drawn: CardInstance[] = [];
    
    for (let i = 0; i < count && this.player.deck.length > 0; i++) {
      const card = this.player.deck.pop()!;
      card.location = 'hand';
      this.player.hand.push(card);
      console.log('      [PlayerModel.drawCards] Drew card:', card.name, card.instanceId);
      drawn.push(card);
    }
    
    console.log('      [PlayerModel.drawCards] Hand length after:', this.player.hand.length);
    console.log('      [PlayerModel.drawCards] END');
    return drawn;
  }

  playCard(cardId: string): CardInstance | null {
    // Use instanceId for matching since that's what the UI passes
    const cardIndex = this.player.hand.findIndex(card => card.instanceId === cardId);
    if (cardIndex === -1) return null;

    const card = this.player.hand.splice(cardIndex, 1)[0];
    card.location = 'field';
    this.player.field.push(card);
    
    return card;
  }

  discardCard(cardId: string): CardInstance | null {
    const cardIndex = this.player.hand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return null;

    const card = this.player.hand.splice(cardIndex, 1)[0];
    card.location = 'graveyard';
    this.player.graveyard.push(card);
    
    return card;
  }

  destroyCard(instanceId: string): CardInstance | null {
    // Use instanceId to identify the specific card instance on the field
    const fieldIndex = this.player.field.findIndex(card => card.instanceId === instanceId);
    if (fieldIndex === -1) return null;

    const card = this.player.field.splice(fieldIndex, 1)[0];
    card.location = 'graveyard';
    this.player.graveyard.push(card);
    
    return card;
  }

  moveToGraveyard(instanceId: string): CardInstance | null {
    // Use instanceId to identify the specific card instance on the field
    const fieldIndex = this.player.field.findIndex(card => card.instanceId === instanceId);
    if (fieldIndex === -1) return null;

    const card = this.player.field.splice(fieldIndex, 1)[0];
    card.location = 'graveyard';
    this.player.graveyard.push(card);
    
    return card;
  }

  moveToExile(instanceId: string): CardInstance | null {
    // Use instanceId to identify the specific card instance on the field
    const fieldIndex = this.player.field.findIndex(card => card.instanceId === instanceId);
    if (fieldIndex === -1) return null;

    const card = this.player.field.splice(fieldIndex, 1)[0];
    card.location = 'exile';
    this.player.exile.push(card);
    
    return card;
  }

  returnToHand(instanceId: string): CardInstance | null {
    // Use instanceId to identify the specific card instance on the field
    const fieldIndex = this.player.field.findIndex(card => card.instanceId === instanceId);
    if (fieldIndex === -1) return null;

    const card = this.player.field.splice(fieldIndex, 1)[0];
    card.location = 'hand';
    this.player.hand.push(card);
    
    return card;
  }

  getCreatures(): CardInstance[] {
    return this.player.field.filter(card => card.type === 'creature');
  }

  getFrontRowCreatures(): CardInstance[] {
    return this.player.field.filter(card => 
      card.type === 'creature' && card.position === 'front'
    );
  }

  getBackRowCreatures(): CardInstance[] {
    return this.player.field.filter(card => 
      card.type === 'creature' && card.position === 'back'
    );
  }

  getCardById(cardId: string): CardInstance | null {
    const allCards = [
      ...this.player.hand,
      ...this.player.field,
      ...this.player.graveyard,
      ...this.player.exile,
      ...(this.player.area ? [this.player.area] : [])
    ];
    
    return allCards.find(card => card.id === cardId) || null;
  }

  getCardByInstanceId(instanceId: string): CardInstance | null {
    const allCards = [
      ...this.player.hand,
      ...this.player.field,
      ...this.player.graveyard,
      ...this.player.exile,
      ...(this.player.area ? [this.player.area] : [])
    ];
    
    return allCards.find(card => card.instanceId === instanceId) || null;
  }

  shuffleDeck(): void {
    for (let i = this.player.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.player.deck[i], this.player.deck[j]] = [this.player.deck[j], this.player.deck[i]];
    }
  }

  initializeDeck(): void {
    this.shuffleDeck();
  }

  takeMulligan(): CardInstance[] {
    if (!this.hasMulligan()) return [];
    
    const returnedCards = [...this.player.hand];
    this.player.hand = [];
    this.player.deck.push(...returnedCards);
    this.shuffleDeck();
    this.useMulligan();
    
    return this.drawCards(5);
  }

  toJSON(): Player {
    return { ...this.player };
  }
}