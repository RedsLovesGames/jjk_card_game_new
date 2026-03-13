import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Card } from '@/types/game';
import { MAX_DECK_SIZE, MIN_DECK_SIZE, SavedDeck } from '@/types/deck';

const STORAGE_KEYS = {
  decks: 'jjk_saved_decks',
  draft: 'jjk_draft_deck',
  activeDeck: 'jjk_active_deck_name',
} as const;

interface DeckContextValue {
  draftDeck: Card[];
  savedDecks: SavedDeck[];
  activeDeckName: string | null;
  activeDeck: SavedDeck | null;
  addCardToDraft: (card: Card) => boolean;
  removeCardFromDraft: (index: number) => void;
  clearDraftDeck: () => void;
  saveDraftDeck: (name: string) => { ok: boolean; message: string };
  setActiveDeckName: (name: string | null) => void;
  isDeckValid: (cards: Card[]) => boolean;
}

const DeckContext = createContext<DeckContextValue | undefined>(undefined);

export const DeckProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [draftDeck, setDraftDeck] = useState<Card[]>([]);
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>([]);
  const [activeDeckName, setActiveDeckNameState] = useState<string | null>(null);

  useEffect(() => {
    const savedDecksRaw = localStorage.getItem(STORAGE_KEYS.decks);
    const savedDraftRaw = localStorage.getItem(STORAGE_KEYS.draft);
    const savedActiveDeck = localStorage.getItem(STORAGE_KEYS.activeDeck);

    if (savedDecksRaw) {
      try {
        setSavedDecks(JSON.parse(savedDecksRaw));
      } catch {
        setSavedDecks([]);
      }
    }

    if (savedDraftRaw) {
      try {
        setDraftDeck(JSON.parse(savedDraftRaw));
      } catch {
        setDraftDeck([]);
      }
    }

    if (savedActiveDeck) {
      setActiveDeckNameState(savedActiveDeck);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.decks, JSON.stringify(savedDecks));
  }, [savedDecks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(draftDeck));
  }, [draftDeck]);

  useEffect(() => {
    if (activeDeckName) {
      localStorage.setItem(STORAGE_KEYS.activeDeck, activeDeckName);
    } else {
      localStorage.removeItem(STORAGE_KEYS.activeDeck);
    }
  }, [activeDeckName]);

  const addCardToDraft = (card: Card) => {
    if (draftDeck.length >= MAX_DECK_SIZE) {
      return false;
    }

    setDraftDeck(prev => [...prev, card]);
    return true;
  };

  const removeCardFromDraft = (index: number) => {
    setDraftDeck(prev => prev.filter((_, cardIndex) => cardIndex !== index));
  };

  const clearDraftDeck = () => {
    setDraftDeck([]);
  };

  const isDeckValid = (cards: Card[]) => cards.length >= MIN_DECK_SIZE && cards.length <= MAX_DECK_SIZE;

  const saveDraftDeck = (name: string) => {
    if (!name.trim()) {
      return { ok: false, message: 'Enter a deck name first.' };
    }

    if (!isDeckValid(draftDeck)) {
      return { ok: false, message: `Deck must be between ${MIN_DECK_SIZE} and ${MAX_DECK_SIZE} cards.` };
    }

    const normalizedName = name.trim();
    const nextDeck: SavedDeck = {
      name: normalizedName,
      cards: [...draftDeck],
      createdAt: Date.now(),
    };

    setSavedDecks(prev => {
      const withoutOldVersion = prev.filter(deck => deck.name !== normalizedName);
      return [nextDeck, ...withoutOldVersion];
    });
    setActiveDeckNameState(normalizedName);

    return { ok: true, message: `Deck "${normalizedName}" saved and selected.` };
  };

  const setActiveDeckName = (name: string | null) => {
    setActiveDeckNameState(name);
  };

  const activeDeck = useMemo(() => {
    if (!activeDeckName) {
      return null;
    }

    return savedDecks.find(deck => deck.name === activeDeckName) ?? null;
  }, [activeDeckName, savedDecks]);

  return (
    <DeckContext.Provider
      value={{
        draftDeck,
        savedDecks,
        activeDeckName,
        activeDeck,
        addCardToDraft,
        removeCardFromDraft,
        clearDraftDeck,
        saveDraftDeck,
        setActiveDeckName,
        isDeckValid,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
};

export const useDeck = () => {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error('useDeck must be used inside DeckProvider');
  }
  return context;
};
