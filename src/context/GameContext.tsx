"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GameEngine } from '@/engine/GameEngine';
import { GameState } from '@/types/game';
import { SimpleAI } from '@/engine/ai/SimpleAI';

interface GameContextType {
  gameState: GameState | null;
  gameEngine: GameEngine | null;
  battleLog: string[];
  selectedCardId: string | null;
  targetingMode: 'attack' | 'ability' | null;
  setSelectedCardId: (id: string | null) => void;
  setTargetingMode: (mode: 'attack' | 'ability' | null) => void;
  startGame: (p1: string, p2: string) => void;
  endGame: () => void;
  nextPhase: () => void;
  playCard: (cardId: string) => void;
  resolveCombat: (attackerId: string, defenderId?: string) => void;
  switchPosition: (cardId: string) => void;
  aiTurn: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [targetingMode, setTargetingMode] = useState<'attack' | 'ability' | null>(null);
  const [aiTrigger, setAiTrigger] = useState<number>(0);

  const updateState = useCallback((engine: GameEngine) => {
    const newState = engine.getGameState();
    setGameState(newState);
    setBattleLog([...engine.getBattleLog()]);
    // Trigger AI if it's not the player's turn and there's no winner
    if (newState.currentPlayer === 1 && !newState.winner) {
      setAiTrigger(prev => prev + 1);
    }
  }, []);

  const startGame = useCallback((p1: string, p2: string) => {
    const engine = GameEngine.createNewGame(p1, p2);
    // createNewGame already initializes decks and draws initial hands
    // First set gameEngine, THEN call updateState
    setGameEngine(engine);
    // Small delay to ensure gameEngine is set before updateState triggers AI
    setTimeout(() => {
      updateState(engine);
    }, 50);
  }, [updateState]);

  const nextPhase = useCallback(() => {
    if (gameEngine) {
      gameEngine.nextPhase();
      updateState(gameEngine);
    }
  }, [gameEngine, updateState]);

  const aiTurn = useCallback(() => {
    if (gameEngine) {
      const ai = new SimpleAI(gameEngine);
      const finalState = ai.makeMove();
      if (finalState) {
        updateState(gameEngine);
      }
    }
  }, [gameEngine, updateState]);

  // AI turn trigger effect
  useEffect(() => {
    if (aiTrigger > 0 && gameEngine && gameState && gameState.currentPlayer === 1 && !gameState.winner) {
      const ai = new SimpleAI(gameEngine);
      const finalState = ai.makeMove();
      if (finalState) {
        updateState(gameEngine);
      }
    }
  }, [aiTrigger, gameEngine, gameState, updateState]);

  const playCard = useCallback((cardId: string): boolean => {
    if (gameEngine && gameState) {
      const player = gameEngine.getCurrentPlayer();
      if (gameEngine.playCard(player.getId(), cardId)) {
        updateState(gameEngine);
        return true;
      }
    }
    return false;
  }, [gameEngine, gameState, updateState]);

  const resolveCombat = useCallback((attackerId: string, defenderId?: string) => {
    if (gameEngine) {
      gameEngine.resolveCombat(attackerId, defenderId);
      updateState(gameEngine);
      setSelectedCardId(null);
      setTargetingMode(null);
    }
  }, [gameEngine, updateState]);

  const switchPosition = useCallback((cardId: string) => {
    if (gameEngine && gameState) {
      const player = gameEngine.getCurrentPlayer();
      if (gameEngine.switchPosition(player.getId(), cardId)) {
        updateState(gameEngine);
      }
    }
  }, [gameEngine, gameState, updateState]);

  const endGame = useCallback(() => {
    setGameEngine(null);
    setGameState(null);
    setBattleLog([]);
    setSelectedCardId(null);
    setTargetingMode(null);
  }, []);

  return (
    <GameContext.Provider value={{
      gameState,
      gameEngine,
      battleLog,
      selectedCardId,
      targetingMode,
      setSelectedCardId,
      setTargetingMode,
      startGame,
      endGame,
      nextPhase,
      playCard,
      resolveCombat,
      switchPosition,
      aiTurn
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
