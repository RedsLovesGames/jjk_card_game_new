import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card as GameCard } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useDeck } from '@/context/DeckContext';
import { toast } from 'sonner';
import { MIN_DECK_SIZE } from '@/types/deck';
import { TutorialOverlay } from '@/components/TutorialOverlay';

export default function DeckBuilder() {
  const navigate = useNavigate();
  const [library, setLibrary] = useState<GameCard[]>([]);
  const [search, setSearch] = useState('');
  const [deckName, setDeckName] = useState('My Deck');
  const { draftDeck, addCardToDraft, removeCardFromDraft, clearDraftDeck, saveDraftDeck, savedDecks, activeDeckName, setActiveDeckName, isDeckValid } = useDeck();

  useEffect(() => {
    import('@/data/cards.json').then(data => setLibrary(data.default as GameCard[]));
  }, []);

  const filtered = useMemo(() => library.filter(card => card.name.toLowerCase().includes(search.toLowerCase())), [library, search]);

  const save = () => {
    const result = saveDraftDeck(deckName);
    if (result.ok) {
      toast.success(result.message);
      return;
    }
    toast.error(result.message);
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <TutorialOverlay
        pageKey="deck-builder"
        title="Deck Builder Tips"
        steps={[
          'Your draft is persistent, even if you move between pages.',
          `Build a valid deck (${MIN_DECK_SIZE}+ cards) before battling with it.`,
          'Use Use this deck to set the active deck for battle.',
        ]}
      />
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[2fr_1fr]">
        <section>
          <h1 className="text-3xl font-black">Deck Builder</h1>
          <p className="mb-4 text-slate-300">Assemble your deck and set the one you want to use in battle.</p>
          <div className="mb-3 flex gap-2">
            <Input placeholder="Search library" value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
            <Button onClick={() => navigate('/battle?mode=deck')} variant="outline">Go to battle</Button>
            <Button onClick={() => navigate('/collection')} variant="outline">Back to collection</Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, 24).map(card => (
              <Card key={`${card.id}-${card.variant}`} className="border-slate-700 bg-slate-900 p-3">
                <p className="font-bold">{card.name}</p>
                <p className="mb-2 text-xs text-slate-400">{card.type}</p>
                <Button size="sm" onClick={() => addCardToDraft(card)}>Add to deck</Button>
              </Card>
            ))}
          </div>
        </section>

        <aside>
          <Card className="border-slate-700 bg-slate-900 p-4">
            <Input value={deckName} onChange={e => setDeckName(e.target.value)} className="mb-3" />
            <p className="mb-3 text-sm text-slate-300">Cards: {draftDeck.length}</p>
            <div className="mb-3 flex gap-2">
              <Button onClick={save}>Save deck</Button>
              <Button variant="outline" onClick={clearDraftDeck}>Clear</Button>
            </div>
            <Button
              className="w-full"
              disabled={!isDeckValid(draftDeck)}
              onClick={() => {
                const result = saveDraftDeck(deckName);
                if (result.ok) {
                  toast.success('Use this deck set successfully.');
                  navigate('/battle?mode=deck');
                } else {
                  toast.error(result.message);
                }
              }}
            >
              Use this deck
            </Button>
            {!isDeckValid(draftDeck) && <p className="mt-2 text-xs text-amber-300">Build at least {MIN_DECK_SIZE} cards to use this deck in battle.</p>}
          </Card>

          <Card className="mt-3 border-slate-700 bg-slate-900 p-4">
            <h3 className="mb-2 font-bold">Saved decks</h3>
            <div className="space-y-2">
              {savedDecks.map(deck => (
                <button
                  key={deck.name}
                  onClick={() => setActiveDeckName(deck.name)}
                  className={`w-full rounded border p-2 text-left text-sm ${activeDeckName === deck.name ? 'border-emerald-500' : 'border-slate-700'}`}
                >
                  {deck.name} ({deck.cards.length})
                </button>
              ))}
            </div>
          </Card>

          <Card className="mt-3 max-h-72 overflow-auto border-slate-700 bg-slate-900 p-4">
            <h3 className="mb-2 font-bold">Draft cards</h3>
            <div className="space-y-1 text-sm">
              {draftDeck.map((card, index) => (
                <div key={`${card.id}-${index}`} className="flex items-center justify-between rounded bg-slate-800 px-2 py-1">
                  <span>{card.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeCardFromDraft(index)}>Remove</Button>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}
