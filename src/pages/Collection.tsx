"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/types/game';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card as CardUI } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCardAsset } from '@/data/assets';
import { Search, Filter } from 'lucide-react';

export default function Collection() {
  const [cards, setCards] = useState<Card[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');

  useEffect(() => {
    fetch('/api/cards')
      .then(res => res.json())
      .then(data => setCards(data.cards));
  }, []);

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || card.type === typeFilter;
    const matchesRarity = rarityFilter === 'all' || card.rarity === rarityFilter;
    return matchesSearch && matchesType && matchesRarity;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Card Library
          </h1>
          <a href="/" className="text-blue-400 hover:underline">Back to Home</a>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search cards..." 
              className="pl-10 bg-slate-900 border-slate-800"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] bg-slate-900 border-slate-800">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="creature">Creature</SelectItem>
              <SelectItem value="spell">Spell</SelectItem>
              <SelectItem value="area">Area</SelectItem>
            </SelectContent>
          </Select>
          <Select value={rarityFilter} onValueChange={setRarityFilter}>
            <SelectTrigger className="w-[180px] bg-slate-900 border-slate-800">
              <SelectValue placeholder="Rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              <SelectItem value="SSR">SSR</SelectItem>
              <SelectItem value="SR">SR</SelectItem>
              <SelectItem value="R">R</SelectItem>
              <SelectItem value="C">C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredCards.map(card => {
            const asset = getCardAsset(card.id);
            return (
              <CardUI key={card.id} className="bg-slate-900 border-slate-800 overflow-hidden group hover:border-purple-500 transition-all">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img 
                    src={asset.url} 
                    alt={card.name} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={card.rarity === 'SSR' ? 'bg-yellow-500' : 'bg-slate-700'}>
                      {card.rarity}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{card.name}</h3>
                  <p className="text-xs text-slate-400 mb-2">{card.variant}</p>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-blue-400">Cost: {card.cost}</span>
                    {card.type === 'creature' && (
                      <span className="text-red-400">{card.attack}/{card.defense}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-3">{card.effect}</p>
                </div>
              </CardUI>
            );
          })}
        </div>
      </div>
    </div>
  );
}