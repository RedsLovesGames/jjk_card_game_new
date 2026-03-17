export interface Card {
  id: string;
  name: string;
  variant: string;
  type: 'creature' | 'area' | 'spell' | 'ultimate';
  subtype?: string;
  faction: string;
  cost: number;
  ultimateCost?: number;
  attack?: number;
  defense: number;
  health?: number;
  effect: string;
  ultimateEffect?: string;
  rarity: 'SSR' | 'SR' | 'R' | 'C';
  artUrl?: string;
  attribution?: string;
  sourceUrl?: string;
  status?: string[];
  position?: 'front' | 'back';
  tokenId?: string;
  expiresAt?: number;
  oncePerTurn?: boolean;
  oncePerGame?: boolean;
  summonRestrictions?: string[];
}

export interface Player {
  id: string;
  name: string;
  life: number;
  energy: number;
  ultimateEnergy: number;
  deck: Card[];
  hand: Card[];
  field: Card[];
  graveyard: Card[];
  exile: Card[];
  area?: Card;
  mulliganUsed: boolean;
}

export interface GameState {
  id: string;
  players: Player[];
  currentPlayer: number;
  turn: number;
  phase: 'start' | 'draw' | 'energy' | 'main1' | 'battle' | 'main2' | 'end';
  stack: Effect[];
  battleLog: string[];
  winner?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Effect {
  id: string;
  type: 'triggered' | 'activated' | 'passive' | 'continuous';
  category: 'damage' | 'heal' | 'buff' | 'debuff' | 'summon' | 'destroy' | 'move' | 'status';
  trigger?: 'on_play' | 'on_attack' | 'on_damage' | 'on_destroy' | 'on_hit' | 'start_turn' | 'end_turn' | 'on_summon';
  cost?: number;
  target: TargetSelector;
  actions: Action[];
  duration?: number;
  oncePerTurn?: boolean;
  oncePerGame?: boolean;
  sourceCard?: string;
  sourcePlayer?: string;
}

export interface TargetSelector {
  type: 'creature' | 'player' | 'card' | 'field' | 'hand';
  conditions: TargetCondition[];
  zone: 'hand' | 'field' | 'graveyard' | 'deck' | 'any' | 'exile';
  count: number;
  position?: 'front' | 'back' | 'any';
}

export interface TargetCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_equals';
  value: string | number;
}

export interface Action {
  type: 'deal_damage' | 'heal' | 'buff_atk' | 'buff_def' | 'grant_status' | 'remove_status' | 'summon_token' | 'draw_cards' | 'gain_energy' | 'lose_energy' | 'switch_position' | 'move_card' | 'destroy' | 'exile' | 'return_to_hand' | 'copy_ability' | 'ignore_defense' | 'attack_again' | 'redirect_attack' | 'mark_target' | 'modify_targeting' | 'apply_aura' | 'trigger_delayed_effect' | 'set_duration' | 'cleanse_negative_effects' | 'inspect_top_deck' | 'rearrange_top_deck' | 'lock_zone' | 'link_damage' | 'split_damage' | 'transform_state' | 'adapt_on_hit';
  value: number | string;
  target: TargetSelector;
}

export interface CardInstance extends Card {
  id: string;
  instanceId: string;
  ownerId: string;
  location: 'deck' | 'hand' | 'field' | 'graveyard' | 'exile';
  position?: 'front' | 'back';
  currentAttack?: number;
  currentDefense?: number;
  currentHealth?: number;
  status: string[];
  tokenId?: string;
  expiresAt?: number;
  oncePerTurnUsed?: boolean;
  oncePerGameUsed?: boolean;
  triggerEffects?: Effect[];
}

export interface BattleResult {
  attacker: CardInstance;
  defender: CardInstance;
  damageDealt: number;
  defenderDestroyed: boolean;
  overflowDamage: number;
}

export interface Deck {
  id: string;
  name: string;
  playerId: string;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CardLibrary {
  cards: Card[];
  total: number;
  categories: {
    byType: Record<string, Card[]>;
    byFaction: Record<string, Card[]>;
    byRarity: Record<string, Card[]>;
  };
}
