import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Card as GameCard } from '@/types/game';
import { useDeck } from '@/context/DeckContext';
import { toast } from 'sonner';
import { getCardAsset } from '@/data/assets';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

export default function Collection() {
  const navigate = useNavigate();
  const { addCardToDraft } = useDeck();

  const [cards, setCards] = useState<GameCard[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'creature' | 'spell' | 'area' | 'ultimate'>('all');
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null);

  useEffect(() => {
    import('@/data/cards.json').then((data) => setCards(data.default as GameCard[]));
  }, []);

  const filteredCards = useMemo(
    () =>
      cards.filter((card) => {
        const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || card.type === typeFilter;
        return matchesSearch && matchesType;
      }),
    [cards, search, typeFilter],
  );

  const handleAddToDeck = (card: GameCard) => {
    if (!addCardToDraft(card)) {
      toast.error('Deck is full (60 cards max).');
      return;
    }

    toast.success(`${card.name} added to deck.`);
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Card Collection</h1>
            <p className="text-slate-300">Browse and add cards to your draft deck.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="mr-2" size={16} /> Back
          </Button>
        </div>

        <section className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input className="pl-9" placeholder="Search cards..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as typeof typeFilter)}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="creature">Creature</SelectItem>
              <SelectItem value="spell">Spell</SelectItem>
              <SelectItem value="area">Area</SelectItem>
              <SelectItem value="ultimate">Ultimate</SelectItem>
            </SelectContent>
          </Select>
        </section>

        <p className="mb-4 text-sm text-slate-300">Showing {filteredCards.length} cards</p>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCards.map((card) => (
            <Card key={`${card.id}-${card.variant}`} className="border-slate-700 bg-slate-900 p-4">
              <button type="button" className="w-full text-left" onClick={() => setSelectedCard(card)}>
                <img src={getCardAsset(card.id, card.variant).url} alt={card.name} className="mb-3 h-48 w-full rounded object-cover" />
                <h2 className="font-semibold">{card.name}</h2>
                <p className="text-xs uppercase text-slate-400">{card.variant} • {card.type}</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-300">{card.effect}</p>
              </button>
              <Button className="mt-3 w-full" onClick={() => handleAddToDeck(card)}>Add to deck</Button>
            </Card>
          ))}
        </section>

        {filteredCards.length === 0 && <p className="py-12 text-center text-slate-400">No cards found.</p>}
      </div>

      <Dialog open={!!selectedCard} onOpenChange={(open) => !open && setSelectedCard(null)}>
        <DialogContent className="border-slate-700 bg-slate-900 text-white">
          {selectedCard && (
            <div className="space-y-4">
              <img src={getCardAsset(selectedCard.id, selectedCard.variant).url} alt={selectedCard.name} className="h-64 w-full rounded object-cover" />
              <DialogTitle>{selectedCard.name}</DialogTitle>
              <DialogDescription className="text-slate-300">{selectedCard.variant} • {selectedCard.type}</DialogDescription>
              <p>{selectedCard.effect}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
