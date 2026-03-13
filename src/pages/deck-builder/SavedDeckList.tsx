import { SavedDeck } from '@/types/deck';
import { Button } from '@/components/design-system';
import { GlassPanel } from '@/components/design-system';

interface SavedDeckListProps {
  savedDecks: SavedDeck[];
  activeDeckName: string | null;
  onSelectDeck: (deck: SavedDeck) => void;
}

export function SavedDeckList({ savedDecks, activeDeckName, onSelectDeck }: SavedDeckListProps) {
  return (
    <section aria-label="Saved decks" className="p-4">
      <GlassPanel className="mb-ds6 p-ds4">
        {savedDecks.length === 0 ? (
          <p className="text-slate-300">No saved decks yet</p>
        ) : (
          savedDecks.map(deck => (
            <article key={deck.name} className="mb-2 flex items-center justify-between rounded-ds bg-surface-800 p-3">
              <div>
                <h2 className="font-bold">{deck.name}</h2>
                <span className="text-xs text-slate-300">{deck.cards.length} cards</span>
              </div>
              <Button
                size="sm"
                variant={activeDeckName === deck.name ? 'default' : 'outline'}
                onClick={() => onSelectDeck(deck)}
              >
                {activeDeckName === deck.name ? 'Selected' : 'Select'}
              </Button>
            </article>
          ))
        )}
      </GlassPanel>
    </section>
  );
}
