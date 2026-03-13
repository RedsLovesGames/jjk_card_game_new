import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card as GameCard } from '@/types/game';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDeck } from '@/context/DeckContext';
import { toast } from 'sonner';
import { TutorialOverlay } from '@/components/TutorialOverlay';

export default function Collection() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<GameCard[]>([]);
  const [search, setSearch] = useState('');
  const { addCardToDraft, draftDeck } = useDeck();

  useEffect(() => {
    import('@/data/cards.json').then(data => setCards(data.default as GameCard[]));
  }, []);

  const filtered = useMemo(() => cards.filter(card => card.name.toLowerCase().includes(search.toLowerCase())), [cards, search]);

  const onAdd = (card: GameCard) => {
    const added = addCardToDraft(card);
    if (!added) {
      toast.error('Deck is full (60 cards max).');
      return;
    }
    toast.success(`${card.name} added to deck.`);
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <TutorialOverlay
        pageKey="collection"
        title="Collection Tips"
        steps={[
          'Use search to find cards quickly.',
          'Click Add to deck to persist picks for Deck Builder.',
          'When ready, continue to Deck Builder.',
        ]}
      />
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black">Collection</h1>
        <p className="mb-4 text-slate-300">Discover cards and add them to your persistent draft deck.</p>

        <div className="mb-4 flex gap-3">
          <Input placeholder="Search cards" value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
          <Button variant="outline" onClick={() => navigate('/deck-builder')}>Go to Deck Builder ({draftDeck.length})</Button>
          <Button onClick={() => navigate('/')}>Home</Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(card => (
            <Card key={`${card.id}-${card.variant}`} className="border-slate-700 bg-slate-900 p-4">
              <h2 className="font-bold">{card.name}</h2>
              <p className="text-xs text-slate-400">{card.type} • Cost {card.cost}</p>
              <p className="my-3 text-sm text-slate-300 line-clamp-2">{card.effect}</p>
              <Button size="sm" onClick={() => onAdd(card)}>Add to deck</Button>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
