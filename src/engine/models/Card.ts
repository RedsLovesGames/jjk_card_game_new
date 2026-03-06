import { Card, CardInstance } from '@/types/game';

export class CardModel {
  private card: Card;

  constructor(card: Card) {
    this.card = card;
  }

  toInstance(ownerId: string, instanceId: string): CardInstance {
    return {
      ...this.card,
      id: this.card.id,
      instanceId,
      ownerId,
      location: 'deck',
      position: undefined,
      currentAttack: this.card.attack,
      currentDefense: this.card.defense,
      currentHealth: this.card.health || this.card.defense,
      status: [],
      oncePerTurnUsed: false,
      oncePerGameUsed: false,
    };
  }

  getCost(): number {
    return this.card.cost;
  }

  getUltimateCost(): number {
    return this.card.ultimateCost || 0;
  }

  getAttack(): number {
    return this.card.attack || 0;
  }

  getDefense(): number {
    return this.card.defense;
  }

  getHealth(): number {
    return this.card.health || this.card.defense;
  }

  getName(): string {
    return this.card.name;
  }

  getVariant(): string {
    return this.card.variant;
  }

  getType(): string {
    return this.card.type;
  }

  getFaction(): string {
    return this.card.faction;
  }

  getRarity(): string {
    return this.card.rarity;
  }

  getEffect(): string {
    return this.card.effect;
  }

  getUltimateEffect(): string {
    return this.card.ultimateEffect || '';
  }

  hasEffect(): boolean {
    return !!this.card.effect && this.card.effect.trim() !== '';
  }

  hasUltimate(): boolean {
    return !!this.card.ultimateEffect && this.card.ultimateEffect.trim() !== '';
  }

  isCreature(): boolean {
    return this.card.type === 'creature';
  }

  isArea(): boolean {
    return this.card.type === 'area';
  }

  isSpell(): boolean {
    return this.card.type === 'spell';
  }

  isUltimate(): boolean {
    return this.card.type === 'ultimate';
  }

  canAttack(): boolean {
    return this.isCreature() && this.card.attack && this.card.attack > 0;
  }

  hasOncePerTurn(): boolean {
    return this.card.oncePerTurn || false;
  }

  hasOncePerGame(): boolean {
    return this.card.oncePerGame || false;
  }

  getSummonRestrictions(): string[] {
    return this.card.summonRestrictions || [];
  }

  getArtUrl(): string {
    return this.card.artUrl || '';
  }

  getAttribution(): string {
    return this.card.attribution || '';
  }

  getSourceUrl(): string {
    return this.card.sourceUrl || '';
  }
}