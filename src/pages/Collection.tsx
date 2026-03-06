"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/types/game';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card as CardUI } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCardAsset } from '@/data/assets';
import { Search, Swords, Shield, Zap, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Collection() {
  const [cards, setCards] = useState<Card[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');

  useEffect(() => {
    // Using the static cards.json for the collection view
    import('@/data/cards.json').then(data => setCards(data.default as Card[]));
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
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent uppercase">
              Cursed Library
            </h1>
            <p className="text-slate-400 mt-2">Browse all available cursed techniques and sorcerers.</p>
          </div>
          <Button variant="outline" className="border-slate-800 hover:bg-slate-900" onClick={() => window.location.href = '/'}>
            <Home className="mr-2" size={18} /> Back to Menu
          </Button>
        </div>

        <div className="flex flex-col md:row gap-4 mb-12 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <Input 
              placeholder="Search cards..." 
              className="pl-10 bg-slate-950 border-slate-800 focus:ring-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] bg-slate-950 border-slate-800">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="creature">Creature</SelectItem>
                <SelectItem value="spell">Spell</SelectItem>
                <SelectItem value="area">Area</SelectItem>
              </SelectContent>
            </Select>
            <Select value={rarityFilter} onValueChange={setRarityFilter}>
              <SelectTrigger className="w-[180px] bg-slate-950 border-slate-800">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="SSR">SSR</SelectItem>
                <SelectItem value="SR">SR</SelectItem>
                <SelectItem value="R">R</SelectItem>
                <SelectItem value="C">C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {filteredCards.map(card => {
            const asset = getCardAsset(card.id);
            return (
              <CardUI key={card.id} className="bg-slate-900 border-slate-800 overflow-hidden group hover:border-purple-500 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img 
                    src={asset.url} 
                    alt={card.name} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 z-20">
                    <Badge className={`${card.rarity === 'SSR' ? 'bg-yellow-500 text-black' : 'bg-purple-600'} font-black`}>
                      {card.rarity}
                    </Badge>
                  </div>
                  <div className="absolute top-3 left-3 z-20">
                    <Badge className="bg-black/60 backdrop-blur-md border-white/10 font-black">
                      {card.cost}
                    </Badge>
                  </div>
                </div>
                <div className="p-5 relative z-20 -mt-12">
                  <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-white/5">
                    <h3 className="font-black text-lg mb-0.5 uppercase tracking-tighter">{card.name}</h3>
                    <p className="text-[10px] text-slate-400 mb-3 uppercase tracking-widest font-bold">{card.variant} • {card.type}</p>
                    
                    {card.type === 'creature' && (
                      <div className="flex gap-4 text-xs font-black mb-4">
                        <div className="flex items-center text-red-400">
                          <Swords size={14} className="mr-1" /> {card.attack}
                        </div>
                        <div className="flex items-center text-blue-400">
                          <Shield size={14} className="mr-1" /> {card.defense}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="text-[10px] text-slate-300 leading-relaxed line-clamp-3 italic">
                        "{card.effect}"
                      </div>
                      {card.ultimateEffect && (
                        <div className="pt-2 border-t border-white/5">
                          <div className="text-[9px] font-black text-orange-400 uppercase mb-1">Ultimate Technique</div>
                          <div className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                            {card.ultimateEffect}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardUI>
            );
          })}
        </div>
      </div>
    </div>
  );
}