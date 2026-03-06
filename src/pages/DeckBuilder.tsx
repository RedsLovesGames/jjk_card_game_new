"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/types/game';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function DeckBuilder() {
  const [library, setLibrary] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [deckName, setDeckName] = useState('New Deck');

  useEffect(() => {
    fetch('/api/cards').then(res => res.json()).then(data => setLibrary(data.cards));
  }, []);

  const addToDeck = (card: Card) => {
    if (deck.length >= 60) {
      toast.error("Deck cannot exceed 60 cards");
      return;
    }
    setDeck([...deck, card]);
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
    toast.success("Deck saved successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col h-screen">
      <header className="p-4 border-b border-slate-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Deck Builder</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.location.href = '/'}>Exit</Button>
          <Button onClick={saveDeck} className="bg-purple-600 hover:bg-purple-700">
            <Save className="mr-2" size={18} /> Save Deck
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Library Section */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold mb-4">Library</h2>
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {library.map(card => (
                <div key={card.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 hover:border-blue-500 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm">{card.name}</span>
                    <Badge variant="outline" className="text-[10px]">{card.rarity}</Badge>
                  </div>
                  <div className="text-xs text-slate-400 mb-3">{card.type} | Cost: {card.cost}</div>
                  <Button size="sm" className="w-full h-7" onClick={() => addToDeck(card)}>
                    <Plus size={14} className="mr-1" /> Add
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Deck Section */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Deck</h2>
            <Badge className="bg-purple-600">{deck.length}/60</Badge>
          </div>
          <ScrollArea className="flex-1 mb-4">
            <div className="space-y-2">
              {deck.map((card, index) => (
                <div key={`${card.id}-${index}`} className="flex justify-between items-center bg-slate-800 p-2 rounded text-sm">
                  <span className="truncate flex-1">{card.name}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-300" onClick={() => removeFromDeck(index)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="text-xs text-slate-500 text-center">
            Min 40 cards required to play
          </div>
        </div>
      </div>
    </div>
  );
}