"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GameEngine } from '@/engine/GameEngine';
import { GameState } from '@/types/game';
import { SimpleAI } from '@/engine/ai/SimpleAI';

interface GameContextType {
  gameState: GameState | null;
  battleLog: string[];
  startGame: (p1: string, p2: string) => void;
  endGame: () => void;
  nextPhase: () => void;
  playCard: (cardId: string) => boolean;
  resolveCombat: (attackerId: string, defenderId?: string) => void;
  switchPosition: (cardId: string) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [aiTrigger, setAiTrigger] = useState<number>(0);

  const updateState = useCallback((engine: GameEngine) => {
    const newState = engine.getGameState();
    setGameState(newState);
    setBattleLog([...engine.getBattleLog()]);
    if (newState.currentPlayer === 1 && !newState.winner) {
      setAiTrigger((prev) => prev + 1);
    }
  }, []);

  const startGame = useCallback((p1: string, p2: string) => {
    const engine = GameEngine.createNewGame(p1, p2);
    setGameEngine(engine);
    setTimeout(() => {
      updateState(engine);
    }, 50);
  }, [updateState]);

  const nextPhase = useCallback(() => {
    if (!gameEngine) {
      return;
    }
    gameEngine.nextPhase();
    updateState(gameEngine);
  }, [gameEngine, updateState]);

  useEffect(() => {
    if (aiTrigger <= 0 || !gameEngine || !gameState || gameState.currentPlayer !== 1 || gameState.winner) {
      return;
    }

    const ai = new SimpleAI(gameEngine);
    const finalState = ai.makeMove();
    if (finalState) {
      updateState(gameEngine);
    }
  }, [aiTrigger, gameEngine, gameState, updateState]);

  const playCard = useCallback((cardId: string): boolean => {
    if (!gameEngine || !gameState) {
      return false;
    }
    const player = gameEngine.getCurrentPlayer();
    if (!gameEngine.playCard(player.getId(), cardId)) {
      return false;
    }

    updateState(gameEngine);
    return true;
  }, [gameEngine, gameState, updateState]);

  const resolveCombat = useCallback((attackerId: string, defenderId?: string) => {
    if (!gameEngine) {
      return;
    }
    gameEngine.resolveCombat(attackerId, defenderId);
    updateState(gameEngine);
  }, [gameEngine, updateState]);

  const switchPosition = useCallback((cardId: string): boolean => {
    if (!gameEngine || !gameState) {
      return false;
    }
    const player = gameEngine.getCurrentPlayer();
    if (!gameEngine.switchPosition(player.getId(), cardId)) {
      return false;
    }

    updateState(gameEngine);
    return true;
  }, [gameEngine, gameState, updateState]);

  const endGame = useCallback(() => {
    setGameEngine(null);
    setGameState(null);
    setBattleLog([]);
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        battleLog,
        startGame,
        endGame,
        nextPhase,
        playCard,
        resolveCombat,
        switchPosition,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
