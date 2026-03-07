"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Card as CardUI } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGame } from '@/context/GameContext';
import { CardInstance } from '@/types/game';
import { Swords, Shield, Zap, ArrowRight, Trophy, Skull, Flame, Home, Sparkles, Waves } from 'lucide-react';
import { getCardAsset, getCardBackground } from '@/data/assets';

// Animation types
interface BattleAnimation {
  type: 'attack' | 'play' | 'damage' | 'death';
  from?: string;
  to?: string;
  cardId?: string;
}

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
    switchPosition,
    endGame,
    gameEngine
  } = useGame();

  const [animations, setAnimations] = useState<BattleAnimation[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [battleLog]);

  // Auto-scroll to latest log
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [battleLog]);

  if (!gameState) return null;

  const player = gameState.players[0];
  const opponent = gameState.players[1];
  const isMyTurn = gameState && gameState.currentPlayer === 0;
  const winner = gameState.winner;

  // Get current active player info
  const currentPlayer = gameState.currentPlayer === 0 ? player : opponent;
  const activePlayer = isMyTurn ? player : opponent;

  const handleCardClick = (card: CardInstance, ownerId: string) => {
    if (!isMyTurn || winner) return;

    if (targetingMode === 'attack' && ownerId === opponent.id && card.type === 'creature') {
      if (selectedCardId) {
        // Add attack animation
        setAnimations([...animations, { type: 'attack', from: selectedCardId, to: card.instanceId }]);
        resolveCombat(selectedCardId, card.instanceId);
      }
      return;
    }

    if (selectedCardId === card.instanceId) {
      setSelectedCardId(null);
      setTargetingMode(null);
    } else {
      setSelectedCardId(card.instanceId);
    }
  };

  const handleDirectAttack = () => {
    if (selectedCardId && targetingMode === 'attack') {
      setAnimations([...animations, { type: 'attack', from: selectedCardId, to: 'opponent' }]);
      resolveCombat(selectedCardId);
    }
  };

  const handlePlayCard = (cardId: string) => {
    setAnimations([...animations, { type: 'play', cardId }]);
    playCard(cardId);
  };

  const renderFieldCard = (card: CardInstance, ownerId: string, isPlayer: boolean) => {
    const isSelected = selectedCardId === card.instanceId;
    const canBeTargeted = targetingMode === 'attack' && ownerId === opponent.id && card.type === 'creature';
    const isExhausted = card.oncePerTurnUsed;
    const asset = getCardAsset(card.id, card.variant);
    const bgColor = getCardBackground(card.id, card.rarity || 'C');
    
    return (
      <CardUI 
        key={card.instanceId}
        className={`
          relative w-28 h-40 cursor-pointer transition-all duration-300 border-2 shrink-0
          ${isSelected ? 'border-yellow-400 scale-110 z-20 shadow-2xl shadow-yellow-500/40 ring-4 ring-yellow-400/30' : ''}
          ${canBeTargeted ? 'border-red-500 animate-pulse ring-4 ring-red-500/50' : 'border-slate-700'}
          ${isExhausted ? 'opacity-50 grayscale' : ''}
          overflow-hidden group hover:scale-105
        `}
        style={{ background: `linear-gradient(to bottom, ${bgColor}dd, ${bgColor}99)` }}
        onClick={() => handleCardClick(card, ownerId)}
      >
        {/* Card Image */}
        <div className="absolute inset-0">
          <img 
            src={asset.url} 
            alt={card.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Cost Badge */}
        <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
          {card.cost}
        </div>
        
        {/* Card Info */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
          <div className="text-[10px] font-bold text-white truncate mb-1">{card.name}</div>
          
          {card.type === 'creature' && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-red-400 font-bold text-xs">
                <Swords size={10} /> {card.currentAttack || card.attack}
              </div>
              <div className="flex items-center gap-1 text-blue-400 font-bold text-xs">
                <Shield size={10} /> {card.currentHealth || card.defense}
              </div>
            </div>
          )}
        </div>
        
        {/* Exhausted Overlay */}
        {isExhausted && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-[8px] font-bold uppercase tracking-widest border border-white px-2 py-1 rotate-[-15deg]">
              Exhausted
            </span>
          </div>
        )}
      </CardUI>
    );
  };

  const renderHandCard = (card: CardInstance) => {
    const asset = getCardAsset(card.id, card.variant);
    const bgColor = getCardBackground(card.id, card.rarity || 'C');
    const canPlay = isMyTurn && card.cost <= player.energy && !winner;
    
    return (
      <CardUI 
        key={card.instanceId}
        className={`
          relative w-24 h-36 cursor-pointer transition-all duration-300 border-2 shrink-0
          ${selectedCardId === card.instanceId ? 'border-yellow-400 scale-110 z-20 shadow-2xl shadow-yellow-500/40' : 'border-slate-700 hover:border-slate-500 hover:scale-105'}
          ${!canPlay ? 'opacity-60' : ''}
          overflow-hidden
        `}
        style={{ background: `linear-gradient(to bottom, ${bgColor}dd, ${bgColor}99)` }}
        onClick={() => canPlay && setSelectedCardId(card.instanceId)}
      >
        <div className="absolute inset-0">
          <img 
            src={asset.url} 
            alt={card.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
          {card.cost}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black to-transparent">
          <div className="text-[8px] font-bold text-white truncate">{card.name}</div>
        </div>
      </CardUI>
    );
  };

  // Phase display helper
  const getPhaseDisplay = () => {
    const phases: Record<string, { name: string; color: string; icon: React.ReactNode }> = {
      start: { name: 'Start Phase', color: 'text-yellow-400', icon: <Sparkles size={14} /> },
      draw: { name: 'Draw Phase', color: 'text-blue-400', icon: <Zap size={14} /> },
      energy: { name: 'Energy Phase', color: 'text-cyan-400', icon: <Zap size={14} /> },
      standby: { name: 'Standby Phase', color: 'text-yellow-400', icon: <Sparkles size={14} /> },
      main1: { name: 'Main Phase 1', color: 'text-green-400', icon: <Swords size={14} /> },
      battle: { name: 'Battle Phase', color: 'text-red-400', icon: <Swords size={14} /> },
      main2: { name: 'Main Phase 2', color: 'text-purple-400', icon: <Sparkles size={14} /> },
      end: { name: 'End Phase', color: 'text-slate-400', icon: <Shield size={14} /> },
    };
    return phases[gameState.phase] || { name: gameState.phase, color: 'text-white', icon: null };
  };

  const phaseInfo = getPhaseDisplay();

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Game Over Overlay */}
      {winner && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-slate-700 p-12 rounded-3xl text-center max-w-lg w-full shadow-2xl">
            {winner === player.id ? (
              <>
                <Trophy className="mx-auto mb-6 text-yellow-500" size={100} />
                <h2 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  VICTORY
                </h2>
                <p className="text-slate-400 text-lg mb-8">You have defeated the cursed spirit!</p>
              </>
            ) : (
              <>
                <Skull className="mx-auto mb-6 text-red-500" size={100} />
                <h2 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">
                  DEFEAT
                </h2>
                <p className="text-slate-400 text-lg mb-8">The cursed spirit overpowered you...</p>
              </>
            )}
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-6 text-xl rounded-xl"
              onClick={endGame}
            >
              Return to Menu
            </Button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="h-14 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 flex items-center justify-between px-6">
        {/* Opponent Info */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white" onClick={endGame}>
            <Home size={18} />
          </Button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center border-2 border-red-500 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=opponent" alt="AI" />
          </div>
          <div>
            <div className="text-sm font-bold">{opponent.name}</div>
            <div className="flex gap-1.5">
              <Badge className="bg-red-900/80 text-red-300 border-red-700 text-[10px] px-1.5">
                ♥ {opponent.life}
              </Badge>
              <Badge className="bg-blue-900/80 text-blue-300 border-blue-700 text-[10px] px-1.5">
                ⚡ {opponent.energy}
              </Badge>
            </div>
          </div>
        </div>

        {/* Center Info */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Turn</div>
            <div className="text-2xl font-black text-white">{gameState.turn}</div>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border ${phaseInfo.color.replace('text-', 'border-')}/30`}>
            {phaseInfo.icon}
            <span className={`font-bold ${phaseInfo.color}`}>{phaseInfo.name}</span>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          {!isMyTurn && !winner && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-900/50 border border-red-700 animate-pulse">
              <span className="text-red-400 text-xs font-bold uppercase">AI Thinking...</span>
            </div>
          )}
          {isMyTurn && (
            <Button 
              onClick={(e) => {
                console.log('END PHASE button onClick fired! Phase:', gameState?.phase);
                // Use the native click to ensure it fires
                e.stopPropagation();
                // Direct call without setTimeout
                nextPhase();
              }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-500/25"
            >
              End Phase <ArrowRight size={16} className="ml-2" />
            </Button>
          )}
        </div>

        {/* Player Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-bold">{player.name}</div>
            <div className="flex gap-1.5 justify-end">
              <Badge className="bg-red-900/80 text-red-300 border-red-700 text-[10px] px-1.5">
                ♥ {player.life}
              </Badge>
              <Badge className="bg-blue-900/80 text-blue-300 border-blue-700 text-[10px] px-1.5">
                ⚡ {player.energy}/10
              </Badge>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center border-2 border-blue-500 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=player" alt="Player" />
          </div>
        </div>
      </div>

      {/* Main Battle Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Battle Log */}
        <div className="w-56 bg-slate-900/80 border-r border-slate-800 flex flex-col">
          <div className="p-3 border-b border-slate-800 text-xs font-bold uppercase tracking-tighter text-slate-500 flex items-center gap-2">
            <Waves size={12} /> Battle Log
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-[10px] font-mono">
            {battleLog.slice(-50).map((log, i) => (
              <div key={i} className="text-slate-500 border-l-2 border-slate-700 pl-2 py-0.5">
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        {/* The Field */}
        <div className="flex-1 relative flex flex-col">
          {/* Opponent Field (Top) */}
          <div className="flex-1 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-4 flex flex-col items-center justify-center relative">
            {/* Field Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at center, #4f46e5 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }} />
            
            {/* Opponent Label */}
            <div className="absolute top-2 left-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
              Opponent Field
            </div>
            
            {/* Opponent Hand (hidden, shown as card backs) */}
            <div className="absolute top-2 right-4 flex -space-x-2">
              {opponent.hand.slice(0, 3).map((_, i) => (
                <div key={i} className="w-12 h-16 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 transform rotate-3" />
              ))}
              {opponent.hand.length > 3 && (
                <div className="w-12 h-16 rounded-lg bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
                  +{opponent.hand.length - 3}
                </div>
              )}
            </div>

            {/* Opponent Cards */}
            <div className="flex gap-2 min-h-[160px] items-center justify-center">
              {opponent.field.length === 0 ? (
                <div className="text-slate-600 text-sm italic">No cards on field</div>
              ) : (
                opponent.field.map(card => renderFieldCard(card, opponent.id, false))
              )}
            </div>

            {/* Direct Attack Button */}
            {targetingMode === 'attack' && player.field.some(c => !c.oncePerTurnUsed) && (
              <Button 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-500 animate-bounce font-bold shadow-xl shadow-red-500/50 z-30"
                onClick={handleDirectAttack}
              >
                Attack Player! <Swords size={16} className="ml-2" />
              </Button>
            )}
          </div>

          {/* Divider */}
          <div className="h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          {/* Player Field (Bottom) */}
          <div className="flex-1 bg-gradient-to-t from-slate-900 via-slate-950 to-slate-900 p-4 flex flex-col items-center justify-center relative">
            {/* Player Label */}
            <div className="absolute bottom-2 left-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
              Your Field
            </div>

            {/* Player Cards */}
            <div className="flex gap-2 min-h-[160px] items-center justify-center">
              {player.field.length === 0 ? (
                <div className="text-slate-600 text-sm italic">No cards on field</div>
              ) : (
                player.field.map(card => renderFieldCard(card, player.id, true))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Actions */}
        <div className="w-64 bg-slate-900/80 border-l border-slate-800 p-4 flex flex-col">
          {/* Selected Card */}
          <div className="text-xs font-bold uppercase tracking-tighter text-slate-500 mb-3">Selected Card</div>
          
          {selectedCardId ? (
            <div className="space-y-3">
              {(() => {
                const card = [...player.hand, ...player.field, ...opponent.field].find(c => c.instanceId === selectedCardId);
                if (!card) return null;
                const asset = getCardAsset(card.id, card.variant);
                const bgColor = getCardBackground(card.id, card.rarity || 'C');
                return (
                  <div className="rounded-lg overflow-hidden border border-slate-700" style={{ background: `linear-gradient(to bottom, ${bgColor}dd, ${bgColor}99)` }}>
                    <img src={asset.url} alt={card.name} className="w-full h-32 object-cover" />
                    <div className="p-3">
                      <div className="font-bold text-purple-400 mb-1">{card.name}</div>
                      <div className="text-[10px] text-slate-400 leading-relaxed mb-2">{card.effect}</div>
                      {card.type === 'creature' && (
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-red-400">⚔ {card.attack}</span>
                          <span className="text-blue-400">🛡 {card.defense}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              {(gameState.phase === 'main1' || gameState.phase === 'main2') && (
                <>
                  {player.hand.find(c => c.instanceId === selectedCardId) && (
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-500 font-bold" 
                      onClick={() => handlePlayCard(selectedCardId)}
                      disabled={player.hand.find(c => c.instanceId === selectedCardId)!.cost > player.energy}
                    >
                      <Zap size={14} className="mr-2" /> Play Card
                    </Button>
                  )}
                  {player.field.find(c => c.instanceId === selectedCardId) && (
                    <>
                      <Button className="w-full bg-slate-700 hover:bg-slate-600 font-bold" onClick={() => switchPosition(selectedCardId)}>
                        Switch Position
                      </Button>
                    </>
                  )}
                </>
              )}
              
              {gameState.phase === 'battle' && player.field.find(c => c.instanceId === selectedCardId) && (
                <Button 
                  className={`w-full font-bold ${targetingMode === 'attack' ? 'bg-red-700' : 'bg-red-600 hover:bg-red-500'}`}
                  onClick={() => setTargetingMode(targetingMode === 'attack' ? null : 'attack')}
                  disabled={player.field.find(c => c.instanceId === selectedCardId)!.oncePerTurnUsed}
                >
                  <Swords size={14} className="mr-2" />
                  {targetingMode === 'attack' ? 'Cancel Attack' : 'Declare Attack'}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-600 italic py-8 text-center">
              Select a card to see actions
            </div>
          )}

          {/* Cursed Energy */}
          <div className="mt-auto pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-500">Cursed Energy</span>
              <span className="text-sm font-black text-orange-400">{player.ultimateEnergy}/5</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500" 
                style={{ width: `${(player.ultimateEnergy / 5) * 100}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Player Hand */}
      <div className="h-44 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-slate-700 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Hand</span>
          <span className="text-xs text-slate-500">{player.hand.length} cards</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-3 overflow-x-auto px-4">
          {player.hand.map(card => renderHandCard(card))}
          {player.hand.length === 0 && (
            <div className="text-slate-600 text-sm italic">No cards in hand</div>
          )}
        </div>
        
        {/* Play Selected Card Button */}
        {selectedCardId && player.hand.find(c => c.instanceId === selectedCardId) && (
          <div className="absolute bottom-48 left-1/2 -translate-x-1/2">
            <Button 
              className="bg-blue-600 hover:bg-blue-500 font-bold shadow-xl"
              onClick={() => handlePlayCard(selectedCardId)}
              disabled={player.hand.find(c => c.instanceId === selectedCardId)!.cost > player.energy}
            >
              Play {player.hand.find(c => c.instanceId === selectedCardId)?.name}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
