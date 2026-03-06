"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card as CardUI } from '@/components/ui/card';
import { Sparkles, Swords, Zap, Shield, Loader2, ArrowLeft, Play } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { getCardAsset } from '@/data/assets';

const STORAGE_KEY = 'jjk_saved_decks';

interface SavedDeck {
  name: string;
  cards: Card[];
  createdAt: number;
}

export default function BattleScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { startGame } = useGame();
  
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<SavedDeck | null>(null);
  const [loading, setLoading] = useState(false);
  const [battleType, setBattleType] = useState<'quick' | 'deck'>('quick');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const decks = JSON.parse(saved);
        setSavedDecks(decks);
        if (decks.length > 0) {
          setSelectedDeck(decks[0]);
          setBattleType('deck');
        }
      } catch (e) {
        console.error('Failed to load decks', e);
      }
    }
  }, []);

  const startBattle = async () => {
    setLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (selectedDeck && battleType === 'deck') {
      // TODO: Pass deck to game engine
      startGame('Sorcerer', 'Cursed Spirit');
    } else {
      startGame('Sorcerer', 'Cursed Spirit');
    }
  };

  const deckStats = (deck: SavedDeck) => {
    const creatures = deck.cards.filter(c => c.type === 'creature').length;
    const spells = deck.cards.filter(c => c.type === 'spell').length;
    const areas = deck.cards.filter(c => c.type === 'area').length;
    return { creatures, spells, areas, total: deck.cards.length };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-slate-800 flex items-center gap-4 bg-slate-900">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2" size={18} /> Back
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent">
          Battle Arena
        </h1>
      </header>

      <div className="flex-1 flex">
        {/* Left: Battle Options */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-black mb-8 text-center">
            Choose Your<br/>
            <span className="text-purple-400">Battle Style</span>
          </h2>
          
          <div className="space-y-4 w-full max-w-md">
            {/* Quick Battle */}
            <CardUI 
              onClick={() => setBattleType('quick')}
              className={`
                cursor-pointer transition-all p-6
                ${battleType === 'quick' 
                  ? 'border-red-500 bg-red-500/10 ring-2 ring-red-500/50' 
                  : 'border-slate-700 bg-slate-900 hover:border-slate-600'}
              `}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
                  <Swords size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">Quick Battle</h3>
                  <p className="text-slate-400 text-sm">Use default deck against AI</p>
                </div>
                {battleType === 'quick' && (
                  <Badge className="bg-red-600">Selected</Badge>
                )}
              </div>
            </CardUI>

            {/* Deck Battle */}
            <CardUI 
              onClick={() => savedDecks.length > 0 && setBattleType('deck')}
              className={`
                cursor-pointer transition-all p-6
                ${savedDecks.length === 0 && 'opacity-50 cursor-not-allowed'}
                ${battleType === 'deck' 
                  ? 'border-green-500 bg-green-500/10 ring-2 ring-green-500/50' 
                  : 'border-slate-700 bg-slate-900 hover:border-slate-600'}
              `}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center">
                  <Sparkles size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">Deck Battle</h3>
                  <p className="text-slate-400 text-sm">
                    {savedDecks.length > 0 
                      ? `Use your saved deck (${savedDecks.length} available)` 
                      : 'No saved decks - build one first!'}
                  </p>
                </div>
                {battleType === 'deck' && savedDecks.length > 0 && (
                  <Badge className="bg-green-600">Selected</Badge>
                )}
              </div>
            </CardUI>
          </div>

          {/* Start Button */}
          <Button 
            onClick={startBattle}
            disabled={loading || (battleType === 'deck' && !selectedDeck)}
            className="mt-8 w-full max-w-md h-14 text-lg bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={24} />
            ) : (
              <Play className="mr-2" size={24} />
            )}
            {loading ? 'Loading Battle...' : 'Start Battle'}
          </Button>
          
          {loading && (
            <div className="mt-6 text-center">
              <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-purple-500 animate-pulse" style={{ width: '60%' }} />
              </div>
              <p className="text-slate-400 text-sm mt-2">Summoning cursed energy...</p>
            </div>
          )}
        </div>

        {/* Right: Deck Selection */}
        <div className="w-1/2 bg-slate-900 border-l border-slate-800 p-8">
          <h3 className="text-xl font-bold mb-4">Select Your Deck</h3>
          
          {savedDecks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                <Sparkles size={40} className="text-slate-600" />
              </div>
              <p className="text-slate-400 mb-4">No saved decks yet</p>
              <Button onClick={() => navigate('/deck-builder')} className="bg-purple-600 hover:bg-purple-700">
                Build Your First Deck
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedDecks.map((deck, index) => (
                <CardUI 
                  key={index}
                  onClick={() => setSelectedDeck(deck)}
                  className={`
                    cursor-pointer transition-all p-4
                    ${selectedDeck?.name === deck.name
                      ? 'border-green-500 bg-green-500/10 ring-2 ring-green-500/30'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-bold">{deck.name}</div>
                      <div className="flex gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Swords size={12} className="text-red-400" /> {deckStats(deck).creatures}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap size={12} className="text-purple-400" /> {deckStats(deck).spells}
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield size={12} className="text-orange-400" /> {deckStats(deck).areas}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline">{deckStats(deck).total} cards</Badge>
                  </div>
                  
                  {/* Card Preview */}
                  {selectedDeck?.name === deck.name && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                      {deck.cards.slice(0, 8).map((card, i) => (
                        <div key={i} className="w-12 h-16 bg-slate-700 rounded flex-shrink-0 flex items-center justify-center">
                          <img 
                            src={getCardAsset(card.id).url} 
                            alt={card.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      ))}
                      {deck.cards.length > 8 && (
                        <div className="w-12 h-16 bg-slate-800 rounded flex-shrink-0 flex items-center justify-center text-xs text-slate-500">
                          +{deck.cards.length - 8}
                        </div>
                      )}
                    </div>
                  )}
                </CardUI>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
