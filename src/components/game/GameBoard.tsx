"use client";

import React, { useEffect, useRef } from 'react';
import { Card as CardUI } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGame } from '@/context/GameContext';
import { CardInstance } from '@/types/game';
import { Swords, Shield, Zap, ArrowRight } from 'lucide-react';

export const GameBoard: React.FC = () => {
  const { 
    gameState, 
    battleLog, 
    selectedCardId, 
    targetingMode,
    setSelectedCardId, 
    setTargetingMode,
    nextPhase, 
    playCard, 
    resolveCombat, 
    switchPosition 
  } = useGame();

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [battleLog]);

  if (!gameState) return null;

  const currentPlayer = gameState.players[gameState.currentPlayer];
  const opponent = gameState.players[gameState.currentPlayer === 0 ? 1 : 0];
  const isMyTurn = gameState.currentPlayer === 0;

  const handleCardClick = (card: CardInstance, ownerId: string) => {
    if (!isMyTurn) return;

    // If we are in targeting mode and click an opponent's creature
    if (targetingMode === 'attack' && ownerId === opponent.id && card.type === 'creature') {
      if (selectedCardId) {
        resolveCombat(selectedCardId, card.instanceId);
      }
      return;
    }

    // Select/Deselect
    if (selectedCardId === card.instanceId) {
      setSelectedCardId(null);
      setTargetingMode(null);
    } else {
      setSelectedCardId(card.instanceId);
    }
  };

  const handleDirectAttack = () => {
    if (selectedCardId && targetingMode === 'attack') {
      resolveCombat(selectedCardId);
    }
  };

  const renderCard = (card: CardInstance, ownerId: string, location: string) => {
    const isSelected = selectedCardId === card.instanceId;
    const canBeTargeted = targetingMode === 'attack' && ownerId === opponent.id && card.type === 'creature';
    
    return (
      <CardUI 
        key={card.instanceId}
        className={`relative w-32 h-48 cursor-pointer transition-all duration-200 border-2 ${
          isSelected ? 'border-yellow-400 scale-105 z-10 shadow-lg shadow-yellow-400/20' : 
          canBeTargeted ? 'border-red-500 animate-pulse' : 'border-slate-800'
        } bg-slate-900 overflow-hidden group`}
        onClick={() => handleCardClick(card, ownerId)}
      >
        <div className="p-2 h-full flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold truncate pr-1">{card.name}</span>
            <Badge className="h-3 px-1 text-[8px] bg-purple-600">{card.rarity}</Badge>
          </div>
          
          <div className="flex-1 bg-slate-800 rounded mb-1 flex items-center justify-center overflow-hidden">
             <Zap size={24} className="text-slate-700" />
          </div>

          {card.type === 'creature' && (
            <div className="flex justify-between items-center text-[10px] font-bold bg-slate-800 p-1 rounded">
              <div className="flex items-center text-red-400">
                <Swords size={10} className="mr-1" /> {card.currentAttack || card.attack}
              </div>
              <div className="flex items-center text-blue-400">
                <Shield size={10} className="mr-1" /> {card.currentHealth || card.defense}
              </div>
            </div>
          )}

          <div className="mt-1 text-[8px] text-slate-400 line-clamp-2">
            {card.effect}
          </div>
        </div>
      </CardUI>
    );
  };

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Top Bar: Opponent Info */}
      <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-900 flex items-center justify-center border border-red-700">
            <span className="font-bold">AI</span>
          </div>
          <div>
            <div className="text-sm font-bold">{opponent.name}</div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-red-400 border-red-900">LP: {opponent.life}</Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-900">E: {opponent.energy}</Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Phase</div>
            <div className="text-sm font-black text-purple-400 uppercase">{gameState.phase}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Turn</div>
            <div className="text-sm font-black">{gameState.turn}</div>
          </div>
        </div>

        <Button 
          disabled={!isMyTurn} 
          onClick={nextPhase}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
        >
          Next Phase <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>

      {/* Main Play Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Battle Log */}
        <div className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col">
          <div className="p-3 border-b border-slate-800 text-xs font-bold uppercase tracking-tighter text-slate-500">Battle Log</div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-[11px] font-mono">
            {battleLog.map((log, i) => (
              <div key={i} className="text-slate-400 border-l border-slate-700 pl-2 py-1">
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        {/* Center: The Board */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-8 gap-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
          {/* Opponent Field */}
          <div className="flex gap-4 min-h-[200px] items-end">
            {opponent.field.map(card => renderCard(card, opponent.id, 'field'))}
          </div>

          {/* Divider / Action Area */}
          <div className="w-full h-px bg-slate-800 relative">
            {targetingMode === 'attack' && (
              <Button 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-500 animate-bounce"
                onClick={handleDirectAttack}
              >
                Attack Player Directly
              </Button>
            )}
          </div>

          {/* Player Field */}
          <div className="flex gap-4 min-h-[200px] items-start">
            {currentPlayer.field.map(card => renderCard(card, currentPlayer.id, 'field'))}
          </div>
        </div>

        {/* Right: Selected Card Actions */}
        <div className="w-64 bg-slate-900/50 border-l border-slate-800 p-4">
          <div className="text-xs font-bold uppercase tracking-tighter text-slate-500 mb-4">Actions</div>
          {selectedCardId ? (
            <div className="space-y-3">
              {gameState.phase === 'main1' || gameState.phase === 'main2' ? (
                <>
                  {currentPlayer.hand.find(c => c.instanceId === selectedCardId) && (
                    <Button className="w-full bg-blue-600" onClick={() => playCard(selectedCardId)}>Play Card</Button>
                  )}
                  {currentPlayer.field.find(c => c.instanceId === selectedCardId) && (
                    <Button className="w-full variant-outline" onClick={() => switchPosition(selectedCardId)}>Switch Row</Button>
                  )}
                </>
              ) : null}
              
              {gameState.phase === 'battle' && currentPlayer.field.find(c => c.instanceId === selectedCardId) && (
                <Button 
                  className={`w-full ${targetingMode === 'attack' ? 'bg-red-700' : 'bg-red-600'}`}
                  onClick={() => setTargetingMode(targetingMode === 'attack' ? null : 'attack')}
                >
                  {targetingMode === 'attack' ? 'Cancel Attack' : 'Declare Attack'}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-600 italic">Select a card to see actions</div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Player Hand */}
      <div className="h-56 bg-slate-900 border-t border-slate-800 p-4 flex items-center justify-center gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
          {currentPlayer.hand.map(card => renderCard(card, currentPlayer.id, 'hand'))}
        </div>
      </div>
    </div>
  );
};