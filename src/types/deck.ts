import { Card } from '@/types/game';

export interface SavedDeck {
  name: string;
  cards: Card[];
  createdAt: number;
}

export const MIN_DECK_SIZE = 40;
export const MAX_DECK_SIZE = 60;
