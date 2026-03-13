"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/types/game';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getCardAsset, getCardBackground } from '@/data/assets';
import { Search, Swords, Shield, Zap, Home, Sparkles, Star, Diamond, Circle, Square, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardFrame, FilterBar, GlassPanel, StatBadge } from '@/components/design-system';
import { useMotionTier } from '@/hooks/use-motion-tier';
import { createDeterministicParticles } from '@/lib/visual-effects';

export default function Collection() {
  const navigate = useNavigate();
  const motionTier = useMotionTier();
  const isReducedMotion = motionTier === 'reduced';
  const [cards, setCards] = useState<Card[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [mounted, setMounted] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const particles = useMemo(() => createDeterministicParticles('collection-bg', isReducedMotion ? 0 : 20), [isReducedMotion]);

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
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950" />
        {!isReducedMotion && <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-purple-600/10 blur-[100px]" />}
        {!isReducedMotion && <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px]" />
        {!isReducedMotion && particles.map((particle, index) => (
          <span
            key={`${particle.x}-${particle.y}-${index}`}
            className="absolute rounded-full bg-purple-200/60 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delayMs}ms`,
              animationDuration: `${particle.durationMs}ms`,
              opacity: particle.opacity,
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 min-h-screen p-4 transition-all duration-700 md:p-8 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="relative">
              {!isReducedMotion && <div className="absolute left-0 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[60px]" />}
              <div className="relative">
                <h1 className="relative text-5xl font-black uppercase tracking-tighter md:text-6xl">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Cursed</span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">Library</span>
                </h1>
                <div className="mt-3 flex items-center gap-2 text-slate-400">
                  <Sparkles size={16} className="text-yellow-400" />
                  <span className="text-sm tracking-wide">Browse all available cursed techniques</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className={`border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white ${isReducedMotion ? '' : 'backdrop-blur-sm'}`}
              onClick={() => navigate('/')}
            >
              <Home className="mr-2" size={18} /> Back to Menu
            </Button>
          </div>

          <FilterBar>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <Input
                placeholder="Search cards by name..."
                className="border-slate-700 bg-slate-950/80 pl-12 text-white"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px] border-slate-700 bg-slate-950/80 text-white"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-900 text-white">
                  <SelectItem value="all">All Types</SelectItem><SelectItem value="creature">Creature</SelectItem><SelectItem value="spell">Spell</SelectItem><SelectItem value="area">Area</SelectItem>
                </SelectContent>
              </Select>
              <Select value={rarityFilter} onValueChange={setRarityFilter}>
                <SelectTrigger className="w-[160px] border-slate-700 bg-slate-950/80 text-white"><SelectValue placeholder="Rarity" /></SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-900 text-white">
                  <SelectItem value="all">All Rarities</SelectItem><SelectItem value="SSR">SSR</SelectItem><SelectItem value="SR">SR</SelectItem><SelectItem value="R">R</SelectItem><SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FilterBar>

          <div className="mb-ds6 flex items-center gap-3">
            <Zap size={14} className="text-brand-400" />
            <StatBadge label="Showing" value={filteredCards.length} className="w-28" tone="brand" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredCards.map(card => {
              const asset = getCardAsset(card.id, card.variant);
              return (
                <CardFrame
                  key={card.id}
                  interactive
                  onClick={() => setSelectedCard(card)}
                  style={{ background: `linear-gradient(to bottom, ${getCardBackground(card.id, card.rarity)}dd, ${getCardBackground(card.id, card.rarity)}99)` }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img src={asset.url} alt={card.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className={`absolute right-3 top-3 z-raised flex items-center gap-1 rounded-md bg-gradient-to-r px-2 py-1 text-xs font-black ${getRarityColor(card.rarity)}`}>
                      {getRarityIcon(card.rarity)} {card.rarity}
                    </div>
                    <div className="absolute left-3 top-3 z-raised flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/70 text-sm font-black">
                      {card.cost}
                    </div>
                  </div>
                  <GlassPanel className="relative z-raised m-4 -mt-16 p-4">
                    <h3 className="mb-1 text-base font-black uppercase text-white">{card.name}</h3>
                    <p className="mb-3 text-[10px] uppercase tracking-wider text-slate-400">{card.variant} • {card.type}</p>
                    {card.type === 'creature' && (
                      <div className="mb-3 flex gap-4 text-sm font-black">
                        <div className="flex items-center text-red-400"><Swords size={14} className="mr-1" />{card.attack}</div>
                        <div className="flex items-center text-blue-400"><Shield size={14} className="mr-1" />{card.defense}</div>
                      </div>
                    )}
                    <p className="line-clamp-2 text-[11px] italic text-slate-300">"{card.effect}"</p>
                  </GlassPanel>
                </CardFrame>
              );
            })}
          </div>

          {filteredCards.length === 0 && (
            <div className="py-20 text-center">
              <Search size={40} className="mx-auto mb-4 text-slate-600" />
              <h3 className="text-2xl font-bold text-slate-400">No cards found</h3>
            </div>
          )}

          <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
            <DialogContent className="max-w-2xl border-slate-700 bg-slate-900 text-white">
              {selectedCard && (
                <div className="relative">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedCard(null)} className="absolute right-0 top-0 z-raised rounded-full hover:bg-slate-800"><X size={24} /></Button>
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div className="w-full md:w-64"><img src={getCardAsset(selectedCard.id, selectedCard.variant).url} alt={selectedCard.name} className="w-full rounded-lg" /></div>
                    <div className="flex-1">
                      <h2 className="mb-1 text-3xl font-black">{selectedCard.name}</h2>
                      <p className="mb-4 text-slate-400">{selectedCard.variant} • {selectedCard.type}</p>
                      <p className="text-lg italic">"{selectedCard.effect}"</p>
                      {selectedCard.ultimateEffect && (
                        <div className="mt-4">
                          <h4 className="mb-1 flex items-center gap-1 text-sm font-black text-orange-400"><Sparkles size={14} /> ULTIMATE TECHNIQUE</h4>
                          <p className="text-lg italic">"{selectedCard.ultimateEffect}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
