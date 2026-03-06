"use client";

import React, { useState, useEffect } from 'react';
import { Card as CardComponent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameEngine } from '@/engine/GameEngine';
import { GameState, CardInstance } from '@/types/game';

interface GameBoardProps {
  gameId: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameId }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);

  useEffect(() => {
    // Initialize game engine
    const engine = GameEngine.createNewGame('Player 1', 'Player 2');
    setGameEngine(engine);
    
    // Start the game
    engine.startGame();
    updateGameState(engine);
  }, []);

  const updateGameState = (engine: GameEngine) => {
    setGameState(engine.getGameState());
    setBattleLog(engine.getBattleLog());
  };

  const handleNextPhase = () => {
    if (gameEngine) {
      gameEngine.nextPhase();
      updateGameState(gameEngine);
    }
  };

  const handlePlayCard = (cardId: string) => {
    if (gameEngine && gameState) {
      const currentPlayer = gameEngine.getCurrentPlayer();
      const success = gameEngine.playCard(currentPlayer.getId(), cardId);
      if (success) {
        updateGameState(gameEngine);
      }
    }
  };

  const handleUseUltimate = (cardId: string) => {
    if (gameEngine && gameState) {
      const currentPlayer = gameEngine.getCurrentPlayer();
      const success = gameEngine.useUltimate(currentPlayer.getId(), cardId);
      if (success) {
        updateGameState(gameEngine);
      }
    }
  };

  const handleSwitchPosition = (cardId: string) => {
    if (gameEngine && gameState) {
      const currentPlayer = gameEngine.getCurrentPlayer();
      const success = gameEngine.switchPosition(currentPlayer.getId(), cardId);
      if (success) {
        updateGameState(gameEngine);
      }
    }
  };

  const handleAttack = (attackerInstanceId: string, defenderInstanceId?: string) => {
    if (gameEngine) {
      const result = gameEngine.resolveCombat(attackerInstanceId, defenderInstanceId);
      if (result) {
        updateGameState(gameEngine);
      }
    }
  };

  const renderCard = (card: CardInstance, location: 'hand' | 'field' | 'graveyard') => {
    const isPlayable = location === 'hand' && gameState?.currentPlayer === 0;
    const isOnField = location === 'field';
    
    return (
      <CardComponent 
        key={card.instanceId}
        className={`cursor-pointer transition-all hover:scale-105 ${
          selectedCard === card.instanceId ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => setSelectedCard(card.instanceId)}
      >
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">{card.name}</h3>
            <Badge variant={card.rarity === 'SSR' ? 'default' : 'secondary'}>
              {card.rarity}
            </Badge>
          </div>
          
          {card.variant && (
            <p className="text-sm text-gray-600 mb-2">{card.variant}</p>
          )}
          
          {card.type === 'creature' && (
            <div className="flex justify-between text-sm mb-2">
              <span>ATK: {card.currentAttack || card.attack}</span>
              <span>DEF: {card.currentDefense || card.defense}</span>
            </div>
          )}
          
          <div className="text-xs text-gray-500 mb-2">
            Cost: {card.cost}
            {card.ultimateCost && ` | Ultimate: ${card.ultimateCost}`}
          </div>
          
          {card.faction && (
            <Badge variant="outline" className="mb-2">
              {card.faction}
            </Badge>
          )}
          
          {card.position && (
            <Badge variant="outline" className="mb-2">
              {card.position} Row
            </Badge>
          )}
          
          {card.status && card.status.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.status.map((status, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {status}
                </Badge>
              ))}
            </div>
          )}
          
          {isPlayable && (
            <div className="flex gap-2 mt-2">
              <Button 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayCard(card.id);
                }}
              >
                Play
              </Button>
              {card.ultimateEffect && (
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseUltimate(card.id);
                  }}
                >
                  Ultimate
                </Button>
              )}
            </div>
          )}
          
          {isOnField && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleSwitchPosition(card.instanceId);
              }}
            >
              Switch Position
            </Button>
          )}
        </div>
      </CardComponent>
    );
  };

  if (!gameState) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Game...</h2>
          <p>Initializing game engine and cards</p>
        </div>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayer];
  const opponent = gameState.players[gameState.currentPlayer === 0 ? 1 : 0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Jujutsu Kaisen Card Game</h1>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-300">Turn</div>
              <div className="text-xl font-bold">{gameState.turn}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-300">Phase</div>
              <div className="text-xl font-bold capitalize">{gameState.phase}</div>
            </div>
            <Button onClick={handleNextPhase}>
              Next Phase
            </Button>
          </div>
        </div>

        {/* Player Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Opponent */}
          <div className={`bg-gray-800 rounded-lg p-4 ${
            gameState.currentPlayer === 1 ? 'ring-2 ring-yellow-500' : ''
          }`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{opponent.name}</h3>
              <div className="text-right">
                <div className="text-sm text-gray-300">LP</div>
                <div className="text-xl font-bold text-red-400">{opponent.life}</div>
              </div>
            </div>
            <div className="text-sm text-gray-300 mb-2">
              Energy: {opponent.energy} | Ultimate: {opponent.ultimateEnergy}
            </div>
          </div>

          {/* Current Player */}
          <div className={`bg-gray-800 rounded-lg p-4 ${
            gameState.currentPlayer === 0 ? 'ring-2 ring-yellow-500' : ''
          }`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{currentPlayer.name}</h3>
              <div className="text-right">
                <div className="text-sm text-gray-300">LP</div>
                <div className="text-xl font-bold text-red-400">{currentPlayer.life}</div>
              </div>
            </div>
            <div className="text-sm text-gray-300 mb-2">
              Energy: {currentPlayer.energy} | Ultimate: {currentPlayer.ultimateEnergy}
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Opponent Field */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-bold mb-2">Opponent Field</h3>
            <div className="grid grid-cols-2 gap-2">
              {opponent.field.map(card => renderCard(card, 'field'))}
            </div>
          </div>

          {/* Center Area */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-bold mb-2">Battle Area</h3>
            <div className="text-center text-gray-400">
              <p>Game mechanics will be displayed here</p>
              <p className="text-sm mt-2">Selected: {selectedCard || 'None'}</p>
            </div>
          </div>

          {/* Current Player Field */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-bold mb-2">Your Field</h3>
            <div className="grid grid-cols-2 gap-2">
              {currentPlayer.field.map(card => renderCard(card, 'field'))}
            </div>
          </div>
        </div>

        {/* Hand and Graveyard */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current Player Hand */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-bold mb-2">Your Hand</h3>
            <div className="flex flex-wrap gap-2">
              {currentPlayer.hand.map(card => renderCard(card, 'hand'))}
            </div>
          </div>

          {/* Graveyard */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-bold mb-2">Graveyard</h3>
            <div className="flex flex-wrap gap-2">
              {currentPlayer.graveyard.map(card => renderCard(card, 'graveyard'))}
            </div>
          </div>
        </div>

        {/* Battle Log */}
        <div className="bg-gray-800 rounded-lg p-4 mt-6">
          <h3 className="font-bold mb-2">Battle Log</h3>
          <div className="h-32 overflow-y-auto text-sm">
            {battleLog.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};