"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/types/game';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card as CardUI } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getCardAsset } from '@/data/assets';
import { Search, Swords, Shield, Zap, Home, Sparkles, Star, Diamond, Circle, Square, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Collection() {
  const [cards, setCards] = useState<Card[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [mounted, setMounted] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    import('@/data/cards.json').then(data => setCards(data.default as Card[]));
    setMounted(true);
  }, []);

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || card.type === typeFilter;
    const matchesRarity = rarityFilter === 'all' || card.rarity === rarityFilter;
    return matchesSearch && matchesType && matchesRarity;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'SSR': return 'from-yellow-400 via-orange-500 to-red-500';
      case 'SR': return 'from-purple-400 to-pink-500';
      case 'R': return 'from-blue-400 to-cyan-500';
      default: return 'from-slate-400 to-slate-600';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'SSR': return <Diamond size={12} />;
      case 'SR': return <Star size={12} />;
      case 'R': return <Circle size={12} />;
      default: return <Square size={12} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <div className={`relative z-10 min-h-screen p-4 md:p-8 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="relative">
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-32 bg-purple-600/20 blur-[60px] rounded-full" />
              <div className="relative">
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase relative">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    Cursed
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Library
                  </span>
                </h1>
                <div className="flex items-center gap-2 mt-3 text-slate-400">
                  <Sparkles size={16} className="text-yellow-400" />
                  <span className="text-sm tracking-wide">Browse all available cursed techniques</span>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-sm"
              onClick={() => window.location.href = '/'}
            >
              <Home className="mr-2" size={18} /> Back to Menu
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <Input 
                placeholder="Search cards by name..." 
                className="pl-12 bg-slate-950/80 border-slate-700 focus:ring-purple-500 focus:border-purple-500 text-white placeholder:text-slate-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px] bg-slate-950/80 border-slate-700 text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="creature">Creature</SelectItem>
                  <SelectItem value="spell">Spell</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                </SelectContent>
              </Select>
              <Select value={rarityFilter} onValueChange={setRarityFilter}>
                <SelectTrigger className="w-[160px] bg-slate-950/80 border-slate-700 text-white">
                  <SelectValue placeholder="Rarity" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  <SelectItem value="all">All Rarities</SelectItem>
                  <SelectItem value="SSR">SSR</SelectItem>
                  <SelectItem value="SR">SR</SelectItem>
                  <SelectItem value="R">R</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6 flex items-center gap-3 text-slate-400 text-sm">
            <Zap size={14} className="text-purple-400" />
            <span>Showing <span className="text-white font-bold">{filteredCards.length}</span> cards</span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCards.map((card, index) => {
              const asset = getCardAsset(card.id);
              return (
                <CardUI 
                  key={card.id} 
                  onClick={() => setSelectedCard(card)}
                  className={`
                    group relative bg-gradient-to-b from-slate-900 to-slate-950 
                    border border-slate-800/50 overflow-hidden
                    hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]
                    transition-all duration-500 hover:scale-105 hover:-translate-y-2
                    opacity-0 animate-fade-in cursor-pointer
                  `}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  {/* Rarity glow */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                    bg-gradient-to-b from-transparent to-${card.rarity === 'SSR' ? 'yellow' : 'purple'}-500/10
                  `} />
                  
                  <div className="aspect-[3/4] relative overflow-hidden">
                    {/* Card image */}
                    <img 
                      src={asset.url} 
                      alt={card.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    {/* Rarity badge */}
                    <div className="absolute top-3 right-3 z-20">
                      <div className={`
                        px-2 py-1 rounded-md font-black text-xs flex items-center gap-1
                        bg-gradient-to-r ${getRarityColor(card.rarity)}
                        ${card.rarity === 'SSR' ? 'text-black' : 'text-white'}
                      `}>
                        {getRarityIcon(card.rarity)}
                        {card.rarity}
                      </div>
                    </div>
                    
                    {/* Cost badge */}
                    <div className="absolute top-3 left-3 z-20">
                      <div className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-white text-sm">
                        {card.cost}
                      </div>
                    </div>
                  </div>
                  
                  {/* Card info */}
                  <div className="relative z-20 -mt-16 p-4">
                    <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-white/5">
                      <h3 className="font-black text-base mb-1 uppercase tracking-tight text-white group-hover:text-purple-400 transition-colors">
                        {card.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 mb-3 uppercase tracking-wider font-medium">
                        {card.variant} • {card.type}
                      </p>
                      
                      {/* Stats for creatures */}
                      {card.type === 'creature' && (
                        <div className="flex gap-4 text-sm font-black mb-3">
                          <div className="flex items-center text-red-400">
                            <Swords size={14} className="mr-1" /> 
                            <span>{card.attack}</span>
                          </div>
                          <div className="flex items-center text-blue-400">
                            <Shield size={14} className="mr-1" /> 
                            <span>{card.defense}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Effects */}
                      <div className="space-y-2">
                        <div className="text-[11px] text-slate-300 leading-relaxed italic line-clamp-2">
                          "{card.effect}"
                        </div>
                        {card.ultimateEffect && (
                          <div className="pt-2 border-t border-white/5">
                            <div className="text-[9px] font-black text-orange-400 uppercase mb-1 flex items-center gap-1">
                              <Sparkles size={10} /> Ultimate Technique
                            </div>
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

          {/* Empty state */}
          {filteredCards.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-900 flex items-center justify-center">
                <Search size={40} className="text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-400 mb-2">No cards found</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Card Detail Dialog */}
        <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
          <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white">
            {selectedCard && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-0 right-0 hover:bg-slate-800 rounded-full z-10"
                >
                  <X size={24} />
                </Button>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Card Image */}
                  <div className="w-full md:w-64 flex-shrink-0">
                    <img
                      src={getCardAsset(selectedCard.id).url}
                      alt={selectedCard.name}
                      className="w-full rounded-lg"
                    />
                  </div>
                  
                  {/* Card Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`
                        px-3 py-1 rounded-md font-black text-sm
                        bg-gradient-to-r ${getRarityColor(selectedCard.rarity)}
                        ${selectedCard.rarity === 'SSR' ? 'text-black' : 'text-white'}
                      `}>
                        {getRarityIcon(selectedCard.rarity)}
                        {selectedCard.rarity}
                      </span>
                      <span className="text-2xl font-black">{selectedCard.cost}</span>
                    </div>
                    
                    <h2 className="text-3xl font-black mb-1">{selectedCard.name}</h2>
                    <p className="text-slate-400 mb-4">{selectedCard.variant} • {selectedCard.type}</p>
                    
                    {/* Stats for creatures */}
                    {selectedCard.type === 'creature' && (
                      <div className="flex gap-6 mb-4">
                        <div className="flex items-center gap-2 text-red-400">
                          <Swords size={24} />
                          <span className="text-3xl font-black">{selectedCard.attack}</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-400">
                          <Shield size={24} />
                          <span className="text-3xl font-black">{selectedCard.defense}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Effect */}
                    <div className="mb-4">
                      <h4 className="text-sm font-black text-slate-400 mb-1">EFFECT</h4>
                      <p className="text-lg italic">"{selectedCard.effect}"</p>
                    </div>
                    
                    {/* Ultimate for creatures */}
                    {selectedCard.type === 'creature' && selectedCard.ultimateEffect && (
                      <div>
                        <h4 className="text-sm font-black text-orange-400 mb-1 flex items-center gap-1">
                          <Sparkles size={14} />
                          ULTIMATE TECHNIQUE
                        </h4>
                        <p className="text-lg italic">"{selectedCard.ultimateEffect}"</p>
                      </div>
                    )}
                    
                    {/* Faction/Synergy */}
                    {selectedCard.synergy && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <p className="text-sm text-slate-400">
                          <span className="font-black">FACTION:</span> {selectedCard.synergy}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}