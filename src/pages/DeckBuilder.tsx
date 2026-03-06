"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/types/game';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Save, Sparkles, RotateCcw, Zap, Shield, Swords, Target, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEY = 'jjk_saved_decks';

interface SavedDeck {
  name: string;
  cards: Card[];
  createdAt: number;
}

export default function DeckBuilder() {
  const [library, setLibrary] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [deckName, setDeckName] = useState('My Deck');
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    // Load cards from local JSON
    import('@/data/cards.json').then(data => {
      setLibrary(data.default as Card[]);
    });
    
    // Load saved decks
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSavedDecks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved decks', e);
      }
    }
  }, []);

  // Filter library
  const filteredLibrary = useMemo(() => {
    return library.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || card.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [library, search, typeFilter]);

  // Deck stats
  const deckStats = useMemo(() => {
    const creatures = deck.filter(c => c.type === 'creature').length;
    const spells = deck.filter(c => c.type === 'spell').length;
    const areas = deck.filter(c => c.type === 'area').length;
    const avgCost = deck.length > 0 
      ? deck.reduce((sum, c) => sum + c.cost, 0) / deck.length 
      : 0;
    const costs = [0, 0, 0, 0, 0, 0, 0];
    deck.forEach(c => {
      if (c.cost >= 0 && c.cost < 7) costs[c.cost]++;
    });
    return { creatures, spells, areas, avgCost: avgCost.toFixed(1), costs };
  }, [deck]);

  const addToDeck = (card: Card) => {
    if (deck.length >= 60) {
      toast.error("Deck cannot exceed 60 cards");
      return;
    }
    setDeck([...deck, card]);
  };

  const addMultiple = (card: Card, count: number) => {
    const newDeck = [...deck];
    for (let i = 0; i < count; i++) {
      if (newDeck.length >= 60) break;
      newDeck.push(card);
    }
    setDeck(newDeck);
  };

  const removeFromDeck = (index: number) => {
    const newDeck = [...deck];
    newDeck.splice(index, 1);
    setDeck(newDeck);
  };

  const saveDeck = () => {
    if (deck.length < 40) {
      toast.error("Deck must have at least 40 cards");
      return;
    }
    if (!deckName.trim()) {
      toast.error("Please enter a deck name");
      return;
    }
    
    const newDeck: SavedDeck = {
      name: deckName,
      cards: [...deck],
      createdAt: Date.now()
    };
    
    const updated = [...savedDecks, newDeck];
    setSavedDecks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast.success(`Deck "${deckName}" saved!`);
  };

  const loadDeck = (saved: SavedDeck) => {
    setDeck([...saved.cards]);
    setDeckName(saved.name);
    setShowSaved(false);
    toast.success(`Loaded "${saved.name}"`);
  };

  const deleteDeck = (index: number) => {
    const updated = savedDecks.filter((_, i) => i !== index);
    setSavedDecks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast.success("Deck deleted");
  };

  // Auto-optimize deck
  const autoOptimize = () => {
    setOptimizing(true);
    
    setTimeout(() => {
      const optimized: Card[] = [];
      const cardPool = [...library];
      
      // Shuffle pool
      for (let i = cardPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardPool[i], cardPool[j]] = [cardPool[j], cardPool[i]];
      }
      
      // Strategy: Balanced deck with curve
      // 12 low cost (1-2) creatures for early game
      // 15 medium cost (3-4) creatures for mid game  
      // 8 high cost (5+) creatures for late game
      // 10 spells for versatility
      // 5 areas for field control
      
      let lowCost = 0, midCost = 0, highCost = 0, spellCount = 0, areaCount = 0;
      
      for (const card of cardPool) {
        if (optimized.length >= 50) break;
        
        if (card.type === 'spell' && spellCount < 10) {
          optimized.push(card);
          spellCount++;
        } else if (card.type === 'area' && areaCount < 5) {
          optimized.push(card);
          areaCount++;
        } else if (card.type === 'creature') {
          if (card.cost <= 2 && lowCost < 12) {
            optimized.push(card);
            lowCost++;
          } else if (card.cost <= 4 && midCost < 15) {
            optimized.push(card);
            midCost++;
          } else if (card.cost >= 5 && highCost < 8) {
            optimized.push(card);
            highCost++;
          }
        }
      }
      
      setDeck(optimized);
      setOptimizing(false);
      toast.success("Deck optimized! 50 cards with balanced curve");
    }, 500);
  };

  const clearDeck = () => {
    setDeck([]);
    setDeckName('New Deck');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col h-screen">
      <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Deck Builder
          </h1>
          {deck.length >= 40 && (
            <Button 
              onClick={() => window.location.hash = '#/battle?deck=' + encodeURIComponent(deckName)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Zap className="mr-2" size={18} /> Battle
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSaved(!showSaved)}>
            Saved Decks ({savedDecks.length})
          </Button>
          <Button variant="outline" onClick={clearDeck}>
            <RotateCcw className="mr-2" size={18} /> Clear
          </Button>
          <Button onClick={saveDeck} className="bg-purple-600 hover:bg-purple-700" disabled={deck.length < 40}>
            <Save className="mr-2" size={18} /> Save
          </Button>
        </div>
      </header>

      {/* Saved Decks Modal */}
      {showSaved && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Saved Decks</h2>
              <Button variant="ghost" onClick={() => setShowSaved(false)}>✕</Button>
            </div>
            {savedDecks.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No saved decks yet</p>
            ) : (
              <div className="space-y-2">
                {savedDecks.map((d, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
                    <div>
                      <div className="font-bold">{d.name}</div>
                      <div className="text-xs text-slate-400">{d.cards.length} cards</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => loadDeck(d)}>Load</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteDeck(i)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Library Section */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col bg-slate-950">
          {/* Search & Filter */}
          <div className="flex gap-2 mb-4">
            <Input 
              placeholder="Search cards..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-800 border-slate-700"
            />
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded px-3 text-sm"
            >
              <option value="all">All Types</option>
              <option value="creature">Creature</option>
              <option value="spell">Spell</option>
              <option value="area">Area</option>
            </select>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredLibrary.map(card => (
                <div key={card.id} className="bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-blue-500 transition-all">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-xs truncate">{card.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mb-2">
                    {card.type === 'creature' && <><Swords size={10} className="inline mr-1" /></>}
                    {card.type === 'spell' && <><Zap size={10} className="inline mr-1" /></>}
                    {card.type === 'area' && <><Shield size={10} className="inline mr-1" /></>}
                    {card.type} | Cost: {card.cost}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" className="h-6 text-xs flex-1" onClick={() => addToDeck(card)}>
                      <Plus size={12} /> 
                    </Button>
                    {deck.length < 60 && (
                      <Button size="sm" className="h-6 text-xs bg-slate-700" onClick={() => addMultiple(card, 3)}>
                        +3
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Deck Section */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 p-4 flex flex-col">
          {/* Deck Name */}
          <div className="mb-4">
            <Input 
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Deck Name"
              className="bg-slate-800 border-slate-700"
            />
          </div>
          
          {/* Auto Optimize Button */}
          <Button 
            onClick={autoOptimize} 
            disabled={optimizing || library.length === 0}
            className="w-full mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {optimizing ? <Loader2 className="animate-spin mr-2" size={18} /> : <Sparkles className="mr-2" size={18} />}
            Auto Optimize
          </Button>

          {/* Deck Stats */}
          <div className="bg-slate-800 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-sm">Deck Stats</h3>
              <Badge className={deck.length >= 40 ? "bg-green-600" : "bg-red-600"}>
                {deck.length}/60
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs mb-2">
              <div className="text-center">
                <div className="text-red-400 font-bold">{deckStats.creatures}</div>
                <div className="text-slate-400">Creatures</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-bold">{deckStats.spells}</div>
                <div className="text-slate-400">Spells</div>
              </div>
              <div className="text-center">
                <div className="text-orange-400 font-bold">{deckStats.areas}</div>
                <div className="text-slate-400">Areas</div>
              </div>
            </div>
            <div className="text-center text-xs text-slate-400 mb-2">
              Avg Cost: {deckStats.avgCost}
            </div>
            {/* Cost Curve */}
            <div className="flex gap-1 h-12 items-end">
              {deckStats.costs.map((c, i) => (
                <div key={i} className="flex-1 bg-slate-700 rounded relative" style={{ height: '100%' }}>
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-purple-500 rounded" 
                    style={{ height: `${Math.min(100, (c / 15) * 100)}%` }}
                  />
                  <span className="absolute -bottom-4 left-0 right-0 text-[8px] text-center text-slate-500">{i}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm">Cards</h3>
            <span className="text-xs text-slate-400">{deck.length} cards</span>
          </div>
          
          <ScrollArea className="flex-1 mb-4">
            <div className="space-y-1">
              {deck.map((card, index) => (
                <div key={`${card.id}-${index}`} className="flex justify-between items-center bg-slate-800 p-2 rounded text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[8px] h-5">{card.cost}</Badge>
                    <span className="truncate max-w-[120px]">{card.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-5 w-5 text-red-400 hover:text-red-300" onClick={() => removeFromDeck(index)}>
                    <Trash2 size={12} />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className={`text-xs text-center py-2 rounded ${deck.length >= 40 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            {deck.length >= 40 ? '✓ Ready to battle!' : `Need ${40 - deck.length} more cards`}
          </div>
        </div>
      </div>
    </div>
  );
}