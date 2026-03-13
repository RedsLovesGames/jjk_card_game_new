import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card as GameCard } from '@/types/game';
import { Button } from '@/components/ui/button';
import { useDeck } from '@/context/DeckContext';
import { toast } from 'sonner';
import { RotateCcw, Save, Zap } from 'lucide-react';
import { DeckBuilderLibraryPanel } from '@/pages/deck-builder/DeckBuilderLibraryPanel';
import { DeckBuilderStatsPanel } from '@/pages/deck-builder/DeckBuilderStatsPanel';
import { SavedDeckList } from '@/pages/deck-builder/SavedDeckList';

export default function DeckBuilder() {
  const navigate = useNavigate();
  const [library, setLibrary] = useState<GameCard[]>([]);
  const [search, setSearch] = useState('');
  const [deckName, setDeckName] = useState('My Deck');
  const [typeFilter, setTypeFilter] = useState('all');
  const [optimizing, setOptimizing] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const {
    draftDeck,
    addCardToDraft,
    removeCardFromDraft,
    clearDraftDeck,
    saveDraftDeck,
    savedDecks,
    activeDeckName,
    setActiveDeckName,
    isDeckValid,
  } = useDeck();

  useEffect(() => {
    import('@/data/cards.json').then(data => setLibrary(data.default as GameCard[]));
  }, []);

  useEffect(() => {
    if (activeDeckName) {
      setDeckName(activeDeckName);
    }
  }, [activeDeckName]);

  const filteredLibrary = useMemo(
    () =>
      library.filter(card => {
        const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || card.type === typeFilter;
        return matchesSearch && matchesType;
      }),
    [library, search, typeFilter],
  );

  const deckStats = useMemo(() => {
    const creatures = draftDeck.filter(card => card.type === 'creature').length;
    const spells = draftDeck.filter(card => card.type === 'spell').length;
    const avgCost = draftDeck.length > 0 ? draftDeck.reduce((sum, card) => sum + card.cost, 0) / draftDeck.length : 0;
    return { creatures, spells, avgCost: avgCost.toFixed(1) };
  }, [draftDeck]);

  const addToDeck = (card: GameCard) => {
    const added = addCardToDraft(card);
    if (!added) {
      toast.error('Deck cannot exceed 60 cards');
    }
  };

  const saveDeck = () => {
    const result = saveDraftDeck(deckName);
    if (result.ok) {
      toast.success(result.message);
      return;
    }

    toast.error(result.message);
  };

  const autoOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      const optimizedDeck = [...library].sort(() => 0.5 - Math.random()).slice(0, 50);
      clearDraftDeck();
      optimizedDeck.forEach(card => {
        addCardToDraft(card);
      });
      setOptimizing(false);
      toast.success('Deck optimized!');
    }, 500);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col h-screen" aria-labelledby="deck-builder-title">
      <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <div className="flex items-center gap-4">
          <h1 id="deck-builder-title" className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            Deck Builder
          </h1>
          {isDeckValid(draftDeck) && (
            <Button onClick={() => navigate('/battle?deck=' + encodeURIComponent(deckName))} className="bg-green-600 hover:bg-green-700">
              <Zap className="mr-2" size={18} /> Battle
            </Button>
          )}
        </div>
        <nav aria-label="Deck actions" className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSaved(!showSaved)}>
            Saved Decks ({savedDecks.length})
          </Button>
          <Button variant="outline" onClick={clearDraftDeck}>
            <RotateCcw className="mr-2" size={18} /> Clear
          </Button>
          <Button onClick={saveDeck} className="bg-purple-600 hover:bg-purple-700" disabled={!isDeckValid(draftDeck)}>
            <Save className="mr-2" size={18} /> Save
          </Button>
        </nav>
      </header>

      {showSaved && (
        <SavedDeckList
          savedDecks={savedDecks}
          activeDeckName={activeDeckName}
          onSelectDeck={deck => {
            setActiveDeckName(deck.name);
            setDeckName(deck.name);
            clearDraftDeck();
            deck.cards.forEach(card => addCardToDraft(card));
          }}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px] p-4">
        <DeckBuilderLibraryPanel
          filteredLibrary={filteredLibrary}
          search={search}
          typeFilter={typeFilter}
          onSearchChange={setSearch}
          onTypeFilterChange={setTypeFilter}
          onAddCard={addToDeck}
        />

        <DeckBuilderStatsPanel
          deckName={deckName}
          deck={draftDeck}
          deckStats={deckStats}
          optimizing={optimizing}
          canOptimize={library.length > 0}
          onDeckNameChange={setDeckName}
          onAutoOptimize={autoOptimize}
          onRemoveCard={removeCardFromDraft}
        />
      </div>
    </main>
  );
}
