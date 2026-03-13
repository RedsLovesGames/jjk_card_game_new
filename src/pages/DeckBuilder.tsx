"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/types/game';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Save, Sparkles, RotateCcw, Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CardFrame, FilterBar, GlassPanel, StatBadge } from '@/components/design-system';

const STORAGE_KEY = 'jjk_saved_decks';

interface SavedDeck {
  name: string;
  cards: Card[];
  createdAt: number;
}

export default function DeckBuilder() {
  const navigate = useNavigate();
  const [library, setLibrary] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [deckName, setDeckName] = useState('My Deck');
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    import('@/data/cards.json').then(data => setLibrary(data.default as Card[]));
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSavedDecks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved decks', e);
      }
    }
  }, []);

  const filteredLibrary = useMemo(() => library.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || card.type === typeFilter;
    return matchesSearch && matchesType;
  }), [library, search, typeFilter]);

  const deckStats = useMemo(() => {
    const creatures = deck.filter(c => c.type === 'creature').length;
    const spells = deck.filter(c => c.type === 'spell').length;
    const avgCost = deck.length > 0 ? deck.reduce((sum, c) => sum + c.cost, 0) / deck.length : 0;
    return { creatures, spells, avgCost: avgCost.toFixed(1) };
  }, [deck]);

  const addToDeck = (card: Card) => {
    if (deck.length >= 60) return toast.error('Deck cannot exceed 60 cards');
    setDeck([...deck, card]);
  };

  const removeFromDeck = (index: number) => {
    const newDeck = [...deck];
    newDeck.splice(index, 1);
    setDeck(newDeck);
  };

  const clearDeck = () => setDeck([]);

  const saveDeck = () => {
    if (deck.length < 40) return toast.error('Deck must have at least 40 cards');
    if (!deckName.trim()) return toast.error('Please enter a deck name');
    const newDeck: SavedDeck = { name: deckName, cards: [...deck], createdAt: Date.now() };
    const updated = [...savedDecks, newDeck];
    setSavedDecks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast.success(`Deck "${deckName}" saved!`);
  };

  const autoOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      setDeck([...library].sort(() => 0.5 - Math.random()).slice(0, 50));
      setOptimizing(false);
      toast.success('Deck optimized!');
    }, 500);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col h-screen" aria-labelledby="deck-builder-title">
      <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <div className="flex items-center gap-4">
          <h1 id="deck-builder-title" className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Deck Builder</h1>
          {deck.length >= 40 && (
            <Button onClick={() => navigate('/battle?deck=' + encodeURIComponent(deckName))} className="bg-green-600 hover:bg-green-700">
              <Zap className="mr-2" size={18} /> Battle
            </Button>
          )}
        </div>
        <nav aria-label="Deck actions" className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSaved(!showSaved)}>Saved Decks ({savedDecks.length})</Button>
          <Button variant="outline" onClick={clearDeck}><RotateCcw className="mr-2" size={18} /> Clear</Button>
          <Button onClick={saveDeck} className="bg-purple-600 hover:bg-purple-700" disabled={deck.length < 40}><Save className="mr-2" size={18} /> Save</Button>
        </nav>
      </header>

      {showSaved && (
        <section aria-label="Saved decks" className="p-4">
          <GlassPanel className="mb-ds6 p-ds4">
            {savedDecks.length === 0 ? <p className="text-slate-300">No saved decks yet</p> : savedDecks.map((d, i) => (
              <article key={i} className="mb-2 flex items-center justify-between rounded-ds bg-surface-800 p-3">
                <h2 className="font-bold">{d.name}</h2>
                <span className="text-xs text-slate-300">{d.cards.length} cards</span>
              </article>
            ))}
          </GlassPanel>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px] p-4">
        <section aria-label="Card library">
          <GlassPanel className="p-ds4">
            <FilterBar className="mb-ds4 p-0 border-0 bg-transparent shadow-none">
              <Input aria-label="Search library cards" placeholder="Search cards..." value={search} onChange={e => setSearch(e.target.value)} className="bg-slate-800 border-slate-700" />
              <select aria-label="Filter cards by type" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="rounded-md border border-slate-700 bg-slate-800 px-3 text-sm">
                <option value="all">All Types</option><option value="creature">Creature</option><option value="spell">Spell</option><option value="area">Area</option>
              </select>
            </FilterBar>
            <ScrollArea className="h-[62vh]">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {filteredLibrary.map(card => (
                  <CardFrame key={card.id} className="p-2">
                    <h3 className="mb-1 truncate text-xs font-bold">{card.name}</h3>
                    <p className="mb-2 text-[10px] text-slate-300">{card.type} | Cost: {card.cost}</p>
                    <Button size="sm" className="h-6 w-full text-xs" onClick={() => addToDeck(card)} aria-label={`Add ${card.name} to deck`}><Plus size={12} /></Button>
                  </CardFrame>
                ))}
              </div>
            </ScrollArea>
          </GlassPanel>
        </section>

        <aside aria-label="Current deck">
          <GlassPanel className="p-ds4">
            <Input aria-label="Deck name" value={deckName} onChange={e => setDeckName(e.target.value)} className="mb-ds4 bg-slate-800 border-slate-700" />
            <Button onClick={autoOptimize} disabled={optimizing || library.length === 0} className="mb-ds4 w-full bg-gradient-to-r from-blue-600 to-brand-600">
              {optimizing ? <Loader2 className="mr-2 motion-safe:animate-spin" size={16} /> : <Sparkles className="mr-2" size={16} />} Auto Optimize
            </Button>
            <section aria-label="Deck stats" className="mb-ds4 grid grid-cols-2 gap-2">
              <StatBadge label="Cards" value={`${deck.length}/60`} tone={deck.length >= 40 ? 'success' : 'danger'} />
              <StatBadge label="Avg Cost" value={deckStats.avgCost} tone="brand" />
              <StatBadge label="Creatures" value={deckStats.creatures} />
              <StatBadge label="Spells" value={deckStats.spells} />
            </section>
            <ScrollArea className="h-[45vh]">
              <div className="space-y-1">
                {deck.map((card, index) => (
                  <div key={`${card.id}-${index}`} className="flex items-center justify-between rounded-ds bg-surface-700 p-2 text-xs">
                    <div className="flex items-center gap-2"><Badge variant="outline" className="h-5 text-[8px]">{card.cost}</Badge>{card.name}</div>
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeFromDeck(index)} aria-label={`Remove ${card.name} from deck`}><Trash2 size={12} /></Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </GlassPanel>
        </aside>
      </div>
    </main>
  );
}
